import React from 'react';

export function GraphEditor({ graphText, setGraphText, onApplyGraph}) {
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
        <button onClick={onApplyGraph} className="btn btn-update" style={{ marginTop: '10px'}}>
            Display Graph
        </button>
    </>
    );
}