'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Mic,
  MicOff,
  Bot,
  Play,
  Square,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  ChevronRight,
  WifiOff,
  Sparkles,
  Layers
} from 'lucide-react';

export interface MockInterviewPlaceholderProps {
  onAwardXp?: (amount: number, reason: string) => void;
}

export const MockInterviewPlaceholder: React.FC<MockInterviewPlaceholderProps> = ({ onAwardXp }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [wpmCadence, setWpmCadence] = useState<number>(145);
  const [waveformBars, setWaveformBars] = useState<number[]>([30, 65, 45, 80, 50, 90, 40, 75, 60, 35, 85, 55, 70, 40]);

  const mockQuestions = [
    {
      id: 'q1',
      title: 'System Design & Scalability',
      question:
        'Explain how you would design a high-throughput rate limiter service for campus recruitment handling 50,000 requests/sec.',
      focus: 'Focus on Redis Token Bucket algorithm, Distributed Locks, and Edge caching.',
    },
    {
      id: 'q2',
      title: 'Algorithmic Patterns',
      question:
        'Walk through your approach to find the longest substring without repeating characters using Two Pointers & Hash Maps.',
      focus: 'State O(N) time complexity and O(min(m, n)) space complexity.',
    },
    {
      id: 'q3',
      title: 'Behavioral Impact',
      question:
        'Describe a technical dispute during a team project and how you leveraged empirical metrics to reach consensus.',
      focus: 'Use STAR method with quantitative metrics.',
    },
  ];

  // Animate audio waveform bars when session is active
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setWaveformBars(
        Array.from({ length: 16 }, () => Math.floor(Math.random() * 75) + 20)
      );
      setWpmCadence(Math.floor(Math.random() * 30) + 130);
    }, 150);
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartSession = () => {
    setSessionActive(true);
    setIsRecording(true);
    if (onAwardXp) onAwardXp(50, 'Started Local WebSocket Audio Session');
  };

  const handleStopSession = () => {
    setIsRecording(false);
    setSessionActive(false);
    if (onAwardXp) onAwardXp(100, 'Completed Voice Response Evaluation');
  };

  const currentQ = mockQuestions[activeQuestionIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Studio View (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        <Card variant="accent" className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Mock Interview Portal (Audio Stream)</h2>
                <p className="text-xs text-zinc-400">WebSocket Integration Placeholder for Member 3</p>
              </div>
            </div>

            {/* Edge WebSocket Connection Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-300">
                <strong className="text-orange-400">ws://127.0.0.1:3001</strong> (Offline Manifest V3)
              </span>
            </div>
          </div>

          {/* AI Question Box */}
          <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-orange-400 font-bold flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                Prompt #{activeQuestionIndex + 1}: {currentQ.title}
              </span>
              <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Local WebSocket Endpoint
              </span>
            </div>

            <h3 className="text-base font-semibold text-zinc-100 leading-relaxed">
              "{currentQ.question}"
            </h3>

            <div className="p-2.5 bg-orange-500/5 rounded-lg border border-orange-500/10 text-xs text-orange-300/90 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-orange-400">Expected Key Pattern: </strong>
                {currentQ.focus}
              </div>
            </div>
          </div>

          {/* Voice Cadence & WPM Waveform Visualizer */}
          <div className="bg-zinc-950/80 p-6 rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-4 min-h-[190px]">
            <div className="flex items-center justify-between w-full text-xs font-mono px-2 text-zinc-400">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                Speech Cadence: <strong className="text-emerald-400 font-bold">{wpmCadence} WPM</strong>
              </span>
              <span className="text-orange-400 font-bold">
                {isRecording ? 'STREAMING ACTIVE' : 'STREAM IDLE'}
              </span>
            </div>

            {/* Audio Waveform visualizer bars */}
            <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md">
              {waveformBars.map((height, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 rounded-full transition-all duration-150 ${
                    isRecording
                      ? 'bg-gradient-to-t from-orange-600 via-orange-400 to-amber-300'
                      : 'bg-zinc-800 h-3'
                  }`}
                  style={{ height: isRecording ? `${height}%` : '12px' }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <Activity className={`w-4 h-4 ${isRecording ? 'text-orange-400 animate-pulse' : 'text-zinc-600'}`} />
              <span className={isRecording ? 'text-orange-400 font-bold' : 'text-zinc-500'}>
                {isRecording ? '● Local Speech-to-Text Audio Buffer Active' : 'Mic Idle — Launch session below'}
              </span>
            </div>
          </div>

          {/* Component A Spec Button: Start Low-Latency Session (Local WebSocket) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {!sessionActive ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                icon={<Play className="w-4 h-4 fill-zinc-950" />}
                onClick={handleStartSession}
              >
                Start Low-Latency Session (Local WebSocket)
              </Button>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="emerald"
                  className="flex-1 sm:flex-initial"
                  icon={<Square className="w-4 h-4 fill-zinc-950" />}
                  onClick={handleStopSession}
                >
                  Submit Voice Response (Edge Processing)
                </Button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2.5 rounded-lg border transition-colors ${
                    isRecording
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveQuestionIndex((prev) => (prev + 1) % mockQuestions.length)}
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800/60 px-3 py-2 rounded-lg border border-zinc-700/50 transition-colors w-full sm:w-auto justify-center"
            >
              <span>Next Technical Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </div>

      {/* Member 3 WebSocket Engine Info Card (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="accent" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Member 3 Engine Bridge</h3>
            </div>
            <span className="text-[10px] font-mono bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
              WebSocket Layer
            </span>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-2">
            <div className="font-mono text-orange-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Manifest V3 Local Bridge
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Provides zero-latency PCM audio streaming buffer at <code className="text-orange-400">ws://127.0.0.1:3001</code> for on-device transcript generation.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-white mb-1">Available Practice Prompts:</div>
            {mockQuestions.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  activeQuestionIndex === idx
                    ? 'bg-zinc-900 border-orange-500/50 text-white'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="font-mono text-[10px] text-orange-400 mb-1">
                  Q{idx + 1}: {q.title}
                </div>
                <div className="line-clamp-2 font-medium">{q.question}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MockInterviewPlaceholder;
