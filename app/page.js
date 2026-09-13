"use client";

import { useEffect, useState } from "react";
import { checkOllamaHealth } from "@/lib/ollama";
import { openDB } from "@/lib/db";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import QuestCard from "@/components/ui/QuestCard";
import ReadinessMeter from "@/components/ui/ReadinessMeter";

export default function Home() {
  const [ollamaStatus, setOllamaStatus] = useState({ checking: true, ok: false });
  const [dbStatus, setDbStatus] = useState({ checking: true, ok: false });

  const sampleQuest = {
    title: "Master Real-Time Event Patterns",
    description: "Learn sliding window / event buffer patterns for high-frequency WebSocket data handling.",
    xpReward: 100,
    leetCodePattern: "Sliding Window",
    status: "pending",
    recommendedProblems: [
      { title: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" }
    ]
  };

  useEffect(() => {
    async function verifyConnections() {
      // Check Ollama Local AI Daemon
      const ollamaRes = await checkOllamaHealth();
      setOllamaStatus({ checking: false, ok: ollamaRes.ok, details: ollamaRes });

      // Check IndexedDB Initialization
      try {
        await openDB();
        setDbStatus({ checking: false, ok: true });
      } catch (err) {
        setDbStatus({ checking: false, ok: false, error: err.message });
      }
    }

    verifyConnections();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-4 glow-orange">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono border border-orange-500/20">
          <span>● Phase 1 Skeleton & Design System Active</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
          Welcome to <span className="text-orange-500">AURA</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl leading-relaxed">
          Your local-first, privacy-focused career acceleration engine. Prepare resumes, conduct live video/voice mock interviews, and master algorithm quest roadmaps — entirely on your device.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button variant="primary">Start Voice Session</Button>
          <Button variant="outline">Audit Resume</Button>
          <Button variant="secondary">Generate Improvement Roadmap</Button>
        </div>
      </div>

      {/* Connectivity & Health Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Local AI Engine (Ollama)" subtitle="http://127.0.0.1:11434">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              Target Model: <code className="font-mono text-orange-400">qwen2.5:3b</code>
            </p>
            <div className="text-xs font-mono">
              {ollamaStatus.checking ? (
                <span className="text-amber-400">Checking Ollama daemon...</span>
              ) : ollamaStatus.ok ? (
                <span className="text-emerald-400">✓ Connected — Qwen2.5 3B local model detected</span>
              ) : (
                <span className="text-red-400">✗ Disconnected — Ensure Ollama service is running locally</span>
              )}
            </div>
          </div>
        </Card>

        <Card title="Client Persistence (IndexedDB)" subtitle="aura_db (v1)">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              Stores: <code className="font-mono text-orange-400">7 Active Collections</code>
            </p>
            <div className="text-xs font-mono">
              {dbStatus.checking ? (
                <span className="text-amber-400">Initializing IndexedDB stores...</span>
              ) : dbStatus.ok ? (
                <span className="text-emerald-400">✓ Initialized — 7 Object Stores ready for zero-cloud storage</span>
              ) : (
                <span className="text-red-400">✗ Failed: {dbStatus.error}</span>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Component System Verification Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <Card title="Placement Readiness Gauge" subtitle="Gamified SVG Component" glow className="md:col-span-1">
          <ReadinessMeter score={68} level="Placement Novice" />
        </Card>

        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-zinc-100">Remediation Quest Card Component</h3>
          <QuestCard quest={sampleQuest} />
        </div>
      </div>
    </div>
  );
}
