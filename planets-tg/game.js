/* ============================================================
 MERGE COSMOS — game logic
 Canvas 2D + Matter.js + Web Audio API, no external assets.
 ============================================================ */
(function () {
  'use strict';

const TG_BOT_USERNAME = 'planet_merge_game_bot';
const ADSGRAM_BLOCK_ID = '61632';
const LEADERBOARD_DB_URL = "https://planet-merge-lb-default-rtdb.europe-west1.firebasedatabase.app/leaderboard";

  /* ------------------------------------------------------------
 Helpers
 ------------------------------------------------------------ */
  const TAU = Math.PI * 2;
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const fmt = (n) => n.toLocaleString('ru-RU');
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  if (!window.Matter) {
    const el = $('fatal');
    if (el) el.classList.add('show');
    return;
  }

  const M = window.Matter;
  const Engine = M.Engine;
  const Composite = M.Composite;
  const Bodies = M.Bodies;
  const Body = M.Body;
  const Events = M.Events;
  const Sleeping = M.Sleeping;

  /* ------------------------------------------------------------
 World constants
 ------------------------------------------------------------ */
  let WORLD_W = 400;
  let WORLD_H = 600;
  let DANGER_Y = 120;
  let HOLD_Y = -36;
  let SPAWN_Y = 30;
  const MAX_LEVEL = 10;
  const DROP_COOLDOWN = 0.42;
  const DANGER_TIME = 5.0;
  const FIXED_DT = 1000 / 60;
  const MAX_STEPS_PER_FRAME = 3;
  const MAX_FRAME_MS = 50;
  const MAX_PARTICLES = 35;
  const BEST_KEY = 'merge_cosmos_best_v2';
  const MUTE_KEY = 'mergeCosmos.muted.v1';
  const VIP_KEY = 'vipExpiresAt';
  const VIP_KEY_LEGACY = 'merge_cosmos_vip_until_v2';
  const VIP_ADS_KEY = 'merge_cosmos_vip_ads_v1';
  const SHAKE_KEY = 'merge_cosmos_shake_charges_v2';
  const CLEAN_KEY = 'merge_cosmos_clean_charges_v2';
  const DAILY_KEY = 'lastDailyBonusDate_v2';
  const THEME_KEY = 'merge_cosmos_theme_v1';
  const THEME_ADS_KEY = 'merge_cosmos_theme_ads_v1';
  const DAILY7_KEY = 'merge_cosmos_daily7_v1';
  const START_CHARGES = 1;
  const VIP_HOURS = 24;
  const VIP_ADS_REQUIRED = 5;
  const VIP_BONUS_COOLDOWN = 45000;

  const FONT = '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';

  /* ------------------------------------------------------------
 Canvas drawing helpers (used once per sprite)
 ------------------------------------------------------------ */
  function jarOutline(c, w, h, rTop, rBot) {
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(w, 0);
    c.lineTo(w, h - rBot);
    c.quadraticCurveTo(w, h, w - rBot, h);
    c.lineTo(rBot, h);
    c.quadraticCurveTo(0, h, 0, h - rBot);
    c.closePath();
  }

  function jarRimPath(c, w, h, rBot) {
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, h - rBot);
    c.quadraticCurveTo(0, h, rBot, h);
    c.lineTo(w - rBot, h);
    c.quadraticCurveTo(w, h, w, h - rBot);
    c.lineTo(w, 0);
  }

  function blob(c, x, y, rx, ry, rot) {
    c.beginPath();
    c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, TAU);
    c.fill();
  }

  function crater(c, x, y, rad, strength) {
    const s = strength == null ? 1 : strength;
    c.save();
    const g = c.createRadialGradient(x - rad * 0.3, y - rad * 0.3, rad * 0.08, x, y, rad * 1.06);
    g.addColorStop(0, 'rgba(18,13,9,' + (0.36 * s).toFixed(3) + ')');
    g.addColorStop(0.68, 'rgba(18,13,9,' + (0.2 * s).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(255,248,235,' + (0.12 * s).toFixed(3) + ')');
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(x, y, Math.max(0.2, rad), Math.max(0.2, rad * 0.86), 0.25, 0, TAU);
    c.fill();
    c.strokeStyle = 'rgba(255,248,235,' + (0.14 * s).toFixed(3) + ')';
    c.lineWidth = Math.max(0.6, rad * 0.11);
    c.stroke();
    c.restore();
  }

  function gloss(c, r, alpha) {
    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.4, -r * 0.46, 0, -r * 0.24, -r * 0.3, r * 1.02);
    g.addColorStop(0, 'rgba(255,255,255,' + alpha.toFixed(3) + ')');
    g.addColorStop(0.36, 'rgba(255,255,255,' + (alpha * 0.22).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);
    c.restore();
  }

  /* ------------------------------------------------------------
 The ten celestial bodies
 ------------------------------------------------------------ */
  function drawAsteroid(c, r) {
    const rng = mulberry32(11);

    c.save();
    c.shadowColor = 'rgba(0,0,0,0.55)';
    c.shadowBlur = r * 0.5;
    c.shadowOffsetY = r * 0.16;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#6b5a49';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.38, -r * 0.42, r * 0.08, 0, 0, r * 1.25);
    g.addColorStop(0, '#e8dac7');
    g.addColorStop(0.32, '#c2ae96');
    g.addColorStop(0.68, '#93806b');
    g.addColorStop(1, '#463528');
    c.fillStyle = g;
    c.fillRect(-r * 1.3, -r * 1.3, r * 2.6, r * 2.6);

    crater(c, -r * 0.34, -r * 0.12, r * 0.26, 1.1);
    crater(c, r * 0.32, r * 0.12, r * 0.17, 1);
    crater(c, r * 0.02, r * 0.5, r * 0.11, 0.9);
    crater(c, -r * 0.5, r * 0.5, r * 0.09, 0.8);

    const rng2 = mulberry32(53);
    for (let i = 0; i < 14; i++) {
      const a = rng2() * TAU;
      const rr = rng2() * r * 0.85;
      c.fillStyle = 'rgba(70,55,42,' + (0.1 + rng2() * 0.16).toFixed(3) + ')';
      c.beginPath();
      c.arc(Math.cos(a) * rr, Math.sin(a) * rr, r * (0.02 + rng2() * 0.035), 0, TAU);
      c.fill();
    }
    c.restore();

    c.beginPath();
    c.arc(0, 0, r * 0.985, 0, TAU);
    c.strokeStyle = 'rgba(255,236,210,0.4)';
    c.lineWidth = Math.max(0.8, r * 0.055);
    c.stroke();

    gloss(c, r, 0.18);
  }

  function drawMoon(c, r) {
    c.save();
    c.shadowColor = 'rgba(0,0,0,0.55)';
    c.shadowBlur = r * 0.45;
    c.shadowOffsetY = r * 0.14;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#8b877f';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.4, -r * 0.42, r * 0.05, 0, 0, r * 1.15);
    g.addColorStop(0, '#fffdf3');
    g.addColorStop(0.35, '#e3ded1');
    g.addColorStop(0.72, '#aaa396');
    g.addColorStop(1, '#575049');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);

    c.fillStyle = 'rgba(105,108,120,0.24)';
    blob(c, -r * 0.18, -r * 0.22, r * 0.45, r * 0.28, 0.2);
    blob(c, r * 0.34, r * 0.18, r * 0.3, r * 0.2, -0.5);
    blob(c, -r * 0.3, r * 0.45, r * 0.25, r * 0.14, 0.4);

    crater(c, r * 0.22, -r * 0.4, r * 0.17, 1.2);
    crater(c, -r * 0.45, r * 0.16, r * 0.13, 1);
    crater(c, r * 0.05, r * 0.45, r * 0.1, 1);
    crater(c, r * 0.52, -r * 0.02, r * 0.09, 0.9);
    crater(c, -r * 0.05, r * 0.02, r * 0.07, 0.7);
    c.restore();

    c.beginPath();
    c.arc(0, 0, r * 0.99, 0, TAU);
    c.strokeStyle = 'rgba(255,255,240,0.28)';
    c.lineWidth = Math.max(0.6, r * 0.035);
    c.stroke();
    gloss(c, r, 0.2);
  }

  function drawMercury(c, r) {
    c.save();
    c.shadowColor = 'rgba(0,0,0,0.5)';
    c.shadowBlur = r * 0.4;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#8a6a50';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.38, -r * 0.42, r * 0.06, 0, 0, r * 1.14);
    g.addColorStop(0, '#f3e3cd');
    g.addColorStop(0.35, '#d3b696');
    g.addColorStop(0.72, '#9c7658');
    g.addColorStop(1, '#4a2f20');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);

    crater(c, -r * 0.32, -r * 0.28, r * 0.2, 1);
    crater(c, r * 0.36, r * 0.1, r * 0.14, 1);
    crater(c, -r * 0.05, r * 0.48, r * 0.1, 0.9);
    crater(c, r * 0.5, -r * 0.4, r * 0.08, 0.8);

    c.strokeStyle = 'rgba(255,238,215,0.16)';
    c.lineWidth = Math.max(0.6, r * 0.02);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU + 0.4;
      c.beginPath();
      c.moveTo(Math.cos(a) * r * 0.15, Math.sin(a) * r * 0.15);
      c.lineTo(Math.cos(a) * r * 1.1, Math.sin(a) * r * 1.1);
      c.stroke();
    }
    c.restore();

    c.beginPath();
    c.arc(0, 0, r * 0.99, 0, TAU);
    c.strokeStyle = 'rgba(255,230,205,0.3)';
    c.lineWidth = Math.max(0.6, r * 0.03);
    c.stroke();
    gloss(c, r, 0.2);
  }

  function drawMars(c, r) {
    c.save();
    c.shadowColor = 'rgba(60,10,0,0.5)';
    c.shadowBlur = r * 0.45;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#94361c';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.36, -r * 0.4, r * 0.06, 0, 0, r * 1.14);
    g.addColorStop(0, '#ffc79c');
    g.addColorStop(0.3, '#f08a55');
    g.addColorStop(0.62, '#c4502c');
    g.addColorStop(0.86, '#7d2411');
    g.addColorStop(1, '#3d0c04');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);

    c.fillStyle = 'rgba(90,28,14,0.3)';
    blob(c, -r * 0.3, -r * 0.1, r * 0.38, r * 0.24, -0.4);
    blob(c, r * 0.28, r * 0.3, r * 0.33, r * 0.18, 0.5);

    c.strokeStyle = 'rgba(80,22,8,0.35)';
    c.lineWidth = r * 0.055;
    c.beginPath();
    c.moveTo(-r * 0.55, -r * 0.06);
    c.quadraticCurveTo(0, r * 0.08, r * 0.62, -r * 0.2);
    c.stroke();

    c.fillStyle = 'rgba(255,248,242,0.9)';
    blob(c, 0, -r * 0.89, r * 0.4, r * 0.14, 0);

    crater(c, r * 0.14, r * 0.18, r * 0.13, 1);
    crater(c, -r * 0.44, r * 0.4, r * 0.09, 0.9);
    crater(c, r * 0.46, -r * 0.34, r * 0.08, 0.8);
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r * 1.02, 0, TAU);
    c.strokeStyle = 'rgba(255,130,80,0.35)';
    c.lineWidth = Math.max(0.7, r * 0.035);
    c.stroke();
    c.restore();

    gloss(c, r, 0.22);
  }

  function drawEarth(c, r) {
    const atm = c.createRadialGradient(0, 0, r * 0.82, 0, 0, r * 1.2);
    atm.addColorStop(0, 'rgba(80,190,255,0)');
    atm.addColorStop(0.68, 'rgba(90,200,255,0.26)');
    atm.addColorStop(1, 'rgba(70,160,255,0)');
    c.fillStyle = atm;
    c.beginPath();
    c.arc(0, 0, r * 1.2, 0, TAU);
    c.fill();

    c.save();
    c.shadowColor = 'rgba(0,20,60,0.5)';
    c.shadowBlur = r * 0.4;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#2c6bb0';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.38, -r * 0.42, r * 0.05, 0, 0, r * 1.12);
    g.addColorStop(0, '#d7f7ff');
    g.addColorStop(0.25, '#74c8ff');
    g.addColorStop(0.55, '#2a7fe0');
    g.addColorStop(0.82, '#0d3f8f');
    g.addColorStop(1, '#051b45');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);

    c.fillStyle = '#5fc46e';
    blob(c, -r * 0.44, -r * 0.3, r * 0.3, r * 0.2, -0.3);
    blob(c, r * 0.48, r * 0.34, r * 0.22, r * 0.15, 0.4);
    blob(c, r * 0.2, -r * 0.52, r * 0.22, r * 0.12, 0.3);
    blob(c, r * 0.1, r * 0.58, r * 0.2, r * 0.12, -0.2);

    c.fillStyle = '#4aa85c';
    blob(c, -r * 0.52, -r * 0.1, r * 0.15, r * 0.26, 0.5);
    blob(c, r * 0.55, -r * 0.3, r * 0.1, r * 0.18, -0.2);

    c.fillStyle = 'rgba(160,215,130,0.5)';
    blob(c, -r * 0.38, -r * 0.42, r * 0.13, r * 0.07, 0.4);
    blob(c, r * 0.44, r * 0.26, r * 0.1, r * 0.06, -0.3);

    c.fillStyle = 'rgba(230,200,120,0.32)';
    blob(c, r * 0.3, -r * 0.08, r * 0.14, r * 0.08, 0.3);

    c.fillStyle = 'rgba(255,255,255,0.55)';
    blob(c, -r * 0.32, r * 0.44, r * 0.34, r * 0.075, 0.1);
    blob(c, r * 0.3, -r * 0.44, r * 0.28, r * 0.07, -0.2);
    blob(c, -r * 0.54, r * 0.08, r * 0.17, r * 0.055, 0.3);
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r * 0.995, 0, TAU);
    c.strokeStyle = 'rgba(150,230,255,0.6)';
    c.lineWidth = Math.max(0.8, r * 0.03);
    c.stroke();
    c.restore();

    gloss(c, r, 0.28);
  }

  function drawNeptune(c, r) {
    const glow = c.createRadialGradient(0, 0, r * 0.9, 0, 0, r * 1.26);
    glow.addColorStop(0, 'rgba(80,140,255,0)');
    glow.addColorStop(0.8, 'rgba(80,150,255,0.2)');
    glow.addColorStop(1, 'rgba(50,100,255,0)');
    c.fillStyle = glow;
    c.beginPath();
    c.arc(0, 0, r * 1.26, 0, TAU);
    c.fill();

    c.save();
    c.shadowColor = 'rgba(0,10,60,0.55)';
    c.shadowBlur = r * 0.4;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#12309c';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.36, -r * 0.4, r * 0.05, 0, 0, r * 1.14);
    g.addColorStop(0, '#dcf6ff');
    g.addColorStop(0.3, '#63adff');
    g.addColorStop(0.6, '#2a4fd6');
    g.addColorStop(0.85, '#0b1d78');
    g.addColorStop(1, '#050a35');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);

    c.fillStyle = 'rgba(180,225,255,0.16)';
    blob(c, -r * 0.1, -r * 0.45, r * 0.8, r * 0.07, 0);
    blob(c, r * 0.1, -r * 0.2, r * 0.75, r * 0.05, 0);
    blob(c, -r * 0.05, r * 0.24, r * 0.8, r * 0.06, 0);

    c.fillStyle = 'rgba(8,20,90,0.42)';
    blob(c, r * 0.42, r * 0.42, r * 0.17, r * 0.09, -0.15);
    c.strokeStyle = 'rgba(160,215,255,0.28)';
    c.lineWidth = Math.max(0.6, r * 0.015);
    c.beginPath();
    c.ellipse(r * 0.42, r * 0.42, r * 0.17, r * 0.09, -0.15, 0, TAU);
    c.stroke();

    c.fillStyle = 'rgba(255,255,255,0.4)';
    blob(c, -r * 0.35, r * 0.42, r * 0.2, r * 0.04, 0.2);
    blob(c, r * 0.45, -r * 0.35, r * 0.15, r * 0.035, -0.1);
    c.restore();

    c.beginPath();
    c.arc(0, 0, r * 0.99, 0, TAU);
    c.strokeStyle = 'rgba(150,215,255,0.5)';
    c.lineWidth = Math.max(0.8, r * 0.032);
    c.stroke();

    gloss(c, r, 0.25);
  }

  function saturnRings(c, r) {
    const rings = [
      [1.42, 0.035, 'rgba(205,175,120,0.3)'],
      [1.52, 0.09, 'rgba(246,226,178,0.55)'],
      [1.63, 0.025, 'rgba(190,160,110,0.18)'],
      [1.72, 0.075, 'rgba(238,214,164,0.48)'],
      [1.84, 0.04, 'rgba(255,240,205,0.4)'],
      [1.94, 0.025, 'rgba(200,170,120,0.28)'],
    ];
    for (let i = 0; i < rings.length; i++) {
      const rx = rings[i][0];
      const w = rings[i][1];
      c.beginPath();
      c.ellipse(0, 0, r * rx, r * rx * 0.36, 0, 0, TAU);
      c.lineWidth = Math.max(0.7, r * w);
      c.strokeStyle = rings[i][2];
      c.stroke();
    }
  }

  function drawSaturn(c, r) {
    c.save();
    saturnRings(c, r);
    c.restore();

    c.save();
    c.shadowColor = 'rgba(60,30,0,0.5)';
    c.shadowBlur = r * 0.35;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#d9b878';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.08, 0, 0, r * 1.12);
    g.addColorStop(0, '#fff6d8');
    g.addColorStop(0.35, '#f0d9a4');
    g.addColorStop(0.7, '#c9a45e');
    g.addColorStop(1, '#6d4c20');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);

    c.fillStyle = 'rgba(180,140,80,0.22)';
    c.fillRect(-r, -r * 0.45, r * 2, r * 0.12);
    c.fillRect(-r, r * 0.05, r * 2, r * 0.14);
    c.fillRect(-r, r * 0.42, r * 2, r * 0.08);
    c.fillStyle = 'rgba(255,245,210,0.18)';
    c.fillRect(-r, -r * 0.2, r * 2, r * 0.08);
    c.fillRect(-r, r * 0.3, r * 2, r * 0.06);
    c.restore();

    c.save();
    c.beginPath();
    c.rect(-r * 2.1, 0, r * 4.2, r * 1.1);
    c.clip();
    saturnRings(c, r);
    c.restore();

    c.beginPath();
    c.arc(0, 0, r * 0.985, 0, TAU);
    c.strokeStyle = 'rgba(255,246,215,0.45)';
    c.lineWidth = Math.max(0.8, r * 0.03);
    c.stroke();
    gloss(c, r, 0.24);
  }

  function drawJupiter(c, r) {
    c.save();
    c.shadowColor = 'rgba(40,15,0,0.5)';
    c.shadowBlur = r * 0.4;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = '#b07a4e';
    c.fill();
    c.restore();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const g = c.createRadialGradient(-r * 0.36, -r * 0.4, r * 0.06, 0, 0, r * 1.13);
    g.addColorStop(0, '#fff0d4');
    g.addColorStop(0.35, '#ecc59a');
    g.addColorStop(0.7, '#b9855e');
    g.addColorStop(1, '#5e3923');
    c.fillStyle = g;
    c.fillRect(-r, -r, r * 2, r * 2);

    const bands = [
      [-0.85, 0.2, 'rgba(120,70,45,0.35)'],
      [-0.6, 0.22, 'rgba(255,225,190,0.3)'],
      [-0.35, 0.18, 'rgba(180,110,70,0.35)'],
      [-0.1, 0.22, 'rgba(255,235,200,0.28)'],
      [0.15, 0.2, 'rgba(170,100,60,0.38)'],
      [0.4, 0.2, 'rgba(248,220,185,0.26)'],
      [0.62, 0.22, 'rgba(140,85,55,0.35)'],
      [0.85, 0.16, 'rgba(90,55,35,0.4)'],
    ];
    for (let i = 0; i < bands.length; i++) {
      c.fillStyle = bands[i][2];
      c.fillRect(-r, bands[i][0] * r, r * 2, bands[i][1] * r);
    }

    const rng = mulberry32(71);
    for (let i = 0; i < 16; i++) {
      const yy = (rng() * 1.7 - 0.85) * r;
      c.fillStyle = i % 2 ? 'rgba(255,240,215,0.09)' : 'rgba(90,50,30,0.09)';
      c.beginPath();
      c.ellipse((rng() * 2 - 1) * r * 0.8, yy, r * (0.1 + rng() * 0.16), r * 0.035, 0, 0, TAU);
      c.fill();
    }

    const sx = r * 0.32;
    const sy = r * 0.24;
    const spot = c.createRadialGradient(sx - r * 0.05, sy - r * 0.03, r * 0.02, sx, sy, r * 0.3);
    spot.addColorStop(0, '#ffb08a');
    spot.addColorStop(0.5, '#e0603c');
    spot.addColorStop(1, 'rgba(150,50,30,0.1)');
    c.fillStyle = spot;
    c.beginPath();
    c.ellipse(sx, sy, r * 0.28, r * 0.15, -0.2, 0, TAU);
    c.fill();
    c.strokeStyle = 'rgba(255,210,180,0.25)';
    c.lineWidth = Math.max(0.6, r * 0.015);
    c.stroke();
    c.restore();

    c.beginPath();
    c.arc(0, 0, r * 0.99, 0, TAU);
    c.strokeStyle = 'rgba(255,235,205,0.3)';
    c.lineWidth = Math.max(0.7, r * 0.025);
    c.stroke();

    gloss(c, r, 0.26);
  }

  function drawSun(c, r) {
    const halo = c.createRadialGradient(0, 0, r * 0.55, 0, 0, r * 1.6);
    halo.addColorStop(0, 'rgba(255,240,170,0.85)');
    halo.addColorStop(0.35, 'rgba(255,190,70,0.45)');
    halo.addColorStop(0.7, 'rgba(255,120,20,0.18)');
    halo.addColorStop(1, 'rgba(255,90,0,0)');
    c.fillStyle = halo;
    c.beginPath();
    c.arc(0, 0, r * 1.6, 0, TAU);
    c.fill();

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    const core = c.createRadialGradient(-r * 0.15, -r * 0.2, r * 0.05, 0, 0, r * 1.04);
    core.addColorStop(0, '#fffef0');
    core.addColorStop(0.3, '#fff3a8');
    core.addColorStop(0.65, '#ffc247');
    core.addColorStop(0.9, '#ff8a12');
    core.addColorStop(1, '#ff5e00');
    c.fillStyle = core;
    c.fillRect(-r, -r, r * 2, r * 2);

    const rng = mulberry32(31);
    for (let i = 0; i < 26; i++) {
      c.fillStyle = 'rgba(255,140,20,' + (0.08 + rng() * 0.12).toFixed(3) + ')';
      c.beginPath();
      c.ellipse(
        (rng() * 2 - 1) * r * 0.8,
        (rng() * 2 - 1) * r * 0.8,
        r * (0.03 + rng() * 0.06),
        r * (0.02 + rng() * 0.04),
        rng() * 3,
        0,
        TAU,
      );
      c.fill();
    }

    c.fillStyle = 'rgba(160,50,0,0.22)';
    blob(c, -r * 0.35, r * 0.2, r * 0.14, r * 0.09, 0.3);
    blob(c, r * 0.4, -r * 0.35, r * 0.08, r * 0.05, -0.4);
    c.restore();

    c.save();
    c.strokeStyle = 'rgba(255,220,120,0.8)';
    c.lineWidth = r * 0.03;
    c.shadowColor = 'rgba(255,180,40,0.9)';
    c.shadowBlur = r * 0.3;
    c.beginPath();
    c.arc(0, 0, r * 0.985, 0, TAU);
    c.stroke();
    c.restore();

    gloss(c, r, 0.18);
  }

  function drawBlackHole(c, r) {
    const halo = c.createRadialGradient(0, 0, r * 0.85, 0, 0, r * 2.0);
    halo.addColorStop(0, 'rgba(150,90,255,0.55)');
    halo.addColorStop(0.45, 'rgba(80,30,170,0.28)');
    halo.addColorStop(1, 'rgba(20,0,60,0)');
    c.fillStyle = halo;
    c.beginPath();
    c.arc(0, 0, r * 2.0, 0, TAU);
    c.fill();

    c.save();
    c.rotate(-0.1);
    const disk = c.createLinearGradient(-r * 1.7, 0, r * 1.7, 0);
    disk.addColorStop(0, 'rgba(255,110,0,0)');
    disk.addColorStop(0.18, 'rgba(255,150,40,0.35)');
    disk.addColorStop(0.42, 'rgba(255,230,180,0.8)');
    disk.addColorStop(0.5, 'rgba(255,250,235,0.95)');
    disk.addColorStop(0.58, 'rgba(255,230,180,0.8)');
    disk.addColorStop(0.82, 'rgba(255,150,40,0.35)');
    disk.addColorStop(1, 'rgba(255,110,0,0)');
    c.strokeStyle = disk;
    c.lineCap = 'round';
    c.beginPath();
    c.ellipse(0, 0, r * 1.45, r * 0.42, 0, 0, TAU);
    c.lineWidth = r * 0.18;
    c.stroke();
    c.beginPath();
    c.ellipse(0, 0, r * 1.78, r * 0.5, 0, 0, TAU);
    c.lineWidth = Math.max(0.8, r * 0.035);
    c.strokeStyle = 'rgba(255,180,80,0.35)';
    c.stroke();
    c.restore();

    const bg = c.createRadialGradient(-r * 0.2, -r * 0.25, r * 0.05, 0, 0, r * 1.02);
    bg.addColorStop(0, '#0b0718');
    bg.addColorStop(0.75, '#05030d');
    bg.addColorStop(1, '#000000');
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fillStyle = bg;
    c.fill();

    c.save();
    const photon = c.createLinearGradient(-r, -r, r, r);
    photon.addColorStop(0, 'rgba(140,200,255,0.55)');
    photon.addColorStop(0.45, 'rgba(255,240,210,0.95)');
    photon.addColorStop(1, 'rgba(255,150,60,0.5)');
    c.strokeStyle = photon;
    c.lineWidth = Math.max(1, r * 0.018);
    c.shadowColor = 'rgba(255,200,120,0.9)';
    c.shadowBlur = r * 0.2;
    c.beginPath();
    c.arc(0, 0, r * 1.015, 0, TAU);
    c.stroke();
    c.strokeStyle = 'rgba(170,110,255,0.5)';
    c.lineWidth = r * 0.045;
    c.beginPath();
    c.arc(0, 0, r * 1.085, 0, TAU);
    c.stroke();
    c.restore();

    c.save();
    c.beginPath();
    c.rect(-r * 2.1, 0, r * 4.2, r * 1.2);
    c.clip();
    const front = c.createLinearGradient(-r * 1.7, 0, r * 1.7, 0);
    front.addColorStop(0, 'rgba(255,110,0,0)');
    front.addColorStop(0.22, 'rgba(255,160,50,0.4)');
    front.addColorStop(0.5, 'rgba(255,245,210,0.95)');
    front.addColorStop(0.78, 'rgba(255,160,50,0.4)');
    front.addColorStop(1, 'rgba(255,110,0,0)');
    c.strokeStyle = front;
    c.lineWidth = r * 0.12;
    c.beginPath();
    c.ellipse(0, 0, r * 1.46, r * 0.44, -0.08, 0, TAU);
    c.stroke();
    c.restore();

    c.fillStyle = 'rgba(255,255,255,0.75)';
    const rng = mulberry32(97);
    for (let i = 0; i < 8; i++) {
      const a = rng() * TAU;
      const rr = r * (1.15 + rng() * 0.65);
      c.beginPath();
      c.arc(Math.cos(a) * rr, Math.sin(a) * rr * 0.45, Math.max(0.5, r * 0.012), 0, TAU);
      c.fill();
    }
  }

  /* ------------------------------------------------------------
 Level table
 ------------------------------------------------------------ */
  const LEVELS = [
    {
      name: 'Астероид',
      radius: 15,
      score: 3,
      pad: 0.2,
      face: '#241b15',
      highlight: 'rgba(255,255,255,0.8)',
      blush: 'rgba(255,160,120,0.16)',
      spark: ['#f6e7d2', '#cbb29a', '#8d7460'],
      glow: 'rgba(235,215,185,0.75)',
      draw: drawAsteroid,
    },
    {
      name: 'Луна',
      radius: 20,
      score: 8,
      pad: 0.22,
      face: '#3b3733',
      highlight: 'rgba(255,255,255,0.85)',
      blush: 'rgba(255,175,190,0.16)',
      spark: ['#fffdf4', '#d8d2c4', '#9c958a'],
      glow: 'rgba(240,236,220,0.8)',
      draw: drawMoon,
    },
    {
      name: 'Меркурий',
      radius: 26,
      score: 16,
      pad: 0.24,
      face: '#43261a',
      highlight: 'rgba(255,255,255,0.85)',
      blush: 'rgba(255,150,120,0.16)',
      spark: ['#f6e3cb', '#d0ae8a', '#8a6244'],
      glow: 'rgba(240,215,185,0.8)',
      draw: drawMercury,
    },
    {
      name: 'Марс',
      radius: 33,
      score: 28,
      pad: 0.26,
      face: '#3d1508',
      highlight: 'rgba(255,255,255,0.85)',
      blush: 'rgba(255,120,110,0.2)',
      spark: ['#ffc49a', '#e56f42', '#9c3218'],
      glow: 'rgba(255,150,100,0.8)',
      draw: drawMars,
    },
    {
      name: 'Земля',
      radius: 41,
      score: 44,
      pad: 0.38,
      face: '#08243f',
      highlight: 'rgba(255,255,255,0.9)',
      blush: 'rgba(255,140,170,0.2)',
      spark: ['#d5f6ff', '#6fc3ff', '#3f9c61'],
      glow: 'rgba(120,210,255,0.85)',
      draw: drawEarth,
    },
    {
      name: 'Нептун',
      radius: 50,
      score: 66,
      pad: 0.32,
      face: '#dcefff',
      highlight: 'rgba(255,255,255,0.9)',
      eyeGlow: true,
      eyeColorGlow: 'rgba(120,200,255,0.85)',
      blush: 'rgba(140,210,255,0.16)',
      spark: ['#d8f2ff', '#5f9dff', '#2438b8'],
      glow: 'rgba(110,170,255,0.85)',
      draw: drawNeptune,
    },
    {
      name: 'Сатурн',
      radius: 61,
      score: 96,
      pad: 1.08,
      face: '#4a3417',
      highlight: 'rgba(255,255,255,0.85)',
      blush: 'rgba(255,170,140,0.18)',
      spark: ['#fff6da', '#ecd29a', '#b08a4c'],
      glow: 'rgba(245,220,160,0.85)',
      draw: drawSaturn,
    },
    {
      name: 'Юпитер',
      radius: 73,
      score: 140,
      pad: 0.26,
      face: '#47270f',
      highlight: 'rgba(255,255,255,0.85)',
      blush: 'rgba(255,150,130,0.16)',
      spark: ['#ffe9cd', '#e6b98d', '#a46a42'],
      glow: 'rgba(240,200,160,0.85)',
      draw: drawJupiter,
    },
    {
      name: 'Солнце',
      radius: 87,
      score: 200,
      pad: 0.68,
      face: '#7a3000',
      highlight: 'rgba(255,255,255,0.7)',
      blush: 'rgba(255,90,60,0.2)',
      spark: ['#fffbe0', '#ffd15c', '#ff8a1e'],
      glow: 'rgba(255,210,110,0.95)',
      draw: drawSun,
    },
    {
      name: 'Чёрная дыра',
      radius: 102,
      score: 350,
      pad: 1.08,
      face: '#e9f8ff',
      highlight: 'rgba(190,245,255,0.95)',
      eyeGlow: true,
      eyeColorGlow: 'rgba(150,220,255,0.95)',
      mouth: 'rgba(225,248,255,0.9)',
      spark: ['#f4e6ff', '#b98cff', '#ffb066'],
      glow: 'rgba(180,130,255,0.9)',
      draw: drawBlackHole,
    },
  ];

  /* ------------------------------------------------------------
 Sprite cache
 ------------------------------------------------------------ */
  function makeBufferCanvas(w, h) {
    const width = Math.max(1, Math.ceil(w));
    const height = Math.max(1, Math.ceil(h));
    if (typeof OffscreenCanvas !== 'undefined') {
      try {
        return new OffscreenCanvas(width, height);
      } catch (err) {}
    }
    const cv = document.createElement('canvas');
    cv.width = width;
    cv.height = height;
    return cv;
  }

  const planetSpriteCache = {};
  let spriteScale = 2;

  function setSpriteScale(s) {
    const next = clamp(s, 2, 3);
    if (Math.abs(next - spriteScale) < 0.01) return false;
    spriteScale = next;
    for (const key in planetSpriteCache) delete planetSpriteCache[key];
    return true;
  }

  function getSprite(level) {
    const skin = themeId();
    const key = skin + ':' + level;
    if (planetSpriteCache[key]) return planetSpriteCache[key];
    const cfg = LEVELS[level - 1];
    const r = cfg.radius;
    const pad = r * cfg.pad;
    const half = r + pad;
    const size = Math.max(8, Math.ceil(half * 2 * spriteScale));
    const cv = makeBufferCanvas(size, size);
    const c = cv.getContext('2d');
    if (!c) return { canvas: cv, half: half };
    c.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in c) c.imageSmoothingQuality = 'high';
    c.translate(size / 2, size / 2);
    c.scale(spriteScale, spriteScale);

    const haloCol = skin === 'neon'
      ? rgbaOf(NEON_SKINS[level - 1].base, 0.55)
      : skin === 'crystal'
        ? rgbaOf(CRYSTAL_SKINS[level - 1].light, 0.5)
        : cfg.glow;
    const halo = c.createRadialGradient(0, 0, r * 0.8, 0, 0, half);
    halo.addColorStop(0, 'rgba(0,0,0,0)');
    halo.addColorStop(0.52, haloCol);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = halo;
    c.beginPath();
    c.arc(0, 0, half, 0, TAU);
    c.fill();

    const shade = c.createRadialGradient(0, r * 0.92, 0, 0, r * 0.92, r * 1.05);
    shade.addColorStop(0, 'rgba(0,0,0,0.34)');
    shade.addColorStop(0.6, 'rgba(0,0,0,0.12)');
    shade.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = shade;
    c.beginPath();
    c.ellipse(0, r * 0.96, r * 1.02, r * 0.42, 0, 0, TAU);
    c.fill();

    if (skin === 'neon') paintNeon(c, r, cfg, level);
    else if (skin === 'crystal') paintCrystal(c, r, cfg, level);
    else cfg.draw(c, r);

    c.save();
    c.beginPath();
    c.arc(0, 0, r * 0.99, 0, TAU);
    c.clip();
    const rim = c.createLinearGradient(0, -r, 0, r * 0.4);
    rim.addColorStop(0, 'rgba(255,255,255,0.5)');
    rim.addColorStop(0.35, 'rgba(255,255,255,0.06)');
    rim.addColorStop(1, 'rgba(255,255,255,0)');
    c.strokeStyle = rim;
    c.lineWidth = Math.max(0.8, r * 0.06);
    c.beginPath();
    c.arc(0, 0, r * 0.97, Math.PI * 1.08, Math.PI * 1.92);
    c.stroke();
    c.restore();

    const sprite = { canvas: cv, half: half };
    planetSpriteCache[key] = sprite;
    return sprite;
  }

  function drawSpritePx(c, level, x, y, radiusPx) {
    const sp = getSprite(level);
    const k = radiusPx / LEVELS[level - 1].radius;
    const half = sp.half * k;
    c.drawImage(sp.canvas, x - half, y - half, half * 2, half * 2);
  }

  function drawFace(c, r, cfg, b, t) {
    if (r < 6) return;
    const eyeX = r * 0.3;
    const eyeY = -r * 0.06;
    const eyeR = Math.max(1.8, r * (r < 22 ? 0.13 : 0.125));

    const seed = b.blinkSeed || 0;
    const period = 4.2 + (seed % 1.6);
    const bt = ((t || 0) + seed) % period;
    let blink = 0;
    if (bt < 0.16) blink = Math.sin((bt / 0.16) * Math.PI);
    const eyeH = eyeR * (1.32 - 1.2 * blink);

    if (cfg.blush) {
      c.fillStyle = cfg.blush;
      for (let s = -1; s <= 1; s += 2) {
        c.beginPath();
        c.ellipse(s * eyeX * 1.55, r * 0.26, r * 0.17, r * 0.09, 0, 0, TAU);
        c.fill();
      }
    }

    for (let s = -1; s <= 1; s += 2) {
      c.save();
      if (cfg.eyeGlow) {
        c.fillStyle = cfg.eyeColorGlow || cfg.face;
        c.globalAlpha = 0.35;
        c.beginPath();
        c.ellipse(s * eyeX, eyeY, eyeR * 1.45, eyeH * 1.45, 0, 0, TAU);
        c.fill();
        c.globalAlpha = 1;
      }
      c.fillStyle = cfg.face;
      c.beginPath();
      c.ellipse(s * eyeX, eyeY, eyeR * 0.86, eyeH, 0, 0, TAU);
      c.fill();
      c.restore();

      c.save();
      c.beginPath();
      c.ellipse(s * eyeX, eyeY, eyeR * 0.86, eyeH, 0, 0, TAU);
      c.clip();
      c.fillStyle = 'rgba(255,255,255,0.14)';
      c.fillRect(s * eyeX - eyeR, eyeY - eyeH, eyeR * 2, eyeH * 2);
      c.fillStyle = 'rgba(0,0,0,0.16)';
      c.beginPath();
      c.ellipse(s * eyeX + eyeR * 0.16, eyeY + eyeH * 0.3, eyeR * 0.55, eyeH * 0.52, 0, 0, TAU);
      c.fill();
      c.restore();

      c.fillStyle = cfg.highlight || 'rgba(255,255,255,0.9)';
      c.beginPath();
      c.ellipse(s * eyeX - eyeR * 0.26, eyeY - eyeH * 0.38, eyeR * 0.3, Math.max(0.3, eyeH * 0.26), -0.25, 0, TAU);
      c.fill();
      c.globalAlpha = 0.55;
      c.beginPath();
      c.ellipse(s * eyeX + eyeR * 0.22, eyeY + eyeH * 0.34, eyeR * 0.15, Math.max(0.2, eyeH * 0.13), 0, 0, TAU);
      c.fill();
      c.globalAlpha = 1;
    }

    if (r >= 12) {
      c.beginPath();
      c.arc(0, r * 0.13, r * 0.185, 0.16 * Math.PI, 0.84 * Math.PI);
      c.lineCap = 'round';
      c.lineWidth = Math.max(1.1, r * 0.045);
      c.strokeStyle = cfg.mouth || cfg.face;
      c.stroke();
      c.beginPath();
      c.arc(0, r * 0.13, r * 0.185, 0.16 * Math.PI, 0.84 * Math.PI);
      c.lineWidth = Math.max(0.5, r * 0.016);
      c.strokeStyle = 'rgba(255,255,255,0.28)';
      c.stroke();
    }
  }

  function drawFacePx(c, radiusPx, cfg, seed) {
    drawFace(c, radiusPx, cfg, { blinkSeed: seed || 0 }, 0);
  }

  /* ------------------------------------------------------------
   Public art API: promo art / icons / covers.
   Reuses the very same planet painters as the game itself.
   ------------------------------------------------------------ */
  window.__mergeCosmosArt = {
    levels: LEVELS,
    names: LEVELS.map(function (l) {
      return l.name;
    }),
    drawPlanet: function (c, level, x, y, radiusPx, rotation) {
      const cfg = LEVELS[level - 1];
      if (!cfg) return;
      c.save();
      c.translate(x, y);
      if (rotation) c.rotate(rotation);
      cfg.draw(c, radiusPx);
      c.restore();
    },
    star: function (c, x, y, radius, rot, fill) {
      starPath(c, x, y, radius, rot || 0);
      if (fill) {
        c.fillStyle = fill;
        c.fill();
      }
    },
  };

  /* ------------------------------------------------------------
 DOM
 ------------------------------------------------------------ */
  const stage = $('stage');
  const canvas = $('game');
  if (!canvas) return;
  let ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) ctx = canvas.getContext('2d');
  if (!ctx) {
    const el = $('fatal');
    if (el) el.classList.add('show');
    return;
  }

  const scoreEl = $('score');
  const bestEl = $('best');
  const settingsBtn = $('settingsBtn');
