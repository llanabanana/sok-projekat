let GRAPH_DATA = { nodes: {}, edges: [] };

const treeState = {
    selectedView: 'simple-view',
    expandedNodes: new Set()
};

// Returns display name for a node, falling back to the node id.
function getNodeName(nodeId) {
    const node = GRAPH_DATA.nodes[nodeId];
    return node?.attributes?.name || nodeId;
}

// Builds an adjacency map (source node -> sorted list of child node ids).
function getAdjacencyMap() {
    const adjacency = {};

    Object.keys(GRAPH_DATA.nodes).forEach(nodeId => {
        adjacency[nodeId] = [];
    });

    GRAPH_DATA.edges.forEach(edge => {
        if (adjacency[edge.source]) {
            adjacency[edge.source].push(edge.target);
        }
    });

    Object.keys(adjacency).forEach(nodeId => {
        adjacency[nodeId].sort((left, right) => {
            return getNodeName(left).localeCompare(getNodeName(right));
        });
    });

    return adjacency;
}

let ADJACENCY_MAP = {};

// Determines tree roots by in-degree; if none exist, treats all nodes as roots.
function getRootNodeIds() {
    const inDegree = {};
    Object.keys(GRAPH_DATA.nodes).forEach(nodeId => {
        inDegree[nodeId] = 0;
    });

    GRAPH_DATA.edges.forEach(edge => {
        if (inDegree[edge.target] !== undefined) {
            inDegree[edge.target] += 1;
        }
    });

    const roots = Object.keys(inDegree).filter(nodeId => inDegree[nodeId] === 0);
    const allNodes = Object.keys(GRAPH_DATA.nodes);
    const treeRoots = roots.length > 0 ? roots : allNodes;

    treeRoots.sort((left, right) => {
        return getNodeName(left).localeCompare(getNodeName(right));
    });

    return treeRoots;
}

// Toggles expand/collapse state for a specific rendered node instance.
function toggleNode(nodeKey) {
    if (treeState.expandedNodes.has(nodeKey)) {
        treeState.expandedNodes.delete(nodeKey);
    } else {
        treeState.expandedNodes.add(nodeKey);
    }

    renderTreeView();
}

// Creates a container with node attribute key/value rows (used in block view).
function createAttributesElement(attributes) {
    const attributesContainer = document.createElement('div');
    attributesContainer.className = 'tree-attributes';

    Object.entries(attributes).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'tree-attribute-item';
        item.textContent = `${key}: ${value}`;
        attributesContainer.appendChild(item);
    });

    return attributesContainer;
}

// Recursively renders one tree node, its optional attributes, and expanded children.
function createTreeNodeElement(nodeId, depth, ancestorPath, lineage) {
    const node = GRAPH_DATA.nodes[nodeId];
    const children = ADJACENCY_MAP[nodeId] || [];
    const nodeKey = lineage.join('>');
    const isExpanded = treeState.expandedNodes.has(nodeKey);

    const wrapper = document.createElement('div');
    wrapper.className = 'tree-node';

    const row = document.createElement('div');
    row.className = 'tree-node-row';
    row.style.paddingLeft = `${depth * 18}px`;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'tree-toggle-btn';
    toggleButton.type = 'button';
    toggleButton.textContent = isExpanded ? '-' : '+';
    toggleButton.addEventListener('click', () => toggleNode(nodeKey));

    const label = document.createElement('span');
    label.className = 'tree-node-name';
    label.textContent = node.attributes.name || nodeId;

    row.appendChild(toggleButton);
    row.appendChild(label);
    wrapper.appendChild(row);

    if (isExpanded && treeState.selectedView === 'block-view' && Object.keys(node.attributes).length > 0) {
        const attrs = createAttributesElement(node.attributes);
        attrs.style.marginLeft = `${depth * 18 + 36}px`;
        wrapper.appendChild(attrs);
    }

    if (isExpanded && children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';

        children.forEach(childId => {
            const nextPath = new Set(ancestorPath);
            nextPath.add(childId);
            const nextLineage = [...lineage, childId];
            childrenContainer.appendChild(createTreeNodeElement(childId, depth + 1, nextPath, nextLineage));
        });

        wrapper.appendChild(childrenContainer);
    }

    return wrapper;
}

// Renders (or re-renders) the full tree view inside the tree container.
function renderTreeView() {
    const treeContainer = document.querySelector('.tree-view-container');
    if (!treeContainer) {
        return;
    }

    let content = treeContainer.querySelector('.tree-content');
    if (!content) {
        content = document.createElement('div');
        content.className = 'tree-content';
        treeContainer.appendChild(content);
    }

    content.innerHTML = '';

    const rootNodeIds = getRootNodeIds();
    if (rootNodeIds.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'tree-empty';
        empty.textContent = 'No nodes loaded.';
        content.appendChild(empty);
        return;
    }

    rootNodeIds.forEach(rootId => {
        const path = new Set();
        path.add(rootId);
        content.appendChild(createTreeNodeElement(rootId, 0, path, [rootId]));
    });
}

// Updates local graph state, rebuilds adjacency map, and refreshes the tree UI.
function setGraphData(graphData) {
    GRAPH_DATA = graphData || { nodes: {}, edges: [] };
    ADJACENCY_MAP = getAdjacencyMap();
    renderTreeView();
}

// Receives globally loaded graph data from main.js and applies it to tree view.
window.addEventListener('graphDataLoaded', function (event) {
    setGraphData(event.detail);
});

// On first load, use already available shared graph data if present, otherwise render empty state.
document.addEventListener('DOMContentLoaded', function () {
    if (window.APP_GRAPH_DATA && Object.keys(window.APP_GRAPH_DATA.nodes || {}).length > 0) {
        setGraphData(window.APP_GRAPH_DATA);
    } else {
        renderTreeView();
    }
});
