'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { config } from '@/config';
import Image from 'next/image';

interface SurprisePageProps {
  onContinue: () => void;
  startMusic: () => void;
}

export default function SurprisePage({ onContinue, startMusic }: SurprisePageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const boxClickedRef = useRef(false);

  const [showCake, setShowCake] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [cakeHint, setCakeHint] = useState('');
  const cakeSliceRef = useRef(false);
  const shakeCountRef = useRef(0);
  const lastShakeRef = useRef(0);

  const createSparkle = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      const colors = ['#fbbf24', '#f472b6', '#00C9A7', '#a78bfa', '#fb923c'];
      sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.boxShadow = `0 0 6px ${sparkle.style.background}, 0 0 12px ${sparkle.style.background}50`;
      sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
      sparkle.style.top = (rect.top + Math.random() * rect.height - 10) + 'px';
      sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1200);
    }
  }, []);

  const revealNameLetters = useCallback((name: string) => {
    const container = document.getElementById('revealName');
    if (!container) return;
    container.innerHTML = '';
    name.split('').forEach((letter, i) => {
      const span = document.createElement('span');
      span.className = 'reveal-letter';
      span.textContent = letter;
      span.style.animationDelay = (i * 0.15 + 0.3) + 's';
      container.appendChild(span);
      setTimeout(() => createSparkle(span), (i * 150) + 600);
    });
  }, [createSparkle]);

  const createBoxExplosion = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ['#dc2626', '#b91c1c', '#00C9A7', '#0f766e', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c', '#34d399'];
    // Box pieces
    for (let i = 0; i < 30; i++) {
      const piece = document.createElement('div');
      piece.className = 'explosion-piece';
      piece.style.left = cx + 'px';
      piece.style.top = cy + 'px';
      piece.style.width = (Math.random() * 20 + 10) + 'px';
      piece.style.height = (Math.random() * 20 + 10) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 300 + 100;
      piece.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      piece.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1200);
    }
    // Particle burst — smaller glowing dots
    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div');
      dot.className = 'burst-particle';
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';
      const color = colors[Math.floor(Math.random() * colors.length)];
      dot.style.background = color;
      dot.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}80`;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 250 + 80;
      dot.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      dot.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      dot.style.animationDelay = (Math.random() * 0.15) + 's';
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 1500);
    }
  }, []);

  const createHeartsRain = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;
    const emojis = ['💖', '💕', '✨', '🌸', '💗', '🎀', '⭐', '💫'];
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('div');
      heart.className = 'falling-heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
      heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
      heart.style.animationDelay = (Math.random() * 1.5) + 's';
      page.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }
  }, []);

  const createGlowPulse = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;
    const glow = document.createElement('div');
    glow.className = 'glow-pulse';
    page.appendChild(glow);
    setTimeout(() => glow.remove(), 2000);
  }, []);

  const celebrationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCelebration = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;
    const el = page;

    const emojis = ['💖', '✨', '🌸', '🎉', '🎊', '💫', '⭐', '💗', '🎀', '🎁', '💕'];
    const colors = ['#dc2626', '#fbbf24', '#00C9A7', '#f472b6', '#a78bfa', '#fb923c', '#34d399', '#60a5fa'];

    function spawnConfetti() {
      for (let i = 0; i < 5; i++) {
        const piece = document.createElement('div');
        piece.className = 'celebration-confetti';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 4) + 'px';
        piece.style.height = (Math.random() * 12 + 6) + 'px';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        el.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
      }
      const heart = document.createElement('div');
      heart.className = 'falling-heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 18 + 12) + 'px';
      heart.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
      el.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }

    function spawnFirework() {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 40 + 10;
      const burstColors = [...colors].sort(() => Math.random() - 0.5).slice(0, 3);
      for (let i = 0; i < 12; i++) {
        const dot = document.createElement('div');
        dot.className = 'firework-spark';
        dot.style.left = x + '%';
        dot.style.top = y + '%';
        const color = burstColors[Math.floor(Math.random() * burstColors.length)];
        dot.style.background = color;
        dot.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}80`;
        const angle = (i / 12) * Math.PI * 2;
        const dist = Math.random() * 60 + 40;
        dot.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        dot.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        el.appendChild(dot);
        setTimeout(() => dot.remove(), 1200);
      }
    }

    // Initial burst
    spawnConfetti();
    spawnFirework();

    // Continuous loop
    celebrationRef.current = setInterval(() => {
      spawnConfetti();
      if (Math.random() > 0.4) spawnFirework();
    }, 600);
  }, []);

  // Cleanup celebration on unmount
  useEffect(() => {
    return () => {
      if (celebrationRef.current) clearInterval(celebrationRef.current);
    };
  }, []);

  // Cake cutting hint
  useEffect(() => {
    if (!showCake || cakeCut) return;
    setCakeHint('🔪 Swipe down on the cake to cut it!');
  }, [showCake, cakeCut]);

  // Swipe to cut cake
  const cakeTouchStartY = useRef(0);

  const handleCakeTouchStart = useCallback((e: React.TouchEvent) => {
    cakeTouchStartY.current = e.touches[0].clientY;
  }, []);

  const handleCakeTouchEnd = useCallback((e: React.TouchEvent) => {
    if (cakeSliceRef.current) return;
    const diff = e.changedTouches[0].clientY - cakeTouchStartY.current;
    if (diff > 60) {
      cakeSliceRef.current = true;
      setCakeCut(true);
    }
  }, []);

  // Mouse swipe fallback for desktop
  const cakeMouseStartY = useRef(0);
  const cakeMouseDown = useRef(false);

  const handleCakeMouseDown = useCallback((e: React.MouseEvent) => {
    cakeMouseDown.current = true;
    cakeMouseStartY.current = e.clientY;
  }, []);

  const handleCakeMouseUp = useCallback((e: React.MouseEvent) => {
    if (!cakeMouseDown.current || cakeSliceRef.current) return;
    cakeMouseDown.current = false;
    const diff = e.clientY - cakeMouseStartY.current;
    if (diff > 60) {
      cakeSliceRef.current = true;
      setCakeCut(true);
    }
  }, []);

  // When cake is cut → trigger spectacular celebrations then reveal
  useEffect(() => {
    if (!cakeCut) return;
    const page = pageRef.current;
    const reveal = revealRef.current;
    const btn = btnRef.current;
    if (!page || !reveal) return;
    const el = page;

    setCakeHint('🎂 Happy Birthday!');

    // Add split animation to cake
    const cakeEl = el.querySelector('.cake');
    if (cakeEl) cakeEl.classList.add('cake-split');

    const colors = ['#dc2626', '#fbbf24', '#00C9A7', '#f472b6', '#a78bfa', '#fb923c', '#34d399', '#60a5fa', '#e11d48', '#8b5cf6'];
    const emojis = ['✨', '🌟', '⭐', '💫', '🎉', '🎊', '💖', '🎂', '🎁', '🎀'];

    // Ring wave effects
    function spawnRingWaves() {
      [0, 200, 400].forEach((delay, i) => {
        setTimeout(() => {
          const ring = document.createElement('div');
          ring.className = 'cake-ring-wave';
          ring.style.borderColor = colors[i * 3];
          el.appendChild(ring);
          setTimeout(() => ring.remove(), 1000);
        }, delay);
      });
    }

    // Firework burst from cake center
    function spawnCakeFireworks(cx: number, cy: number, count: number) {
      for (let i = 0; i < count; i++) {
        const spark = document.createElement('div');
        spark.className = 'cake-firework';
        spark.style.left = cx + 'px';
        spark.style.top = cy + 'px';
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.background = color;
        spark.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}80`;
        const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.3);
        const dist = Math.random() * 150 + 80;
        spark.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
        spark.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
        spark.style.animationDelay = (Math.random() * 0.1) + 's';
        el.appendChild(spark);
        setTimeout(() => spark.remove(), 1200);
      }
    }

    // Firecracker launches
    function spawnFirecrackers() {
      const positions = [15, 30, 50, 70, 85];
      positions.forEach((xPct, idx) => {
        setTimeout(() => {
          // Launch trail
          const fc = document.createElement('div');
          fc.className = 'cake-firecracker';
          fc.style.left = xPct + '%';
          fc.style.bottom = '30%';
          fc.style.width = '4px';
          fc.style.height = '4px';
          fc.style.borderRadius = '50%';
          fc.style.background = colors[idx * 2];
          fc.style.boxShadow = `0 0 8px ${colors[idx * 2]}`;
          fc.style.setProperty('--launch-y', -(Math.random() * 150 + 100) + 'px');
          el.appendChild(fc);

          // Burst sparks after launch
          setTimeout(() => {
            const rect = fc.getBoundingClientRect();
            const bx = rect.left + rect.width / 2;
            const by = rect.top;
            fc.remove();

            for (let j = 0; j < 16; j++) {
              const sp = document.createElement('div');
              sp.className = 'cake-firecracker-spark';
              sp.style.left = bx + 'px';
              sp.style.top = by + 'px';
              const c = colors[Math.floor(Math.random() * colors.length)];
              sp.style.background = c;
              sp.style.boxShadow = `0 0 6px ${c}, 0 0 10px ${c}80`;
              const angle = (j / 16) * Math.PI * 2;
              const dist = Math.random() * 80 + 40;
              sp.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
              sp.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
              sp.style.animationDelay = (Math.random() * 0.1) + 's';
              document.body.appendChild(sp);
              setTimeout(() => sp.remove(), 1000);
            }
          }, 500);
        }, idx * 200);
      });
    }

    // Star/emoji bursts
    function spawnStarBursts() {
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          const star = document.createElement('div');
          star.className = 'cake-star-burst';
          star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          star.style.left = (30 + Math.random() * 40) + '%';
          star.style.top = (30 + Math.random() * 30) + '%';
          star.style.fontSize = (Math.random() * 16 + 16) + 'px';
          const angle = Math.random() * Math.PI * 2;
          const mid = Math.random() * 60 + 30;
          const far = Math.random() * 150 + 80;
          star.style.setProperty('--bx1', Math.cos(angle) * mid + 'px');
          star.style.setProperty('--by1', (Math.sin(angle) * mid - 20) + 'px');
          star.style.setProperty('--bx2', Math.cos(angle) * far + 'px');
          star.style.setProperty('--by2', (Math.sin(angle) * far - 40) + 'px');
          el.appendChild(star);
          setTimeout(() => star.remove(), 1500);
        }, Math.random() * 800);
      }
    }

    // Sequence the celebrations
    spawnRingWaves();

    setTimeout(() => {
      const cakeContainer = el.querySelector('.cake-container');
      if (cakeContainer) {
        const rect = cakeContainer.getBoundingClientRect();
        spawnCakeFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
      }
      spawnStarBursts();
    }, 300);

    setTimeout(() => spawnFirecrackers(), 500);

    // Second wave of fireworks
    setTimeout(() => {
      const cakeContainer = el.querySelector('.cake-container');
      if (cakeContainer) {
        const rect = cakeContainer.getBoundingClientRect();
        spawnCakeFireworks(rect.left + rect.width / 2 - 50, rect.top + rect.height / 3, 16);
        spawnCakeFireworks(rect.left + rect.width / 2 + 50, rect.top + rect.height / 3, 16);
      }
    }, 900);

    // Transition to reveal after celebrations
    const timer = setTimeout(() => {
      setShowCake(false);
      createGlowPulse();
      createHeartsRain();
      startCelebration();
      startMusic();
      reveal.classList.add('active');
      revealNameLetters(config.name);
      setTimeout(() => {
        if (btn) btn.style.display = 'block';
      }, 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [cakeCut, createGlowPulse, createHeartsRain, startCelebration, startMusic, revealNameLetters]);

  const handleBoxClick = useCallback(() => {
    if (boxClickedRef.current) return;
    boxClickedRef.current = true;

    const page = pageRef.current;
    const box = boxRef.current;
    const reveal = revealRef.current;
    const btn = btnRef.current;
    const slayerEffects = document.getElementById('slayerEffects');
    if (!page || !box || !reveal || !slayerEffects) return;

    // Phase 1: Escalating wobbles (3 rounds, each more intense)
    box.style.animation = 'none';

    // Wobble 1 — gentle
    box.classList.add('wobbling');
    setTimeout(() => {
      box.classList.remove('wobbling');
      // Wobble 2 — medium
      setTimeout(() => {
        box.classList.add('wobble-medium');
        setTimeout(() => {
          box.classList.remove('wobble-medium');
          // Wobble 3 — intense
          setTimeout(() => {
            box.classList.add('wobble-intense');
            setTimeout(() => {
              box.classList.remove('wobble-intense');

              // Phase 2: Speed lines + slayers
      const speedLines = document.createElement('div');
      speedLines.className = 'speed-lines active';
      for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'speed-line';
        line.style.top = Math.random() * 100 + '%';
        line.style.animationDelay = (Math.random() * 0.2) + 's';
        line.style.height = (Math.random() * 2 + 1) + 'px';
        speedLines.appendChild(line);
      }
      page.appendChild(speedLines);
      slayerEffects.classList.add('active');

      // Phase 3: Impact
      setTimeout(() => {
        page.classList.add('screen-shake');
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        page.appendChild(flash);
        box.classList.add('slashed');
        createBoxExplosion();

        setTimeout(() => page.classList.remove('screen-shake'), 500);

        // Phase 4: Show Cake
        setTimeout(() => {
          box.style.display = 'none';
          const wrapper = page.querySelector('.surprise-box-wrapper') as HTMLElement;
          if (wrapper) wrapper.style.display = 'none';
          slayerEffects.style.opacity = '0';
          slayerEffects.style.transition = 'opacity 0.4s ease';
          setTimeout(() => { slayerEffects.style.display = 'none'; }, 400);
          speedLines.remove();
          flash.remove();
          setShowCake(true);
        }, 800);
      }, 500);
            }, 300); // end wobble-intense timeout
          }, 100); // gap between wobble 2 and 3
        }, 350); // end wobble-medium timeout
      }, 100); // gap between wobble 1 and 2
    }, 350); // end wobble 1 timeout
  }, [createBoxExplosion, revealNameLetters, createGlowPulse, createHeartsRain, startCelebration, startMusic]);

  return (
    <div className="surprise-page active" ref={pageRef}>
      <div className="surprise-content">
        <div className="surprise-box-wrapper">
          <div className="surprise-box" ref={boxRef} onClick={handleBoxClick}>
            <div className="surprise-box-cover">
              <div className="ribbon-bow"></div>
            </div>
            <div className="surprise-box-body"></div>
            <p className="surprise-tap">Tap to open! 🎁</p>
          </div>
        </div>

        <div className="slayer-effects" id="slayerEffects">
          <div className="slayer tanjiro">
            <div className="img-wrap">
              <Image src="/media/tanjiro.jpeg" alt="Tanjiro" className="slayer-img tanjiro-img" width={140} height={140} />
            </div>
          </div>
          <div className="slayer zenitsu">
            <div className="img-wrap">
              <Image src="/media/zenitsu.png" alt="Zenitsu" className="slayer-img zenitsu-img" width={140} height={140} />
            </div>
          </div>
          <div className="slash-cross">
            <div className="slash-line slash-line-1"></div>
            <div className="slash-line slash-line-2"></div>
          </div>
        </div>

        <div className="birthday-reveal" ref={revealRef}>
          <span className="reveal-emoji">🌸</span>
          <h1 className="reveal-title">Happy Birthday</h1>
          <p className="reveal-subtitle">The one and only...</p>
          <h2 className="reveal-name" id="revealName"></h2>
          <span className="reveal-emoji">🌸</span>
        </div>
      </div>

      {/* Cake Phase — outside surprise-content so it fills the full viewport */}
      {showCake && (
        <div
          className={`cake-phase ${cakeCut ? 'cut' : ''}`}
          onTouchStart={handleCakeTouchStart}
          onTouchEnd={handleCakeTouchEnd}
          onMouseDown={handleCakeMouseDown}
          onMouseUp={handleCakeMouseUp}
        >
          <div className="cake-title">✨ Make a Wish! ✨</div>
          <div className="cake-container">
            {/* Floating sparkles */}
            <div className="cake-sparkles">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="cake-sparkle-dot" />
              ))}
            </div>
            {/* Star topper */}
            <div className="cake-topper">⭐</div>
            <div className="cake">
              {/* Candles — 7 for a grander look */}
              <div className="candles-row">
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={`candle candle-${i}`}>
                    <div className={`flame ${cakeCut ? 'blown' : ''}`}>
                      <div className="flame-inner" />
                    </div>
                    <div className="candle-stick" />
                  </div>
                ))}
              </div>
              {/* Cake layers */}
              <div className="cake-top" />
              <div className="cake-middle" />
              <div className="cake-bottom" />
              <div className="cake-plate" />
              {/* Drips — 6 drips across tiers */}
              <div className="cake-drip drip-1" />
              <div className="cake-drip drip-2" />
              <div className="cake-drip drip-3" />
              <div className="cake-drip drip-4" />
              <div className="cake-drip drip-5" />
              <div className="cake-drip drip-6" />
              {/* Fondant roses */}
              <div className="cake-rose rose-1" />
              <div className="cake-rose rose-2" />
              <div className="cake-rose rose-3" />
              <div className="cake-rose rose-4" />
              <div className="cake-rose rose-5" />
              {/* Sprinkles */}
              <div className="cake-sprinkles">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`sprinkle sprinkle-${i+1}`} />
                ))}
              </div>
              {/* Birthday text */}
              <div className="cake-text">Fakeha 🎂</div>
              {/* Cherries */}
              <div className="cake-cherry cherry-1" />
              <div className="cake-cherry cherry-2" />
              <div className="cake-cherry cherry-3" />
            </div>
            {/* Knife animation when cut */}
            {cakeCut && <div className="cake-knife">🔪</div>}
          </div>
          <p className="cake-hint">{cakeHint}</p>
        </div>
      )}

      <button ref={btnRef} className="next-btn" style={{ display: 'none' }} onClick={onContinue}>
        Continue ⟶
      </button>
    </div>
  );
}
