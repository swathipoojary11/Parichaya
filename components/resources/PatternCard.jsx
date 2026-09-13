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
    if (diff === "Easy") return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    if (diff === "Medium") return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    return "text-red-400 border-red-500/20 bg-red-500/10";
  };

  return (
    <Card glow={isTargetedGap} className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-zinc-100">{name}</h3>
            {isTargetedGap && (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                ★ ATS Skill Gap Priority
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>

      {/* Mapped ATS Skills */}
      <div className="space-y-1">
        <span className="text-[11px] font-mono text-zinc-500 block">Mapped ATS Competencies:</span>
        <div className="flex flex-wrap gap-1.5">
          {mappedSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-950 text-zinc-300 border border-zinc-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended LeetCode Problems List */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/60">
        <span className="text-xs font-mono font-semibold text-zinc-300 block">Recommended LeetCode Practice:</span>
        <div className="space-y-2">
          {recommendedProblems.map((prob, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-xs font-mono"
            >
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400">{idx + 1}.</span>
                <span className="text-zinc-100 font-semibold">{prob.title || prob.name}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded text-[10px] border ${getDifficultyColor(prob.difficulty)}`}>
                  {prob.difficulty || "Medium"}
                </span>
                <a
                  href={prob.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline"
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
