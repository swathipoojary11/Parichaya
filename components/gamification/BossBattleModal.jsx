'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from './soundEffects';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  Swords,
  X,
  Sparkles,
  Timer,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Trophy,
  Bot
} from 'lucide-react';

export const BossBattleModal = ({
  stage,
  soundEnabled = true,
  onClose,
  onStageComplete,
}) => {
  const [bossHp, setBossHp] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [shake, setShake] = useState(false);

  // Inputs for X-Y-Z formula attack strikes
  const [metricX, setMetricX] = useState('Reduced background async job latency by 45%');
  const [metricY, setMetricY] = useState('processed 100,000+ requests/min at sub-10ms response');
  const [metricZ, setMetricZ] = useState('architected Redis pub/sub queue with Node.js worker pools');

  const [xUsed, setXUsed] = useState(false);
  const [yUsed, setYUsed] = useState(false);
  const [zUsed, setZUsed] = useState(false);

  // Timer Countdown Effect
  useEffect(() => {
    if (bossDefeated || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, bossDefeated]);

  const triggerScreenShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleAttackX = () => {
    if (xUsed || !metricX.trim()) return;
    setXUsed(true);
    triggerScreenShake();
    playSound('boss_hit', soundEnabled);
    applyDamage(35);
  };

  const handleAttackY = () => {
    if (yUsed || !metricY.trim()) return;
    setYUsed(true);
    triggerScreenShake();
    playSound('boss_hit', soundEnabled);
    applyDamage(35);
  };

  const handleAttackZ = () => {
    if (zUsed || !metricZ.trim()) return;
    setZUsed(true);
    triggerScreenShake();
    playSound('boss_hit', soundEnabled);
    applyDamage(30);
  };

  const applyDamage = (damage) => {
    setBossHp((prev) => {
      const newHp = Math.max(0, prev - damage);
      if (newHp === 0) {
        handleBossDefeated();
      }
      return newHp;
    });
  };

  const handleBossDefeated = () => {
    setBossDefeated(true);
    playSound('victory', soundEnabled);

    // Full Screen Confetti Burst
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#F97316', '#FB923C', '#10B981', '#F59E0B'],
      disableForReducedMotion: true,
    });
  };

  const handleClaimVictory = () => {
    onStageComplete(stage.id, stage.xp || 200);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full bg-zinc-950 p-6 rounded-2xl border border-orange-500/40 shadow-2xl space-y-6 transition-all ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                FINAL BOSS BATTLE: ATS Keyword Filter Boss
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                  +{stage.xp || 200} XP
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Execute Google X-Y-Z formula strikes under 60s to defeat the resume parser boss!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Boss Health Bar Card */}
        <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-red-400 font-bold flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-orange-500" />
              ATS Resume Filter Boss
            </span>
            <span className="text-orange-400 font-bold">
              {bossHp} / 100 HP {bossDefeated ? '(DEFEATED!)' : ''}
            </span>
          </div>

          {/* Health Bar */}
          <div className="h-4 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${bossHp}%` }}
            />
          </div>
        </div>

        {/* Attack Actions - Google X-Y-Z Formula Strike Inputs */}
        {!bossDefeated ? (
          <div className="space-y-3">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Select & Launch Google X-Y-Z Formula Strikes:
            </div>

            {/* Strike X */}
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-orange-400">Strike X: Accomplishment Metric (-35 HP)</span>
                {xUsed && <span className="text-[10px] text-emerald-400 font-mono">✓ Strike Delivered</span>}
              </div>
              <input
                type="text"
                value={metricX}
                onChange={(e) => setMetricX(e.target.value)}
                disabled={xUsed}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <Button
                size="sm"
                disabled={xUsed}
                onClick={handleAttackX}
                className="w-full text-xs"
                icon={<Flame className="w-3.5 h-3.5 text-zinc-950" />}
              >
                {xUsed ? 'Strike Delivered' : 'Launch Accomplishment Strike (-35 HP)'}
              </Button>
            </div>

            {/* Strike Y */}
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-amber-400">Strike Y: Scale Benchmark (-35 HP)</span>
                {yUsed && <span className="text-[10px] text-emerald-400 font-mono">✓ Strike Delivered</span>}
              </div>
              <input
                type="text"
                value={metricY}
                onChange={(e) => setMetricY(e.target.value)}
                disabled={yUsed}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <Button
                size="sm"
                disabled={yUsed}
                onClick={handleAttackY}
                className="w-full text-xs"
                icon={<Flame className="w-3.5 h-3.5 text-zinc-950" />}
              >
                {yUsed ? 'Strike Delivered' : 'Launch Scale Benchmark Strike (-35 HP)'}
              </Button>
            </div>

            {/* Strike Z */}
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-emerald-400">Strike Z: Technical Method (-30 HP)</span>
                {zUsed && <span className="text-[10px] text-emerald-400 font-mono">✓ Strike Delivered</span>}
              </div>
              <input
                type="text"
                value={metricZ}
                onChange={(e) => setMetricZ(e.target.value)}
                disabled={zUsed}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <Button
                size="sm"
                disabled={zUsed}
                onClick={handleAttackZ}
                className="w-full text-xs"
                icon={<Flame className="w-3.5 h-3.5 text-zinc-950" />}
              >
                {zUsed ? 'Strike Delivered' : 'Launch Technical Method Strike (-30 HP)'}
              </Button>
            </div>
          </div>
        ) : (
          /* Victory Card */
          <div className="bg-emerald-950/30 p-6 rounded-xl border border-emerald-500/50 text-center space-y-3">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-white">VICTORY! ATS BOSS DEFEATED</h4>
            <p className="text-xs text-zinc-300">
              Your Google X-Y-Z formula metrics pierced through the ATS automated filter rules with a 100% match score!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-500 font-mono">
            Zero-Cloud Local Boss Battle Engine
          </div>

          {bossDefeated ? (
            <Button
              variant="emerald"
              icon={<Sparkles className="w-4 h-4 text-zinc-950" />}
              onClick={handleClaimVictory}
            >
              Claim Boss Reward (+{stage.xp || 200} XP)
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose}>
              Retreat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BossBattleModal;
