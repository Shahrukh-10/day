'use client';

import { useEffect, useRef, useCallback } from 'react';

interface GlobePageProps {
  onFound: () => void;
}

const birthdayPins = [
  { name: 'Sarah', city: 'New York', lat: 40.7, lon: -74.0, icon: '🎂', target: false },
  { name: 'Carlos', city: 'São Paulo', lat: -23.5, lon: -46.6, icon: '🎈', target: false },
  { name: 'Emma', city: 'London', lat: 51.5, lon: -0.1, icon: '🎂', target: false },
  { name: 'Yuki', city: 'Tokyo', lat: 35.7, lon: 139.7, icon: '🎉', target: false },
  { name: 'Ahmed', city: 'Dubai', lat: 25.2, lon: 55.3, icon: '🎂', target: false },
  { name: 'Priya', city: 'Mumbai', lat: 19.1, lon: 72.9, icon: '🎈', target: false },
  { name: 'Chen', city: 'Beijing', lat: 39.9, lon: 116.4, icon: '🎉', target: false },
  { name: 'Fakeha', city: 'Kanpur', lat: 26.4, lon: 80.3, icon: '🎁', target: true },
  { name: 'Olga', city: 'Moscow', lat: 55.8, lon: 37.6, icon: '🎂', target: false },
  { name: 'Amara', city: 'Lagos', lat: 6.5, lon: 3.4, icon: '🎈', target: false },
  { name: 'Liam', city: 'Sydney', lat: -33.9, lon: 151.2, icon: '🎉', target: false },
  { name: 'Sofia', city: 'Paris', lat: 48.9, lon: 2.35, icon: '🎂', target: false },
];

