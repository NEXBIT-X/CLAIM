import React, { useMemo, useState } from 'react';

function FileNode({ node, depth, selectedFile, onSelect }) {
  const [expanded, setExpanded] = useState(depth < 1);

  if (node.type === 'file') {
    const selected = selectedFile === node.path;
    return (
      <button
        className={`w-full truncate rounded px-2 py-1 text-left text-xs font-mono transition ${
          selected ? 'bg-blue-100 text-accent-blue font-semibold' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
        onClick={() => onSelect(node.path)}
        title={node.path}
      >
        {node.name}
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <button
        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs font-mono text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition"
        onClick={() => setExpanded((value) => !value)}
        title={node.path}
      >
        <span className="text-accent-blue">{expanded ? '▼' : '▶'}</span>
        <span className="truncate">{node.name}</span>
      </button>
      {expanded && (
        <div className="space-y-1 border-l border-neutral-200 pl-3">
          {node.children.map((child) => (
            <FileNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ tree, selectedFile, onSelect }) {
  const hasNodes = useMemo(() => Array.isArray(tree) && tree.length > 0, [tree]);

  if (!hasNodes) {
    return <p className="text-xs text-slate-400">No files detected in host workspace.</p>;
  }

  return (
    <div className="space-y-1">
      {tree.map((node) => (
        <FileNode key={node.path} node={node} depth={0} selectedFile={selectedFile} onSelect={onSelect} />
      ))}
    </div>
  );
}
