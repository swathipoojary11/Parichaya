"use client";

import Card from "@/components/ui/Card";

export default function PatternCard({ pattern }) {
  const {
    name,
    description,
    mappedSkills = [],
    recommendedProblems = [],
    isTargetedGap = false
  } = pattern;

  const getDifficultyColor = (diff) => {
    if (diff === "Easy") return "text-emerald-700 border-emerald-200 bg-emerald-50";
    if (diff === "Medium") return "text-amber-700 border-amber-200 bg-amber-50";
    return "text-rose-700 border-rose-200 bg-rose-50";
  };

  return (
    <Card glow={isTargetedGap} className="space-y-4 border border-slate-200/90 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            {isTargetedGap && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wider">
                ★ ATS Skill Gap Priority
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Mapped ATS Skills */}
      <div className="space-y-1">
        <span className="text-[11px] font-mono text-slate-500 font-bold block">Mapped ATS Competencies:</span>
        <div className="flex flex-wrap gap-1.5">
          {mappedSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-slate-100 text-slate-800 border border-slate-200 font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended LeetCode Problems List */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-mono font-bold text-slate-700 block">Recommended LeetCode Practice:</span>
        <div className="space-y-2">
          {recommendedProblems.map((prob, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
            >
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold">{idx + 1}.</span>
                <span className="text-slate-900 font-bold">{prob.title || prob.name}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyColor(prob.difficulty)}`}>
                  {prob.difficulty || "Medium"}
                </span>
                <a
                  href={prob.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-bold"
                >
                  Solve ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