const landmasses = [
  [[-34.8,20],[-33.5,22],[-32,24],[-31,26],[-30,28],[-29,30],[-27,32],[-26,33],[-25,33.5],[-23,35.5],[-20,35],[-17,37],[-15,40],[-12,41],[-10,42],[-8,43],[-5,42],[-3,41],[-1,42],[1,42],[3,43],[5,44],[7,44],[10,44],[11,47],[12,50],[13,48],[15,42],[17,40],[20,38],[23,36],[25,35],[28,34],[30,32.5],[32,32],[33,30],[35,12],[37,10],[36,2],[35,-5],[33,-8],[30,-10],[25,-14],[20,-17],[18,-17],[15,-17],[13,-16],[10,-15],[7,-12],[5,-10],[4,-5],[3,0],[2,5],[1,9],[0,9],[-1,9],[-3,10],[-5,12],[-7,13],[-10,14],[-12,14],[-15,12],[-17,12],[-20,13],[-22,14],[-25,15],[-27,15],[-30,17],[-32,18],[-34,18],[-34.8,20]],
  [[36,-6],[37,-8],[38,-9],[39,-9],[40,-9],[42,-9],[43,-9],[43.5,-8],[44,-2],[44.5,-1],[46,-1],[47,-2],[48,-5],[49,-4],[50,-5],[51,-5],[51,1],[52,1],[53,5],[54,8],[55,8],[55.5,9],[56,10],[56,12],[57,10],[58,12],[59,10],[60,5],[61,5],[62,5],[63,10],[64,14],[65,14],[66,14],[67,15],[68,16],[69,18],[70,20],[70,25],[71,28],[70,30],[69,30],[67,30],[65,30],[63,30],[62,30],[60,30],[59,28],[58,24],[57,20],[56,16],[55,14],[54,14],[53,12],[52,10],[51,7],[50,4],[49,3],[48,2],[47,3],[46,4],[45,4],[44,4],[43,3],[42,3],[41,1],[40,0],[39,-1],[38,0],[37,-2],[36,-6]],
  [[42,28],[43,32],[44,36],[45,40],[43,42],[41,44],[40,45],[39,47],[38,48],[37,50],[36,52],[35,52],[33,50],[31,49],[30,48],[28,52],[27,56],[26,56],[25,57],[24,55],[22,59],[21,60],[20,63],[19,60],[18,56],[16,53],[15,52],[13,48],[12,45],[10,44],[10,50],[9,55],[9,65],[8,77],[9,78],[10,76],[12,80],[14,80],[16,80],[18,74],[20,73],[22,72],[24,68],[26,70],[28,65],[30,70],[32,72],[34,72],[36,75],[38,75],[40,78],[42,80],[44,82],[46,86],[48,88],[50,88],[52,90],[54,92],[55,95],[53,98],[50,100],[48,102],[46,100],[44,103],[42,105],[40,108],[38,108],[36,110],[34,108],[32,106],[30,105],[28,107],[26,108],[24,110],[22,114],[20,112],[18,110],[16,108],[14,108],[12,108],[10,106],[8,104],[6,104],[4,104],[2,104],[0,105],[-2,106],[-4,106],[-6,108],[-8,110],[-8,114],[-7,115]],
  [[35.5,74],[34,74],[33,74],[32,75],[31,72],[30,70],[29,69],[28,68],[27,68],[26,68.5],[25,68],[24,68],[23,68.5],[22,69],[21,70],[20,72],[19.5,73],[19,73],[18,73],[17,73.5],[16,74],[15,74],[14,74.5],[13,75],[12,76],[11,76],[10,76],[9,76],[8,77],[8,77.5],[8.5,78],[9,78.5],[10,79.5],[11,80],[12,80],[13,80],[14,80],[15,80],[16,80.5],[17,81.5],[18,83],[19,85],[20,87],[21,87.5],[22,88],[23,88.5],[24,89],[25,89.5],[26,90],[27,89],[28,88],[29,86],[30,82],[31,80],[32,78],[33,76],[34,75],[35.5,74]],
  [[15,-90],[16,-88],[18,-88],[19,-87],[20,-87],[21,-84],[22,-80],[24,-80],[25,-80],[27,-80],[28,-82],[29,-84],[30,-85],[30,-88],[30,-90],[31,-92],[33,-95],[34,-95],[35,-95],[36,-93],[37,-91],[38,-90],[39,-88],[40,-85],[41,-83],[42,-82],[43,-79],[44,-78],[45,-74],[46,-72],[47,-70],[48,-68],[49,-66],[50,-65],[51,-62],[52,-60],[53,-60],[55,-60],[56,-60],[58,-63],[59,-64],[60,-65],[61,-66],[62,-68],[63,-68],[65,-68],[67,-70],[68,-72],[70,-80],[71,-85],[70,-95],[69,-100],[68,-105],[66,-110],[64,-115],[62,-120],[60,-120],[58,-122],[56,-125],[54,-125],[52,-125],[50,-125],[49,-124],[48,-124],[46,-124],[44,-124],[42,-124],[40,-124],[38,-122],[37,-120],[36,-118],[35,-118],[34,-117],[33,-117],[32,-117],[30,-115],[28,-112],[26,-110],[24,-110],[22,-105],[20,-102],[18,-102],[18,-96],[17,-93],[16,-92],[15,-90]],
  [[12,-72],[11,-70],[10,-67],[9,-65],[8,-63],[7,-60],[6,-57],[5,-55],[4,-52],[3,-50],[2,-50],[1,-50],[0,-50],[-1,-48],[-2,-44],[-3,-40],[-4,-38],[-5,-35],[-6,-35],[-8,-35],[-10,-37],[-12,-38],[-14,-39],[-15,-40],[-17,-39],[-18,-40],[-20,-40],[-22,-41],[-24,-42],[-25,-42],[-27,-44],[-28,-48],[-30,-50],[-32,-52],[-34,-54],[-36,-57],[-38,-58],[-40,-62],[-42,-63],[-44,-66],[-45,-68],[-47,-70],[-50,-72],[-52,-72],[-54,-70],[-55,-68],[-54,-68],[-52,-72],[-50,-74],[-48,-75],[-46,-74],[-44,-73],[-42,-73],[-40,-72],[-38,-70],[-36,-72],[-34,-72],[-32,-71],[-30,-70],[-28,-70],[-26,-70],[-24,-70],[-22,-70],[-20,-70],[-18,-70],[-16,-72],[-14,-75],[-12,-77],[-10,-77],[-8,-79],[-5,-80],[-3,-80],[-1,-78],[0,-78],[2,-78],[4,-77],[6,-76],[8,-72],[10,-72],[12,-72]],
  [[-12,130],[-13,132],[-14,130],[-15,129],[-16,126],[-17,123],[-18,122],[-19,120],[-20,119],[-21,116],[-22,114],[-24,114],[-25,114],[-27,114],[-28,114],[-29,115],[-31,115],[-32,115],[-33,116],[-34,118],[-35,120],[-35,125],[-35,130],[-35,135],[-35,137],[-36,140],[-37,142],[-38,145],[-38,148],[-37,150],[-36,151],[-35,151],[-33,152],[-31,153],[-29,153],[-28,153],[-26,152],[-25,152],[-23,151],[-21,149],[-19,147],[-18,146],[-16,146],[-15,145],[-14,142],[-13,136],[-12,133],[-12,130]],
  [[60,-45],[62,-42],[64,-40],[66,-37],[68,-33],[70,-28],[72,-25],[74,-20],[76,-20],[78,-22],[80,-25],[82,-30],[83,-35],[82,-42],[80,-50],[78,-56],[76,-60],[74,-62],[72,-58],[70,-55],[68,-52],[66,-50],[64,-48],[62,-46],[60,-45]],
  [[31,131],[33,131],[35,133],[36,136],[37,137],[38,139],[39,140],[40,140],[41,141],[42,142],[43,144],[44,145],[45,142],[43,140],[41,140],[39,140],[37,138],[35,135],[33,132],[31,131]],
  [[50,-5],[51,-5],[52,-3],[53,-1],[54,0],[55,-2],[56,-3],[57,-5],[58,-5],[58,-3],[57,-2],[56,0],[55,0],[54,1],[53,1],[52,1],[51,1],[50,0],[50,-5]],
  [[-12,49],[-14,48],[-16,46],[-18,45],[-20,44],[-22,44],[-24,45],[-25,47],[-23,48],[-21,49],[-19,50],[-17,50],[-15,50],[-13,49],[-12,49]]
];

