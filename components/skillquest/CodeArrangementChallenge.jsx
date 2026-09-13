"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function CodeArrangementChallenge({ challenge, onComplete }) {
  const {
    id = "arr_01",
    title = "Code Arrangement: Binary Search Algorithm",
    description = "Click or drag the shuffled code lines to assemble the binary search algorithm in correct order.",
    correctOrder = [
      "let low = 0, high = arr.length - 1;",
      "while (low <= high) {",
      "  let mid = Math.floor((low + high) / 2);",
      "  if (arr[mid] === target) return mid;",
      "  if (arr[mid] < target) low = mid + 1;",
      "  else high = mid - 1;",
      "}",
      "return -1;"
    ]
  } = challenge || {};

  // Shuffle initial lines
  const [currentLines, setCurrentLines] = useState(() => {
    return [...correctOrder].sort(() => Math.random() - 0.5);
  });
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...currentLines];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setCurrentLines(updated);
    setChecked(false);
  };

  const moveDown = (index) => {
    if (index === currentLines.length - 1) return;
    const updated = [...currentLines];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setCurrentLines(updated);
    setChecked(false);
  };

  const handleCheckOrder = () => {
    const match = currentLines.every((line, idx) => line === correctOrder[idx]);
    setIsCorrect(match);
    setChecked(true);

    if (match && onComplete) {
      onComplete({ challengeId: id, score: 100, passed: true });
    }
  };

  return (
    <Card glow className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">
          🧩 TechQuest &bull; Code Line Assembly Challenge
        </span>
        <h3 className="text-xl font-extrabold text-zinc-50">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>

      {/* Shuffled Lines List */}
      <div className="space-y-2 font-mono text-xs">
        {currentLines.map((line, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-zinc-800 hover:border-orange-500/40 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-zinc-500 font-bold">{idx + 1}.</span>
              <code className="text-emerald-400">{line}</code>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === currentLines.length - 1}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="primary" onClick={handleCheckOrder}>
          Verify Code Line Assembly
        </Button>

        {checked && (
          <span className={`px-3 py-1 rounded text-xs font-mono font-bold border ${isCorrect ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {isCorrect ? "✓ Perfect Assembly! (+100 XP)" : "✗ Incorrect Order. Re-arrange lines and try again."}
          </span>
        )}
      </div>
    </Card>
  );
}
