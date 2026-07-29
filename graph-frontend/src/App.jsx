import { useRef, useEffect, useState } from 'react';
import './App.css';

// Import helper functions
import { parseGraphText } from './utils/GraphParser';
import { useGraphAnimation } from './utils/GraphAnimation';

// Import UI components
import { GraphEditor } from './components/GraphEditor';
import { AlgorithmControls } from './components/AlgorithmControl';
import { DataStructurePanel } from './components/DataStructurePanel';
import { GraphCanvas } from './components/GraphCanvas';


function App() {
    // Initial settings
    const [status, setStatus] = useState("Waiting...");
    const [inputSource, setInputSource] = useState("");
    const [inputTarget, setInputTarget] = useState("");
    const [inputStartNode, setInputStartNode] = useState("0");
    const [uiEdges, setUiEdges] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [uiStep, setUiStep] = useState(-1);
    const [stepsData, setStepsData] = useState([]);
    const [speedMs, setSpeedMs] = useState(1000);
    const [algorithm, setAlgorithm] = useState("BFS");
    const [graphText, setGraphText] = useState("0 1\n1 2\n0 2\n1 3\n1 4\n2 4");
    const [isDirected, setIsDirected] = useState(false);
    const [showWeights, setShowWeights] = useState(false);
    // Initialize references
    const canvasRef = useRef(null);
    const nodesRef = useRef([]);
    const edgesRef = useRef([]);
    const stepsRef = useRef([]);
    const stepIndexRef = useRef(-1);
    const draggedNodeRef = useRef(null);

    // Activate graphic engine
    useGraphAnimation(canvasRef, nodesRef, edgesRef, stepsRef, stepIndexRef, isDirected, showWeights);

    // Transform text into graph
    const handleApplyGraph = () => {
        const { updatedNodes, newEdges} = parseGraphText(graphText, nodesRef.current);

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

    useEffect(() => {
        handleApplyGraph();
    }, []);

    const fetchAlgorithm = async () => {
        if (nodesRef.current.length === 0) {
            alert("Please add at least 1 node");
            return;
        }

        setStatus("Processing...");

        const adjList = {};
        edgesRef.current.forEach(edge => {
            const src = parseInt(edge.source);
            const tgt = parseInt(edge.target);
            const wt = edge.weight;

            // Initialize arrays
            if (!adjList[src]) adjList[src] = [];
            if (!adjList[tgt]) adjList[tgt] = [];

            if (!adjList[src].some(n => n.to === tgt)) {
                adjList[src].push({ to: tgt, weight: wt });
            }

            if (!isDirected && !adjList[tgt].some(n => n.to === src)) {
                adjList[tgt].push({ to: src, weight: wt });
            }
        });

        // Convert edges into an adjacency list
        const payload = {
            algorithm: algorithm,
            startNode: parseInt(inputStartNode),
            adjacencyList: adjList
        };

        try {
            const response = await fetch("http://localhost:8080/api/algorithm", {
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
            setStatus(algorithm + "Animated");

        } catch (err) {
            console.error(err);
            setStatus("Connection error");
        }
    };

    // Handle Auto-Play
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                if (stepIndexRef.current < stepsRef.current.length - 1) {
                    stepIndexRef.current += 1;
                    setUiStep(stepIndexRef.current);
                }
                else
                    setIsPlaying(false);
            }, speedMs);
        }
        return () => clearInterval(interval);
    }, [isPlaying, speedMs]);

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
    <div className="page-wrapper">
        <div className="app-container">
            <div className="sidebar">
                <GraphEditor
                    graphText={graphText}
                    setGraphText={setGraphText}
                    onApplyGraph={handleApplyGraph}
                    isDirected={isDirected}
                    setIsDirected={setIsDirected}
                    showWeights={showWeights}
                    setShowWeights={setShowWeights}
                />

                <hr className="separator"/>

                <h3>Algorithm</h3>
                <AlgorithmControls
                    algorithm={algorithm} setAlgorithm={setAlgorithm}
                    inputStartNode={inputStartNode} setInputStartNode={setInputStartNode}
                    fetchAlgorithm={fetchAlgorithm}
                    speedMs={speedMs} setSpeedMs={setSpeedMs}
                    isPlaying={isPlaying} setIsPlaying={setIsPlaying}
                    uiStep={uiStep} stepsDataLength={stepsData.length}
                    prevStep={prevStep} nextStep={nextStep}
                />
            </div>

            <GraphCanvas
                canvasRef={canvasRef}
                handleMouseDown={handleMouseDown}
                handleMouseUp={handleMouseUp}
                handleMouseMove={handleMouseMove}
                handleMouseLeave={handleMouseUp}
                draggedNodeRef={draggedNodeRef}
            />
        </div>

        <DataStructurePanel
            algorithm={algorithm}
            currentStepInfo={currentStepInfo}
            uiStep={uiStep}
        />
    </div>
    );
}

export default App;
