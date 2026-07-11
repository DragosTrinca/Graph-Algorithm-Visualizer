import { useRef, useEffect } from 'react';
import { Renderer } from './Renderer';
import { PhysicsEngine} from './PhysicsEngine';

function App() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = 800;
        canvas.height = 600;

        const renderer = new Renderer(canvas);

        const initialNodes = [
            { id: '0', x: Math.random() * 800, y: Math.random() * 600, vx: 0, vy: 0 },
            { id: '1', x: Math.random() * 800, y: Math.random() * 600, vx: 0, vy: 0 },
            { id: '2', x: Math.random() * 800, y: Math.random() * 600, vx: 0, vy: 0 },
            { id: '3', x: Math.random() * 800, y: Math.random() * 600, vx: 0, vy: 0 },
            { id: '4', x: Math.random() * 800, y: Math.random() * 600, vx: 0, vy: 0 }
        ];

        const initialEdges = [
            { source: '0', target: '1' },
      		{ source: '0', target: '2' },
      		{ source: '1', target: '3' },
      		{ source: '2', target: '4' },
      		{ source: '3', target: '4' }
    	];

		const physics = new PhysicsEngine(initialNodes, initialEdges, canvas.width, canvas.height);

		let animationFrameId;

		const animate = () => {
			// Calculate new positions
			physics.update();

			// Clear the previous screen
			renderer.clearScreen();

			// Draw edges
			initialEdges.forEach(edge => {
				const n1 = initialNodes.find(n => n.id === edge.source);
				const n2 = initialNodes.find(n => n.id === edge.target);
				if (n1 && n2)
					renderer.drawLine(n1.x, n1.y, n2.x, n2.y);
			});

			// Draw nodes
			initialNodes.forEach(node => {
				renderer.drawNode(node.x, node.y, '#224499', node.id);
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
            <h2>Graph Renderer</h2>
            <canvas
                ref={canvasRef}
                style={{
                    backgroundColor: 'f0f0f0',
                    border: '2px solid #ccc',
                    borderRadius: '8px'
                }}
            />
        </div>
    );
}

export default App;
