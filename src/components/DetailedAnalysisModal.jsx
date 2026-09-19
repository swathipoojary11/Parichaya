'use client';

export default function DetailedAnalysisModal({ isOpen, onClose, suggestions = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-bold text-zinc-100 text-lg">Google X-Y-Z Bullet Optimizations</h3>
              <p className="text-xs text-zinc-400">Transform weak duties into high-impact metric achievements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No specific bullet rewrites identified. Your bullet points already demonstrate good impact!
            </div>
          ) : (
            suggestions.map((item, idx) => (
              <div key={idx} className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-3">
                {/* Original */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400 text-xs font-bold uppercase">Original Bullet</span>
                    <span className="text-[10px] text-zinc-500 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/40">Passive / Duty</span>
                  </div>
                  <p className="text-xs text-zinc-400 pl-3 border-l-2 border-red-500/40 leading-relaxed italic">
                    "{item.original}"
                  </p>
                </div>

                {/* Rewrite */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-emerald-400 text-xs font-bold uppercase">Google X-Y-Z Rewrite</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">Accomplished [X] by [Z] as measured by [Y]</span>
                  </div>
                  <p className="text-xs text-emerald-200 pl-3 border-l-2 border-emerald-500 leading-relaxed font-medium">
                    "{item.rewrite}"
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 flex justify-end bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
}
