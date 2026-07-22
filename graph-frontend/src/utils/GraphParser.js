export function parseGraphText(graphText, currentNodes) {
    const lines = graphText.split('\n');
    const newEdges = [];
    const newNodesSet = new Set();

    // Parse text line by line
    lines.forEach(line => {
        const parts = line.trim().split(/[\s,-]+/);
        if (parts.length >= 2 && parts[0] !== "" && parts[1] !== "") {
            const source = parts[0];
            const target = parts[1];
            newEdges.push({ source, target });
            newNodesSet.add(source);
            newNodesSet.add(target);
        }
    });

    // Build new nodes, keep old nodes on the same position
    const updatedNodes = [];

    newNodesSet.forEach(nodeId => {
        const existingNode = currentNodes.find(n => n.id === nodeId);
        if (existingNode) updatedNodes.push(existingNode);
        else updatedNodes.push({
            id: nodeId,
            x: Math.random() * 800,
            y: Math.random() * 600,
            vx: 0,
            vy: 0
        });
    });

    return { updatedNodes, newEdges };
}