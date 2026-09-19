'use client';

const COMMON_FILLERS = ['um', 'uh', 'like', 'basically', 'actually', 'you know', 'literally', 'sort of', 'kind of'];

export function calculateSpeechMetrics(transcript, durationSeconds) {
  if (!transcript || durationSeconds <= 0) {
    return { wpm: 0, fillerCount: 0, fillerWords: [], wordCount: 0 };
  }

  const words = transcript.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(durationSeconds / 60, 0.05);
  const wpm = Math.round(wordCount / minutes);

  const foundFillers = [];
  COMMON_FILLERS.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = transcript.match(regex);
    if (matches) {
      foundFillers.push({ word: filler, count: matches.length });
    }
  });

  const fillerCount = foundFillers.reduce((acc, curr) => acc + curr.count, 0);

  return { wpm, fillerCount, fillerWords: foundFillers, wordCount };
}

export default function SpeechMetrics({ wpm = 0, fillerCount = 0, durationSeconds = 0, fillerWords = [] }) {
  // Ideal speaking rate: 120-160 WPM
  let paceStatus = 'Good Pace';
  let paceColor = 'text-emerald-400';
  if (wpm < 100 && wpm > 0) {
    paceStatus = 'Deliberate / Slow';
    paceColor = 'text-amber-400';
  } else if (wpm > 170) {
    paceStatus = 'Rushing / Fast';
    paceColor = 'text-orange-400';
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {/* WPM */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="text-xs text-zinc-400 mb-1 flex items-center justify-between">
          <span>Pace (WPM)</span>
          <span className={`text-[10px] font-bold ${paceColor}`}>{paceStatus}</span>
        </div>
        <div className="text-2xl font-bold text-zinc-100">{wpm}</div>
        <div className="text-[10px] text-zinc-500 mt-1">Target: 120 - 150 WPM</div>
      </div>

      {/* Filler Words */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="text-xs text-zinc-400 mb-1 flex items-center justify-between">
          <span>Filler Words</span>
          <span className={`text-[10px] font-bold ${fillerCount > 4 ? 'text-red-400' : 'text-emerald-400'}`}>
            {fillerCount > 4 ? 'High' : 'Minimal'}
          </span>
        </div>
        <div className="text-2xl font-bold text-orange-400">{fillerCount}</div>
        <div className="text-[10px] text-zinc-500 mt-1 truncate">
          {fillerWords.length > 0 ? fillerWords.map(f => `${f.word} (${f.count})`).join(', ') : 'Zero detected'}
        </div>
      </div>

      {/* Duration */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl col-span-2 sm:col-span-1">
        <div className="text-xs text-zinc-400 mb-1">Speaking Duration</div>
        <div className="text-2xl font-bold text-zinc-100">
          {Math.floor(durationSeconds / 60)}:{(durationSeconds % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-[10px] text-zinc-500 mt-1">Recommended: 60 - 120s</div>
      </div>
    </div>
  );
}
