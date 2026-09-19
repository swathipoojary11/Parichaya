'use client';
import { useState, useEffect } from 'react';
import { DSA_PROBLEMS } from '@/lib/dsaProblemSet';
import { recordDSASubmission, addXP, getDSAProgress } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

export default function CodeSandbox({ onBack }) {
  const { user, updateUser } = useAuth();
  const [activeProblemId, setActiveProblemId] = useState('easy-1');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL'); // ALL, Easy, Medium, Hard
  const [solvedMap, setSolvedMap] = useState({});
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Load solved records
  useEffect(() => {
    if (user?.email) {
      getDSAProgress(user.email).then(records => {
        if (records) {
          const map = {};
          records.forEach(r => { if (r.solved) map[r.problemId] = true; });
          setSolvedMap(map);
        }
      }).catch(console.error);
    }
  }, [user?.email]);

  const activeProblem = DSA_PROBLEMS.find(p => p.id === activeProblemId) || DSA_PROBLEMS[0];

  useEffect(() => {
    setCode(activeProblem.initialCode);
    setResults(null);
  }, [activeProblemId, activeProblem.initialCode]);

  const filteredProblems = DSA_PROBLEMS.filter(p => {
    if (difficultyFilter === 'ALL') return true;
    return p.difficulty === difficultyFilter;
  });

  const runCode = () => {
    setIsRunning(true);
    setResults(null);

    setTimeout(async () => {
      try {
        // Safe evaluation using isolated Function wrapper
        // eslint-disable-next-line no-new-func
        const userFn = new Function(`
          ${code}
          return typeof ${activeProblem.functionName} !== 'undefined' ? ${activeProblem.functionName} : null;
        `)();

        if (!userFn || typeof userFn !== 'function') {
          throw new Error(`Function "${activeProblem.functionName}" was not declared or exported.`);
        }

        const testOutputs = activeProblem.testCases.map((tc, idx) => {
          try {
            // Deep clone input so in-place mutations don't mutate the original test suite
            const clonedInput = JSON.parse(JSON.stringify(tc.input));
            const actual = userFn(...clonedInput);
            const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
            return {
              testNumber: idx + 1,
              input: JSON.stringify(tc.input),
              expected: JSON.stringify(tc.expected),
              actual: JSON.stringify(actual),
              passed
            };
          } catch (err) {
            return {
              testNumber: idx + 1,
              input: JSON.stringify(tc.input),
              expected: JSON.stringify(tc.expected),
              actual: `Runtime Error: ${err.message}`,
              passed: false
            };
          }
        });

        const allPassed = testOutputs.every(t => t.passed);
        setResults({ tests: testOutputs, allPassed });

        if (user?.email) {
          await recordDSASubmission(user.email, activeProblem.id, {
            solved: allPassed,
            topic: activeProblem.topic,
            difficulty: activeProblem.difficulty
          });

          if (allPassed && !solvedMap[activeProblem.id]) {
            setSolvedMap(prev => ({ ...prev, [activeProblem.id]: true }));
            const u = await addXP(user.email, activeProblem.difficulty === 'Hard' ? 150 : activeProblem.difficulty === 'Medium' ? 100 : 60);
            if (u) updateUser(u);
          }
        }
      } catch (compileErr) {
        setResults({
          tests: [],
          allPassed: false,
          error: `Execution Error: ${compileErr.message}`
        });
      } finally {
        setIsRunning(false);
      }
    }, 250);
  };

  const solvedCount = Object.keys(solvedMap).length;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💻</span>
            <h2 className="text-2xl font-bold text-zinc-100">DSA Studio (30 Core Problems)</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Exactly 10 Easy, 10 Medium, 10 Hard challenges. In-browser sandbox execution with test case validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-zinc-800 rounded-xl border border-zinc-700 text-xs text-zinc-300 font-semibold">
            Solved: <span className="text-emerald-400 font-bold">{solvedCount}</span> / 30
          </div>
          <button
            onClick={onBack}
            className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
          >
            ← All Games
          </button>
        </div>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'ALL', label: 'All 30 Problems' },
          { id: 'Easy', label: '10 Easy (Fundamentals)' },
          { id: 'Medium', label: '10 Medium (Core LeetCode)' },
          { id: 'Hard', label: '10 Hard (Advanced)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setDifficultyFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              difficultyFilter === tab.id
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Problem Browser (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3 max-h-[600px] overflow-y-auto space-y-1.5">
          {filteredProblems.map(p => {
            const isSolved = !!solvedMap[p.id];
            const isSelected = p.id === activeProblemId;

            return (
              <button
                key={p.id}
                onClick={() => setActiveProblemId(p.id)}
                className={`w-full p-3 text-left rounded-xl border transition-all flex items-center justify-between text-xs ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-200 font-bold'
                    : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span>{isSolved ? '✓' : '○'}</span>
                    <span className="line-clamp-1">{p.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">{p.topic}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  p.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-400' : p.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {p.difficulty}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Code Sandbox & Output (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Problem Info */}
          <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-100">{activeProblem.title}</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeProblem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : activeProblem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {activeProblem.difficulty}
                </span>
              </div>
              {activeProblem.referenceUrl && (
                <a
                  href={activeProblem.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-400 hover:underline flex items-center gap-1"
                >
                  LeetCode Source ↗
                </a>
              )}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{activeProblem.description}</p>
          </div>

          {/* Editor */}
          <div className="border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-zinc-950 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <span>solution.js</span>
              <span>In-Browser JavaScript Sandbox</span>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              rows={10}
              spellCheck={false}
              className="w-full p-4 bg-zinc-950 font-mono text-xs text-emerald-400 leading-relaxed focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCode(activeProblem.initialCode)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Reset Solution Template
            </button>

            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {isRunning ? 'Running Test Cases...' : `▶ Execute Against Test Cases (+${activeProblem.difficulty === 'Hard' ? '150' : '100'} XP)`}
            </button>
          </div>

          {/* Execution Results */}
          {results && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Execution Output
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  results.allPassed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {results.allPassed ? '✓ All Tests Passed! (+XP Awarded)' : '✗ Test Failed'}
                </span>
              </div>

              {results.error ? (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono">
                  {results.error}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {results.tests.map(t => (
                    <div
                      key={t.testNumber}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                        t.passed
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/5 border-red-500/20 text-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{t.passed ? '✓' : '✗'}</span>
                        <span>Case #{t.testNumber}:</span>
                        <span className="text-zinc-400">Input: {t.input}</span>
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        Expected: {t.expected} | Got: {t.actual}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
