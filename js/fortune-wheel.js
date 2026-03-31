/* ══════════════════════════════════════════════════
   FORTUNE WHEEL — Norino
   ══════════════════════════════════════════════════ */

const segments = [
  { label: '5% DI SCONTO',       emoji: '🏷️', prize: '5% di sconto',        icon: '🏷️' },
  { label: 'TAGLIO GRATIS',      emoji: '✂️',  prize: 'Taglio gratis',       icon: '✂️'  },
  { label: '10% DI SCONTO',      emoji: '🏷️', prize: '10% di sconto',       icon: '🏷️' },
  { label: 'PIEGA GRATIS',       emoji: '💇',  prize: 'Piega gratis',        icon: '💇'  },
  { label: '15% DI SCONTO',      emoji: '🏷️', prize: '15% di sconto',       icon: '🏷️' },
  { label: 'COLORE GRATIS',      emoji: '🎨',  prize: 'Colore gratis',       icon: '🎨'  },
  { label: '20% DI SCONTO',      emoji: '🏷️', prize: '20% di sconto',       icon: '🏷️' },
  { label: 'PRODOTTO OMAGGIO',   emoji: '🎁',  prize: 'Prodotto in omaggio', icon: '🎁'  },
];

// ── Brand palette (mirrors CSS custom properties) ──
const COLORS = {
  terra:    '#C89565',
  terraHi:  '#DDB07A',
  terraLo:  '#A67848',
  rose:     '#C87060',
  roseHi:   '#D8887A',
  dark:     '#181818',
  cream:    '#FDFDFD',
  silverHi: '#EBEBEB',
  silverMd: '#D4D4D4',
};

// Segment alternating fill colors (elegant, brand-coherent)
const SEG_FILLS = [
  '#FFFFFF',
  '#F7F0E8',  // warm cream-beige
  '#FFFFFF',
  '#F7F0E8',
  '#FFFFFF',
  '#F7F0E8',
  '#FFFFFF',
  '#F7F0E8',
];

const numSeg = segments.length;
const arc    = (2 * Math.PI) / numSeg;
const canvas = document.getElementById('wheel-canvas');
const ctx    = canvas.getContext('2d');
const cx = 520, cy = 520, radius = 500;

let currentRotation = 0;
let spinning        = false;
let spinsLeft       = 1;

// ── Draw ──────────────────────────────────────────
function drawWheel(highlightIndex = -1) {
  ctx.clearRect(0, 0, 1040, 1040);

  // Outer shadow ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  ctx.fill();
  ctx.restore();

  for (let i = 0; i < numSeg; i++) {
    const startAngle = i * arc - Math.PI / 2;
    const endAngle   = startAngle + arc;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();

    if (i === highlightIndex) {
      const grad = ctx.createLinearGradient(
        cx + Math.cos(startAngle + arc / 2) * 50,
        cy + Math.sin(startAngle + arc / 2) * 50,
        cx + Math.cos(startAngle + arc / 2) * radius,
        cy + Math.sin(startAngle + arc / 2) * radius
      );
      grad.addColorStop(0, COLORS.terraHi);
      grad.addColorStop(0.5, COLORS.terra);
      grad.addColorStop(1, COLORS.terraLo);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = SEG_FILLS[i % SEG_FILLS.length];
    }
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.restore();

    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arc / 2);

    const textColor = i === highlightIndex ? COLORS.cream : COLORS.dark;
    ctx.fillStyle   = textColor;
    ctx.font        = '700 22px Poppins, sans-serif';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(segments[i].label, radius * 0.6, 0);

    // Emoji
    ctx.font = '42px serif';
    ctx.fillText(segments[i].emoji, radius * 0.84, 0);

    ctx.restore();
  }

  // Center circle (behind the GIRA button)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 58, 0, 2 * Math.PI);
  ctx.fillStyle   = COLORS.cream;
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur  = 15;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(200,149,101,0.25)';
  ctx.lineWidth   = 2;
  ctx.stroke();
  ctx.restore();
}

