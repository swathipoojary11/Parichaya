'use client';

export default function SkillPills({ matched = [], missing = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {/* Matched Skills */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Matched Keywords ({matched.length})
          </h4>
        </div>

        {matched.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No matching keywords found.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {matched.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg flex items-center gap-1"
              >
                <span>✓</span>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Skills */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Missing Keywords ({missing.length})
          </h4>
        </div>

        {missing.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No missing keywords! Excellent coverage.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {missing.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded-lg flex items-center gap-1"
              >
                <span>+</span>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
