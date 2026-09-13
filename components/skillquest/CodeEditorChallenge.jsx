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
    <Card glow className="space-y-6 border border-slate-200/90 shadow-soft">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-indigo-600 uppercase font-bold tracking-wider">
            ⚙ TechQuest &bull; Interactive Code Runner
          </span>
          {execResult && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${execResult.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              Score: {execResult.score}% ({execResult.passedCount}/{execResult.totalCount} Passed)
            </span>
          )}
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>

      {/* Code Editor Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-bold">
          <span>JavaScript Sandbox Code Editor</span>
          <button onClick={() => setCode(initialCode)} className="text-indigo-600 hover:underline">
            Reset Code ↺
          </button>
        </div>

        <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs shadow-md">
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
        <Button variant="indigo" loading={running} onClick={handleRunCode}>
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
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 text-xs text-amber-900">
          <div className="flex items-center space-x-2 text-amber-700 font-bold font-mono">
            <span>🤖 AI Coach Hint:</span>
            <span>{aiHint.hintTitle}</span>
          </div>
          <p className="leading-relaxed font-medium">{aiHint.hintMessage}</p>
        </div>
      )}

      {/* Test Case Results Grid */}
      {execResult && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-mono uppercase text-slate-500 font-bold">Test Case Evaluation Results</h4>
          <div className="grid grid-cols-1 gap-2.5">
            {execResult.results.map((res, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  res.passed
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">Test #{res.testCaseIndex}:</span>
                    <span>Input: <code className="text-slate-800 font-bold">{res.input}</code></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Expected: <code className="text-slate-800">{res.expected}</code> | Got: <code className={res.passed ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{res.actual}</code>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${res.passed ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
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
