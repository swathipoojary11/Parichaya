'use client';

export default function MissionCard({ mission, onComplete, onLaunch }) {
  const isCompleted = mission.status === 'COMPLETED';

  let categoryBadge = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  if (mission.category === 'DSA') categoryBadge = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  if (mission.category === 'Soft Skills') categoryBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (mission.category === 'System Design') categoryBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 ${
      isCompleted
        ? 'bg-zinc-950/60 border-zinc-800/80 opacity-60'
        : 'bg-zinc-900/90 border-zinc-800 hover:border-orange-500/40 shadow-xl'
    }`}>
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryBadge}`}>
          {mission.category}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
          <span>⚡</span>
          <span>+{mission.xpBounty} XP</span>
        </div>
      </div>

      {/* Title & Description */}
      <h4 className={`text-base font-bold mb-1.5 ${isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>
        {mission.title}
      </h4>
      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
        {mission.taskDescription}
      </p>

      {/* Target Skill Gap */}
      {mission.skillGap && (
        <div className="mb-4 text-[11px] text-zinc-500 flex items-center gap-1.5">
          <span>Targeting Weakness:</span>
          <span className="text-zinc-300 font-semibold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
            {mission.skillGap}
          </span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
        {isCompleted ? (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            ✓ Mission Accomplished
          </span>
        ) : (
          <button
            onClick={() => onLaunch && onLaunch(mission)}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            Launch Mission Challenge →
          </button>
        )}

        <button
          onClick={() => onComplete && onComplete(mission.id)}
          className={`px-3 py-1 text-[11px] font-semibold rounded-xl border transition-colors ${
            isCompleted
              ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isCompleted ? 'Completed' : 'Mark Done'}
        </button>
      </div>
    </div>
  );
}
