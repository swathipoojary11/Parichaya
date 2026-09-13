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
      className={`bg-white border rounded-2xl p-5 space-y-4 shadow-soft transition-all duration-200 ${
        isCompleted
          ? "border-emerald-200 bg-emerald-50/40"
          : "border-slate-200 hover:border-orange-400"
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className={`font-bold text-base ${isCompleted ? "text-emerald-700 line-through" : "text-slate-900"}`}>
              {title}
            </h4>
            {leetCodePattern && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-orange-50 text-orange-600 border border-orange-200 font-bold">
                {leetCodePattern}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            +{xpReward} XP
          </span>
        </div>
      </div>

      {recommendedProblems.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-slate-400 font-medium">Practice:</span>
          {recommendedProblems.map((prob, i) => (
            <a
              key={i}
              href={prob.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline font-bold"
            >
              {prob.title || prob.name} ↗
            </a>
          ))}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        {isCompleted ? (
          <span className="text-xs font-mono text-emerald-600 font-bold flex items-center space-x-1">
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
