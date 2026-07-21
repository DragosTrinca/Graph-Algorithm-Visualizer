import React from "react";

export function GraphCanvas({
    canvasRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
    draggedNodeRef
}) {
    return (
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
    );
}