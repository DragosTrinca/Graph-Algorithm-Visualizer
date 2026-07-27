import React from 'react';

export function GraphEditor({ graphText, setGraphText, onApplyGraph, isDirected, setIsDirected}) {
    return (
    <>
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

        <div className="input-group-horizontal" style={{ marginTop: '10px', marginBottom: '10px' }}>
            <input 
                type="checkbox" 
                id="directed-toggle"
                checked={isDirected}
                onChange={(e) => setIsDirected(e.target.checked)}
                style={{ cursor: 'pointer' }}
            />
            <label htmlFor="directed-toggle" style={{ cursor: 'pointer', fontSize: '14px', color: '#555' }}>
                Directed Graph
            </label>
        </div>

        <button onClick={onApplyGraph} className="btn btn-update" style={{ marginTop: '10px'}}>
            Display Graph
        </button>
    </>
    );
}