import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import { initialTreeData } from '../data/treeData';
import { generateNodesAndEdges, searchNodes, getPathToNode } from '../utils/layoutUtils';

const nodeTypes = {
  customNode: CustomNode,
};

const defaultViewport = { x: 100, y: 50, zoom: 0.85 };

const TreeView = () => {
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState([]);

  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = generateNodesAndEdges(initialTreeData, collapsedNodes);
    
    const nodesWithHandlers = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onToggle: () => handleToggleNode(node.id),
        isHighlighted: highlightedNode === node.id,
        isSearchMatch: searchMatches.includes(node.id),
      },
    }));

    return { initialNodes: nodesWithHandlers, initialEdges: edges };
  }, [collapsedNodes, highlightedNode, searchMatches]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleToggleNode = useCallback((nodeId) => {
    setCollapsedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const onNodeMouseEnter = useCallback((event, node) => {
    setHighlightedNode(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHighlightedNode(null);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchMatches([]);
      return;
    }

    const matches = searchNodes(initialTreeData, query);
    setSearchMatches(matches);

    if (matches.length > 0) {
      const path = getPathToNode(initialTreeData, matches[0]);
      setCollapsedNodes((prev) => {
        const newSet = new Set(prev);
        path.slice(0, -1).forEach((id) => newSet.delete(id));
        return newSet;
      });
    }
  }, []);

  const handleExpandAll = useCallback(() => {
    setCollapsedNodes(new Set());
  }, []);

  const handleCollapseAll = useCallback(() => {
    const nodesToCollapse = new Set();
    
    const collectNodes = (node) => {
      if (node.children && node.children.length > 0) {
        nodesToCollapse.add(node.id);
        node.children.forEach(collectNodes);
      }
    };
    
    initialTreeData.children.forEach(collectNodes);
    nodesToCollapse.add(initialTreeData.id);
    
    setCollapsedNodes(nodesToCollapse);
  }, []);

  return (
    <div className="tree-view-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        minZoom={0.2}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
      >
        <Background
          color="#2a2a3e"
          gap={20}
          size={1}
          variant="dots"
        />
        <Controls
          className="custom-controls"
          showInteractive={false}
        />

        <Panel position="top-left" className="control-panel">
          <div className="panel-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span>Tree View</span>
          </div>

          <div className="search-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => handleSearch('')}
              >
                ×
              </button>
            )}
          </div>

          {searchMatches.length > 0 && (
            <div className="search-results">
              Found {searchMatches.length} match{searchMatches.length !== 1 ? 'es' : ''}
            </div>
          )}

          <div className="button-group">
            <button onClick={handleExpandAll} className="panel-btn expand-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
              </svg>
              Expand All
            </button>
            <button onClick={handleCollapseAll} className="panel-btn collapse-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 14h6v6M14 4h6v6M20 10l-7 7M4 20l7-7"></path>
              </svg>
              Collapse All
            </button>
          </div>

          <div className="legend">
            <div className="legend-title">Node Depth</div>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}></span>
                <span>Root</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}></span>
                <span>Level 1</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}></span>
                <span>Level 2</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}></span>
                <span>Level 3</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}></span>
                <span>Level 4+</span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel position="top-right" className="info-panel">
          <div className="info-item">
            <span className="info-label">Total Nodes</span>
            <span className="info-value">{nodes.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Visible Edges</span>
            <span className="info-value">{edges.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Collapsed</span>
            <span className="info-value">{collapsedNodes.size}</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default TreeView;

