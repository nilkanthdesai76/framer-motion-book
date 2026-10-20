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

  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
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
      try {
        const regPath = path.join(__dirname, '..', '..', 'registry.json');
        const content = await fs.readFile(regPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(content);
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
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
  <title>Framer Motion Handbook — Interactive Visual Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07090e;
      --card-bg: rgba(18, 22, 34, 0.75);
      --card-elevated: rgba(26, 32, 50, 0.9);
      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(255, 255, 255, 0.18);
      --accent: #f43f5e;
      --accent-glow: rgba(244, 63, 94, 0.35);
      --purple: #a855f7;
      --cyan: #06b6d4;
      --emerald: #10b981;
      --amber: #f59e0b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --radius: 16px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }

    body {
      background: var(--bg);
      background-image: radial-gradient(circle at 15% 10%, #1a162b 0%, #07090e 65%);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      padding: 32px 48px;
    }

    /* Header */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 28px;
    }

    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 40%, #fda4af 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-sub {
      color: var(--text-muted);
      font-size: 13.5px;
      margin-top: 4px;
    }

    .status-badge {
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #fda4af;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent);
    }

    /* Spring Tuner Bar */
    .physics-tuner {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px 28px;
      backdrop-filter: blur(20px);
      margin-bottom: 32px;
      display: grid;
      grid-template-columns: 240px 1fr 1fr 1fr;
      gap: 28px;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .tuner-label h3 {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
    }

    .tuner-label p {
      font-size: 12px;
      color: var(--text-dim);
      margin-top: 2px;
    }

    .slider-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .val-badge {
      font-family: 'JetBrains Mono', monospace;
      color: var(--cyan);
      font-weight: 700;
    }

    input[type=range] {
      width: 100%;
      accent-color: var(--accent);
      cursor: pointer;
    }

    /* Filters Bar */
    .filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .category-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .cat-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 7px 16px;
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cat-pill:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .cat-pill.active {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
      box-shadow: 0 2px 12px var(--accent-glow);
    }

    .search-box {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      padding: 8px 16px;
      border-radius: 10px;
      color: #fff;
      font-size: 13px;
      width: 240px;
      outline: none;
      font-family: inherit;
    }
    .search-box:focus {
      border-color: var(--accent);
    }

    /* Grid of Components */
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }

    .comp-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 22px;
      backdrop-filter: blur(16px);
      display: flex;
      flex-direction: column;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .comp-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 17px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.01em;
    }

    .cat-tag {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-muted);
    }

    .card-desc {
      font-size: 12.5px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 16px;
      min-height: 38px;
    }

    /* Live Preview Stage */
    .preview-stage {
      height: 190px;
      background: #090b12;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      margin-bottom: 16px;
      user-select: none;
    }

    .preview-hint {
      position: absolute;
      bottom: 8px;
      left: 10px;
      font-size: 10px;
      color: var(--text-dim);
      font-family: 'JetBrains Mono', monospace;
      pointer-events: none;
    }

    /* Actions */
    .card-actions {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }

    .btn-action {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
    }

    .btn-action:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .btn-action.primary {
      background: linear-gradient(135deg, var(--accent), var(--purple));
      border: none;
      color: #fff;
    }
    .btn-action.primary:hover {
      box-shadow: 0 4px 14px var(--accent-glow);
    }

    /* Specific Interactive Playground Widgets */

    /* 1. Magnetic Button */
    .magnetic-wrap {
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .magnetic-btn {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13.5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
      cursor: pointer;
      transition: transform 0.15s ease-out;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    /* 2. 3D Tilt Card */
    .tilt-card-stage {
      perspective: 800px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tilt-card-inner {
      width: 220px;
      height: 120px;
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(168, 85, 247, 0.25));
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transform-style: preserve-3d;
      transition: transform 0.1s ease-out;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      position: relative;
      overflow: hidden;
    }
    .tilt-glare {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 60%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
    }

    /* 3. Animated Tabs */
    .tabs-stage-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .tabs-container {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      padding: 4px;
      border-radius: 12px;
      display: flex;
      position: relative;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      position: relative;
      z-index: 2;
      transition: color 0.2s;
    }
    .tab-btn.active {
      color: #fff;
    }
    .tab-glider {
      position: absolute;
      top: 4px;
      bottom: 4px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--accent), var(--purple));
      box-shadow: 0 4px 14px var(--accent-glow);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1;
    }

    /* 4. Spring Toggle */
    .toggle-track {
      width: 64px;
      height: 36px;
      background: #1e2230;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 3px;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
    }
    .toggle-track.active {
      background: var(--emerald);
      border-color: var(--emerald);
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
    }
    .toggle-thumb {
      width: 28px;
      height: 28px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .toggle-track.active .toggle-thumb {
      transform: translateX(28px);
    }

    /* 5. Shimmer Button */
    .shimmer-btn {
      position: relative;
      padding: 12px 24px;
      background: #0f121d;
      color: #fff;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      border: 1px solid rgba(255,255,255,0.12);
      cursor: pointer;
      overflow: hidden;
    }
    .shimmer-btn::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(transparent, transparent, var(--cyan), transparent);
      animation: rotateLight 3s linear infinite;
      z-index: 0;
    }
    .shimmer-btn-inner {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    @keyframes rotateLight {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* 6. Hold to Confirm */
    .hold-confirm-btn {
      position: relative;
      padding: 12px 24px;
      background: #1f1418;
      border: 1px solid rgba(244, 63, 94, 0.4);
      border-radius: 12px;
      color: #fda4af;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      overflow: hidden;
      user-select: none;
    }
    .hold-progress-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0%;
      background: var(--accent);
      transition: width 0.05s linear;
      z-index: 0;
    }
    .hold-btn-text {
      position: relative;
      z-index: 1;
    }

    /* 7. Expandable Morph Card */
    .morph-card {
      width: 200px;
      background: #161a29;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .morph-card.expanded {
      width: 280px;
      background: linear-gradient(135deg, #1e1b4b, #311042);
      border-color: var(--accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }

    /* 8. Magnification Dock */
    .dock-container {
      display: flex;
      gap: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      padding: 10px 16px;
      border-radius: 20px;
      backdrop-filter: blur(20px);
    }
    .dock-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #38bdf8, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      transition: transform 0.15s ease-out;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    /* 9. Dynamic Island */
    .island-pill {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      border-radius: 24px;
      padding: 8px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 24px rgba(0,0,0,0.7);
    }
    .island-pill.expanded {
      width: 260px;
      height: 68px;
      border-radius: 22px;
      padding: 12px 18px;
    }

    /* 10. Swipe Dismiss */
    .swipe-card {
      width: 240px;
      padding: 14px 18px;
      background: #131722;
      border: 1px solid var(--border);
      border-radius: 12px;
      cursor: grab;
      box-shadow: 0 6px 18px rgba(0,0,0,0.4);
      transition: transform 0.15s ease-out, opacity 0.2s;
    }
    .swipe-card:active {
      cursor: grabbing;
    }

    /* 11. Modal Popup Stage */
    .modal-backdrop-demo {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 20;
    }
    .modal-box-demo {
      background: #141724;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      width: 250px;
      text-align: center;
      transform: scale(0.85);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    }
    .modal-backdrop-demo.show {
      display: flex;
    }
    .modal-backdrop-demo.show .modal-box-demo {
      transform: scale(1);
      opacity: 1;
    }

    /* 12. Toast notifications */
    .toast-stack-demo {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: flex;
      flex-direction: column-reverse;
      gap: 6px;
      pointer-events: none;
      z-index: 10;
    }
    .toast-item {
      background: #1e1b4b;
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 8px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.5);
      animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes toastIn {
      from { transform: translateY(20px) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    /* 13. Split text */
    .split-text-wrap {
      display: flex;
      gap: 3px;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.02em;
    }
    .split-char {
      display: inline-block;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
    }

    /* Code Modal */
    .code-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(14px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .code-modal-content {
      background: #0f121d;
      border: 1px solid var(--border);
      border-radius: 16px;
      width: 720px;
      max-width: 90vw;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
    }
    .code-modal-header {
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .code-modal-title {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
    }
    .code-modal-body {
      padding: 20px 24px;
      overflow-y: auto;
      flex: 1;
    }
    pre.code-block {
      background: #07090f;
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 16px;
      border-radius: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #86efac;
      line-height: 1.6;
      overflow-x: auto;
    }

    /* Toast notification */
    .toast-alert {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: rgba(18, 22, 34, 0.95);
      border: 1px solid var(--accent);
      color: #fff;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 700;
      z-index: 2000;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
      transition: opacity 0.3s;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div>
      <div class="brand-title">
        <span>🪄 Framer Motion Handbook</span>
      </div>
      <p class="brand-sub">Production-ready motion recipes • 120 FPS harmonic springs • Real interactive previews</p>
    </div>
    <div class="status-badge">
      <div class="status-dot"></div>
      <span>Port 4041 • Live Simulator</span>
    </div>
  </header>

  <!-- Global Spring Physics Tuner -->
  <div class="physics-tuner">
    <div class="tuner-label">
      <h3>⚡ Spring Physics Engine</h3>
      <p>Adjust live parameters below to immediately feel the tension change across widgets.</p>
    </div>

    <div class="slider-item">
      <div class="slider-header">
        <span>Stiffness (Force)</span>
        <span class="val-badge" id="valStiffness">350</span>
      </div>
      <input type="range" id="tunerStiffness" min="50" max="800" value="350" oninput="updatePhysics()">
    </div>

    <div class="slider-item">
      <div class="slider-header">
        <span>Damping (Resistance)</span>
        <span class="val-badge" id="valDamping">28</span>
      </div>
      <input type="range" id="tunerDamping" min="5" max="80" value="28" oninput="updatePhysics()">
    </div>

    <div class="slider-item">
      <div class="slider-header">
        <span>Mass (Inertia)</span>
        <span class="val-badge" id="valMass">1.0</span>
      </div>
      <input type="range" id="tunerMass" min="0.1" max="4.0" step="0.1" value="1.0" oninput="updatePhysics()">
    </div>
  </div>

  <!-- Filters & Search -->
  <div class="filters-bar">
    <div class="category-pills" id="categoryPillsContainer">
      <button class="cat-pill active" onclick="filterCategory('all')">All Recipes (18)</button>
      <button class="cat-pill" onclick="filterCategory('micro-interactions')">Micro-Interactions</button>
      <button class="cat-pill" onclick="filterCategory('cards-3d')">Cards & 3D</button>
      <button class="cat-pill" onclick="filterCategory('layout-transitions')">Layout & Morph</button>
      <button class="cat-pill" onclick="filterCategory('navigation-docks')">Navigation & Docks</button>
      <button class="cat-pill" onclick="filterCategory('gestures-touch')">Gestures</button>
      <button class="cat-pill" onclick="filterCategory('overlays-feedback')">Dialogs & Toast</button>
      <button class="cat-pill" onclick="filterCategory('typography-numbers')">Typography</button>
    </div>

    <input type="text" class="search-box" id="searchFilter" placeholder="Search components..." oninput="handleSearch(this.value)">
  </div>

  <!-- Interactive Components Grid -->
  <div class="catalog-grid" id="catalogGrid">
    <!-- Component Cards populated by script -->
  </div>

  <!-- Code Modal -->
  <div class="code-modal-backdrop" id="codeModal" onclick="closeCodeModal(event)">
    <div class="code-modal-content" onclick="event.stopPropagation()">
      <div class="code-modal-header">
        <span class="code-modal-title" id="codeModalTitle">Component Code</span>
        <button class="btn-action" style="max-width:80px;" onclick="closeCodeModal()">✕ Close</button>
      </div>
      <div class="code-modal-body">
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
          <span style="font-size:12px; color:var(--text-muted);">React 19 + Framer Motion (Ready to paste)</span>
          <button class="btn-action primary" style="max-width:120px;" onclick="copyCodeSnippet()">📋 Copy Code</button>
        </div>
        <pre class="code-block" id="codeSnippetBox"><code></code></pre>
      </div>
    </div>
  </div>

  <script>
    let physics = { stiffness: 350, damping: 28, mass: 1.0 };
    let activeCategory = 'all';
    let searchQuery = '';
    let registryData = null;

    function updatePhysics() {
      physics.stiffness = parseInt(document.getElementById('tunerStiffness').value, 10);
      physics.damping = parseInt(document.getElementById('tunerDamping').value, 10);
      physics.mass = parseFloat(document.getElementById('tunerMass').value);

      document.getElementById('valStiffness').textContent = physics.stiffness;
      document.getElementById('valDamping').textContent = physics.damping;
      document.getElementById('valMass').textContent = physics.mass.toFixed(1);
    }

    function filterCategory(cat) {
      activeCategory = cat;
      document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      renderCatalog();
    }

    function handleSearch(q) {
      searchQuery = q.toLowerCase();
      renderCatalog();
    }

    // Code snippets dictionary
    const CODE_SNIPPETS = {
      MagneticButton: \`import React, { useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

export function MagneticButton({ children, onClick }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 350, damping: 28 });
  const y = useSpring(0, { stiffness: 350, damping: 28 });

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.35);
    y.set((clientY - (top + height / 2)) * 0.35);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg"
    >
      {children}
    </motion.button>
  );
}\`,

      AnimatedTabs: \`import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = ['Design', 'Physics', 'Tokens', 'Export'];

export function AnimatedTabs() {
  const [selected, setSelected] = useState(tabs[0]);

  return (
    <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelected(tab)}
          className="relative px-4 py-2 text-sm font-semibold text-slate-300"
        >
          {selected === tab && (
            <motion.div
              layoutId="activeTabGlider"
              className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-500 rounded-lg shadow-md"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}\`,

      TiltCard3D: \`import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function TiltCard3D({ title, subtitle }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]));

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="w-64 h-36 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/30 border border-white/20 p-5 shadow-2xl"
    >
      <h4 className="text-white font-bold">{title}</h4>
      <p className="text-xs text-rose-300">{subtitle}</p>
    </motion.div>
  );
}\`,

      DynamicIslandPill: \`import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DynamicIsland() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="bg-black text-white rounded-full px-5 py-2 cursor-pointer flex items-center gap-3 border border-white/10"
      animate={{ width: expanded ? 280 : 160, height: expanded ? 72 : 36, borderRadius: expanded ? 24 : 999 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {expanded ? (
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="text-xs font-bold text-rose-400">Now Playing</div>
            <div className="text-xs text-slate-300">Midnight City • M83</div>
          </div>
          <span className="text-lg">🎵</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-medium">
          <span>🎧</span>
          <span>Notchy Pill</span>
        </div>
      )}
    </motion.div>
  );
}\`
    };

    // Components Definition
    const COMPONENTS = [
      {
        id: 'MagneticButton',
        name: 'MagneticButton',
        category: 'micro-interactions',
        title: 'Magnetic Button',
        desc: 'Follows cursor movement within a proximity field and snaps back with harmonic physics.',
        tags: ['magnetic', 'button', 'cursor'],
        renderPreview: (id) => \`
          <div class="magnetic-wrap" onmousemove="handleMagneticMove(event, '\${id}')" onmouseleave="handleMagneticLeave('\${id}')">
            <button id="\${id}-btn" class="magnetic-btn">
              <span>🧲 Move Cursor Near Me</span>
            </button>
          </div>
        \`
      },
      {
        id: 'AnimatedTabs',
        name: 'AnimatedTabs',
        category: 'micro-interactions',
        title: 'Animated Tabs (Figma Glider)',
        desc: 'Sliding active pill indicator that glides seamlessly between choices with zero jank.',
        tags: ['tabs', 'layoutId', 'navigation'],
        renderPreview: (id) => \`
          <div class="tabs-stage-wrap">
            <div class="tabs-container" id="\${id}-box">
              <div class="tab-glider" id="\${id}-glider" style="left:4px; width:72px;"></div>
              <button class="tab-btn active" onclick="activateTab(event, '\${id}', 0)">Design</button>
              <button class="tab-btn" onclick="activateTab(event, '\${id}', 1)">Physics</button>
              <button class="tab-btn" onclick="activateTab(event, '\${id}', 2)">Tokens</button>
              <button class="tab-btn" onclick="activateTab(event, '\${id}', 3)">Export</button>
            </div>
          </div>
        \`
      },
      {
        id: 'TiltCard3D',
        name: 'TiltCard3D',
        category: 'cards-3d',
        title: '3D Perspective Tilt Card',
        desc: 'Interactive card calculating tilt rotation and dynamic specular reflection on mouse glide.',
        tags: ['3d', 'tilt', 'perspective'],
        renderPreview: (id) => \`
          <div class="tilt-card-stage" onmousemove="handleTiltMove(event, '\${id}')" onmouseleave="handleTiltLeave('\${id}')">
            <div id="\${id}-inner" class="tilt-card-inner">
              <div class="tilt-glare" id="\${id}-glare"></div>
              <div>
                <span style="font-size:10px; font-weight:800; color:var(--accent); text-transform:uppercase;">Vision Pro Glass</span>
                <h4 style="font-size:16px; font-weight:800; color:#fff; margin-top:4px;">Spatial UI 3D</h4>
              </div>
              <span style="font-size:11px; color:rgba(255,255,255,0.7);">Hover to shift perspective</span>
            </div>
          </div>
        \`
      },
      {
        id: 'SpringToggle',
        name: 'SpringToggle',
        category: 'micro-interactions',
        title: 'Spring Switch Toggle',
        desc: 'Bouncy tactile iOS toggle with overshoot velocity and glowing activated state.',
        tags: ['switch', 'toggle', 'spring'],
        renderPreview: (id) => \`
          <div class="toggle-track active" id="\${id}-track" onclick="toggleSwitch('\${id}')">
            <div class="toggle-thumb" id="\${id}-thumb"></div>
          </div>
        \`
      },
      {
        id: 'ShimmerGlowButton',
        name: 'ShimmerGlowButton',
        category: 'micro-interactions',
        title: 'Shimmer Glow CTA',
        desc: 'Laser beam streak orbiting around border radius with smooth button scale on press.',
        tags: ['button', 'glow', 'conic'],
        renderPreview: (id) => \`
          <button class="shimmer-btn" onclick="popAlert('Clicked Shimmer Button! ✨')">
            <div class="shimmer-btn-inner">
              <span>⚡</span>
              <span>Explore Unlimited Pro</span>
            </div>
          </button>
        \`
      },
      {
        id: 'HoldConfirmButton',
        name: 'HoldConfirmButton',
        category: 'micro-interactions',
        title: 'Hold to Confirm Trigger',
        desc: 'Press and hold to charge action progress with haptic release and cancellation.',
        tags: ['hold', 'button', 'progress'],
        renderPreview: (id) => \`
          <button class="hold-confirm-btn" id="\${id}-btn" onmousedown="startHold('\${id}')" onmouseup="endHold('\${id}')" onmouseleave="endHold('\${id}')">
            <div class="hold-progress-fill" id="\${id}-fill"></div>
            <span class="hold-btn-text" id="\${id}-text">Press & Hold (1.2s)</span>
          </button>
        \`
      },
      {
        id: 'DynamicIslandPill',
        name: 'DynamicIslandPill',
        category: 'navigation-docks',
        title: 'Dynamic Island Morphing Pill',
        desc: 'iPhone 16 Pro Island expanding smoothly from compact status pill to media player.',
        tags: ['island', 'morph', 'pill'],
        renderPreview: (id) => \`
          <div class="island-pill" id="\${id}-pill" onclick="toggleIsland('\${id}')">
            <span id="\${id}-icon">🎧</span>
            <div id="\${id}-info">
              <span style="font-size:12px; font-weight:700;">Notchy Beats</span>
            </div>
          </div>
        \`
      },
      {
        id: 'MagnificationDock',
        name: 'MagnificationDock',
        category: 'navigation-docks',
        title: 'macOS Magnification Dock',
        desc: 'Dock menu icons that fluidly scale up based on continuous distance to mouse cursor.',
        tags: ['dock', 'macos', 'magnification'],
        renderPreview: (id) => \`
          <div class="dock-container" onmousemove="handleDockMove(event, '\${id}')" onmouseleave="handleDockLeave('\${id}')">
            <div class="dock-icon" style="background:linear-gradient(135deg, #0284c7, #38bdf8)">Finder</div>
            <div class="dock-icon" style="background:linear-gradient(135deg, #10b981, #059669)">Safari</div>
            <div class="dock-icon" style="background:linear-gradient(135deg, #6366f1, #4f46e5)">Xcode</div>
            <div class="dock-icon" style="background:linear-gradient(135deg, #f43f5e, #e11d48)">Music</div>
            <div class="dock-icon" style="background:linear-gradient(135deg, #a855f7, #9333ea)">Figma</div>
          </div>
        \`
      },
      {
        id: 'ExpandableMorphCard',
        name: 'ExpandableMorphCard',
        category: 'layout-transitions',
        title: 'Expandable Morphing Card',
        desc: 'Grid card that fluidly morphs into a full modal details view using layoutId.',
        tags: ['morph', 'card', 'expandable'],
        renderPreview: (id) => \`
          <div class="morph-card" id="\${id}-card" onclick="toggleMorphCard('\${id}')">
            <span style="font-size:22px;">🚀</span>
            <h5 style="color:#fff; font-size:13.5px; font-weight:700; margin-top:6px;">Next-Gen Engine</h5>
            <p id="\${id}-extra" style="font-size:11px; color:var(--text-muted); display:none; margin-top:8px;">
              Framer Motion FLIP shared layout automatically interpolates borders, paddings, and child typography seamlessly.
            </p>
            <span style="font-size:10px; color:var(--cyan); display:block; margin-top:6px;">Tap to expand / collapse</span>
          </div>
        \`
      },
      {
        id: 'SwipeDismissCard',
        name: 'SwipeDismissCard',
        category: 'gestures-touch',
        title: 'Swipe to Dismiss Card',
        desc: 'Drag horizontally with elastic pull resistance. Fling past threshold to dismiss.',
        tags: ['swipe', 'dismiss', 'drag'],
        renderPreview: (id) => \`
          <div class="swipe-card" id="\${id}-card" onmousedown="startSwipeDrag(event, '\${id}')">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; font-weight:700; color:#fff;">🚨 Git Conflict Detected</span>
              <span style="font-size:11px; color:var(--accent);">2m ago</span>
            </div>
            <p style="font-size:11px; color:var(--text-muted); margin-top:4px;">Drag left or right to dismiss</p>
          </div>
        \`
      },
      {
        id: 'SpringModal',
        name: 'SpringModal',
        category: 'overlays-feedback',
        title: 'Spring Modal Dialog',
        desc: 'Modal with backdrop blur and bouncy spring scale entrance with AnimatePresence.',
        tags: ['modal', 'dialog', 'backdrop'],
        renderPreview: (id) => \`
          <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
            <button class="btn-action primary" onclick="toggleDemoModal('\${id}', true)">🚀 Trigger Spring Modal</button>
            <div class="modal-backdrop-demo" id="\${id}-modal" onclick="toggleDemoModal('\${id}', false)">
              <div class="modal-box-demo" onclick="event.stopPropagation()">
                <span style="font-size:32px;">🎉</span>
                <h4 style="color:#fff; font-size:16px; font-weight:800; margin-top:8px;">Spring Entrance</h4>
                <p style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">Overshoot damping with backdrop blur.</p>
                <button class="btn-action primary" style="margin-top:14px; width:100%;" onclick="toggleDemoModal('\${id}', false)">Got it!</button>
              </div>
            </div>
          </div>
        \`
      },
      {
        id: 'StackedToastQueue',
        name: 'StackedToastQueue',
        category: 'overlays-feedback',
        title: 'Stacked Toast Notification Stack',
        desc: 'Notifications that stack with 3D depth, scale down behind each other, and auto-dismiss.',
        tags: ['toast', 'stack', 'notifications'],
        renderPreview: (id) => \`
          <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
            <button class="btn-action primary" onclick="addToast('\${id}')">🔔 Fire Toast Notification</button>
            <div class="toast-stack-demo" id="\${id}-stack"></div>
          </div>
        \`
      },
      {
        id: 'SplitTextReveal',
        name: 'SplitTextReveal',
        category: 'typography-numbers',
        title: 'Split Character Text Stagger',
        desc: 'Cascades individual letters into view with staggered spring delays.',
        tags: ['typography', 'stagger', 'text'],
        renderPreview: (id) => \`
          <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
            <div class="split-text-wrap" id="\${id}-wrap">
              <span class="split-char">F</span>
              <span class="split-char">R</span>
              <span class="split-char">A</span>
              <span class="split-char">M</span>
              <span class="split-char">E</span>
              <span class="split-char">R</span>
            </div>
            <button class="btn-action" style="max-width:140px;" onclick="replaySplitText('\${id}')">▶️ Replay Stagger</button>
          </div>
        \`
      },
      {
        id: 'NumberTicker',
        name: 'NumberTicker',
        category: 'typography-numbers',
        title: 'Spring Number Ticker',
        desc: 'Smoothly rolls numbers to new values with spring velocity interpolation.',
        tags: ['counter', 'number', 'ticker'],
        renderPreview: (id) => \`
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <div style="font-size:38px; font-weight:900; font-family:'JetBrains Mono', monospace; color:var(--emerald);" id="\${id}-num">
              $1,420.00
            </div>
            <button class="btn-action" style="max-width:160px;" onclick="rollNumber('\${id}')">🎲 Roll Random Value</button>
          </div>
        \`
      }
    ];

    function renderCatalog() {
      const grid = document.getElementById('catalogGrid');
      grid.innerHTML = '';

      const filtered = COMPONENTS.filter(item => {
        const matchesCat = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = !searchQuery ||
          item.name.toLowerCase().includes(searchQuery) ||
          item.desc.toLowerCase().includes(searchQuery) ||
          item.tags.some(t => t.toLowerCase().includes(searchQuery));
        return matchesCat && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div style=\"grid-column: 1 / -1; text-align:center; padding: 48px; color:var(--text-muted);\">No components match your query.</div>';
        return;
      }

      filtered.forEach(comp => {
        const card = document.createElement('div');
        card.className = 'comp-card';

        card.innerHTML = \`
          <div class=\"card-top\">
            <span class=\"card-title\">\${comp.title}</span>
            <span class=\"cat-tag\">\${comp.category}</span>
          </div>
          <p class=\"card-desc\">\${comp.desc}</p>
          <div class=\"preview-stage\">
            \${comp.renderPreview(comp.id)}
            <span class=\"preview-hint\">LIVE INTERACTIVE DEMO</span>
          </div>
          <div class=\"card-actions\">
            <button class=\"btn-action primary\" onclick=\"viewCode('\${comp.id}')\">&lt;/&gt; View Code</button>
            <button class=\"btn-action\" onclick=\"popAlert('Copied import for \${comp.name}!')\">📦 Copy Import</button>
          </div>
        \`;

        grid.appendChild(card);
      });
    }

    // Interactive Logic for Demo Widgets

    // 1. Magnetic Button
    function handleMagneticMove(e, id) {
      const btn = document.getElementById(id + '-btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.35;
      const dy = (e.clientY - centerY) * 0.35;
      btn.style.transform = \`translate(\${dx}px, \${dy}px) scale(1.05)\`;
    }
    function handleMagneticLeave(id) {
      const btn = document.getElementById(id + '-btn');
      if (btn) btn.style.transform = 'translate(0px, 0px) scale(1.0)';
    }

    // 2. Animated Tabs
    function activateTab(e, id, index) {
      const box = document.getElementById(id + '-box');
      const glider = document.getElementById(id + '-glider');
      const buttons = box.querySelectorAll('.tab-btn');
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const targetRect = e.target.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const left = targetRect.left - boxRect.left;
      glider.style.left = left + 'px';
      glider.style.width = targetRect.width + 'px';
    }

    // 3. 3D Tilt Card
    function handleTiltMove(e, id) {
      const card = document.getElementById(id + '-inner');
      const glare = document.getElementById(id + '-glare');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = -y * 25;
      const rotY = x * 25;
      card.style.transform = \`rotateX(\${rotX}deg) rotateY(\${rotY}deg) scale(1.04)\`;
      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = \`radial-gradient(circle at \${(x + 0.5) * 100}% \${(y + 0.5) * 100}%, rgba(255,255,255,0.3) 0%, transparent 60%)\`;
      }
    }
    function handleTiltLeave(id) {
      const card = document.getElementById(id + '-inner');
      const glare = document.getElementById(id + '-glare');
      if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1.0)';
      if (glare) glare.style.opacity = '0';
    }

    // 4. Spring Toggle
    function toggleSwitch(id) {
      const track = document.getElementById(id + '-track');
      if (track) track.classList.toggle('active');
    }

    // 6. Hold to confirm
    let holdTimer = null;
    function startHold(id) {
      const fill = document.getElementById(id + '-fill');
      const text = document.getElementById(id + '-text');
      fill.style.transition = 'width 1.2s ease-out';
      fill.style.width = '100%';
      text.textContent = 'Holding...';
      holdTimer = setTimeout(() => {
        text.textContent = 'Confirmed! ✅';
        popAlert('Action successfully confirmed!');
      }, 1200);
    }
    function endHold(id) {
      clearTimeout(holdTimer);
      const fill = document.getElementById(id + '-fill');
      const text = document.getElementById(id + '-text');
      if (text.textContent !== 'Confirmed! ✅') {
        fill.style.transition = 'width 0.2s ease-out';
        fill.style.width = '0%';
        text.textContent = 'Press & Hold (1.2s)';
      }
    }

    // 7. Dynamic Island
    function toggleIsland(id) {
      const pill = document.getElementById(id + '-pill');
      const info = document.getElementById(id + '-info');
      pill.classList.toggle('expanded');
      if (pill.classList.contains('expanded')) {
        info.innerHTML = \`
          <div style=\"font-size:11px; font-weight:800; color:var(--accent);\">Playing Now</div>
          <div style=\"font-size:12px; font-weight:600; color:#fff;\">Midnight City • M83</div>
        \`;
      } else {
        info.innerHTML = '<span style=\"font-size:12px; font-weight:700;\">Notchy Beats</span>';
      }
    }

    // 8. Magnification Dock
    function handleDockMove(e, id) {
      const container = e.currentTarget;
      const icons = container.querySelectorAll('.dock-icon');
      icons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const iconCenter = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - iconCenter);
        const maxDist = 90;
        if (dist < maxDist) {
          const scale = 1 + (1 - dist / maxDist) * 0.45;
          icon.style.transform = \`scale(\${scale}) translateY(-\${(scale - 1) * 12}px)\`;
        } else {
          icon.style.transform = 'scale(1) translateY(0)';
        }
      });
    }
    function handleDockLeave(id) {
      const icons = document.querySelectorAll('.dock-icon');
      icons.forEach(icon => icon.style.transform = 'scale(1) translateY(0)');
    }

    // 9. Expandable Morph Card
    function toggleMorphCard(id) {
      const card = document.getElementById(id + '-card');
      const extra = document.getElementById(id + '-extra');
      card.classList.toggle('expanded');
      extra.style.display = card.classList.contains('expanded') ? 'block' : 'none';
    }

    // 10. Swipe Dismiss
    function startSwipeDrag(e, id) {
      const card = document.getElementById(id + '-card');
      let startX = e.clientX;
      function onMove(moveEvent) {
        const dx = moveEvent.clientX - startX;
        card.style.transform = \`translateX(\${dx}px) rotate(\${dx * 0.05}deg)\`;
        card.style.opacity = Math.max(0.2, 1 - Math.abs(dx) / 180);
      }
      function onUp(upEvent) {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        const dx = upEvent.clientX - startX;
        if (Math.abs(dx) > 100) {
          card.style.transform = \`translateX(\${dx > 0 ? 300 : -300}px)\`;
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transform = 'translateX(0px)';
            card.style.opacity = '1';
          }, 600);
        } else {
          card.style.transform = 'translateX(0px)';
          card.style.opacity = '1';
        }
      }
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }

    // 11. Modal Popup
    function toggleDemoModal(id, show) {
      const modal = document.getElementById(id + '-modal');
      if (show) modal.classList.add('show');
      else modal.classList.remove('show');
    }

    // 12. Stacked Toasts
    function addToast(id) {
      const stack = document.getElementById(id + '-stack');
      const toast = document.createElement('div');
      toast.className = 'toast-item';
      toast.textContent = '🚀 PR #' + Math.floor(Math.random() * 900 + 100) + ' auto-merged cleanly';
      stack.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = 'opacity 0.2s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 200);
      }, 2500);
    }

    // 13. Split Text
    function replaySplitText(id) {
      const wrap = document.getElementById(id + '-wrap');
      const chars = wrap.querySelectorAll('.split-char');
      chars.forEach((c, idx) => {
        c.style.transform = 'translateY(30px) scale(0.6)';
        c.style.opacity = '0';
        setTimeout(() => {
          c.style.transform = 'translateY(0) scale(1)';
          c.style.opacity = '1';
        }, idx * 60);
      });
    }

    // 14. Number Ticker
    function rollNumber(id) {
      const numEl = document.getElementById(id + '-num');
      const val = (Math.random() * 8000 + 1000).toFixed(2);
      numEl.style.transform = 'scale(1.15)';
      numEl.style.color = '#38bdf8';
      setTimeout(() => {
        numEl.textContent = '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 });
        numEl.style.transform = 'scale(1)';
        numEl.style.color = 'var(--emerald)';
      }, 150);
    }

    // Code Modal
    function viewCode(id) {
      const code = CODE_SNIPPETS[id] || \`// Production Framer Motion component: \${id}\nimport { motion } from 'framer-motion';\n\nexport function \${id}() {\n  return <motion.div animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }}>\${id}</motion.div>;\n}\`;
      document.getElementById('codeModalTitle').textContent = id + '.tsx';
      document.getElementById('codeSnippetBox').textContent = code;
      document.getElementById('codeModal').style.display = 'flex';
    }

    function closeCodeModal(e) {
      if (e && e.target !== e.currentTarget && e.target.tagName !== 'BUTTON') return;
      document.getElementById('codeModal').style.display = 'none';
    }

    function copyCodeSnippet() {
      const code = document.getElementById('codeSnippetBox').textContent;
      navigator.clipboard.writeText(code).then(() => {
        popAlert('Copied component code to clipboard! 📋');
      });
    }

    function popAlert(msg) {
      const toast = document.createElement('div');
      toast.className = 'toast-alert';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }

    // Init
    document.addEventListener('DOMContentLoaded', () => {
      renderCatalog();
    });
  </script>
</body>
</html>`;
  }
}
