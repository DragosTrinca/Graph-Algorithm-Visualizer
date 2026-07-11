import { useRef, useEffect } from 'react';
import { Renderer } from './Renderer';

function App() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = 800;
        canvas.height = 600;

        const renderer = new Renderer(canvas);

        renderer.clearScreen();

        renderer.drawLine(200, 200, 500, 400);

        renderer.drawNode(200, 200, '#3498db', '0');
        renderer.drawNode(500, 400, '#e74c3c', '1');

    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
            <h2>Graph Renderer</h2>
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
