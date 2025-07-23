<center>
<img src="app/public/banner.svg"  >
</center>

# CLAIM
### Decentralized Idea Proof Platform

CLAIM – Decentralized Idea Proof Platform allows any user to:

- Upload a description and file (e.g., PDF) of their idea.
- Connect a wallet like MetaMask for identity.
- Mint a unique NFT (Non-Fungible Token) that proves the idea was theirs — with a timestamp.
- Store the document in decentralized storage (IPFS).
- View and share their proof publicly.

This provides quick, tamper-proof, and transparent proof that the idea existed — helping defend against future disputes or infringements.

```mermaid
graph LR
subgraph patent-block
   a[owner]
   b[ipfscid]
   c[title]
   d[ispublic]
   e[timestamp]
end

subgraph new-patent
    f[pdfID->encoded]
    g[title]
    h[closed/open]
end
new-patent-->i
    i((add))-->patent-block
    
subgraph view

end
```
