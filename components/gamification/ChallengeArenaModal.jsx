'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from './soundEffects';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  X,
  Sparkles,
  Timer,
  Heart,
  AlertCircle,
  CheckCircle2,
  Bug,
  Cpu,
  Server,
  Zap,
  RotateCcw
} from 'lucide-react';

export const ChallengeArenaModal = ({
  stage,
  soundEnabled = true,
  onClose,
  onStageComplete,
  onDeductLife,
}) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isError, setIsError] = useState(false);

  // Stage 1 Bug Hunt lines state
  const [selectedLine, setSelectedLine] = useState(null);

  // Stage 2 DP Recurrence option state
  const [selectedDpOption, setSelectedDpOption] = useState(null);

  // Stage 3 System Scaler placement state
  const [redisPlaced, setRedisPlaced] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (gameCompleted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameCompleted]);

  const handleTimeOut = () => {
    setIsError(true);
    setFeedbackMsg('⏰ Time expired! Lose 1 Life heart.');
    playSound('wrong', soundEnabled);
    if (onDeductLife) onDeductLife();
  };

  // Stage 1: Bug Hunt click handler
  const handleBugLineClick = (lineIndex, isBuggy) => {
    if (gameCompleted) return;
    setSelectedLine(lineIndex);

    if (isBuggy) {
      triggerVictory('🐛 Patch Applied! Two Pointers pointer boundary fixed.');
    } else {
      setIsError(true);
      setFeedbackMsg('❌ Incorrect line! That code is syntactically valid.');
      playSound('wrong', soundEnabled);
      if (onDeductLife) onDeductLife();
    }
  };

  // Stage 2: DP Recurrence selection handler
  const handleDpOptionClick = (optionId, isCorrect) => {
    if (gameCompleted) return;
    setSelectedDpOption(optionId);

    if (isCorrect) {
      triggerVictory('⚡ Recurrence Equation Verified! Top-down DP table initialized.');
    } else {
      setIsError(true);
      setFeedbackMsg('❌ Subproblem overlap mismatch! Try the standard memoization relation.');
      playSound('wrong', soundEnabled);
      if (onDeductLife) onDeductLife();
    }
  };

  // Stage 3: System Scaler click handler
  const handlePlaceRedis = () => {
    if (gameCompleted) return;
    setRedisPlaced(true);
    triggerVictory('🚀 Redis Cluster Inserted! Absorbed 50,000 QPS load spike with sub-5ms latency.');
  };

  // Victory Handler
  const triggerVictory = (msg) => {
    setGameCompleted(true);
    setIsError(false);
    setFeedbackMsg(msg);
    playSound('victory', soundEnabled);

    // Full-screen canvas-confetti burst
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F97316', '#FB923C', '#10B981', '#F59E0B'],
      disableForReducedMotion: true,
    });
  };

  const handleClaimReward = () => {
    onStageComplete(stage.id, stage.xp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Stage {stage.stageNum}: {stage.title}
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  +{stage.xp} XP
                </span>
              </h3>
              <p className="text-xs text-zinc-400">{stage.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-orange-400">
              <Timer className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Message Bar */}
        {feedbackMsg && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              isError
                ? 'bg-red-950/20 border-red-500/30 text-red-400'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Game Stage Interactive Playgrounds */}

        {/* STAGE 1: BUG HUNT */}
        {stage.stageNum === 1 && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-orange-400" />
              <span>Click the buggy code line below to patch the pointer overflow bug:</span>
            </div>

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 font-mono text-xs space-y-1">
              {[
                { text: '1: function maxArea(height) {', buggy: false },
                { text: '2:   let left = 0, right = height.length - 1;', buggy: false },
                { text: '3:   while (left <= right) { // Buggy boundary causing index out-of-bounds', buggy: true },
                { text: '4:     let area = Math.min(height[left], height[right]) * (right - left);', buggy: false },
                { text: '5:     if (height[left] < height[right]) left++; else right--;', buggy: false },
                { text: '6:   }', buggy: false },
              ].map((line, idx) => (
                <div
                  key={idx}
                  onClick={() => handleBugLineClick(idx, line.buggy)}
                  className={`p-2 rounded cursor-pointer transition-all ${
                    selectedLine === idx
                      ? line.buggy
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 2: ALGORITHMIC DUNGEON (DP RECURRENCE) */}
        {stage.stageNum === 2 && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Select the correct recurrence relation for 1D Dynamic Programming memoization:</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                {
                  id: 'op-1',
                  code: 'dp[i] = dp[i-1] + dp[i-2]',
                  label: 'Fibonacci / Climbing Stairs Subproblem State',
                  correct: true,
                },
                {
                  id: 'op-2',
                  code: 'dp[i] = Math.max(dp[i], dp[i] * 2)',
                  label: 'Exponential Factor State (Non-Optimal)',
                  correct: false,
                },
                {
                  id: 'op-3',
                  code: 'dp[i] = dp[i] + Math.random()',
                  label: 'Unstable Non-Deterministic Recurrence',
                  correct: false,
                },
              ].map((op) => (
                <button
                  key={op.id}
                  onClick={() => handleDpOptionClick(op.id, op.correct)}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                    selectedDpOption === op.id
                      ? op.correct
                        ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-red-950/30 border-red-500 text-red-300'
                      : 'bg-zinc-900 border-zinc-800 hover:border-orange-500/40 text-zinc-200'
                  }`}
                >
                  <div className="font-mono text-orange-400 font-bold mb-1">{op.code}</div>
                  <div className="text-[11px] text-zinc-400">{op.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 3: SYSTEM SCALER (REDIS CACHE PLACEMENT) */}
        {stage.stageNum === 3 && (
          <div className="space-y-4 text-center">
            <div className="text-xs text-zinc-300 font-medium flex items-center justify-center gap-1.5">
              <Server className="w-4 h-4 text-orange-400" />
              <span>Insert Redis Distributed Caching Layer to intercept 50,000 QPS DB load spike:</span>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-around gap-4">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-white">
                <div>🌐 Client Apps</div>
                <div className="text-[10px] text-zinc-500 mt-1">50,000 req/sec</div>
              </div>

              <div className="text-orange-500 font-bold font-mono text-sm">&rarr;</div>

              {/* Cache Slot Drop Zone */}
              <div
                onClick={handlePlaceRedis}
                className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  redisPlaced
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-mono font-bold'
                    : 'bg-orange-500/10 border-orange-500/50 text-orange-400 hover:bg-orange-500/20 animate-pulse'
                }`}
              >
                {redisPlaced ? (
                  <div className="flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>⚡ Redis Distributed Cache (Active)</span>
                  </div>
                ) : (
                  <div className="text-xs font-mono font-bold">
                    + Click to Deploy Redis Cache Cluster
                  </div>
                )}
              </div>

              <div className="text-orange-500 font-bold font-mono text-sm">&rarr;</div>

              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-white">
                <div>🗄️ PostgreSQL DB</div>
                <div className="text-[10px] text-zinc-500 mt-1">Safe Load</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-500 font-mono">
            Zero-Cloud Local Micro-Challenge Engine
          </div>

          {gameCompleted ? (
            <Button
              variant="emerald"
              icon={<Sparkles className="w-4 h-4 text-zinc-950" />}
              onClick={handleClaimReward}
            >
              Claim Stage Reward (+{stage.xp} XP)
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose}>
              Cancel Stage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeArenaModal;
