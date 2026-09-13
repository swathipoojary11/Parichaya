"use client";

import { useEffect, useState } from "react";
import ResourceGrid from "@/components/resources/ResourceGrid";
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
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono border border-orange-500/20">
          <span>● DSA Pattern &amp; Resource Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
          LeetCode <span className="text-orange-500">Pattern Recommendations</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl">
          Algorithm patterns mapped directly to your target job gaps and resume audit report. Master core data structures by pattern to maximize technical interview readiness.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <h3 className="text-lg font-bold text-zinc-100 font-mono">Mapping Resume Gaps to LeetCode Patterns...</h3>
        </div>
      ) : (
        <ResourceGrid patterns={data.patterns} userGaps={data.userGaps} />
      )}
    </div>
  );
}
