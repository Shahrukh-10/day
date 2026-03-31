'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '@/config';

interface MessagePageProps {
  onContinue: () => void;
}

export default function MessagePage({ onContinue }: Readonly<MessagePageProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messageTextRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const touchStartXRef = useRef(0);
  const [typingDone, setTypingDone] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleCard = useCallback(() => {
    if (!typingDone) return;
    setIsFlipped(prev => !prev);
  }, [typingDone]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!typingDone) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      setIsFlipped(diff < 0);
    }
  }, [typingDone]);

  // Sakura petals
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const petals: { x: number; y: number; size: number; speedX: number; speedY: number; rotation: number; rotSpeed: number; opacity: number; wobble: number; wobbleSpeed: number }[] = [];
    for (let i = 0; i < 25; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 6,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.02 - 0.01,
        opacity: Math.random() * 0.5 + 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01
      });
    }

    let animId: number;
    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      petals.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        if (p.y > canvas!.height + 20) { p.y = -20; p.x = Math.random() * canvas!.width; }
        if (p.x > canvas!.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas!.width + 20;

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = '#ffb7c5';
        ctx!.beginPath();
        ctx!.moveTo(0, 0);
        ctx!.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size);
        ctx!.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
        ctx!.fill();
        ctx!.restore();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  }, []);

  // Typewriter
  useEffect(() => {
    const el = messageTextRef.current;
    if (!el) return;
    const fullText = config.birthdayMessage;
    let charIndex = 0;
    setTypingDone(false);
    setIsFlipped(false);
    el.innerHTML = '';

    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        const char = fullText[charIndex];
        el.innerHTML += char === '\n' ? '<br>' : char;
        charIndex++;
        const card = document.getElementById('messageCard');
        if (card) card.scrollTop = card.scrollHeight;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setTypingDone(true);
          if (btnRef.current) btnRef.current.style.display = 'block';
        }, 500);
      }
    }, 40);

    return () => {
      clearInterval(typeInterval);
      el.innerHTML = '';
    };
  }, []);

  return (
    <div className="message-page active">
      <canvas id="sakuraCanvas" ref={canvasRef}></canvas>
      <div className="message-content">
        <div className="message-envelope">
          <div className="envelope-flap"></div>
          <div className="envelope-body">
            <div
              className={`message-card-shell ${isFlipped ? 'flipped' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="message-card-face message-card-front message-card" id="messageCard">
                <div className="message-text" ref={messageTextRef}></div>
                <div className={`message-signature ${typingDone ? 'visible' : ''}`}>
                  {/* <span>With love,</span>
                  <span className="signature-heart">❤</span> */}
                </div>
              </div>

              <div className="message-card-face message-card-back">
                <div className="private-note-block">
                  <span className="private-note-label">A little note for you</span>
                  <p className="private-note-text">{config.personalMessage}</p>
                </div>
              </div>
            </div>

            {typingDone && (
              <button type="button" className="card-swipe-hint" onClick={toggleCard}>
                {isFlipped ? 'Turn the card back' : 'Swipe to turn the card'}
              </button>
            )}
          </div>
        </div>
      </div>
      <button ref={btnRef} className="next-btn" style={{ display: 'none' }} onClick={onContinue}>
        Open Your Gift ⟶
      </button>
    </div>
  );
}
