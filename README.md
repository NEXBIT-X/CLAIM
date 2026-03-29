# LAN-Sync (DELTA)

LAN-Sync is a high-performance LAN-based collaborative code editor with per-user Git identity attribution.

## Stack

- Node.js + Express backend
- Socket.io real-time sync engine
- isomorphic-git repository operations with transaction-scoped identity injection
- multicast-dns (mDNS) LAN discovery advertised as `hackathon.local`
- React + Monaco Editor frontend
- Tailwind CSS with Cyberpunk-Noir theme

## Key Features

- Zero-config session discovery dashboard using mDNS
- Real-time keystroke broadcast and shared Monaco editing
- Floating colored cursor labels for active collaborators
- File locking and race-condition conflict duel workflow with voting
- Multi-identity commit/push pipeline preserving GitHub attribution
- Live preview proxy for host localhost ports (for example `/preview/3000`)
- Contribution Pulse live ticker for edits, commits, and conflict resolutions

## Run

1. Install dependencies:
	- `npm install`
2. Start server + client in development:
	- `npm run dev`
3. Build frontend for production:
	- `npm run build`
4. Run production server:
	- `npm start`

## Environment Variables

- `PORT`: backend port (default `8080`)
- `LAN_SYNC_ROOT`: workspace root to share (default current directory)
- `LAN_SYNC_HOST`: optional explicit LAN IP/host to advertise for peer connections
- `GITHUB_TOKEN`: required for authenticated push
- `GITHUB_USERNAME`: optional push username override

## Shared Run Output

- Select a runnable file (`.c`, `.js`, `.mjs`, `.cjs`, `.py`) and click **Run Active File**.
- The result is broadcast to all connected collaborators in the **Run Output** panel.
- For C files, install `gcc` or `clang` on the host machine.

## Notes

- The backend initializes a local Git repository if `.git` is missing.
- Commit identity is required (username + email) per transaction.
- The preview proxy exposes host-local development ports through `/preview/:port`.