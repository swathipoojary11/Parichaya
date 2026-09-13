"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ReadinessMeter from "@/components/ui/ReadinessMeter";

export default function FeedbackReportView({ feedback, telemetry, onNewSession }) {
  if (!feedback) return null;

  const {
    overallScore = 84,
    starScores = { situation: 85, task: 80, action: 85, result: 80 },
    dimensionScores = { relevance: 90, clarity: 84, confidence: 80, technicalDepth: 86 },
    strengths = [],
    improvements = [],
    actionableTips = []
  } = feedback;

  const { wpm = 140, totalFillers = 4, fillerWordCounts = {} } = telemetry || {};

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
            ✓ Video / Voice Post-Session Feedback Report
          </span>
          <h2 className="text-xl font-extrabold text-zinc-50">Interview Performance Summary</h2>
        </div>
        <Button variant="primary" onClick={onNewSession}>
          Start Another Mock Interview 🚀
        </Button>
      </div>

      {/* Top Grid: Overall Score & Dimension Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Overall Score Gauge */}
        <Card glow className="flex flex-col items-center justify-center p-6 text-center md:col-span-1">
          <ReadinessMeter score={overallScore} level="Interview Evaluation" size={170} />
        </Card>

        {/* Dimension Breakdown Cards */}
        <Card title="Multi-Dimensional Evaluation" subtitle="Core Competency Scores" className="md:col-span-2 space-y-3">
          <div className="space-y-3 pt-1">
            {Object.entries(dimensionScores).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-300 capitalize">
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="text-orange-400 font-bold">{val}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500 ease-out"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* STAR Methodology Scores Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-zinc-100">STAR Methodology Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[11px] font-mono uppercase text-zinc-400">Situation (20%)</span>
            <div className="text-2xl font-extrabold font-mono text-orange-400">{starScores.situation}%</div>
            <p className="text-[10px] text-zinc-500">Context Setup</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[11px] font-mono uppercase text-zinc-400">Task (20%)</span>
            <div className="text-2xl font-extrabold font-mono text-amber-400">{starScores.task}%</div>
            <p className="text-[10px] text-zinc-500">Goal Formulation</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[11px] font-mono uppercase text-zinc-400">Action (35%)</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">{starScores.action}%</div>
            <p className="text-[10px] text-zinc-500">Tech Steps Taken</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[11px] font-mono uppercase text-zinc-400">Result (25%)</span>
            <div className="text-2xl font-extrabold font-mono text-orange-400">{starScores.result}%</div>
            <p className="text-[10px] text-zinc-500">Quantifiable Metrics</p>
          </div>
        </div>
      </div>

      {/* Speech Cadence & Filler Word Telemetry */}
      <Card title="Speech & Cadence Telemetry">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 space-y-1">
            <span className="text-zinc-400">Pacing Cadence:</span>
            <div className="text-base font-bold text-zinc-100">{wpm} WPM (Target: 130–160 WPM)</div>
          </div>

          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 space-y-1">
            <span className="text-zinc-400">Filler Words Detected:</span>
            <div className="text-base font-bold text-orange-400">{totalFillers} occurrences</div>
          </div>
        </div>
      </Card>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Key Technical Strengths">
          <ul className="list-disc list-inside text-xs text-emerald-300 space-y-2 leading-relaxed">
            {strengths.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </Card>

        <Card title="Areas for Improvement">
          <ul className="list-disc list-inside text-xs text-amber-300 space-y-2 leading-relaxed">
            {improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
          </ul>
        </Card>
      </div>

      {/* Actionable Coaching Tips */}
      {actionableTips.length > 0 && (
        <Card title="Actionable Coaching Tips">
          <ul className="list-disc list-inside text-xs text-zinc-300 space-y-2 leading-relaxed">
            {actionableTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}
