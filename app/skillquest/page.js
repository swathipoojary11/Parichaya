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
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";
import { checkLevelUnlockCondition } from "@/lib/services/performanceLevelService";
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

  useEffect(() => {
    async function loadData() {
      const rep = await getReassessmentComparisonReport();
      setReassessmentReport(rep);
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
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
            <span>● Closed-Loop SkillQuest Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            PARICHAYA <span className="text-indigo-600">SkillQuest Hub</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Solve in-browser code challenges, practice with AI Talking Coach, unlock performance tiers (&ge;70% score), and re-assess your skills.
          </p>
        </div>

        {/* Level Unlock Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono space-y-1 shadow-xs min-w-[220px]">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-bold">Level 2 Status:</span>
            <span className={level2Unlock.isUnlocked ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
              {level2Unlock.isUnlocked ? "✓ UNLOCKED" : "🔒 LOCKED"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Requires: {level2Unlock.minAttempts} challenge with &ge;{level2Unlock.reqScore}% score
          </p>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab("tech")}
          className={`px-4 py-2.5 rounded-xl transition-all font-semibold ${
            activeTab === "tech"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          ⚙ TechQuest (Code Runner &amp; MCQs)
        </button>

        <button
          onClick={() => setActiveTab("soft")}
          className={`px-4 py-2.5 rounded-xl transition-all font-semibold ${
            activeTab === "soft"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🐱 SoftSkill Quest (AI Companion)
        </button>

        <button
          onClick={() => setActiveTab("reassessment")}
          className={`px-4 py-2.5 rounded-xl transition-all font-semibold ${
            activeTab === "reassessment"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🔄 Reassessment Comparison
        </button>
      </div>

      {/* Sub Mode Switcher for TechQuest */}
      {activeTab === "tech" && (
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setTechMode("code")}
            className={`px-3 py-1.5 rounded-xl border ${techMode === "code" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold" : "bg-white border-slate-200 text-slate-600"}`}
          >
            In-Browser Code Runner
          </button>
          <button
            onClick={() => setTechMode("arrange")}
            className={`px-3 py-1.5 rounded-xl border ${techMode === "arrange" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold" : "bg-white border-slate-200 text-slate-600"}`}
          >
            Code Line Assembly
          </button>
          <button
            onClick={() => setTechMode("mcq")}
            className={`px-3 py-1.5 rounded-xl border ${techMode === "mcq" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold" : "bg-white border-slate-200 text-slate-600"}`}
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
            className={`px-3 py-1.5 rounded-xl border ${softMode === "coach" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold" : "bg-white border-slate-200 text-slate-600"}`}
          >
            AI Companion Coach
          </button>
          <button
            onClick={() => setSoftMode("star")}
            className={`px-3 py-1.5 rounded-xl border ${softMode === "star" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold" : "bg-white border-slate-200 text-slate-600"}`}
          >
            STAR Story Builder
          </button>
          <button
            onClick={() => setSoftMode("upgrade")}
            className={`px-3 py-1.5 rounded-xl border ${softMode === "upgrade" ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold" : "bg-white border-slate-200 text-slate-600"}`}
          >
            Sentence Impact Upgrade
          </button>
        </div>
      )}

      {/* Multi-Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Challenge Arena (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
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

        {/* AI Chat Feedback Panel (4 Cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <ChatFeedbackPanel
            contextTitle="SkillQuest AI Coach"
            contextData={{ activeTab, completedCount: completedChallenges.length }}
          />
        </div>
      </div>
    </div>
  );
}
