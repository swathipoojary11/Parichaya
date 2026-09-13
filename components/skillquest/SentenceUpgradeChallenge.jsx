"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function SentenceUpgradeChallenge({ onComplete }) {
  const challenges = [
    {
      weak: "I helped make the web app faster.",
      options: [
        "I was involved in making web pages load quickly for users.",
        "I optimized React component rendering and implemented Redis caching, reducing page load latency by 45% for 10k users.",
        "The project speed was upgraded by our development team."
      ],
      correctIdx: 1,
      reason: "Uses Google X-Y-Z formula with personal action verb and quantifiable 45% latency metric."
    },
    {
      weak: "We worked on a team project using Python.",
      options: [
        "Our team wrote Python scripts to process company data.",
        "I engineered a Python ETL pipeline using Pandas to ingest 50,000 daily transaction records with 99.9% data accuracy.",
        "I was one of the Python programmers on our college project."
      ],
      correctIdx: 1,
      reason: "Emphasizes personal contribution ('I engineered') with specific libraries (Pandas) and throughput metrics."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const activeC = challenges[currentIdx];

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === activeC.correctIdx) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setFinished(true);
      if (onComplete) {
        onComplete({ challengeId: "sentence_upgrade", score: Math.round((score / challenges.length) * 100), passed: true });
      }
    }
  };

  return (
    <Card glow className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">
          ✍ SoftSkill Quest &bull; Professional Sentence Upgrade
        </span>
        <h3 className="text-xl font-extrabold text-zinc-50">Convert Weak Sentences to Professional Impact Statements</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Select the best professional STAR-aligned sentence upgrade that highlights personal contributions and metrics.
        </p>
      </div>

      {!finished ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-mono text-red-400 uppercase font-bold">Weak Candidate Statement:</span>
            <p className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 line-through">
              &ldquo;{activeC.weak}&rdquo;
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Select Professional Upgrade:</span>
            <div className="grid grid-cols-1 gap-3">
              {activeC.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === activeC.correctIdx;
                let btnStyle = "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-orange-500/50";

                if (selectedOpt !== null) {
                  if (isCorrect) btnStyle = "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-bold";
                  else if (isSelected) btnStyle = "border-red-500/40 bg-red-950/30 text-red-300";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOpt !== null}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all duration-200 ${btnStyle}`}
                  >
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span> {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOpt !== null && (
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono">
              <span className="text-orange-400 font-bold">Why this works: </span>
              <span className="text-zinc-300">{activeC.reason}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="primary" disabled={selectedOpt === null} onClick={handleNext}>
              {currentIdx < challenges.length - 1 ? "Next Sentence →" : "Finish Challenge 🏆"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <div className="text-3xl">✨</div>
          <h3 className="text-lg font-bold text-zinc-50">Challenge Complete!</h3>
          <p className="text-xs font-mono text-emerald-400 font-bold">
            You unlocked the Professional Impact Communicator Badge (+100 XP)
          </p>
        </div>
      )}
    </Card>
  );
}
