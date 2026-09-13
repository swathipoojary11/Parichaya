"use client";

export default function LiveHudTelemetry({ telemetry, activeQuestion, currentTranscript }) {
  const { wpm = 140, totalWords = 0, totalFillers = 0, fillerWordCounts = {} } = telemetry || {};

  const getPacingStatus = (speed) => {
    if (speed < 110) return { label: "TOO SLOW", color: "text-amber-700 border-amber-200 bg-amber-50" };
    if (speed > 180) return { label: "TOO FAST", color: "text-rose-700 border-rose-200 bg-rose-50" };
    return { label: "OPTIMAL CADENCE", color: "text-emerald-700 border-emerald-200 bg-emerald-50" };
  };

  const pacingInfo = getPacingStatus(wpm);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Active Question Prompt Display */}
      {activeQuestion && (
        <div className="bg-white border border-indigo-200/90 rounded-2xl p-6 space-y-2 shadow-soft glow-indigo-light">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-indigo-600 font-bold uppercase tracking-wider">
              Question {activeQuestion.id} &bull; {activeQuestion.category}
            </span>
            <span className="text-slate-500 font-bold">STAR Focus: {activeQuestion.starFocus}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-relaxed">
            &ldquo;{activeQuestion.questionText}&rdquo;
          </h3>
        </div>
      )}

      {/* Telemetry Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WPM Pacing Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="font-bold">Speech Cadence</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pacingInfo.color}`}>
              {pacingInfo.label}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">{wpm}</span>
            <span className="text-xs font-mono text-slate-500 font-bold">WPM</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Target Range: 130 – 160 WPM</p>
        </div>

        {/* Word Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-soft">
          <span className="text-xs font-mono font-bold text-slate-500 block">Total Words Spoken</span>
          <div className="text-3xl font-extrabold font-mono text-slate-900">{totalWords}</div>
          <p className="text-[11px] text-slate-500 font-medium">Real-Time Speech-to-Text</p>
        </div>

        {/* Filler Words Counter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="font-bold">Filler Words</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${totalFillers > 3 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {totalFillers <= 3 ? "GOOD" : "HIGH"}
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-indigo-600">{totalFillers}</div>
          <p className="text-[11px] text-slate-500 font-medium">Tracked: um, uh, like, basically</p>
        </div>
      </div>

      {/* Live Transcript Stream Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-soft">
        <span className="text-xs font-mono uppercase text-slate-500 block font-bold">
          Live Audio Transcript Stream
        </span>
        <div className="min-h-[60px] text-sm text-slate-800 font-mono leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
          {currentTranscript ? (
            <span>{currentTranscript}</span>
          ) : (
            <span className="text-slate-400 italic">Click &ldquo;Start Voice Session&rdquo; and speak into your microphone...</span>
          )}
        </div>
      </div>
    </div>
  );
}
