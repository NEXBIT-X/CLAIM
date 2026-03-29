const path = require('path');
const fs = require('fs');
const os = require('os');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { spawn } = require('child_process');
const { Server } = require('socket.io');
const { createProxyMiddleware } = require('http-proxy-middleware');

const ActivityFeed = require('./server/modules/activityFeed');
const LockService = require('./server/modules/lockService');
const {
  readTree,
  readFileContent,
  writeFileContent,
  countLineDelta,
  fileExists,
  ensureInsideRoot
} = require('./server/modules/fileService');
const {
  commitAndMaybePush,
  ensureRepository,
  listRepoInfo,
  connectRemote
} = require('./server/modules/gitService');
const { createMdnsService, getLanIp } = require('./server/modules/mdnsService');

const REQUESTED_PORT = Number(process.env.PORT || 8080);
const HOST = '0.0.0.0';
const WORKSPACE_ROOT = path.resolve(process.env.LAN_SYNC_ROOT || process.cwd());
const MAX_PORT_SCAN_ATTEMPTS = 20;

let activePort = REQUESTED_PORT;
let mdns = null;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
    allowEIO3: true
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
  maxHttpBufferSize: 1e6
});

const users = new Map();
const lockService = new LockService();
const feed = new ActivityFeed();
const chatHistory = [];
const MAX_CHAT_MESSAGES = 120;
const latestFileContent = new Map();
const pendingFileWrites = new Map();
const fileEditors = new Map();
const lastPulseByEditor = new Map();
const lastEditOperationBySocket = new Map();
const SAVE_DEBOUNCE_MS = 180;

const DEFAULT_SYNTAX_PLUGINS = [
  { id: 'javascript', language: 'javascript', extensions: ['js', 'cjs', 'mjs'] },
  { id: 'typescript', language: 'typescript', extensions: ['ts', 'tsx'] },
  { id: 'react-jsx', language: 'javascript', extensions: ['jsx'] },
  { id: 'json', language: 'json', extensions: ['json'] },
  { id: 'markdown', language: 'markdown', extensions: ['md'] },
  { id: 'python', language: 'python', extensions: ['py'] },
  { id: 'go', language: 'go', extensions: ['go'] },
  { id: 'rust', language: 'rust', extensions: ['rs'] },
  { id: 'java', language: 'java', extensions: ['java'] },
  { id: 'yaml', language: 'yaml', extensions: ['yaml', 'yml'] },
  { id: 'html', language: 'html', extensions: ['html', 'htm'] },
  { id: 'css', language: 'css', extensions: ['css', 'scss'] },
  { id: 'shell', language: 'shell', extensions: ['sh', 'ps1'] }
];

const previewProxyByPort = new Map();
const RUN_TIMEOUT_MS = 20000;
const MAX_OUTPUT_CHARS = 32000;

app.use(cors());
app.use(express.json({ limit: '8mb' }));

function requireIdentity(req, res, next) {
  const bodyIdentity = req.body?.identity || {};
  const headerUsername = req.header('x-lan-sync-username');
  const headerEmail = req.header('x-lan-sync-email');

  const username = `${bodyIdentity.username || headerUsername || ''}`.trim();
  const email = `${bodyIdentity.email || headerEmail || ''}`.trim();

  if (!username || !email || !email.includes('@')) {
    res.status(400).json({ error: 'A valid username and email are required for git transactions.' });
    return;
  }

  req.gitIdentity = { username, email };
  next();
}

function normalizeRole(requestedRole, isFirstUser) {
  if (isFirstUser) {
    return 'owner';
  }

  if (requestedRole === 'viewer') {
    return 'viewer';
  }

  return 'editor';
}

function canEdit(role) {
  return role === 'owner' || role === 'editor';
}

