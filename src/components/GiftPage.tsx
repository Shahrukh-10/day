'use client';

import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { config } from '@/config';

interface GiftPageProps {
  onContinue: () => void;
}

export default function GiftPage({ onContinue }: Readonly<GiftPageProps>) {
  const [selectedDate, setSelectedDate] = useState(config.photoPickerDefaultDate);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const hasProtectedPhotos = useMemo(() => config.protectedPhotos.length > 0, []);
  const activePhotoSrc = activePhotoIndex === null ? '' : encodeURI(config.protectedPhotos[activePhotoIndex]);

  const handleUnlockSubmit = useCallback((e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedDate === config.photoUnlockDateValue) {
      setIsUnlocked(true);
      setUnlockError('');
      return;
    }

    setIsUnlocked(false);
    setUnlockError('That date does not match yet.');
  }, [selectedDate]);

  const closeLightbox = useCallback(() => setActivePhotoIndex(null), []);

  return (
    <div className="gift-page active">
      <div className="gift-page-glow gift-page-glow-left"></div>
      <div className="gift-page-glow gift-page-glow-right"></div>

      <div className="gift-page-content">
        <div className="gift-page-badge">🎁 Secure Surprise</div>
        <h1 className="gift-page-title">{config.giftPageTitle}</h1>
        <p className="gift-page-hint">{config.giftPageHint}</p>

        <div className="gift-lock-panel gift-page-lock-panel">
          <p className="gift-lock-text">{config.photoUnlockPrompt}</p>

          {isUnlocked ? (
            <div className="protected-gallery-wrap">
              <p className="gift-page-subtitle gift-page-subtitle-unlocked">{config.giftMessage}</p>

              {hasProtectedPhotos ? (
                <div className="protected-gallery-grid">
                  {config.protectedPhotos.map((photoSrc, index) => (
                    <button
                      type="button"
                      className="protected-gallery-card protected-gallery-trigger"
                      key={photoSrc}
                      onClick={() => setActivePhotoIndex(index)}
                    >
                      <img src={encodeURI(photoSrc)} alt={`Protected memory ${index + 1}`} className="protected-photo" />
                      <span className="protected-gallery-zoom">Tap to zoom</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="protected-gallery-empty">Add protected images in config to show them here.</div>
              )}

              <p className="protected-photo-caption">{config.protectedPhotoCaption}</p>
            </div>
          ) : (
            <form className="dob-unlock-form" onSubmit={handleUnlockSubmit}>
              <input
                type="date"
                className="dob-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button type="submit" className="dob-submit-btn">Unlock Photos</button>
            </form>
          )}

          {unlockError && <p className="unlock-error">{unlockError}</p>}
        </div>

        {isUnlocked && (
          <button className="next-btn gift-next-btn" onClick={onContinue}>
            See Memories ⟶
          </button>
        )}
      </div>

      {activePhotoIndex !== null && (
        <dialog
          className="gift-lightbox active"
          open
        >
          <button
            type="button"
            className="gift-lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            ×
          </button>

          <a
            href={activePhotoSrc}
            download
            className="gift-lightbox-download"
            onClick={(e) => e.stopPropagation()}
          >
            Download Full Quality
          </a>

          <div className="gift-lightbox-content">
            <img src={activePhotoSrc} alt={`Protected memory ${activePhotoIndex + 1}`} className="gift-lightbox-img" />
          </div>
        </dialog>
      )}
    </div>
  );
}