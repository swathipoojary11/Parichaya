'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from './soundEffects';
import { getQuestionsByStageId } from '../../data/gameQuestions';
import StageClearedCard from './StageClearedCard';
import {
  X,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  Award,
  Star,
  AlertCircle
} from 'lucide-react';

export const InteractiveQuizModal = ({
  stage,
  stages = [],
  soundEnabled = true,
  onClose,
  onStageComplete,
  onProceedToNextStage,
}) => {
  const stageQuestions = getQuestionsByStageId(stage?.id || 1);
  const totalQuestions = stageQuestions.length || 6;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stageXp, setStageXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [shakeAnswerIndex, setShakeAnswerIndex] = useState(null);

  // Modal Views: 'quiz' | 'stage_cleared' | 'final_victory'
  const [modalView, setModalView] = useState('quiz');

  // Reset state whenever stage ID changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setStageXp(0);
    setCorrectCount(0);
    setModalView('quiz');
  }, [stage?.id]);

  const currentQuestion = stageQuestions[currentQuestionIndex] || {
    question: 'Question data loading...',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    explanation: 'No explanation available.',
    wrongReason: 'No diagnostic available.',
  };

  // Find next stage object for checkpoint preview card
  const nextStage = stages.find((s) => s.id === (stage?.id || 1) + 1);

  // Select Option Handler
  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;

    setSelectedAnswerIndex(optionIndex);
    const correct = optionIndex === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setStageXp((prev) => prev + 50);
      setCorrectCount((prev) => prev + 1);
      playSound('correct', soundEnabled);

      // Duolingo-style confetti burst on correct answer
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#059669', '#F97316'],
        disableForReducedMotion: true,
      });
    } else {
      setShakeAnswerIndex(optionIndex);
      playSound('wrong', soundEnabled);

      setTimeout(() => {
        setShakeAnswerIndex(null);
      }, 500);
    }
  };

  // Try Again Handler (Allows student to retry the current question)
  const handleTryAgain = () => {
    setIsSubmitted(false);
    setSelectedAnswerIndex(null);
    setIsCorrect(false);
  };

  // Next Question / Complete Stage Handler
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      // Completed Q6 of current stage
      const finalXp = stageXp > 0 ? stageXp : stage?.xp || 300;

      // Award XP & Save stage completion to global state & localStorage immediately
      if (onStageComplete) {
        onStageComplete(stage.id, finalXp);
      }

      if (stage?.stageNum === 4) {
        setModalView('final_victory');
        playSound('victory', soundEnabled);

        // Grand victory confetti burst for Stage 4 Boss Battle
        confetti({
          particleCount: 160,
          spread: 110,
          origin: { y: 0.5 },
          colors: ['#F97316', '#10B981', '#F59E0B', '#6366F1', '#EC4899'],
          disableForReducedMotion: true,
        });
      } else {
        // Pause on intermediate Stage Cleared checkpoint screen
        setModalView('stage_cleared');
        playSound('victory', soundEnabled);

        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#F97316', '#10B981', '#F59E0B'],
          disableForReducedMotion: true,
        });
      }
    }
  };

  // Checkpoint Action: User explicitly clicks "Proceed to Next Stage ➔"
  const handleProceedNext = () => {
    if (onProceedToNextStage && stage?.id < 4) {
      onProceedToNextStage(stage.id + 1);
    } else {
      onClose();
    }
  };

  // Checkpoint Action: User explicitly clicks "Save & Return to Arena Map"
  const handleReturnToMap = () => {
    onClose();
  };

  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Inline Keyframes for Horizontal Shake Animation */}
      <style jsx global>{`
        @keyframes horizontalShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: horizontalShake 0.4s ease-in-out;
        }
      `}</style>

      <div className="max-w-3xl w-full bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* ==================== VIEW 1: INTERACTIVE QUIZ ==================== */}
        {modalView === 'quiz' && (
          <div className="flex flex-col space-y-6 p-5 sm:p-7">
            {/* Top Status Bar */}
            <div className="flex flex-col gap-3 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center justify-between">
                {/* Stage Title & Tier Badge */}
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      {stage?.title || 'Placement Arena Stage'}
                    </h3>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 inline-block">
                      {stage?.tier || 'Novice Tier'}
                    </span>
                  </div>
                </div>

                {/* Right Bar: XP Counter & Close Button */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-sm">
                    <Zap className="w-4 h-4 fill-emerald-400" />
                    <span>+{stageXp} XP</span>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Question Tracker & Dynamic Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs font-mono font-semibold text-zinc-400">
                  <span>Question Tracker</span>
                  <span className="text-white font-bold">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Text Box */}
            <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800/90 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-orange-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Multiple Choice Question
              </span>
              <h4 className="text-base sm:text-lg font-semibold text-zinc-100 leading-snug">
                {currentQuestion.question}
              </h4>
            </div>

            {/* 4 Choice Buttons (A, B, C, D) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isTrueCorrect = idx === currentQuestion.correctIndex;
                const isShaking = shakeAnswerIndex === idx;

                const letterLabel = String.fromCharCode(65 + idx);
                const cleanText = option.replace(/^[A-D]\)\s*/, '');

                let buttonStyle = 'bg-zinc-900 hover:bg-zinc-800/90 border-zinc-800 text-zinc-200 hover:border-zinc-700 cursor-pointer';

                if (isSubmitted) {
                  if (isSelected && isCorrect) {
                    buttonStyle = 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 font-semibold shadow-lg shadow-emerald-500/10';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-red-500/20 border-2 border-red-500 text-red-300 font-semibold shadow-lg shadow-red-500/10';
                  } else if (!isSelected && isTrueCorrect && !isCorrect) {
                    buttonStyle = 'bg-emerald-500/10 border-2 border-emerald-500/70 text-emerald-300 font-semibold';
                  } else {
                    buttonStyle = 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-start gap-3 select-none ${buttonStyle} ${
                      isShaking ? 'animate-shake' : ''
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs ${
                        isSelected && isCorrect
                          ? 'bg-emerald-500 text-zinc-950'
                          : isSelected && !isCorrect
                          ? 'bg-red-500 text-white'
                          : !isSelected && isSubmitted && isTrueCorrect
                          ? 'bg-emerald-500/40 text-emerald-200'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {letterLabel}
                    </span>
                    <span className="flex-1 leading-snug">{cleanText}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback Box (Appears after selecting an option) */}
            {isSubmitted && (
              <div
                className={`p-5 rounded-2xl border text-xs sm:text-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  isCorrect
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200 shadow-xl shadow-emerald-950/40'
                    : 'bg-red-950/70 border-red-500/50 text-red-200 shadow-xl shadow-red-950/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    {isCorrect ? (
                      <>
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-emerald-400">CORRECT! (+50 XP)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/40">
                          <XCircle className="w-5 h-5" />
                        </div>
                        <span className="text-red-400">INCORRECT</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Educational Explanation / Failure Reason */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <div className="font-mono text-[11px] uppercase tracking-wider font-bold opacity-80">
                    {isCorrect ? 'Architectural Breakdown & Explanation:' : 'Diagnostic Failure Reason:'}
                  </div>
                  <p className="leading-relaxed opacity-95">
                    {isCorrect
                      ? currentQuestion.explanation
                      : currentQuestion.wrongReason || currentQuestion.explanation}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  {!isCorrect && (
                    <button
                      onClick={handleTryAgain}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Try Again
                    </button>
                  )}

                  <button
                    onClick={handleNextQuestion}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      isCorrect
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                        : 'bg-orange-500 hover:bg-orange-400 text-zinc-950 shadow-orange-500/20'
                    }`}
                  >
                    <span>
                      {currentQuestionIndex < totalQuestions - 1
                        ? 'Next Question'
                        : stage?.stageNum === 4
                        ? 'Complete Final Battle & Review Results'
                        : 'Complete Stage & Review Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== VIEW 2: STAGE CHECKPOINT REVIEW ==================== */}
        {modalView === 'stage_cleared' && (
          <StageClearedCard
            stage={stage}
            nextStage={nextStage}
            stageXp={stageXp > 0 ? stageXp : stage?.xp || 300}
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            onProceedToNextStage={handleProceedNext}
            onReturnToMap={handleReturnToMap}
          />
        )}

        {/* ==================== VIEW 3: FINAL VICTORY SUMMARY (STAGE 4 BOSS) ==================== */}
        {modalView === 'final_victory' && (
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-500 p-1 shadow-2xl shadow-orange-500/40 mx-auto">
                <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
                  <Award className="w-12 h-12 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
                ARENA CHAMPION — JOB-READY VERIFIED!
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Google X-Y-Z Mastered!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                Congratulations! You conquered all 4 stages of the Placement Arena RPG. Your placement rank tier is upgraded to <strong className="text-orange-400 font-mono">Job-Ready Tier</strong>.
              </p>
            </div>

            {/* Final Rewards Card */}
            <div className="bg-zinc-900/90 p-6 rounded-2xl border border-orange-500/30 max-w-md mx-auto space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-zinc-800">
                <span className="text-zinc-400">Total Quiz XP Earned:</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-emerald-400" />
                  +{stageXp > 0 ? stageXp : 300} XP
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">New Rank Tier Unlocked:</span>
                <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                  🛡️ Job-Ready Rank
                </span>
              </div>
            </div>

            {/* Finish & Return to Hub Button */}
            <div className="pt-2">
              <button
                onClick={handleReturnToMap}
                className="w-full max-w-md mx-auto px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 fill-zinc-950" />
                <span>Finish & Return to Hub</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InteractiveQuizModal;
