import React from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaPaperPlane } from 'react-icons/fa';

export function AlgorithmControls({
    algorithm, setAlgorithm,
    inputStartNode, setInputStartNode,
    fetchAlgorithm,
    speedMs, setSpeedMs,
    isPlaying, setIsPlaying,
    uiStep, stepsDataLength,
    prevStep, nextStep
}) {
    return (
        <div className="algo-controls">

            <div className="input-group-horizontal">
                <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="input-field"
                    style={{ width: '70px', padding: '5px' }}
                >
                    <option value="BFS">BFS</option>
                    <option value="DFS">DFS</option>
                </select>
            </div>
            <div className="algo-row row-1">
                <div className="input-group-horizontal">
                    <label>Start Node:</label>
                    <input
                        type="text"
                        className="input-field"
                        value={inputStartNode}
                        onChange={e => setInputStartNode(e.target.value)}
                        placeholder="Ex. 0"
                    />
                </div>
                <button onClick={fetchAlgorithm} className="btn btn-submit" title="Submit">
                    <FaPaperPlane />
                </button>
            </div>


            <div className="algo-row row-2">
                <div className="speed-control-horizontal">
                    <div className="speed-label">
                        <span>Speed: {speedMs} ms</span>
                    </div>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={speedMs}
                        onChange={(e) => setSpeedMs(Number(e.target.value))}
                        className="slider"
                    />
                </div>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn btn-play"
                    disabled={uiStep < 0 || uiStep >= stepsData.length - 1}
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
            </div>

            <div className="algo-row row-3">
                <button onClick={prevStep} className="btn btn-step" disabled={isPlaying} title="Previous step">
                    <FaStepBackward />
                </button>
                <button onClick={nextStep} className="btn btn-step" disabled={isPlaying} title="Next step">
                    <FaStepForward />
                </button>
            </div>
        </div>
    );
}