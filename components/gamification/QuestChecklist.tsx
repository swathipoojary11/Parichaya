'use client';

import React, { useState } from 'react';
import { QuestCard } from './QuestCard';
import { Quest, RankTier } from '@/types';
import { Card } from '@/components/ui/Card';
import { Trophy, Zap, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface QuestChecklistProps {
  quests: Quest[];
  totalXp: number;
  currentRank: RankTier;
  onCompleteQuest: (questId: string, xp: number) => void;
}

export const QuestChecklist: React.FC<QuestChecklistProps> = ({
  quests,
  totalXp,
  currentRank,
  onCompleteQuest,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Skill Gap', 'LeetCode Pattern', 'Resume Enhancement', 'Interview Prep'];

  const filteredQuests = quests.filter((q) => {
    if (activeCategory === 'All') return true;
    return q.category === activeCategory;
  });

  const completedCount = quests.filter((q) => q.isCompleted).length;
  const totalCount = quests.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Strict Rank progression mapping: Novice (<300 XP) -> Apprentice (300-700 XP) -> Job-Ready (700+ XP)
  const rankThresholds: Record<RankTier, { next: RankTier | 'Max Tier'; targetXp: number }> = {
    Novice: { next: 'Apprentice', targetXp: 300 },
    Apprentice: { next: 'Job-Ready', targetXp: 700 },
    'Job-Ready': { next: 'Max Tier', targetXp: 1000 },
  };

  const currentThreshold = rankThresholds[currentRank] || { next: 'Job-Ready', targetXp: 700 };
  const progressToNextRank = Math.min(100, Math.round((totalXp / currentThreshold.targetXp) * 100));

  return (
    <Card variant="accent" className="w-full space-y-6">
      {/* Header & Rank Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Gamified Career Quests</h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Active Remediation Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Complete target skill gaps & coding patterns to boost your ATS placement readiness
            </p>
          </div>
        </div>

        {/* Current Level Pill */}
        <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 self-stretch md:self-auto justify-between">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-zinc-400">Placement Rank Tier</div>
            <div className="text-sm font-bold font-mono text-orange-400 flex items-center justify-end gap-1">
              <Zap className="w-3.5 h-3.5 fill-orange-400" />
              {currentRank}
            </div>
          </div>
          <div className="pl-3 border-l border-zinc-800 text-right">
            <div className="text-[10px] uppercase font-mono text-zinc-400">Total XP Gained</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {totalXp} XP
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar to Next Rank Tier */}
      <div className="space-y-2 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Rank Progression: <strong className="text-zinc-200">{currentRank}</strong> &rarr;{' '}
            <span className="text-orange-400">{currentThreshold.next}</span>
          </span>
          <span className="font-mono text-orange-400 font-semibold">
            {totalXp} / {currentThreshold.targetXp} XP ({progressToNextRank}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressToNextRank}%` }}
          />
        </div>
      </div>

      {/* Category Tabs & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500 text-zinc-950 font-bold shadow-sm shadow-orange-500/20'
                  : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 font-mono flex items-center gap-2 self-end sm:self-auto shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>
            {completedCount}/{totalCount} Completed ({completionPercentage}%)
          </span>
        </div>
      </div>

      {/* Quest Cards Feed */}
      <div className="space-y-3">
        {filteredQuests.length > 0 ? (
          filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onComplete={onCompleteQuest} />
          ))
        ) : (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono bg-zinc-950/40 rounded-lg border border-dashed border-zinc-800">
            No quests found in category "{activeCategory}".
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80">
        <span>● Zero-Cloud On-Device Remediation Engine</span>
        <span>Click quest card to trigger instant XP reward & confetti burst</span>
      </div>
    </Card>
  );
};

export default QuestChecklist;
