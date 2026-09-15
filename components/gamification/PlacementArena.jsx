'use client';

import React, { useState, useEffect } from 'react';
import GameHUD from './GameHUD';
import SkillTreeTrack from './SkillTreeTrack';
import InteractiveQuizModal from './InteractiveQuizModal';
import { Card } from '../ui/Card';
import { Trophy, ShieldCheck, RotateCcw } from 'lucide-react';

export const PlacementArena = ({
  globalXp = 450,
  currentRankTier = 'Apprentice',
  onAwardXp,
}) => {
  // Game state initialized strictly to Stage 1 for fresh player sessions
  const [completedStageIds, setCompletedStageIds] = useState([]);
  const [currentStageId, setCurrentStageId] = useState(1);
  const [lives, setLives] = useState(5);
  const [streakDays, setStreakDays] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [activeModalStage, setActiveModalStage] = useState(null);

  // Define World Map Stages
  const stages = [
    {
      id: 1,
      stageNum: 1,
      title: 'Stage 1: Logic Gates',
      tier: 'Novice Tier',
      xp: 300,
      icon: 'code',
      description: '6 Logic & Syntax Questions: Two-Pointers, Scoping, and JavaScript Foundations.',
    },
    {
      id: 2,
      stageNum: 2,
      title: 'Stage 2: Algorithmic Dungeon',
      tier: 'Apprentice Tier',
      xp: 300,
      icon: 'cpu',
      description: '6 Algorithmic Questions: Dynamic Programming, Reconciliation Keys & Debouncing.',
    },
    {
      id: 3,
      stageNum: 3,
      title: 'Stage 3: System Scaler',
      tier: 'Apprentice Tier',
      xp: 300,
      icon: 'zap',
      description: '6 System Architecture Questions: Node.js Event Loop, Redis Caching & REST Idempotency.',
    },
    {
      id: 4,
      stageNum: 4,
      title: 'Stage 4: Google X-Y-Z Boss Battle',
      tier: 'Job-Ready Tier (Final Boss)',
      xp: 300,
      icon: 'swords',
      description: 'Final Boss Fight: 6 System & Resume Architecture Questions to reach Job-Ready Rank!',
    },
  ];

  // Safely load progress from localStorage on mount (strictly falling back to Stage 1)
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('parichaya_arena_state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (Array.isArray(parsed.completedStageIds)) {
          setCompletedStageIds(parsed.completedStageIds);
        } else {
          setCompletedStageIds([]);
        }

        const savedStage = parseInt(parsed.currentStageId, 10);
        if (!isNaN(savedStage) && savedStage >= 1 && savedStage <= 4) {
          setCurrentStageId(savedStage);
        } else {
          setCurrentStageId(1);
        }

        if (parsed.lives !== undefined) setLives(parsed.lives);
        if (parsed.streakDays !== undefined) setStreakDays(parsed.streakDays);
        if (parsed.soundEnabled !== undefined) setSoundEnabled(parsed.soundEnabled);
      } else {
        // Fallback key check
        const singleKeyStage = parseInt(localStorage.getItem('placement_unlocked_stage'), 10);
        if (!isNaN(singleKeyStage) && singleKeyStage >= 1 && singleKeyStage <= 4) {
          setCurrentStageId(singleKeyStage);
        } else {
          setCurrentStageId(1);
          localStorage.setItem('placement_unlocked_stage', '1');
        }
        setCompletedStageIds([]);
      }
    } catch (e) {
      setCompletedStageIds([]);
      setCurrentStageId(1);
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        completedStageIds,
        currentStageId,
        lives,
        streakDays,
        soundEnabled,
      };
      localStorage.setItem('parichaya_arena_state', JSON.stringify(stateToSave));
      localStorage.setItem('placement_unlocked_stage', currentStageId.toString());
    } catch (e) {
      // LocalStorage access fallback
    }
  }, [completedStageIds, currentStageId, lives, streakDays, soundEnabled]);

  const handleSelectStage = (stage) => {
    setActiveModalStage(stage);
  };

  const handleStageComplete = (stageId, xpReward) => {
    if (!completedStageIds.includes(stageId)) {
      setCompletedStageIds((prev) => [...prev, stageId]);
      setCurrentStageId(Math.min(stages.length, stageId + 1));
    }
    if (onAwardXp) {
      onAwardXp(xpReward, `Completed Stage ${stageId} in Placement Arena`);
    }
  };

  const handleProceedToNextStage = (nextStageId) => {
    const nextStage = stages.find((s) => s.id === nextStageId);
    if (nextStage) {
      setActiveModalStage(nextStage);
    } else {
      setActiveModalStage(null);
    }
  };

  // Reset Progress Debug Control: Clears storage & sets player back to Stage 1
  const handleResetArena = () => {
    setCompletedStageIds([]);
    setCurrentStageId(1);
    setLives(5);
    try {
      localStorage.removeItem('parichaya_arena_state');
      localStorage.removeItem('placement_unlocked_stage');
      localStorage.removeItem('placement_arena_xp');
    } catch (e) {}
  };

  return (
    <Card variant="accent" className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Placement Arena RPG</h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Duolingo-Style Quiz Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Conquer algorithmic dungeon stages & defeat the ATS Boss to reach Job-Ready rank!
            </p>
          </div>
        </div>

        <button
          onClick={handleResetArena}
          className="text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-1 self-end sm:self-auto cursor-pointer hover:bg-zinc-800 transition-colors"
          title="Reset player progress to Stage 1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Arena Progress
        </button>
      </div>

      {/* Game HUD */}
      <GameHUD
        xp={globalXp}
        rankTier={currentRankTier}
        lives={lives}
        maxLives={5}
        streakDays={streakDays}
        comboMultiplier={1.5}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Skill Tree Track World Map */}
      <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800/80 min-h-[460px] flex items-center justify-center">
        <SkillTreeTrack
          stages={stages}
          completedStageIds={completedStageIds}
          currentStageId={currentStageId}
          onSelectStage={handleSelectStage}
        />
      </div>

      {/* Duolingo-Style Interactive Quiz Modal */}
      {activeModalStage && (
        <InteractiveQuizModal
          stage={activeModalStage}
          stages={stages}
          soundEnabled={soundEnabled}
          onClose={() => setActiveModalStage(null)}
          onStageComplete={handleStageComplete}
          onProceedToNextStage={handleProceedToNextStage}
        />
      )}
    </Card>
  );
};

export default PlacementArena;
