'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const quizQuestions = [
  {
    q: "What's Fakeha's favorite color?",
    options: ["Red ❤️", "Blue 💙", "Purple 💜", "Pink 💖"],
    correct: 2,
  },
  {
    q: "What does Fakeha love eating the most?",
    options: ["Pizza 🍕", "Biryani 🍚", "Chocolate 🍫", "Ice Cream 🍦"],
    correct: 1,
  },
  {
    q: "What's Fakeha's dream travel destination?",
    options: ["Paris 🗼", "Tokyo 🗾", "Maldives 🏝️", "Switzerland 🏔️"],
    correct: 1,
  },
  {
    q: "Which one does Fakeha say the most?",
    options: ['"Haan toh?" 😏', '"Chup ho jao" 🤫', '"Mujhe nahi pata" 🤷', '"Pagal hai kya" 😂'],
    correct: 0,
  },
  {
    q: "What would Fakeha do with a million rupees?",
    options: ["Shop till she drops 🛍️", "Travel the world ✈️", "Save it all 💰", "Throw a party 🎉"],
    correct: 0,
  },
];

interface QuizPageProps {
  onNext: () => void;
}

export default function QuizPage({ onNext }: QuizPageProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Quiz particles
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'quiz-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 6 + 4) + 's';
      p.style.animationDelay = (Math.random() * 4) + 's';
      container.appendChild(p);
    }
  }, []);

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(idx);
    if (idx === quizQuestions[currentQ].correct) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      if (currentQ + 1 < quizQuestions.length) {
        setCurrentQ(prev => prev + 1);
        setAnswered(false);
        setSelectedIdx(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  }, [answered, currentQ]);

  const q = quizQuestions[currentQ];
  const labels = ['A', 'B', 'C', 'D'];

  let resultTitle = '';
  let resultMsg = '';
  if (showResult) {
    if (score === 5) {
      resultTitle = '🏆 Best Friend EVER!';
      resultMsg = "You know Fakeha like nobody else! She's lucky to have you 💖";
    } else if (score >= 3) {
      resultTitle = '😎 Pretty Close!';
      resultMsg = "Not bad! You know Fakeha well... but there's always room to learn more 😉";
    } else if (score >= 1) {
      resultTitle = '🤔 Hmm... Really?';
      resultMsg = "Do you even know Fakeha?! Time to pay more attention 😂";
    } else {
      resultTitle = '💀 Do You Even Know Me?!';
      resultMsg = "ZERO?! Fakeha is deeply disappointed. You owe her extra treats now 😤🍕🎂";
    }
  }

  return (
    <div className="quiz-page active">
      <div className="quiz-particles" ref={particlesRef}></div>
      <div className="quiz-content">
        {!showResult && (
          <>
            <div className="quiz-header" id="quizHeader">
              <h1 className="quiz-title">🏆 How Well Do You Know Me?</h1>
              <p className="quiz-subtitle">Let&apos;s see if you&apos;re a real bestie... 😏</p>
              <div className="quiz-progress">
                <div className="quiz-progress-bar" style={{ width: ((currentQ + 1) / quizQuestions.length * 100) + '%' }}></div>
              </div>
              <p className="quiz-counter">Question {currentQ + 1} of {quizQuestions.length}</p>
            </div>

            <div className="quiz-question-area">
              <h2 className="quiz-question">{q.q}</h2>
              <div className="quiz-options">
                {q.options.map((opt, i) => {
                  let className = 'quiz-option';
                  if (answered) {
                    className += ' disabled';
                    if (i === q.correct) className += ' correct';
                    if (i === selectedIdx && i !== q.correct) className += ' wrong';
                  }
                  return (
                    <div key={i} className={className} onClick={() => handleAnswer(i)}>
                      <span className="quiz-option-label">{labels[i]}</span>{opt}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {showResult && (
          <div className="quiz-result" style={{ display: 'block' }}>
            <div className="quiz-score-circle">
              <span className="quiz-score-num">{score}</span>
              <span className="quiz-score-label">/5</span>
            </div>
            <h2 className="quiz-result-title">{resultTitle}</h2>
            <p className="quiz-result-msg">{resultMsg}</p>
            <button className="next-btn quiz-next-btn" onClick={onNext}>Continue &#10230;</button>
          </div>
        )}
      </div>
    </div>
  );
}
