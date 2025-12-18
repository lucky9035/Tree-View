import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { levelColors } from '../data/treeData';

const CustomNode = memo(({ data, selected }) => {
  const { label, hasChildren, isCollapsed, level, childCount, onToggle, isHighlighted, isSearchMatch } = data;
  
  const colorScheme = levelColors[Math.min(level, levelColors.length - 1)];

  return (
    <div
      className={`custom-node ${selected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${isSearchMatch ? 'search-match' : ''}`}
      style={{
        background: colorScheme.bg,
        borderColor: colorScheme.border,
        boxShadow: isHighlighted || isSearchMatch 
          ? `0 0 25px ${colorScheme.glow}, 0 0 50px ${colorScheme.glow}` 
          : `0 4px 20px rgba(0, 0, 0, 0.3)`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="node-handle"
        style={{ background: colorScheme.border }}
      />

      <div className="node-content">
        <span className="node-label">{label}</span>
        
        {hasChildren && (
          <button
            className={`toggle-btn ${isCollapsed ? 'collapsed' : 'expanded'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggle) onToggle();
            }}
            title={isCollapsed ? `Expand (${childCount} items)` : 'Collapse'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
      </div>

      {hasChildren && isCollapsed && childCount > 0 && (
        <div className="child-count-badge">
          +{childCount}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="node-handle"
        style={{ background: colorScheme.border }}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;

