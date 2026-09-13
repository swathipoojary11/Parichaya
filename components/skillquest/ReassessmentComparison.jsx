"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ReassessmentComparison({ report, onStartReassessment }) {
  if (!report) return null;

  const { baseline, current, gains, summaryMessage } = report;

  const metrics = [
    { name: "Answer Structure (STAR)", before: baseline.answerStructure, after: current.answerStructure, gain: gains.answerStructureGain },
    { name: "Filler Word Control", before: baseline.fillerWordControl, after: current.fillerWordControl, gain: gains.fillerWordControlGain },
    { name: "Communication Clarity", before: baseline.communicationClarity, after: current.communicationClarity, gain: gains.communicationClarityGain },
    { name: "Technical Depth", before: baseline.technicalDepth, after: current.technicalDepth, gain: gains.technicalDepthGain }
  ];

  return (
    <Card glow className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
            🔄 Closed-Loop Reassessment Analytics
          </span>
          <h3 className="text-xl font-extrabold text-zinc-50">Before vs. After SkillQuest Practice</h3>
        </div>
        <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">
          +{gains.overallReadinessGain}% Total Gain
        </span>
      </div>

      <p className="text-xs text-zinc-300 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 font-mono leading-relaxed">
        💡 {summaryMessage}
      </p>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 font-bold">{m.name}</span>
              <span className="text-emerald-400 font-bold">+{m.gain}% Improvement</span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <div className="flex-1 space-y-1">
                <span className="text-zinc-500">Before: {m.before}%</span>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-600" style={{ width: `${m.before}%` }} />
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-emerald-400 font-bold">After: {m.after}%</span>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${m.after}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-zinc-400">Ready to test your upgraded skills?</span>
        <Button variant="primary" onClick={onStartReassessment}>
          Conduct Reassessment Mock Interview 🚀
        </Button>
      </div>
    </Card>
  );
}
