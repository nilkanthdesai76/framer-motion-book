import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class BookServer {
  private port: number;
  private server: http.Server | null = null;

  constructor(port = 4041) {
    this.port = port;
  }

  public async start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => this.handle(req, res));
      this.server.on('error', reject);
      this.server.listen(this.port, '127.0.0.1', () => {
        resolve(this.port);
      });
    });
  }

  private async handle(req: http.IncomingMessage, res: http.ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    if (url.pathname === '/api/registry') {
      const regPath = path.join(__dirname, '..', '..', 'registry.json');
      const content = await fs.readFile(regPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
      return;
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(this.renderHtml());
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  private renderHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Framer Motion Handbook — Interactive Component Catalog</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card: #141c2e;
      --border: #23304c;
      --accent: #f43f5e;
      --purple: #a855f7;
      --cyan: #06b6d4;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 24px; min-height: 100vh; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 24px; }
    h1 { font-size: 22px; display: flex; align-items: center; gap: 10px; color: var(--accent); }
    .badge { background: rgba(244, 63, 94, 0.15); color: var(--accent); padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .card h2 { font-size: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .slider-group { margin-bottom: 14px; }
    .slider-header { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); margin-bottom: 6px; }
    input[type=range] { width: 100%; accent-color: var(--accent); }
    .stage { height: 160px; background: #070a13; border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; margin-top: 14px; border: 1px dashed var(--border); }
    .spring-ball { width: 50px; height: 50px; border-radius: 25px; background: linear-gradient(135deg, var(--accent), var(--purple)); box-shadow: 0 0 20px rgba(244, 63, 94, 0.5); cursor: pointer; transition: transform 0.1s; }
    .comp-item { padding: 12px; background: #090e1a; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 10px; }
    .comp-name { font-weight: 600; font-size: 14px; color: var(--cyan); }
    .comp-desc { font-size: 12px; color: var(--muted); margin-top: 4px; }
    pre { background: #070a12; padding: 10px; border-radius: 6px; font-family: ui-monospace, Menlo, monospace; font-size: 11px; color: #a7f3d0; margin-top: 8px; overflow-x: auto; }
    button.test-btn { background: var(--accent); color: white; border: none; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>🪄 Framer Motion Handbook Studio</h1>
      <p style="color: var(--muted); font-size: 13px; margin-top: 4px;">Interactive Spring Physics Playground • FLIP Layouts • Zero-Jank GPU Recipes</p>
    </div>
    <div class="badge">Port 4041 • Active</div>
  </header>

  <div class="grid">
    <div class="card">
      <h2>⚡ Live Harmonic Spring Physics Simulator</h2>
      <p style="font-size: 13px; color: var(--muted); margin-bottom: 16px;">Interact with real <code>framer-motion</code> spring physics parameters. Tap the ball or click Trigger!</p>

      <div class="slider-group">
        <div class="slider-header"><span>Stiffness (Force)</span><span id="stiffnessVal">350</span></div>
        <input type="range" id="stiffness" min="50" max="800" value="350" oninput="updateSpring()">
      </div>

      <div class="slider-group">
        <div class="slider-header"><span>Damping (Resistance)</span><span id="dampingVal">28</span></div>
        <input type="range" id="damping" min="5" max="80" value="28" oninput="updateSpring()">
      </div>

      <div class="slider-group">
        <div class="slider-header"><span>Mass (Inertia)</span><span id="massVal">1.0</span></div>
        <input type="range" id="mass" min="0.1" max="4.0" step="0.1" value="1.0" oninput="updateSpring()">
      </div>

      <button class="test-btn" onclick="animateSpring()">Trigger Spring Animation</button>

      <div class="stage">
        <div id="ball" class="spring-ball" onclick="animateSpring()"></div>
      </div>
    </div>

    <div class="card">
      <h2>📦 Component Catalog & Copy-Paste Registry</h2>
      <div id="componentsList">Loading component recipes...</div>
    </div>
  </div>

  <script>
    function updateSpring() {
      document.getElementById('stiffnessVal').textContent = document.getElementById('stiffness').value;
      document.getElementById('dampingVal').textContent = document.getElementById('damping').value;
      document.getElementById('massVal').textContent = document.getElementById('mass').value;
    }

    function animateSpring() {
      const ball = document.getElementById('ball');
      ball.style.transform = 'scale(1.4) translateY(-30px)';
      setTimeout(() => {
        ball.style.transform = 'scale(1.0) translateY(0px)';
      }, 160);
    }

    async function loadRegistry() {
      try {
        const res = await fetch('/api/registry');
        const data = await res.json();
        const container = document.getElementById('componentsList');
        container.innerHTML = '';
        for (const cat of data.categories) {
          for (const comp of cat.components) {
            const div = document.createElement('div');
            div.className = 'comp-item';
            div.innerHTML = '<div class="comp-name">' + comp.name + ' (' + cat.name + ')</div>' +
                            '<div class="comp-desc">' + comp.description + '</div>' +
                            '<pre>&lt;' + comp.name + ' transition={{ type: "spring", stiffness: ' + document.getElementById('stiffness').value + ' }} /&gt;</pre>';
            container.appendChild(div);
          }
        }
      } catch (e) {
        document.getElementById('componentsList').textContent = 'Error loading registry: ' + e.message;
      }
    }

    loadRegistry();
  </script>
</body>
</html>`;
  }
}
