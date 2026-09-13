"use client";

import { useState } from "react";
import QuestCard from "@/components/ui/QuestCard";
import Card from "@/components/ui/Card";

export default function QuestHub({ quests = [], onQuestComplete }) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredQuests = quests.filter(q => {
    if (activeTab === "all") return true;
    if (activeTab === "dsa") return q.category === "dsa" || q.leetCodePattern;
    if (activeTab === "pending") return q.status === "pending";
    if (activeTab === "completed") return q.status === "completed";
    return true;
  });

  const pendingCount = quests.filter(q => q.status === "pending").length;
  const completedCount = quests.filter(q => q.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Category Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold text-slate-900">Remediation Missions</h3>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
            {pendingCount} Active
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${activeTab === "all" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            All ({quests.length})
          </button>
          <button
            onClick={() => setActiveTab("dsa")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${activeTab === "dsa" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            DSA Patterns
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${activeTab === "pending" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${activeTab === "completed" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Quest Cards Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuests.map((quest, idx) => (
            <QuestCard
              key={quest.id || idx}
              quest={quest}
              onComplete={onQuestComplete}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 space-y-2 border border-slate-200">
          <div className="text-3xl">🎉</div>
          <h4 className="text-base font-bold text-slate-900">No Missions In This View</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run an ATS audit on your resume to unlock tailored algorithm and resume gap remediation quests.
          </p>
        </Card>
      )}
    </div>
  );
}
