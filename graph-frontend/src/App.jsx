import { useRef, useEffect, useState } from 'react';
import { Renderer } from './Renderer';
import { PhysicsEngine} from './PhysicsEngine';

function App() {
    const canvasRef = useRef(null);

    const [status, setStatus] = useState("Waiting...");

    const stepsRef = useRef([]);
    const stepIndexRef = useRef(-1);

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

    const fetchBFS = async () => {
        setStatus("Processing...");

        // Convert edges into an adjacency list
        const payload = {
            algorithm: "BFS",
            startNode: 0,
            adjacencyList: {
                "0": [1, 2],
                "1": [0, 3],
                "2": [0, 4],
                "3": [1, 4],
                "4": [2, 3]
            }
        };

        try {
            const response = await fetch("http://localhost:8080/api/bfs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Server error");

            const data = await response.json();

            stepsRef.current = data.steps;
            stepIndexRef.current = 0;
            setStatus("BFS Animated");

        } catch (err) {
            console.error(err);
            setStatus("Connection error");
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = 800;
        canvas.height = 600;

        const renderer = new Renderer(canvas);
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

            // Extract current status
            const currentStepsArray = stepsRef.current;
            const currentIndex = stepIndexRef.current;
            const currentStepData = currentIndex >= 0 ? currentStepsArray[currentIndex] : null; 

			// Draw nodes
			initialNodes.forEach(node => {
                let color = '#3333f9';

                if (currentStepData) {
                    const nodeIdInt = parseInt(node.id);

                    if (currentStepData.currentNode === nodeIdInt) {
                        color = '#f93333';
                    } else if (currentStepData.visitedNodes.includes(nodeIdInt)) {
                        color = '#f99933';
                    }
                }

				renderer.drawNode(node.x, node.y, color, node.id);
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const nextStep = () => {
        if (stepIndexRef.current < stepsRef.current.length - 1)
            stepIndexRef.current += 1;
    }

    const prevStep = () => {
        if (stepIndexRef.current > 0)
            stepIndexRef.current -= 1;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
            <h2>Graph Visualizer</h2>

            <div style={{ marginBottom: '15px', gap: '10px', display: 'flex', alignItems: 'center'}}>
                <button onClick={fetchBFS} style={{ padding: '8px 16px', cursor: 'pointer'}}>BFS</button>
                <button onClick={prevStep} style={{ padding: '8px 16px', cursor: 'pointer'}}>Previous</button>
                <button onClick={nextStep} style={{ padding: '8px 16px', cursor: 'pointer'}}>Next</button>
                <span style={{ color: '#555'}}>Status: {status}</span>
            </div>

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