function requireSocketRole(allowedRoles) {
  return (req, res, next) => {
    const socketId = `${req.header('x-lan-sync-socket-id') || req.body?.socketId || ''}`.trim();
    if (!socketId) {
      res.status(401).json({ error: 'x-lan-sync-socket-id is required for this action.' });
      return;
    }

    const user = users.get(socketId);
    if (!user) {
      res.status(401).json({ error: 'Session identity was not found for this socket.' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ error: `Role ${user.role} is not allowed for this action.` });
      return;
    }

    req.lanSyncUser = user;
    next();
  };
}

function toContributionMessage(username, filePath, lineDelta) {
  if (lineDelta > 0) {
    return `${username} added ${lineDelta} lines in ${filePath}.`;
  }
  if (lineDelta < 0) {
    return `${username} removed ${Math.abs(lineDelta)} lines in ${filePath}.`;
  }
  return `${username} updated ${filePath}.`;
}

function scheduleFilePersist(relativePath, content) {
  const existing = pendingFileWrites.get(relativePath);
  if (existing) {
    clearTimeout(existing);
  }

  const timer = setTimeout(async () => {
    try {
      await writeFileContent(WORKSPACE_ROOT, relativePath, content);
    } catch (error) {
      console.error(`[Persist] Failed to write ${relativePath}:`, error.message);
    } finally {
      pendingFileWrites.delete(relativePath);
    }
  }, SAVE_DEBOUNCE_MS);

  pendingFileWrites.set(relativePath, timer);
}

function recalculateEditingPresence() {
  const files = [];
  for (const [filePath, socketIds] of fileEditors.entries()) {
    const editors = [...socketIds]
      .map((socketId) => users.get(socketId))
      .filter(Boolean)
      .map((user) => ({
        socketId: user.socketId,
        username: user.username,
        color: user.color,
        role: user.role
      }));

    if (editors.length > 0) {
      files.push({ filePath, editors });
    }
  }

  io.emit('file:editing-presence', { files });
}

function setEditorActiveFile(socketId, filePath) {
  if (!filePath) {
    return;
  }

  for (const [currentPath, socketIds] of fileEditors.entries()) {
    if (socketIds.has(socketId)) {
      socketIds.delete(socketId);
      if (socketIds.size === 0) {
        fileEditors.delete(currentPath);
      }
    }
  }

  if (!fileEditors.has(filePath)) {
    fileEditors.set(filePath, new Set());
  }

  fileEditors.get(filePath).add(socketId);
  recalculateEditingPresence();
}

function clearEditorPresence(socketId) {
  let changed = false;
  for (const [filePath, socketIds] of fileEditors.entries()) {
    if (socketIds.delete(socketId)) {
      changed = true;
      if (socketIds.size === 0) {
        fileEditors.delete(filePath);
      }
    }
  }

  if (changed) {
    recalculateEditingPresence();
  }
}

function trimOutput(text) {
  const value = `${text || ''}`;
  if (value.length <= MAX_OUTPUT_CHARS) {
    return value;
  }

  return `${value.slice(0, MAX_OUTPUT_CHARS)}\n\n[output truncated]`;
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || WORKSPACE_ROOT,
      shell: false,
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, options.timeoutMs || RUN_TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (exitCode) => {
      clearTimeout(timeout);
      resolve({
        exitCode: Number.isInteger(exitCode) ? exitCode : 1,
        stdout: trimOutput(stdout),
        stderr: trimOutput(
          timedOut ? `${stderr}\nProcess timed out after ${options.timeoutMs || RUN_TIMEOUT_MS}ms.` : stderr
        )
      });
    });
  });
}

