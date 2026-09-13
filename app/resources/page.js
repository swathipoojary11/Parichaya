"use client";

import { useEffect, useState } from "react";
import ResourceGrid from "@/components/resources/ResourceGrid";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";
import { getPersonalizedRecommendations } from "@/lib/services/resourceService";

export default function ResourcesPage() {
  const [data, setData] = useState({ userGaps: [], patterns: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getPersonalizedRecommendations();
      setData(res);
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
          <span>● DSA Pattern &amp; Resource Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          LeetCode <span className="text-indigo-600">Pattern Recommendations</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Algorithm patterns mapped directly to your target job gaps and resume audit report. Master core data structures by pattern to maximize technical interview readiness.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center bg-white border border-slate-200 rounded-3xl shadow-soft">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <h3 className="text-lg font-bold text-slate-900 font-mono">Mapping Resume Gaps to LeetCode Patterns...</h3>
        </div>
      ) : (
        /* Multi-Panel Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Resource Grid (8 Cols) */}
          <div className="lg:col-span-8">
            <ResourceGrid patterns={data.patterns} userGaps={data.userGaps} />
          </div>

          {/* AI Chat Feedback Assistant (4 Cols) */}
          <div className="lg:col-span-4 sticky top-20">
            <ChatFeedbackPanel
              contextTitle="DSA Pattern AI Guide"
              contextData={{ userGaps: data.userGaps, patternCount: data.patterns.length }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
