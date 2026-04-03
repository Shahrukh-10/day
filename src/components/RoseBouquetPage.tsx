'use client';

import { useEffect, useRef, useState } from 'react';

interface RoseBouquetPageProps {
  onContinue: () => void;
}

/*
 * 🌹 CINEMATIC ROSES INTRO
 * Real rose photos + Ken Burns zoom/pan + falling petals + sparkles
 * + text reveals + heartbeat glow — all in 12 seconds of magic.
 *
 * Timeline:
 *   0.0s — Fade in from black
 *   0.5s — First rose image appears (slow zoom in)
 *   2.5s — Crossfade to second rose (pan left)
 *   4.5s — Crossfade to third rose (zoom out)
 *   6.0s — Text "For You" fades in
 *   7.0s — Name "Fakeha" reveals with glow
 *   7.5s — Crossfade to fourth rose (bouquet)
 *   8.5s — Rose emoji 🌹 floats up
 *   9.5s — Sparkle burst
 *  10.5s — All settle, continue button appears
 *  12.0s — Ready for interaction
 */

const ROSE_IMAGES = [
  '/day/media/roses/rose01.jpg',  // 1.2MB 2252×4000 — Luxury bouquet HERO shot
  '/day/media/roses/rose02.jpg',  // 362K 1200×2133 — Dewdrop macro close-up
  '/day/media/roses/rose03.jpg',  // 181K 1080×1920 — Luxury bouquet dark
  '/day/media/roses/rose04.jpg',  // 153K 1080×1920 — Moody rose close-up
  '/day/media/roses/rose05.jpg',  // 148K 1080×1920 — Bouquet aesthetic
  '/day/media/roses/rose06.jpg',  // 144K 736×1308  — Bouquet dark
  '/day/media/roses/rose07.jpg',  // 121K 1152×2016 — Single rose HD
  '/day/media/roses/rose08.jpg',  // 111K 680×1200  — Macro rose
  '/day/media/roses/rose09.jpg',  // 99K  675×1200  — Bouquet
  '/day/media/roses/rose10.jpg',  // 96K  720×1283  — Dewdrop rose
  '/day/media/roses/rose11.jpg',  // 80K  723×1349  — Single rose dark
  '/day/media/roses/rose12.jpg',  // 80K  832×1248  — Bouquet gift
];

// Slide configs: all 12 images with varied Ken Burns moves.
const SLIDES = [
  { img: 0,  dur: 2500, from: 'scale(1.0) translate(0,0)',     to: 'scale(1.12) translate(-1%,-1%)' },  // HERO luxury bouquet opener
  { img: 1,  dur: 2200, from: 'scale(1.1) translate(2%,0)',    to: 'scale(1.2) translate(-2%,1%)' },   // dewdrop macro close-up
  { img: 2,  dur: 2200, from: 'scale(1.05) translate(0,0)',    to: 'scale(1.1) translate(0,-1%)' },    // luxury bouquet dark
  { img: 3,  dur: 2100, from: 'scale(1.05) translate(1%,0)',   to: 'scale(1.15) translate(-1%,-2%)' }, // moody rose close-up
  { img: 4,  dur: 2200, from: 'scale(1.15) translate(0,2%)',   to: 'scale(1.0) translate(0,0)' },      // bouquet aesthetic
  { img: 5,  dur: 2100, from: 'scale(1.0) translate(0,0)',     to: 'scale(1.12) translate(-2%,1%)' },  // bouquet dark
  { img: 6,  dur: 2200, from: 'scale(1.0) translate(-2%,0)',   to: 'scale(1.15) translate(2%,-2%)' },  // single rose HD
  { img: 7,  dur: 2000, from: 'scale(1.14) translate(1%,2%)',  to: 'scale(1.02) translate(-1%,-1%)' }, // macro rose
  { img: 8,  dur: 2100, from: 'scale(1.02) translate(-2%,1%)', to: 'scale(1.14) translate(1%,-2%)' },  // bouquet
  { img: 9,  dur: 2000, from: 'scale(1.1) translate(-1%,1%)',  to: 'scale(1.0) translate(1%,0)' },     // dewdrop rose
  { img: 10, dur: 2100, from: 'scale(1.08) translate(0,1%)',   to: 'scale(1.16) translate(-1%,-2%)' }, // single rose dark
  { img: 11, dur: 2400, from: 'scale(1.03) translate(0,0)',    to: 'scale(1.12) translate(0,-1%)' },   // bouquet gift finale
];