async function runCProgram(fullPath) {
  const extension = process.platform === 'win32' ? '.exe' : '';
  const outFile = path.join(os.tmpdir(), `delta-run-${Date.now()}-${process.pid}${extension}`);
  const compilers = ['gcc', 'clang'];

  let lastError = null;
  for (const compiler of compilers) {
    try {
      const compileResult = await runProcess(compiler, [fullPath, '-o', outFile], {
        timeoutMs: RUN_TIMEOUT_MS,
        cwd: WORKSPACE_ROOT
      });

      if (compileResult.exitCode !== 0) {
        return {
          command: `${compiler} ${path.basename(fullPath)} -o ${path.basename(outFile)}`,
          exitCode: compileResult.exitCode,
          stdout: compileResult.stdout,
          stderr: compileResult.stderr || 'Compilation failed.'
        };
      }

      const runResult = await runProcess(outFile, [], {
        timeoutMs: RUN_TIMEOUT_MS,
        cwd: WORKSPACE_ROOT
      });

      return {
        command: `${compiler} ${path.basename(fullPath)} && ${path.basename(outFile)}`,
        exitCode: runResult.exitCode,
        stdout: runResult.stdout,
        stderr: runResult.stderr
      };
    } catch (error) {
      lastError = error;
      if (error?.code !== 'ENOENT') {
        break;
      }
    } finally {
      if (fs.existsSync(outFile)) {
        fs.rmSync(outFile, { force: true });
      }
    }
  }

  throw new Error(
    lastError?.code === 'ENOENT'
      ? 'No C compiler found. Install gcc or clang to run .c files.'
      : lastError?.message || 'Failed to compile C program.'
  );
}

async function runSupportedFile(relativePath) {
  const fullPath = ensureInsideRoot(WORKSPACE_ROOT, relativePath);
  const extension = path.extname(relativePath).toLowerCase();

  if (!fileExists(WORKSPACE_ROOT, relativePath)) {
    throw new Error('The selected file does not exist.');
  }

  if (extension === '.js' || extension === '.cjs' || extension === '.mjs') {
    const result = await runProcess(process.execPath, [fullPath], { timeoutMs: RUN_TIMEOUT_MS });
    return {
      command: `node ${path.basename(relativePath)}`,
      ...result
    };
  }

  if (extension === '.py') {
    const result = await runProcess('python', [fullPath], { timeoutMs: RUN_TIMEOUT_MS });
    return {
      command: `python ${path.basename(relativePath)}`,
      ...result
    };
  }

  if (extension === '.c') {
    return runCProgram(fullPath);
  }

  throw new Error('Unsupported file type. Run supports .c, .js, .mjs, .cjs, and .py files.');
}

app.get('/api/health', (_, res) => {
  res.json({
    name: 'DELTA',
    host: getLanIp(),
    port: activePort,
    workspace: WORKSPACE_ROOT,
    activeUsers: users.size
  });
});

app.get('/api/socket-test', (_, res) => {
  res.json({ 
    status: 'Socket.IO server is accepting connections.',
    socketPort: activePort,
    transports: ['websocket', 'polling'],
    timestamp: Date.now()
  });
});

app.get('/api/discovery/sessions', (_, res) => {
  if (!mdns) {
    res.json({
      sessions: [
        {
          id: `LAN-Sync-${process.pid}`,
          name: 'LAN-Sync',
          address: getLanIp(),
          port: activePort,
          host: 'localhost',
          isSelf: true,
          lastSeen: Date.now()
        }
      ]
    });
    return;
  }

  res.json({ sessions: mdns.getSessions() });
});