// ── Segment detection ─────────────────────────────
function getSegmentAtPointer() {
  const normalizedDeg = ((currentRotation % 360) + 360) % 360;
  const segDeg        = 360 / numSeg;
  const idx           = Math.floor(normalizedDeg / segDeg);
  return (numSeg - idx) % numSeg;
}

// ── Spin ──────────────────────────────────────────
function spinWheel() {
  if (spinning || spinsLeft <= 0) return;
  spinning = true;

  playWhoosh();
  startWheelTicks();

  // Reset prize display
  const display      = document.getElementById('prize-display');
  const prizeIconEl  = document.getElementById('prize-icon');
  const questionMark = document.querySelector('.question-mark');
  display.classList.remove('revealed');
  questionMark.style.display = 'none';
  prizeIconEl.style.display  = 'block';

  // Cycle icons during spin
  const allIcons = segments.map(s => s.icon);
  let cycleIndex = 0;
  let cycleSpeed = 80;
  let cycleTimer = null;

  function cycleIcon() {
    prizeIconEl.textContent = allIcons[cycleIndex % allIcons.length];
    playCycleClick();
    cycleIndex++;
  }

  cycleTimer = setInterval(cycleIcon, cycleSpeed);

  setTimeout(() => { clearInterval(cycleTimer); cycleSpeed = 150; cycleTimer = setInterval(cycleIcon, cycleSpeed); }, 2500);
  setTimeout(() => { clearInterval(cycleTimer); cycleSpeed = 250; cycleTimer = setInterval(cycleIcon, cycleSpeed); }, 3500);
  setTimeout(() => { clearInterval(cycleTimer); cycleSpeed = 400; cycleTimer = setInterval(cycleIcon, cycleSpeed); }, 4000);

  // Determine winning segment & target rotation
  const winIndex       = Math.floor(Math.random() * numSeg);
  const segDeg         = 360 / numSeg;
  const targetSegAngle = winIndex * segDeg + segDeg / 2;
  const extraSpins     = 5 + Math.floor(Math.random() * 3);
  let   targetRotation = currentRotation + (extraSpins * 360) + (360 - targetSegAngle - (currentRotation % 360) + 360) % 360;
  if (targetRotation < currentRotation + 1800) targetRotation += 360 * 3;
  currentRotation = targetRotation;

  const wheel = document.getElementById('wheel');
  wheel.style.transition = 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform  = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    clearInterval(cycleTimer);
    stopWheelTicks();

    const won = segments[winIndex];
    display.classList.add('revealed');
    prizeIconEl.textContent = won.icon;
    prizeIconEl.style.animation = 'none';
    void prizeIconEl.offsetWidth;
    prizeIconEl.style.animation = 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    drawWheel(winIndex);

    spinsLeft--;
    document.getElementById('spins-count').textContent = spinsLeft;

    setTimeout(() => {
      showWinModal(won);
      spinning = false;
      document.getElementById('spin-btn').disabled = spinsLeft <= 0;
    }, 600);

  }, 4700);
}

// ── Modals ────────────────────────────────────────
let lastWonPrize = null;

function showWinModal(prize) {
  lastWonPrize = prize;
  document.getElementById('win-icon').textContent       = prize.icon;
  document.getElementById('win-prize-text').textContent = prize.prize;
  document.getElementById('win-overlay').classList.add('active');
  startConfetti();
  playWinFanfare();
}

function hideWinModal() {
  document.getElementById('win-overlay').classList.remove('active');
  stopConfetti();
  playCollect();
  /* FB Pixel: l'utente vuole riscattare il premio = Lead */
  if (window.fbq_safe) {
    fbq_safe('track', 'Lead', { content_name: lastWonPrize ? lastWonPrize.prize : 'Fortune Wheel' });
  }
}

// ── Confetti ──────────────────────────────────────
let confettiAnimId  = null;
let confettiPieces  = [];

