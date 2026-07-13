export class PhysicsEngine {
    constructor(nodes, edges, width, height) {
        this.nodes = nodes;
        this.edges = edges;
        this.width = width;
        this.height = height;

        // Physics constants
        this.repulsion = 5000; // How much nodes reject eachother
        this.springLength = 100; // Ideal edge length
        this.springConstant = 0.05; // Edge elasticity
        this.damping = 0.85;  // Air friction
    }

    // Update 60 times per second
    update() {
        // Reset current forces
        this.nodes.forEach(node => {
            node.fx = 0;
            node.fy = 0;
        });

        // Nodes reject eachother
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                let n1 = this.nodes[i];
                let n2 = this.nodes[j];

                let dx = n1.x - n2.x;
                let dy = n1.y - n2.y;
                let distSq = dx * dx + dy * dy;

                if (distSq === 0) {
                    dx = Math.random();
                    dy = Math.random();
                    distSq = dx * dx + dy * dy;
                }

                let dist = Math.sqrt(distSq);
                let force = this.repulsion / distSq;

                let fx = (dx / dist) * force;
                let fy = (dy / dist) * force;

                n1.fx += fx;
                n1.fy += fy;
                n2.fx -= fx;
                n2.fy -= fy;
            }
        }

        // Edges attract nodes
        this.edges.forEach(edge => {
            let n1 = this.nodes.find(n => n.id === edge.source);
            let n2 = this.nodes.find(n => n.id === edge.target);

            if (!n1 || !n2) return;

            let dx = n2.x - n1.x;
            let dy = n2.y - n1.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            let force = this.springConstant * (dist - this.springLength);

            let fx = (dx / dist) * force;
            let fy = (dy / dist) * force;

            n1.fx += fx;
            n1.fy += fy;
            n2.fx -= fx;
            n2.fy -= fy;
        });

        // Attraction towards the center
        let centerX = this.width / 2;
        let centerY = this.height / 2;
        this.nodes.forEach(node => {
            node.fx += (centerX - node.x) * 0.01;
            node.fy += (centerY - node.y) * 0.01;
        })

        // Update coordinates
        this.nodes.forEach(node => {
            // Dragged nodes ignore other forces
            if (node.isDragged) {
                node.vx = 0;
                node.vy = 0;
                return;
            }

            node.vx = (node.vx + node.fx) * this.damping;
            node.vy = (node.vy + node.fy) * this.damping;

            node.x += node.vx;
            node.y += node.vy;
        });
    }
}