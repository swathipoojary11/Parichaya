"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function McqBattleChallenge({ challenge, onComplete }) {
  const {
    id = "mcq_01",
    title = "Timed MCQ Battle: Data Structures & Web Architecture",
    questions = [
      {
        question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctIndex: 1,
        explanation: "Balanced BST halves the search space at each step, resulting in O(log N) complexity."
      },
      {
        question: "Which pattern is optimal for detecting cycles in a Linked List?",
        options: ["Sliding Window", "Two Pointers (Fast & Slow)", "Monotonic Stack", "Trie"],
        correctIndex: 1,
        explanation: "Floyd's Fast & Slow pointers move at 2x and 1x speed to detect cycles in O(N) time and O(1) space."
      },
      {
        question: "In WebSockets communication, what is the primary benefit over traditional HTTP polling?",
        options: ["Higher bandwidth compression", "Full-duplex bidirectional persistent connection", "Automatic SQL query optimization", "Client-side PDF rendering"],
        correctIndex: 1,
        explanation: "WebSockets open a persistent TCP connection allowing bidirectional real-time data frame streaming."
      }
    ]
  } = challenge || {};

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const currentQ = questions[currentIdx];
    let isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setFinished(true);
      const finalPercentage = Math.round(((score + (selectedOption === questions[currentIdx].correctIndex ? 1 : 0)) / questions.length) * 100);
      if (onComplete) {
        onComplete({ challengeId: id, score: finalPercentage, passed: finalPercentage >= 70 });
      }
    }
  };

  const activeQ = questions[currentIdx];

  return (
    <Card glow className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">
          ⚔ TechQuest &bull; Timed Technical MCQ Battle
        </span>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
            ⏱ Time: <span className={timeLeft < 10 ? "text-red-400 font-bold animate-ping" : "text-orange-400 font-bold"}>{timeLeft}s</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold">
            Score: {score}/{questions.length}
          </span>
        </div>
      </div>

      {!finished ? (
        <div className="space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-500">Question {currentIdx + 1} of {questions.length}</span>
            <h3 className="text-lg font-bold text-zinc-50">{activeQ.question}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activeQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === activeQ.correctIndex;
              let btnStyle = "border-zinc-800 bg-zinc-950 text-zinc-200 hover:border-orange-500/50";

              if (selectedOption !== null) {
                if (isCorrect) btnStyle = "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-bold";
                else if (isSelected) btnStyle = "border-red-500/40 bg-red-950/30 text-red-300";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all duration-200 ${btnStyle}`}
                >
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span> {opt}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1 text-xs">
              <span className="font-bold font-mono text-orange-400">Explanation:</span>
              <p className="text-zinc-300 leading-relaxed">{activeQ.explanation}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="primary" disabled={selectedOption === null} onClick={handleNextQuestion}>
              {currentIdx < questions.length - 1 ? "Next Question →" : "Finish Battle 🏆"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="text-4xl">🏆</div>
          <h3 className="text-xl font-bold text-zinc-50">MCQ Battle Completed!</h3>
          <p className="text-sm font-mono text-orange-400 font-bold">
            Final Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {score / questions.length >= 0.7 ? "Great job! You passed the technical knowledge threshold." : "Keep practicing! Review algorithm patterns to boost your score."}
          </p>
        </div>
      )}
    </Card>
  );
}
