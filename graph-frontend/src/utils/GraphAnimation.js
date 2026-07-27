import { useEffect } from "react";
import { PhysicsEngine } from "./PhysicsEngine";
import { Renderer } from "./Renderer";

export function useGraphAnimation(canvasRef, nodesRef, edgesRef, stepsRef, stepIndexRef, isDirected) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
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
                    renderer.drawLine(n1.x, n1.y, n2.x, n2.y, isDirected);
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
                        color = '#22cc77';
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
    }, [canvasRef, nodesRef, edgesRef, stepsRef, stepIndexRef, isDirected]);
}