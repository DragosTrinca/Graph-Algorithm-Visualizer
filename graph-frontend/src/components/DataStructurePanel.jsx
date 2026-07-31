import React from "react";

export function DataStructurePanel({ algorithm, currentStepInfo, uiStep }) {
    return (
        <div className="bottom-panel">
            <div className="structure-panel">
                <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#223355' }}>
                    Data Structure ({algorithm === "BFS" ? "Queue" : (algorithm === "DFS" ? "Stack" : "Priority Queue")})
                </h4>
                <div className="structure-boxes">
                    {currentStepInfo && currentStepInfo.dataStructure && currentStepInfo.dataStructure.length > 0 ? (
                        currentStepInfo.dataStructure.map((qNode, idx) => (
                            <div
                                key={`${uiStep}-${idx}`} className='structure-box'
                                className={`structure-box ${idx === 0 ? 'first-item' : ''}`}
                            >
                                {qNode}
                            </div>
                        ))
                    ) : (
                        <span style={{ color: '#778888', fontSize: '14px' }}>
                            {uiStep >= 0 ? "Empty" : "Waiting for algorithm"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}