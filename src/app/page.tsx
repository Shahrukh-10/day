'use client';

import { useState, useCallback } from 'react';
import RoseBouquetPage from '@/components/RoseBouquetPage';
import CountdownPage from '@/components/CountdownPage';
import GlobePage from '@/components/GlobePage';
import SurprisePage from '@/components/SurprisePage';
import MessagePage from '@/components/MessagePage';
import GiftPage from '@/components/GiftPage';
import MemoriesPage from '@/components/MemoriesPage';
import ScratchPage from '@/components/ScratchPage';
import TreatPage from '@/components/TreatPage';
import MusicFab from '@/components/MusicFab';
import RoseSongIsland from '@/components/RoseSongIsland';
import SupportInfoFab from '@/components/SupportInfoFab';

type PageName = 'countdown' | 'globe' | 'surprise' | 'message' | 'gift' | 'memories' | 'roses' | 'scratch' | 'treat';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageName>('countdown');
  const [timerDone, setTimerDone] = useState(false);
  const [musicShouldPlay, setMusicShouldPlay] = useState(false);
  const [memoryModalMusicSuspended, setMemoryModalMusicSuspended] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const roseTrackActive = currentPage === 'roses';
  const musicSuspended = memoryModalMusicSuspended || roseTrackActive;

  const navigateTo = useCallback((page: PageName) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleTimerDone = useCallback(() => setTimerDone(true), []);

  const handleGiftClick = useCallback(() => {
    if (timerDone) navigateTo('globe');
  }, [timerDone, navigateTo]);

  const handleGlobeFound = useCallback(() => {
    setTimeout(() => navigateTo('surprise'), 2500);
  }, [navigateTo]);

  const handleSurpriseContinue = useCallback(() => navigateTo('message'), [navigateTo]);

  const handleStartMusic = useCallback(() => setMusicShouldPlay(true), []);

  const handleMessageContinue = useCallback(() => {
    navigateTo('gift');
  }, [navigateTo]);

  const handleGiftContinue = useCallback(() => {
    navigateTo('memories');
    setShowReplay(true);
  }, [navigateTo]);

  const handleMemoriesBack = useCallback(() => navigateTo('gift'), [navigateTo]);

  const handleMemoriesNext = useCallback(() => navigateTo('roses'), [navigateTo]);

  const handleRosesContinue = useCallback(() => navigateTo('scratch'), [navigateTo]);

  return (
    <>
      <MusicFab shouldPlay={musicShouldPlay} suspended={musicSuspended} />
      {currentPage !== 'countdown' && <SupportInfoFab />}
      {roseTrackActive && <RoseSongIsland />}

      {currentPage === 'countdown' && (
        <CountdownPage
          onTimerDone={handleTimerDone}
          onGiftClick={handleGiftClick}
          timerDone={timerDone}
        />
      )}

      {currentPage === 'globe' && (
        <GlobePage onFound={handleGlobeFound} />
      )}

      {currentPage === 'surprise' && (
        <SurprisePage onContinue={handleSurpriseContinue} startMusic={handleStartMusic} />
      )}

      {currentPage === 'message' && (
        <MessagePage onContinue={handleMessageContinue} />
      )}

      {currentPage === 'gift' && (
        <GiftPage onContinue={handleGiftContinue} />
      )}

      {currentPage === 'memories' && (
        <MemoriesPage
          onBack={handleMemoriesBack}
          onNext={handleMemoriesNext}
          onSpecialMemoryModalToggle={setMemoryModalMusicSuspended}
        />
      )}

      {currentPage === 'roses' && (
        <RoseBouquetPage onContinue={handleRosesContinue} />
      )}

      {currentPage === 'scratch' && (
        <ScratchPage />
      )}

      {currentPage === 'treat' && (
        <TreatPage />
      )}

      {showReplay && (
        <button className="replay-fab" aria-label="Replay experience" onClick={() => globalThis.location.reload()}>
          <span>&#8634;</span>
        </button>
      )}
    </>
  );
}
