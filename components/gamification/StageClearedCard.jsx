'use client';

import React from 'react';
import {
  Trophy,
  Zap,
  ArrowRight,
  MapPin,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Star
} from 'lucide-react';

export const StageClearedCard = ({
  stage,
  nextStage,
  stageXp = 300,
  correctCount = 6,
  totalQuestions = 6,
  onProceedToNextStage,
  onReturnToMap,
}) => {
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // Core topic preview map for upcoming stages
  const topicMap = {
    2: ['Dynamic Programming', 'Memoization', 'React Reconciliation', 'Debounce Timing'],
    3: ['Node.js Event Loop', 'Redis Caching Layer', 'B-Tree Indexes', 'REST Idempotency'],
    4: ['Google X-Y-Z Formula', 'Token Bucket Limiter', 'Saga Pattern', 'JWT Revocation'],
  };

  const nextTopics = nextStage ? topicMap[nextStage.id] || ['System Architecture', 'Algorithmic Optimization'] : [];

  return (
    <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-300">
      {/* Pulsating Animated Trophy / Badge Icon */}
      <div className="relative inline-block">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-500 p-1 shadow-2xl shadow-orange-500/30 mx-auto">
          <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-bounce" />
          </div>
        </div>
        <span className="absolute -top-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-zinc-950 shadow-md">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
        </span>
      </div>

      {/* Header Info */}
      <div className="space-y-1.5 max-w-md mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          Stage {stage?.stageNum || 1} Checkpoint Reached
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {stage?.title || 'Stage Cleared!'}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400">
          Stage completed successfully! Review your score and choose your next action.
        </p>
      </div>

      {/* Performance Recap Grid */}
      <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 max-w-md mx-auto grid grid-cols-3 gap-3 shadow-lg">
        <div className="text-center space-y-0.5">
          <div className="text-[11px] text-zinc-400 font-mono">Stage XP</div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 fill-emerald-400" />
            +{stageXp}
          </div>
        </div>

        <div className="text-center space-y-0.5 border-x border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-mono">Accuracy</div>
          <div className="text-base sm:text-lg font-bold text-white">
            {accuracy}%
          </div>
        </div>

        <div className="text-center space-y-0.5">
          <div className="text-[11px] text-zinc-400 font-mono">Tier Cleared</div>
          <div className="text-xs font-bold text-orange-400 font-mono truncate px-1">
            {stage?.tier || 'Novice'}
          </div>
        </div>
      </div>

      {/* Next Stage Preview Card */}
      {nextStage && (
        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-orange-500/30 max-w-md mx-auto text-left space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Up Next: Stage {nextStage.stageNum} - {nextStage.title?.replace(`Stage ${nextStage.stageNum}: `, '')}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
              +{nextStage.xp || 300} XP Available
            </span>
          </div>

          <p className="text-xs text-zinc-300">
            {nextStage.description}
          </p>

          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Core Topics Covered:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {nextTopics.map((topic, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800"
                >
                  ⚡ {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Explicit Dual Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        {nextStage && (
          <button
            onClick={onProceedToNextStage}
            className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transition-all cursor-pointer"
          >
            <span>Proceed to Next Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onReturnToMap}
          className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-orange-400" />
          <span>Save & Return to Arena Map</span>
        </button>
      </div>
    </div>
  );
};

export default StageClearedCard;
