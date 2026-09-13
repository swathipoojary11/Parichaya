'use client';

import React from 'react';
import { RankTier } from '@/types';

export interface ScoreGaugeProps {
  score: number; // 0 to 100
  rankTier?: RankTier | string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  rankTier = 'Job-Ready',
  size = 190,
  strokeWidth = 12,
  label = 'ATS READINESS',
}) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background stroke ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-zinc-800"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress stroke ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-orange-500 transition-all duration-700 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      
      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-4xl font-bold text-white tracking-tight font-mono">
          {clampedScore}%
        </span>
        <span className="text-xs text-orange-400 font-mono tracking-wider font-semibold uppercase mt-0.5">
          {rankTier}
        </span>
        {label && (
          <span className="text-[9px] text-zinc-500 font-mono uppercase mt-1 tracking-widest">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreGauge;
