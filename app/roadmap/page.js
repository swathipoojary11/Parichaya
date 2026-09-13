"use client";

import { useEffect, useState } from "react";
import ReadinessMeter from "@/components/ui/ReadinessMeter";
import LevelBadge from "@/components/roadmap/LevelBadge";
import QuestHub from "@/components/roadmap/QuestHub";
import Card from "@/components/ui/Card";
import { getAllItems } from "@/lib/db";
import { completeQuest } from "@/lib/services/gamificationService";
import dsaPatternsData from "@/data/dsa_patterns.json";

export default function RoadmapPage() {
  const [profile, setProfile] = useState({
    fullName: "Alex Rivera",
    targetRole: "Full Stack Engineer",
    level: "Placement Novice",
    xp: 450,
    readinessScore: 68,
    streakCount: 4
  });

  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmapData() {
      try {
        const storedProfiles = await getAllItems("profiles");
        if (storedProfiles.length > 0) {
          setProfile(storedProfiles[0]);
        }

        const storedQuests = await getAllItems("quests");

        if (storedQuests.length > 0) {
          setQuests(storedQuests);
        } else {
          // Pre-populate sample quests from dsa_patterns.json if empty
          const sampleQuests = dsaPatternsData.patterns.slice(0, 4).map((p, idx) => ({
            id: idx + 1,
            profileId: 1,
            title: `Master ${p.name} Pattern`,
            description: p.description,
            xpReward: 100,
            category: "dsa",
            leetCodePattern: p.name,
            recommendedProblems: p.recommendedProblems,
            status: idx === 0 ? "completed" : "pending",
            createdAt: new Date().toISOString()
          }));
          setQuests(sampleQuests);
        }
      } catch (err) {
        console.error("Failed to load roadmap data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmapData();
  }, []);

  const handleQuestComplete = async (quest) => {
    try {
      const result = await completeQuest(quest.id);
      if (result) {
        setProfile(result.profile);
        setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, status: "completed" } : q));
      }
    } catch (err) {
      // Fallback state update for offline UI dev test
      setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, status: "completed" } : q));
      setProfile(prev => ({ ...prev, xp: prev.xp + 100, readinessScore: Math.min(100, prev.readinessScore + 5) }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono border border-orange-500/20">
          <span>● Gamified Quest Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
          Improvement <span className="text-orange-500">Roadmap</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl">
          Track your placement readiness score, level up your engineering tier, and complete tailored LeetCode algorithm quest missions.
        </p>
      </div>

      {/* Top Section: Readiness Score & Level Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Readiness Meter Gauge */}
        <Card glow className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
          <ReadinessMeter score={profile.readinessScore || 68} level={profile.level || "Placement Novice"} />
        </Card>

        {/* Level Progression & Streak Badge */}
        <div className="md:col-span-2 space-y-4">
          <LevelBadge xp={profile.xp || 450} streakCount={profile.streakCount || 4} />
        </div>
      </div>

      {/* Quest Hub Board */}
      <QuestHub quests={quests} onQuestComplete={handleQuestComplete} />
    </div>
  );
}
