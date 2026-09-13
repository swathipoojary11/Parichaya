"use client";

import Card from "@/components/ui/Card";
import { getLevelInfo } from "@/lib/services/gamificationService";

export default function LevelBadge({ xp = 0, streakCount = 1 }) {
  const levelInfo = getLevelInfo(xp);

  return (
    <Card glow className="space-y-4 border border-slate-200/90 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Current Tier</span>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Level {levelInfo.levelNumber}: {levelInfo.levelTitle}</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Streak Counter */}
          <div className="px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 flex items-center space-x-1.5 font-mono text-xs text-orange-700 font-bold">
            <span>🔥</span>
            <span>{streakCount} Day Streak</span>
          </div>

          {/* XP Pill */}
          <div className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center space-x-1.5 font-mono text-xs text-indigo-700 font-bold">
            <span>⚡</span>
            <span>{xp} XP Total</span>
          </div>
        </div>
      </div>

      {/* Progress Bar to Next Level */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs font-mono text-slate-600 font-bold">
          <span>Progress to {levelInfo.nextLevelTitle}</span>
          <span className="text-indigo-600 font-bold">{levelInfo.progressPercent}%</span>
        </div>

        <div className="h-2.5 w-full bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500 ease-out"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>

        {levelInfo.xpToNextLevel > 0 && (
          <p className="text-[11px] font-mono text-slate-500 text-right font-medium">
            +{levelInfo.xpToNextLevel} XP needed for next tier
          </p>
        )}
      </div>
    </Card>
  );
}
