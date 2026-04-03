'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface MemoriesPageProps {
  onBack: () => void;
  onNext: () => void;
  onSpecialMemoryModalToggle: (isOpen: boolean) => void;
}

const memories = [
  { src: '/day/media/img1.jpeg', caption: 'A beautiful moment', date: '2025' },
  { src: '/day/media/img2.jpeg', caption: 'Cherished memories', date: '2025' },
  { src: '/day/media/img3.jpeg', caption: 'Together forever', date: '2025' },
  { src: '/day/media/img4.jpeg', caption: 'Golden times', date: '2025' },
  { src: '/day/media/img5.jpeg', caption: 'Precious smiles', date: '2025' },
];

const instaMemories = [
  { src: '/day/insta_memories/7_post_may2020.jpg', type: 'image' as const, date: 'May 2020', caption: 'Where it all began...', year: '2020' },
  { src: '/day/insta_memories/6_post_jun2020.jpg', type: 'image' as const, date: 'June 2020', caption: 'Summer vibes', year: '2020' },
  { src: '/day/insta_memories/5_post_jul2020.jpg', type: 'image' as const, date: 'July 2020', caption: 'Shining bright', year: '2020' },
  { src: '/day/insta_memories/4_post_feb2021.jpg', type: 'image' as const, date: 'February 2021', caption: 'Growing together', year: '2021' },
  { src: '/day/insta_memories/3_post_may2021.jpg', type: 'image' as const, date: 'May 2021', caption: 'New chapters', year: '2021' },
  { src: '/day/insta_memories/2_post_dec2023.jpg', type: 'image' as const, date: 'December 2023', caption: 'Cherished moment', year: '2023' },
  { src: '/day/insta_memories/1_reel_video.mp4', type: 'video' as const, date: 'A Special Reel', caption: 'Our story continues...', year: '✨' },
];

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function MemoriesPage({ onBack, onNext, onSpecialMemoryModalToggle }: Readonly<MemoriesPageProps>) {
  // --- Cinematic Reel State ---
  const [showReel, setShowReel] = useState(true);
  const [reelPhase, setReelPhase] = useState<'intro' | 'playing' | 'outro'>('intro');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'enter' | 'exit'>('enter');
  const [reelExiting, setReelExiting] = useState(false);
  const reelVideoRef = useRef<HTMLVideoElement>(null);
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const bokehCreated = useRef(false);
  const [showFaltuPopup, setShowFaltuPopup] = useState(false);
  const [faltuExiting, setFaltuExiting] = useState(false);
  const [buttonsSwapped, setButtonsSwapped] = useState(false);
  const swapCountRef = useRef(0);

  // --- Regular Memories State ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const petalsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const specialAudioRef = useRef<HTMLAudioElement>(null);
  const [playBtnHidden, setPlayBtnHidden] = useState(false);
  const [specialMemoryOpen, setSpecialMemoryOpen] = useState(false);
  const touchStartX = useRef(0);
  const pageRef = useRef<HTMLDivElement>(null);

  const handleActionKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }, []);

  const transitionReelSlide = useCallback((direction: -1 | 1, delay = 300) => {
    setSlideDirection('exit');
    setTimeout(() => {
      setCurrentSlide(prev => prev + direction);
      setSlideDirection('enter');
    }, delay);
  }, []);

  const advanceReelSlide = useCallback((delay = 300) => {
    if (currentSlide >= instaMemories.length - 1) {
      setReelPhase('outro');
      return;
    }

    transitionReelSlide(1, delay);
  }, [currentSlide, transitionReelSlide]);

  // --- Cinematic Reel Logic ---

  // Create bokeh particles
  useEffect(() => {
    if (!showReel || bokehCreated.current) return;
    const container = reelContainerRef.current;
    if (!container) return;
    bokehCreated.current = true;

    const bokehLayer = document.createElement('div');
    bokehLayer.className = 'reel-bokeh-layer';
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.className = 'reel-bokeh-dot';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      const size = Math.random() * 60 + 20;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.animationDuration = (Math.random() * 8 + 6) + 's';
      dot.style.animationDelay = (Math.random() * 5) + 's';
      dot.style.opacity = String(Math.random() * 0.15 + 0.03);
      bokehLayer.appendChild(dot);
    }
    container.appendChild(bokehLayer);
  }, [showReel]);

  // Intro → playing transition
  useEffect(() => {
    if (!showReel || reelPhase !== 'intro') return;
    const timer = setTimeout(() => setReelPhase('playing'), 2800);
    return () => clearTimeout(timer);
  }, [showReel, reelPhase]);

  // Auto-advance slides
  useEffect(() => {
    if (!showReel || reelPhase !== 'playing') return;
    const item = instaMemories[currentSlide];
    if (item.type === 'video') return; // video advances on end

    const displayTime = 5000;
    const exitTime = displayTime - 800;

    const exitTimer = setTimeout(() => setSlideDirection('exit'), exitTime);
    const advanceTimer = setTimeout(() => {
      if (currentSlide < instaMemories.length - 1) {
        setCurrentSlide(prev => prev + 1);
        setSlideDirection('enter');
      } else {
        setReelPhase('outro');
      }
    }, displayTime);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(advanceTimer);
    };
  }, [currentSlide, showReel, reelPhase]);

  // Auto-play video
  useEffect(() => {
    if (!showReel || reelPhase !== 'playing') return;
    const vid = reelVideoRef.current;
    if (vid && instaMemories[currentSlide].type === 'video') {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  }, [currentSlide, showReel, reelPhase]);

  const handleVideoEnd = useCallback(() => {
    advanceReelSlide(800);
  }, [advanceReelSlide]);

  // Outro → faltu popup transition
  useEffect(() => {
    if (reelPhase !== 'outro') return;
    const timer = setTimeout(() => {
      setReelExiting(true);
      setTimeout(() => {
        setShowReel(false);
        setReelExiting(false);
        setShowFaltuPopup(true);
      }, 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, [reelPhase]);

  // Faltu popup → memories transition
  const dismissFaltuPopup = useCallback(() => {
    setFaltuExiting(true);
    setTimeout(() => {
      setShowFaltuPopup(false);
      setFaltuExiting(false);
    }, 600);
  }, []);

  // Tap to skip
  const handleReelTap = useCallback((e: React.MouseEvent) => {
    if (reelPhase === 'intro') {
      setReelPhase('playing');
      return;
    }
    if (reelPhase !== 'playing') return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const tapX = e.clientX - rect.left;

    if (tapX < rect.width * 0.3 && currentSlide > 0) {
      transitionReelSlide(-1);
      return;
    }

    advanceReelSlide();
  }, [advanceReelSlide, currentSlide, reelPhase, transitionReelSlide]);

  const handleSkipAll = useCallback(() => {
    setReelExiting(true);
    setTimeout(() => {
      setShowReel(false);
      setReelExiting(false);
      setShowFaltuPopup(true);
    }, 800);
  }, []);

  const handleFaltuSkip = useCallback(() => {
    if (swapCountRef.current >= 10) {
      dismissFaltuPopup();
      return;
    }
    swapCountRef.current += 1;
    setButtonsSwapped(prev => !prev);
  }, [dismissFaltuPopup]);

  // --- Regular Memories Logic ---
  useEffect(() => {
    if (showReel || showFaltuPopup) return;
    const container = petalsRef.current;
    if (!container) return;
    const petalEmojis = ['🌸', '🎀', '✨', '💮'];
    for (let i = 0; i < 15; i++) {
      const petal = document.createElement('div');
      petal.className = 'floating-petal';
      petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
      petal.style.left = Math.random() * 100 + '%';
      petal.style.fontSize = (Math.random() * 16 + 10) + 'px';
      petal.style.animationDuration = (Math.random() * 10 + 8) + 's';
      petal.style.animationDelay = (Math.random() * 8) + 's';
      petal.style.opacity = String(Math.random() * 0.4 + 0.1);
      container.appendChild(petal);
    }
  }, [showReel, showFaltuPopup]);

  useEffect(() => {
    if (showReel || showFaltuPopup) return;
    const page = pageRef.current;
    if (!page) return;
    const cards = page.querySelectorAll('.memory-card');
    if ('IntersectionObserver' in globalThis) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      cards.forEach((card, i) => {
        (card as HTMLElement).style.transitionDelay = (i * 0.12) + 's';
        observer.observe(card);
      });
      return () => observer.disconnect();
    } else {
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 150);
      });
    }
  }, [showReel, showFaltuPopup]);

  const handlePlayBtn = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      video.play();
      setPlayBtnHidden(true);
    } else {
      video.pause();
      setPlayBtnHidden(false);
    }
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const openSpecialMemory = useCallback(() => {
    setSpecialMemoryOpen(true);
  }, []);

  const closeSpecialMemory = useCallback(() => {
    const audio = specialAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setSpecialMemoryOpen(false);
  }, []);

  useEffect(() => {
    onSpecialMemoryModalToggle(specialMemoryOpen);

    if (!specialMemoryOpen) {
      return;
    }

    const audio = specialAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    return () => {
      onSpecialMemoryModalToggle(false);
    };
  }, [onSpecialMemoryModalToggle, specialMemoryOpen]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setLightboxIndex(prev => (prev + 1) % memories.length);
      } else {
        setLightboxIndex(prev => (prev - 1 + memories.length) % memories.length);
      }
    }
  }, []);

  // ====== RENDER ======

  // Cinematic Memory Reel
  if (showReel) {
    const slide = instaMemories[currentSlide];
    return (
      <div className={`reel-overlay ${reelExiting ? 'exiting' : ''}`} ref={reelContainerRef}>
        {/* Film grain overlay */}
        <div className="reel-grain" />

        {/* Letterbox bars */}
        <div className="reel-letterbox top" />
        <div className="reel-letterbox bottom" />

        {/* Intro phase */}
        {reelPhase === 'intro' && (
          <div className="reel-intro">
            <div className="reel-intro-line" />
            <h2 className="reel-intro-title">A Journey Through Time</h2>
            <p className="reel-intro-sub">Fakeha&apos;s most precious moments</p>
            <div className="reel-intro-line" />
            <div className="reel-intro-years">2020 — 2023</div>
          </div>
        )}

        {/* Playing phase — slides */}
        {reelPhase === 'playing' && (
          <button
            type="button"
            className={`reel-slide ${slideDirection}`}
            onClick={handleReelTap}
            onKeyDown={(event) => handleActionKeyDown(event, advanceReelSlide)}
            key={slide.src}
            aria-label="Advance memory reel"
          >
            {/* Background blur */}
            <div className="reel-bg-blur">
              {slide.type === 'video' ? (
                <video src={slide.src} autoPlay playsInline muted loop className="reel-bg-media" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slide.src} alt="" className="reel-bg-media" />
              )}
            </div>

            {/* Polaroid frame */}
            <div className={`reel-polaroid ${currentSlide % 2 === 0 ? 'tilt-left' : 'tilt-right'}`}>
              <div className="reel-tape" />
              <div className="reel-photo-wrap">
                {slide.type === 'video' ? (
                  <video
                    ref={reelVideoRef}
                    src={slide.src}
                    autoPlay
                    playsInline
                    muted
                    className="reel-photo"
                    onEnded={handleVideoEnd}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.src} alt={slide.caption} className="reel-photo" />
                )}
              </div>
              <div className="reel-polaroid-bottom">
                <span className="reel-handwritten">{slide.caption}</span>
                <span className="reel-date-tag">{slide.date}</span>
              </div>
            </div>

            {/* Year badge */}
            <div className="reel-year-badge">{slide.year}</div>

            {/* Timeline dots */}
            <div className="reel-timeline">
              {instaMemories.map((item, i) => (
                <div key={item.src} className={`reel-dot ${i === currentSlide ? 'active' : ''} ${i < currentSlide ? 'done' : ''}`} />
              ))}
            </div>
          </button>
        )}

        {/* Outro phase */}
        {reelPhase === 'outro' && (
          <div className="reel-outro">
            <div className="reel-outro-hearts">✨✨✨</div>
            <h2 className="reel-outro-title">These little moments<br />make you so special</h2>
            <p className="reel-outro-sub">— Happy Birthday, Fakeha —</p>
          </div>
        )}

        {/* Skip button */}
        {reelPhase === 'playing' && (
          <button className="reel-skip-btn" onClick={handleSkipAll}>
            Skip →
          </button>
        )}
      </div>
    );
  }

  // Faltu Popup
  if (showFaltuPopup) {
    return (
      <div className={`faltu-popup-overlay ${faltuExiting ? 'exiting' : ''}`}>
        <div className="faltu-popup">
          <h2 className="faltu-title">Ab meri faltu ki memories dekho 😅</h2>
          <div className="faltu-btn-row">
            {buttonsSwapped ? (
              <>
                <button className="faltu-btn watch" onClick={dismissFaltuPopup}>Watch 👀</button>
                <button className="faltu-btn skip" onClick={handleFaltuSkip}>Skip →</button>
              </>
            ) : (
              <>
                <button className="faltu-btn skip" onClick={handleFaltuSkip}>Skip →</button>
                <button className="faltu-btn watch" onClick={dismissFaltuPopup}>Watch 👀</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular Memories Page
  return (
    <div className="memories-page active" ref={pageRef}>
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="floating-petals" ref={petalsRef}></div>

      <div className="memories-header">
        <h1 className="memories-title">🌸 Happy Birthday Fakeha 🌸</h1>
        <p className="memories-subtitle">Memories</p>
      </div>

      <div className="memories-grid">
        {memories.slice(0, 4).map((mem, i) => (
          <button
            type="button"
            key={mem.src}
            className="memory-card fade-in"
            onClick={() => openLightbox(i)}
            onKeyDown={(event) => handleActionKeyDown(event, () => openLightbox(i))}
            aria-label={`Open memory ${i + 1}`}
          >
            <img src={mem.src} alt={mem.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="card-caption">
              <span className="caption-text">{mem.caption}</span>
              <span className="caption-date">{mem.date}</span>
            </div>
            <div className="card-glow"></div>
          </button>
        ))}

        <div className="memory-card wide fade-in">
          <video ref={videoRef} src="/day/media/vid1.mp4" playsInline muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={() => { if (videoRef.current && !videoRef.current.paused) { videoRef.current.pause(); setPlayBtnHidden(false); } }}
            onEnded={() => setPlayBtnHidden(false)} />
          <button type="button" className={`play-btn ${playBtnHidden ? 'hidden' : ''}`} onClick={handlePlayBtn} aria-label="Play memory video">▶</button>
          <div className="card-glow"></div>
        </div>

        <button
          type="button"
          className="memory-card fade-in"
          onClick={() => openLightbox(4)}
          onKeyDown={(event) => handleActionKeyDown(event, () => openLightbox(4))}
          aria-label="Open memory 5"
        >
          <img src={memories[4].src} alt={memories[4].caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="card-caption">
            <span className="caption-text">{memories[4].caption}</span>
            <span className="caption-date">{memories[4].date}</span>
          </div>
          <div className="card-glow"></div>
        </button>

        <button
          type="button"
          className="memory-card wide precious-memory-card fade-in"
          onClick={openSpecialMemory}
          onKeyDown={(event) => handleActionKeyDown(event, openSpecialMemory)}
          aria-label="Open precious voice memory"
        >
          <div className="precious-memory-content">
            <span className="precious-memory-tag">Last one</span>
            <h3 className="precious-memory-title">Precious one</h3>
            <p className="precious-memory-subtitle">Tap to open the voice memory</p>
          </div>
          <div className="card-glow"></div>
        </button>
      </div>

      <div className="memories-footer">
        <p>🌟 Wishing you all the happiness in the world 🌟</p>
        <div className="footer-made">Made to make this her best birthday gift 🎂</div>
        <button className="next-btn treat-next-btn" onClick={onNext}>One more thing... 🎁</button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <dialog
          open
          className="lightbox active"
          onCancel={(event) => {
            event.preventDefault();
            setLightboxOpen(false);
          }}
          aria-label="Memory lightbox"
        >
        <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>&times;</button>
        <div className="lightbox-counter">{lightboxIndex + 1} / {memories.length}</div>
        <div className="lightbox-img-wrap" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {lightboxOpen && (
            <img src={memories[lightboxIndex].src} alt="Full view" className="lightbox-img" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}
        </div>
        <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + memories.length) % memories.length); }}>‹</button>
        <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % memories.length); }}>›</button>
        </dialog>
      )}

      {specialMemoryOpen && (
        <dialog
          open
          className="precious-memory-modal active"
          onCancel={(event) => {
            event.preventDefault();
            closeSpecialMemory();
          }}
          aria-label="Precious voice memory"
        >
        <div className="precious-memory-modal-card">
          <button className="precious-memory-close" onClick={closeSpecialMemory} aria-label="Close precious memory">×</button>
          <p className="precious-memory-note">
            hmne isme s background noice hata di taki apki asli clear awaz aye,kha tha na ki bhut achi awaz hai 😄😄😄. 
            <br/>Iske bad ki achi line thi wo na ga ke mera kya patience test krri thi madam 😅😅
          </p>
          <div className="precious-memory-player-card">
            <span className="precious-memory-player-tag">Precious one</span>
            <h3 className="precious-memory-player-title">Your Song :)</h3>
            <audio ref={specialAudioRef} controls preload="metadata" className="precious-memory-audio">
              <source src="/day/audio/Audio.mpeg" type="audio/mpeg" />
              <track kind="captions" src="/day/audio/Audio.vtt" srcLang="en" label="Voice memory transcript" />
            </audio>
          </div>
        </div>
        </dialog>
      )}
    </div>
  );
}
