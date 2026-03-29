const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const SKIP_NAMES = new Set(['.git', 'node_modules', 'dist']);

function ensureInsideRoot(rootDir, targetPath) {
  const resolved = path.resolve(rootDir, targetPath);
  const normalizedRoot = `${path.resolve(rootDir)}${path.sep}`;
  if (!resolved.startsWith(normalizedRoot) && resolved !== path.resolve(rootDir)) {
    throw new Error('Path is outside of workspace root.');
  }
  return resolved;
}

async function readTree(rootDir, relative = '.', depth = 0, maxDepth = 6) {
  const absolute = ensureInsideRoot(rootDir, relative);
  const entries = await fsp.readdir(absolute, { withFileTypes: true });

  const items = [];
  for (const entry of entries) {
    if (SKIP_NAMES.has(entry.name)) {
      continue;
    }

    const relPath = path.posix.join(relative === '.' ? '' : relative.replace(/\\/g, '/'), entry.name);
    const normalizedRelPath = relPath.replace(/\\/g, '/');

    if (entry.isDirectory()) {
      const node = {
        type: 'directory',
        name: entry.name,
        path: normalizedRelPath,
        children: []
      };

      if (depth < maxDepth) {
        node.children = await readTree(rootDir, relPath, depth + 1, maxDepth);
      }

      items.push(node);
    } else {
      items.push({
        type: 'file',
        name: entry.name,
        path: normalizedRelPath
      });
    }
  }

  items.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'directory' ? -1 : 1;
  });

  return items;
}

async function readFileContent(rootDir, relativeFilePath) {
  const fullPath = ensureInsideRoot(rootDir, relativeFilePath);
  return fsp.readFile(fullPath, 'utf8');
}

async function writeFileContent(rootDir, relativeFilePath, content) {
  const fullPath = ensureInsideRoot(rootDir, relativeFilePath);
  await fsp.mkdir(path.dirname(fullPath), { recursive: true });
  await fsp.writeFile(fullPath, content, 'utf8');
}

function countLineDelta(before, after) {
  const beforeLines = before.split(/\r?\n/);
  const afterLines = after.split(/\r?\n/);
  return afterLines.length - beforeLines.length;
}

function fileExists(rootDir, relativeFilePath) {
  try {
    const fullPath = ensureInsideRoot(rootDir, relativeFilePath);
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

module.exports = {
  ensureInsideRoot,
  readTree,
  readFileContent,
  writeFileContent,
  countLineDelta,
  fileExists
};
