"use client";

import { useState } from "react";
import PatternCard from "./PatternCard";

export default function ResourceGrid({ patterns = [], userGaps = [] }) {
  const [filter, setFilter] = useState("all"); // "all" | "targeted"

  const filteredPatterns = patterns.filter(p => {
    if (filter === "targeted") return p.isTargetedGap;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold text-zinc-100">LeetCode Pattern Mappings</h3>
          {userGaps.length > 0 && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {userGaps.length} Target Gaps Identified
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md transition-colors ${filter === "all" ? "bg-orange-500 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            All Patterns ({patterns.length})
          </button>
          <button
            onClick={() => setFilter("targeted")}
            className={`px-3 py-1 rounded-md transition-colors ${filter === "targeted" ? "bg-orange-500 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            Targeted Gaps Only
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatterns.map((pattern, idx) => (
          <PatternCard key={pattern.id || idx} pattern={pattern} />
        ))}
      </div>
    </div>
  );
}
