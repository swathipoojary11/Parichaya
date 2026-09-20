'use client';

import React from 'react';
import { Flame, Heart, Zap, Trophy, Volume2, VolumeX, ShieldCheck, Sparkles } from 'lucide-react';

export const GameHUD = ({
  xp = 450,
  rankTier = 'Apprentice',
  lives = 5,
  maxLives = 5,
  streakDays = 3,
  comboMultiplier = 1.5,
  soundEnabled = true,
  onToggleSound,
}) => {
  // Rank threshold percentages
  const rankThresholds = {
    Novice: { targetXp: 300 },
    Apprentice: { targetXp: 700 },
    'Job-Ready': { targetXp: 1000 },
  };

  const currentTarget = rankThresholds[rankTier]?.targetXp || 700;
  const progressPct = Math.min(100, Math.round((xp / currentTarget) * 100));

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-4">
      {/* Top Row: Vitals & HUD Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Flame Streak & Hearts */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold shadow-sm">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500" />
            <span>{streakDays}-Day Streak</span>
          </div>

          {/* Hearts / Energy Lives */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-mono font-bold">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 transition-all ${
                  i < lives ? 'text-red-500 fill-red-500 scale-100' : 'text-zinc-700 fill-zinc-800 scale-90'
                }`}
              />
            ))}
            <span className="ml-1 text-red-400 font-mono text-[11px]">{lives}/{maxLives}</span>
          </div>
        </div>

        {/* Right: XP Counter, Combo Multiplier & Mute Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Combo Multiplier Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{comboMultiplier}x Combo</span>
          </div>

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span>{xp} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
            title={soundEnabled ? 'Mute Web Audio SFX' : 'Enable Web Audio SFX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>
      </div>

      {/* Bottom Progress Bar: Rank Progression */}
      <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            Placement Rank: <strong className="text-white">{rankTier}</strong>
          </span>
          <span className="text-orange-400 font-bold">
            {xp} / {currentTarget} XP ({progressPct}%)
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
