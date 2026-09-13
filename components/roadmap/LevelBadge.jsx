"use client";

import Card from "@/components/ui/Card";
import { getLevelInfo } from "@/lib/services/gamificationService";

export default function LevelBadge({ xp = 0, streakCount = 1 }) {
  const levelInfo = getLevelInfo(xp);

  return (
    <Card glow className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Current Tier</span>
          <h2 className="text-xl font-extrabold text-zinc-50 flex items-center space-x-2">
            <span>Level {levelInfo.levelNumber}: {levelInfo.levelTitle}</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Streak Counter */}
          <div className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center space-x-1.5 font-mono text-xs text-orange-400">
            <span>🔥</span>
            <span className="font-bold">{streakCount} Day Streak</span>
          </div>

          {/* XP Pill */}
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center space-x-1.5 font-mono text-xs text-amber-400">
            <span>⚡</span>
            <span className="font-bold">{xp} XP Total</span>
          </div>
        </div>
      </div>

      {/* Progress Bar to Next Level */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
        <div className="flex justify-between text-xs font-mono text-zinc-400">
          <span>Progress to {levelInfo.nextLevelTitle}</span>
          <span className="text-orange-400 font-bold">{levelInfo.progressPercent}%</span>
        </div>

        <div className="h-2.5 w-full bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>

        {levelInfo.xpToNextLevel > 0 && (
          <p className="text-[11px] font-mono text-zinc-500 text-right">
            +{levelInfo.xpToNextLevel} XP needed for next level
          </p>
        )}
      </div>
    </Card>
  );
}