export default function GlobePage({ onFound }: GlobePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintsRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const pinsOverlayRef = useRef<HTMLDivElement>(null);
  const giftRainRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const wrongCountRef = useRef(0);
  const pinElsRef = useRef<HTMLDivElement[]>([]);

  const G = useRef({
    cx: 0, cy: 0, radius: 0, rotX: 0.3, rotY: -0.5,
    zoom: 1, dragging: false, lastX: 0, lastY: 0, autoSpin: true
  });

  const showToast = useCallback((msg: string, duration = 2500) => {
    const toast = toastRef.current;
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), duration);
  }, []);

  const startGiftRain = useCallback(() => {
    const container = giftRainRef.current;
    if (!container) return;
    const emojis = ['🎁', '🎀', '🎂', '🎉', '🎊', '✨', '💝', '🌸', '🎈'];
    let count = 0;
    const iv = setInterval(() => {
      if (count >= 35) { clearInterval(iv); return; }
      const g = document.createElement('div');
      g.className = 'falling-gift';
      g.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      g.style.left = (Math.random() * 80 + 10) + '%';
      g.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
      g.style.animationDelay = (Math.random() * 0.2) + 's';
      container.appendChild(g);
      count++;
      setTimeout(() => g.remove(), 4000);
    }, 80);
  }, []);

  const handlePinTap = useCallback((index: number) => {
    if (doneRef.current) return;
    const pin = birthdayPins[index];
    const el = pinElsRef.current[index];
    if (!el) return;

    const wrongMessages = [
      "😢 Nobody made a gift for {name}.\nBut someone made one for you!",
      "🥺 No one built this for {name}.\nYours is special!",
      "💔 No one coded a surprise for {name}.\nUnlike you...",
      "😿 {name} got nothing.\nBut YOU did! Keep looking!",
      "🫠 Nobody animated 5 pages for {name}...\nbut someone did for Fakeha 👀"
    ];

    if (pin.target) {
      doneRef.current = true;
      el.classList.add('found');
      showToast("🎉 YES! This one's made just for you, Fakeha! 💝", 3500);
      pinElsRef.current.forEach(p => { p.style.pointerEvents = 'none'; });
      if (hintsRef.current) {
        hintsRef.current.style.transition = 'opacity 0.5s';
        hintsRef.current.style.opacity = '0';
      }
      setTimeout(() => startGiftRain(), 800);
      setTimeout(() => onFound(), 4000);
    } else {
      wrongCountRef.current++;
      el.classList.add('wrong');
      const msg = wrongMessages[Math.min(wrongCountRef.current - 1, wrongMessages.length - 1)]
        .replace('{name}', pin.name);
      showToast(msg, 2500);
      setTimeout(() => el.classList.remove('wrong'), 600);

      if (wrongCountRef.current === 3) {
        setTimeout(() => showToast('💡 Think about where Fakeha lives...', 3000), 1000);
      }
      if (wrongCountRef.current === 5) {
        setTimeout(() => showToast('🇮🇳 Try looking in India!', 3000), 1000);
      }
      if (wrongCountRef.current === 7) {
        setTimeout(() => showToast('📍 Uttar Pradesh... starts with K...', 3000), 1000);
      }
    }
  }, [showToast, startGiftRain, onFound]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pinsOverlay = pinsOverlayRef.current;
    if (!canvas || !pinsOverlay) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Create pin DOM elements
    pinElsRef.current = [];
    birthdayPins.forEach((pin, i) => {
      const el = document.createElement('div');
      el.className = 'bday-pin' + (pin.target ? ' target' : '') + ' hidden';
      el.innerHTML = `<span class="bday-pin-icon">${pin.icon}</span><span class="bday-pin-label">${pin.name} · ${pin.city}</span>`;
      el.addEventListener('click', (e) => { e.stopPropagation(); handlePinTap(i); });
      pinsOverlay.appendChild(el);
      pinElsRef.current.push(el);
    });

    const g = G.current;

    function deg2rad(lat: number, lon: number): [number, number] {
      return [lat * Math.PI / 180, lon * Math.PI / 180];
    }

    function project(lat: number, lon: number) {
      const x = Math.cos(lat) * Math.sin(lon + g.rotY);
      const y = Math.sin(lat) * Math.cos(g.rotX) - Math.cos(lat) * Math.sin(g.rotX) * Math.cos(lon + g.rotY);
      const z = Math.sin(lat) * Math.sin(g.rotX) + Math.cos(lat) * Math.cos(g.rotX) * Math.cos(lon + g.rotY);
      if (z < -0.05) return null;
      const r = g.radius * g.zoom;
      return { x: g.cx + x * r, y: g.cy - y * r, z };
    }

    // Stars
    const stars: { x: number; y: number; size: number; tw: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({ x: Math.random(), y: Math.random(), size: Math.random() * 1.5 + 0.5, tw: Math.random() * Math.PI * 2 });
    }

    function drawStars(t: number) {
      for (const s of stars) {
        ctx!.fillStyle = `rgba(255,255,255,${0.3 + 0.4 * Math.sin(t * 0.001 + s.tw)})`;
        ctx!.beginPath(); ctx!.arc(s.x * canvas!.width, s.y * canvas!.height, s.size, 0, Math.PI * 2); ctx!.fill();
      }
    }

    function drawGlobe() {
      const r = g.radius * g.zoom;
      const grad = ctx!.createRadialGradient(g.cx - r * 0.2, g.cy - r * 0.2, r * 0.1, g.cx, g.cy, r);
      grad.addColorStop(0, 'rgba(15,30,60,1)'); grad.addColorStop(0.7, 'rgba(8,20,45,1)'); grad.addColorStop(1, 'rgba(5,12,30,1)');
      ctx!.beginPath(); ctx!.arc(g.cx, g.cy, r, 0, Math.PI * 2); ctx!.fillStyle = grad; ctx!.fill();
      const atmo = ctx!.createRadialGradient(g.cx, g.cy, r * 0.95, g.cx, g.cy, r * 1.15);
      atmo.addColorStop(0, 'rgba(0,201,167,0.08)'); atmo.addColorStop(0.5, 'rgba(0,201,167,0.03)'); atmo.addColorStop(1, 'transparent');
      ctx!.beginPath(); ctx!.arc(g.cx, g.cy, r * 1.15, 0, Math.PI * 2); ctx!.fillStyle = atmo; ctx!.fill();
      ctx!.lineWidth = 0.4;
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx!.strokeStyle = lat === 0 ? 'rgba(0,201,167,0.12)' : 'rgba(0,201,167,0.04)';
        ctx!.beginPath(); let st = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const pt = project(lat * Math.PI / 180, lon * Math.PI / 180);
          if (pt) { if (!st) { ctx!.moveTo(pt.x, pt.y); st = true; } else ctx!.lineTo(pt.x, pt.y); } else st = false;
        } ctx!.stroke();
      }
      for (let lon2 = -180; lon2 < 180; lon2 += 20) {
        ctx!.strokeStyle = lon2 === 0 ? 'rgba(0,201,167,0.12)' : 'rgba(0,201,167,0.04)';
        ctx!.beginPath(); let st2 = false;
        for (let lat2 = -90; lat2 <= 90; lat2 += 3) {
          const pt2 = project(lat2 * Math.PI / 180, lon2 * Math.PI / 180);
          if (pt2) { if (!st2) { ctx!.moveTo(pt2.x, pt2.y); st2 = true; } else ctx!.lineTo(pt2.x, pt2.y); } else st2 = false;
        } ctx!.stroke();
      }
      for (const land of landmasses) {
        ctx!.beginPath(); let fp = true; let vis = false; let cnt = 0;
        for (const pt of land) {
          const c = deg2rad(pt[0], pt[1]); const p = project(c[0], c[1]);
          if (p) { vis = true; cnt++; if (fp) { ctx!.moveTo(p.x, p.y); fp = false; } else ctx!.lineTo(p.x, p.y); }
        }
        if (vis && cnt > 2) {
          ctx!.closePath();
          ctx!.fillStyle = 'rgba(34, 197, 158, 0.18)'; ctx!.fill();
          ctx!.strokeStyle = 'rgba(0, 201, 167, 0.4)'; ctx!.lineWidth = 0.8; ctx!.stroke();
          ctx!.fillStyle = 'rgba(52, 211, 153, 0.05)'; ctx!.fill();
        }
      }
      const spec = ctx!.createRadialGradient(g.cx - r * 0.3, g.cy - r * 0.3, 0, g.cx - r * 0.3, g.cy - r * 0.3, r * 0.6);
      spec.addColorStop(0, 'rgba(255,255,255,0.06)'); spec.addColorStop(1, 'transparent');
      ctx!.beginPath(); ctx!.arc(g.cx, g.cy, r, 0, Math.PI * 2); ctx!.fillStyle = spec; ctx!.fill();
      ctx!.beginPath(); ctx!.arc(g.cx, g.cy, r, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(0,201,167,0.15)'; ctx!.lineWidth = 1.5; ctx!.stroke();
    }

    function updatePins() {
      for (let i = 0; i < birthdayPins.length; i++) {
        const pin = birthdayPins[i];
        const el = pinElsRef.current[i];
        if (!el) continue;
        const c = deg2rad(pin.lat, pin.lon);
        const pt = project(c[0], c[1]);
        if (pt && pt.z > 0.1) {
          el.classList.remove('hidden');
          el.style.left = pt.x + 'px';
          el.style.top = pt.y + 'px';
          const scale = 0.6 + pt.z * 0.5;
          el.style.transform = `translate(-50%, -100%) scale(${scale})`;
          el.style.zIndex = String(Math.round(pt.z * 100));
        } else {
          el.classList.add('hidden');
        }
      }
    }

    // Pointer events
    const onPointerDown = (e: PointerEvent) => {
      if (doneRef.current) return;
      g.dragging = true; g.lastX = e.clientX; g.lastY = e.clientY;
      g.autoSpin = false;
      canvas!.setPointerCapture(e.pointerId);
      if (hintsRef.current && hintsRef.current.style.opacity !== '0') {
        hintsRef.current.classList.add('fading');
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!g.dragging || doneRef.current) return;
      const dx = e.clientX - g.lastX, dy = e.clientY - g.lastY;
      g.rotY += dx * 0.005; g.rotX -= dy * 0.005;
      g.rotX = Math.max(-1.2, Math.min(1.2, g.rotX));
      g.lastX = e.clientX; g.lastY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (doneRef.current) return;
      g.dragging = false; canvas!.releasePointerCapture(e.pointerId);
    };

    const onWheel = (e: WheelEvent) => {
      if (doneRef.current) return;
      e.preventDefault();
      g.zoom = Math.max(0.8, Math.min(4, g.zoom - e.deltaY * 0.002));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // Timed hints
    const t1 = setTimeout(() => { if (!doneRef.current) showToast('🔍 Tap the birthday pins to check!', 3000); }, 8000);
    const t2 = setTimeout(() => { if (!doneRef.current) showToast('🤔 Which country could Fakeha be in?', 3000); }, 20000);
    const t3 = setTimeout(() => { if (!doneRef.current) showToast('🌏 Try spinning towards Asia...', 3000); }, 35000);
    const t4 = setTimeout(() => { if (!doneRef.current) showToast('🇮🇳 Look for a 🎁 pin near India!', 3500); }, 50000);
    const t5 = setTimeout(() => {
      if (doneRef.current) return;
      showToast("🗺️ Let me show you!", 2000);
      g.autoSpin = false;
      const tLat = 26.4 * Math.PI / 180;
      const tLon = -(80.3 * Math.PI / 180);
      const sRX = g.rotX, sRY = g.rotY, sZ = g.zoom;
      const start = Date.now();
      function flyStep() {
        const p = Math.min(1, (Date.now() - start) / 2500);
        const ep = 1 - Math.pow(1 - p, 3);
        g.rotX = sRX + (tLat - sRX) * ep;
        g.rotY = sRY + (tLon - sRY) * ep;
        g.zoom = sZ + (2.5 - sZ) * ep;
        if (p < 1) requestAnimationFrame(flyStep);
        else {
          setTimeout(() => {
            if (!doneRef.current) {
              const idx = birthdayPins.findIndex(p => p.target);
              handlePinTap(idx);
            }
          }, 2000);
        }
      }
      requestAnimationFrame(flyStep);
    }, 60000);

    let animId: number;
    function render(t: number) {
      if (doneRef.current && giftRainRef.current && giftRainRef.current.children.length === 0) return;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      g.cx = canvas!.width / 2; g.cy = canvas!.height / 2;
      g.radius = Math.min(canvas!.width, canvas!.height) * 0.32;
      if (g.autoSpin && !g.dragging) g.rotY += 0.003;
      drawStars(t); drawGlobe(); updatePins();
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [handlePinTap, showToast]);

  return (
    <div className="globe-page active">
      <canvas id="globeCanvas" ref={canvasRef}></canvas>
      <div className="globe-hints" ref={hintsRef}>
        <div className="globe-hint-top">
          <span className="hint-emoji">🌍</span>
          <span className="hint-text">Birthdays are happening all over the world...</span>
          <span className="hint-sub">Find Fakeha&apos;s! 🎂</span>
        </div>
        <div className="globe-hint-bottom">
          <span className="hint-action">👆 Spin the globe · Tap a 🎂 pin to check</span>
        </div>
      </div>
      <div className="globe-toast" ref={toastRef}></div>
      <div className="birthday-pins-overlay" ref={pinsOverlayRef}></div>
      <div className="gift-rain" ref={giftRainRef}></div>
    </div>
  );
}