app.get('/api/repo/info', async (_, res) => {
  try {
    const repo = await listRepoInfo(WORKSPACE_ROOT);
    res.json({ repo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/repo/connect', async (req, res) => {
  const remoteUrl = `${req.body?.remoteUrl || ''}`.trim();
  const remoteName = `${req.body?.remoteName || 'origin'}`.trim() || 'origin';

  try {
    await connectRemote({
      rootDir: WORKSPACE_ROOT,
      remoteName,
      remoteUrl
    });

    const repo = await listRepoInfo(WORKSPACE_ROOT);
    res.json({ ok: true, repo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/editor/syntax-plugins', (_, res) => {
  res.json({ plugins: DEFAULT_SYNTAX_PLUGINS });
});

app.get('/api/files/tree', async (_, res) => {
  try {
    const tree = await readTree(WORKSPACE_ROOT);
    res.json({ tree });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/content', async (req, res) => {
  const relativePath = `${req.query.path || ''}`;
  if (!relativePath) {
    res.status(400).json({ error: 'Query parameter path is required.' });
    return;
  }

  try {
    const content = await readFileContent(WORKSPACE_ROOT, relativePath);
    latestFileContent.set(relativePath, content);
    res.json({ path: relativePath, content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/raw', async (req, res) => {
  const relativePath = `${req.query.path || ''}`;
  if (!relativePath) {
    res.status(400).json({ error: 'Query parameter path is required.' });
    return;
  }

  try {
    const fullPath = ensureInsideRoot(WORKSPACE_ROOT, relativePath);
    res.sendFile(fullPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/files/content', requireSocketRole(['owner', 'editor']), async (req, res) => {
  const relativePath = `${req.body?.path || ''}`;
  const content = `${req.body?.content || ''}`;

  if (!relativePath) {
    res.status(400).json({ error: 'path is required.' });
    return;
  }

  try {
    await ensureInsideRoot(WORKSPACE_ROOT, relativePath);
    await writeFileContent(WORKSPACE_ROOT, relativePath, content);
    latestFileContent.set(relativePath, content);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/activity', (_, res) => {
  res.json({ items: feed.list(80) });
});

app.post('/api/git/commit-push', requireIdentity, requireSocketRole(['owner', 'editor']), async (req, res) => {
  const message = `${req.body?.message || 'DELTA collaborative commit'}`;
  const filePaths = Array.isArray(req.body?.filePaths) ? req.body.filePaths : [];
  const push = Boolean(req.body?.push);

  if (!filePaths.length) {
    res.status(400).json({ error: 'filePaths is required.' });
    return;
  }

  try {
    const result = await commitAndMaybePush({
      rootDir: WORKSPACE_ROOT,
      filePaths,
      message,
      identity: req.gitIdentity,
      shouldPush: push
    });

    const pulse = feed.push({
      type: 'git',
      message: `${req.gitIdentity.username} created commit ${result.oid.slice(0, 7)}${result.pushResult.pushed ? ' and pushed to origin.' : '.'}`
    });

    io.emit('contribution:pulse', pulse);

    res.json({ ok: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/run/active-file', requireSocketRole(['owner', 'editor', 'viewer']), async (req, res) => {
  const relativePath = `${req.body?.path || ''}`.trim();
  if (!relativePath) {
    res.status(400).json({ error: 'path is required.' });
    return;
  }

  try {
    const runResult = await runSupportedFile(relativePath);
    const payload = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      path: relativePath,
      runner: req.lanSyncUser?.username || 'Unknown',
      command: runResult.command,
      exitCode: runResult.exitCode,
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      createdAt: Date.now()
    };

    const pulse = feed.push({
      type: 'run',
      message: `${payload.runner} ran ${payload.path} (exit ${payload.exitCode}).`
    });

    io.emit('run:result', payload);
    io.emit('contribution:pulse', pulse);

    res.json({ ok: true, result: payload });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function getPreviewProxy(port) {
  if (!previewProxyByPort.has(port)) {
    previewProxyByPort.set(
      port,
      createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: 'silent',
        pathRewrite: (incomingPath) => incomingPath.replace(new RegExp(`^/preview/${port}`), '') || '/'
      })
    );
  }

  return previewProxyByPort.get(port);
}

app.use('/preview/:port', (req, res, next) => {
  const port = Number(req.params.port || 0);
  if (!port || port < 1 || port > 65535) {
    res.status(400).json({ error: 'Invalid preview port.' });
    return;
  }

  return getPreviewProxy(port)(req, res, next);
});

const distClientDir = path.join(WORKSPACE_ROOT, 'dist', 'client');
if (fs.existsSync(distClientDir)) {
  app.use(express.static(distClientDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io') || req.path.startsWith('/preview')) {
      return next();
    }
    res.sendFile(path.join(distClientDir, 'index.html'));
  });
}

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id} from ${socket.handshake.address}`);

  socket.on('join-session', ({ username, email, color, role: requestedRole }) => {
    const safeUsername = `${username || ''}`.trim() || `User-${socket.id.slice(0, 4)}`;
    const safeEmail = `${email || ''}`.trim();
    const assignedRole = normalizeRole(`${requestedRole || ''}`.trim(), users.size === 0);

    users.set(socket.id, {
      socketId: socket.id,
      username: safeUsername,
      email: safeEmail,
      color: color || '#39FF14',
      role: assignedRole
    });

    console.log(`[Socket.IO] ${safeUsername} joined session with role: ${assignedRole}`);
    io.emit('presence:update', { users: [...users.values()] });
    socket.emit('chat:history', { messages: chatHistory.slice(-80) });
    recalculateEditingPresence();
  });

  socket.on('editor:open-file', ({ filePath }) => {
    if (!filePath || !users.has(socket.id)) {
      return;
    }

    setEditorActiveFile(socket.id, filePath);
  });

  socket.on('chat:send', (payload) => {
    const user = users.get(socket.id);
    if (!user) {
      return;
    }

    const text = `${payload?.text || ''}`.trim();
    if (!text) {
      return;
    }

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      socketId: socket.id,
      username: user.username,
      color: user.color,
      text: text.slice(0, 500),
      createdAt: Date.now()
    };

    chatHistory.push(message);
    if (chatHistory.length > MAX_CHAT_MESSAGES) {
      chatHistory.shift();
    }

    io.emit('chat:message', message);
  });

  socket.on('editor:cursor', (payload) => {
    const user = users.get(socket.id);
    if (!user) {
      return;
    }

    socket.broadcast.emit('editor:cursor', {
      socketId: socket.id,
      username: user.username,
      color: user.color,
      filePath: payload.filePath,
      position: payload.position
    });
  });

  socket.on('editor:change', async (payload, ack) => {
    const respond = typeof ack === 'function' ? ack : () => {};
    const user = users.get(socket.id);
    if (!user || !payload?.filePath) {
      respond({ ok: false, error: 'Invalid edit payload.' });
      return;
    }

    if (!canEdit(user.role)) {
      socket.emit('editor:error', { filePath: payload.filePath, message: 'Your role is read-only.' });
      respond({ ok: false, error: 'Your role is read-only.' });
      return;
    }

    const filePath = payload.filePath;
    const nextContent = `${payload.content || ''}`;
    const operationId = `${payload.operationId || ''}`.trim();

    if (operationId) {
      const byFile = lastEditOperationBySocket.get(socket.id) || new Map();
      if (byFile.get(filePath) === operationId) {
        respond({ ok: true, duplicate: true });
        return;
      }
      byFile.set(filePath, operationId);
      lastEditOperationBySocket.set(socket.id, byFile);
    }

    setEditorActiveFile(socket.id, filePath);

    try {
      const oldContent = latestFileContent.get(filePath) || '';
      latestFileContent.set(filePath, nextContent);
      scheduleFilePersist(filePath, nextContent);

      const lineDelta = countLineDelta(oldContent, nextContent);
      const pulseKey = `${socket.id}:${filePath}`;
      const now = Date.now();
      let pulse = null;
      const lastPulseAt = lastPulseByEditor.get(pulseKey) || 0;

      if (now - lastPulseAt > 2500) {
        pulse = feed.push({
          type: 'edit',
          message: toContributionMessage(user.username, filePath, lineDelta),
          username: user.username,
          filePath,
          lineDelta
        });
        lastPulseByEditor.set(pulseKey, now);
      }

      io.emit('editor:sync', {
        filePath,
        content: nextContent,
        authorSocketId: socket.id,
        author: user
      });

      if (pulse) {
        io.emit('contribution:pulse', pulse);
      }

      respond({ ok: true });
    } catch (error) {
      socket.emit('editor:error', { filePath, message: error.message });
      respond({ ok: false, error: error.message });
    }
  });

  socket.on('editor:release-lock', ({ filePath }) => {
    if (filePath) {
      setEditorActiveFile(socket.id, filePath);
    }
  });

  socket.on('duel:vote', async ({ duelId, vote }) => {
    const user = users.get(socket.id);
    if (!user || !duelId || !['owner', 'challenger'].includes(vote)) {
      return;
    }

    const tally = lockService.vote(duelId, socket.id, vote);
    if (!tally) {
      return;
    }

    const totalUsers = Math.max(users.size, 1);
    const majority = Math.floor(totalUsers / 2) + 1;

    io.emit('duel:tally', {
      duelId,
      ownerVotes: tally.ownerVotes,
      challengerVotes: tally.challengerVotes,
      totalVotes: tally.totalVotes,
      majority
    });

    if (tally.ownerVotes >= majority || tally.challengerVotes >= majority) {
      const winner = tally.ownerVotes >= majority ? 'owner' : 'challenger';
      const resolved = lockService.resolve(duelId, winner);
      if (!resolved) {
        return;
      }

      const winningContent = winner === 'owner' ? resolved.ownerContent : resolved.challengerContent;
      await writeFileContent(WORKSPACE_ROOT, resolved.filePath, winningContent);
      lockService.release(resolved.filePath);

      const winnerSocketId = winner === 'owner' ? resolved.ownerSocketId : resolved.challengerSocketId;
      const winnerUser = users.get(winnerSocketId);

      const pulse = feed.push({
        type: 'duel',
        message: `${winnerUser?.username || 'A teammate'} resolved a merge conflict in ${resolved.filePath}.`
      });

      io.emit('duel:resolved', {
        duelId,
        filePath: resolved.filePath,
        winner,
        winningContent
      });

      io.emit('editor:sync', {
        filePath: resolved.filePath,
        content: winningContent,
        authorSocketId: winnerSocketId,
        author: winnerUser || null
      });

      io.emit('contribution:pulse', pulse);
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    lastEditOperationBySocket.delete(socket.id);
    clearEditorPresence(socket.id);
    const released = lockService.releaseByOwner(socket.id);
    if (released.length) {
      for (const filePath of released) {
        io.emit('file:unlocked', { filePath, by: socket.id });
      }
    }

    io.emit('presence:update', { users: [...users.values()] });
  });
});

async function listenOnPort(port) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };

    const onListening = () => {
      server.off('error', onError);
      resolve();
    };

    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, HOST);
  });
}

async function bindServerWithFallback() {
  for (let offset = 0; offset < MAX_PORT_SCAN_ATTEMPTS; offset += 1) {
    const candidatePort = REQUESTED_PORT + offset;
    try {
      await listenOnPort(candidatePort);
      return candidatePort;
    } catch (error) {
      if (error?.code !== 'EADDRINUSE') {
        throw error;
      }
    }
  }

  throw new Error(
    `No available port found starting at ${REQUESTED_PORT}. Tried ${MAX_PORT_SCAN_ATTEMPTS} ports.`
  );
}

ensureRepository(WORKSPACE_ROOT)
  .then(async () => {
    activePort = await bindServerWithFallback();
    mdns = createMdnsService({ port: activePort });

    if (activePort !== REQUESTED_PORT) {
      console.warn(`Port ${REQUESTED_PORT} is in use. DELTA started on fallback port ${activePort}.`);
    }

    console.log(`DELTA server running on http://${getLanIp()}:${activePort}`);
    console.log(`mDNS session advertisement is active on port ${activePort}`);
  })
  .catch((error) => {
    console.error('Failed to initialize repository:', error);
    process.exit(1);
  });

process.on('SIGINT', () => {
  if (mdns) {
    mdns.close();
  }
  process.exit(0);
});
