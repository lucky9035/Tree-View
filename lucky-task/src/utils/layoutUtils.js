
const NODE_WIDTH = 140;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 40;
const VERTICAL_SPACING = 100;

/**
 * @param {Object} node - Tree node
 * @param {Set} collapsedNodes - Set of collapsed node IDs
 * @returns {number} - Total width of the subtree
 */
export function calculateSubtreeWidth(node, collapsedNodes) {
  if (!node.children || node.children.length === 0 || collapsedNodes.has(node.id)) {
    return NODE_WIDTH;
  }

  let totalChildWidth = 0;
  node.children.forEach((child, index) => {
    totalChildWidth += calculateSubtreeWidth(child, collapsedNodes);
    if (index < node.children.length - 1) {
      totalChildWidth += HORIZONTAL_SPACING;
    }
  });

  return Math.max(NODE_WIDTH, totalChildWidth);
}

/**             
 * @param {Object} treeData - Root node of the tree
 * @param {Set} collapsedNodes - Set of collapsed node IDs
 * @returns {{ nodes: Array, edges: Array }} - React Flow nodes and edges
 */
export function generateNodesAndEdges(treeData, collapsedNodes) {
  const nodes = [];
  const edges = [];

  function processNode(node, level, xOffset, parentId = null) {
    const subtreeWidth = calculateSubtreeWidth(node, collapsedNodes);
    const nodeX = xOffset + subtreeWidth / 2 - NODE_WIDTH / 2;
    const nodeY = level * (NODE_HEIGHT + VERTICAL_SPACING);

    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes.has(node.id);

    nodes.push({
      id: node.id,
      type: 'customNode',
      position: { x: nodeX, y: nodeY },
      data: {
        label: node.label,
        hasChildren,
        isCollapsed,
        level,
        childCount: hasChildren ? countAllDescendants(node) : 0,
      },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: '#4a5568',
          strokeWidth: 2,
        },
      });
    }

    if (hasChildren && !isCollapsed) {
      let childXOffset = xOffset;
      node.children.forEach((child) => {
        processNode(child, level + 1, childXOffset, node.id);
        childXOffset += calculateSubtreeWidth(child, collapsedNodes) + HORIZONTAL_SPACING;
      });
    }
  }

  processNode(treeData, 0, 0);

  return { nodes, edges };
}

/**
 * @param {Object} node - Tree node
 * @returns {number} - Total count of descendants
 */
function countAllDescendants(node) {
  if (!node.children || node.children.length === 0) {
    return 0;
  }
  let count = node.children.length;
  node.children.forEach((child) => {
    count += countAllDescendants(child);
  });
  return count;
}

/**
 * @param {Object} root - Root node
 * @param {string} targetId - ID to find
 * @returns {Object|null} - Found node or null
 */
export function findNodeById(root, targetId) {
  if (root.id === targetId) {
    return root;
  }
  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * @param {Object} node - Root node
 * @returns {Array<string>} - Array of all node IDs
 */
export function getAllNodeIds(node) {
  const ids = [node.id];
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(...getAllNodeIds(child));
    });
  }
  return ids;
}

/**
 * @param {Object} root - Root node
 * @param {string} query - Search query
 * @returns {Array<string>} - Array of matching node IDs
 */
export function searchNodes(root, query) {
  const matches = [];
  const lowerQuery = query.toLowerCase();

  function search(node) {
    if (node.label.toLowerCase().includes(lowerQuery)) {
      matches.push(node.id);
    }
    if (node.children) {
      node.children.forEach(search);
    }
  }

  search(root);
  return matches;
}

/**
 * @param {Object} root - Root node
 * @param {string} targetId - Target node ID
 * @returns {Array<string>} - Array of node IDs from root to target
 */
export function getPathToNode(root, targetId) {
  const path = [];

  function findPath(node) {
    path.push(node.id);
    if (node.id === targetId) {
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (findPath(child)) {
          return true;
        }
      }
    }
    path.pop();
    return false;
  }

  findPath(root);
  return path;
}

