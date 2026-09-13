"use client";

import { useEffect, useState } from "react";
import { checkOllamaHealth } from "@/lib/ollama";
import { openDB, getOrCreateProfile, getAllItems, updateItem } from "@/lib/db";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import QuestCard from "@/components/ui/QuestCard";
import ReadinessMeter from "@/components/ui/ReadinessMeter";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [ollamaStatus, setOllamaStatus] = useState({ checking: true, ok: false });
  const [dbStatus, setDbStatus] = useState({ checking: true, ok: false });

  const loadDashboardData = async () => {
    if (typeof window === "undefined") return;

    try {
      await openDB();
      setDbStatus({ checking: false, ok: true });
      const p = await getOrCreateProfile();
      setProfile(p);

      const allQuests = await getAllItems("quests");
      if (allQuests && allQuests.length > 0) {
        setQuests(allQuests);
      } else {
        const dynamicInitialQuests = [
          {
            profileId: p?.id || 1,
            title: "Master Sliding Window & Dynamic Array Patterns",
            description: "Targeted remediation for DSA Array weakness identified during intake.",
            xpReward: 150,
            category: "technical",
            leetCodePattern: "Sliding Window",
            status: "pending",
            recommendedProblems: [
              { title: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" }
            ]
          },
          {
            profileId: p?.id || 1,
            title: "Refactor Resume into Quantified STAR Metrics",
            description: "Upgrade impact statements with specific percentages, user growth, and technical stack outcomes.",
            xpReward: 100,
            category: "softskill",
            leetCodePattern: "STAR Framework",
            status: "pending",
            recommendedProblems: [
              { title: "Run ATS Resume Audit", link: "/ats-audit" }
            ]
          }
        ];
        setQuests(dynamicInitialQuests);
      }
    } catch (err) {
      setDbStatus({ checking: false, ok: false, error: err?.message || "DB error" });
    }
  };

  useEffect(() => {
    checkOllamaHealth().then(res => setOllamaStatus({ checking: false, ok: res.ok }));
    loadDashboardData();

    const handleDbChange = () => loadDashboardData();
    window.addEventListener("aura-db-changed", handleDbChange);
    return () => window.removeEventListener("aura-db-changed", handleDbChange);
  }, []);

  const handleQuestComplete = async (questToComplete) => {
    if (!profile) return;
    const updatedQuests = quests.map(q => q.title === questToComplete.title ? { ...q, status: "completed" } : q);
    setQuests(updatedQuests);

    const newXp = (profile.totalXp || 0) + questToComplete.xpReward;
    const newScore = Math.min(100, (profile.readinessScore || 65) + 5);
    const updatedProfile = { ...profile, totalXp: newXp, readinessScore: newScore };

    await updateItem("profiles", updatedProfile);
    if (questToComplete.id) {
      await updateItem("quests", { ...questToComplete, status: "completed" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Hero Panel */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft glow-orange-light space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-mono font-bold border border-orange-200">
            <span>● Dynamic Placement Engine Active</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            Target Role: <strong className="text-orange-600 font-bold">{profile?.targetRole || "Full Stack Engineer"}</strong>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-orange-500">{profile?.fullName || "Candidate"}</span>!
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Your local AI Placement Engine is actively analyzing your resume gaps, mock interview articulation, and DSA skills. Complete quests to increase your Placement Readiness Index.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="primary" onClick={() => window.location.href = "/interview"}>
            🎙️ Start Voice Session
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = "/ats-audit"}>
            📑 Audit Resume ATS
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/skillquest"}>
            ⚡ Launch SkillQuest Arena
          </Button>
        </div>
      </div>

      {/* Multi-Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1: Profile & Telemetry (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Placement Readiness Index" subtitle="Dynamic Score & Skill Level" glow>
            <ReadinessMeter
              score={profile?.readinessScore || 68}
              level={profile?.skillLevel || "Placement Novice"}
            />
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Total Experience Points (XP):</span>
                <span className="text-orange-600 font-mono font-bold">{profile?.totalXp || 250} XP</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Current Level:</span>
                <span className="text-slate-900 font-mono font-bold">Level {Math.floor((profile?.totalXp || 250) / 100) + 1}</span>
              </div>
            </div>
          </Card>

          <Card title="Active Profile Skills" subtitle="Extracted from Resume & Intake">
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1.5">Identified Strengths:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile?.strengths || ["JavaScript", "React.js", "REST APIs"]).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1.5">Target Weaknesses & Remediations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile?.weaknesses || ["Arrays & Dynamic Programming", "STAR Storytelling"]).map((w, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                      ⚠ {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="System Telemetry" subtitle="On-Device Health & Storage">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">Local AI Model:</span>
                <span className={`font-mono font-bold ${ollamaStatus.ok ? "text-emerald-600" : "text-amber-600"}`}>
                  {ollamaStatus.ok ? "✓ Qwen2.5 3B" : "Offline"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">IndexedDB Persistence:</span>
                <span className={`font-mono font-bold ${dbStatus.ok ? "text-emerald-600" : "text-red-600"}`}>
                  {dbStatus.ok ? "✓ aura_db (v1)" : "Failed"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Panel 2: Active Skill Quests (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>⚡ Active Remediation Quests</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
                {quests.length} Quests
              </span>
            </h2>
            <Button size="sm" variant="outline" onClick={() => window.location.href = "/roadmap"}>
              View Full Map ↗
            </Button>
          </div>

          <div className="space-y-4">
            {quests.map((q, idx) => (
              <QuestCard key={idx} quest={q} onComplete={handleQuestComplete} />
            ))}
          </div>

          <div className="pt-4">
            <ChatFeedbackPanel
              contextTitle="Dashboard AI Career Coach"
              contextData={{ profile, quests }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