const INTRO_FADE_MS = 300;
const FINAL_SLIDE_INDEX = SLIDES.length - 1;
const TEXT_REVEAL_SLIDE_INDEX = FINAL_SLIDE_INDEX;
const NAME_REVEAL_SLIDE_INDEX = FINAL_SLIDE_INDEX;
const BUTTON_REVEAL_DELAY_MS = 1200;

// Pre-computed sparkle positions (avoids Math.random in render → hydration mismatch)
const SPARKLE_DATA = [
  { left: '46%', top: '34%', delay: '7.7s', size: '3px' },
  { left: '79%', top: '54%', delay: '4.3s', size: '4px' },
  { left: '82%', top: '38%', delay: '8.6s', size: '5px' },
  { left: '11%', top: '43%', delay: '5.9s', size: '5px' },
  { left: '45%', top: '32%', delay: '4.9s', size: '4px' },
  { left: '33%', top: '77%', delay: '8.3s', size: '4px' },
  { left: '35%', top: '25%', delay: '4.3s', size: '4px' },
  { left: '59%', top: '71%', delay: '5.0s', size: '4px' },
  { left: '28%', top: '38%', delay: '9.1s', size: '3px' },
  { left: '14%', top: '44%', delay: '8.1s', size: '3px' },
  { left: '57%', top: '16%', delay: '6.4s', size: '5px' },
  { left: '65%', top: '25%', delay: '7.0s', size: '3px' },
  { left: '76%', top: '58%', delay: '9.3s', size: '3px' },
  { left: '49%', top: '11%', delay: '6.8s', size: '4px' },
  { left: '87%', top: '56%', delay: '4.9s', size: '4px' },
];

const FLOAT_EMOJIS = [
  { emoji: '🌹', left: '15%', delay: '8s', size: '22px' },
  { emoji: '🥀', left: '32%', delay: '8.4s', size: '28px' },
  { emoji: '🌹', left: '49%', delay: '8.8s', size: '30px' },
  { emoji: '💐', left: '66%', delay: '9.2s', size: '32px' },
  { emoji: '🌹', left: '83%', delay: '9.6s', size: '24px' },
];

const PETAL_COLORS = [
  '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  '#450a0a', '#831843', '#9f1239', '#be123c',
];

interface Petal {
  x: number; y: number; size: number; speedY: number;
  rotation: number; rotSpeed: number; color: string;
  opacity: number; swayPhase: number; swayAmp: number; swaySpeed: number;
}

function createPetal(W: number, H: number, startY?: number): Petal {
  return {
    x: Math.random() * W,
    y: startY ?? -20 - Math.random() * 80,
    size: 6 + Math.random() * 12,
    speedY: 0.4 + Math.random(),
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.03,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    opacity: 0.3 + Math.random() * 0.5,
    swayPhase: Math.random() * Math.PI * 2,
    swayAmp: 15 + Math.random() * 25,
    swaySpeed: 0.008 + Math.random() * 0.012,
  };
}

