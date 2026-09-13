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
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold text-zinc-100">Remediation Missions</h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {pendingCount} Active
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === "all" ? "bg-orange-500 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            All ({quests.length})
          </button>
          <button
            onClick={() => setActiveTab("dsa")}
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === "dsa" ? "bg-orange-500 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            DSA Patterns
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === "pending" ? "bg-orange-500 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === "completed" ? "bg-orange-500 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
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
        <Card className="text-center py-12 space-y-2">
          <div className="text-3xl">🎉</div>
          <h4 className="text-base font-bold text-zinc-200">No Missions In This View</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Run an ATS audit on your resume to unlock tailored DSA algorithm and resume gap remediation quests.
          </p>
        </Card>
      )}
    </div>
  );
}
