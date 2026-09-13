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
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div>
          <span className="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">
            ✓ Deterministic ATS Audit Complete
          </span>
          <h2 className="text-lg font-bold text-zinc-50">Target Role: {roleTitle}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          Audit Another Resume
        </Button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Match Score Card */}
        <Card glow className="flex flex-col items-center justify-center text-center p-6 space-y-2">
          <span className="text-xs font-mono uppercase text-zinc-400">ATS Match Score</span>
          <div className="text-5xl font-extrabold font-mono text-orange-400 tracking-tight">
            {matchScore}%
          </div>
          <span className="text-xs text-zinc-400">
            {matchScore >= 75 ? "Excellent Alignment" : matchScore >= 50 ? "Moderate Gap" : "Needs Significant Optimization"}
          </span>
        </Card>

        {/* Matched Skills */}
        <Card title="Matched Competencies" subtitle={`${matchedSkills.length} skills found in resume`}>
          <div className="flex flex-wrap gap-2 pt-1">
            {matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </Card>

        {/* Missing Skills Diff */}
        <Card title="Missing Skill Gaps" subtitle={`${missingSkills.length} required JD gaps`}>
          <div className="flex flex-wrap gap-2 pt-1">
            {missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20"
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
            <h3 className="text-lg font-bold text-zinc-100">Google X-Y-Z Bullet Point Rewrites</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              AI Optimized
            </span>
          </div>

          <div className="space-y-4">
            {bulletRewrites.map((rewrite, idx) => (
              <Card key={idx} className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase text-red-400 font-semibold">Original Bullet (Weak / Low ATS Impact):</span>
                  <p className="text-xs text-zinc-400 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 line-through">
                    {rewrite.original}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">Google X-Y-Z Improved Bullet:</span>
                  <p className="text-xs text-emerald-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/30 leading-relaxed">
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
            <h3 className="text-lg font-bold text-zinc-100">Unlocked Remediation Quests</h3>
            <span className="text-xs font-mono text-amber-400">
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
          <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1.5 leading-relaxed">
            {recommendations.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
