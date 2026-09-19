'use client';
import { useState } from 'react';
import { addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

const QUESTIONS = [
  {
    id: 1,
    weak: "I was responsible for writing unit tests for our team's code.",
    options: [
      { text: "Wrote multiple unit tests and checked that tests passed before merging pull requests.", correct: false, reason: "Still lacks business impact metrics and strong action verbs." },
      { text: "Engineered comprehensive test suites achieving 92% branch coverage, reducing regression hotfixes by 40% across 4 production releases.", correct: true, reason: "Uses strong action verb ('Engineered'), precise coverage metric (92%), and business outcome (40% fewer regressions)." },
      { text: "Helped our quality assurance engineers test the backend features.", correct: false, reason: "Passive phrasing ('Helped') positions you as an assistant rather than owner." },
      { text: "Maintained Jest and Pytest runners on our local developer laptops.", correct: false, reason: "Focuses on trivial maintenance rather than system reliability." }
    ]
  },
  {
    id: 2,
    weak: "Worked with databases to fix slow queries.",
    options: [
      { text: "Looked at slow queries in PostgreSQL and added some indexes to make it faster.", correct: false, reason: "Informal tone and lacks quantified latency improvements." },
      { text: "Was in charge of maintaining database instances for our microservices.", correct: false, reason: "Describes duty rather than active technical accomplishment." },
      { text: "Optimized relational database query execution plans and composite indexes, slashing p99 query latency from 850ms to 45ms.", correct: true, reason: "Specific technical details ('composite indexes, execution plans') and precise latency metric." },
      { text: "Discussed database performance with senior engineers during sprint planning meetings.", correct: false, reason: "Highlights discussion rather than execution." }
    ]
  },
  {
    id: 3,
    weak: "Helped migrate our application to Docker containers.",
    options: [
      { text: "Architected containerized CI/CD deployment pipelines using Docker, cutting developer onboarding from 3 days to under 20 minutes.", correct: true, reason: "Strong leadership verb ('Architected') and dramatic time-saving metric." },
      { text: "Installed Docker desktop on team computers and wrote a Dockerfile.", correct: false, reason: "Minimizes scope to desktop installations." },
      { text: "Participated in Docker container discussions with our DevOps team.", correct: false, reason: "Describes passive participation." },
      { text: "Ran docker-compose up to test services in staging environments.", correct: false, reason: "Describes routine command execution." }
    ]
  }
];

export default function SentenceUpgrade({ onBack }) {
  const { user, updateUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const q = QUESTIONS[currentIdx];

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
    setShowExplanation(true);
    if (q.options[idx].correct) {
      setScore(s => s + 1);
      if (user?.email) {
        addXP(user.email, 50).then(u => { if (u) updateUser(u); });
      }
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setShowExplanation(false);
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setCurrentIdx(QUESTIONS.length);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <span>⚡</span> Sentence Upgrade MCQ
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Transform junior task descriptions into high-leverage senior engineering accomplishments.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
        >
          ← All Games
        </button>
      </div>

      {currentIdx >= QUESTIONS.length ? (
        <div className="text-center py-12 space-y-4">
          <span className="text-5xl">🎯</span>
          <h3 className="text-2xl font-bold text-zinc-100">Round Complete!</h3>
          <p className="text-sm text-zinc-400">
            Score: <span className="font-bold text-orange-400">{score}</span> / {QUESTIONS.length} Correct
          </p>
          <button
            onClick={() => { setCurrentIdx(0); setScore(0); setSelectedOpt(null); setShowExplanation(false); }}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
            <span>Current Score: {score}</span>
          </div>

          {/* Weak Sentence Card */}
          <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
              Weak / Passive Resume Bullet:
            </span>
            <p className="text-sm text-zinc-200 italic font-medium">"{q.weak}"</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-400 block">
              Select the Executive-Grade Replacement:
            </span>
            {q.options.map((opt, idx) => {
              let btnStyle = 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-200';
              if (showExplanation) {
                if (opt.correct) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200';
                } else if (selectedOpt === idx) {
                  btnStyle = 'bg-red-500/20 border-red-500/50 text-red-200';
                } else {
                  btnStyle = 'opacity-40 bg-zinc-800 border-zinc-700 text-zinc-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 text-left text-xs rounded-2xl border transition-all ${btnStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-700/60 flex items-center justify-center text-[10px] font-bold text-zinc-300 flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium leading-relaxed block">{opt.text}</span>
                      {showExplanation && (selectedOpt === idx || opt.correct) && (
                        <p className="mt-2 text-[11px] text-zinc-400 italic">
                          💡 {opt.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
              >
                {currentIdx < QUESTIONS.length - 1 ? 'Next Question →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
