/* =========================================================
   e-bio  —  black / dark red

   ►►► EVERYTHING YOU CAN CHANGE IS IN THIS BLOCK ◄◄◄
   ========================================================= */

const CONFIG = {
  // Your name, shown big at the top.
  name: 'diamonds',

  // Your quote. It types itself out letter by letter.
  quote: 'So kinzer was addicted to last stomps, on october, he performed the final satanic ritual to free his soul, thus slowly dissipating as jailbreak went on.',

  // Your profile picture. Either:
  //   • drop an image next to this file and put its filename here  ->  'me.jpg'
  //   • or paste a direct image link                               ->  'https://…/pic.png'
  //   • leave as null for the built-in placeholder
  pfp: 'abdiware.webp',

  // Red accent used across the page. Try '#8b0000', '#e01e37', '#a4161a', '#6a040f'.
  accent: '#c1121f'
};
const DEFAULT_PFP =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <defs><radialGradient id="g" cx="50%" cy="35%">
        <stop offset="0%" stop-color="#3a1116"/><stop offset="100%" stop-color="#0b0507"/>
      </radialGradient></defs>
      <rect width="200" height="200" fill="url(#g)"/>
      <circle cx="100" cy="78" r="34" fill="#c1121f" opacity=".55"/>
      <path d="M40 178c0-33 27-58 60-58s60 25 60 58z" fill="#c1121f" opacity=".55"/>
    </svg>`
  );

const $ = (id) => document.getElementById(id);
const stage = $('stage');

/* ---------- accent ---------- */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

let emberColor = [193, 18, 31];

function applyAccent(hex) {
  const { r, g, b } = hexToRgb(hex);
  const root = document.documentElement.style;
  root.setProperty('--accent', hex);
  root.setProperty('--accent-soft', `rgba(${r},${g},${b},.35)`);
  root.setProperty('--accent-glow', `rgba(${r},${g},${b},.55)`);
  root.setProperty('--line', `rgba(${r},${g},${b},.22)`);
  emberColor = [r, g, b];
}

/* ---------- render ---------- */
function render() {
  applyAccent(CONFIG.accent);
  const img = $('pfp');
  img.src = CONFIG.pfp || DEFAULT_PFP;
  img.onerror = () => { img.onerror = null; img.src = DEFAULT_PFP; };
  $('username').textContent = CONFIG.name;
  $('quote').textContent = CONFIG.quote;
}

/* ---------- typewriter ---------- */
let typeTimer;
function typeQuote(text) {
  const el = $('quote');
  clearInterval(typeTimer);
  el.textContent = '';
  el.classList.remove('done');
  let i = 0;
  typeTimer = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) {
      clearInterval(typeTimer);
      setTimeout(() => el.classList.add('done'), 900);
    }
  }, 38);
}

/* ---------- reveal ---------- */
let revealed = false;
function reveal() {
  if (revealed) return;
  revealed = true;
  void stage.offsetWidth; // flush styles so the transition actually plays
  stage.classList.add('show');
  setTimeout(() => typeQuote(CONFIG.quote), 900);
}

/* ---------- ember particles ---------- */
const canvas = $('embers');
const ctx = canvas.getContext('2d');
let particles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function sizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawn(anywhere) {
  return {
    x: Math.random() * innerWidth,
    y: anywhere ? Math.random() * innerHeight : innerHeight + 10,
    r: Math.random() * 1.9 + 0.5,
    vy: -(Math.random() * 0.42 + 0.14),
    vx: (Math.random() - 0.5) * 0.28,
    a: Math.random() * 0.5 + 0.16,
    drift: Math.random() * Math.PI * 2,
    ds: Math.random() * 0.02 + 0.005
  };
}

function seed() {
  const count = Math.round(Math.min(90, innerWidth / 14));
  particles = Array.from({ length: count }, () => spawn(true));
}

function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const [r, g, b] = emberColor;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.drift += p.ds;
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.drift) * 0.28;
    if (p.y < -12) particles[i] = spawn(false);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${r},${g},${b},.8)`;
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  requestAnimationFrame(loop);
}

addEventListener('resize', () => {
  sizeCanvas();
  seed();
});

/* ---------- boot ---------- */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
sizeCanvas();
seed();
if (!reduced) loop();
render();

// Fade in once fonts/images have settled — with a fallback so a slow
// remote pfp can never leave the page stuck invisible.
addEventListener('load', () => setTimeout(reveal, 120));
setTimeout(reveal, 2500);
