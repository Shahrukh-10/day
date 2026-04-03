'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface MusicFabProps {
  shouldPlay: boolean;
  suspended: boolean;
}

export default function MusicFab({ shouldPlay, suspended }: Readonly<MusicFabProps>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const pausedBySuspend = useRef(false);

  useEffect(() => {
    const audio = new Audio('/day/audio/Happy Birthday To You Ji-(Mr-Jat.in).mp3');
    audio.loop = true;
    audio.volume = 0.7;
    audio.addEventListener('play', () => { if (audio.currentTime < 3) audio.currentTime = 3; });
    audio.addEventListener('seeking', () => { if (audio.currentTime < 3) audio.currentTime = 3; });
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  useEffect(() => {
    if (!suspended && shouldPlay && !playing && !userPaused.current && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [shouldPlay, playing, suspended]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (suspended) {
      pausedBySuspend.current = !audio.paused;
      if (!audio.paused) {
        audio.pause();
        setPlaying(false);
      }
      return;
    }

    if (pausedBySuspend.current && shouldPlay && !userPaused.current) {
      pausedBySuspend.current = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      return;
    }

    pausedBySuspend.current = false;
  }, [shouldPlay, suspended]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      userPaused.current = true;
      setPlaying(false);
    } else {
      userPaused.current = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  if ((!shouldPlay && !playing) || suspended) return null;

  return (
    <button className={`music-fab${playing ? ' playing' : ''}`} aria-label="Toggle music" onClick={toggle}>
      <span className="music-icon">{playing ? '🔊' : '🔇'}</span>
    </button>
  );
}
