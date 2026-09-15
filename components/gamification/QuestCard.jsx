'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Sparkles, Code2, Target } from 'lucide-react';

export const QuestCard = ({ quest, onComplete }) => {
  const handleClick = (e) => {
    if (quest?.isCompleted) return;

    // Trigger canvas-confetti burst directly from click event coordinates
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x, y },
      colors: ['#F97316', '#FB923C', '#10B981', '#F59E0B'],
      disableForReducedMotion: true,
    });

    onComplete(quest.id, quest.xpReward);
  };

  // Component C specifications:
  // Default: border border-zinc-800 bg-zinc-900/50 p-4 rounded-lg flex items-start gap-3 hover:border-orange-500/40 transition cursor-pointer
  // Completed: border border-emerald-500/30 bg-emerald-950/10 p-4 rounded-lg flex items-start gap-3 opacity-80
  const containerClasses = quest?.isCompleted
    ? 'border border-emerald-500/30 bg-emerald-950/10 p-4 rounded-lg flex items-start gap-3 opacity-80 transition-all'
    : 'border border-zinc-800 bg-zinc-900/50 p-4 rounded-lg flex items-start gap-3 hover:border-orange-500/40 transition cursor-pointer group';

  return (
    <div className={containerClasses} onClick={handleClick}>
      {/* Checkbox Icon */}
      <div className="mt-0.5 shrink-0">
        {quest?.isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <Circle className="w-5 h-5 text-zinc-600 group-hover:text-orange-500 transition-colors" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold tracking-tight ${
                quest?.isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-100 group-hover:text-orange-400'
              }`}
            >
              {quest?.title}
            </span>
            {quest?.category === 'LeetCode Pattern' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-orange-400 border border-zinc-700">
                <Code2 className="w-3 h-3" />
                Pattern
              </span>
            )}
          </div>

          {/* XP Pill spec: bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-bold px-2 py-0.5 rounded-full */}
          <span
            className={`shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
              quest?.isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
            }`}
          >
            +{quest?.xpReward} XP
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-2">
          {quest?.description}
        </p>

        {/* LeetCode pattern or target skill tag */}
        {quest?.patternName && (
          <div className="mt-1 inline-flex items-center gap-1 text-xs font-mono text-orange-400 bg-orange-500/5 px-2 py-1 rounded border border-orange-500/10">
            <Target className="w-3.5 h-3.5" />
            <span>LeetCode: {quest.patternName}</span>
          </div>
        )}

        {/* Zero-guide action hint button */}
        {!quest?.isCompleted && (
          <div className="mt-3 flex items-center justify-end">
            <button className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded border border-orange-500/20 transition-all">
              <Sparkles className="w-3 h-3" />
              <span>{quest?.actionText || 'Claim Quest XP (Local Engine)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestCard;
