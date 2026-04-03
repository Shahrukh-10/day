'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const TRACK_SRC = '/day/audio/Khat-(Mr-Jat.in).mp3';
const TRACK_START_TIME = 53;

export default function RoseSongIsland() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(TRACK_SRC);
    audio.preload = 'auto';
    audio.volume = 0.9;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      audio.currentTime = TRACK_START_TIME;
      audio.play().catch(() => {});
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audioRef.current = audio;

    audio.currentTime = TRACK_START_TIME;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.src = '';
    };
  }, []);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
      return;
    }

    audio.pause();
  }, []);

  return (
    <div className="rose-song-island" aria-label="Now playing Khat">
      <div className="rose-song-meta">
        <span className={`rose-song-dot${playing ? ' active' : ''}`} />
        <div className="rose-song-copy">
          <span className="rose-song-label">Now playing for my fool 😅 </span>
          <strong className="rose-song-title">Faku 🌹</strong>
        </div>
      </div>
      <button type="button" className="rose-song-toggle" onClick={togglePlayback}>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
