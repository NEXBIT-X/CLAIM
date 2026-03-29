const path = require('path');
const fs = require('fs');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

async function ensureRepository(rootDir, defaultBranch = 'main') {
  const gitDir = path.join(rootDir, '.git');
  if (!fs.existsSync(gitDir)) {
    await git.init({ fs, dir: rootDir, defaultBranch });
  }
}

async function getConfigOrNull(rootDir, key) {
  try {
    return await git.getConfig({ fs, dir: rootDir, path: key });
  } catch {
    return null;
  }
}

async function withIdentityTransaction(rootDir, identity, callback) {
  const previousName = await getConfigOrNull(rootDir, 'user.name');
  const previousEmail = await getConfigOrNull(rootDir, 'user.email');

  // Transaction-scoped identity injection for commit operations.
  await git.setConfig({ fs, dir: rootDir, path: 'user.name', value: identity.username });
  await git.setConfig({ fs, dir: rootDir, path: 'user.email', value: identity.email });

  try {
    return await callback();
  } finally {
    if (previousName) {
      await git.setConfig({ fs, dir: rootDir, path: 'user.name', value: previousName });
    }
    if (previousEmail) {
      await git.setConfig({ fs, dir: rootDir, path: 'user.email', value: previousEmail });
    }
  }
}

async function stageFiles(rootDir, filePaths) {
  const uniquePaths = [...new Set(filePaths)];
  for (const filePath of uniquePaths) {
    await git.add({ fs, dir: rootDir, filepath: filePath.replace(/\\/g, '/') });
  }
}

async function listRepoInfo(rootDir) {
  const isRepo = fs.existsSync(path.join(rootDir, '.git'));
  if (!isRepo) {
    return {
      isRepo: false,
      branch: null,
      remotes: []
    };
  }

  const branch = await git.currentBranch({ fs, dir: rootDir, fullname: false });
  const remotes = await git.listRemotes({ fs, dir: rootDir });

  return {
    isRepo: true,
    branch,
    remotes
  };
}

async function connectRemote({ rootDir, remoteName = 'origin', remoteUrl }) {
  if (!remoteUrl || !/^https?:\/\//i.test(remoteUrl)) {
    throw new Error('A valid http(s) repository URL is required.');
  }

  await ensureRepository(rootDir);
  const remotes = await git.listRemotes({ fs, dir: rootDir });
  const existing = remotes.find((item) => item.remote === remoteName);

  if (existing) {
    await git.deleteRemote({ fs, dir: rootDir, remote: remoteName });
  }

  await git.addRemote({
    fs,
    dir: rootDir,
    remote: remoteName,
    url: remoteUrl
  });

  return {
    remoteName,
    remoteUrl
  };
}

async function commitAndMaybePush({ rootDir, filePaths, message, identity, shouldPush }) {
  await ensureRepository(rootDir);

  if (!filePaths.length) {
    throw new Error('No files provided to stage.');
  }

  return withIdentityTransaction(rootDir, identity, async () => {
    await stageFiles(rootDir, filePaths);

    const oid = await git.commit({
      fs,
      dir: rootDir,
      message,
      author: {
        name: identity.username,
        email: identity.email
      },
      committer: {
        name: identity.username,
        email: identity.email
      }
    });

    let pushResult = { pushed: false, reason: 'Push not requested.' };

    if (shouldPush) {
      const token = process.env.GITHUB_TOKEN;
      const username = process.env.GITHUB_USERNAME || identity.username;

      if (!token) {
        pushResult = { pushed: false, reason: 'Missing GITHUB_TOKEN environment variable.' };
      } else {
        await git.push({
          fs,
          http,
          dir: rootDir,
          remote: 'origin',
          onAuth: () => ({
            username,
            password: token
          })
        });
        pushResult = { pushed: true };
      }
    }

    return { oid, pushResult };
  });
}

module.exports = {
  ensureRepository,
  commitAndMaybePush,
  listRepoInfo,
  connectRemote
};