function startConfetti() {
  const cvs  = document.getElementById('confetti-canvas');
  cvs.width  = cvs.parentElement.offsetWidth;
  cvs.height = cvs.parentElement.offsetHeight;
  const cCtx = cvs.getContext('2d');
  confettiPieces = [];

  // Brand-coherent palette: warm golds, terras, roses
  const colors = ['#C89565', '#DDB07A', '#C87060', '#D8887A', '#E8C89A', '#A67848', '#F0C070', '#D4956A'];
  for (let i = 0; i < 120; i++) {
    confettiPieces.push({
      x:        Math.random() * cvs.width,
      y:        Math.random() * cvs.height - cvs.height,
      w:        Math.random() * 10 + 4,
      h:        Math.random() * 6  + 3,
      color:    colors[Math.floor(Math.random() * colors.length)],
      vy:       Math.random() * 3  + 2,
      vx:       (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rv:       (Math.random() - 0.5) * 8,
      opacity:  Math.random() * 0.5 + 0.5,
    });
  }

  function animateConfetti() {
    cCtx.clearRect(0, 0, cvs.width, cvs.height);
    confettiPieces.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.rotation += p.rv;
      if (p.y > cvs.height) { p.y = -10; p.x = Math.random() * cvs.width; }
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rotation * Math.PI) / 180);
      cCtx.globalAlpha = p.opacity;
      cCtx.fillStyle   = p.color;
      cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cCtx.restore();
    });
    confettiAnimId = requestAnimationFrame(animateConfetti);
  }
  animateConfetti();
}

function stopConfetti() {
  if (confettiAnimId) { cancelAnimationFrame(confettiAnimId); confettiAnimId = null; }
  const cvs  = document.getElementById('confetti-canvas');
  const cCtx = cvs.getContext('2d');
  cCtx.clearRect(0, 0, cvs.width, cvs.height);
}

// ── Audio (Web Audio API) ─────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// iOS Safari blocca l'AudioContext finché non c'è un gesto utente.
// Al primo touchstart sblocchiamo il contesto riproducendo un buffer silenzioso.
function unlockAudioOnMobile() {
  const ctx = getAudioCtx();
  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
  ctx.resume();
}
document.addEventListener('touchstart', unlockAudioOnMobile, { once: true });

