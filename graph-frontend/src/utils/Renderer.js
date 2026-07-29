export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLine(x1, y1, x2, y2, isDirected = false) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw arrow head for directed graphs
        if (isDirected) {
            const radius = 20;
            const angle = Math.atan2(y2 - y1, x2 - x1);

            const targetX = x2 - radius * Math.cos(angle);
            const targetY = y2 - radius * Math.sin(angle);

            const headlen = 12;

            this.ctx.beginPath();
            this.ctx.moveTo(targetX, targetY);
            this.ctx.lineTo(targetX - headlen * Math.cos(angle - Math.PI / 6), targetY - headlen * Math.sin(angle - Math.PI / 6));
            this.ctx.lineTo(targetX - headlen * Math.cos(angle + Math.PI / 6), targetY - headlen * Math.sin(angle + Math.PI / 6));
            this.ctx.lineTo(targetX, targetY);
            this.ctx.fillStyle = '#999';
            this.ctx.fill();
        }
    }

    drawWeight(x1, y1, x2, y2, weight) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        // Fill background
        this.ctx.beginPath();
        this.ctx.arc(midX, midY, 12, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Render weight
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(weight, midX, midY);
    }

    drawNode(x, y, color, id) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(id, x, y);
    }
}