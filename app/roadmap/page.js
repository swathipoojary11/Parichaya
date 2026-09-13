"use client";

import { useEffect, useState } from "react";
import ReadinessMeter from "@/components/ui/ReadinessMeter";
import LevelBadge from "@/components/roadmap/LevelBadge";
import QuestHub from "@/components/roadmap/QuestHub";
import Card from "@/components/ui/Card";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";
import { openDB, getOrCreateProfile, getAllItems, updateItem } from "@/lib/db";
import dsaPatternsData from "@/data/dsa_patterns.json";

export default function RoadmapPage() {
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);

  const loadData = async () => {
    try {
      await openDB();
      const p = await getOrCreateProfile();
      setProfile(p);

      const storedQuests = await getAllItems("quests");
      if (storedQuests && storedQuests.length > 0) {
        setQuests(storedQuests);
      } else {
        const initialQuests = dsaPatternsData.patterns.slice(0, 4).map((pattern, idx) => ({
          profileId: p.id,
          title: `Master ${pattern.name} Pattern`,
          description: pattern.description,
          xpReward: 100,
          category: "dsa",
          leetCodePattern: pattern.name,
          recommendedProblems: pattern.recommendedProblems,
          status: idx === 0 ? "completed" : "pending",
          createdAt: new Date().toISOString()
        }));
        setQuests(initialQuests);
      }
    } catch (err) {
      console.error("Failed to load roadmap data:", err);
    }
  };

  useEffect(() => {
    loadData();
    const handleDbChange = () => loadData();
    window.addEventListener("aura-db-changed", handleDbChange);
    return () => window.removeEventListener("aura-db-changed", handleDbChange);
  }, []);

  const handleQuestComplete = async (quest) => {
    if (!profile) return;
    const updatedQuests = quests.map(q => q.title === quest.title ? { ...q, status: "completed" } : q);
    setQuests(updatedQuests);

    const newXp = (profile.totalXp || 0) + (quest.xpReward || 100);
    const newScore = Math.min(100, (profile.readinessScore || 65) + 5);
    const updatedProfile = { ...profile, totalXp: newXp, readinessScore: newScore };

    await updateItem("profiles", updatedProfile);
    if (quest.id) {
      await updateItem("quests", { ...quest, status: "completed" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
          <span>● Gamified Quest Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Improvement <span className="text-indigo-600">Roadmap</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Track your placement readiness score, level up your engineering tier, and complete tailored LeetCode algorithm quest missions.
        </p>
      </div>

      {/* Top Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Readiness Meter Gauge */}
        <Card glow className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
          <ReadinessMeter score={profile?.readinessScore || 68} level={profile?.skillLevel || "Placement Novice"} />
        </Card>

        {/* Level Progression & Streak Badge */}
        <div className="md:col-span-2 space-y-4">
          <LevelBadge xp={profile?.totalXp || 250} streakCount={4} />
        </div>
      </div>

      {/* Multi-Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Quest Hub Board (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <QuestHub quests={quests} onQuestComplete={handleQuestComplete} />
        </div>

        {/* AI Chat Feedback Assistant (4 Cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <ChatFeedbackPanel
            contextTitle="Roadmap AI Advisor"
            contextData={{ profile, questsCount: quests.length }}
          />
        </div>
      </div>
    </div>
  );
}
