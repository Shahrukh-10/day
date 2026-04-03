'use client';

import { useState, useCallback } from 'react';

const SUPPORT_MESSAGE = [
  'This is for you… I know it’s not something very big, but I really hope it makes your birthday a little better.',
  'You can open this anytime, anywhere—24×7. And just like that, I want you to know I’m always there for you too. Whenever life feels heavy, or you need someone, or have any problem, I’ll be there.',
  'I’m available for you 24×7—always.',
  'And on the days you feel low, I’ll come just to make you smile, to distract you, and to make things a little lighter.',
  'Always here for you, Faku 🌹',
];

export default function SupportInfoFab() {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <>
      <button type="button" className="support-info-fab" aria-label="Open support message" onClick={openModal}>
        ❤
      </button>

      {open && (
        <div className="support-info-modal">
          <div className="support-info-card">
            <button type="button" className="support-info-close" aria-label="Close support message" onClick={closeModal}>
              ×
            </button>
            <p className="support-info-eyebrow">For You</p>
            <div className="support-info-copy">
              {SUPPORT_MESSAGE.map((paragraph) => (
                <p key={paragraph} className="support-info-text">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
