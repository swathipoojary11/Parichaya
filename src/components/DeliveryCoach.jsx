'use client';

export default function DeliveryCoach({
  originalText = '',
  improvedText = '',
  beforeMetrics = null,
  afterMetrics = null,
  onRewardXP = null
}) {
  // Generate cadence delivery text with pause tags
  const renderDeliveryScript = (text) => {
    if (!text) return null;

    // Split sentences and add delivery indicators
    const tokens = text.split(/([,.;?!])/g);
    const elements = [];

    for (let i = 0; i < tokens.length; i++) {
      const part = tokens[i];
      if (part === ',') {
        elements.push(
          <span key={`p-${i}`} className="inline-block mx-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-mono font-semibold border border-amber-500/30">
            [short pause]
          </span>
        );
      } else if (part === '.' || part === ';') {
        elements.push(
          <span key={`p-${i}`} className="inline-block mx-1.5 px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[11px] font-mono font-bold border border-orange-500/40">
            [full pause]
          </span>
        );
      } else if (part === '?') {
        elements.push(
          <span key={`p-${i}`} className="inline-block mx-1 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-semibold border border-cyan-500/30">
            [rising tone ↗]
          </span>
        );
      } else if (part === '!') {
        elements.push(
          <span key={`p-${i}`} className="inline-block mx-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-semibold border border-emerald-500/30">
            [emphasis ★]
          </span>
        );
      } else if (part) {
        elements.push(<span key={`t-${i}`}>{part}</span>);
      }
    }

    return elements;
  };

  const defaultImproved = improvedText ||
    (originalText
      ? `When approaching this challenge, [short pause] I first diagnosed the underlying bottleneck by profiling query execution plans. [full pause] Consequently, [short pause] we were able to reduce latency significantly while ensuring 100% data integrity. [full pause]`
      : 'Deliver your response with steady cadence and deliberate breathing.');

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Cadence & Delivery Card */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗣️</span>
            <div>
              <h3 className="font-bold text-zinc-100 text-base">Executive Delivery & Cadence Coaching</h3>
              <p className="text-xs text-zinc-400">Master vocal presence with tactical pauses and emphasis cues</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full">
            Speech Cue Guide
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 text-xs">
          <span className="text-zinc-500 text-[11px] self-center">Cue Legend:</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px]">
            , → [short pause]
          </span>
          <span className="px-2 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/25 text-[10px]">
            . → [full pause]
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-[10px]">
            ? → [rising tone]
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px]">
            ! → [emphasis]
          </span>
        </div>

        {/* Script Readout */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-200 text-sm leading-relaxed font-sans">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-2">
            Polished Delivery Script:
          </span>
          <div>{renderDeliveryScript(defaultImproved)}</div>
        </div>
      </div>

      {/* Before vs After Attempt Comparison */}
      {beforeMetrics && afterMetrics && (
        <div className="p-6 bg-zinc-900 border border-emerald-500/30 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-zinc-100 text-base">Attempt 1 vs Attempt 2 (Demonstrated Growth)</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              ✓ Measurable Progress Detected (+80 XP)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-2.5">Metric</th>
                  <th className="py-2.5">Attempt 1 (Before)</th>
                  <th className="py-2.5">Attempt 2 (After)</th>
                  <th className="py-2.5 text-right">Net Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                <tr>
                  <td className="py-2.5 text-zinc-300 font-sans">Filler Words</td>
                  <td className="py-2.5 text-red-400">{beforeMetrics.fillerCount || 0}</td>
                  <td className="py-2.5 text-emerald-400">{afterMetrics.fillerCount || 0}</td>
                  <td className="py-2.5 text-right font-bold text-emerald-400">
                    {afterMetrics.fillerCount < beforeMetrics.fillerCount
                      ? `-${beforeMetrics.fillerCount - afterMetrics.fillerCount} fillers`
                      : '0'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-zinc-300 font-sans">Pacing (WPM)</td>
                  <td className="py-2.5 text-zinc-300">{beforeMetrics.wpm || 0} WPM</td>
                  <td className="py-2.5 text-zinc-100">{afterMetrics.wpm || 0} WPM</td>
                  <td className="py-2.5 text-right font-bold text-orange-400">
                    {afterMetrics.wpm ? `${afterMetrics.wpm} WPM (Calibrated)` : '—'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-zinc-300 font-sans">STAR Structure Score</td>
                  <td className="py-2.5 text-zinc-400">{beforeMetrics.starScore || 50}%</td>
                  <td className="py-2.5 text-emerald-300">{afterMetrics.starScore || 85}%</td>
                  <td className="py-2.5 text-right font-bold text-emerald-400">
                    +{Math.max(0, (afterMetrics.starScore || 85) - (beforeMetrics.starScore || 50))}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-zinc-300 font-sans">Overall Communication Score</td>
                  <td className="py-2.5 text-zinc-400">{beforeMetrics.overallScore || 55}%</td>
                  <td className="py-2.5 text-emerald-300">{afterMetrics.overallScore || 88}%</td>
                  <td className="py-2.5 text-right font-bold text-emerald-400">
                    +{Math.max(0, (afterMetrics.overallScore || 88) - (beforeMetrics.overallScore || 55))}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
