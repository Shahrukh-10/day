'use client';

import { useEffect, useRef, useCallback } from 'react';

interface CountdownPageProps {
  onTimerDone: () => void;
  onGiftClick: () => void;
  timerDone: boolean;
}

export default function CountdownPage({ onTimerDone, onGiftClick, timerDone }: CountdownPageProps) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const nopeRef = useRef<HTMLSpanElement>(null);
  const timerDoneRef = useRef(timerDone);
  const confettiInstRef = useRef<unknown>(null);

  const dayTopRef = useRef<HTMLDivElement>(null);
  const hourTopRef = useRef<HTMLDivElement>(null);
  const minuteTopRef = useRef<HTMLDivElement>(null);
  const secondTopRef = useRef<HTMLDivElement>(null);

  const nopePhrases = [
    'Not yet! 😜', 'Wait for it! ⏳', 'Patience! 🤭', 'Nice try! 😂',
    'Nope! 🙈', 'Almost there! 💫', "Can't catch me! 🏃", 'Too early! ⏰',
    'Haha no! 😝', 'Shhh wait! 🤫', 'Zenitsu says NO! ⚡', 'Not so fast! 🗡️'
  ];

  useEffect(() => {
    timerDoneRef.current = timerDone;
  }, [timerDone]);

  // Background particles
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 15 + 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      container.appendChild(p);
    }
  }, []);

  // Confetti
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/day/confetti.min.js';
    script.onload = () => {
      const win = window as unknown as { ConfettiGenerator: new (opts: Record<string, unknown>) => { render: () => void; clear: () => void } };
      if (win.ConfettiGenerator) {
        const inst = new win.ConfettiGenerator({ target: 'confetti' });
        inst.render();
        confettiInstRef.current = inst;
      }
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
      const inst = confettiInstRef.current as { clear?: () => void } | null;
      if (inst?.clear) inst.clear();
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const dayMs = hour * 24;
    const birthdate = 'April 4, 2026';
    const countDown = new Date(birthdate + ' 00:00:00').getTime();

    function tick() {
      const now = new Date().getTime();
      const distance = countDown - now;

      if (distance > 0) {
        if (dayTopRef.current) dayTopRef.current.textContent = String(Math.floor(distance / dayMs));
        if (hourTopRef.current) hourTopRef.current.textContent = String(Math.floor((distance % dayMs) / hour));
        if (minuteTopRef.current) minuteTopRef.current.textContent = String(Math.floor((distance % hour) / minute));
        if (secondTopRef.current) secondTopRef.current.textContent = String(Math.floor((distance % minute) / second));
      } else {
        if (dayTopRef.current) dayTopRef.current.textContent = '0';
        if (hourTopRef.current) hourTopRef.current.textContent = '0';
        if (minuteTopRef.current) minuteTopRef.current.textContent = '0';
        if (secondTopRef.current) secondTopRef.current.textContent = '0';
        onTimerDone();
      }
    }

    tick();
    const interval = setInterval(tick, second);

    return () => clearInterval(interval);
  }, [onTimerDone]);

  const dodgeGift = useCallback(() => {
    if (timerDoneRef.current) return;
    const el = teaserRef.current;
    const nope = nopeRef.current;
    if (!el || !nope) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 20;
    const boxW = Math.min(100, vw * 0.25);
    const boxH = Math.min(100, vh * 0.15);
    const randX = margin + Math.random() * (vw - boxW - margin * 2);
    const randY = margin + Math.random() * (vh - boxH - margin * 2);
    el.classList.add('dodging');
    el.style.left = randX + 'px';
    el.style.bottom = 'auto';
    el.style.top = randY + 'px';
    el.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
    const phrase = nopePhrases[Math.floor(Math.random() * nopePhrases.length)];
    nope.textContent = phrase;
    nope.classList.add('show');
    setTimeout(() => nope.classList.remove('show'), 1200);
  }, [nopePhrases]);

  const handleGiftClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchend') {
      e.preventDefault(); // prevent ghost click on touch devices
    }
    if (timerDoneRef.current) {
      onGiftClick();
    } else {
      dodgeGift();
    }
  }, [onGiftClick, dodgeGift]);

  return (
    <>
      <div className="bg-particles" ref={particlesRef}></div>
      <canvas id="confetti"></canvas>

      <div className="container">
        <h1>✨ Countdown to the day ✨</h1>
        <ul className="flip-clock">
          <li>
            <div className="time-card">
              <div className="flip-unit">
                <div className="flip-top" ref={dayTopRef}>0</div>
              </div>
              <p>Days</p>
            </div>
          </li>
          <li>
            <div className="time-card">
              <div className="flip-unit">
                <div className="flip-top" ref={hourTopRef}>0</div>
              </div>
              <p>Hours</p>
            </div>
          </li>
          <li>
            <div className="time-card">
              <div className="flip-unit">
                <div className="flip-top" ref={minuteTopRef}>0</div>
              </div>
              <p>Minutes</p>
            </div>
          </li>
          <li>
            <div className="time-card">
              <div className="flip-unit">
                <div className="flip-top" ref={secondTopRef}>0</div>
              </div>
              <p>Seconds</p>
            </div>
          </li>
        </ul>

        <div
          className="teaser-gift"
          ref={teaserRef}
          onClick={handleGiftClick}
          onTouchEnd={handleGiftClick}
        >
          <span className="nope-text" ref={nopeRef}></span>
          <span className="gift-emoji">🎁</span>
          <span className="gift-label">
            {timerDone ? 'Open me! 🎉' : 'Open me?'}
          </span>
        </div>
      </div>
    </>
  );
}
