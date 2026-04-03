'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { config } from '@/config';

const foodItems = [
  { label: '🍗 Malai Chicken', value: '🍗 Malai Chicken' },
  { label: '🔥 Tandoori', value: '🔥 Tandoori' },
  { label: '🥩 Barra', value: '🥩 Barra' },
  { label: '🍖 Keema', value: '🍖 Keema' },
  { label: '🥘 Kebab', value: '🥘 Kebab' },
  { label: '🍚 Biryani', value: '🍚 Biryani' },
  { label: '✨ Something else...', value: 'other' },
];

export default function ScratchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [hintText, setHintText] = useState('👆 Scratch with your finger!');
  const [showClaimBtn, setShowClaimBtn] = useState(false);
  const [showFoodPopup, setShowFoodPopup] = useState(false);
  const [selectedFood, setSelectedFood] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [showSendBtn, setShowSendBtn] = useState(false);

  const initedRef = useRef(false);

  // Initialize canvas — matches original vanilla JS implementation
  useEffect(() => {
    if (initedRef.current) return;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    initedRef.current = true;

    const ctxRaw = canvas.getContext('2d');
    if (!ctxRaw) return;
    const ctx = ctxRaw;
    const cvs = canvas;
    const crd = card;

    const gridCols = 20, gridRows = 13;
    const totalCells = gridCols * gridRows;
    const scratchGrid: boolean[] = [];
    for (let i = 0; i < totalCells; i++) scratchGrid.push(false);

    let scratchRevealed = false;
    let scratching = false;
    let tapCount = 0;

    function drawScratchSurface() {
      ctx.globalCompositeOperation = 'source-over';
      const grd = ctx.createLinearGradient(0, 0, cvs.width, cvs.height);
      grd.addColorStop(0, '#c0c0c0');
      grd.addColorStop(0.3, '#e8e8e8');
      grd.addColorStop(0.5, '#d4d4d4');
      grd.addColorStop(0.7, '#e8e8e8');
      grd.addColorStop(1, '#a0a0a0');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * cvs.width, Math.random() * cvs.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.5 + 0.3) + ')';
        ctx.fill();
      }
      ctx.font = 'bold ' + Math.floor(cvs.width * 0.08) + 'px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillText('Scratch Me!', cvs.width / 2, cvs.height / 2);
    }

    function getPos(e: MouseEvent | TouchEvent) {
      const rect = cvs.getBoundingClientRect();
      const touch = 'touches' in e ? e.touches[0] : e;
      const scaleX = cvs.width / rect.width;
      const scaleY = cvs.height / rect.height;
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }

    function scratch(x: number, y: number) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      markScratched(x, y);
    }

    function markScratched(x: number, y: number) {
      const col = Math.floor(x / cvs.width * gridCols);
      const row = Math.floor(y / cvs.height * gridRows);
      if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
        scratchGrid[row * gridCols + col] = true;
      }
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridCols) {
            scratchGrid[nr * gridCols + nc] = true;
          }
        }
      }
    }

    function doReveal() {
      scratchRevealed = true;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      cvs.style.display = 'none';
      setRevealed(true);
      setHintText('');
      setShowClaimBtn(true);
    }

    function checkReveal() {
      if (scratchRevealed) return;
      let scratched = 0;
      for (let i = 0; i < totalCells; i++) { if (scratchGrid[i]) scratched++; }
      const pct = scratched / totalCells;
      setHintText(Math.round(pct * 100) + '% scratched...');
      if (pct > 0.8) doReveal();
    }

    // Mouse events
    cvs.addEventListener('mousedown', function(e: MouseEvent) { scratching = true; tapCount++; const p = getPos(e); scratch(p.x, p.y); checkReveal(); });
    cvs.addEventListener('mousemove', function(e: MouseEvent) { if (scratching) { const p = getPos(e); scratch(p.x, p.y); checkReveal(); } });
    cvs.addEventListener('mouseup', function() { scratching = false; checkReveal(); });
    cvs.addEventListener('mouseleave', function() { scratching = false; });

    // Touch events
    cvs.addEventListener('touchstart', function(e: TouchEvent) { e.preventDefault(); scratching = true; tapCount++; const p = getPos(e); scratch(p.x, p.y); checkReveal(); }, { passive: false });
    cvs.addEventListener('touchmove', function(e: TouchEvent) { e.preventDefault(); if (scratching) { const p = getPos(e); scratch(p.x, p.y); checkReveal(); } }, { passive: false });
    cvs.addEventListener('touchend', function(e: TouchEvent) { e.preventDefault(); scratching = false; checkReveal(); }, { passive: false });

    // Fallback click reveal
    cvs.addEventListener('click', function() {
      if (!scratchRevealed && tapCount >= 20) doReveal();
    });

    // Size canvas
    let attempts = 0;
    const sizer = setInterval(function() {
      attempts++;
      const rect = crd.getBoundingClientRect();
      if (rect.width >= 10 && rect.height >= 10) {
        cvs.width = Math.round(rect.width);
        cvs.height = Math.round(rect.height);
        drawScratchSurface();
        clearInterval(sizer);
      } else if (attempts > 50) {
        clearInterval(sizer);
      }
    }, 100);

    window.addEventListener('resize', function() {
      if (!scratchRevealed) {
        const rect = crd.getBoundingClientRect();
        if (rect.width >= 10) {
          cvs.width = Math.round(rect.width);
          cvs.height = Math.round(rect.height);
          drawScratchSurface();
        }
      }
    });
  }, []);

  const handleFoodSelect = useCallback((value: string) => {
    if (value === 'other') {
      setShowCustom(true);
      setSelectedFood('');
      setShowSendBtn(false);
    } else {
      setShowCustom(false);
      setCustomValue('');
      setSelectedFood(value);
      setShowSendBtn(true);
    }
  }, []);

  const handleCustomInput = useCallback((val: string) => {
    setCustomValue(val);
    if (val.trim().length > 0) {
      setSelectedFood(val.trim());
      setShowSendBtn(true);
    } else {
      setSelectedFood('');
      setShowSendBtn(false);
    }
  }, []);

  const handleSend = useCallback(() => {
    if (!selectedFood) return;
    const msg = `I want ${selectedFood} \n\n`;
    const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
  }, [selectedFood]);

  return (
    <div className="scratch-page active">
      <div className="scratch-content">
        <h1 className="scratch-title">🎁 You&apos;ve Got a Gift!</h1>
        <p className="scratch-subtitle">Scratch to reveal your surprise...</p>
        <div className="scratch-card-wrapper">
          <div className="scratch-card" ref={cardRef}>
            <canvas className="scratch-canvas" ref={canvasRef} style={revealed ? { display: 'none' } : {}}></canvas>
            <div className="scratch-reveal">
              <div className="scratch-gift-emoji">🎁🎉🎂</div>
              <h2 className="scratch-gift-text">Claim Your Gift!</h2>
              <p className="scratch-gift-sub">Message him to get it 🎁</p>
            </div>
          </div>
        </div>
        {hintText && <p className="scratch-hint">{hintText}</p>}
        {showClaimBtn && (
          <button className="treat-btn scratch-claim-btn" onClick={() => setShowFoodPopup(true)}>
            <span className="treat-btn-emoji">🎁</span>
            <span className="treat-btn-text">Claim Now!</span>
          </button>
        )}
      </div>

      {/* Food Selection Popup */}
      <div className="food-popup-overlay" style={{ display: showFoodPopup ? 'flex' : 'none' }}>
        <div className="food-popup">
          <h2 className="food-popup-title">🍽️ What do you want to eat?</h2>
          <p className="food-popup-sub">Birthday girl&apos;s choice! Pick your treat 👇</p>
          <div className="food-options">
            {foodItems.map((item, i) => (
              <button
                key={i}
                className={`food-option${item.value === 'other' ? ' food-option-other' : ''}${selectedFood === item.value ? ' selected' : ''}`}
                onClick={() => handleFoodSelect(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {showCustom && (
            <div className="food-custom-wrap" style={{ display: 'block' }}>
              <input
                type="text"
                className="food-custom-input"
                placeholder="Type what you want..."
                maxLength={100}
                value={customValue}
                onChange={e => handleCustomInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && selectedFood) handleSend(); }}
                autoFocus
              />
            </div>
          )}
          {showSendBtn && (
            <button className="treat-btn food-send-btn" onClick={handleSend}>
              <span className="treat-btn-emoji">📱</span>
              <span className="treat-btn-text">Claim My Treat! 🤤</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
