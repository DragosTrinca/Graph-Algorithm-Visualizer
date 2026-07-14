import { useRef, useEffect, useState } from 'react';
import { Renderer } from './Renderer';
import { PhysicsEngine} from './PhysicsEngine';
import './App.css';

function App() {
    const canvasRef = useRef(null);

    const [status, setStatus] = useState("Waiting...");
    const [inputSource, setInputSource] = useState("");
    const [inputTarget, setInputTarget] = useState("");
    const [inputStartNode, setInputStartNode] = useState("0");
    const [uiEdges, setUiEdges] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [uiStep, setUiStep] = useState(-1);
    const [stepsData, setStepsData] = useState([]);

    const nodesRef = useRef([]);
    const edgesRef = useRef([]);
    const stepsRef = useRef([]);
    const stepIndexRef = useRef(-1);
    const draggedNodeRef = useRef(null);

    const [graphText, setGraphText] = useState("0 1\n1 2\n0 2\n1 3\n1 4\n2 4");

    // Transform text into graph
    const handleApplyGraph = () => {
        const lines = graphText.split('\n');
        const newEdges = [];
        const newNodesSet = new Set();

        // Parse text line by line
        lines.forEach(line => {
            const parts = line.trim().split(/[\s,-]+/);
            if (parts.length >= 2 && parts[0] !== "" && parts[1] !=="") {
                const source = parts[0];
                const target = parts[1];
                newEdges.push({ source, target });
                newNodesSet.add(source);
                newNodesSet.add(target);
            }
        });

        // Build new nodes, keep old nodes on the same position
        const currentNodes = nodesRef.current;
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

        // Update arrays
        nodesRef.current.length = 0;
        updatedNodes.forEach(n => nodesRef.current.push(n));

        edgesRef.current.length = 0;
        newEdges.forEach(e => edgesRef.current.push(e));

        // Reset steps
        stepsRef.current = [];
        stepIndexRef.current = -1;
        setIsPlaying(false);
        setUiStep(-1);
        setStepsData([]);
        setStatus("Graph updated");
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
            if (!adjList[edge.target].includes(parseInt(edge.source))) {
                adjList[edge.target].push(parseInt(edge.source));
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
            setUiStep(0);
            setStepsData(data.steps);
            setStatus("BFS Animated");

        } catch (err) {
            console.error(err);
            setStatus("Connection error");
        }
    };

    // Handle Auto-Play
    useEffect(() => {
        let interval;
        if (isPlaying) {
            // Updates once per second
            interval = setInterval(() => {
                if (stepIndexRef.current < stepsRef.current.length - 1) {
                    stepIndexRef.current += 1;
                    setUiStep(stepIndexRef.current);
                }
                else
                    setIsPlaying(false);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        // Display initial graph
        handleApplyGraph();

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
        if (stepIndexRef.current < stepsRef.current.length - 1) {
            stepIndexRef.current += 1;
            setUiStep(stepIndexRef.current);
        }
    }

    const prevStep = () => {
        if (stepIndexRef.current > 0) {
            stepIndexRef.current -= 1;
            setUiStep(stepIndexRef.current);
        }
    }

    const currentStepInfo = uiStep >= 0 ? stepsData[uiStep] : null;

    const getMousePos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e) => {
        const pos = getMousePos(e);

        for (let i = nodesRef.current.length - 1; i >= 0; i--) {
            const node = nodesRef.current[i];
            const dx = pos.x - node.x;
            const dy = pos.y - node.y;

            // radius = 20 => radius^2 = 400
            if (dx * dx + dy * dy <= 400) {
                node.isDragged = true;
                draggedNodeRef.current = node;
                break;
            }
        }
    };

    const handleMouseMove = (e) => {
        if (draggedNodeRef.current) {
            const pos = getMousePos(e);
            draggedNodeRef.current.x = pos.x;
            draggedNodeRef.current.y = pos.y;
        }
    };

    const handleMouseUp = (e) => {
        if (draggedNodeRef.current) {
            draggedNodeRef.current.isDragged = false;
            draggedNodeRef.current = null;
        }
    };

    return (
        <div className="app-container">
            <div className = "sidebar">
                <h3>Graph Editor</h3>

                <div className="input-group">
                    <label>Edges (one per row):</label>
                    <textarea
                        className="input-field textarea-field"
                        value={graphText}
                        onChange={e => setGraphText(e.target.value)}
                        spellCheck="false"
                    />
                </div>
                <button onClick={handleApplyGraph} className="btn btn-update" style={{marginTop: '10px'}}>
                    Display Graph
                </button>

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
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="btn btn-play"
                        disabled={uiStep < 0 || uiStep >= stepsData.length - 1}>
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                    <button onClick={prevStep} className="btn btn-step">Previous</button>
                    <button onClick={nextStep} className="btn btn-step">Next</button>
                </div>

                <p className="status-text">Status: {status}</p>
            </div>


            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    className="graph-canvas"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseUp}
                />
            </div>
        </div>
        
    );
}

export default App;
