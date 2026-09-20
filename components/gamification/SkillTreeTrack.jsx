'use client';

import React from 'react';
import LevelNode from './LevelNode';

export const SkillTreeTrack = ({
  stages = [],
  completedStageIds = [],
  currentStageId = 1,
  onSelectStage,
}) => {
  // Determine status for each stage node on the world map
  const getStageStatus = (stage) => {
    if (completedStageIds.includes(stage.id)) return 'completed';
    if (stage.id === 1 || stage.id === currentStageId || completedStageIds.includes(stage.id - 1)) {
      return 'unlocked';
    }
    return 'locked';
  };

  // Horizontal zig-zag offsets for Duolingo-style path alignment
  const nodeOffsets = [
    'translate-x-0', // Stage 1 (Center)
    '-translate-x-16 sm:-translate-x-24', // Stage 2 (Left)
    'translate-x-16 sm:translate-x-24', // Stage 3 (Right)
    'translate-x-0', // Stage 4 (Center - Boss)
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto py-8 flex flex-col items-center justify-center space-y-16">
      {/* Background SVG connecting track line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-800" strokeWidth="4">
        <path
          d="M 280 60 Q 180 180 180 260 T 380 460 T 280 660"
          fill="transparent"
          className="stroke-orange-500/30 stroke-[4] stroke-dasharray-[8_8] animate-pulse"
        />
      </svg>

      {/* Nodes Stack */}
      {stages.map((stage, idx) => {
        const status = getStageStatus(stage);
        const offsetClass = nodeOffsets[idx % nodeOffsets.length];

        return (
          <div key={stage.id} className={`relative z-10 ${offsetClass} transition-all duration-300`}>
            <LevelNode stage={stage} status={status} onSelectStage={onSelectStage} />
          </div>
        );
      })}
    </div>
  );
};

export default SkillTreeTrack;
