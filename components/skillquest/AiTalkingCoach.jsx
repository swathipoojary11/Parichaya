"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { analyzeCoachResponse, computeAttemptComparison } from "@/lib/services/aiCoachService";

export default function AiTalkingCoach({ questionPrompt = "Tell me about your final-year project.", onComplete }) {
  const [attempt, setAttempt] = useState(1); // 1 or 2
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempt1Result, setAttempt1Result] = useState(null);
  const [attempt2Result, setAttempt2Result] = useState(null);
  const [comparison, setComparison] = useState(null);

  const handleSubmitAttempt = async () => {
    if (!userText || userText.length < 15) return;
    setLoading(true);

    const result = await analyzeCoachResponse(questionPrompt, userText, attempt);

    if (attempt === 1) {
      setAttempt1Result(result);
      setAttempt(2);
      setUserText(""); // Clear for retry
    } else {
      setAttempt2Result(result);
      const comp = computeAttemptComparison(attempt1Result, result);
      setComparison(comp);

      if (onComplete) {
        onComplete({ challengeId: "coach_retry", score: result.overallScore, passed: result.passedThreshold });
      }
    }

    setLoading(false);
  };

  return (
    <Card glow className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">
          🐱 SoftSkill Quest &bull; Interactive AI Practice Coach
        </span>
        <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
          Attempt {attempt} of 2
        </span>
      </div>

      {/* AI Coach Avatar & Speech Bubble */}
      <div className="flex items-start space-x-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
        {/* Cat Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-2xl font-bold shadow-lg shadow-orange-500/20 flex-shrink-0 animate-bounce">
          🐱
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-200 font-bold">AURA Companion Coach</span>
            <span className="text-zinc-500">Live Practice Coach</span>
          </div>

          <p className="text-sm font-semibold text-zinc-100 leading-relaxed">
            {attempt === 1 && !attempt1Result
              ? `"${questionPrompt}"`
              : attempt1Result && !attempt2Result
              ? `"${attempt1Result.coachFeedback}"`
              : attempt2Result
              ? `"${attempt2Result.coachFeedback}"`
              : `"${questionPrompt}"`}
          </p>
        </div>
      </div>

      {/* Attempt Input Form */}
      {!attempt2Result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>
              {attempt === 1 ? "Attempt 1: Speak or Type Your Response" : "Attempt 2 (Retry): Improve Personal Contribution & Impact"}
            </span>
          </div>

          <textarea
            rows={4}
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder={
              attempt === 1
                ? "e.g. For my final year project, our team built an AI career suite using Next.js and Ollama..."
                : "e.g. For my final year project, I personally engineered the in-browser PDF parser and WebSocket telemetry pipeline, reducing response latency by 35%..."
            }
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-500 leading-relaxed"
          />

          <div className="flex justify-end">
            <Button
              variant="primary"
              loading={loading}
              disabled={!userText || userText.length < 15}
              onClick={handleSubmitAttempt}
            >
              {attempt === 1 ? "Submit Attempt 1 →" : "Submit Retry (Attempt 2) 🚀"}
            </Button>
          </div>
        </div>
      )}

      {/* Attempt 1 vs Attempt 2 Comparison Matrix */}
      {attempt1Result && (
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">Attempt Performance Comparison</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attempt 1 Card */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-zinc-400 font-bold">
                <span>Attempt 1</span>
                <span className="text-orange-400 text-sm font-extrabold">{attempt1Result.overallScore}%</span>
              </div>
              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div>Clarity: <span className="text-zinc-200">{attempt1Result.clarityScore}%</span></div>
                <div>STAR Structure: <span className="text-zinc-200">{attempt1Result.starStructureScore}%</span></div>
                <div>Personal Impact: <span className="text-zinc-200">{attempt1Result.personalContributionScore}%</span></div>
              </div>
            </div>

            {/* Attempt 2 Card */}
            {attempt2Result ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>Attempt 2 (Retry)</span>
                  <span className="text-emerald-400 text-sm font-extrabold">{attempt2Result.overallScore}%</span>
                </div>
                <div className="space-y-1 text-zinc-300 text-[11px]">
                  <div>Clarity: <span className="text-emerald-300">{attempt2Result.clarityScore}%</span></div>
                  <div>STAR Structure: <span className="text-emerald-300">{attempt2Result.starStructureScore}%</span></div>
                  <div>Personal Impact: <span className="text-emerald-300">{attempt2Result.personalContributionScore}%</span></div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-xs font-mono text-zinc-500">
                <span>Pending Attempt 2 Retry...</span>
              </div>
            )}
          </div>

          {/* Comparison Gain Banner */}
          {comparison && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-orange-400 font-bold uppercase">Retry Improvement Gain:</span>
                <p className="text-zinc-300">
                  Overall Score: <span className="text-emerald-400 font-bold">{comparison.overallDiff}</span> | STAR Structure: <span className="text-emerald-400 font-bold">{comparison.structureDiff}</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                +100 XP Awarded 🏆
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
