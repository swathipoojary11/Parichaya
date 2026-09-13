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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold text-slate-900">LeetCode Pattern Mappings</h3>
          {userGaps.length > 0 && (
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              {userGaps.length} Target Gaps Identified
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${filter === "all" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            All Patterns ({patterns.length})
          </button>
          <button
            onClick={() => setFilter("targeted")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${filter === "targeted" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
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
