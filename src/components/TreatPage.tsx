'use client';

import { useEffect, useRef } from 'react';
import { config } from '@/config';

export default function TreatPage() {
  const emojisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = emojisRef.current;
    if (!container) return;
    const emojis = container.querySelectorAll<HTMLElement>('.treat-emoji');
    const intervals: ReturnType<typeof setInterval>[] = [];
    emojis.forEach((emoji) => {
      const iv = setInterval(() => {
        emoji.style.left = Math.random() * 80 + 10 + '%';
        emoji.style.top = Math.random() * 60 + 10 + '%';
      }, 2000 + Math.random() * 2000);
      intervals.push(iv);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  const handleTreat = () => {
    const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.treatMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="treat-page active">
      <div className="treat-emojis" ref={emojisRef}>
        <span className="treat-emoji" style={{ left: '10%', top: '15%' }}>🎂</span>
        <span className="treat-emoji" style={{ left: '75%', top: '20%' }}>🍕</span>
        <span className="treat-emoji" style={{ left: '30%', top: '60%' }}>🍦</span>
        <span className="treat-emoji" style={{ left: '65%', top: '70%' }}>🧁</span>
        <span className="treat-emoji" style={{ left: '20%', top: '40%' }}>🍰</span>
        <span className="treat-emoji" style={{ left: '80%', top: '45%' }}>🍫</span>
        <span className="treat-emoji" style={{ left: '50%', top: '25%' }}>🎉</span>
        <span className="treat-emoji" style={{ left: '40%', top: '80%' }}>🍩</span>
      </div>
      <div className="treat-content">
        <h1 className="treat-title">Wait wait wait... 🤚</h1>
        <p className="treat-subtitle">You thought this was free? 😜</p>
        <p className="treat-text">All these beautiful memories, the effort, the animations...</p>
        <p className="treat-demand">Time to pay up! 🎂🍕🍦</p>
        <button className="treat-btn" onClick={handleTreat}>
          <span className="treat-btn-emoji">🎁</span>
          <span className="treat-btn-text">I Want My Treat!</span>
        </button>
        <p className="treat-hint">👆 This sends a WhatsApp message. No escaping!</p>
      </div>
    </div>
  );
}
