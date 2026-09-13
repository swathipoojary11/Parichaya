"use client";

import Button from "./Button";

export default function QuestCard({
  quest,
  onComplete,
  className = ""
}) {
  const {
    title,
    description,
    xpReward,
    leetCodePattern,
    status = "pending",
    recommendedProblems = []
  } = quest;

  const isCompleted = status === "completed";

  return (
    <div
      className={`bg-zinc-900 border rounded-xl p-5 space-y-4 transition-all duration-200 ${
        isCompleted
          ? "border-emerald-500/30 bg-emerald-950/10"
          : "border-zinc-800 hover:border-orange-500/40"
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h4 className={`font-bold text-base ${isCompleted ? "text-emerald-400 line-through" : "text-zinc-100"}`}>
              {title}
            </h4>
            {leetCodePattern && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-orange-400 border border-zinc-700">
                {leetCodePattern}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            +{xpReward} XP
          </span>
        </div>
      </div>

      {recommendedProblems.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/60 flex items-center space-x-4 text-xs font-mono">
          <span className="text-zinc-500">Practice:</span>
          {recommendedProblems.map((prob, i) => (
            <a
              key={i}
              href={prob.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline"
            >
              {prob.title || prob.name} ↗
            </a>
          ))}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        {isCompleted ? (
          <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center space-x-1">
            <span>✓ Completed</span>
          </span>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onComplete && onComplete(quest)}
          >
            Mark Quest Complete
          </Button>
        )}
      </div>
    </div>
  );
}
