"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { executeJavaScriptChallenge, getAiDebuggingHint } from "@/lib/services/codeExecutionService";

export default function CodeEditorChallenge({ challenge, onComplete }) {
  const {
    id,
    title = "Array Maximum Finder",
    description = "Fix or implement the function to return the maximum integer in the array.",
    initialCode = "function findMax(arr) {\n  let max = 0;\n  for(let i = 0; i < arr.length; i++) {\n    if(arr[i] > max) {\n      max = arr[i];\n    }\n  }\n  return max;\n}",
    functionName = "findMax",
    testCases = [
      { input: [[4, 2, 8, 1]], expected: 8 },
      { input: [[-5, -2, -10]], expected: -2 },
      { input: [[15]], expected: 15 }
    ]
  } = challenge || {};

  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [aiHint, setAiHint] = useState(null);

  const handleRunCode = async () => {
    setRunning(true);
    setAiHint(null);

    const result = await executeJavaScriptChallenge(code, testCases, functionName);
    setExecResult(result);
    setRunning(false);

    if (result.success && onComplete) {
      onComplete({ challengeId: id, score: result.score, passed: true });
    }
  };

  const handleGetHint = async () => {
    setHintLoading(true);
    const failedTc = execResult?.results?.find(r => !r.passed);
    const hint = await getAiDebuggingHint(code, description, failedTc);
    setAiHint(hint);
    setHintLoading(false);
  };

  return (
    <Card glow className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">
            ⚙ TechQuest &bull; Interactive Code Runner
          </span>
          {execResult && (
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${execResult.success ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              Score: {execResult.score}% ({execResult.passedCount}/{execResult.totalCount} Passed)
            </span>
          )}
        </div>
        <h3 className="text-xl font-extrabold text-zinc-50">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>

      {/* Code Editor Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>JavaScript Sandbox Code Editor</span>
          <button onClick={() => setCode(initialCode)} className="hover:text-orange-400 transition-colors">
            Reset Code ↺
          </button>
        </div>

        <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-xs">
          <textarea
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-transparent p-4 text-emerald-400 focus:outline-none leading-relaxed font-mono resize-y"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between">
        <Button variant="primary" loading={running} onClick={handleRunCode}>
          ▶ Run Code &amp; Verify Test Cases
        </Button>

        {execResult && !execResult.success && (
          <Button variant="outline" size="sm" loading={hintLoading} onClick={handleGetHint}>
            💡 Get AI Debugging Hint
          </Button>
        )}
      </div>

      {/* AI Debugging Hint Box */}
      {aiHint && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl space-y-1 text-xs">
          <div className="flex items-center space-x-2 text-orange-400 font-bold font-mono">
            <span>🤖 AI Coach Hint:</span>
            <span>{aiHint.hintTitle}</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">{aiHint.hintMessage}</p>
        </div>
      )}

      {/* Test Case Results Grid */}
      {execResult && (
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">Test Case Evaluation Results</h4>
          <div className="grid grid-cols-1 gap-2.5">
            {execResult.results.map((res, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                  res.passed
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : "bg-red-950/20 border-red-500/30 text-red-300"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">Test #{res.testCaseIndex}:</span>
                    <span>Input: <code className="text-zinc-200">{res.input}</code></span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Expected: <code className="text-zinc-300">{res.expected}</code> | Got: <code className={res.passed ? "text-emerald-400" : "text-red-400"}>{res.actual}</code>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-bold ${res.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {res.passed ? "✓ PASSED" : "✗ FAILED"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