function createNoiseBuffer(duration) {
  const ctx  = getAudioCtx();
  const len  = ctx.sampleRate * duration;
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function playTick(volume = 0.12) {
  const ctx = getAudioCtx();
  const t   = ctx.currentTime;

  const noise     = ctx.createBufferSource();
  noise.buffer    = createNoiseBuffer(0.015);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.7, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
  const hp = ctx.createBiquadFilter();
  hp.type  = 'highpass';
  hp.frequency.value = 3000;
  noise.connect(hp); hp.connect(noiseGain); noiseGain.connect(ctx.destination);
  noise.start(t);

  const body     = ctx.createOscillator();
  body.type      = 'sine';
  body.frequency.value = 420;
  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(volume * 0.3, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
  body.connect(bodyGain); bodyGain.connect(ctx.destination);
  body.start(t); body.stop(t + 0.03);
}

function playWhoosh() {
  const ctx = getAudioCtx();
  const t   = ctx.currentTime;

  const noise  = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(0.8);
  const bp = ctx.createBiquadFilter();
  bp.type  = 'bandpass';
  bp.Q.value = 0.8;
  bp.frequency.setValueAtTime(300, t);
  bp.frequency.linearRampToValueAtTime(1200, t + 0.15);
  bp.frequency.linearRampToValueAtTime(600, t + 0.8);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
  gain.gain.linearRampToValueAtTime(0.06, t + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  noise.connect(bp); bp.connect(gain); gain.connect(ctx.destination);
  noise.start(t);
}

function playCycleClick() {
  const ctx    = getAudioCtx();
  const t      = ctx.currentTime;
  const noise  = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(0.008);
  const gain   = ctx.createGain();
  gain.gain.setValueAtTime(0.04, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);
  const hp = ctx.createBiquadFilter();
  hp.type  = 'highpass';
  hp.frequency.value = 4000;
  noise.connect(hp); hp.connect(gain); gain.connect(ctx.destination);
  noise.start(t);
}

function playWinFanfare() {
  const ctx = getAudioCtx();
  const t   = ctx.currentTime;

  function playChime(freq, time, vol) {
    const osc1 = ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = freq;
    const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = freq * 2.01;
    const g1 = ctx.createGain(); const g2 = ctx.createGain();
    g1.gain.setValueAtTime(0, time);
    g1.gain.linearRampToValueAtTime(vol, time + 0.01);
    g1.gain.exponentialRampToValueAtTime(vol * 0.4, time + 0.15);
    g1.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
    g2.gain.setValueAtTime(0, time);
    g2.gain.linearRampToValueAtTime(vol * 0.2, time + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    const noise  = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(0.01);
    const nGain  = ctx.createGain();
    nGain.gain.setValueAtTime(vol * 0.15, time);
    nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.01);
    const nBp    = ctx.createBiquadFilter(); nBp.type = 'bandpass'; nBp.frequency.value = freq * 3; nBp.Q.value = 2;
    osc1.connect(g1); g1.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    noise.connect(nBp); nBp.connect(nGain); nGain.connect(ctx.destination);
    osc1.start(time); osc1.stop(time + 0.7);
    osc2.start(time); osc2.stop(time + 0.4);
    noise.start(time);
  }

  playChime(523,  t,        0.12);
  playChime(659,  t + 0.15, 0.14);
  playChime(784,  t + 0.30, 0.16);
  playChime(1047, t + 0.48, 0.13);

  setTimeout(() => {
    const t2  = ctx.currentTime;
    const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(1047, t2);
    const g   = ctx.createGain();
    g.gain.setValueAtTime(0.06, t2);
    g.gain.exponentialRampToValueAtTime(0.001, t2 + 0.8);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t2); osc.stop(t2 + 0.8);
  }, 600);
}

function playCollect() {
  const ctx    = getAudioCtx();
  const t      = ctx.currentTime;
  const noise  = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(0.015);
  const nGain  = ctx.createGain();
  nGain.gain.setValueAtTime(0.08, t);
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
  const lp     = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
  noise.connect(lp); lp.connect(nGain); nGain.connect(ctx.destination);
  noise.start(t);

  const osc = ctx.createOscillator(); osc.type = 'sine';
  osc.frequency.setValueAtTime(660, t);
  osc.frequency.setValueAtTime(880, t + 0.07);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.1, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.12);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.35);
}

// Wheel ticks during spin
let tickInterval = null;

function startWheelTicks() {
  let tickSpeed = 55;
  let elapsed   = 0;

  function scheduleTick() {
    const vol = Math.max(0.03, 0.12 * (1 - elapsed / 5000));
    playTick(vol);
    elapsed += tickSpeed;
    if (elapsed < 1200)      tickSpeed = 55;
    else if (elapsed < 2000) tickSpeed = 75;
    else if (elapsed < 2800) tickSpeed = 110;
    else if (elapsed < 3500) tickSpeed = 170;
    else if (elapsed < 4000) tickSpeed = 260;
    else                     tickSpeed = 380;
    if (elapsed < 4600) tickInterval = setTimeout(scheduleTick, tickSpeed);
  }
  scheduleTick();
}

function stopWheelTicks() {
  if (tickInterval) { clearTimeout(tickInterval); tickInterval = null; }
}

// ── Init ──────────────────────────────────────────
drawWheel();

/* FB Pixel: l'utente ha aperto la pagina fortune wheel */
if (window.fbq_safe) fbq_safe('track', 'ViewContent', { content_name: 'Fortune Wheel' });

const spinBtn    = document.getElementById('spin-btn');
const collectBtn = document.getElementById('collect-btn');

// Support both click and touch (prevents 300ms delay on mobile)
spinBtn.addEventListener('click', spinWheel);
collectBtn.addEventListener('click', hideWinModal);

// Prevent context menu on long-press (mobile)
spinBtn.addEventListener('contextmenu', e => e.preventDefault());
