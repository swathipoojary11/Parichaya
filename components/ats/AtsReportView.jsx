"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import QuestCard from "@/components/ui/QuestCard";

export default function AtsReportView({ report, unlockedQuests = [], onReset }) {
  if (!report) return null;

  const {
    matchScore = 0,
    roleTitle = "Full Stack Engineer",
    matchedSkills = [],
    missingSkills = [],
    bulletRewrites = [],
    recommendations = []
  } = report;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft">
        <div>
          <span className="text-xs font-mono text-indigo-600 uppercase font-bold tracking-wider">
            ✓ Deterministic ATS Audit Complete
          </span>
          <h2 className="text-lg font-bold text-slate-900">Target Role: {roleTitle}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          Audit Another Resume
        </Button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Match Score Card */}
        <Card glow className="flex flex-col items-center justify-center text-center p-6 space-y-2">
          <span className="text-xs font-mono uppercase text-slate-500 font-bold">ATS Match Score</span>
          <div className="text-5xl font-extrabold font-mono text-indigo-600 tracking-tight">
            {matchScore}%
          </div>
          <span className="text-xs text-slate-600 font-medium">
            {matchScore >= 75 ? "Excellent Alignment" : matchScore >= 50 ? "Moderate Gap" : "Needs Optimization"}
          </span>
        </Card>

        {/* Matched Skills */}
        <Card title="Matched Competencies" subtitle={`${matchedSkills.length} skills found in resume`}>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </Card>

        {/* Missing Skills Diff */}
        <Card title="Missing Skill Gaps" subtitle={`${missingSkills.length} required JD gaps`}>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-rose-50 text-rose-700 font-bold border border-rose-200"
              >
                ✗ {skill}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Bullet Rewrites Section */}
      {bulletRewrites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">Google X-Y-Z Bullet Point Rewrites</h3>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold">
              AI Optimized
            </span>
          </div>

          <div className="space-y-4">
            {bulletRewrites.map((rewrite, idx) => (
              <Card key={idx} className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase text-rose-600 font-bold">Original Bullet (Weak / Low ATS Impact):</span>
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 line-through">
                    {rewrite.original}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase text-emerald-600 font-bold">Google X-Y-Z Improved Bullet:</span>
                  <p className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200 leading-relaxed font-medium">
                    {rewrite.improved}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Unlocked Remediation Quests */}
      {unlockedQuests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Unlocked Remediation Quests</h3>
            <span className="text-xs font-mono text-amber-600 font-bold">
              +{unlockedQuests.reduce((acc, q) => acc + (q.xpReward || 100), 0)} Total XP Available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {unlockedQuests.map((quest, idx) => (
              <QuestCard key={idx} quest={quest} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card title="Actionable Optimization Tips">
          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5 leading-relaxed">
            {recommendations.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
