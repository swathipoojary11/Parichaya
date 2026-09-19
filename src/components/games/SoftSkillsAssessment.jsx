'use client';
import { useState, useEffect } from 'react';
import { SOFT_SKILL_QUESTIONS, computeSoftSkillScore } from '@/lib/softSkillsData';
import { recordSoftSkillResult, createMission, addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import CatCoach from '@/components/CatCoach';

export default function SoftSkillsAssessment({ onBack }) {
  const { user, updateUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [jumbleOrder, setJumbleOrder] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreReport, setScoreReport] = useState(null);
  const [shuffledChips, setShuffledChips] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [catState, setCatState] = useState('idle');

  const q = SOFT_SKILL_QUESTIONS[currentIdx];

  useEffect(() => {
    if (q) {
      if (q.type === 'jumble') {
        setShuffledChips([...q.chips].sort(() => Math.random() - 0.5));
        setShuffledOptions([]);
      } else if (q.options) {
        const opts = q.options.map((opt, i) => ({ ...opt, originalIndex: i }));
        setShuffledOptions([...opts].sort(() => Math.random() - 0.5));
      }
    }
  }, [currentIdx, q]);

  const handleSelectOption = (idx) => {
    setSelectedOpt(idx);
    setCatState('thinking');
  };

  const handleNext = async () => {
    let score = 0;
    if (q.type === 'jumble') {
      const isCorrect = jumbleOrder.join(',') === q.correctOrder.join(',');
      score = isCorrect ? 100 : 30;
    } else if (selectedOpt !== null && shuffledOptions.length > 0) {
      score = shuffledOptions[selectedOpt]?.score || 0;
    }

    if (score >= 80) {
      setStreak(s => s + 1);
      setCatState('celebrating');
    } else {
      setStreak(0);
      setCatState('idle');
    }

    const updatedAnswers = [...answers, { questionId: q.id, score }];
    setAnswers(updatedAnswers);
    setSelectedOpt(null);
    setJumbleOrder([]);

    if (currentIdx < SOFT_SKILL_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      const report = computeSoftSkillScore(updatedAnswers);
      setScoreReport(report);
      setIsCompleted(true);

      if (user?.email) {
        await recordSoftSkillResult(user.email, report);
        const u = await addXP(user.email, 200);
        if (u) updateUser(u);

        if (report.weakestAreas && report.weakestAreas.length > 0) {
          await createMission(user.email, {
            id: `mission_ss_${Date.now()}`,
            title: `Mission: Master ${report.weakestAreas[0]}`,
            category: 'Soft Skills',
            skillGap: report.weakestAreas[0],
            taskDescription: `Focus on overcoming your detected communication weakness in ${report.weakestAreas[0]}. Complete practice scenarios to increase your score.`,
            difficulty: 'Intermediate',
            xpBounty: 150,
            targetUrl: '/arena'
          });
        }
      }
    }
  };

  const handleJumbleClick = (chipId) => {
    if (jumbleOrder.includes(chipId)) {
      setJumbleOrder(prev => prev.filter(c => c !== chipId));
    } else {
      setJumbleOrder(prev => [...prev, chipId]);
    }
  };

  const progressPercent = Math.round(((currentIdx + 1) / SOFT_SKILL_QUESTIONS.length) * 100);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto p-6 bg-zinc-900 border-[3px] border-black rounded-3xl shadow-[8px_8px_0px_#111] animate-fade-in font-['Inter']">
      
      {/* Gamified Top Header */}
      <div className="flex items-center justify-between w-full mb-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <CatCoach state={catState} size={64} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF7A18] bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                Gamified Arena
              </span>
              {streak > 1 && (
                <span className="text-xs font-extrabold text-amber-400 animate-pulse">
                  🔥 {streak}x Combo!
                </span>
              )}
            </div>
            <h2 className="text-xl font-black font-['Outfit'] uppercase text-zinc-100 mt-1">
              Soft Skills Communication Battle
            </h2>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-xs px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors border border-zinc-700"
        >
          ← Exit Arena
        </button>
      </div>

      {/* Health / Energy Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">
          <span>Battle Level {currentIdx + 1} of {SOFT_SKILL_QUESTIONS.length}</span>
          <span className="text-[#2EC4B6]">{progressPercent}% Mastery</span>
        </div>
        <div className="w-full bg-zinc-950 h-3 rounded-full border border-zinc-800 overflow-hidden p-0.5">
          <div 
            className="bg-gradient-to-r from-[#FF7A18] via-amber-400 to-[#2EC4B6] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {isCompleted && scoreReport ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-zinc-950 border-2 border-zinc-800 rounded-3xl shadow-inner">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#FF7A18]">Battle Conquered</span>
              <h3 className="text-2xl font-black font-['Outfit'] uppercase text-zinc-100 mt-1">
                {scoreReport.overallScore >= 80 ? '👑 Executive Communicator' : scoreReport.overallScore >= 60 ? '🚀 Senior Strategist' : '💬 Emerging Communicator'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">XP Bounty Awarded: <span className="text-[#2EC4B6] font-extrabold">+200 XP</span></p>
            </div>
            <div className="text-3xl font-black text-emerald-400 bg-emerald-500/10 px-6 py-4 rounded-2xl border border-emerald-500/40 shadow-lg">
              {scoreReport.overallScore}% Score
            </div>
          </div>

          {/* 4 Skill Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-300">Executive Clarity</span>
                <span className="text-[#FF7A18]">{scoreReport.clarityScore}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#FF7A18] h-full rounded-full" style={{ width: `${scoreReport.clarityScore}%` }} />
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-300">Workplace Professionalism</span>
                <span className="text-[#2EC4B6]">{scoreReport.professionalismScore}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#2EC4B6] h-full rounded-full" style={{ width: `${scoreReport.professionalismScore}%` }} />
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-300">Sentence & Grammar Structure</span>
                <span className="text-purple-400">{scoreReport.grammarScore}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${scoreReport.grammarScore}%` }} />
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-300">Vocabulary Precision</span>
                <span className="text-amber-400">{scoreReport.vocabularyScore}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${scoreReport.vocabularyScore}%` }} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={() => { setCurrentIdx(0); setAnswers([]); setIsCompleted(false); setScoreReport(null); setStreak(0); }}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700"
            >
              Re-play Assessment
            </button>
            <button
              onClick={onBack}
              className="px-7 py-3 bg-[#FF7A18] hover:bg-orange-600 text-white font-black uppercase text-xs rounded-xl shadow-[4px_4px_0px_#111]"
            >
              Return to Skill Arena →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Prompt Card */}
          <div className="p-5 bg-zinc-950 border-2 border-zinc-800 rounded-2xl shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2EC4B6] block mb-1">
              Category: {q.category}
            </span>
            <h3 className="text-sm font-bold text-zinc-100 leading-relaxed font-['Outfit']">
              {q.prompt}
            </h3>
          </div>

          {/* JUMBLE TYPE */}
          {q.type === 'jumble' && (
            <div className="space-y-4">
              <div className="min-h-[90px] p-4 bg-zinc-950 border-2 border-dashed border-[#2EC4B6]/50 rounded-2xl flex flex-wrap gap-2 items-center">
                <span className="text-xs text-zinc-500 w-full mb-1 font-bold uppercase tracking-wider">Assembled Phrasing:</span>
                {jumbleOrder.length === 0 ? (
                  <span className="text-xs text-zinc-600 italic">Click fragments below to assemble...</span>
                ) : (
                  jumbleOrder.map(chipId => {
                    const chip = q.chips.find(c => c.id === chipId);
                    return (
                      <button
                        key={chipId}
                        type="button"
                        onClick={() => handleJumbleClick(chipId)}
                        className="px-3.5 py-2 bg-[#2EC4B6]/20 border border-[#2EC4B6]/40 text-[#2EC4B6] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#2EC4B6]/30 transition-all"
                      >
                        <span>{chip?.text}</span>
                        <span className="text-zinc-400 text-[10px]">✕</span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs text-zinc-400 font-bold block uppercase tracking-wider">Available Sentence Fragments:</span>
                {shuffledChips.map(chip => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleJumbleClick(chip.id)}
                    disabled={jumbleOrder.includes(chip.id)}
                    className={`w-full p-3.5 text-left text-xs font-medium rounded-xl border transition-all ${
                      jumbleOrder.includes(chip.id)
                        ? 'opacity-30 bg-zinc-900 border-zinc-800 text-zinc-600'
                        : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
                    }`}
                  >
                    {chip.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MULTIPLE CHOICE TYPE */}
          {q.type !== 'jumble' && shuffledOptions.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 block uppercase tracking-wider">
                Select Executive Phrasing Option:
              </span>
              {shuffledOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 text-left text-xs font-semibold rounded-2xl border transition-all ${
                    selectedOpt === idx
                      ? 'bg-[#FF7A18]/20 border-[#FF7A18] text-orange-200 shadow-md font-bold'
                      : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-extrabold text-zinc-300 shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Next Action */}
          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              onClick={handleNext}
              disabled={q.type === 'jumble' ? jumbleOrder.length !== q.chips.length : selectedOpt === null}
              className="px-8 py-3 bg-[#FF7A18] hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase text-xs rounded-xl shadow-[4px_4px_0px_#111] transition-all"
            >
              {currentIdx < SOFT_SKILL_QUESTIONS.length - 1 ? 'Next Question →' : 'Complete Battle & Calculate Score'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
