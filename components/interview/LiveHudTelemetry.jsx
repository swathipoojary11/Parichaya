"use client";

export default function LiveHudTelemetry({ telemetry, activeQuestion, currentTranscript }) {
  const { wpm = 140, totalWords = 0, totalFillers = 0, fillerWordCounts = {} } = telemetry || {};

  // WPM Status badge calculation (Target: 130 - 160 WPM)
  const getPacingStatus = (speed) => {
    if (speed < 110) return { label: "TOO SLOW", color: "text-amber-400 border-amber-500/20 bg-amber-500/10" };
    if (speed > 180) return { label: "TOO FAST", color: "text-red-400 border-red-500/20 bg-red-500/10" };
    return { label: "OPTIMAL CADENCE", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" };
  };

  const pacingInfo = getPacingStatus(wpm);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Active Question Prompt Display */}
      {activeQuestion && (
        <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-5 space-y-2 glow-orange">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-orange-400 font-bold uppercase tracking-wider">
              Question {activeQuestion.id} &bull; {activeQuestion.category}
            </span>
            <span className="text-zinc-400">STAR Focus: {activeQuestion.starFocus}</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-50 leading-relaxed">
            &ldquo;{activeQuestion.questionText}&rdquo;
          </h3>
        </div>
      )}

      {/* Telemetry Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WPM Pacing Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Speech Cadence</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pacingInfo.color}`}>
              {pacingInfo.label}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-zinc-50">{wpm}</span>
            <span className="text-xs font-mono text-zinc-400">WPM</span>
          </div>
          <p className="text-[11px] text-zinc-500">Target Range: 130 – 160 WPM</p>
        </div>

        {/* Word Count */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <span className="text-xs font-mono text-zinc-400 block">Total Words Spoken</span>
          <div className="text-3xl font-extrabold font-mono text-zinc-50">{totalWords}</div>
          <p className="text-[11px] text-zinc-500">Real-Time Speech-to-Text</p>
        </div>

        {/* Filler Words Counter */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Filler Words Detected</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${totalFillers > 3 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
              {totalFillers <= 3 ? "GOOD" : "HIGH"}
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-orange-400">{totalFillers}</div>
          <p className="text-[11px] text-zinc-500">Tracked: um, uh, like, basically</p>
        </div>
      </div>

      {/* Live Transcript Stream Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
        <span className="text-xs font-mono uppercase text-zinc-400 block font-semibold">
          Live Audio Transcript Stream
        </span>
        <div className="min-h-[60px] text-sm text-zinc-300 font-mono leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/80">
          {currentTranscript ? (
            <span>{currentTranscript}</span>
          ) : (
            <span className="text-zinc-600 italic">Click &ldquo;Start Voice Session&rdquo; and speak into your microphone...</span>
          )}
        </div>
      </div>
    </div>
  );
}
