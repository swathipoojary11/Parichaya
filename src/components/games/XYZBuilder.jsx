'use client';
import { useState, useEffect } from 'react';
import { addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

const CHALLENGES = [
  {
    id: 1,
    role: 'Backend Developer',
    chips: [
      { id: 'x', type: 'Accomplishment [X]', text: 'Accelerated API response throughput' },
      { id: 'y', type: 'Metric [Y]', text: 'by 45% during peak traffic spikes' },
      { id: 'z', type: 'Action [Z]', text: 'by implementing Redis multi-tier caching and query indexes' }
    ]
  },
  {
    id: 2,
    role: 'Frontend / UI Engineer',
    chips: [
      { id: 'x', type: 'Accomplishment [X]', text: 'Decreased initial page bundle load latency' },
      { id: 'y', type: 'Metric [Y]', text: 'from 3.8s to 1.1s (71% improvement)' },
      { id: 'z', type: 'Action [Z]', text: 'by code-splitting routes and removing redundant legacy libraries' }
    ]
  },
  {
    id: 3,
    role: 'DevOps / Cloud Specialist',
    chips: [
      { id: 'x', type: 'Accomplishment [X]', text: 'Minimized deployment rollback frequency' },
      { id: 'y', type: 'Metric [Y]', text: 'to near zero across 65 consecutive production releases' },
      { id: 'z', type: 'Action [Z]', text: 'by engineering automated canary rollout pipelines with health probes' }
    ]
  },
  {
    id: 4,
    role: 'AI / Machine Learning Engineer',
    chips: [
      { id: 'x', type: 'Accomplishment [X]', text: 'Boosted NLP model inference accuracy' },
      { id: 'y', type: 'Metric [Y]', text: 'from 82% to 96.4% F1-score' },
      { id: 'z', type: 'Action [Z]', text: 'by fine-tuning transformer weights and augmenting domain training sets' }
    ]
  },
  {
    id: 5,
    role: 'Mobile App Developer (React Native / iOS)',
    chips: [
      { id: 'x', type: 'Accomplishment [X]', text: 'Reduced mobile crash frequency' },
      { id: 'y', type: 'Metric [Y]', text: 'from 4.2% down to 0.05% crash-free sessions' },
      { id: 'z', type: 'Action [Z]', text: 'by refactoring memory-heavy image caches and state subscriptions' }
    ]
  },
  {
    id: 6,
    role: 'Cybersecurity Specialist',
    chips: [
      { id: 'x', type: 'Accomplishment [X]', text: 'Neutralized unauthorized vulnerability vectors' },
      { id: 'y', type: 'Metric [Y]', text: 'eliminating 100% of high-severity CVEs' },
      { id: 'z', type: 'Action [Z]', text: 'by deploying automated static analysis (SAST) and OAuth2 PKCE protocols' }
    ]
  },
  {
    id: 7,
    role: 'Data Engineer',
    chips: [
      { id: 'x', type: 'Accomplishment [X]', text: 'Streamlined daily ETL data lake ingestion' },
      { id: 'y', type: 'Metric [Y]', text: 'slashing processing time from 6 hours to 45 minutes' },
      { id: 'z', type: 'Action [Z]', text: 'by migrating legacy Batch scripts to Apache Spark parallelized clusters' }
    ]
  }
];

export default function XYZBuilder({ onBack }) {
  const { user, updateUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChips, setSelectedChips] = useState([]);
  const [shuffledChips, setShuffledChips] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [completedAll, setCompletedAll] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentChallenge = CHALLENGES[currentIdx];

  useEffect(() => {
    if (currentChallenge) {
      setShuffledChips([...currentChallenge.chips].sort(() => Math.random() - 0.5));
    }
  }, [currentIdx, currentChallenge]);

  const handleChipClick = (chip) => {
    if (selectedChips.find(c => c.id === chip.id)) {
      setSelectedChips(prev => prev.filter(c => c.id !== chip.id));
    } else {
      setSelectedChips(prev => [...prev, chip]);
    }
  };

  const handleValidate = async () => {
    const isCorrect = selectedChips.length === 3 &&
      selectedChips[0].id === 'x' &&
      selectedChips[1].id === 'y' &&
      selectedChips[2].id === 'z';

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedback({ type: 'success', msg: `✨ Masterful structure! Streak ${newStreak}x • Accomplished [X], as measured by [Y], by doing [Z].` });
      
      if (user?.email) {
        const u = await addXP(user.email, 60);
        if (u) updateUser(u);
      }

      setTimeout(() => {
        if (currentIdx < CHALLENGES.length - 1) {
          setCurrentIdx(i => i + 1);
          setSelectedChips([]);
          setFeedback(null);
        } else {
          setCompletedAll(true);
        }
      }, 1300);
    } else {
      setStreak(0);
      setFeedback({ type: 'error', msg: 'Incorrect Order! The Google formula MUST follow: Accomplished [X] → Measured by [Y] → By doing [Z].' });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 bg-zinc-900 border-[3px] border-black rounded-3xl shadow-[8px_8px_0px_#111] animate-fade-in font-['Inter']">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <h2 className="text-2xl font-black font-['Outfit'] uppercase text-zinc-100">
              Google X-Y-Z Builder
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Build executive Google bullet points: <strong className="text-orange-400">Accomplished [X]</strong>, as measured by <strong className="text-teal-400">[Y]</strong>, by doing <strong className="text-amber-400">[Z]</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <span className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold text-xs rounded-xl animate-pulse">
              🔥 {streak}x Streak
            </span>
          )}
          <button
            onClick={onBack}
            className="text-xs px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors border border-zinc-700"
          >
            ← All Games
          </button>
        </div>
      </div>

      {completedAll ? (
        <div className="text-center py-12 space-y-4">
          <span className="text-6xl animate-bounce">🏆</span>
          <h3 className="text-3xl font-black font-['Outfit'] uppercase text-zinc-100">X-Y-Z Master Certification Unlocked!</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            You have mastered Google's elite bullet point formula across 7 technical engineering domains.
          </p>
          <button
            onClick={() => { setCurrentIdx(0); setSelectedChips([]); setFeedback(null); setCompletedAll(false); setStreak(0); }}
            className="px-8 py-3 bg-[#FF7A18] hover:bg-orange-600 text-white font-black uppercase rounded-xl text-sm shadow-[4px_4px_0px_#111]"
          >
            Replay Challenge
          </button>
        </div>
      ) : (
        <div className="w-full space-y-6">
          
          {/* Challenge Indicator */}
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-full font-bold uppercase tracking-wider">
              Role: {currentChallenge.role}
            </span>
            <span className="font-bold">Challenge {currentIdx + 1} of {CHALLENGES.length}</span>
          </div>

          {/* Builder Dropzone */}
          <div className="min-h-[140px] p-5 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col justify-center gap-3 shadow-inner">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Constructed Impact Statement:
            </span>
            {selectedChips.length === 0 ? (
              <span className="text-xs text-zinc-600 italic">Click phrase chips below in exact order [X] → [Y] → [Z] to construct...</span>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedChips.map((chip, idx) => (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip)}
                    className="p-3 bg-[#FF7A18]/15 border border-[#FF7A18]/40 text-orange-200 text-xs rounded-xl flex items-center justify-between hover:bg-[#FF7A18]/25 transition-colors text-left font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FF7A18] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx === 0 ? 'X' : idx === 1 ? 'Y' : 'Z'}
                      </span>
                      <span>{chip.text}</span>
                    </div>
                    <span className="text-zinc-400 text-[10px] bg-zinc-800 px-2 py-0.5 rounded">Remove ✕</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Available Chips Pool */}
          <div>
            <span className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">
              Select Components (Click to build):
            </span>
            <div className="flex flex-col gap-2.5">
              {shuffledChips.map(chip => {
                const isSelected = selectedChips.find(c => c.id === chip.id);
                return (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip)}
                    disabled={isSelected}
                    className={`p-4 text-left text-xs rounded-2xl border transition-all ${
                      isSelected
                        ? 'opacity-30 bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-zinc-800/90 hover:bg-zinc-800 border-zinc-700 hover:border-[#FF7A18] text-zinc-100 shadow-md font-medium'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#2EC4B6] block mb-1 uppercase tracking-widest">{chip.type}</span>
                    <span className="leading-relaxed">{chip.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-2xl text-xs font-bold text-center border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/20 border-red-500/40 text-red-300'
            }`}>
              {feedback.msg}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
            <button
              onClick={() => setSelectedChips([])}
              className="text-xs text-zinc-400 hover:text-white font-bold"
            >
              Clear Selection
            </button>
            <button
              onClick={handleValidate}
              disabled={selectedChips.length !== 3}
              className="px-7 py-3 bg-[#FF7A18] hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase text-xs rounded-xl shadow-[4px_4px_0px_#111] transition-all"
            >
              Validate Structure (+60 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
