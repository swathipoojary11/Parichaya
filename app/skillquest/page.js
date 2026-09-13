"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CodeEditorChallenge from "@/components/skillquest/CodeEditorChallenge";
import CodeArrangementChallenge from "@/components/skillquest/CodeArrangementChallenge";
import McqBattleChallenge from "@/components/skillquest/McqBattleChallenge";
import AiTalkingCoach from "@/components/skillquest/AiTalkingCoach";
import StarStoryBuilder from "@/components/skillquest/StarStoryBuilder";
import SentenceUpgradeChallenge from "@/components/skillquest/SentenceUpgradeChallenge";
import ReassessmentComparison from "@/components/skillquest/ReassessmentComparison";
import { checkLevelUnlockCondition, LEVEL_TIERS } from "@/lib/services/performanceLevelService";
import { getReassessmentComparisonReport } from "@/lib/services/reassessmentService";
import { triggerConfetti } from "@/lib/services/gamificationService";
import { useRouter } from "next/navigation";

export default function SkillQuestPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tech"); // "tech" | "soft" | "reassessment"
  const [techMode, setTechMode] = useState("code"); // "code" | "arrange" | "mcq"
  const [softMode, setSoftMode] = useState("coach"); // "coach" | "star" | "upgrade"
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [reassessmentReport, setReassessmentReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const rep = await getReassessmentComparisonReport();
      setReassessmentReport(rep);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChallengeComplete = (data) => {
    setCompletedChallenges(prev => [...prev, data]);
    triggerConfetti();
  };

  const level2Unlock = checkLevelUnlockCondition(completedChallenges, 2);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono border border-orange-500/20">
            <span>● Closed-Loop SkillQuest Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
            PARICHAYA <span className="text-orange-500">SkillQuest Hub</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Execute in-browser code challenges, practice with your AI Talking Coach, unlock performance tiers (minimum 70% score), and track your progress loop.
          </p>
        </div>

        {/* Level Unlock Badge */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-mono space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Level 2 Unlock Status:</span>
            <span className={level2Unlock.isUnlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {level2Unlock.isUnlocked ? "✓ UNLOCKED" : "🔒 LOCKED"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Requires: {level2Unlock.minAttempts} challenge with &ge; {level2Unlock.reqScore}% score ({level2Unlock.currentSuccessfulAttempts}/{level2Unlock.minAttempts} done)
          </p>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center space-x-3 border-b border-zinc-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab("tech")}
          className={`px-4 py-2 rounded-xl transition-all ${activeTab === "tech" ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20" : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"}`}
        >
          ⚙ TechQuest (Code Runner &amp; MCQs)
        </button>

        <button
          onClick={() => setActiveTab("soft")}
          className={`px-4 py-2 rounded-xl transition-all ${activeTab === "soft" ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20" : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"}`}
        >
          🐱 SoftSkill Quest (AI Talking Coach)
        </button>

        <button
          onClick={() => setActiveTab("reassessment")}
          className={`px-4 py-2 rounded-xl transition-all ${activeTab === "reassessment" ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20" : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"}`}
        >
          🔄 Reassessment Comparison
        </button>
      </div>

      {/* Sub Mode Switcher for TechQuest */}
      {activeTab === "tech" && (
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setTechMode("code")}
            className={`px-3 py-1.5 rounded-lg border ${techMode === "code" ? "bg-zinc-800 border-orange-500 text-orange-400 font-bold" : "bg-zinc-950 border-zinc-800 text-zinc-400"}`}
          >
            In-Browser Code Runner
          </button>
          <button
            onClick={() => setTechMode("arrange")}
            className={`px-3 py-1.5 rounded-lg border ${techMode === "arrange" ? "bg-zinc-800 border-orange-500 text-orange-400 font-bold" : "bg-zinc-950 border-zinc-800 text-zinc-400"}`}
          >
            Code Line Assembly
          </button>
          <button
            onClick={() => setTechMode("mcq")}
            className={`px-3 py-1.5 rounded-lg border ${techMode === "mcq" ? "bg-zinc-800 border-orange-500 text-orange-400 font-bold" : "bg-zinc-950 border-zinc-800 text-zinc-400"}`}
          >
            Timed MCQ Battle
          </button>
        </div>
      )}

      {/* Sub Mode Switcher for SoftSkill Quest */}
      {activeTab === "soft" && (
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setSoftMode("coach")}
            className={`px-3 py-1.5 rounded-lg border ${softMode === "coach" ? "bg-zinc-800 border-orange-500 text-orange-400 font-bold" : "bg-zinc-950 border-zinc-800 text-zinc-400"}`}
          >
            AI Talking Companion Coach
          </button>
          <button
            onClick={() => setSoftMode("star")}
            className={`px-3 py-1.5 rounded-lg border ${softMode === "star" ? "bg-zinc-800 border-orange-500 text-orange-400 font-bold" : "bg-zinc-950 border-zinc-800 text-zinc-400"}`}
          >
            STAR Story Builder
          </button>
          <button
            onClick={() => setSoftMode("upgrade")}
            className={`px-3 py-1.5 rounded-lg border ${softMode === "upgrade" ? "bg-zinc-800 border-orange-500 text-orange-400 font-bold" : "bg-zinc-950 border-zinc-800 text-zinc-400"}`}
          >
            Sentence Impact Upgrade
          </button>
        </div>
      )}

      {/* Main Interactive Challenge Sandbox */}
      {activeTab === "tech" && (
        <>
          {techMode === "code" && <CodeEditorChallenge onComplete={handleChallengeComplete} />}
          {techMode === "arrange" && <CodeArrangementChallenge onComplete={handleChallengeComplete} />}
          {techMode === "mcq" && <McqBattleChallenge onComplete={handleChallengeComplete} />}
        </>
      )}

      {activeTab === "soft" && (
        <>
          {softMode === "coach" && <AiTalkingCoach onComplete={handleChallengeComplete} />}
          {softMode === "star" && <StarStoryBuilder onComplete={handleChallengeComplete} />}
          {softMode === "upgrade" && <SentenceUpgradeChallenge onComplete={handleChallengeComplete} />}
        </>
      )}

      {activeTab === "reassessment" && (
        <ReassessmentComparison
          report={reassessmentReport}
          onStartReassessment={() => router.push("/interview")}
        />
      )}
    </div>
  );
}