export default function RoseBouquetPage({ onContinue }: Readonly<RoseBouquetPageProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [phase, setPhase] = useState(0);     // 0=black, 1=slideshow, 2=text, 3=ready
  const [slideIdx, setSlideIdx] = useState(0);
  const [showName, setShowName] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [fadeClass, setFadeClass] = useState('');

  // ─── Timeline Controller ───
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const t = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };
    const slideStartTimes = SLIDES.reduce<number[]>((times, slide, index) => {
      if (index === 0) {
        times.push(INTRO_FADE_MS);
        return times;
      }

      const previousStart = times[index - 1];
      const previousSlide = SLIDES[index - 1];
      times.push(previousStart + previousSlide.dur);
      return times;
    }, []);
    const textRevealAt = slideStartTimes[TEXT_REVEAL_SLIDE_INDEX] ?? slideStartTimes[Math.max(slideStartTimes.length - 2, 0)] ?? INTRO_FADE_MS;
    const nameRevealAt = slideStartTimes[NAME_REVEAL_SLIDE_INDEX] ?? textRevealAt + 1200;
    const lastSlideStart = slideStartTimes.at(-1) ?? INTRO_FADE_MS;
    const buttonRevealAt = lastSlideStart + BUTTON_REVEAL_DELAY_MS;

    // Fade in and start the slideshow.
    t(() => { setFadeClass('rb-visible'); setPhase(1); }, INTRO_FADE_MS);

    slideStartTimes.slice(1).forEach((startTime, index) => {
      t(() => setSlideIdx(index + 1), startTime);
    });

    t(() => setPhase(2), textRevealAt);
    t(() => setShowName(true), nameRevealAt);
    t(() => { setPhase(3); setShowBtn(true); }, buttonRevealAt);

    return () => timers.forEach(clearTimeout);
  }, []);

  // ─── Canvas Falling Petals ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const petals: Petal[] = [];
    for (let i = 0; i < 35; i++) petals.push(createPetal(W, H, Math.random() * H));

    let tick = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      tick++;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin(tick * p.swaySpeed + p.swayPhase) * (p.swayAmp * 0.015);
        p.rotation += p.rotSpeed;

        if (p.y > H + 30) petals[i] = createPetal(W, H);
        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Teardrop petal shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.3, p.size * 0.4, p.size * 0.4, 0, p.size * 0.6);
        ctx.bezierCurveTo(-p.size * 0.4, p.size * 0.4, -p.size * 0.5, -p.size * 0.3, 0, -p.size * 0.6);
        ctx.closePath();

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, '#1a0505');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
      animRef.current = requestAnimationFrame(animate);
    }

    const startT = setTimeout(animate, 800);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(startT);
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={`rb-page ${fadeClass}`}>
      {/* Black base */}
      <div className="rb-bg" />

      {/* Slideshow layers — two layers for crossfade */}
      <div className="rb-slideshow">
        {SLIDES.map((slide, i) => (
          <div
            key={ROSE_IMAGES[slide.img]}
            className={`rb-slide ${slideIdx === i ? 'rb-slide-active' : ''}`}
            style={{
              backgroundImage: `url(${ROSE_IMAGES[slide.img]})`,
              '--rb-from': slide.from,
              '--rb-to': slide.to,
              '--rb-dur': `${slide.dur}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Dark overlay for text readability */}
      <div className="rb-overlay" />

      {/* Vignette */}
      <div className="rb-vignette" />

      {/* Canvas petals */}
      <canvas ref={canvasRef} className="rb-canvas" />

      {/* Sparkles — fixed positions to avoid hydration mismatch */}
      <div className="rb-sparkles">
        {SPARKLE_DATA.map((s) => (
          <div
            key={`${s.left}-${s.top}-${s.delay}`}
            className="rb-spark"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              width: s.size,
              height: s.size,
            }}
          />
        ))}
      </div>

      {/* Floating emoji roses */}
      <div className="rb-float-roses">
        {FLOAT_EMOJIS.map((e) => (
          <span
            key={`${e.emoji}-${e.left}-${e.delay}`}
            className="rb-float-emoji"
            style={{
              left: e.left,
              animationDelay: e.delay,
              fontSize: e.size,
            }}
          >
            {e.emoji}
          </span>
        ))}
      </div>

      {/* Text content */}
      <div className="rb-content">
        {phase >= 2 && (
          <div className="rb-text-area">
            <p className="rb-for-you">All For You</p>
            {showName && (
              <h1 className="rb-name">
                {'Faku '}
                <span className="rb-rose-icon">🌹</span>
              </h1>
            )}
            <p className={`rb-subtitle ${showName ? 'rb-subtitle-show' : ''}`}>
              Every rose carries a reason I care
            </p>
          </div>
        )}

        {showBtn && (
          <button className="rb-btn" onClick={onContinue}>
            <span>Unwrap Your Gift</span>
          </button>
        )}
      </div>

      {/* Breathing glow at bottom */}
      <div className="rb-bottom-glow" />
    </div>
  );
}
