"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function StarStoryBuilder({ onComplete }) {
  const correctOrder = [
    { type: "Situation", text: "During my internship at TechCorp, our database response latency spiked to 450ms during peak usage." },
    { type: "Task", text: "My goal was to optimize query performance and reduce load latency below 150ms without adding new hardware." },
    { type: "Action", text: "I analyzed slow query logs, implemented Redis caching, and added compound indexes on frequent JOIN columns." },
    { type: "Result", text: "This reduced average API latency by 68% (down to 140ms) and saved $4,000 in monthly infrastructure costs." }
  ];

  const [blocks, setBlocks] = useState(() => {
    return [...correctOrder].sort(() => Math.random() - 0.5);
  });
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setBlocks(updated);
    setChecked(false);
  };

  const moveDown = (index) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setBlocks(updated);
    setChecked(false);
  };

  const handleVerify = () => {
    const match = blocks.every((b, idx) => b.type === correctOrder[idx].type);
    setIsCorrect(match);
    setChecked(true);

    if (match && onComplete) {
      onComplete({ challengeId: "star_builder", score: 100, passed: true });
    }
  };

  return (
    <Card glow className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">
          ⭐ SoftSkill Quest &bull; STAR Methodology Story Builder
        </span>
        <h3 className="text-xl font-extrabold text-zinc-50">Arrange STAR Story Blocks</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Reorder the shuffled blocks into the correct STAR methodology sequence (Situation &rarr; Task &rarr; Action &rarr; Result).
        </p>
      </div>

      {/* Blocks List */}
      <div className="space-y-2.5 font-mono text-xs">
        {blocks.map((block, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800 hover:border-orange-500/40 transition-colors"
          >
            <div className="flex items-center space-x-3 pr-4">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-orange-400 font-bold text-[11px]">
                {block.type}
              </span>
              <p className="text-zinc-200 text-xs leading-relaxed">{block.text}</p>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === blocks.length - 1}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="primary" onClick={handleVerify}>
          Verify STAR Story Sequence
        </Button>

        {checked && (
          <span className={`px-3 py-1 rounded text-xs font-mono font-bold border ${isCorrect ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {isCorrect ? "✓ Correct STAR Sequence! (+100 XP)" : "✗ Incorrect sequence. Remember: Situation -> Task -> Action -> Result."}
          </span>
        )}
      </div>
    </Card>
  );
}
