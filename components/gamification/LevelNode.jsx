'use client';

import React from 'react';
import { Check, Lock, Play, Swords, Code2, Cpu, Zap, Trophy } from 'lucide-react';

export const LevelNode = ({ stage, status = 'locked', onSelectStage }) => {
  const isCompleted = status === 'completed';
  const isUnlocked = status === 'unlocked';
  const isLocked = status === 'locked';

  const iconMap = {
    code: Code2,
    cpu: Cpu,
    zap: Zap,
    swords: Swords,
  };

  const IconComponent = iconMap[stage.icon] || Code2;

  // Node container styling based on status
  let nodeStyle = 'border-zinc-800 bg-zinc-900/60 text-zinc-600 cursor-not-allowed opacity-60';
  if (isCompleted) {
    nodeStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-400 shadow-lg shadow-emerald-500/20 hover:border-emerald-400 cursor-pointer';
  } else if (isUnlocked) {
    nodeStyle = 'border-orange-500 bg-orange-500/10 text-orange-400 shadow-xl shadow-orange-500/40 animate-bounce cursor-pointer hover:scale-105';
  }

  return (
    <div className="relative flex flex-col items-center group select-none">
      {/* Dynamic Pulse Glow Background for Unlocked Stage */}
      {isUnlocked && (
        <span className="absolute -inset-2 rounded-full bg-orange-500/20 animate-ping pointer-events-none" />
      )}

      {/* Main Node Circle */}
      <button
        disabled={isLocked}
        onClick={() => onSelectStage(stage)}
        className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${nodeStyle}`}
      >
        {isCompleted ? (
          <Check className="w-8 h-8 text-emerald-400 font-bold" />
        ) : isUnlocked ? (
          <IconComponent className="w-8 h-8 text-orange-400 fill-orange-500/20" />
        ) : (
          <Lock className="w-6 h-6 text-zinc-600" />
        )}
      </button>

      {/* Node Info Label Box */}
      <div className="mt-2 text-center max-w-[150px]">
        <div className="text-xs font-bold font-mono text-white tracking-tight flex items-center justify-center gap-1">
          {stage.title}
        </div>
        <div className="text-[10px] font-mono text-orange-400/90 font-semibold">
          {stage.tier}
        </div>

        {/* Action Badge */}
        {isUnlocked && (
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/30">
            <Play className="w-2.5 h-2.5 fill-zinc-950" />
            Start Stage
          </span>
        )}

        {isCompleted && (
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Replay (+{stage.xp} XP)
          </span>
        )}

        {isLocked && (
          <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            Unlock at Stage {stage.stageNum - 1}
          </span>
        )}
      </div>
    </div>
  );
};

export default LevelNode;
