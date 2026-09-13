'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  Sparkles,
  Play,
  Square,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  ChevronRight
} from 'lucide-react';

export interface MockInterviewViewProps {
  onAwardXp?: (amount: number, reason: string) => void;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ onAwardXp }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [waveformBars, setWaveformBars] = useState<number[]>([30, 65, 45, 80, 50, 90, 40, 75, 60, 35, 85, 55, 70, 40]);

  const mockQuestions = [
    {
      id: 'q1',
      title: 'System Design & Scalability',
      question:
        'Explain how you would design a high-throughput, low-latency rate limiter service for a campus placement registration platform handling 50,000 requests per second.',
      suggestedFocus: 'Focus on Redis Token Bucket / Leaky Bucket algorithm, Distributed Lock, and Edge caching.',
    },
    {
      id: 'q2',
      title: 'Data Structures & Algorithms',
      question:
        'Walk through your approach to find the longest substring without repeating characters using the Sliding Window & Two Pointers pattern.',
      suggestedFocus: 'State time complexity O(N) and space complexity O(min(m, n)) with hash map index tracking.',
    },
    {
      id: 'q3',
      title: 'Behavioral & Leadership',
      question:
        'Describe a technical dispute you had during a team project and how you leveraged empirical metrics to reach consensus.',
      suggestedFocus: 'Use STAR method (Situation, Task, Action, Result) with quantitative outcomes.',
    },
  ];

  // Animate audio waveform bars when recording is active
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setWaveformBars(
        Array.from({ length: 16 }, () => Math.floor(Math.random() * 75) + 20)
      );
    }, 150);
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartSession = () => {
    setSessionActive(true);
    setIsRecording(true);
    if (onAwardXp) onAwardXp(50, 'Started Interactive Audio Interview Practice');
  };

  const handleStopSession = () => {
    setIsRecording(false);
    setSessionActive(false);
    if (onAwardXp) onAwardXp(100, 'Completed Audio Response Evaluation');
  };

  const currentQ = mockQuestions[activeQuestionIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Studio View (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Studio Stream Card */}
        <Card variant="accent" className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">AI Voice Interview Portal</h2>
                <p className="text-xs text-zinc-400">On-Device Audio Waveform & Speech-to-Text Integration</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Cloud Privacy
              </span>
            </div>
          </div>

          {/* AI Question Box */}
          <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-orange-400 font-bold flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                AI Interviewer Question #{activeQuestionIndex + 1}
              </span>
              <span className="text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {currentQ.title}
              </span>
            </div>

            <h3 className="text-base font-semibold text-zinc-100 leading-relaxed">
              "{currentQ.question}"
            </h3>

            <div className="p-2.5 bg-orange-500/5 rounded-lg border border-orange-500/10 text-xs text-orange-300/90 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-orange-400">Pro-Tip / Key Pattern: </strong>
                {currentQ.suggestedFocus}
              </div>
            </div>
          </div>

          {/* Audio Waveform Display Box */}
          <div className="bg-zinc-950/80 p-6 rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-4 min-h-[180px]">
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
                {isRecording ? '● Live Edge Speech Input Active' : 'Microphone Idle — Click below to record'}
              </span>
            </div>
          </div>

          {/* Zero-Guide Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {!sessionActive ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                icon={<Play className="w-4 h-4 fill-zinc-950" />}
                onClick={handleStartSession}
              >
                Start Audio Practice Session (Local Engine)
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

      {/* Questions List & Score Drawer (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="accent" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Interview Questions</h3>
            </div>
            <span className="text-[10px] font-mono bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
              3 Prompts
            </span>
          </div>

          <div className="space-y-2">
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

          <div className="pt-2 bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Audio Interview Metrics
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-500 block">Tone Clarity</span>
                <span className="font-mono text-emerald-400 font-bold">92% Optimal</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Pacing (WPM)</span>
                <span className="font-mono text-orange-400 font-bold">142 WPM</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MockInterviewView;
