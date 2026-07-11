import { useRef, useEffect, useState } from 'react';
import { Renderer } from './Renderer';
import { PhysicsEngine} from './PhysicsEngine';

function App() {
    const canvasRef = useRef(null);

    const [status, setStatus] = useState("Waiting...");
    const [inputSource, setInputSource] = useState("");
    const [inputTarget, setInputTarget] = useState("");
    const [inputStartNode, setInputStartNode] = useState("0");
    const [uiEdges, setUiEdges] = useState([]);

    const nodesRef = useRef([]);
    const edgesRef = useRef([]);
    const stepsRef = useRef([]);
    const stepIndexRef = useRef(-1);

    const handleAddEdge = (e) => {
        e.preventDefault();

        if (inputSource === "" || inputTarget === "") return;

        const addNodeIfMissing = (nodeId) => {
            const exists = nodesRef.current.find(n => n.id === nodeId);
            if (!exists) {
                nodesRef.current.push({
                    id: nodeId,
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    vx: 0,
                    vy: 0
                });
            }
        };

        addNodeIfMissing(inputSource);
        addNodeIfMissing(inputTarget);

        const newEdge = {
            source: inputSource,
            target: inputTarget
        };
        edgesRef.current.push(newEdge);

        setUiEdges([...edgesRef.current]);
        setInputSource("");
        setInputTarget("");
    };

    const fetchBFS = async () => {
        if (nodesRef.current.length === 0) {
            alert("Please add at least 1 node");
            return;
        }

        setStatus("Processing...");

        const adjList = {};
        edgesRef.current.forEach(edge => {
            // Initialize arrays
            if (!adjList[edge.source]) adjList[edge.source] = [];
            if (!adjList[edge.target]) adjList[edge.target] = [];

            if (!adjList[edge.source].includes(parseInt(edge.target))) {
                adjList[edge.source].push(parseInt(edge.target));
            }
            if (!adjList[edge.target].includes(parseInt(edge.target))) {
                adjList[edge.source].push(parseInt(edge.target));
            }
        });

        // Convert edges into an adjacency list
        const payload = {
            algorithm: "BFS",
            startNode: parseInt(inputStartNode),
            adjacencyList: adjList
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
		const physics = new PhysicsEngine(nodesRef.current, edgesRef.current, canvas.width, canvas.height);

		let animationFrameId;

		const animate = () => {
			// Calculate new positions
			physics.update();

			// Clear the previous screen
			renderer.clearScreen();

			// Draw edges
			edgesRef.current.forEach(edge => {
				const n1 = nodesRef.current.find(n => n.id === edge.source);
				const n2 = nodesRef.current.find(n => n.id === edge.target);
				if (n1 && n2)
					renderer.drawLine(n1.x, n1.y, n2.x, n2.y);
			});

            // Extract current status
            const currentStepsArray = stepsRef.current;
            const currentIndex = stepIndexRef.current;
            const currentStepData = currentIndex >= 0 ? currentStepsArray[currentIndex] : null; 

			// Draw nodes
			nodesRef.current.forEach(node => {
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
        <div className="app-container">
            <div className = "sidebar">
                <h3>Graph Editor</h3>

                <form onSubmit={handleAddEdge} className="edge-form">
                    <div className="input-group">
                        <label>Source Node:</label>
                        <input
                            type="text"
                            className="input-field"
                            value={inputSource}
                            onChange={e => setInputSource(e.target.value)}
                            placeholder="Ex. 0"
                        />
                    </div>

                    <div className="input-group">
                        <label>Destination Node:</label>
                        <input
                            type="text"
                            className="input-field"
                            value={inputTarget}
                            onChange={e => setInputTarget(e.target.value)}
                            placeholder="Ex. 1"
                        />
                    </div>
                    <button type="submit" className="btn btn-add">Add Edge</button>
                </form>

                <h4>Current Edges:</h4>
                <ul className="edges-list">
                    {uiEdges.length === 0 ? <li>No edge</li> : uiEdges.map((e, i) => (
                        <li key={i}>{e.source} - {e.target}</li>
                    ))}
                </ul>

                <hr className="separator"/>

                <h3>BFS Controls</h3>
                <div className="bfs-controls">
                    <div className="input-group">
                        <label>Start Node:</label>
                        <input
                            type="text"
                            className="input-field"
                            value={inputStartNode}
                            onChange={e => setInputStartNode(e.target.value)}
                            placeholder="Ex. 0"
                        />
                    </div>
                    <button onClick={fetchBFS} className="btn btn-submit">Submit</button>
                </div>

                <div className="step-controls">
                    <button onClick={prevStep} className="btn btn-step">Previous</button>
                    <button onClick={nextStep} className="btn btn-step">Next</button>
                </div>

                <p className="status-text">Status: {status}</p>
            </div>


            <div className="canvas-container">
                <canvas ref={canvasRef} className="graph-canvas"/>
            </div>
        </div>
        
    );
}

export default App;