const settingsOverlay = $('settingsOverlay');
const settingsClose = $('settingsClose');
const settingsSoundBtn = $('settingsSoundBtn');
const settingsVibrationBtn = $('settingsVibrationBtn');
  const pauseBtn = $('pauseBtn');
  const startScreen = $('startScreen');
  const pauseScreen = $('pauseScreen');
  const overScreen = $('overScreen');
  const startBtn = $('startBtn');
  const resumeBtn = $('resumeBtn');
  const restartBtn = $('restartBtn');
  const retryBtn = $('retryBtn');
  const menuBtn = $('menuBtn');
  const shakeBtn = $('shakeBtn');
  const cleanBtn = $('cleanBtn');
  const shakeChargesEl = $('shakeCharges');
  const cleanChargesEl = $('cleanCharges');
  const evoEl = $('evo');
  const evoTitleEl = $('evoTitle');
  const nextPreview = $('nextPreview');
  const nextNameEl = $('nextName');
  const nextCardEl = $('nextCard');
  const previewCtx = nextPreview.getContext('2d');
  const comboEl = $('combo');
  const toastEl = $('toast');
  const finalScoreEl = $('finalScore');
  const recordLineEl = $('recordLine');
  const recordBadgeEl = $('recordBadge');
  const dangerBadgeEl = $('dangerBadge');
  const dangerTimeEl = $('dangerTime');
  const dangerFillEl = $('dangerFill');
  const vipBtn = $('vipBtn');
  const vipScreen = $('vipScreen');
  const vipBuyBtn = $('vipBuyBtn');
  const vipCloseBtn = $('vipCloseBtn');
  const vipStatusEl = $('vipStatus');
  const shareBtn = $('shareBtn');
  const adBoosterBtn = $('adBoosterBtn');
  const secondChanceBtn = $('secondChanceBtn');
  const fullscreenBtn = $('fullscreenBtn');
  const railLeft = $('railLeft');
  const railRight = $('railRight');
  const slotEvo = $('slotEvo');
  const slotNext = $('slotNext');
  const slotBonus = $('slotBonus');
  const evoRowEl = document.querySelector('.evo-row');
  const controlGridEl = $('controlGrid');
  const themeBtn = $('themeBtn');
  const themesOverlay = $('themesOverlay');
  const themesClose = $('themesClose');
  const themeListEl = $('themeList');
  const dailyBtn = $('dailyBtn');
  const dailyOverlay = $('dailyOverlay');
  const dailyClose = $('dailyClose');
  const dailyGridEl = $('dailyGrid');
  const dailyClaimBtn = $('dailyClaimBtn');
  const dailyAdBtn = $('dailyAdBtn');
  const dailyStreakEl = $('dailyStreak');
  const dailyTomorrowEl = $('dailyTomorrow');
  const dailyTitleEl = $('dailyTitle');
  const dailySubEl = $('dailySub');
  const bestStat = $('bestStat');
  const leaderboardOverlay = $('leaderboardOverlay');
  const leaderboardClose = $('leaderboardClose');
  const lbListEl = $('lbList');
  const lbLeaguesEl = $('lbLeagues');
  const lbLeagueCard = $('lbLeagueCard');
  const lbLeagueName = $('lbLeagueName');
  const lbLeagueSub = $('lbLeagueSub');
  const lbLeagueStep = $('lbLeagueStep');
  const lbLeagueIcon = $('lbLeagueIcon');
  const lbRank = $('lbRank');
  const lbProgressFill = $('lbProgressFill');
  const lbProgressText = $('lbProgressText');
  const lbShareBtn = $('lbShareBtn');

  /* ------------------------------------------------------------
 Audio (Web Audio API, fully procedural)
 ------------------------------------------------------------ */
  const BELL_NOTES = [392.0, 440.0, 523.25, 659.25];

  const Sound = {
    ctx: null,
    master: null,
    noiseBuf: null,
    muted: false,
    suppressed: false,
    musicOn: false,
    musicGain: null,
    musicSrc: null,
    musicFilter: null,
    pinkBuf: null,
    musicTimer: 0,
    lastImpact: 0,

    init: function () {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -20;
        comp.knee.value = 26;
        comp.ratio.value = 5;
        comp.attack.value = 0.004;
        comp.release.value = 0.24;
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted || this.suppressed ? 0 : 0.85;
        this.master.connect(comp);
        comp.connect(this.ctx.destination);
      } catch (err) {
        this.ctx = null;
      }
    },

    unlock: function () {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
        const res = this.ctx.resume();
        if (res && res.catch) res.catch(function () {});
      }
    },

    setMuted: function (m) {
      this.muted = m;
      if (this.ctx && this.master) {
        this.master.gain.setTargetAtTime(m || this.suppressed ? 0 : 0.85, this.ctx.currentTime, 0.015);
      }
    },

    setSuppressed: function (v) {
      this.suppressed = v;
      if (this.ctx && this.master) {
        this.master.gain.setTargetAtTime(this.muted || v ? 0 : 0.85, this.ctx.currentTime, 0.015);
      }
    },

    tone: function (opts) {
      if (!this.ctx || this.muted || this.suppressed) return;
      const freq = opts.freq || 440;
      const dur = opts.dur || 0.3;
      const vol = opts.vol == null ? 0.12 : opts.vol;
      const t0 = this.ctx.currentTime + (opts.delay || 0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = opts.type || 'sine';
      osc.frequency.setValueAtTime(Math.max(10, freq), t0);
      if (opts.to) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, opts.to), t0 + dur * 0.9);
      }
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + (opts.attack || 0.006));
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.06);
    },

    makeNoise: function () {
      if (!this.ctx) return;
      const len = Math.floor(this.ctx.sampleRate * 1);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    },

    noiseHit: function (opts) {
      if (!this.ctx || this.muted || this.suppressed) return;
      if (!this.noiseBuf) this.makeNoise();
      if (!this.noiseBuf) return;
      const dur = opts.dur || 0.3;
      const t0 = this.ctx.currentTime + (opts.delay || 0);
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      src.loop = true;
      const filt = this.ctx.createBiquadFilter();
      filt.type = opts.type || 'bandpass';
      filt.frequency.setValueAtTime(Math.max(40, opts.from || 1200), t0);
      filt.frequency.exponentialRampToValueAtTime(Math.max(40, opts.to || 300), t0 + dur);
      filt.Q.value = 1.1;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, opts.vol || 0.06), t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(filt);
      filt.connect(gain);
      gain.connect(this.master);
      src.start(t0);
      src.stop(t0 + dur + 0.06);
    },

    ambient: function (on) {
      if (on) this.init();
      if (!this.ctx || on === this.musicOn) return;
      this.musicOn = on;
      if (on) this.startAmbient();
      else this.stopAmbient();
    },

    startAmbient: function () {
      if (!this.ctx || this.musicGain) return;
      const ctx = this.ctx;
      const t0 = ctx.currentTime;
      if (!this.pinkBuf) this.pinkBuf = this.makePinkNoise(4);

      const src = ctx.createBufferSource();
      src.buffer = this.pinkBuf;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, t0);
      filter.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.025, t0 + 2);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      src.start(t0);

      this.musicGain = gain;
      this.musicSrc = src;
      this.musicFilter = filter;
      this.scheduleBell();
    },

    makePinkNoise: function (seconds) {
      const ctx = this.ctx;
      const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let b3 = 0;
      let b4 = 0;
      let b5 = 0;
      let b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      return buf;
    },

    scheduleBell: function () {
      const self = this;
      const delay = 4000 + Math.random() * 1000;
      this.musicTimer = setTimeout(function () {
        if (!self.musicOn || !self.ctx) return;
        self.bellNote();
        self.scheduleBell();
      }, delay);
    },

    bellNote: function () {
      if (!this.ctx || !this.musicGain || this.muted || this.suppressed) return;
      const ctx = this.ctx;
      const t0 = ctx.currentTime;
      const freq = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.02, t0 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.5);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + 2.6);
    },

    stopAmbient: function () {
      if (this.musicTimer) {
        clearTimeout(this.musicTimer);
        this.musicTimer = 0;
      }
      const gain = this.musicGain;
      const src = this.musicSrc;
      this.musicGain = null;
      this.musicSrc = null;
      this.musicFilter = null;
      if (!this.ctx || !gain) return;
      const now = this.ctx.currentTime;
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      } catch (err) {}
      if (src) {
        try {
          src.stop(now + 0.4);
        } catch (err) {}
      }
    },

    impact: function (speed, level, isWall) {
      if (!this.ctx || this.muted || this.suppressed) return;
      const now = performance.now();
      if (now - this.lastImpact < 60) return;
      this.lastImpact = now;
      const k = clamp(speed / 14, 0, 1);
      if (k < 0.06) return;
      const base = isWall ? 190 + Math.random() * 70 : 240 + clamp(level || 1, 1, 10) * 18;
      this.tone({
        freq: base * (0.9 + Math.random() * 0.2),
        to: base * 0.55,
        type: 'sine',
        dur: 0.09 + k * 0.09,
        vol: (isWall ? 0.018 : 0.024) + k * 0.04,
      });
      if (k > 0.4) {
        this.noiseHit({
          dur: 0.05 + k * 0.05,
          vol: 0.006 + k * 0.014,
          from: 1200 + 2200 * k,
          to: 300,
          type: 'bandpass',
        });
      }
    },

    ui: function () {
      this.tone({ freq: 660, to: 880, type: 'sine', dur: 0.08, vol: 0.045 });
    },
    drop: function () {
      this.tone({ freq: 320, to: 170, type: 'sine', dur: 0.13, vol: 0.05 });
      this.noiseHit({ dur: 0.08, vol: 0.018, from: 2200, to: 700 });
    },
    merge: function (level, combo) {
      const scale = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22];
      const semis = scale[clamp(level - 1, 0, 9)] + Math.min(combo - 1, 4) * 2;
      const f = 330 * Math.pow(2, semis / 12);
      this.tone({ freq: f, type: 'triangle', dur: 0.42, vol: 0.1 });
      this.tone({ freq: f * 2, type: 'sine', dur: 0.3, vol: 0.045 });
      this.tone({ freq: f * 3, type: 'sine', dur: 0.18, vol: 0.018, delay: 0.02 });
      if (combo > 1) {
        for (let i = 0; i < Math.min(combo, 4); i++) {
          this.tone({
            freq: f * 2 * Math.pow(2, (i * 4) / 12),
            type: 'sine',
            dur: 0.22,
            vol: 0.03,
            delay: 0.06 + i * 0.055,
          });
        }
      }
    },
    pop: function () {
      this.tone({ freq: 120, to: 42, type: 'sine', dur: 0.7, vol: 0.18 });
      this.noiseHit({ dur: 0.55, vol: 0.07, from: 1800, to: 120, type: 'lowpass' });
      this.tone({ freq: 880, type: 'sine', dur: 0.5, vol: 0.03, delay: 0.08 });
    },
    gameOver: function () {
      const notes = [392, 329.63, 261.63, 196];
      for (let i = 0; i < notes.length; i++) {
        this.tone({ freq: notes[i], type: 'sine', dur: 0.62, vol: 0.08, delay: i * 0.17 });
      }
      this.tone({ freq: 98, type: 'triangle', dur: 1.3, vol: 0.05, delay: 0.2 });
    },
    shake: function () {
      this.noiseHit({ dur: 0.34, vol: 0.08, from: 900, to: 180, type: 'bandpass' });
      this.tone({ freq: 170, to: 80, type: 'sine', dur: 0.32, vol: 0.07 });
    },
    clean: function () {
      const notes = [1046.5, 1318.5, 1568, 2093];
      for (let i = 0; i < notes.length; i++) {
        this.tone({ freq: notes[i], type: 'sine', dur: 0.18, vol: 0.04, delay: i * 0.05 });
      }
    },
    warn: function () {
      this.tone({ freq: 740, type: 'triangle', dur: 0.09, vol: 0.025 });
    },
  };

  /* ------------------------------------------------------------
 State & view
 ------------------------------------------------------------ */
  const S = {
    mode: 'menu',
    score: 0,
    best: 0,
    combo: 0,
    lastMerge: 0,
    danger: 0,
    maxLevel: 1,
    charges: { shake: START_CHARGES, clean: START_CHARGES },
    dailyDate: '',
    vipUntil: 0,
    vipAds: 0,
    theme: 'cosmos',
    themeAds: { neon: 0, crystal: 0 },
    daily7: { streak: 0, last: '' },
    secondChanceUsed: false,
    bonusReadyAt: { shake: 0, clean: 0 },
    current: null,
    next: null,
    cooldown: 0,
    shakeLock: 0,
    holdIn: 1,
    aimX: WORLD_W / 2,
    aimTarget: WORLD_W / 2,
    warnTimer: 0,
    overToken: 0,
    record: false,
  };

  const view = {
    w: 0,
    h: 0,
    dpr: 1,
    uiDpr: 1,
    scale: 1,
    jarLeft: 0,
    jarTop: 0,
    jarW: 0,
    jarH: 0,
  };

  let engine = null;
  let jarCanvas = null;
  let jarFrontCanvas = null;
  let starCanvas = null;
  let aimGlowCanvas = null;
  let dangerCanvas = null;
  let flashCanvas = null;
  let twinkles = [];
  let pendingMerges = [];
  let particles = [];
  let rings = [];
  let popups = [];
  let flashA = 0;
  let shakeT = 0;
  let shakeDur = 1;
  let shakeMag = 0;
  let shoot = null;
  let shootTimer = 6;
  let comboTimer = 0;
  let toastTimer = 0;
  let evoItems = [];
  let lastFrame = 0;
  let acc = 0;
  let loopHoldUntil = 0;
  let pointerActive = false;
  let resizeQueued = false;

  const menuItems = [
    { level: 5, xf: 0.16, yf: 0.2, r: 40, ph: 0 },
    { level: 7, xf: 0.84, yf: 0.14, r: 35, ph: 1.4 },
    { level: 9, xf: 0.82, yf: 0.76, r: 31, ph: 2.6 },
    { level: 2, xf: 0.14, yf: 0.72, r: 21, ph: 3.9 },
  ];

  function readInt(key, fallback) {
    try {
      const v = parseInt(localStorage.getItem(key) || '', 10);
      return Number.isFinite(v) ? v : fallback;
    } catch (err) {
      return fallback;
    }
  }

  const bridgeApi = window.bridge || null;
  let bridgeOnline = false;
  let platformLanguage = 'ru';

  let rewardedPending = null;
  let rewardEarned = false;
  let rewardedGranted = false;
  let rewardedFallback = 0;
  let rewardedOpen = false;
  let interstitialOpen = false;
  let interstitialPending = null;
  let interstitialTouched = false;
  let interstitialFallback = 0;
  let pauseByPlatform = false;
  let platformAudioEnabled = true;
  let adShowing = 0;
  let rewardedReturnPlay = false;

  function localSet(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (err) {
      /* ignore */
    }
  }

  function saveValue(key, value) {
    const str = String(value);
    localSet(key, str);
    if (!bridgeOnline || !bridgeApi || !bridgeApi.storage) return;
    try {
      const request = bridgeApi.storage.set(key, str);
      if (request && request.catch) request.catch(function () {});
    } catch (err) {}
  }

  function bridgeSendMessage(id) {
    if (!bridgeOnline || !bridgeApi || !bridgeApi.platform) return;
    try {
      const request = bridgeApi.platform.sendMessage(id);
      if (request && request.catch) request.catch(function () {});
    } catch (err) {}
  }

  let gameReadySent = false;

  function notifyGameReady(force) {
    if (gameReadySent) return;
    const api = window.bridge;
    if (!api || !api.platform || typeof api.platform.sendMessage !== 'function') return;
    if (!bridgeOnline && !force) return;
    const message =
      (api.PLATFORM_MESSAGE && (api.PLATFORM_MESSAGE.GAME_READY || api.PLATFORM_MESSAGE.GameReady)) ||
      (api.PlatformMessage && api.PlatformMessage.GAME_READY) ||
      'game_ready';
    try {
      const request = api.platform.sendMessage(message);
      if (request && request.catch) {
        request.catch(function () {
          gameReadySent = false;
        });
      }
      gameReadySent = true;
    } catch (err) {
      try {
        api.platform.sendMessage('game_ready');
        gameReadySent = true;
      } catch (err2) {}
    }
  }

  function saveCharges() {
    saveValue(SHAKE_KEY, S.charges.shake);
    saveValue(CLEAN_KEY, S.charges.clean);
  }

  function readBest() {
    const v = readInt(BEST_KEY, 0);
    return v > 0 ? v : 0;
  }

  function writeBest(v) {
    saveValue(BEST_KEY, v);
    cloudSaveBest(v);
    savePlayerProfile();
  }

  function readMuted() {
    try {
      return localStorage.getItem(MUTE_KEY) === '1';
    } catch (err) {
      return false;
    }
  }

  function writeMuted(v) {
    try {
      localStorage.setItem(MUTE_KEY, v ? '1' : '0');
    } catch (err) {
      /* ignore */
    }
  }

  function updateAudioSuppression() {
    Sound.setSuppressed(!platformAudioEnabled || document.hidden || adShowing > 0);
    syncMusic();
  }

  function refreshAdState() {
    adShowing = (rewardedOpen ? 1 : 0) + (interstitialOpen ? 1 : 0);
    updateAudioSuppression();
    syncLoop();
  }

  function grantRewarded() {
    if (rewardedFallback) {
      clearTimeout(rewardedFallback);
      rewardedFallback = 0;
    }
    if (!rewardEarned || rewardedGranted) return;
    rewardedGranted = true;
    rewardEarned = false;
    rewardedOpen = false;
    refreshAdState();
    if (pauseByPlatform && S.mode === 'paused') {
      resumeGame();
    }
    if (rewardedReturnPlay && S.mode === 'paused') {
      resumeGame();
    }
    rewardedReturnPlay = false;
    pauseByPlatform = false;
    const pending = rewardedPending;
    rewardedPending = null;
    if (pending) pending();
  }

  function syncMusic() {
    Sound.ambient(S.mode === 'playing' && !Sound.muted && !Sound.suppressed && adShowing === 0);
  }

  function todayKey() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function applyDailyBonus() {
    const today = todayKey();
    if (S.dailyDate === today) return false;
    let changed = false;
    if (S.charges.shake <= 0) {
      S.charges.shake = 1;
      changed = true;
    }
    if (S.charges.clean <= 0) {
      S.charges.clean = 1;
      changed = true;
    }
    S.dailyDate = today;
    saveValue(DAILY_KEY, today);
    if (changed) saveCharges();
    return changed;
  }

  function applyStoredValue(key, raw) {
    if (raw === null || raw === undefined) return;
    const str = typeof raw === 'string' ? raw : String(raw);
    localSet(key, str);
    if (key === BEST_KEY) {
      const best = parseInt(str, 10);
      if (Number.isFinite(best) && best > S.best) {
        S.best = best;
        updateBest();
      }
    } else if (key === VIP_KEY) {
      const until = parseInt(str, 10);
      if (Number.isFinite(until) && until > S.vipUntil) S.vipUntil = until;
    } else if (key === VIP_ADS_KEY) {
      const ads = parseInt(str, 10);
      if (Number.isFinite(ads)) S.vipAds = clamp(ads, 0, VIP_ADS_REQUIRED);
    } else if (key === SHAKE_KEY) {
      const charges = parseInt(str, 10);
      if (Number.isFinite(charges)) S.charges.shake = clamp(charges, 0, 99);
    } else if (key === CLEAN_KEY) {
      const charges = parseInt(str, 10);
      if (Number.isFinite(charges)) S.charges.clean = clamp(charges, 0, 99);
    } else if (key === DAILY_KEY) {
      if (str && !S.dailyDate) S.dailyDate = str;
    }
  }

  function loadCloudProgress() {
    if (!bridgeOnline || !bridgeApi || !bridgeApi.storage) return Promise.resolve();
    const keys = [BEST_KEY, VIP_KEY, VIP_ADS_KEY, SHAKE_KEY, CLEAN_KEY, DAILY_KEY];
    const jobs = keys.map(function (key) {
      return Promise.resolve()
        .then(function () {
          return bridgeApi.storage.get(key, true);
        })
        .then(function (value) {
          applyStoredValue(key, value);
        })
        .catch(function () {});
    });
    return Promise.all(jobs)
      .then(function () {
        applyDailyBonus();
        updateVipUI();
        updateCharges();
        updateBest();
        syncControls();
      })
      .catch(function () {});
  }

  function setupBridgeEvents() {
    if (!bridgeApi) return;
    const events = bridgeApi.EVENT_NAME || {};
    const platform = bridgeApi.platform;
    const advertisement = bridgeApi.advertisement;

    if (platform && typeof platform.on === 'function') {
      platform.on(events.AUDIO_STATE_CHANGED || 'audio_state_changed', function (enabled) {
        platformAudioEnabled = enabled !== false;
        updateAudioSuppression();
      });

      platform.on(events.PAUSE_STATE_CHANGED || 'pause_state_changed', function (paused) {
        if (paused) {
          if (S.mode === 'playing') {
            pauseByPlatform = true;
            pauseGame();
          }
          Sound.setSuppressed(true);
        } else {
          if (pauseByPlatform && S.mode === 'paused') resumeGame();
          pauseByPlatform = false;
          updateAudioSuppression();
        }
        syncMusic();
      });

      if (events.VISIBILITY_STATE_CHANGED) {
        platform.on(events.VISIBILITY_STATE_CHANGED, function (state) {
          if (state === 'hidden') {
            Sound.setSuppressed(true);
            if (S.mode === 'playing') {
              pauseByPlatform = true;
              pauseGame();
            }
          } else {
            if (pauseByPlatform && S.mode === 'paused') resumeGame();
            pauseByPlatform = false;
            updateAudioSuppression();
          }
          syncMusic();
        });
      }
    }

    if (advertisement && typeof advertisement.on === 'function') {
      advertisement.on(events.REWARDED_STATE_CHANGED || 'rewarded_state_changed', function (state) {
        if (state === 'loading' || state === 'opened') {
          rewardedOpen = true;
          refreshAdState();
          return;
        }
        if (state === 'rewarded') {
          rewardEarned = true;
          if (rewardedFallback) clearTimeout(rewardedFallback);
          rewardedFallback = setTimeout(function () {
            rewardedFallback = 0;
            grantRewarded();
          }, 2500);
          return;
        }
        if (state === 'closed' || state === 'failed') {
          if (rewardEarned) {
            grantRewarded();
          } else {
            if (state === 'failed') showToast('Реклама недоступна');
            else showToast('Реклама не была просмотрена');
            rewardedOpen = false;
            rewardedPending = null;
            refreshAdState();
            if (pauseByPlatform && S.mode === 'paused') resumeGame();
            pauseByPlatform = false;
            rewardedReturnPlay = false;
          }
        }
      });

      advertisement.on(events.INTERSTITIAL_STATE_CHANGED || 'interstitial_state_changed', function (state) {
        if (state === 'loading' || state === 'opened') {
          interstitialTouched = true;
          interstitialOpen = true;
          refreshAdState();
          return;
        }
        if (state === 'closed' || state === 'failed') {
          interstitialTouched = true;
          interstitialOpen = false;
          refreshAdState();
          const pending = interstitialPending;
          interstitialPending = null;
          if (pending) pending();
        }
      });

      if (events.BANNER_STATE_CHANGED) {
        advertisement.on(events.BANNER_STATE_CHANGED, function (state) {
          if (state === 'shown') Sound.setSuppressed(true);
          else if (state === 'hidden') updateAudioSuppression();
          syncMusic();
        });
      }
    }
  }

  function initBridge() {
    return new Promise(function (resolve) {
      let settled = false;
      const finish = function (ok) {
        if (settled) return;
        settled = true;
        resolve(ok);
      };
      const timer = setTimeout(function () {
        finish(false);
      }, 1500);

      const activate = function () {
        clearTimeout(timer);
        bridgeOnline = true;
        try {
          platformLanguage = (window.bridge.platform && window.bridge.platform.language) || 'ru';
          if (window.I18N) I18N.auto(platformLanguage);
          platformAudioEnabled = !(window.bridge.platform && window.bridge.platform.isAudioEnabled === false);
        } catch (err) {
          platformLanguage = 'ru';
        }
        try {
          setupBridgeEvents();
        } catch (err) {}
        updateAudioSuppression();
        finish(true);
      };

      try {
        if (!window.bridge || typeof window.bridge.initialize !== 'function') {
          clearTimeout(timer);
          finish(false);
          return;
        }
        const request = window.bridge.initialize();
        if (request && typeof request.then === 'function') {
          request.then(activate).catch(function () {
            clearTimeout(timer);
            finish(false);
          });
        } else {
          activate();
        }
      } catch (err) {
        clearTimeout(timer);
        finish(false);
      }
    });
  }

  /* ------------------------------------------------------------
 Physics setup
 ------------------------------------------------------------ */
  let wallBodies = [];

  function buildWalls() {
    const opts = { isStatic: true, friction: 0.25, restitution: 0.08, render: { visible: false } };
    const t = 80;
    const jarBottom = WORLD_H - 1;
    const jarTopWall = -160;
    const wallH = jarBottom - jarTopWall;
    return [
      Bodies.rectangle(-t / 2, jarTopWall + wallH / 2, t, wallH, opts),
      Bodies.rectangle(WORLD_W + t / 2, jarTopWall + wallH / 2, t, wallH, opts),
      Bodies.rectangle(WORLD_W / 2, jarBottom + t / 2, WORLD_W + t * 2, t, opts),
    ];
  }

  function syncWalls() {
    if (!engine) return;
    for (let i = 0; i < wallBodies.length; i++) Composite.remove(engine.world, wallBodies[i]);
    wallBodies = buildWalls();
    Composite.add(engine.world, wallBodies);
  }

  function addWalls() {
    wallBodies = buildWalls();
    Composite.add(engine.world, wallBodies);
  }

  function setupEngine() {
    engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = 1.2;
    engine.positionIterations = 5;
    engine.velocityIterations = 4;
    engine.constraintIterations = 3;
    addWalls();
    Events.on(engine, 'collisionStart', onCollisionStart);
  }

  function onCollisionStart(ev) {
    if (S.mode !== 'playing') return;
    const pairs = ev.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const a = pairs[i].bodyA;
      const b = pairs[i].bodyB;
      const aPlanet = !!a.isPlanet;
      const bPlanet = !!b.isPlanet;
      if (!aPlanet && !bPlanet) continue;

      const rel = Math.hypot(a.velocity.x - b.velocity.x, a.velocity.y - b.velocity.y);
      if (rel > 1.2) {
        Sound.impact(rel, aPlanet ? a.level : b.level, !(aPlanet && bPlanet));
      }

      if (aPlanet) a.hasCollided = true;
      if (bPlanet) b.hasCollided = true;
      if (!aPlanet || !bPlanet) continue;

      if (rel > 2.2) {
        a.squash = Math.min(0.16, a.squash + rel * 0.007);
        b.squash = Math.min(0.16, b.squash + rel * 0.007);
      }

      if (a.level === b.level && !a.merging && !b.merging) {
        a.merging = true;
        b.merging = true;
        pendingMerges.push([a, b]);
      }
    }
  }

  function spawnPlanet(level, x, y) {
    const cfg = LEVELS[level - 1];
    const b = Bodies.circle(x, y, cfg.radius, {
      restitution: 0.16,
      friction: 0.32,
      frictionStatic: 0.4,
      frictionAir: 0.008,
      density: 0.001 * Math.pow(1.45, level),
      slop: 0.03,
      label: 'planet',
    });
    if (level >= 2) Body.setInertia(b, b.inertia * 0.35);
    b.isPlanet = true;
    b.level = level;
    b.merging = false;
    b.pop = 1;
    b.popV = 0;
    b.squash = 0;
    b.overTime = 0;
    b.spawnedAt = performance.now();
    b.hasCollided = false;
    b.blinkSeed = Math.random() * 6.28;
    b.angle = (Math.random() - 0.5) * (level <= 2 ? 0.55 : 0.18);
    b.angularVelocity = (Math.random() - 0.5) * 0.008;
    Composite.add(engine.world, b);
    return b;
  }

  function planetBodies() {
    const all = Composite.allBodies(engine.world);
    const out = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].isPlanet) out.push(all[i]);
    }
    return out;
  }

  function clearPlanets() {
    const all = Composite.allBodies(engine.world);
    for (let i = 0; i < all.length; i++) {
      if (all[i].isPlanet) Composite.remove(engine.world, all[i]);
    }
  }

  /* ------------------------------------------------------------
 Merging & scoring
 ------------------------------------------------------------ */
  function processMerges() {
    if (!pendingMerges.length) return;
    const list = pendingMerges;
    pendingMerges = [];
    for (let i = 0; i < list.length; i++) {
      const a = list[i][0];
      const b = list[i][1];
      if (!a.isPlanet || !b.isPlanet) continue;
      mergePair(a, b);
    }
  }

  function mergePair(a, b) {
    const level = a.level;
    const x = (a.position.x + b.position.x) / 2;
    const y = (a.position.y + b.position.y) / 2;
    const vx = (a.velocity.x + b.velocity.x) * 0.25;
    const vy = (a.velocity.y + b.velocity.y) * 0.25;

    a.isPlanet = false;
    b.isPlanet = false;
    Composite.remove(engine.world, a);
    Composite.remove(engine.world, b);

    const isMax = level >= MAX_LEVEL;
    const newLevel = isMax ? MAX_LEVEL : level + 1;
    const base = isMax ? 1000 : LEVELS[newLevel - 1].score;
    const gained = awardMerge(base);

    burst(x, y, level, isMax);
    rings.push({
      x: x,
      y: y,
      r0: LEVELS[level - 1].radius * 0.4,
      r1: LEVELS[level - 1].radius * 2.2,
      life: 0.55,
      max: 0.55,
      color: LEVELS[level - 1].glow,
    });
    popups.push({
      x: x,
      y: y - LEVELS[level - 1].radius * 0.5,
      text: '+' + fmt(gained),
      sub: S.combo > 1 ? '×' + S.combo : '',
      life: 1.05,
      max: 1.05,
      color: S.combo > 1 ? '#ffe6a3' : '#ffffff',
    });

    if (!isMax) {
      const nb = spawnPlanet(newLevel, x, y);
      nb.pop = 0.52;
      nb.popV = 3.2;
      Body.setVelocity(nb, { x: vx, y: vy - 0.7 });
      Body.setAngularVelocity(nb, (Math.random() - 0.5) * 0.12);
      S.maxLevel = Math.max(S.maxLevel, newLevel);
      updateEvo();
      if (newLevel >= 7) addShake(0.3, 4 + newLevel * 0.5);
      if (newLevel >= 9) {
        flash(0.34);
        Sound.pop();
      }
    } else {
      flash(0.8);
      addShake(0.6, 13);
      Sound.pop();
    }

    haptic(newLevel >= 7 ? 'medium' : 'light');
    Sound.merge(newLevel, S.combo);
    updateScore();
    syncControls();
  }

  function awardMerge(base) {
    const now = performance.now();
    if (now - S.lastMerge < 1500) {
      S.combo = Math.min(S.combo + 1, 9);
    } else {
      S.combo = 1;
    }
    S.lastMerge = now;
    const gained = base * S.combo;
    S.score += gained;
    if (S.combo > 1) showCombo(S.combo);
    return gained;
  }

  function randomLevel() {
    const r = Math.random();
    if (r < 0.55) return 1;
    if (r < 0.85) return 2;
    return 3;
  }

  /* ------------------------------------------------------------
 Game flow
 ------------------------------------------------------------ */
  function showScreen(name) {
    startScreen.classList.toggle('show', name === 'start');
    pauseScreen.classList.toggle('show', name === 'pause');
    overScreen.classList.toggle('show', name === 'over');
    vipScreen.classList.toggle('show', name === 'vip');
    syncLoop();
  }

  function syncControls() {
    if (settingsSoundBtn) {
      settingsSoundBtn.textContent = Sound.muted
        ? (window.I18N && I18N.lang === 'en' ? 'Off' : 'Выкл')
        : (window.I18N && I18N.lang === 'en' ? 'On' : 'Вкл');
      settingsSoundBtn.classList.toggle('off', Sound.muted);
    }
    if (settingsVibrationBtn) {
      settingsVibrationBtn.textContent = vibrationOn
        ? (window.I18N && I18N.lang === 'en' ? 'On' : 'Вкл')
        : (window.I18N && I18N.lang === 'en' ? 'Off' : 'Выкл');
      settingsVibrationBtn.classList.toggle('off', !vibrationOn);
    }

    if (pauseBtn) {
      const canPause = S.mode === 'playing' || S.mode === 'paused';
      pauseBtn.disabled = !canPause;
      pauseBtn.classList.toggle('is-paused', S.mode === 'paused');
      pauseBtn.setAttribute('aria-label', S.mode === 'paused' ? 'Продолжить' : 'Пауза');
    }

    shakeBtn.disabled = S.mode !== 'playing' || (isVip() && S.bonusReadyAt.shake > Date.now());
    cleanBtn.disabled = S.mode !== 'playing' || (isVip() && S.bonusReadyAt.clean > Date.now());
    shakeBtn.classList.toggle('vip', isVip());
    cleanBtn.classList.toggle('vip', isVip());
    shakeBtn.classList.toggle('cooldown', isVip() && S.bonusReadyAt.shake > Date.now());
    cleanBtn.classList.toggle('cooldown', isVip() && S.bonusReadyAt.clean > Date.now());
  }

  function startGame() {
    Sound.unlock();
    Sound.ui();
    S.overToken++;
    clearPlanets();
    pendingMerges = [];
    particles = [];
    rings = [];
    popups = [];
    flashA = 0;
    shakeT = 0;
    acc = 0;

    S.score = 0;
    S.combo = 0;
    S.lastMerge = 0;
    S.danger = 0;
    S.maxLevel = 1;
    S.cooldown = 0;
    S.shakeLock = 0;
    S.holdIn = 1;
    S.aimX = WORLD_W / 2;
    S.aimTarget = WORLD_W / 2;
    S.warnTimer = 0;
    S.record = false;
    S.secondChanceUsed = false;
    if (secondChanceBtn) secondChanceBtn.disabled = false;
    S.current = randomLevel();
    S.next = randomLevel();

    showComboHide();
    toastEl.classList.remove('show');
    stage.classList.remove('danger');
    syncDangerUI();
    S.mode = 'playing';
    showScreen(null);
    syncControls();
    syncMusic();
    updateScore(false);
    updateBest();
    updateCharges();
    updateEvo();
    updatePreview();
    clampAim();
    bridgeSendMessage('level_started');
  }

  function goMenu() {
    S.overToken++;
    clearPlanets();
    pendingMerges = [];
    particles = [];
    rings = [];
    popups = [];
    S.current = null;
    S.next = null;
    S.mode = 'menu';
    S.danger = 0;
    S.score = 0;
    S.combo = 0;
    S.lastMerge = 0;
    S.shakeLock = 0;
    stage.classList.remove('danger');
    showComboHide();
    toastEl.classList.remove('show');
    showScreen('start');
    syncControls();
    syncMusic();
    syncDangerUI();
    updateScore(false);
    updatePreview();
  }

  function pauseGame() {
    if (S.mode !== 'playing') return;
    S.mode = 'paused';
    pointerActive = false;
    showScreen('pause');
    syncControls();
    syncMusic();
  }

  function resumeGame() {
    if (S.mode !== 'paused') return;
    S.mode = 'playing';
    showScreen(null);
    syncControls();
    syncMusic();
  }

  function endGame() {
    if (S.mode !== 'playing') return;
    S.mode = 'over';
    S.danger = 0;
    stage.classList.remove('danger');
    pointerActive = false;
    Sound.gameOver();
    syncMusic();
    loopHoldUntil = performance.now() + 900;
    addShake(0.55, 10);
    flash(0.35);
    burst(WORLD_W / 2, DANGER_Y + 20, 8, true);

    const isRecord = S.score > S.best;
    if (isRecord) {
      S.best = S.score;
      writeBest(S.best);
      updateBest();
    }
    S.record = isRecord;
    bridgeSendMessage('level_failed');
    syncControls();
    syncDangerUI();
    showComboHide();

    const token = ++S.overToken;
    setTimeout(function () {
      if (S.mode !== 'over' || token !== S.overToken) return;
      finalScoreEl.textContent = fmt(S.score);
      recordLineEl.textContent = 'Рекорд: ' + fmt(S.best);
      recordBadgeEl.classList.toggle('show', S.record);
      if (secondChanceBtn) secondChanceBtn.disabled = S.secondChanceUsed;
      showScreen('over');
      showInterstitialAd(null);
    }, 640);
  }

  function dropCurrent() {
    if (S.mode !== 'playing' || S.cooldown > 0 || S.current == null) return;
    const level = S.current;
    const rad = LEVELS[level - 1].radius;
    const x = clamp(S.aimX, rad + 2, WORLD_W - rad - 2);
    const b = spawnPlanet(level, x, HOLD_Y);
    Body.setVelocity(b, { x: 0, y: 2.6 });
    b.pop = 0.88;
    b.popV = 0;

    for (let i = 0; i < 5; i++) {
      particles.push({
        x: x + rand(-rad * 0.6, rad * 0.6),
        y: HOLD_Y + rand(-4, 6),
        vx: rand(-30, 30),
        vy: rand(10, 60),
        life: rand(0.25, 0.5),
        max: 0.5,
        size: rand(1, 2),
        color: 'rgba(160, 215, 255, 0.8)',
        rot: 0,
        spin: 0,
        star: false,
      });
    }

    Sound.drop();
    S.current = null;
    S.cooldown = DROP_COOLDOWN;
    updatePreview();
    clampAim();
    syncControls();
  }

  function hasSmallBodies() {
    const list = planetBodies();
    for (let i = 0; i < list.length; i++) {
      if (list[i].level <= 2) return true;
    }
    return false;
  }

  function applyShake() {
    const list = planetBodies();
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (Sleeping) Sleeping.set(b, false);
      Body.setVelocity(b, {
        x: (Math.random() - 0.5) * 18,
        y: -(12 + Math.random() * 10),
      });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.6);
      b.shakeLaunched = true;
    }
    S.shakeLock = 0.8;
    shakeT = 0.4;
    shakeDur = 0.4;
    shakeMag = 16;
    haptic('medium');
    Sound.shake();
    showToast('Стакан встряхнут!');
  }

  function applyClean() {
    const list = planetBodies();
    const small = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].level <= 2) small.push(list[i]);
    }
    if (!small.length) {
      showToast('Мелких объектов нет');
      return;
    }
    for (let i = 0; i < small.length; i++) {
      const b = small[i];
      burst(b.position.x, b.position.y, b.level, false);
      b.isPlanet = false;
      Composite.remove(engine.world, b);
    }
    haptic('light');
    Sound.clean();
    flash(0.12);
    showToast('Убрано объектов: ' + small.length);
  }

  function applyBonus(kind) {
    if (kind === 'shake') applyShake();
    else applyClean();
    updateBonusUI();
  }

  let vibrationOn = true;
  try { vibrationOn = localStorage.getItem('mergeCosmos.vibration.v1') !== '0'; } catch (err) {}

  function haptic(strength) {
    if (!vibrationOn) return;
    try {
      const hf = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback;
      if (hf && typeof hf.impactOccurred === 'function') hf.impactOccurred(strength);
    } catch (err) {}
  }

  function requestBonus(kind) {
    if (S.mode !== 'playing' || adShowing > 0) return;
    const vip = isVip();
    const now = Date.now();
    if (vip && S.bonusReadyAt[kind] > now) return;
    if (kind === 'clean' && !hasSmallBodies()) {
      showToast('Мелких объектов нет');
      return;
    }
    Sound.unlock();
    if (vip) {
      S.bonusReadyAt[kind] = Date.now() + VIP_BONUS_COOLDOWN;
      applyBonus(kind);
      return;
    }
    if (S.charges[kind] > 0) {
      S.charges[kind] -= 1;
      saveCharges();
      applyBonus(kind);
      return;
    }
    showRewardedAd(function () {
      applyBonus(kind);
    });
  }

  function showRewardedAd(onRewarded) {
    if (isVip()) {
      onRewarded();
      return;
    }
    if (
      !bridgeOnline ||
      !bridgeApi ||
      !bridgeApi.advertisement ||
      !bridgeApi.advertisement.isRewardedSupported
    ) {
      showToast('Реклама недоступна');
      return;
    }
    if (adShowing > 0) return;
    rewardedReturnPlay = S.mode === 'playing';
    rewardedPending = onRewarded || null;
    rewardEarned = false;
    rewardedGranted = false;
    rewardedOpen = true;
    refreshAdState();
    try {
      const request = bridgeApi.advertisement.showRewarded('bonus');
      if (request && request.catch) request.catch(function () {});
    } catch (err) {
      rewardedOpen = false;
      rewardedPending = null;
      refreshAdState();
      showToast('Реклама недоступна');
    }
  }

  function showInterstitialAd(after) {
    if (isVip()) {
      if (after) after();
      return;
    }
    if (adShowing > 0) {
      if (after) after();
      return;
    }
    if (
      !bridgeOnline ||
      !bridgeApi ||
      !bridgeApi.advertisement ||
      !bridgeApi.advertisement.isInterstitialSupported
    ) {
      if (after) after();
      return;
    }

    let finished = false;
    const finish = function () {
      if (finished) return;
      finished = true;
      if (interstitialFallback) {
        clearTimeout(interstitialFallback);
        interstitialFallback = 0;
      }
      interstitialOpen = false;
      interstitialPending = null;
      refreshAdState();
      if (after) after();
    };

    interstitialPending = finish;
    interstitialTouched = false;
    interstitialOpen = true;
    refreshAdState();

    try {
      const request = bridgeApi.advertisement.showInterstitial('level_transition');
      if (request && request.catch) request.catch(function () {});
    } catch (err) {
      finish();
      return;
    }

    interstitialFallback = setTimeout(function () {
      interstitialFallback = 0;
      if (!interstitialTouched) finish();
    }, 5000);
  }

  /* ------------------------------------------------------------
 Per-frame updates
 ------------------------------------------------------------ */
  function updateAim(dt) {
    S.aimX += (S.aimTarget - S.aimX) * Math.min(1, dt * 22);
  }

  function updateGame(dt) {
    if (S.cooldown > 0) {
      S.cooldown = Math.max(0, S.cooldown - dt);
      if (S.cooldown === 0) {
        S.current = S.next;
        S.next = randomLevel();
        S.holdIn = 0;
        clampAim();
        updatePreview();
        syncControls();
      }
    }

    if (S.holdIn < 1) S.holdIn = Math.min(1, S.holdIn + dt * 3.4);

    if (S.shakeLock > 0) S.shakeLock = Math.max(0, S.shakeLock - dt);
    clampShakeBodies();

    updateDanger(dt);
    stage.classList.toggle('danger', S.danger > 0.1);
  }

  function clampShakeBodies() {
    const list = planetBodies();
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (!b.shakeLaunched) continue;
      const minY = b.circleRadius + 2;
      if (b.position.y < minY) {
        Body.setPosition(b, { x: b.position.x, y: minY });
        if (b.velocity.y < 0) Body.setVelocity(b, { x: b.velocity.x, y: 2 });
      }
    }
  }

  function updateDanger(dt) {
    let danger = false;
    let crossing = false;
    const now = performance.now();
    const list = planetBodies();
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (now - (b.spawnedAt || 0) < 800 && !b.hasCollided) {
        b.overTime = 0;
        continue;
      }
      const above = b.position.y - b.circleRadius < DANGER_Y;
      if (above) {
        b.overTime = (b.overTime || 0) + dt;
        crossing = true;
      } else {
        b.overTime = 0;
      }
      const settled = b.isSleeping || b.speed < 2.2;
      if (b.overTime > 0.32 && settled) danger = true;
    }

    if (!crossing) {
      S.danger = 0;
      S.warnTimer = 0;
    } else if (danger) {
      S.danger = Math.min(DANGER_TIME + 0.4, S.danger + dt);
    }

    if (S.danger > 0.35) {
      S.warnTimer -= dt;
      if (S.warnTimer <= 0) {
        Sound.warn();
        S.warnTimer = 0.55;
      }
    }

    if (S.danger >= DANGER_TIME) endGame();
    syncDangerUI();
  }

  function syncDangerUI() {
    const on = S.mode === 'playing' && S.danger > 0.06;
    dangerBadgeEl.classList.toggle('show', on);
    if (view.scale > 0) {
      const lineY = view.jarTop + DANGER_Y * view.scale;
      const badgeH = dangerBadgeEl.offsetHeight || 44;
      dangerBadgeEl.style.top = Math.max(0, Math.round(lineY + 8 + badgeH)) + 'px';
    }
    if (!on) return;
    dangerTimeEl.textContent = Math.max(0, DANGER_TIME - S.danger).toFixed(1) + (window.I18N && I18N.lang === 'en' ? 's' : 'с');
    dangerFillEl.style.width = Math.min(100, (S.danger / DANGER_TIME) * 100).toFixed(1) + '%';
  }

  function updateBodyVisuals(dt) {
    const k = 260;
    const damping = 17;
    const list = planetBodies();
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      b.popV += (1 - b.pop) * k * dt - b.popV * damping * dt;
      b.pop += b.popV * dt;
      if (b.pop < 0.2) b.pop = 0.2;
      if (b.pop > 1.6) b.pop = 1.6;
      b.squash *= Math.pow(0.001, dt);
      if (b.squash > 0.16) b.squash = 0.16;
      b.angularVelocity *= Math.pow(0.22, dt);
    }
  }

  function updateEffects(dt) {
    if (particles.length > MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.vy += 260 * dt;
      p.vx *= Math.pow(0.25, dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
    }

    for (let i = rings.length - 1; i >= 0; i--) {
      rings[i].life -= dt;
      if (rings[i].life <= 0) rings.splice(i, 1);
    }

    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.life -= dt;
      p.y -= 34 * dt;
      if (p.life <= 0) popups.splice(i, 1);
    }

    if (flashA > 0) flashA = Math.max(0, flashA - dt * 2.1);
    if (shakeT > 0) shakeT = Math.max(0, shakeT - dt);

    if (!shoot) {
      shootTimer -= dt;
      if (shootTimer <= 0) {
        shoot = {
          x: rand(view.w * 0.15, view.w * 0.9),
          y: rand(0, Math.max(20, view.h * 0.45)),
          vx: rand(-520, -280),
          vy: rand(90, 190),
          life: 0.9,
        };
        shootTimer = rand(6, 12);
      }
    } else {
      shoot.life -= dt;
      shoot.x += shoot.vx * dt;
      shoot.y += shoot.vy * dt;
      if (shoot.life <= 0) shoot = null;
    }
  }

  function clampAim() {
    const level = S.current;
    const rad = level ? LEVELS[level - 1].radius : 20;
    const min = rad + 2;
    const max = WORLD_W - rad - 2;
    S.aimX = clamp(S.aimX, min, max);
    S.aimTarget = clamp(S.aimTarget, min, max);
  }

  /* ------------------------------------------------------------
 Effects helpers
 ------------------------------------------------------------ */
  function addShake(dur, mag) {
    shakeT = Math.max(shakeT, dur);
    shakeDur = Math.max(shakeDur, dur);
    shakeMag = Math.max(shakeMag, mag);
  }

  function flash(v) {
    flashA = Math.max(flashA, v);
  }

  function starPath(c, x, y, radius, rot) {
    c.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = rot + (i * TAU) / 8;
      const rr = i % 2 ? radius * 0.36 : radius;
      const px = x + Math.cos(a) * rr;
      const py = y + Math.sin(a) * rr;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
  }

  function burst(x, y, level, big) {
    const cfg = LEVELS[level - 1];
    const count = big ? 34 : 16;
    for (let i = 0; i < count; i++) {
      const angle = rand(0, TAU);
      const speed = rand(40, big ? 280 : 175);
      const life = rand(0.45, big ? 1.15 : 0.9);
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 25,
        life: life,
        max: life,
        size: rand(1.4, big ? 4.8 : 3.2),
        color: pick(cfg.spark),
        rot: rand(0, TAU),
        spin: rand(-7, 7),
        star: Math.random() < 0.55,
      });
    }

    rings.push({
      x: x,
      y: y,
      r0: 4,
      r1: (big ? 160 : 80) + level * 3,
      life: 0.42,
      max: 0.42,
      color: cfg.glow,
    });

    if (big) {
      rings.push({
        x: x,
        y: y,
        r0: 12,
        r1: 240,
        life: 0.7,
        max: 0.7,
        color: 'rgba(200,150,255,0.9)',
      });
    }
  }

  function showCombo(n) {
  const lineY = view.jarTop + DANGER_Y * view.scale;
  comboEl.style.top = Math.max(0, Math.round(lineY + 34)) + 'px';
    comboEl.textContent = 'КОМБО ×' + n;
    comboEl.classList.remove('show');
    void comboEl.offsetWidth;
    comboEl.classList.add('show');
    clearTimeout(comboTimer);
    comboTimer = setTimeout(function () {
      comboEl.classList.remove('show');
    }, 1200);
  }

  function showComboHide() {
    comboEl.classList.remove('show');
  }

  function showToast(msg) {
    toastEl.textContent = window.I18N ? I18N.t(msg) : msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 1700);
  }
  window.showGameToast = showToast;

  function bump(el) {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  function updateScore(animate) {
    scoreEl.textContent = fmt(S.score);
    if (animate !== false) bump(scoreEl);
  }

  function updateBest() {
    bestEl.textContent = fmt(S.best);
  }

  function isVip() {
    return S.vipUntil > Date.now();
  }

  function formatVipLeft(ms) {
    const total = Math.max(0, Math.ceil(ms / 60000));
    const h = Math.floor(total / 60);
    const m = total % 60;
    var en = !!(window.I18N && I18N.lang === 'en');
    return h > 0 ? h + (en ? 'h ' : 'ч ') + m + (en ? 'm' : 'м') : m + (en ? 'm' : 'м');
  }

  document.addEventListener('i18n:change', function () {
    try { updateVipUI(); } catch (err) { /* noop */ }
    try { renderThemeList(); } catch (err) { /* noop */ }
    try { updateEvoTitle(); } catch (err) { /* noop */ }
    try { renderDailyGrid(); } catch (err) { /* noop */ }
    try { updateDailyBadge(); } catch (err) { /* noop */ }
    try { renderLeaderboard(); } catch (err) { /* noop */ }
  });

  function updateVipUI() {
    const active = isVip();
    const ads = clamp(S.vipAds, 0, VIP_ADS_REQUIRED);
    var vipLabel = $('vipBtnLabel') || vipBtn;
    vipLabel.textContent = active ? 'VIP активен' : 'VIP на 24 часа';
    vipBtn.classList.toggle('is-vip', active);
    vipBtn.classList.toggle('vip-active', active);
    if (active) {
      vipBuyBtn.textContent = 'VIP активен';
      vipBuyBtn.disabled = true;
      vipStatusEl.textContent = 'Активно: осталось ' + formatVipLeft(S.vipUntil - Date.now());
    } else {
      vipBuyBtn.textContent = 'Активировать VIP на 24ч (' + ads + '/5 рекламы)';
      vipBuyBtn.disabled = false;
      vipStatusEl.textContent = 'Прогресс: ' + ads + ' из 5 · VIP на 24 часа';
    }
    updateBonusUI();
  }

  function currentScreenName() {
    if (S.mode === 'playing') return null;
    if (S.mode === 'paused') return 'pause';
    if (S.mode === 'over') return 'over';
    return 'start';
  }

  let vipReturnMode = null;

  function activateVip() {
    S.vipUntil = Date.now() + VIP_HOURS * 3600000;
    S.vipAds = 0;
    saveValue(VIP_ADS_KEY, 0);
    S.bonusReadyAt.shake = 0;
    S.bonusReadyAt.clean = 0;
    saveValue(VIP_KEY, S.vipUntil);
    updateVipUI();
    showToast('VIP активирован на 24 часа');
  }

  function openVip() {
    Sound.unlock();
    vipReturnMode = S.mode;
    if (S.mode === 'playing') {
      S.mode = 'paused';
      pointerActive = false;
      syncControls();
      syncMusic();
    }
    updateVipUI();
    showScreen('vip');
  }

  function closeVip() {
    const back = vipReturnMode;
    vipReturnMode = null;
    if (back === 'playing') {
      S.mode = 'playing';
      showScreen(null);
      syncControls();
      syncMusic();
      return;
    }
    showScreen(currentScreenName());
  }

  function buyVip() {
    Sound.unlock();
    if (isVip()) {
      showToast('VIP уже активен');
      return;
    }
    if (adShowing > 0) return;
    showRewardedAd(function () {
      if (isVip()) return;
      S.vipAds = clamp(S.vipAds + 1, 0, VIP_ADS_REQUIRED);
      saveValue(VIP_ADS_KEY, S.vipAds);
      if (S.vipAds >= VIP_ADS_REQUIRED) {
        activateVip();
      } else {
        updateVipUI();
        showToast('Просмотр ' + S.vipAds + '/5 · осталось ' + (VIP_ADS_REQUIRED - S.vipAds));
      }
    });
  }

  function shareRecord() {
    Sound.unlock();
    if (!bridgeOnline || !bridgeApi || !bridgeApi.social || typeof bridgeApi.social.share !== 'function') {
      showToast('Поделиться недоступно');
      return;
    }
    Promise.resolve(bridgeApi.social.share('score'))
      .then(function () {
        showToast('Спасибо, что поделились!');
      })
      .catch(function () {
        showToast('Не удалось поделиться');
      });
  }

  /* ------------------------------------------------------------
   Cloud best score (Telegram.WebApp.CloudStorage)
   ------------------------------------------------------------ */
  const CLOUD_BEST_KEY = 'planet_merge_best';

  function cloudStorageApi() {
    try {
      const tg = window.Telegram && window.Telegram.WebApp;
      return (tg && tg.CloudStorage) || null;
    } catch (err) {
      return null;
    }
  }

  function cloudSaveBest(value) {
    const api = cloudStorageApi();
    if (!api || typeof api.setItem !== 'function') return;
    try {
      api.setItem(CLOUD_BEST_KEY, String(value), function () {});
    } catch (err) {}
  }

  function cloudLoadBest() {
    const api = cloudStorageApi();
    if (!api || typeof api.getItem !== 'function') return;
    try {
      api.getItem(CLOUD_BEST_KEY, function (err, value) {
        if (err) return;
        if (value === null || value === undefined || value === '') {
          if (S.best > 0) cloudSaveBest(S.best);
          return;
        }
        const cloud = parseInt(String(value), 10);
        if (!Number.isFinite(cloud)) return;
        if (cloud <= S.best) {
          if (S.best > 0) cloudSaveBest(S.best);
          return;
        }
        S.best = cloud;
        localSet(BEST_KEY, cloud);
        updateBest();
        savePlayerProfile();
        renderLeaderboard();
      });
    } catch (err) {}
  }

  /* ------------------------------------------------------------
   Space leaderboard
   ------------------------------------------------------------ */
  const LB_PLAYERS_KEY = 'merge_cosmos_players_v1';
  const LB_CLOUD_KEY = 'planet_merge_leaderboard_v1';
  const LB_GUEST_KEY = 'merge_cosmos_guest_id_v1';
  const LB_TOP_LIMIT = 50;

  function leaderboardEndpoint(suffix) {
    const base = String(LEADERBOARD_DB_URL || '').trim().replace(/\/+$/, '');
    return base ? base + suffix : '';
  }

  function telegramPlayer() {
    try {
      const webApp = window.Telegram && window.Telegram.WebApp;
      const user = webApp && webApp.initDataUnsafe ? webApp.initDataUnsafe.user : null;
      return user && user.id != null ? user : null;
    } catch (err) {
      return null;
    }
  }

  function guestPlayerId() {
    let id = '';
    try {
      id = localStorage.getItem(LB_GUEST_KEY) || '';
    } catch (err) {
      id = '';
    }
    if (!id) {
      id = 'guest_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      try {
        localStorage.setItem(LB_GUEST_KEY, id);
      } catch (err) {}
    }
    return id;
  }

  function playerNameFrom(user) {
    const parts = [];
    if (user && typeof user.first_name === 'string' && user.first_name.trim()) parts.push(user.first_name.trim());
    if (user && typeof user.last_name === 'string' && user.last_name.trim()) parts.push(user.last_name.trim());
    let name = parts.join(' ');
    if (!name && user && typeof user.username === 'string' && user.username.trim()) name = '@' + user.username.trim();
    return name.slice(0, 28);
  }

  function guestName(id) {
    const tail = String(id || '').replace(/^guest_/, '').slice(-4).toUpperCase() || '0000';
    const en = !!(window.I18N && I18N.lang === 'en');
    return (en ? 'Guest' : 'Гость') + ' #' + tail;
  }

  function currentPlayerProfile() {
    const user = telegramPlayer();
    let id = '';
    let name = '';
    let photoUrl = '';
    if (user) {
      id = 'tg_' + String(user.id);
      name = playerNameFrom(user) || guestName(id);
      photoUrl = typeof user.photo_url === 'string' ? user.photo_url : '';
    } else {
      id = guestPlayerId();
      name = guestName(id);
    }
    return {
      id: id,
      name: name,
      photoUrl: photoUrl,
      score: Math.max(0, Math.floor(Number(S.best) || 0)),
      updatedAt: Date.now()
    };
  }

  function validPlayer(item) {
    if (!item || typeof item !== 'object') return null;
    const id = typeof item.id === 'string' && item.id ? item.id : '';
    if (!id) return null;
    const raw = Number(item.score);
    const score = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
    const name = String(item.name || '').slice(0, 28) || guestName(id);
    return {
      id: id,
      name: name,
      photoUrl: typeof item.photoUrl === 'string' ? item.photoUrl : '',
      score: score,
      updatedAt: Number(item.updatedAt) || 0
    };
  }

  function readPlayersMap() {
    const out = {};
    try {
      const raw = localStorage.getItem(LB_PLAYERS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach(function (key) {
          const player = validPlayer(parsed[key]);
          if (player) out[player.id] = player;
        });
      }
    } catch (err) {}
    return out;
  }

  function cloudLeaderboardApi() {
    try {
      const tg = window.Telegram && window.Telegram.WebApp;
      return (tg && tg.CloudStorage) || null;
    } catch (err) {
      return null;
    }
  }

  function writeCloudPlayers(map) {
    const api = cloudLeaderboardApi();
    if (!api || typeof api.setItem !== 'function') return;
    const list = Object.keys(map).map(function (key) {
      return map[key];
    }).sort(sortPlayers).slice(0, 15).map(function (player) {
      return {
        id: player.id,
        name: player.name,
        photoUrl: String(player.photoUrl || '').slice(0, 300),
        score: player.score,
        updatedAt: player.updatedAt
      };
    });
    let payload = JSON.stringify(list);
    while (payload.length > 3800 && list.length > 1) {
      list.pop();
      payload = JSON.stringify(list);
    }
    try {
      api.setItem(LB_CLOUD_KEY, payload, function () {});
    } catch (err) {}
  }

  function writePlayersMap(map) {
    try {
      localStorage.setItem(LB_PLAYERS_KEY, JSON.stringify(map));
    } catch (err) {}
    writeCloudPlayers(map);
  }

  function mergePlayerInto(map, player) {
    const next = validPlayer(player);
    if (!next) return;
    const prev = map[next.id];
    if (prev) {
      next.score = Math.max(next.score, prev.score);
      if (!next.photoUrl && prev.photoUrl) next.photoUrl = prev.photoUrl;
      if (!next.name && prev.name) next.name = prev.name;
      next.updatedAt = Math.max(next.updatedAt, prev.updatedAt);
    }
    map[next.id] = next;
  }

  function putPlayerToCloudDb(player) {
    const url = leaderboardEndpoint('/' + encodeURIComponent(player.id) + '.json');
    if (!url || typeof fetch !== 'function') return;
    try {
      fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: player.id,
          name: player.name,
          photoUrl: player.photoUrl,
          score: player.score,
          updatedAt: player.updatedAt
        })
      }).catch(function () {});
    } catch (err) {}
  }

  function savePlayerProfile() {
    const profile = currentPlayerProfile();
    const map = readPlayersMap();
    mergePlayerInto(map, profile);
    writePlayersMap(map);
    putPlayerToCloudDb(map[profile.id] || profile);
    return profile;
  }

  function loadCloudPlayers(done) {
    const finish = typeof done === 'function' ? done : function () {};
    const url = leaderboardEndpoint('.json');
    if (url && typeof fetch === 'function') {
      let settled = false;
      const doneOnce = function (list) {
        if (settled) return;
        settled = true;
        finish(list);
      };
      try {
        fetch(url, { cache: 'no-store' }).then(function (response) {
          return response && response.ok ? response.json() : null;
        }).then(function (data) {
          const list = [];
          if (data && typeof data === 'object') {
            Object.keys(data).forEach(function (key) {
              const player = validPlayer(data[key]);
              if (player) list.push(player);
            });
          }
          if (list.length) {
            const map = readPlayersMap();
            list.forEach(function (player) { mergePlayerInto(map, player); });
            writePlayersMap(map);
          }
          doneOnce(list);
        }).catch(function () {
          doneOnce(null);
        });
        setTimeout(function () { doneOnce(null); }, 4500);
      } catch (err) {
        doneOnce(null);
      }
      return;
    }
    const api = cloudLeaderboardApi();
    if (!api || typeof api.getItem !== 'function') {
      finish(null);
      return;
    }
    try {
      api.getItem(LB_CLOUD_KEY, function (err, value) {
        if (err || !value) {
          finish(null);
          return;
        }
        let parsed = null;
        try {
          parsed = JSON.parse(value);
        } catch (parseErr) {
          parsed = null;
        }
        if (!Array.isArray(parsed)) {
          finish(null);
          return;
        }
        const map = readPlayersMap();
        parsed.forEach(function (player) { mergePlayerInto(map, player); });
        writePlayersMap(map);
        finish(parsed);
      });
    } catch (err) {
      finish(null);
    }
  }

  function playerInitial(name) {
    const clean = String(name || '').replace(/^@+/, '').trim();
    return clean ? clean.charAt(0).toUpperCase() : '?';
  }

  function sortPlayers(a, b) {
    if (b.score !== a.score) return b.score - a.score;
    const an = String(a.name || '').toLowerCase();
    const bn = String(b.name || '').toLowerCase();
    return an < bn ? -1 : an > bn ? 1 : 0;
  }

  const LB_LEAGUES = [
    { step: 1, min: 0, max: 5000, name: 'Бронзовая орбита', points: '0+', desc: 'Первые шаги среди звёзд' },
    { step: 2, min: 5000, max: 20000, name: 'Серебряный пояс', points: '5 000+', desc: 'Уверенный покоритель орбит' },
    { step: 3, min: 20000, max: 60000, name: 'Золотая туманность', points: '20 000+', desc: 'Мастер гравитации и комбо' },
    { step: 4, min: 60000, max: 175000, name: 'Платиновый квазар', points: '60 000+', desc: 'Элита звёздных систем' },
    { step: 5, min: 175000, max: 0, name: 'Повелитель Галактики', points: '175 000+', desc: 'Абсолютный чемпион Вселенной' }
  ];

  const LB_LEAGUE_COLOR = {
    1: '#d97706',
    2: '#94a3b8',
    3: '#fbbf24',
    4: '#67e8f9',
    5: '#c084fc'
  };

  const LB_LEAGUE_ACCENT = {
    1: '#b45309',
    2: '#cbd5e1',
    3: '#f59e0b',
    4: '#e0f2fe',
    5: '#e879f9'
  };

  function hexTriplet(hex) {
    const h = String(hex || '').replace('#', '');
    if (h.length !== 6) return '251, 191, 36';
    return parseInt(h.slice(0, 2), 16) + ', ' + parseInt(h.slice(2, 4), 16) + ', ' + parseInt(h.slice(4, 6), 16);
  }

  function applyCrestPalette(el, step) {
    if (!el) return;
    const color = LB_LEAGUE_COLOR[step] || '#fbbf24';
    const rgb = hexTriplet(color);
    const bg = 'rgba(' + rgb + ', 0.16)';
    const line = 'rgba(' + rgb + ', 0.72)';
    const glow = 'rgba(' + rgb + ', 0.55)';
    el.setAttribute('data-league', String(step));
    el.style.setProperty('--badge-color', color);
    el.style.setProperty('--badge-bg', bg);
    el.style.setProperty('--badge-border', line);
    el.style.setProperty('--badge-glow', glow);
    el.style.setProperty('--crest-rgb', rgb);
    el.style.setProperty('--crest-color', color);
    el.style.setProperty('--league-color', color);
    el.style.setProperty('--league-glow', glow);
    el.style.setProperty('background', bg, 'important');
    el.style.setProperty('background-image', 'none', 'important');
    el.style.setProperty('border', '1.5px solid ' + line, 'important');
    el.style.setProperty('box-shadow', 'inset 0 0 12px rgba(' + rgb + ', 0.38), 0 0 10px ' + glow, 'important');
    el.style.setProperty('color', color, 'important');
    const svg = el.querySelector('svg');
    if (svg) {
      svg.style.setProperty('color', color, 'important');
      svg.style.setProperty('stroke', 'currentColor', 'important');
      svg.style.setProperty('filter', 'drop-shadow(0 0 5px rgba(' + rgb + ', 0.85))', 'important');
    }
  }

  const LB_MEDAL = {
    1: '#ffd15c',
    2: '#d8e3ff',
    3: '#ffab6b'
  };

  let lbReturnMode = null;

  function lbTr(text) {
    try {
      if (window.I18N && typeof I18N.t === 'function') return I18N.t(text);
    } catch (err) {}
    return text;
  }

  function leagueForScore(score) {
    let found = LB_LEAGUES[0];
    for (let i = 0; i < LB_LEAGUES.length; i++) {
      if (score >= LB_LEAGUES[i].min) found = LB_LEAGUES[i];
    }
    return found;
  }

  function leaderboardRows() {
    const map = readPlayersMap();
    const self = currentPlayerProfile();
    const rows = [];
    Object.keys(map).forEach(function (id) {
      if (id === self.id) return;
      const player = map[id];
      let playerName = player.name;
      if (id.indexOf('guest_') === 0 && /^(Гость|Guest) #/i.test(playerName)) playerName = guestName(id);
      rows.push({
        id: id,
        name: playerName,
        photoUrl: player.photoUrl,
        score: player.score,
        you: false
      });
    });
    rows.push({
      id: self.id,
      name: self.name,
      photoUrl: self.photoUrl,
      score: self.score,
      you: true
    });
    rows.sort(sortPlayers);
    const top = rows.slice(0, LB_TOP_LIMIT);
    const inTop = top.some(function (row) { return row.you; });
    if (!inTop) {
      const selfRow = rows.filter(function (row) { return row.you; })[0];
      if (selfRow) top.push(selfRow);
    }
    return top;
  }

  function medalMarkup(place) {
    const color = LB_MEDAL[place];
    return '<svg class="lb-medal" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
      '<circle cx="12" cy="13.6" r="6.4" fill="none" stroke="' + color + '" stroke-width="1.9"/>' +
      '<path d="M12 10.3l1.2 2.4 2.6.4-1.9 1.9.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.9 2.6-.4 1.2-2.4z" fill="' + color + '"/>' +
      '<path d="M9.4 3.2h5.2l-1.3 4.1h-2.6L9.4 3.2z" fill="' + color + '" opacity="0.5"/>' +
      '</svg>';
  }

  const CREST_FAN_ANGLES = {
    1: [0],
    2: [-18, 18],
    3: [-26, 0, 26],
    4: [-33, -11, 11, 33],
    5: [-40, -20, 0, 20, 40]
  };

  function crestSpikeFan(tier) {
    const angles = CREST_FAN_ANGLES[tier] || CREST_FAN_ANGLES[1];
    const pivotX = 24;
    const pivotY = 31.2;
    const len = 15.4;
    const half = 2.5;
    let out = '';
    for (let i = 0; i < angles.length; i++) {
      const rad = angles[i] * Math.PI / 180;
      const dx = Math.sin(rad);
      const dy = Math.cos(rad);
      const px = -dy;
      const py = dx;
      out += '<path d="M' + (pivotX + px * half).toFixed(2) + ' ' + (pivotY + py * half).toFixed(2) +
        'L' + (pivotX + dx * len).toFixed(2) + ' ' + (pivotY + dy * len).toFixed(2) +
        'L' + (pivotX - px * half).toFixed(2) + ' ' + (pivotY - py * half).toFixed(2) +
        'z" fill="currentColor" stroke="none" opacity="0.92"/>';
    }
    return out;
  }

  function leagueCrestMarkup(tier, cls, color) {
    const tint = color || LB_LEAGUE_COLOR[tier] || '#ffd76a';
    const crown = tier >= 5
      ? '<path d="M16.6 9.2l2.6-5 4.8 3.4 4.8-3.4 2.6 5"/><circle cx="24" cy="3.4" r="1.7" fill="currentColor" stroke="none"/>'
      : '<circle cx="24" cy="7.4" r="1.5" fill="currentColor" stroke="none" opacity="0.55"/>';
    return '<svg class="' + (cls || 'lb-crest') + '" style="color:' + tint + '" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      crestSpikeFan(tier) +
      '<path d="M15.4 18.6c-3.5-.5-6.4-2.4-8.1-5.8 3.8-.5 6.9.8 8.9 3.3"/>' +
      '<path d="M12.9 24.4c-3.3-1.4-5.6-4-6.8-7.4 3.6 0 6.5 1.6 8.4 4.2"/>' +
      '<path d="M32.6 18.6c3.5-.5 6.4-2.4 8.1-5.8-3.8-.5-6.9.8-8.9 3.3"/>' +
      '<path d="M35.1 24.4c3.3-1.4 5.6-4 6.8-7.4-3.6 0-6.5 1.6-8.4 4.2"/>' +
      crown +
      '<path d="M24 11.4l8 3v9.2c0 4.9-3.4 8.6-8 10.3-4.6-1.7-8-5.4-8-10.3v-9.2l8-3z"/>' +
      '<path d="M24 15.2l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5 1.6-3.3z" fill="currentColor" stroke="none"/>' +
      '</svg>';
  }

  function renderLeagueShowcase(current) {
    if (!lbLeaguesEl) return;
    lbLeaguesEl.innerHTML = '';
    const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.5l5 5 10-10"/></svg>';
    for (let i = 0; i < LB_LEAGUES.length; i++) {
      const item = LB_LEAGUES[i];
      const passed = item.step < current.step;
      const active = item.step === current.step;
      const card = document.createElement('div');
      card.className = 'lb-league-card' + (active ? ' is-current' : (passed ? ' is-passed' : ' is-next'));
      card.setAttribute('data-league', String(item.step));

      const flag = document.createElement('span');
      flag.className = 'lb-card-flag';
      if (active) {
        const now = document.createElement('span');
        now.className = 'lb-card-current';
        now.textContent = lbTr('Сейчас');
        flag.appendChild(now);
      } else if (passed) {
        const done = document.createElement('span');
        done.className = 'lb-card-check';
        done.innerHTML = check;
        flag.appendChild(done);
      } else {
        const pts = document.createElement('span');
        pts.className = 'lb-card-points';
        pts.textContent = item.points;
        flag.appendChild(pts);
      }
      card.appendChild(flag);

      const crest = document.createElement('span');
      crest.className = 'lb-card-crest';
      crest.innerHTML = leagueCrestMarkup(item.step, 'lb-crest');
      card.appendChild(crest);

      const name = document.createElement('b');
      name.className = 'lb-card-name';
      name.textContent = lbTr(item.name);
      card.appendChild(name);

      const desc = document.createElement('span');
      desc.className = 'lb-card-desc';
      desc.textContent = lbTr(item.desc);
      card.appendChild(desc);

      lbLeaguesEl.appendChild(card);
    }
  }

  function buildLbRow(row, place) {
    const el = document.createElement('div');
    el.className = 'lb-row' + (row.you ? ' is-you' : '') + (place <= 3 ? ' is-top' : '');

    const whoEl = document.createElement('span');
    whoEl.className = 'lb-who';

    const crestEl = document.createElement('span');
    crestEl.className = 'lb-av-crest';
    const rowLeague = leagueForScore(row.score);
    const rowLeagueColor = LB_LEAGUE_COLOR[rowLeague.step] || '#fbbf24';
    crestEl.innerHTML = leagueCrestMarkup(rowLeague.step, 'lb-crest', rowLeagueColor);
    applyCrestPalette(crestEl, rowLeague.step);
    whoEl.appendChild(crestEl);

    const avatarEl = document.createElement('span');
    avatarEl.className = 'lb-avatar';
    const initial = playerInitial(row.name);
    if (row.photoUrl) {
      const img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('error', function () {
        if (img.parentNode) img.parentNode.removeChild(img);
        avatarEl.classList.add('lb-avatar-fallback');
        avatarEl.textContent = initial;
      });
      img.src = row.photoUrl;
      avatarEl.appendChild(img);
    } else {
      avatarEl.classList.add('lb-avatar-fallback');
      avatarEl.textContent = initial;
    }
    whoEl.appendChild(avatarEl);

    const placeEl = document.createElement('span');
    placeEl.className = 'lb-place' + (LB_MEDAL[place] ? ' is-medal' : '');
    if (LB_MEDAL[place]) {
      placeEl.innerHTML = medalMarkup(place);
    } else {
      placeEl.textContent = '#' + place;
    }
    whoEl.appendChild(placeEl);

    const nameEl = document.createElement('span');
    nameEl.className = 'lb-name';
    nameEl.textContent = row.name;
    whoEl.appendChild(nameEl);

    if (row.you) {
      const badge = document.createElement('span');
      badge.className = 'lb-you';
      badge.textContent = lbTr('ВЫ');
      whoEl.appendChild(badge);
    }
    el.appendChild(whoEl);

    const scoreEl = document.createElement('span');
    scoreEl.className = 'lb-score';
    scoreEl.textContent = fmt(row.score);
    el.appendChild(scoreEl);

    return el;
  }

  function renderLeaderboard() {
    if (!lbListEl) return;
    const rows = leaderboardRows();
    const league = leagueForScore(S.best);
    const place = rows.findIndex(function (row) { return row.you; }) + 1;

    if (lbLeagueName) lbLeagueName.textContent = lbTr(league.name);
    if (lbLeagueSub) lbLeagueSub.textContent = lbTr('Ваша лига');
    if (lbLeagueStep) lbLeagueStep.textContent = league.step + ' / 5';
    if (lbRank) lbRank.textContent = '#' + place;
    const leagueColor = LB_LEAGUE_COLOR[league.step] || '#fbbf24';
    const leagueGlow = rgbaOf(leagueColor, 0.55);
    if (lbLeagueIcon) {
      lbLeagueIcon.innerHTML = leagueCrestMarkup(league.step, 'lb-league-crest', leagueColor);
      applyCrestPalette(lbLeagueIcon, league.step);
    }
    if (lbLeagueCard) {
      lbLeagueCard.setAttribute('data-league', String(league.step));
      lbLeagueCard.style.setProperty('--league-color', leagueColor);
      lbLeagueCard.style.setProperty('--league-glow', leagueGlow);
    }
    renderLeagueShowcase(league);

    let percent = 100;
    let progressText = lbTr('Максимальная лига');
    if (league.max > league.min) {
      percent = clamp(((S.best - league.min) / (league.max - league.min)) * 100, 0, 100);
      progressText = lbTr('До следующей лиги: ' + fmt(Math.max(0, league.max - S.best)));
    }
    if (lbProgressFill) lbProgressFill.style.width = percent.toFixed(1) + '%';
    if (lbProgressText) lbProgressText.textContent = progressText;

    lbListEl.innerHTML = '';
    for (let i = 0; i < rows.length; i++) {
      lbListEl.appendChild(buildLbRow(rows[i], i + 1));
    }

    requestAnimationFrame(function () {
      if (!lbListEl) return;
      const youRow = lbListEl.querySelector('.lb-row.is-you');
      if (!youRow) return;
      const target = Math.max(0, youRow.offsetTop - lbListEl.clientHeight / 2 + youRow.offsetHeight / 2);
      try {
        lbListEl.scrollTo({ top: target, behavior: 'smooth' });
      } catch (err) {
        lbListEl.scrollTop = target;
      }
    });
  }

  function openLeaderboard() {
    Sound.unlock();
    haptic('light');
    lbReturnMode = S.mode;
    if (S.mode === 'playing') pauseGame();
    savePlayerProfile();
    renderLeaderboard();
    loadCloudPlayers(function () {
      if (leaderboardOverlay && leaderboardOverlay.classList.contains('open')) renderLeaderboard();
    });
    if (leaderboardOverlay) {
      leaderboardOverlay.classList.add('open');
      leaderboardOverlay.setAttribute('aria-hidden', 'false');
    }
    syncLoop();
  }

  function closeLeaderboard() {
    if (leaderboardOverlay) {
      leaderboardOverlay.classList.remove('open');
      leaderboardOverlay.setAttribute('aria-hidden', 'true');
    }
    const back = lbReturnMode;
    lbReturnMode = null;
    if (back === 'playing' && S.mode === 'paused') resumeGame();
    syncLoop();
  }

  function leaderboardShare() {
    Sound.unlock();
    haptic('light');
    const en = !!(window.I18N && I18N.lang === 'en');
    const score = fmt(Math.max(0, S.best));
    const text = en
      ? 'My Merge Cosmos record is ' + score + ' points. Can you beat it?'
      : 'Мой рекорд в Merge Cosmos — ' + score + ' очков. Сможешь побить?';
    let gameUrl = 'https://t.me/planet_merge_game_bot/game';
    try {
      if (window.TGRef && typeof TGRef.inviteUrl === 'function') gameUrl = TGRef.inviteUrl();
    } catch (err) {}
    const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(gameUrl) +
      '&text=' + encodeURIComponent(text);
    let opened = false;
    try {
      const tg = window.Telegram && window.Telegram.WebApp;
      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(shareUrl);
        opened = true;
      }
    } catch (err) {}
    if (!opened) {
      try {
        window.open(shareUrl, '_blank');
      } catch (err) {}
    }
  }

  function adBooster() {
    Sound.unlock();
    if (adShowing > 0) return;
    showRewardedAd(function () {
      S.charges.shake = Math.min(99, S.charges.shake + 1);
      S.charges.clean = Math.min(99, S.charges.clean + 1);
      saveCharges();
      updateBonusUI();
      Sound.clean();
      showToast('+1 заряд к каждому бустеру!');
    });
  }

  function secondChance() {
    Sound.unlock();
    if (S.mode !== 'over' || S.secondChanceUsed || adShowing > 0) return;
    showRewardedAd(function () {
      if (S.mode !== 'over') return;
      S.secondChanceUsed = true;
      S.overToken++;
      const list = planetBodies();
      let removed = 0;
      for (let i = list.length - 1; i >= 0; i--) {
        const b = list[i];
        if (b.position.y - b.circleRadius < DANGER_Y + 28) {
          b.isPlanet = false;
          Composite.remove(engine.world, b);
          removed++;
        }
      }
      if (!removed) {
        for (let i = 0; i < Math.min(3, list.length); i++) {
          const b = list[i];
          if (b.isPlanet) {
            b.isPlanet = false;
            Composite.remove(engine.world, b);
          }
        }
      }
      S.danger = 0;
      S.cooldown = 0;
      S.current = randomLevel();
      S.next = randomLevel();
      S.mode = 'playing';
      lastFrame = 0;
      acc = 0;
      stage.classList.remove('danger');
      syncDangerUI();
      showScreen(null);
      syncControls();
      syncMusic();
      updatePreview();
      updateCharges();
      updateScore(false);
      if (secondChanceBtn) secondChanceBtn.disabled = true;
      showToast('Второй шанс! Игра продолжается');
    });
  }

  function updateBonusUI() {
    const vip = isVip();
    const now = Date.now();
    const items = [
      { key: 'shake', btn: shakeBtn, el: shakeChargesEl },
      { key: 'clean', btn: cleanBtn, el: cleanChargesEl },
    ];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const cd = vip ? Math.max(0, (item.key === 'shake' ? S.bonusReadyAt.shake : S.bonusReadyAt.clean) - now) : 0;
      if (vip && cd > 0) {
        item.el.textContent = String(Math.ceil(cd / 1000));
      } else {
        item.el.textContent = vip ? '∞' : '×' + S.charges[item.key];
      }
      item.btn.classList.toggle('vip', vip);
      item.btn.classList.toggle('cooldown', vip && cd > 0);
    }
    syncControls();
  }

  function updateCharges() {
    updateBonusUI();
  }

  function tickBonus() {
    if (S.vipUntil && !isVip()) {
      S.vipUntil = 0;
      saveValue(VIP_KEY, 0);
      updateVipUI();
      return;
    }
    if (isVip()) updateBonusUI();
    if (vipScreen.classList.contains('show')) updateVipUI();
  }

  function updateEvo() {
    for (let i = 0; i < evoItems.length; i++) {
      evoItems[i].classList.toggle('reached', i + 1 <= S.maxLevel);
    }
  }

  function updatePreview() {
    const d = clamp(window.devicePixelRatio || 1, 1, 3);
    const base = 64;
    const size = Math.round(base * d);
    if (nextPreview.width !== size || nextPreview.height !== size) {
      nextPreview.width = size;
      nextPreview.height = size;
    }
    previewCtx.setTransform(1, 0, 0, 1, 0, 0);
    previewCtx.clearRect(0, 0, size, size);
    if (!S.next) {
      nextNameEl.textContent = '—';
      nextCardEl.title = '';
      return;
    }
    const cfg = LEVELS[S.next - 1];
    previewCtx.setTransform(d, 0, 0, d, 0, 0);
    previewCtx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in previewCtx) previewCtx.imageSmoothingQuality = 'high';
    previewCtx.save();
    previewCtx.translate(32, 32);
    drawSpritePx(previewCtx, S.next, 0, 0, 26);
    drawFacePx(previewCtx, 26, cfg, 0.9);
    previewCtx.restore();
    nextNameEl.textContent = cfg.name;
    nextCardEl.title = 'Следующий объект: ' + cfg.name;
  }

  function buildEvo() {
    const d = clamp(window.devicePixelRatio || 1, 1, 3);
    const base = 76;
    const size = Math.round(base * d);
    evoEl.innerHTML = '';
    evoItems = [];
    for (let level = 1; level <= MAX_LEVEL; level++) {
      const item = document.createElement('div');
      item.className = 'evo-item';
      item.dataset.level = String(level);
      item.title = LEVELS[level - 1].name;

      const cv = document.createElement('canvas');
      cv.width = size;
      cv.height = size;
      cv.className = 'evo-canvas';
      const c = cv.getContext('2d');
      if (c) {
        c.imageSmoothingEnabled = true;
        if ('imageSmoothingQuality' in c) c.imageSmoothingQuality = 'high';
        c.setTransform(d, 0, 0, d, 0, 0);
        c.translate(base / 2, base / 2);
        drawSpritePx(c, level, 0, 0, 16);
      }
      item.appendChild(cv);

      const num = document.createElement('span');
      num.className = 'evo-num';
      num.textContent = String(level);
      item.appendChild(num);

      evoEl.appendChild(item);
      evoItems.push(item);
    }
    updateEvo();
  }

  /* ------------------------------------------------------------
   Themes collection (3 skins) — v1.3.0
   ------------------------------------------------------------ */
  const THEMES = [
    {
      id: 'cosmos',
      name: 'Классический космос',
      sub: 'Стандартный дизайн планет и фона',
      cost: 0,
      swatch: ['#7c5cff', '#43e7ff', '#ff5ea8'],
    },
    {
      id: 'neon',
      name: 'Неоновые сферы',
      sub: 'Глубокий кибер-индиго и светящиеся сферы',
      cost: 2,
      swatch: ['#00f5d4', '#22d3ee', '#6d5bff'],
    },
    {
      id: 'crystal',
      name: 'Драгоценные кристаллы',
      sub: 'Королевский пурпур, золото и гранёные самоцветы',
      cost: 3,
      swatch: ['#be123c', '#a855f7', '#fbbf24'],
    },
  ];

  const DAILY_REWARDS = [
    { day: 1, shake: 1, clean: 0, icon: 'shake', text: '+1 бустер «Встряхнуть»' },
    { day: 2, shake: 0, clean: 1, icon: 'clean', text: '+1 бустер «Убрать мелкие»' },
    { day: 3, shake: 2, clean: 0, icon: 'shake', text: '+2 бустера «Встряхнуть»' },
    { day: 4, shake: 0, clean: 2, icon: 'clean', text: '+2 бустера «Убрать мелкие»' },
    { day: 5, shake: 1, clean: 1, icon: 'both', text: '+1 бустер каждого вида' },
    { day: 6, shake: 3, clean: 0, icon: 'shake', text: '+3 бустера «Встряхнуть»' },
    { day: 7, shake: 2, clean: 2, vipHours: 12, super: true, icon: 'crown', text: 'VIP на 12 часов + по 2 бустера' },
  ];

  const ICON_SHAKE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3"/><path d="M4.5 9.5c1.2 1 1.2 3 0 4M19.5 9.5c-1.2 1-1.2 3 0 4"/></svg>';
  const ICON_CLEAN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M11 4l1.6 4.4L17 10l-4.4 1.6L11 16l-1.6-4.4L5 10l4.4-1.6L11 4z"/><path d="M18 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/></svg>';
  const ICON_CROWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8l4 3 4-6 4 6 4-3-2 10H6L4 8z"/><path d="M6 18h12"/></svg>';

  function rgbaOf(hex, alpha) {
    const h = String(hex || '').replace('#', '');
    if (h.length !== 6) return 'rgba(255,255,255,' + alpha + ')';
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  const THEME_PALETTES = {
    cosmos: {
      jarTop: 'rgba(8,12,24,0.58)',
      jarMid: 'rgba(8,12,24,0.68)',
      jarBottom: 'rgba(6,9,18,0.80)',
      jarTopGlow: 'rgba(90,120,255,0.16)',
      jarLeftGlow: 'rgba(80,220,255,0.09)',
    },
    neon: {
      jarTop: 'rgba(14,6,30,0.58)',
      jarMid: 'rgba(14,6,30,0.70)',
      jarBottom: 'rgba(7,3,16,0.82)',
      jarTopGlow: 'rgba(0,245,212,0.14)',
      jarLeftGlow: 'rgba(192,132,252,0.12)',
    },
    crystal: {
      jarTop: 'rgba(18,7,26,0.60)',
      jarMid: 'rgba(18,7,26,0.74)',
      jarBottom: 'rgba(9,3,14,0.86)',
      jarTopGlow: 'rgba(251,191,36,0.14)',
      jarLeftGlow: 'rgba(245,158,11,0.10)',
    },
  };

  const THEME_WALLPAPERS = {
    cosmos: 'assets/bg_cosmos.jpg?v=20',
    neon: 'assets/bg_neon.jpg?v=20',
    crystal: 'assets/bg_crystals.jpg?v=20',
  };
  const wallpaperCache = {};

  function preloadWallpaper(id) {
    const key = THEME_WALLPAPERS[id] ? id : 'cosmos';
    if (wallpaperCache[key]) return wallpaperCache[key];
    const img = new Image();
    img.decoding = 'async';
    img.src = THEME_WALLPAPERS[key];
    wallpaperCache[key] = img;
    return img;
  }

  function themeId() {
    return S.theme === 'neon' || S.theme === 'crystal' ? S.theme : 'cosmos';
  }

  function themePalette() {
    return THEME_PALETTES[themeId()] || THEME_PALETTES.cosmos;
  }

  function themeById(id) {
    for (let i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return THEMES[i];
    }
    return THEMES[0];
  }

  const NEON_SKINS = [
    { base: '#00f5d4', hot: '#dcfffb', deep: '#022b30', arcs: 1, orbit: 0.4 },
    { base: '#3b82f6', hot: '#e3efff', deep: '#06152f', arcs: 2, orbit: 0.52 },
    { base: '#22c55e', hot: '#e4ffe9', deep: '#04240f', arcs: 3, orbit: 0.66 },
    { base: '#eab308', hot: '#fff8d6', deep: '#2a1c02', arcs: 1, orbit: 0.34 },
    { base: '#f97316', hot: '#ffeddc', deep: '#2a0d02', arcs: 2, orbit: 0.46 },
    { base: '#ec4899', hot: '#ffe4f4', deep: '#2a0420', arcs: 3, orbit: 0.6 },
    { base: '#a855f7', hot: '#f4e6ff', deep: '#170433', arcs: 1, orbit: 0.48 },
    { base: '#06b6d4', hot: '#dcfbff', deep: '#02222b', arcs: 2, orbit: 0.68 },
    { base: '#fbbf24', hot: '#fff6d5', deep: '#2b1a02', arcs: 3, orbit: 0.42 },
    { base: '#c084fc', hot: '#ffffff', deep: '#0b0216', arcs: 4, orbit: 0.76 },
  ];

  function paintNeon(c, r, cfg, level) {
    const sk = NEON_SKINS[clamp(level || 1, 1, 10) - 1] || NEON_SKINS[0];
    const base = sk.base;
    const hot = sk.hot;
    const deep = sk.deep;
    const li = level || 1;

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();

    const shell = c.createRadialGradient(-r * 0.36, -r * 0.4, r * 0.04, 0, 0, r * 1.1);
    shell.addColorStop(0, rgbaOf(hot, 0.3));
    shell.addColorStop(0.38, rgbaOf(base, 0.92));
    shell.addColorStop(0.74, rgbaOf(base, 0.3));
    shell.addColorStop(1, rgbaOf(deep, 1));
    c.fillStyle = shell;
    c.fillRect(-r, -r, r * 2, r * 2);

    const dark = c.createRadialGradient(0, 0, 0, 0, 0, r * 0.64);
    dark.addColorStop(0, 'rgba(3,4,14,0.98)');
    dark.addColorStop(0.66, 'rgba(3,4,14,0.84)');
    dark.addColorStop(1, 'rgba(3,4,14,0)');
    c.fillStyle = dark;
    c.beginPath();
    c.arc(0, 0, r * 0.64, 0, TAU);
    c.fill();

    c.lineWidth = Math.max(0.6, r * 0.022);
    c.strokeStyle = rgbaOf(base, 0.45);
    for (let i = 0; i < sk.arcs + 1; i++) {
      const rad = r * (0.5 + ((i + 1) / (sk.arcs + 2)) * 0.38);
      c.beginPath();
      c.ellipse(0, 0, rad, rad * (0.5 + i * 0.11), li * 0.22 + i * 0.9, 0, TAU);
      c.stroke();
    }

    c.strokeStyle = rgbaOf(hot, 0.8);
    c.lineWidth = Math.max(1, r * 0.018);
    for (let i = 0; i < sk.arcs; i++) {
      const a0 = li * 0.7 + i * (TAU / (sk.arcs + 1));
      const a1 = a0 + Math.PI * (0.4 + (li % 3) * 0.14);
      c.beginPath();
      c.arc(0, 0, r * (0.72 + i * 0.05), a0, a1);
      c.stroke();
    }

    c.strokeStyle = rgbaOf(base, 0.95);
    c.lineWidth = Math.max(1.4, r * 0.055);
    c.beginPath();
    c.arc(0, 0, r * 0.965, 0, TAU);
    c.stroke();

    c.strokeStyle = rgbaOf(hot, 0.55);
    c.lineWidth = Math.max(0.7, r * 0.02);
    c.beginPath();
    c.arc(0, 0, r * 0.885, 0, TAU);
    c.stroke();

    c.fillStyle = rgbaOf(hot, 0.92);
    c.beginPath();
    c.arc(0, 0, r * 0.085, 0, TAU);
    c.fill();

    c.restore();

    c.strokeStyle = rgbaOf(base, 0.32);
    c.lineWidth = Math.max(1, r * 0.028);
    c.beginPath();
    c.arc(0, 0, r * 1.02, 0, TAU);
    c.stroke();

    gloss(c, r, 0.16);
  }

  const CRYSTAL_SKINS = [
    { light: '#fffdf7', mid: '#e9e5f3', deep: '#a8a2c0', edge: '#7d7699', facets: 5, table: 0.5 },
    { light: '#dcfcff', mid: '#4fd8e6', deep: '#0b5266', edge: '#0e7490', facets: 6, table: 0.46 },
    { light: '#d9ffe9', mid: '#16c784', deep: '#04432f', edge: '#047857', facets: 7, table: 0.48 },
    { light: '#fff4c9', mid: '#f5a524', deep: '#6b2e05', edge: '#92400e', facets: 8, table: 0.44 },
    { light: '#ffe3ea', mid: '#e11d48', deep: '#450318', edge: '#881337', facets: 9, table: 0.52 },
    { light: '#f4e9ff', mid: '#8b5cf6', deep: '#2b0a5c', edge: '#5b21b6', facets: 10, table: 0.46 },
    { light: '#dbeafe', mid: '#2563eb', deep: '#081345', edge: '#1e3a8a', facets: 11, table: 0.5 },
    { light: '#fff2f8', mid: '#f472b6', deep: '#5b0f36', edge: '#9d174d', facets: 12, table: 0.42 },
    { light: '#fffbe8', mid: '#fbbf24', deep: '#5c3407', edge: '#b45309', facets: 7, table: 0.54 },
    { light: '#f2f4ff', mid: '#2a3142', deep: '#04060c', edge: '#fbbf24', facets: 9, table: 0.4, crown: true },
  ];

  function paintCrystal(c, r, cfg, level) {
    const li = clamp(level || 1, 1, 10);
    const sk = CRYSTAL_SKINS[li - 1] || CRYSTAL_SKINS[0];
    const light = sk.light;
    const mid = sk.mid;
    const deep = sk.deep;
    const sides = sk.facets;
    const seed = (li * 0.61) % TAU;
    const tabR = r * sk.table;
    const tabShift = -r * 0.06;

    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();

    const body = c.createRadialGradient(-r * 0.44, -r * 0.5, r * 0.05, 0, 0, r * 1.12);
    body.addColorStop(0, rgbaOf(light, 0.99));
    body.addColorStop(0.34, rgbaOf(mid, 0.98));
    body.addColorStop(0.68, rgbaOf(deep, 1));
    body.addColorStop(1, 'rgba(4,2,8,1)');
    c.fillStyle = body;
    c.fillRect(-r, -r, r * 2, r * 2);

    const outer = [];
    const table = [];
    for (let i = 0; i < sides; i++) {
      const a = seed + (i / sides) * TAU;
      outer.push([Math.cos(a) * r * 1.04, Math.sin(a) * r * 1.04]);
      const ta = seed + (i / sides) * TAU + Math.PI / sides;
      table.push([Math.cos(ta) * tabR, Math.sin(ta) * tabR + tabShift]);
    }

    for (let i = 0; i < sides; i++) {
      const o1 = outer[i];
      const o2 = outer[(i + 1) % sides];
      const t1 = table[i];
      const t2 = table[(i + 1) % sides];
      const bright = (i + li) % 2 === 0;

      c.beginPath();
      c.moveTo(o1[0], o1[1]);
      c.lineTo(o2[0], o2[1]);
      c.lineTo(t1[0], t1[1]);
      c.closePath();
      c.fillStyle = bright ? rgbaOf(light, 0.4) : rgbaOf(deep, 0.62);
      c.fill();
      c.strokeStyle = bright ? rgbaOf(light, 0.6) : 'rgba(0,0,0,0.35)';
      c.lineWidth = Math.max(0.5, r * 0.018);
      c.stroke();

      c.beginPath();
      c.moveTo(o2[0], o2[1]);
      c.lineTo(t2[0], t2[1]);
      c.lineTo(t1[0], t1[1]);
      c.closePath();
      c.fillStyle = bright ? rgbaOf(mid, 0.36) : rgbaOf(deep, 0.42);
      c.fill();
      c.strokeStyle = rgbaOf(light, 0.3);
      c.lineWidth = Math.max(0.45, r * 0.014);
      c.stroke();
    }

    c.beginPath();
    c.moveTo(table[0][0], table[0][1]);
    for (let i = 1; i < sides; i++) c.lineTo(table[i][0], table[i][1]);
    c.closePath();
    const tabGrad = c.createLinearGradient(-tabR, -tabR + tabShift, tabR, tabR + tabShift);
    tabGrad.addColorStop(0, rgbaOf(light, 1));
    tabGrad.addColorStop(0.45, rgbaOf(mid, 0.94));
    tabGrad.addColorStop(1, rgbaOf(deep, 0.98));
    c.fillStyle = tabGrad;
    c.fill();
    c.strokeStyle = rgbaOf(light, 0.7);
    c.lineWidth = Math.max(0.6, r * 0.02);
    c.stroke();

    for (let i = 0; i < sides; i++) {
      const p = table[i];
      const q = table[(i + 1) % sides];
      c.beginPath();
      c.moveTo(p[0] * 0.24, p[1] * 0.24 + tabShift * 0.7);
      c.lineTo(q[0], q[1]);
      c.lineTo(p[0], p[1]);
      c.closePath();
      c.fillStyle = i % 2 ? rgbaOf(light, 0.16) : rgbaOf(deep, 0.2);
      c.fill();
    }

    c.strokeStyle = rgbaOf(light, 0.85);
    c.lineWidth = Math.max(0.7, r * 0.028);
    const f1 = 0.34 + (li % 4) * 0.08;
    c.beginPath();
    c.moveTo(outer[sides - 1][0] * 0.96, outer[sides - 1][1] * 0.96);
    c.lineTo(-r * f1, -r * (0.55 + (li % 3) * 0.05));
    c.lineTo(table[Math.floor(sides / 2)][0], table[Math.floor(sides / 2)][1]);
    c.stroke();

    c.fillStyle = rgbaOf(light, 0.85);
    c.beginPath();
    c.moveTo(-r * 0.42, -r * 0.62);
    c.lineTo(-r * 0.3, -r * 0.4);
    c.lineTo(-r * 0.44, -r * 0.34);
    c.lineTo(-r * 0.56, -r * 0.44);
    c.closePath();
    c.fill();

    if (sk.crown) {
      c.fillStyle = '#fbbf24';
      c.strokeStyle = 'rgba(255,247,214,0.9)';
      c.lineWidth = Math.max(0.6, r * 0.02);
      c.beginPath();
      c.moveTo(-r * 0.5, -r * 0.5);
      c.lineTo(-r * 0.34, -r * 0.76);
      c.lineTo(-r * 0.16, -r * 0.56);
      c.lineTo(0, -r * 0.84);
      c.lineTo(r * 0.18, -r * 0.56);
      c.lineTo(r * 0.36, -r * 0.76);
      c.lineTo(r * 0.5, -r * 0.5);
      c.closePath();
      c.fill();
      c.stroke();
    }

    c.restore();

    const rimGrad = c.createLinearGradient(-r, -r, r, r);
    rimGrad.addColorStop(0, '#fff6cf');
    rimGrad.addColorStop(0.34, '#fbbf24');
    rimGrad.addColorStop(0.68, '#d97706');
    rimGrad.addColorStop(1, '#fde68a');
    c.strokeStyle = rimGrad;
    c.lineWidth = Math.max(1.4, r * 0.075);
    c.beginPath();
    c.arc(0, 0, r * 0.958, 0, TAU);
    c.stroke();

    c.strokeStyle = 'rgba(255,250,232,0.55)';
    c.lineWidth = Math.max(0.5, r * 0.022);
    c.beginPath();
    c.arc(0, 0, r * 0.9, 0, TAU);
    c.stroke();

    gloss(c, r, 0.22);
  }

  function themeAdsCount(id) {
    return S.themeAds[id] || 0;
  }

  function themeUnlocked(id) {
    const def = themeById(id);
    if (!def.cost) return true;
    if (isVip()) return true;
    return themeAdsCount(def.id) >= def.cost;
  }

  function saveThemeState() {
    localSet(THEME_KEY, S.theme);
    localSet(THEME_ADS_KEY, JSON.stringify({ neon: themeAdsCount('neon'), crystal: themeAdsCount('crystal') }));
  }

  function loadThemeState() {
    let id = 'cosmos';
    try {
      id = localStorage.getItem(THEME_KEY) || 'cosmos';
    } catch (err) {
      id = 'cosmos';
    }
    S.theme = themeById(id).id;
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(THEME_ADS_KEY) || 'null');
    } catch (err) {
      saved = null;
    }
    if (saved && typeof saved === 'object') {
      S.themeAds.neon = clamp(parseInt(saved.neon, 10) || 0, 0, 99);
      S.themeAds.crystal = clamp(parseInt(saved.crystal, 10) || 0, 0, 99);
    }
    if (!themeUnlocked(S.theme)) S.theme = 'cosmos';
  }

  function applyTheme(id, silent) {
    const def = themeById(id);
    S.theme = def.id;
    saveThemeState();
    preloadWallpaper(def.id);
    document.body.setAttribute('data-theme', def.id === 'crystal' ? 'crystals' : def.id);
    const metaColor = document.querySelector('meta[name="theme-color"]');
    if (metaColor) {
      metaColor.setAttribute('content',
        def.id === 'neon' ? '#090418' : def.id === 'crystal' ? '#120618' : '#070b14');
    }
    for (const key in planetSpriteCache) delete planetSpriteCache[key];
    warmPlanetSprites();
    buildStars();
    buildJar();
    buildEvo();
    updatePreview();
    renderThemeList();
    if (!loopRunning) render(performance.now());
    if (!silent) showToast('Тема выбрана');
  }

  function openThemes() {
    if (adShowing > 0) return;
    Sound.unlock();
    Sound.ui();
    haptic('light');
    renderThemeList();
    openSheet(themesOverlay);
  }

  function closeThemes() {
    closeSheet(themesOverlay);
    renderThemeList();
  }

  function onThemeAction(id) {
    const def = themeById(id);
    if (S.theme === def.id) return;
    if (themeUnlocked(def.id)) {
      Sound.ui();
      applyTheme(def.id);
      return;
    }
    if (adShowing > 0) return;
    showRewardedAd(function () {
      if (themeUnlocked(def.id)) {
        applyTheme(def.id);
        return;
      }
      S.themeAds[def.id] = clamp(themeAdsCount(def.id) + 1, 0, def.cost);
      saveThemeState();
      if (themeUnlocked(def.id)) {
        applyTheme(def.id);
      } else {
        renderThemeList();
        showToast('Просмотр ' + S.themeAds[def.id] + '/' + def.cost);
      }
    });
  }

  function renderThemeList() {
    if (!themeListEl) return;
    themeListEl.innerHTML = '';
    for (let i = 0; i < THEMES.length; i++) {
      const def = THEMES[i];
      const active = S.theme === def.id;
      const unlocked = themeUnlocked(def.id);

      const card = document.createElement('div');
      card.className = 'theme-card' + (active ? ' is-active' : '');

      const preview = document.createElement('div');
      preview.className = 'theme-preview theme-preview-' + def.id;
      for (let k = 0; k < def.swatch.length; k++) {
        const dot = document.createElement('span');
        dot.className = 'theme-dot';
        const size = 32 - k * 7;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.background = def.swatch[k];
        preview.appendChild(dot);
      }
      card.appendChild(preview);

      const meta = document.createElement('div');
      meta.className = 'theme-meta';
      const nm = document.createElement('span');
      nm.className = 'theme-name';
      nm.textContent = def.name;
      const sub = document.createElement('span');
      sub.className = 'theme-sub';
      sub.textContent = def.sub;
      meta.appendChild(nm);
      meta.appendChild(sub);
      card.appendChild(meta);

      const act = document.createElement('button');
      act.type = 'button';
      act.className = 'theme-action';
      act.setAttribute('data-theme-action', def.id);
      if (active) {
        act.textContent = 'Активна';
        act.disabled = true;
        act.classList.add('done');
      } else if (unlocked) {
        act.textContent = 'Выбрать';
      } else {
        act.textContent = 'Открыть за рекламу (' + themeAdsCount(def.id) + '/' + def.cost + ')';
      }
      card.appendChild(act);
      themeListEl.appendChild(card);
    }
  }

  /* ------------------------------------------------------------
   Daily rewards calendar (7 days) — v1.3.0
   ------------------------------------------------------------ */
  function dayKey(offset) {
    const d = new Date();
    if (offset) d.setDate(d.getDate() + offset);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function saveDaily7() {
    localSet(DAILY7_KEY, JSON.stringify({ streak: S.daily7.streak, last: S.daily7.last }));
  }

  function loadDaily7() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(DAILY7_KEY) || 'null');
    } catch (err) {
      saved = null;
    }
    if (saved && typeof saved === 'object') {
      S.daily7.streak = clamp(parseInt(saved.streak, 10) || 0, 0, DAILY_REWARDS.length - 1);
      S.daily7.last = typeof saved.last === 'string' ? saved.last : '';
    }
    const today = dayKey(0);
    if (!S.daily7.last || (S.daily7.last !== today && S.daily7.last !== dayKey(-1))) {
      S.daily7.streak = 0;
    }
    saveDaily7();
  }

  function dailyClaimedToday() {
    return S.daily7.last === dayKey(0);
  }

  function currentDailyReward() {
    return DAILY_REWARDS[clamp(S.daily7.streak, 0, DAILY_REWARDS.length - 1)];
  }

  function dailyLangEn() {
    return !!(window.I18N && I18N.lang === 'en');
  }

  function dailyText(ru, en) {
    return dailyLangEn() ? en : ru;
  }

  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.6l4.3 4.3L19 6.5"/></svg>';
  const ICON_GIFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11h16v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5V11z"/><path d="M3 7.5h18V11H3z"/><path d="M12 7.5V21"/><path d="M12 7.5c-1.2-2.6-3-3.6-4.2-2.7-1 .8-.2 2.2 1.2 2.6.9.3 3 .1 3 .1z"/><path d="M12 7.5c1.2-2.6 3-3.6 4.2-2.7 1 .8.2 2.2-1.2 2.6-.9.3-3 .1-3 .1z"/></svg>';

  function updateEvoTitle() {
    if (!evoTitleEl) return;
    evoTitleEl.textContent = dailyText('Эволюция планет', 'Planet evolution');
  }

  function updateDailyBadge() {
    const claimed = dailyClaimedToday();
    const en = dailyLangEn();
    const days = clamp(S.daily7.streak, 0, DAILY_REWARDS.length);
    if (dailyBtn) dailyBtn.classList.toggle('has-reward', !claimed);
    if (dailyStreakEl) {
      dailyStreakEl.textContent = en ? 'Streak: ' + days + ' d.' : 'Серия: ' + days + ' дн.';
    }
    if (dailyTitleEl) {
      dailyTitleEl.textContent = dailyText('Праздничный календарь', 'Festive Calendar');
    }
    if (dailySubEl) {
      dailySubEl.textContent = dailyText(
        'Забирай подарок каждый день — на 7-й день ждёт супер-приз',
        'Claim a gift every day — the grand prize awaits on day 7'
      );
    }
    if (dailyClaimBtn) {
      dailyClaimBtn.disabled = claimed;
      dailyClaimBtn.hidden = claimed;
      dailyClaimBtn.innerHTML = ICON_GIFT + '<span>' + dailyText('Забрать награду', 'Claim Reward') + '</span>';
    }
    if (dailyAdBtn) {
      dailyAdBtn.disabled = claimed;
      dailyAdBtn.hidden = claimed;
    }
    if (dailyTomorrowEl) {
      dailyTomorrowEl.hidden = !claimed;
      dailyTomorrowEl.textContent = dailyText(
        'Приходите завтра за новым подарком',
        'Come back tomorrow for a new gift'
      );
    }
  }

  function dailyIconMarkup(kind) {
    if (kind === 'clean') return ICON_CLEAN;
    if (kind === 'crown') return ICON_CROWN;
    if (kind === 'both') return ICON_SHAKE + ICON_CLEAN;
    if (kind === 'gift') return ICON_GIFT;
    return ICON_SHAKE;
  }

  function renderDailyGrid() {
    if (!dailyGridEl) return;
    const claimed = dailyClaimedToday();
    const next = clamp(S.daily7.streak, 0, DAILY_REWARDS.length - 1);
    const claimedIdx = claimed ? (next + DAILY_REWARDS.length - 1) % DAILY_REWARDS.length : -1;
    dailyGridEl.innerHTML = '';
    for (let i = 0; i < DAILY_REWARDS.length; i++) {
      const rew = DAILY_REWARDS[i];
      const isToday = i === next && !claimed;
      const isClaimed = i === claimedIdx;

      const cell = document.createElement('div');
      cell.className = 'daily-cell' + (rew.super ? ' super' : '');
      if (isClaimed) cell.classList.add('is-claimed');
      else if (isToday) cell.classList.add('is-today');
      else if (i < next) cell.classList.add('is-done');

      if (isClaimed) {
        const chk = document.createElement('span');
        chk.className = 'daily-check';
        chk.innerHTML = ICON_CHECK;
        cell.appendChild(chk);
      }

      if (isToday) {
        const badge = document.createElement('span');
        badge.className = 'daily-today-badge';
        badge.textContent = dailyText('СЕГОДНЯ', 'TODAY');
        cell.appendChild(badge);
      }

      const day = document.createElement('span');
      day.className = 'daily-day';
      day.textContent = dailyText('День ' + rew.day, 'Day ' + rew.day);
      cell.appendChild(day);

      const iconWrap = document.createElement('span');
      iconWrap.className = 'daily-icon';
      iconWrap.innerHTML = dailyIconMarkup(rew.icon);
      cell.appendChild(iconWrap);

      const txt = document.createElement('span');
      txt.className = 'daily-text';
      txt.textContent = window.I18N ? I18N.t(rew.text) : rew.text;
      cell.appendChild(txt);

      if (rew.super) {
        const badge = document.createElement('span');
        badge.className = 'daily-super-badge';
        badge.textContent = dailyText('СУПЕР-ПРИЗ', 'SUPER PRIZE');
        cell.appendChild(badge);
      }

      if (isClaimed && !rew.super) {
        const state = document.createElement('span');
        state.className = 'daily-state';
        state.textContent = dailyText('Получено', 'Claimed');
        cell.appendChild(state);
      }

      dailyGridEl.appendChild(cell);
    }
  }

  function grantDailyReward(mult) {
    const rew = currentDailyReward();
    const k = mult === 2 ? 2 : 1;
    S.charges.shake = Math.min(99, S.charges.shake + (rew.shake || 0) * k);
    S.charges.clean = Math.min(99, S.charges.clean + (rew.clean || 0) * k);
    saveCharges();
    if (rew.vipHours) {
      const hours = rew.vipHours * k;
      S.vipUntil = Math.max(Date.now(), S.vipUntil || 0) + hours * 3600000;
      saveValue(VIP_KEY, S.vipUntil);
      updateVipUI();
    }
    S.daily7.last = dayKey(0);
    S.daily7.streak = rew.day >= DAILY_REWARDS.length ? 0 : rew.day;
    saveDaily7();
    updateBonusUI();
    updateCharges();
    updateDailyBadge();
    renderDailyGrid();
    Sound.clean();
    if (mult === 2) showToast('Награда удвоена!');
    else showToast('Награда получена!');
  }

  function claimDaily(doubled) {
    Sound.unlock();
    if (dailyClaimedToday()) {
      showToast('Сегодня уже получено');
      return;
    }
    if (!doubled) {
      Sound.ui();
      grantDailyReward(1);
      return;
    }
    if (adShowing > 0) return;
    showRewardedAd(function () {
      if (dailyClaimedToday()) return;
      grantDailyReward(2);
    });
  }

  function openDaily() {
    if (adShowing > 0) return;
    Sound.unlock();
    Sound.ui();
    haptic('light');
    renderDailyGrid();
    updateDailyBadge();
    openSheet(dailyOverlay);
  }

  function closeDaily() {
    closeSheet(dailyOverlay);
  }

  /* ------------------------------------------------------------
   Modal sheets
   ------------------------------------------------------------ */
  let sheetReturnMode = null;

  function sheetIsOpen(el) {
    return !!(el && el.classList.contains('open'));
  }

  function anySheetOpen() {
    if (adShowing > 0) return true;
    return sheetIsOpen(themesOverlay) ||
      sheetIsOpen(dailyOverlay) ||
      sheetIsOpen(settingsOverlay) ||
      sheetIsOpen(leaderboardOverlay) ||
      (vipScreen && vipScreen.classList.contains('show')) ||
      (pauseScreen && pauseScreen.classList.contains('show')) ||
      (overScreen && overScreen.classList.contains('show'));
  }

  function openSheet(el) {
    if (!el) return;
    if (sheetReturnMode === null) {
      sheetReturnMode = S.mode === 'playing' ? 'playing' : (S.mode === 'paused' ? 'paused' : 'menu');
    }
    if (S.mode === 'playing') {
      S.mode = 'paused';
      pointerActive = false;
      syncControls();
      syncMusic();
    }
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    syncLoop();
  }

  function closeSheet(el) {
    if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    const back = sheetReturnMode;
    sheetReturnMode = null;
    if (back === 'playing' && S.mode === 'paused') {
      S.mode = 'playing';
      syncControls();
      syncMusic();
    }
    syncLoop();
  }

  /* ------------------------------------------------------------
 Layout & background layers
 ------------------------------------------------------------ */
  let desktopLayout = null;
  const originPositions = new Map();

  function snapshotOrigin(node) {
    if (!node || originPositions.has(node)) return;
    originPositions.set(node, { parent: node.parentNode, next: node.nextSibling });
  }

  function restoreNode(node) {
    const o = originPositions.get(node);
    if (!o || !o.parent) return;
    const next = o.next && o.next.parentNode === o.parent ? o.next : null;
    o.parent.insertBefore(node, next);
  }

  function applyResponsiveLayout(desktop) {
    snapshotOrigin(evoRowEl);
    snapshotOrigin(controlGridEl);
    if (desktop === desktopLayout) return;
    desktopLayout = desktop;
    restoreNode(evoRowEl);
    restoreNode(controlGridEl);
    railLeft.setAttribute('aria-hidden', 'true');
    railRight.setAttribute('aria-hidden', 'true');
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function fullscreenSupported() {
    const el = document.documentElement;
    return !!(el.requestFullscreen || el.webkitRequestFullscreen);
  }

  function syncFullscreenBtn() {
    if (!fullscreenBtn) return;
    fullscreenBtn.classList.toggle('is-fs', !!fullscreenElement());
    fullscreenBtn.setAttribute('aria-label', fullscreenElement() ? 'Выйти из полноэкранного режима' : 'На весь экран');
  }

  function toggleFullscreen() {
    if (!fullscreenSupported()) return;
    try {
      if (fullscreenElement()) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        const res = exit.call(document);
        if (res && res.catch) res.catch(function () {});
      } else {
        const el = document.documentElement;
        const request = el.requestFullscreen || el.webkitRequestFullscreen;
        const res = request.call(el);
        if (res && res.catch) res.catch(function () {});
      }
    } catch (err) {}
  }

  function scheduleResize() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(function () {
      resizeQueued = false;
      resize();
    });
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 769 ? 1.5 : 2);
    const uiDpr = dpr;
    const desktop = window.innerWidth >= 769;
    const spriteChanged = setSpriteScale(Math.max(2, uiDpr));

    applyResponsiveLayout(desktop);

    if (w === view.w && h === view.h && dpr === view.dpr && uiDpr === view.uiDpr) {
      if (spriteChanged) {
        buildEvo();
        updatePreview();
      }
      return;
    }

    const uiChanged = uiDpr !== view.uiDpr;
    view.w = w;
    view.h = h;
    view.dpr = dpr;
    view.uiDpr = uiDpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';

    const mobile = window.innerWidth < 769;
    const padSide = desktop ? 16 : 12;
    const stageMaxW = desktop ? 520 : 820 - padSide * 2;
    const availW = Math.max(80, Math.min(w - padSide * 2, stageMaxW));
    WORLD_W = desktop ? 520 : 400;
    const spawnLevels = 3;
    let maxSpawnRadius = 0;
    for (let i = 0; i < spawnLevels; i++) {
      maxSpawnRadius = Math.max(maxSpawnRadius, LEVELS[i].radius);
    }
    const spawnPadPx = 4;
    const jarDropFactor = 0.55;
    const bottomGapPx = 8;
    const minWorldH = mobile ? 320 : 380;
    const widthScale = availW / WORLD_W;
    let scale = widthScale;
    let jarTopWorld = maxSpawnRadius * (1 + jarDropFactor) + spawnPadPx / scale;
    if ((h - bottomGapPx) / scale - jarTopWorld < minWorldH) {
      const fit = (h - bottomGapPx) / (minWorldH + jarTopWorld);
      if (fit > 0 && fit < scale) scale = fit;
    }
    jarTopWorld = maxSpawnRadius * (1 + jarDropFactor) + spawnPadPx / scale;
    if ((h - bottomGapPx) / scale - jarTopWorld < minWorldH) {
      const fit = (h - bottomGapPx) / (minWorldH + jarTopWorld);
      if (fit > 0 && fit < scale) scale = fit;
      jarTopWorld = maxSpawnRadius * (1 + jarDropFactor) + spawnPadPx / scale;
    }
    SPAWN_Y = -maxSpawnRadius * jarDropFactor;
    HOLD_Y = SPAWN_Y;
    WORLD_H = Math.max(minWorldH, Math.round((h - bottomGapPx) / scale) - jarTopWorld);
    view.scale = scale;
    DANGER_Y = (mobile ? 42 : 76) / scale;
    view.jarW = WORLD_W * scale;
    view.jarH = WORLD_H * scale;
    view.jarLeft = Math.round((w - view.jarW) / 2);
    view.jarTop = Math.round(jarTopWorld * scale) + 5;
    view.aimZone = view.jarTop;

    buildStars();
    buildJar();
    buildGradients();
    syncWalls();
    if (spriteChanged || uiChanged) {
      buildEvo();
      updatePreview();
    }
    clampAim();
    if (!loopRunning) render(performance.now());
  }

  function buildStars() {
    if (view.w < 2 || view.h < 2) return;
    const w = view.w;
    const h = view.h;
    const dpr = view.dpr;
    const cv = makeBufferCanvas(w * dpr, h * dpr);
    const c = cv.getContext('2d');
    if (!c) return;
    c.scale(dpr, dpr);

    const skin = themeId();
    const nebulaColors = skin === 'neon'
      ? ['0,245,212', '0,150,255', '90,80,255', '0,200,230']
      : skin === 'crystal'
        ? ['16,185,129', '139,92,246', '52,211,153', '245,208,120']
        : ['130,90,255', '0,180,255', '255,90,170', '90,120,255'];
    for (let i = 0; i < 4; i++) {
      const x = rand(0, w);
      const y = rand(0, h);
      const rad = rand(Math.max(80, w * 0.25), Math.max(160, w * 0.7));
      const col = pick(nebulaColors);
      const g = c.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, 'rgba(' + col + ',0.055)');
      g.addColorStop(1, 'rgba(' + col + ',0)');
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    }

    for (let i = 0; i < 110; i++) {
      const x = rand(0, w);
      const y = rand(0, h);
      const big = Math.random() > 0.9;
      const r = big ? rand(1.2, 2.1) : rand(0.4, 1.15);
      const a = rand(0.2, 0.9);
      c.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
      c.beginPath();
      c.arc(x, y, r, 0, TAU);
      c.fill();
      if (big) {
        c.fillStyle = 'rgba(190,225,255,' + (a * 0.22).toFixed(3) + ')';
        c.beginPath();
        c.arc(x, y, r * 3.2, 0, TAU);
        c.fill();
      }
    }

    starCanvas = cv;
    twinkles = [];
    for (let i = 0; i < 18; i++) {
      twinkles.push({
        x: rand(0, w),
        y: rand(0, h * 0.9),
        r: rand(0.6, 1.5),
        p: rand(0, TAU),
        s: rand(0.6, 1.9),
      });
    }
  }

  function buildJar() {
    if (view.w < 2 || view.h < 2) return;
    const w = view.w;
    const h = view.h;
    const dpr = view.dpr;
    const cv = makeBufferCanvas(w * dpr, h * dpr);
    const c = cv.getContext('2d');
    if (!c) return;
    c.scale(dpr, dpr);
    c.translate(view.jarLeft, view.jarTop);
    c.scale(view.scale, view.scale);

    const skinTheme = themeId();
    const W = WORLD_W;
    const H = WORLD_H;
    const R_TOP = 0;
    const R_BOT = 18;

    jarOutline(c, W, H, R_TOP, R_BOT);
    const pal = themePalette();
    const fill = c.createLinearGradient(0, 0, 0, H);
    fill.addColorStop(0, pal.jarTop);
    fill.addColorStop(0.55, pal.jarMid);
    fill.addColorStop(1, pal.jarBottom);
    c.fillStyle = fill;
    c.fill();

    c.save();
    jarOutline(c, W, H, R_TOP, R_BOT);
    c.clip();

    const topGlow = c.createLinearGradient(0, 0, 0, H * 0.55);
    topGlow.addColorStop(0, pal.jarTopGlow);
    topGlow.addColorStop(1, 'rgba(90,120,255,0)');
    c.fillStyle = topGlow;
    c.fillRect(0, 0, W, H * 0.55);

    const leftGlow = c.createLinearGradient(0, 0, W * 0.18, 0);
    leftGlow.addColorStop(0, pal.jarLeftGlow);
    leftGlow.addColorStop(1, 'rgba(80,220,255,0)');
    c.fillStyle = leftGlow;
    c.fillRect(0, 0, W * 0.18, H);

    const bottomShade = c.createLinearGradient(0, H * 0.72, 0, H);
    bottomShade.addColorStop(0, 'rgba(0,0,0,0)');
    bottomShade.addColorStop(1, 'rgba(0,0,0,0.3)');
    c.fillStyle = bottomShade;
    c.fillRect(0, H * 0.72, W, H * 0.28);

    if (skinTheme === 'crystal') {
      const warm = c.createRadialGradient(W * 0.5, H * 0.74, 0, W * 0.5, H * 0.74, Math.max(W, H) * 0.9);
      warm.addColorStop(0, 'rgba(251,191,36,0.16)');
      warm.addColorStop(0.5, 'rgba(245,158,11,0.06)');
      warm.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = warm;
      c.fillRect(0, 0, W, H);
    }
    c.restore();

    c.save();
    c.lineCap = 'round';
    c.lineJoin = 'round';

    function jarPath() {
      jarRimPath(c, W, H, R_BOT);
    }

    const neon = c.createLinearGradient(0, H, 0, 0);
    if (skinTheme === 'neon') {
      neon.addColorStop(0, 'rgba(0,245,212,0.95)');
      neon.addColorStop(0.55, 'rgba(34,211,238,0.95)');
      neon.addColorStop(1, 'rgba(0,245,212,0.9)');
    } else if (skinTheme === 'crystal') {
      neon.addColorStop(0, 'rgba(245,158,11,0.95)');
      neon.addColorStop(0.55, 'rgba(251,191,36,1)');
      neon.addColorStop(1, 'rgba(245,158,11,0.92)');
    } else {
      neon.addColorStop(0, 'rgba(120,220,255,0.85)');
      neon.addColorStop(0.55, 'rgba(120,110,255,0.92)');
      neon.addColorStop(1, 'rgba(190,120,255,0.85)');
    }
    const tipColor = skinTheme === 'neon'
      ? '0,245,212'
      : skinTheme === 'crystal'
        ? '251,191,36'
        : '56,189,248';

    c.save();
    c.shadowColor = 'rgba(' + tipColor + ',0.5)';
    c.shadowBlur = 12;
    c.globalAlpha = 0.5;
    jarPath();
    c.strokeStyle = neon;
    c.lineWidth = 2;
    c.stroke();
    c.restore();
    c.globalAlpha = 1;
    jarPath();
    c.strokeStyle = neon;
    c.lineWidth = 2;
    c.stroke();
    c.save();
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.translate(view.jarLeft, view.jarTop);
    c.globalCompositeOperation = 'lighter';
    c.lineCap = 'round';
    const tipWalls = [0, W * view.scale];
    const tipFade = 10;
    const tipBody = 28;
    for (let i = 0; i < tipWalls.length; i++) {
      const wx = tipWalls[i];
      const beam = c.createLinearGradient(0, 0, 0, -tipFade);
      beam.addColorStop(0, 'rgba(255,255,255,0.62)');
      beam.addColorStop(0.4, 'rgba(' + tipColor + ',0.3)');
      beam.addColorStop(1, 'rgba(' + tipColor + ',0)');
      c.save();
      c.shadowColor = 'rgba(' + tipColor + ',0.95)';
      c.shadowBlur = 15;
      c.strokeStyle = beam;
      c.lineWidth = 3.2;
      c.beginPath();
      c.moveTo(wx, 0);
      c.lineTo(wx, -tipFade);
      c.stroke();
      c.restore();

      const burn = c.createLinearGradient(0, 0, 0, tipBody);
      burn.addColorStop(0, 'rgba(255,255,255,0.96)');
      burn.addColorStop(0.14, 'rgba(255,255,255,0.86)');
      burn.addColorStop(0.46, 'rgba(' + tipColor + ',0.74)');
      burn.addColorStop(1, 'rgba(' + tipColor + ',0)');
      c.save();
      c.shadowColor = 'rgba(' + tipColor + ',0.9)';
      c.shadowBlur = 13;
      c.strokeStyle = burn;
      c.lineWidth = 3.4;
      c.beginPath();
      c.moveTo(wx, 0);
      c.lineTo(wx, tipBody);
      c.stroke();
      c.restore();
    }
    c.restore();

    c.strokeStyle = 'rgba(255,255,255,0.07)';
    c.lineWidth = 1;
    c.save();
    c.translate(3, 3);
    jarOutline(c, W - 6, H - 6, R_TOP - 3, R_BOT - 3);
    c.stroke();
    c.restore();

    c.restore();

    jarCanvas = cv;
    buildJarFront();
  }

  function buildGradients() {
    if (view.w < 2 || view.h < 2) return;

    const dg = makeBufferCanvas(4, 64);
    const dc = dg.getContext('2d');
    if (dc) {
      const g = dc.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, 'rgba(255,40,80,0.16)');
      g.addColorStop(1, 'rgba(255,40,80,0)');
      dc.fillStyle = g;
      dc.fillRect(0, 0, 4, 64);
    }
    dangerCanvas = dg;

    const fs = 128;
    const fc = makeBufferCanvas(fs, fs);
    const fctx = fc.getContext('2d');
    if (fctx) {
      const g = fctx.createRadialGradient(fs / 2, fs / 2, 4, fs / 2, fs / 2, fs / 2);
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.45, 'rgba(160,205,255,0.35)');
      g.addColorStop(1, 'rgba(120,80,255,0)');
      fctx.fillStyle = g;
      fctx.fillRect(0, 0, fs, fs);
    }
    flashCanvas = fc;

    const size = 128;
    const glow = makeBufferCanvas(size, size);
    const gc = glow.getContext('2d');
    if (gc) {
      const rg = gc.createRadialGradient(size / 2, size / 2, size * 0.11, size / 2, size / 2, size / 2);
      rg.addColorStop(0, 'rgba(120,200,255,0.16)');
      rg.addColorStop(1, 'rgba(120,200,255,0)');
      gc.fillStyle = rg;
      gc.fillRect(0, 0, size, size);
    }
    aimGlowCanvas = glow;
  }

  function warmPlanetSprites() {
    for (let i = 1; i <= LEVELS.length; i++) getSprite(i);
  }

  /* ------------------------------------------------------------
 Rendering
 ------------------------------------------------------------ */
  function getShakeOffset() {
    if (shakeT <= 0 || S.mode === 'paused') return { x: 0, y: 0 };
    const k = shakeT / Math.max(0.001, shakeDur);
    const amp = shakeMag * k * k;
    return { x: rand(-amp, amp), y: rand(-amp, amp) };
  }

  function drawStars(t) {
    if (!starCanvas) return;
    ctx.drawImage(starCanvas, 0, 0, view.w, view.h);
    for (let i = 0; i < twinkles.length; i++) {
      const s = twinkles[i];
      const a = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(t * s.s * 2.2 + s.p));
      ctx.fillStyle = 'rgba(210,235,255,' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, TAU);
      ctx.fill();
    }
  }

  function drawMenuPlanets(t) {
    if (S.mode !== 'menu') return;
    for (let i = 0; i < menuItems.length; i++) {
      const m = menuItems[i];
      const x = m.xf * view.w + Math.sin(t * 0.22 + m.ph) * 9;
      const y = m.yf * view.h + Math.cos(t * 0.18 + m.ph) * 11;
      const sp = getSprite(m.level);
      const k = m.r / LEVELS[m.level - 1].radius;
      const half = sp.half * k;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(t * 0.12 + m.ph) * 0.2);
      ctx.globalAlpha = 0.55;
      ctx.drawImage(sp.canvas, -half, -half, half * 2, half * 2);
      ctx.restore();
    }
  }

  function drawBody(b, t) {
    const cfg = LEVELS[b.level - 1];
    const sp = getSprite(b.level);
    const sx = b.pop * (1 + b.squash);
    const sy = b.pop * (1 - b.squash);
    const rot = b.angle;

    ctx.save();
    ctx.translate(b.position.x, b.position.y);
    ctx.rotate(rot);
    ctx.scale(sx, sy);
    ctx.drawImage(sp.canvas, -sp.half, -sp.half, sp.half * 2, sp.half * 2);
    ctx.restore();

    ctx.save();
    ctx.translate(b.position.x, b.position.y);
    ctx.scale(sx, sy);
    drawFace(ctx, cfg.radius, cfg, b, t);
    ctx.restore();
  }

  function drawAim(t) {
    if (S.mode !== 'playing') return;

    if (S.current == null) {
      const x = clamp(S.aimX, 20, WORLD_W - 20);
      const p = clamp(1 - S.cooldown / DROP_COOLDOWN, 0, 1);
      ctx.save();
      ctx.strokeStyle = 'rgba(130,215,255,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, HOLD_Y, 13, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(150,235,255,0.9)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(x, HOLD_Y, 13, -Math.PI / 2, -Math.PI / 2 + TAU * p);
      ctx.stroke();
      ctx.restore();
      return;
    }

    const cfg = LEVELS[S.current - 1];
    const rad = cfg.radius;
    const x = clamp(S.aimX, rad + 2, WORLD_W - rad - 2);
    const bob = Math.abs(Math.sin(t * 2.4)) * 2.2;
    const y = HOLD_Y + bob;
    const scale = 0.76 + 0.24 * easeOutCubic(clamp(S.holdIn, 0, 1));

    if (aimGlowCanvas) {
      const gl = rad * 1.9;
      ctx.drawImage(aimGlowCanvas, x - gl, y - gl, gl * 2, gl * 2);
    }

    ctx.save();
    ctx.setLineDash([5, 9]);
    ctx.lineDashOffset = -t * 34;
    ctx.strokeStyle = 'rgba(130,215,255,0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + rad * scale + 4);
    ctx.lineTo(x, WORLD_H - 12);
    ctx.stroke();
    ctx.restore();

    const fake = {
      position: { x: x, y: y },
      angle: 0.08,
      pop: scale,
      squash: 0,
      level: S.current,
      blinkSeed: 1.3,
    };
    drawBody(fake, t);

    ctx.save();
    ctx.translate(x, y + rad * scale + 13);
    ctx.fillStyle = 'rgba(150,230,255,0.8)';
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawEffects(t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
      const k = 1 - ring.life / ring.max;
      const radius = lerp(ring.r0, ring.r1, easeOutCubic(k));
      const alpha = Math.max(0, ring.life / ring.max);
      ctx.strokeStyle = ring.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 3 + 4 * alpha;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, TAU);
      ctx.stroke();
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const alpha = clamp(p.life / p.max, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.star) {
        starPath(ctx, p.x, p.y, p.size * (1 + (1 - alpha) * 0.6), p.rot);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    for (let i = 0; i < popups.length; i++) {
      const p = popups[i];
      const age = 1 - p.life / p.max;
      const scale = age < 0.18 ? lerp(0.5, 1.14, age / 0.18) : lerp(1.14, 1, Math.min(1, (age - 0.18) / 0.3));
      const alpha = p.life > 0.3 ? 1 : p.life / 0.3;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '800 23px ' + FONT;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(5,7,18,0.72)';
      ctx.strokeText(p.text, 0, 0);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, 0, 0);
      if (p.sub) {
        ctx.font = '800 19px ' + FONT;
        ctx.fillStyle = '#ffe6a3';
        ctx.strokeText(p.sub, 0, 24);
        ctx.fillText(p.sub, 0, 24);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function drawDangerZone() {
    if (S.danger <= 0) return;
    if (!dangerCanvas) return;
    ctx.drawImage(dangerCanvas, 0, 0, WORLD_W, DANGER_Y);
  }

  function drawDangerUI(t) {
    const danger = S.danger > 0.06;
    ctx.save();
    ctx.setLineDash([9, 8]);
    ctx.lineDashOffset = t * 18;
    ctx.strokeStyle = danger
      ? 'rgba(255,70,100,' + (0.5 + 0.35 * Math.sin(t * 9)).toFixed(3) + ')'
      : 'rgba(255,80,110,0.34)';
    ctx.lineWidth = danger ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.moveTo(10, DANGER_Y);
    ctx.lineTo(WORLD_W - 10, DANGER_Y);
    ctx.stroke();
    ctx.restore();
  }

  function buildJarFront() {
    if (view.w < 2 || view.h < 2) return;
    const cv = makeBufferCanvas(view.w * view.dpr, view.h * view.dpr);
    const c = cv.getContext('2d');
    if (!c) return;
    c.scale(view.dpr, view.dpr);
    c.translate(view.jarLeft, view.jarTop);
    c.scale(view.scale, view.scale);

    const W = WORLD_W;
    const H = WORLD_H;
    const RB = 12;
    c.save();
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(0, H - 170);
    c.lineTo(0, H - RB);
    c.quadraticCurveTo(0, H, RB, H);
    c.lineTo(W - RB, H);
    c.quadraticCurveTo(W, H, W, H - RB);
    c.lineTo(W, H - 170);

    const skin = themeId();
    const rim = c.createLinearGradient(0, 0, W, 0);
    if (skin === 'neon') {
      rim.addColorStop(0, 'rgba(0,245,212,0.85)');
      rim.addColorStop(0.5, 'rgba(34,211,238,0.95)');
      rim.addColorStop(1, 'rgba(0,245,212,0.85)');
    } else if (skin === 'crystal') {
      rim.addColorStop(0, 'rgba(245,158,11,0.92)');
      rim.addColorStop(0.35, 'rgba(251,191,36,1)');
      rim.addColorStop(0.62, 'rgba(253,230,138,0.96)');
      rim.addColorStop(1, 'rgba(245,158,11,0.92)');
    } else {
      rim.addColorStop(0, 'rgba(120,225,255,0.7)');
      rim.addColorStop(0.5, 'rgba(165,145,255,0.85)');
      rim.addColorStop(1, 'rgba(120,225,255,0.7)');
    }
    const rimTip = skin === 'neon'
      ? '0,245,212'
      : skin === 'crystal'
        ? '251,191,36'
        : '56,189,248';
    c.save();
    c.shadowColor = 'rgba(' + rimTip + ',0.5)';
    c.shadowBlur = 12;
    c.globalAlpha = 0.5;
    c.strokeStyle = rim;
    c.lineWidth = 2;
    c.stroke();
    c.restore();
    c.strokeStyle = rim;
    c.lineWidth = 2;
    c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.16)';
    c.lineWidth = 1;
    c.stroke();
    c.restore();
    jarFrontCanvas = cv;
  }

  function drawFlash() {
    if (flashA <= 0) return;
    if (!flashCanvas) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(flashA, 0, 1);
    ctx.drawImage(flashCanvas, 0, 0, view.w, view.h);
    ctx.restore();
  }

  function drawShooting() {
    if (!shoot) return;
    const alpha = Math.min(1, shoot.life / 0.5);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(200,230,255,' + (alpha * 0.55).toFixed(3) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shoot.x, shoot.y);
    ctx.lineTo(shoot.x - shoot.vx * 0.14, shoot.y - shoot.vy * 0.14);
    ctx.stroke();
    ctx.fillStyle = 'rgba(235,250,255,' + alpha.toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(shoot.x, shoot.y, 1.7, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function render(now) {
    if (view.w < 2 || view.h < 2) return;
    const t = now / 1000;

    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    ctx.clearRect(0, 0, view.w, view.h);

    drawStars(t);
    drawMenuPlanets(t);

    const sh = getShakeOffset();
    if (jarCanvas) ctx.drawImage(jarCanvas, sh.x, sh.y, view.w, view.h);

    ctx.save();
    ctx.translate(view.jarLeft + sh.x, view.jarTop + sh.y);
    ctx.scale(view.scale, view.scale);

    drawDangerZone();
    if (S.mode === 'playing') drawAim(t);

    const list = planetBodies();
    list.sort(function (a, b) {
      return b.level - a.level;
    });
    for (let i = 0; i < list.length; i++) drawBody(list[i], t);

    drawEffects(t);
    drawDangerUI(t);
    ctx.restore();

    if (jarFrontCanvas) ctx.drawImage(jarFrontCanvas, sh.x, sh.y, view.w, view.h);
    drawFlash();
    drawShooting();
  }

  /* ------------------------------------------------------------
 Input
 ------------------------------------------------------------ */
  function aimFromClientX(clientX) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !view.scale) return;
    const worldX = (clientX - rect.left - view.jarLeft) / view.scale;
    S.aimTarget = clamp(worldX, 0, WORLD_W);
    const level = S.current;
    if (level) {
      const rad = LEVELS[level - 1].radius;
      S.aimTarget = clamp(S.aimTarget, rad + 2, WORLD_W - rad - 2);
    }
  }

  function onPointerDown(e) {
    if (S.mode !== 'playing') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    Sound.unlock();
    aimFromClientX(e.clientX);
    S.aimX = S.aimTarget;
    pointerActive = true;
    e.preventDefault();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  }

  function onPointerMove(e) {
    if (S.mode !== 'playing') return;
    if (e.pointerType === 'mouse' || pointerActive) {
      aimFromClientX(e.clientX);
    }
  }

  function onPointerUp(e) {
    if (!pointerActive) return;
    pointerActive = false;
    if (S.mode !== 'playing') return;
    aimFromClientX(e.clientX);
    S.aimX = S.aimTarget;
    dropCurrent();
    e.preventDefault();
  }

  function openSettings() {
    if (S.mode === 'playing') pauseGame();
    haptic('light');
    settingsOverlay.classList.add('open');
    syncControls();
    syncLoop();
  }

  function closeSettings() {
    settingsOverlay.classList.remove('open');
    if (S.mode === 'paused') resumeGame();
    syncLoop();
  }

  function toggleSound() {
    Sound.unlock();
    Sound.setMuted(!Sound.muted);
    writeMuted(Sound.muted);
    syncControls();
    syncMusic();
    if (!Sound.muted) Sound.ui();
  }

  function bindEvents() {
    window.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', function () {
      pointerActive = false;
    });
    canvas.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    window.addEventListener(
      'pointerdown',
      function () {
        Sound.unlock();
      },
      { passive: true },
    );

    window.addEventListener(
      'touchstart',
      function () {
        Sound.unlock();
      },
      { passive: true },
    );

    window.addEventListener(
      'click',
      function () {
        Sound.unlock();
      },
      { passive: true },
    );

    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', function () {
      if (adShowing > 0) return;
      showInterstitialAd(startGame);
    });
    restartBtn.addEventListener('click', function () {
      if (adShowing > 0) return;
      showInterstitialAd(startGame);
    });
    resumeBtn.addEventListener('click', resumeGame);
    menuBtn.addEventListener('click', function () {
      showInterstitialAd(goMenu);
    });
    settingsBtn.addEventListener('click', openSettings);
    if (settingsClose) settingsClose.addEventListener('click', closeSettings);
    if (settingsOverlay) {
      settingsOverlay.addEventListener('click', function (e) {
        if (e.target === settingsOverlay) closeSettings();
      });
    }
    if (settingsSoundBtn) settingsSoundBtn.addEventListener('click', toggleSound);
    if (settingsVibrationBtn) settingsVibrationBtn.addEventListener('click', function () {
      vibrationOn = !vibrationOn;
      try { localStorage.setItem('mergeCosmos.vibration.v1', vibrationOn ? '1' : '0'); } catch (err) {}
      haptic('medium');
      syncControls();
    });
    vipBtn.addEventListener('click', openVip);
    const inviteBtn = $('inviteFriendBtn');
    if (inviteBtn) inviteBtn.addEventListener('click', inviteFriend);
    vipCloseBtn.addEventListener('click', closeVip);
    vipBuyBtn.addEventListener('click', buyVip);
    shareBtn.addEventListener('click', shareRecord);
    if (bestStat) {
      bestStat.addEventListener('click', openLeaderboard);
      bestStat.addEventListener('keydown', function (e) {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          openLeaderboard();
        }
      });
    }
    if (leaderboardClose) leaderboardClose.addEventListener('click', closeLeaderboard);
    if (leaderboardOverlay) {
      leaderboardOverlay.addEventListener('click', function (e) {
        if (e.target === leaderboardOverlay) closeLeaderboard();
      });
    }
    if (lbShareBtn) lbShareBtn.addEventListener('click', leaderboardShare);
    adBoosterBtn.addEventListener('click', adBooster);
    secondChanceBtn.addEventListener('click', secondChance);

    if (themeBtn) themeBtn.addEventListener('click', openThemes);
    if (themesClose) themesClose.addEventListener('click', closeThemes);
    if (themesOverlay) {
      themesOverlay.addEventListener('click', function (e) {
        if (e.target === themesOverlay) closeThemes();
      });
    }
    if (themeListEl) {
      themeListEl.addEventListener('click', function (e) {
        const btn = e.target && e.target.closest ? e.target.closest('[data-theme-action]') : null;
        if (!btn) return;
        e.preventDefault();
        onThemeAction(btn.getAttribute('data-theme-action'));
      });
    }
    if (dailyBtn) dailyBtn.addEventListener('click', openDaily);
    if (dailyClose) dailyClose.addEventListener('click', closeDaily);
    if (dailyOverlay) {
      dailyOverlay.addEventListener('click', function (e) {
        if (e.target === dailyOverlay) closeDaily();
      });
    }
    if (dailyClaimBtn) {
      dailyClaimBtn.addEventListener('click', function () {
        claimDaily(false);
      });
    }
    if (dailyAdBtn) {
      dailyAdBtn.addEventListener('click', function () {
        claimDaily(true);
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        if (S.mode === 'playing') pauseGame();
        else if (S.mode === 'paused') resumeGame();
      });
    }

    shakeBtn.addEventListener('click', function () {
      requestBonus('shake');
    });
    cleanBtn.addEventListener('click', function () {
      requestBonus('clean');
    });

    window.addEventListener('keydown', function (e) {
      if (e.repeat) return;
      if (e.code === 'KeyM') {
        toggleSound();
        return;
      }
      if (e.code === 'Escape' && sheetIsOpen(themesOverlay)) {
        closeThemes();
        e.preventDefault();
        return;
      }
      if (e.code === 'Escape' && sheetIsOpen(dailyOverlay)) {
        closeDaily();
        e.preventDefault();
        return;
      }
      if (e.code === 'Escape' && sheetIsOpen(leaderboardOverlay)) {
        closeLeaderboard();
        e.preventDefault();
        return;
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (S.mode === 'playing') pauseGame();
        else if (S.mode === 'paused') resumeGame();
        e.preventDefault();
        return;
      }
      if (S.mode !== 'playing') return;
      const level = S.current;
      if (level && (e.code === 'ArrowLeft' || e.code === 'KeyA')) {
        const rad = LEVELS[level - 1].radius;
        S.aimTarget = clamp(S.aimTarget - 18, rad + 2, WORLD_W - rad - 2);
        e.preventDefault();
      } else if (level && (e.code === 'ArrowRight' || e.code === 'KeyD')) {
        const rad = LEVELS[level - 1].radius;
        S.aimTarget = clamp(S.aimTarget + 18, rad + 2, WORLD_W - rad - 2);
        e.preventDefault();
      } else if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'Enter') {
        dropCurrent();
        e.preventDefault();
      }
    });

    document.addEventListener('visibilitychange', function () {
      updateAudioSuppression();
      if (document.hidden) {
        if (S.mode === 'playing') pauseGame();
        stopLoop();
        return;
      }
      syncLoop();
    });

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(scheduleResize);
      ro.observe(stage);
    }
    window.addEventListener('resize', scheduleResize);
    window.addEventListener('orientationchange', function () {
      setTimeout(scheduleResize, 150);
    });

    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', function () {
      syncFullscreenBtn();
      setTimeout(scheduleResize, 120);
    });
    document.addEventListener('webkitfullscreenchange', function () {
      syncFullscreenBtn();
      setTimeout(scheduleResize, 120);
    });
    syncFullscreenBtn();
  }

  /* ------------------------------------------------------------
 Main loop
 ------------------------------------------------------------ */
  let rafId = 0;
  let loopRunning = false;

  function stopLoop() {
    loopRunning = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    acc = 0;
    lastFrame = 0;
  }

  function startLoop() {
    if (loopRunning || document.hidden) return;
    loopRunning = true;
    lastFrame = 0;
    rafId = requestAnimationFrame(loop);
  }

  function syncLoop() {
    if (document.hidden || anySheetOpen()) stopLoop();
    else startLoop();
  }

  function loop(now) {
    if (!loopRunning) return;
    rafId = requestAnimationFrame(loop);

    if (document.hidden || anySheetOpen()) {
      stopLoop();
      return;
    }

    if (!lastFrame) lastFrame = now;
    let frameTime = now - lastFrame;
    lastFrame = now;
    if (!Number.isFinite(frameTime) || frameTime < 0) frameTime = 0;
    frameTime = Math.min(frameTime, MAX_FRAME_MS);

    if (S.mode === 'playing') {
      acc += frameTime;
      let steps = 0;
      while (acc >= FIXED_DT && steps < MAX_STEPS_PER_FRAME) {
        Engine.update(engine, FIXED_DT);
        processMerges();
        updateGame(FIXED_DT / 1000);
        acc -= FIXED_DT;
        steps++;
      }
      if (acc > FIXED_DT) acc = 0;
      updateAim(frameTime / 1000);
    } else {
      acc = 0;
    }

    if (S.mode !== 'paused') {
      updateBodyVisuals(frameTime / 1000);
      updateEffects(frameTime / 1000);
    }

    render(now);
  }

  /* ------------------------------------------------------------
 Init
 ------------------------------------------------------------ */
  function claimTelegramRefBonus() {
    try {
      const param = (window.TGRef && TGRef.startParam()) || '';
      if (param.indexOf('ref_') !== 0) return;
      if (localStorage.getItem('tgRefClaimed') === '1') return;
      localStorage.setItem('tgRefClaimed', '1');
      S.charges.shake = Math.min(99, S.charges.shake + 1);
      S.charges.clean = Math.min(99, S.charges.clean + 1);
      saveValue(SHAKE_KEY, S.charges.shake);
      saveValue(CLEAN_KEY, S.charges.clean);
      updateBonusUI();
      showToast(window.I18N && I18N.lang === 'en'
        ? 'Friend invite bonus claimed! +1 Booster'
        : 'Бонус по приглашению друга получен! +1 Бустер');
    } catch (err) {}
  }

  function inviteFriend() {
    const now = Date.now();
    let last = 0;
    try { last = parseInt(localStorage.getItem('tgInviteAt') || '0', 10) || 0; } catch (err) { last = 0; }
    if (now - last < 300000) {
      showToast(window.I18N && I18N.lang === 'en'
        ? 'Invite again in 5 minutes'
        : 'Повторное приглашение доступно через 5 минут');
      return;
    }
    try { localStorage.setItem('tgInviteAt', String(now)); } catch (err) {}
    if (window.TGRef) TGRef.share();
    S.charges.shake = Math.min(99, S.charges.shake + 1);
    S.charges.clean = Math.min(99, S.charges.clean + 1);
    saveValue(SHAKE_KEY, S.charges.shake);
    saveValue(CLEAN_KEY, S.charges.clean);
    updateBonusUI();
    showToast(window.I18N && I18N.lang === 'en'
      ? 'Invite sent: +1 Booster'
      : 'Приглашение отправлено: +1 Бустер');
  }

  function init() {
    S.best = readBest();
    S.vipUntil = Math.max(0, readInt(VIP_KEY, 0), readInt(VIP_KEY_LEGACY, 0));
    S.vipAds = clamp(readInt(VIP_ADS_KEY, 0), 0, VIP_ADS_REQUIRED);
    S.charges.shake = clamp(readInt(SHAKE_KEY, START_CHARGES), 0, 99);
    S.charges.clean = clamp(readInt(CLEAN_KEY, START_CHARGES), 0, 99);
    claimTelegramRefBonus();
    try {
      S.dailyDate = localStorage.getItem(DAILY_KEY) || '';
    } catch (err) {
      S.dailyDate = '';
    }
    Sound.muted = readMuted();

    buildEvo();
    setupEngine();
    resize();
    warmPlanetSprites();
    bindEvents();

    updateBest();
    updateCharges();
    updateEvo();
    updatePreview();
    applyDailyBonus();
    loadThemeState();
    applyTheme(S.theme, true);
    loadDaily7();
    updateDailyBadge();
    updateEvoTitle();
    updateVipUI();
    syncControls();
    showScreen('start');
    cloudLoadBest();
    savePlayerProfile();
    loadCloudPlayers(function () {
      if (leaderboardOverlay && leaderboardOverlay.classList.contains('open')) renderLeaderboard();
    });

    if (
      bridgeOnline &&
      bridgeApi &&
      bridgeApi.advertisement &&
      bridgeApi.advertisement.isRewardedSupported === false
    ) {
      vipBtn.style.display = 'none';
    }

    setInterval(tickBonus, 250);

    setTimeout(function () {
      if (S.mode !== 'menu') return;
      if (anySheetOpen()) return;
      if (dailyClaimedToday()) return;
      openDaily();
    }, 1500);

    if (window.ResizeObserver) {
      /* second pass after fonts/layout settle */
      requestAnimationFrame(scheduleResize);
    }

    startLoop();
  }

  window.__mergeCosmos = {
    state: S,
    levels: LEVELS,
    engine: function () {
      return engine;
    },
    start: startGame,
    drop: dropCurrent,
    spawn: function (level, x, y) {
      return spawnPlanet(level, x, y);
    },
    bodies: planetBodies,
    pause: pauseGame,
    resume: resumeGame,
    screen: showScreen,
    view: view,
    fullscreen: toggleFullscreen,
  };

  let isGameStarted = false;

  function startInterface() {
    if (isGameStarted) return;
    isGameStarted = true;
    try {
      init();
    } catch (err) {}
  }

  function boot() {
    startInterface();
    initBridge()
      .then(function (ok) {
        if (!ok) return;
        requestAnimationFrame(function () {
          notifyGameReady();
          loadCloudProgress();
          cloudLoadBest();
        });
      })
      .catch(function () {});
    setTimeout(notifyGameReady, 1500);
    setTimeout(notifyGameReady, 4000);
  }

  setTimeout(function () {
    notifyGameReady(true);
  }, 6000);

  boot();
})();
