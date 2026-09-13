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

  const { wpm = 140, totalFillers = 4 } = telemetry || {};

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft">
        <div>
          <span className="text-xs font-mono text-indigo-600 uppercase font-bold tracking-wider">
            ✓ Video / Voice Post-Session Feedback Report
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">Interview Performance Summary</h2>
        </div>
        <Button variant="indigo" onClick={onNewSession}>
          Start Another Mock Session 🚀
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
                <div className="flex justify-between text-xs font-mono text-slate-700 capitalize font-bold">
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="text-indigo-600 font-bold">{val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500 ease-out"
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
        <h3 className="text-lg font-bold text-slate-900">STAR Methodology Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-1 shadow-soft">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Situation (20%)</span>
            <div className="text-2xl font-extrabold font-mono text-indigo-600">{starScores.situation}%</div>
            <p className="text-[10px] text-slate-500 font-medium">Context Setup</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-1 shadow-soft">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Task (20%)</span>
            <div className="text-2xl font-extrabold font-mono text-amber-600">{starScores.task}%</div>
            <p className="text-[10px] text-slate-500 font-medium">Goal Formulation</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-1 shadow-soft">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Action (35%)</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-600">{starScores.action}%</div>
            <p className="text-[10px] text-slate-500 font-medium">Tech Steps Taken</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-1 shadow-soft">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Result (25%)</span>
            <div className="text-2xl font-extrabold font-mono text-indigo-600">{starScores.result}%</div>
            <p className="text-[10px] text-slate-500 font-medium">Quantifiable Metrics</p>
          </div>
        </div>
      </div>

      {/* Speech Cadence & Filler Word Telemetry */}
      <Card title="Speech & Cadence Telemetry">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-bold">Pacing Cadence:</span>
            <div className="text-base font-bold text-slate-900">{wpm} WPM (Target: 130–160 WPM)</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-bold">Filler Words Detected:</span>
            <div className="text-base font-bold text-indigo-600">{totalFillers} occurrences</div>
          </div>
        </div>
      </Card>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Key Technical Strengths">
          <ul className="list-disc list-inside text-xs text-emerald-800 space-y-2 leading-relaxed font-medium">
            {strengths.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </Card>

        <Card title="Areas for Improvement">
          <ul className="list-disc list-inside text-xs text-amber-800 space-y-2 leading-relaxed font-medium">
            {improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
          </ul>
        </Card>
      </div>

      {/* Actionable Coaching Tips */}
      {actionableTips.length > 0 && (
        <Card title="Actionable Coaching Tips">
          <ul className="list-disc list-inside text-xs text-slate-700 space-y-2 leading-relaxed font-medium">
            {actionableTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}
