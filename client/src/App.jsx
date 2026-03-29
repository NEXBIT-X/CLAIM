import React, { useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import FileTree from './components/FileTree';

const CURSOR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const EDIT_ACK_TIMEOUT_MS = 350;
const EDIT_ACK_MAX_RETRIES = 6;
const CURSOR_THROTTLE_MS = 60;

function buildApiUrl(session, endpoint) {
  const base = session ? `http://${session.address}:${session.port}` : '';
  return `${base}${endpoint}`;
}

function SessionCard({ session, selected, onSelect }) {
  return (
    <button
      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
        selected
          ? 'border-accent-blue bg-blue-50 text-accent-blue shadow-md'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
      }`}
      onClick={() => onSelect(session)}
    >
      <p className="text-sm font-semibold">{session.name}</p>
      <p className="text-xs text-neutral-500">{session.address}:{session.port}</p>
      {session.isSelf && <span className="status-badge connected mt-1 inline-block">Host Machine</span>}
    </button>
  );
}

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [identity, setIdentity] = useState({ username: '', email: '', color: CURSOR_COLORS[0], role: 'editor' });
  const [showIdentityModal, setShowIdentityModal] = useState(true);
  const [showManualConnect, setShowManualConnect] = useState(false);
  const [manualHost, setManualHost] = useState('10.10.224.203');
  const [manualPort, setManualPort] = useState('8080');
  const [repoInfo, setRepoInfo] = useState({ isRepo: false, branch: null, remotes: [] });
  const [remoteUrl, setRemoteUrl] = useState('');

  const [tree, setTree] = useState([]);
  const [fileFilter, setFileFilter] = useState('');
  const [activeFile, setActiveFile] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [status, setStatus] = useState('Disconnected');
  const [health, setHealth] = useState(null);

  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');
  const [editingPresence, setEditingPresence] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState({});

  const [previewPort, setPreviewPort] = useState('3000');
  const [commitMessage, setCommitMessage] = useState('DELTA collaborative commit');
  const [runResults, setRunResults] = useState([]);
  const [duel, setDuel] = useState(null);
  const [duelTally, setDuelTally] = useState(null);
  const [syntaxPlugins, setSyntaxPlugins] = useState([]);

  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const previousContentRef = useRef('');
  const lastSentContentRef = useRef('');
  const skipOutgoingRef = useRef(false);
  const pendingEmitTimerRef = useRef(null);
  const pendingEmitPayloadRef = useRef(null);
  const inflightEditRef = useRef(null);
  const inflightRetryTimerRef = useRef(null);
  const editOperationCounterRef = useRef(0);
  const cursorThrottleRef = useRef({ lastSentAt: 0, timer: null, payload: null });
  const editorWrapperRef = useRef(null);
  const activeFileRef = useRef('');

  function clearInflightRetryTimer() {
    if (!inflightRetryTimerRef.current) {
      return;
    }
    clearTimeout(inflightRetryTimerRef.current);
    inflightRetryTimerRef.current = null;
  }

  function clearCursorThrottleTimer() {
    if (!cursorThrottleRef.current.timer) {
      return;
    }
    clearTimeout(cursorThrottleRef.current.timer);
    cursorThrottleRef.current.timer = null;
  }

  function nextOperationId(filePath) {
    editOperationCounterRef.current += 1;
    return `${Date.now()}-${editOperationCounterRef.current}-${filePath}`;
  }

  function sendEditWithAck(operation) {
    const socket = socketRef.current;
    if (!socket || !socket.connected || skipOutgoingRef.current) {
      return;
    }

    inflightEditRef.current = operation;
    clearInflightRetryTimer();

    socket.emit('editor:change', {
      filePath: operation.filePath,
      content: operation.content,
      previousContent: operation.previousContent,
      operationId: operation.operationId
    }, (ack) => {
      const currentInflight = inflightEditRef.current;
      if (!currentInflight || currentInflight.operationId !== operation.operationId) {
        return;
      }

      if (!ack?.ok) {
        if (currentInflight.retries >= EDIT_ACK_MAX_RETRIES) {
          clearInflightRetryTimer();
          inflightEditRef.current = null;
          pendingEmitPayloadRef.current = {
            filePath: operation.filePath,
            content: operation.content,
            previousContent: operation.previousContent
          };
          setStatus(ack?.error || 'Edit delivery failed. Changes will retry on reconnect.');
          return;
        }
        return;
      }

      clearInflightRetryTimer();
      inflightEditRef.current = null;

      if (operation.filePath === activeFileRef.current) {
        lastSentContentRef.current = operation.content;
        previousContentRef.current = operation.content;
      }

      if (pendingEmitPayloadRef.current) {
        flushPendingEmit();
      }
    });

    inflightRetryTimerRef.current = window.setTimeout(() => {
      const currentInflight = inflightEditRef.current;
      if (!currentInflight || currentInflight.operationId !== operation.operationId) {
        return;
      }

      if (currentInflight.retries >= EDIT_ACK_MAX_RETRIES) {
        inflightEditRef.current = null;
        pendingEmitPayloadRef.current = {
          filePath: currentInflight.filePath,
          content: currentInflight.content,
          previousContent: currentInflight.previousContent
        };
        setStatus('Network is unstable. Pending changes will retry.');
        return;
      }

      sendEditWithAck({
        ...currentInflight,
        retries: currentInflight.retries + 1
      });
    }, EDIT_ACK_TIMEOUT_MS);
  }

  function flushPendingEmit() {
    const pending = pendingEmitPayloadRef.current;
    if (!pending) {
      return;
    }

    if (pendingEmitTimerRef.current) {
      clearTimeout(pendingEmitTimerRef.current);
      pendingEmitTimerRef.current = null;
    }

    const socket = socketRef.current;
    if (!socket || !socket.connected || skipOutgoingRef.current) {
      return;
    }

    if (inflightEditRef.current) {
      return;
    }

    pendingEmitPayloadRef.current = null;
    sendEditWithAck({
      ...pending,
      operationId: nextOperationId(pending.filePath),
      retries: 0
    });
  }

  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  const api = useMemo(() => ({
    get: async (endpoint) => {
      const response = await fetch(buildApiUrl(selectedSession, endpoint));
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return response.json();
    },
    post: async (endpoint, body) => {
      const socketId = socketRef.current?.id;
      const response = await fetch(buildApiUrl(selectedSession, endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(socketId ? { 'x-lan-sync-socket-id': socketId } : {})
        },
        body: JSON.stringify(body)
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Request failed.');
      }
      return payload;
    }
  }), [selectedSession]);

  const extensionLanguageMap = useMemo(() => {
    const map = new Map();
    for (const plugin of syntaxPlugins) {
      for (const extension of plugin.extensions || []) {
        map.set(`${extension}`.toLowerCase(), plugin.language || 'plaintext');
      }
    }
    return map;
  }, [syntaxPlugins]);

  const hostedFileUrl = useMemo(() => {
    if (!selectedSession || !activeFile) {
      return '';
    }
    return buildApiUrl(selectedSession, `/api/files/raw?path=${encodeURIComponent(activeFile)}`);
  }, [selectedSession, activeFile]);

  const filteredTree = useMemo(() => {
    const query = fileFilter.trim().toLowerCase();
    if (!query) {
      return tree;
    }

    function filterNodes(nodes) {
      const results = [];
      for (const node of nodes) {
        if (node.type === 'file') {
          if (`${node.name} ${node.path}`.toLowerCase().includes(query)) {
            results.push(node);
          }
          continue;
        }

        const filteredChildren = filterNodes(node.children || []);
        const folderMatch = `${node.name} ${node.path}`.toLowerCase().includes(query);
        if (folderMatch || filteredChildren.length > 0) {
          results.push({
            ...node,
            children: filteredChildren
          });
        }
      }
      return results;
    }

    return filterNodes(tree);
  }, [tree, fileFilter]);

  function detectLanguage(filePath) {
    const fileName = `${filePath || ''}`.split('/').pop() || '';
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex < 0) {
      return 'plaintext';
    }
    const extension = fileName.slice(dotIndex + 1).toLowerCase();
    return extensionLanguageMap.get(extension) || 'plaintext';
  }

  const previewSrc = useMemo(() => {
    if (!selectedSession || !previewPort) {
      return '';
    }
    return buildApiUrl(selectedSession, `/preview/${previewPort}/`);
  }, [selectedSession, previewPort]);

  const activeFileEditors = useMemo(() => {
    const found = editingPresence.find((entry) => entry.filePath === activeFile);
    return found?.editors || [];
  }, [editingPresence, activeFile]);

  useEffect(() => {
    let cancelled = false;

    async function refreshSessions() {
      try {
        const payload = await api.get('/api/discovery/sessions');
        if (cancelled) {
          return;
        }
        setSessions(payload.sessions || []);

        if (!selectedSession && payload.sessions?.length) {
          const self = payload.sessions.find((session) => session.isSelf);
          setSelectedSession(self || payload.sessions[0]);
        }
      } catch {
        if (!cancelled) {
          setSessions([]);
        }
      }
    }

    refreshSessions();
    const interval = setInterval(refreshSessions, 3500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [api, selectedSession]);

  useEffect(() => {
    if (!selectedSession || showIdentityModal) {
      return;
    }

    const socketUrl = `http://${selectedSession.address}:${selectedSession.port}`;
    console.log(`[DELTA] Attempting socket connection to ${socketUrl}`);
    
    const socket = io(socketUrl, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: 20,
      forceNew: false
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[DELTA] ✓ Connected to ${socketUrl}`);
      console.log(`[DELTA] Transport: ${socket.io.engine.transport.name}`);
      setStatus('Connected');
      socket.emit('join-session', identity);
      window.setTimeout(() => {
        flushPendingEmit();
      }, 0);
    });

    socket.on('disconnect', (reason) => {
      console.warn(`[DELTA] ✗ Disconnected: ${reason}`);
      const inflight = inflightEditRef.current;
      if (inflight) {
        pendingEmitPayloadRef.current = {
          filePath: inflight.filePath,
          content: inflight.content,
          previousContent: inflight.previousContent
        };
        inflightEditRef.current = null;
      }
      clearInflightRetryTimer();
      setStatus(`Disconnected (${reason})`);
    });

    socket.on('connect_error', (error) => {
      console.error(`[DELTA] ✗ Connection error to ${socketUrl}:`, error);
      setStatus(`Connection error: ${error?.message || error?.type || JSON.stringify(error)}`);
    });

    socket.on('error', (error) => {
      console.error('[DELTA] ✗ Socket error:', error);
      setStatus(`Socket error: ${error?.message || error}`);
    });

    socket.io.engine.on('upgrade', (transport) => {
      console.log(`[DELTA] Transport upgraded to: ${transport.name}`);
    });

    socket.on('presence:update', (payload) => {
      setUsers(payload.users || []);
    });

    socket.on('file:editing-presence', (payload) => {
      setEditingPresence(payload?.files || []);
    });

    socket.on('editor:sync', (payload) => {
      if (!payload?.filePath || payload.filePath !== activeFileRef.current) {
        return;
      }
      if (payload.authorSocketId === socket.id) {
        return;
      }

      skipOutgoingRef.current = true;
      if (pendingEmitPayloadRef.current?.filePath === payload.filePath) {
        pendingEmitPayloadRef.current = null;
        if (pendingEmitTimerRef.current) {
          clearTimeout(pendingEmitTimerRef.current);
          pendingEmitTimerRef.current = null;
        }
      }
      const inflight = inflightEditRef.current;
      if (inflight?.filePath === payload.filePath) {
        clearInflightRetryTimer();
        inflightEditRef.current = null;
      }
      previousContentRef.current = payload.content || '';
      lastSentContentRef.current = payload.content || '';
      setCode(payload.content || '');
      window.setTimeout(() => {
        skipOutgoingRef.current = false;
      }, 0);
    });

    socket.on('editor:cursor', (payload) => {
      if (!payload?.filePath || payload.filePath !== activeFileRef.current) {
        return;
      }

      setRemoteCursors((prev) => ({
        ...prev,
        [payload.socketId]: payload
      }));
    });

    socket.on('contribution:pulse', (entry) => {
      setActivities((prev) => [entry, ...prev].slice(0, 80));
    });

    socket.on('chat:history', (payload) => {
      setChatMessages(payload?.messages || []);
    });

    socket.on('chat:message', (message) => {
      if (!message) {
        return;
      }
      setChatMessages((prev) => [...prev, message].slice(-120));
    });

    socket.on('run:result', (payload) => {
      if (!payload) {
        return;
      }
      setRunResults((prev) => [payload, ...prev].slice(0, 30));
    });

    socket.on('duel:start', (payload) => {
      if (payload.filePath === activeFileRef.current) {
        setDuel(payload);
      }
    });

    socket.on('duel:tally', (payload) => {
      setDuelTally(payload);
    });

    socket.on('duel:resolved', (payload) => {
      if (payload.filePath === activeFileRef.current) {
        skipOutgoingRef.current = true;
        previousContentRef.current = payload.winningContent || '';
        setCode(payload.winningContent || '');
        setDuel(null);
        setDuelTally(null);
        window.setTimeout(() => {
          skipOutgoingRef.current = false;
        }, 0);
      }
    });

    return () => {
      flushPendingEmit();
      clearInflightRetryTimer();
      clearCursorThrottleTimer();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selectedSession, identity, showIdentityModal]);

  useEffect(() => () => {
    clearInflightRetryTimer();
    clearCursorThrottleTimer();
    if (pendingEmitTimerRef.current) {
      clearTimeout(pendingEmitTimerRef.current);
      pendingEmitTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    async function refreshHealth() {
      if (!selectedSession) {
        return;
      }

      try {
        const payload = await api.get('/api/health');
        if (!cancelled) {
          setHealth(payload);
        }
      } catch {
        if (!cancelled) {
          setHealth(null);
        }
      }
    }

    refreshHealth();
    timer = setInterval(refreshHealth, 4000);

    return () => {
      cancelled = true;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [api, selectedSession]);

  useEffect(() => {
    async function loadTreeAndFeed() {
      if (!selectedSession) {
        return;
      }

      try {
        const [treePayload, activityPayload, repoPayload, pluginPayload] = await Promise.all([
          api.get('/api/files/tree'),
          api.get('/api/activity'),
          api.get('/api/repo/info'),
          api.get('/api/editor/syntax-plugins')
        ]);

        setTree(treePayload.tree || []);
        setActivities(activityPayload.items || []);
        setRepoInfo(repoPayload.repo || { isRepo: false, branch: null, remotes: [] });
        setSyntaxPlugins(pluginPayload.plugins || []);
      } catch {
        setTree([]);
      }
    }

    loadTreeAndFeed();
  }, [api, selectedSession]);

  async function openFile(path) {
    try {
      flushPendingEmit();
      const payload = await api.get(`/api/files/content?path=${encodeURIComponent(path)}`);
      setActiveFile(path);
      setLanguage(detectLanguage(path));
      previousContentRef.current = payload.content || '';
      lastSentContentRef.current = payload.content || '';
      setCode(payload.content || '');
      setRemoteCursors({});
      if (socketRef.current) {
        socketRef.current.emit('editor:open-file', { filePath: path });
      }
    } catch (error) {
      setStatus(error.message);
    }
  }

  function handleEditorMount(editor) {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((event) => {
      const socket = socketRef.current;
      if (!activeFileRef.current || !socket || !socket.connected) {
        return;
      }

      const sendCursor = () => {
        const pendingCursor = cursorThrottleRef.current.payload;
        if (!pendingCursor || !socketRef.current?.connected) {
          return;
        }

        socketRef.current.emit('editor:cursor', pendingCursor);
        cursorThrottleRef.current.lastSentAt = Date.now();
        cursorThrottleRef.current.payload = null;
      };

      cursorThrottleRef.current.payload = {
        filePath: activeFileRef.current,
        position: event.position
      };

      const now = Date.now();
      const elapsed = now - cursorThrottleRef.current.lastSentAt;
      if (elapsed >= CURSOR_THROTTLE_MS) {
        clearCursorThrottleTimer();
        sendCursor();
        return;
      }

      if (!cursorThrottleRef.current.timer) {
        cursorThrottleRef.current.timer = window.setTimeout(() => {
          cursorThrottleRef.current.timer = null;
          sendCursor();
        }, CURSOR_THROTTLE_MS - elapsed);
      }
    });
  }

  function handleCodeChange(nextValue) {
    const value = nextValue || '';
    setCode(value);

    if (!activeFile || !socketRef.current || skipOutgoingRef.current) {
      previousContentRef.current = value;
      return;
    }

    if (pendingEmitTimerRef.current) {
      clearTimeout(pendingEmitTimerRef.current);
    }

    const currentFilePath = activeFile;
    pendingEmitPayloadRef.current = {
      filePath: currentFilePath,
      content: value,
      previousContent: lastSentContentRef.current
    };

    pendingEmitTimerRef.current = window.setTimeout(() => {
      flushPendingEmit();
    }, 45);
  }

  function releaseLock() {
    if (!socketRef.current || !activeFile) {
      return;
    }
    socketRef.current.emit('editor:release-lock', { filePath: activeFile });
  }

  async function commitAndPush(push) {
    if (!activeFile) {
      setStatus('Select a file before committing.');
      return;
    }

    try {
      const payload = await api.post('/api/git/commit-push', {
        message: commitMessage,
        filePaths: [activeFile],
        identity,
        push
      });

      if (payload.pushResult?.pushed) {
        setStatus(`Committed ${payload.oid.slice(0, 7)} and pushed.`);
      } else {
        setStatus(`Committed ${payload.oid.slice(0, 7)}. ${payload.pushResult?.reason || ''}`.trim());
      }
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function runActiveFile() {
    if (!activeFile) {
      setStatus('Select a runnable file first (.c, .js, .mjs, .cjs, .py).');
      return;
    }

    try {
      await api.post('/api/run/active-file', { path: activeFile });
      setStatus(`Ran ${activeFile}`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function connectRepository() {
    if (!remoteUrl.trim()) {
      setStatus('Provide a remote repository URL first.');
      return;
    }

    try {
      const payload = await api.post('/api/repo/connect', {
        remoteUrl: remoteUrl.trim(),
        remoteName: 'origin'
      });

      setRepoInfo(payload.repo || repoInfo);
      setStatus('Repository remote connected. You can now commit and push.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  function sendChatMessage() {
    const text = chatDraft.trim();
    if (!text || !socketRef.current) {
      return;
    }

    socketRef.current.emit('chat:send', { text });
    setChatDraft('');
  }

  function voteDuel(side) {
    if (!socketRef.current || !duel) {
      return;
    }
    socketRef.current.emit('duel:vote', { duelId: duel.duelId, vote: side });
  }

  async function connectManually() {
    if (!manualHost.trim() || !manualPort.trim()) {
      setStatus('Enter host and port.');
      return;
    }

    const url = `http://${manualHost.trim()}:${manualPort.trim()}`;
    setStatus(`Testing connection to ${url}...`);

    try {
      const testResp = await fetch(`${url}/api/socket-test`, { method: 'GET' });
      if (!testResp.ok) {
        throw new Error(`HTTP ${testResp.status}`);
      }
      const testData = await testResp.json();
      console.log('[DELTA] Socket test passed:', testData);
      setStatus(`Socket.IO ready at ${url}`);
    } catch (error) {
      console.error('[DELTA] Socket test failed:', error);
      setStatus(`Socket test failed: ${error?.message || error}`);
      return;
    }

    const newSession = {
      id: `manual-${manualHost}-${manualPort}`,
      name: `Manual (${manualHost}:${manualPort})`,
      address: manualHost.trim(),
      port: Number(manualPort.trim()),
      host: 'manual',
      isSelf: false,
      lastSeen: Date.now()
    };

    setSelectedSession(newSession);
    setShowManualConnect(false);
  }

  const cursorElements = useMemo(() => {
    if (!editorRef.current || !activeFile) {
      return [];
    }

    const result = [];
    for (const entry of Object.values(remoteCursors)) {
      if (!entry.position || entry.filePath !== activeFile) {
        continue;
      }
      const coords = editorRef.current.getScrolledVisiblePosition(entry.position);
      if (!coords) {
        continue;
      }
      result.push({
        socketId: entry.socketId,
        username: entry.username,
        color: entry.color,
        left: coords.left,
        top: coords.top
      });
    }

    return result;
  }, [remoteCursors, activeFile, code]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-accent-blue to-accent-indigo px-3 py-1 text-white font-semibold text-sm">
              DELTA
            </div>
            <span className={`status-badge ${status === 'Connected' ? 'connected' : 'error'}`}>
              {status}
            </span>
          </div>
          <div className="text-sm text-neutral-600">
            {activeFile && <span>Editing: {activeFile}</span>}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-[1920px] grid grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_1fr_300px]">
        {/* Left Sidebar */}
        <aside className="clean-panel rounded-lg p-4">
          {/* Sessions Section */}
          <div className="mb-6">
            <h2 className="section-title mb-2">Sessions</h2>
            <p className="text-xs text-neutral-500 mb-3">mDNS zero-config discovery</p>
            <div className="space-y-2">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  selected={selectedSession?.id === session.id}
                  onSelect={setSelectedSession}
                />
              ))}
              {!sessions.length && (
                <p className="text-xs text-neutral-500">No sessions found.</p>
              )}
            </div>
            <button
              onClick={() => setShowManualConnect(!showManualConnect)}
              className="btn-secondary w-full mt-3 text-xs py-1"
            >
              {showManualConnect ? 'Hide Manual Connect' : 'Manual Connect'}
            </button>
            {showManualConnect && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Host (e.g. 192.168.1.100)"
                  value={manualHost}
                  onChange={(e) => setManualHost(e.target.value)}
                  className="w-full px-2 py-1 border border-neutral-200 rounded bg-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
                <input
                  type="text"
                  placeholder="Port (e.g. 8080)"
                  value={manualPort}
                  onChange={(e) => setManualPort(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-2 py-1 border border-neutral-200 rounded bg-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
                <button onClick={connectManually} className="btn-primary w-full text-xs py-1">
                  Connect
                </button>
              </div>
            )}
          </div>

          {/* File Tree Section */}
          <div className="mb-6">
            <h3 className="section-title mb-2">Files</h3>
            <input
              type="text"
              value={fileFilter}
              onChange={(event) => setFileFilter(event.target.value)}
              placeholder="Filter files..."
              className="mb-2 w-full px-2 py-1 border border-neutral-200 rounded bg-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 max-h-[35vh] overflow-auto">
              {filteredTree.length > 0 ? (
                <FileTree tree={filteredTree} selectedFile={activeFile} onSelect={openFile} />
              ) : (
                <p className="text-xs text-neutral-500">No matching files.</p>
              )}
            </div>
          </div>

          {/* Preview Port Section */}
          <div className="mb-6 clean-panel rounded-lg p-3">
            <p className="section-title mb-2">Live Preview</p>
            <input
              value={previewPort}
              onChange={(event) => setPreviewPort(event.target.value.replace(/[^0-9]/g, ''))}
              placeholder="3000"
              className="w-full px-2 py-1 border border-neutral-200 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>

          {/* Repository Section */}
          <div className="mb-6 clean-panel rounded-lg p-3">
            <p className="section-title mb-2">Repository</p>
            <p className="text-xs text-neutral-600 mb-2">
              {repoInfo.isRepo ? `Branch: ${repoInfo.branch || 'unknown'}` : 'No git repository'}
            </p>
            <input
              value={remoteUrl}
              onChange={(event) => setRemoteUrl(event.target.value)}
              placeholder="https://github.com/org/repo.git"
              className="w-full px-2 py-1 border border-neutral-200 rounded bg-white text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <button onClick={connectRepository} className="btn-primary w-full text-xs py-1">
              Connect Remote
            </button>
            {repoInfo.remotes?.length > 0 && (
              <p className="text-[11px] text-neutral-500 mt-2 truncate">{repoInfo.remotes[0].url}</p>
            )}
          </div>

          {/* Contributors Section */}
          <div className="clean-panel rounded-lg p-3">
            <p className="section-title mb-2">Contributors</p>
            <div className="space-y-1">
              {users.length > 0 ? (
                users.map((user) => (
                  <p key={user.socketId} className="text-xs" style={{ color: user.color }}>
                    {user.username} <span className="text-neutral-500">({user.role})</span>
                  </p>
                ))
              ) : (
                <p className="text-xs text-neutral-500">No active users</p>
              )}
            </div>
          </div>
        </aside>

        {/* Center: Editor & Preview */}
        <main className="flex flex-col gap-4">
          {/* Toolbar */}
          <div className="clean-panel rounded-lg p-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={commitMessage}
                onChange={(event) => setCommitMessage(event.target.value)}
                placeholder="Commit message"
                className="flex-1 min-w-48 px-3 py-1 border border-neutral-200 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <button onClick={releaseLock} className="btn-secondary text-xs py-1 px-2">
                Sync Presence
              </button>
              <button onClick={() => commitAndPush(false)} className="btn-primary text-xs py-1 px-2">
                Commit
              </button>
              <button onClick={() => commitAndPush(true)} className="btn-primary text-xs py-1 px-2 bg-accent-emerald hover:bg-emerald-600">
                Commit + Push
              </button>
              <button onClick={runActiveFile} className="btn-secondary text-xs py-1 px-2">
                Run Active File
              </button>
              {hostedFileUrl && (
                <a
                  href={hostedFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs py-1 px-2"
                >
                  Share Link
                </a>
              )}
            </div>
          </div>

          {/* Editor */}
          <div ref={editorWrapperRef} className="relative flex-1 overflow-hidden rounded-lg border border-neutral-200 min-h-[50vh]">
            {activeFileEditors.length > 0 && (
              <div className="absolute right-2 top-2 z-20 rounded border border-neutral-200 bg-white/95 px-2 py-1 text-[11px] text-neutral-700 shadow-sm">
                Editing now: {activeFileEditors.map((editor) => editor.username).join(', ')}
              </div>
            )}
            <Editor
              height="100%"
              language={language}
              theme="vs-light"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorMount}
              options={{
                fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Fira Code", "JetBrains Mono", monospace',
                fontSize: 13,
                minimap: { enabled: false },
                smoothScrolling: true,
                automaticLayout: true
              }}
            />
            <div className="pointer-events-none absolute inset-0">
              {cursorElements.map((cursor) => (
                <div
                  key={cursor.socketId}
                  className="absolute w-0.5 h-6"
                  style={{
                    left: `${cursor.left}px`,
                    top: `${cursor.top}px`,
                    backgroundColor: cursor.color
                  }}
                >
                  <span
                    className="absolute top-0 left-1 px-1 py-0.5 rounded text-xs font-semibold text-white whitespace-nowrap pointer-events-auto"
                    style={{ backgroundColor: cursor.color }}
                  >
                    {cursor.username}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-neutral-200 overflow-hidden min-h-[24vh] bg-white">
            {previewSrc ? (
              <iframe title="Live Preview" src={previewSrc} className="w-full h-full border-0" />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                Select a session to view preview
              </div>
            )}
          </div>

          {/* Shared Run Output */}
          <div className="clean-panel rounded-lg p-3 min-h-[18vh]">
            <h3 className="section-title mb-2">Run Output</h3>
            {runResults.length === 0 ? (
              <p className="text-xs text-neutral-500">Run a .c, .js, or .py file to broadcast output to all collaborators.</p>
            ) : (
              <div className="space-y-2 max-h-[26vh] overflow-auto">
                {runResults.map((item) => (
                  <div key={item.id} className="rounded border border-neutral-200 bg-neutral-50 p-2">
                    <p className="text-xs text-neutral-700">
                      <span className="font-semibold">{item.runner}</span> ran <span className="font-mono">{item.path}</span> (exit {item.exitCode})
                    </p>
                    <p className="text-[11px] text-neutral-500 font-mono">{item.command}</p>
                    {item.stdout ? (
                      <pre className="mt-1 rounded bg-white border border-neutral-200 p-2 text-[11px] text-neutral-800 overflow-auto">{item.stdout}</pre>
                    ) : null}
                    {item.stderr ? (
                      <pre className="mt-1 rounded bg-red-50 border border-red-200 p-2 text-[11px] text-red-700 overflow-auto">{item.stderr}</pre>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar: Activity Feed */}
        <aside className="clean-panel rounded-lg p-4">
          <h2 className="section-title mb-2">Session Health</h2>
          <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-neutral-200 bg-neutral-50 p-2">
              <p className="text-neutral-500">Server</p>
              <p className="font-semibold text-neutral-700">{health ? 'Online' : 'Unknown'}</p>
            </div>
            <div className="rounded border border-neutral-200 bg-neutral-50 p-2">
              <p className="text-neutral-500">Active Users</p>
              <p className="font-semibold text-neutral-700">{health?.activeUsers ?? users.length}</p>
            </div>
            <div className="rounded border border-neutral-200 bg-neutral-50 p-2">
              <p className="text-neutral-500">Host</p>
              <p className="font-semibold text-neutral-700 truncate">{health?.host || selectedSession?.address || '-'}</p>
            </div>
            <div className="rounded border border-neutral-200 bg-neutral-50 p-2">
              <p className="text-neutral-500">Port</p>
              <p className="font-semibold text-neutral-700">{health?.port || selectedSession?.port || '-'}</p>
            </div>
          </div>

          <h2 className="section-title mb-2">Activity Feed</h2>
          <p className="text-xs text-neutral-500 mb-3">Live edits & commits</p>
          <div className="space-y-2 max-h-[44vh] overflow-auto">
            {activities.length > 0 ? (
              activities.map((entry) => (
                <div key={entry.id} className="clean-panel rounded p-2 text-xs border border-neutral-200">
                  <p className="text-neutral-700">{entry.message}</p>
                  <p className="text-neutral-400 text-[10px] mt-1">
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500">Waiting for events...</p>
            )}
          </div>

          <div className="mt-4 border-t border-neutral-200 pt-3">
            <h3 className="section-title mb-2">Team Chat</h3>
            <div className="max-h-[20vh] overflow-auto rounded border border-neutral-200 bg-neutral-50 p-2 space-y-2">
              {chatMessages.length > 0 ? (
                chatMessages.map((message) => (
                  <div key={message.id} className="text-xs">
                    <span className="font-semibold" style={{ color: message.color || '#3b82f6' }}>{message.username}</span>
                    <span className="text-neutral-700">: {message.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500">Say hi to your team...</p>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={chatDraft}
                onChange={(event) => setChatDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendChatMessage();
                  }
                }}
                placeholder="Type a message"
                className="flex-1 px-2 py-1 border border-neutral-200 rounded bg-white text-xs focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <button onClick={sendChatMessage} className="btn-primary text-xs px-2 py-1">Send</button>
            </div>
          </div>
        </aside>
      </div>

      {/* Identity Modal */}
      {showIdentityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="clean-panel w-full max-w-md rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-neutral-900 mb-1">Join DELTA</h2>
            <p className="text-xs text-neutral-500 mb-4">Identity for commit attribution</p>

            <label className="block text-xs font-semibold text-neutral-700 mb-1">Username</label>
            <input
              className="w-full px-3 py-2 border border-neutral-200 rounded bg-white text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              value={identity.username}
              onChange={(event) => setIdentity((prev) => ({ ...prev, username: event.target.value }))}
              placeholder="Your name"
            />

            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
            <input
              className="w-full px-3 py-2 border border-neutral-200 rounded bg-white text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              value={identity.email}
              onChange={(event) => setIdentity((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="you@example.com"
            />

            <label className="block text-xs font-semibold text-neutral-700 mb-2">Cursor Color</label>
            <div className="flex gap-2 mb-4">
              {CURSOR_COLORS.map((color) => (
                <button
                  key={color}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    identity.color === color ? 'border-neutral-900' : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setIdentity((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>

            <label className="block text-xs font-semibold text-neutral-700 mb-2">Initial Role</label>
            <select
              className="w-full px-3 py-2 border border-neutral-200 rounded bg-white text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              value={identity.role}
              onChange={(event) => setIdentity((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="owner">Owner (Full Access)</option>
              <option value="editor">Editor (Read/Write)</option>
              <option value="viewer">Viewer (Read-Only)</option>
            </select>

            <button
              className="btn-primary w-full py-2"
              onClick={() => setShowIdentityModal(false)}
            >
              Enter Session
            </button>
          </div>
        </div>
      )}

      {/* Conflict Duel Modal */}
      {duel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="clean-panel w-full max-w-2xl rounded-lg p-6 shadow-lg max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-bold text-neutral-900 mb-2">Conflict Duel</h2>
            <p className="text-xs text-neutral-600 mb-4">
              <strong>{duel.owner}</strong> and <strong>{duel.challenger}</strong> edited the same file simultaneously.
              Vote for the winning version:
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Owner Version */}
              <div className="border border-neutral-200 rounded p-3 bg-neutral-50">
                <p className="text-xs font-semibold text-neutral-700 mb-2">{duel.owner}'s Version</p>
                <pre className="text-xs bg-white border border-neutral-200 rounded p-2 max-h-[20vh] overflow-auto font-mono">
                  {duel.ownerContent?.slice(0, 300)}...
                </pre>
                <button
                  className="btn-primary w-full mt-3 text-xs py-1"
                  onClick={() => voteDuel('owner')}
                  disabled={duelTally?.resolved}
                >
                  Vote Owner ({duelTally?.ownerVotes || 0})
                </button>
              </div>

              {/* Challenger Version */}
              <div className="border border-neutral-200 rounded p-3 bg-neutral-50">
                <p className="text-xs font-semibold text-neutral-700 mb-2">{duel.challenger}'s Version</p>
                <pre className="text-xs bg-white border border-neutral-200 rounded p-2 max-h-[20vh] overflow-auto font-mono">
                  {duel.challengerContent?.slice(0, 300)}...
                </pre>
                <button
                  className="btn-primary w-full mt-3 text-xs py-1 bg-accent-emerald hover:bg-emerald-600"
                  onClick={() => voteDuel('challenger')}
                  disabled={duelTally?.resolved}
                >
                  Vote Challenger ({duelTally?.challengerVotes || 0})
                </button>
              </div>
            </div>

            {duelTally?.resolved && (
              <div className="rounded-lg border border-accent-emerald bg-emerald-50 p-3 text-center">
                <p className="text-sm font-semibold text-accent-emerald">
                  ✓ {duelTally.winner}'s version won!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
