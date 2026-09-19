'use client';
import { useState, useEffect } from 'react';
import { addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

const ANALYTICAL_PUZZLES = [
  {
    id: 1,
    type: 'matrix_grid',
    title: 'Numerical Matrix Logic',
    prompt: 'Determine the missing number in the 3x3 matrix visual below:',
    visual: 'matrix_3x3',
    options: [
      { text: '21', isCorrect: false },
      { text: '28', isCorrect: true, explanation: 'Each row doubles the preceding number (7 * 2 = 14, 14 * 2 = 28).' },
      { text: '24', isCorrect: false },
      { text: '35', isCorrect: false }
    ]
  },
  {
    id: 2,
    type: 'pipeline',
    title: 'System Latency Bottleneck Diagram',
    prompt: 'Evaluate the total latency floor for the parallel workflow execution below:',
    visual: 'latency_graph',
    options: [
      { text: '210ms', isCorrect: false },
      { text: '160ms', isCorrect: true, explanation: 'Total Latency = Service A (40ms) + Max(Service B 120ms, Service C 50ms) = 40 + 120 = 160ms.' },
      { text: '170ms', isCorrect: false },
      { text: '90ms', isCorrect: false }
    ]
  },
  {
    id: 3,
    type: 'multiplier',
    title: 'Data Grid Transformation',
    prompt: 'Find the missing value based on the multiplier pattern across grid blocks:',
    visual: 'data_transform',
    options: [
      { text: '150', isCorrect: false },
      { text: '180', isCorrect: true, explanation: 'Grid C multiplies by 6: 5 * 6 = 30, 30 * 6 = 180.' },
      { text: '120', isCorrect: false },
      { text: '210', isCorrect: false }
    ]
  },
  {
    id: 4,
    type: 'code_stack',
    title: 'Algorithmic Call Tree Trace',
    prompt: 'Trace the execution call stack of f(4) shown in the visual diagram:',
    visual: 'recursion_tree',
    options: [
      { text: '10', isCorrect: true, explanation: 'f(4) = 4 + 3 + 2 + 1 = 10.' },
      { text: '24', isCorrect: false },
      { text: '8', isCorrect: false },
      { text: '16', isCorrect: false }
    ]
  }
];

export default function MindMatrix({ onBack }) {
  const { user, updateUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentPuzzle = ANALYTICAL_PUZZLES[currentIdx];

  useEffect(() => {
    if (isCompleted || selectedOpt !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSelectOption(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, isCompleted, selectedOpt]);

  const handleSelectOption = async (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);

    const isCorrect = idx !== -1 && currentPuzzle.options[idx].isCorrect;

    if (isCorrect) {
      const newStreak = streak + 1;
      const pts = 50 + newStreak * 10;
      setStreak(newStreak);
      setScore(s => s + pts);
      setFeedback({ type: 'success', msg: `🧠 Brilliant Deduction! +${pts} XP (${newStreak}x Combo) • ${currentPuzzle.options[idx].explanation}` });

      if (user?.email) {
        const u = await addXP(user.email, pts);
        if (u) updateUser(u);
      }
    } else {
      setStreak(0);
      const explanation = idx >= 0 ? currentPuzzle.options.find(o => o.isCorrect)?.explanation : 'Time expired!';
      setFeedback({ type: 'error', msg: `❌ Incorrect logic. ${explanation}` });
    }

    setTimeout(() => {
      if (currentIdx < ANALYTICAL_PUZZLES.length - 1) {
        setCurrentIdx(i => i + 1);
        setSelectedOpt(null);
        setFeedback(null);
        setTimeLeft(25);
      } else {
        setIsCompleted(true);
      }
    }, 2200);
  };

  // Render Visual SVG Diagram for each question
  const renderVisual = (visualType) => {
    if (visualType === 'matrix_3x3') {
      return (
        <svg viewBox="0 0 320 180" className="w-full max-w-[300px] mx-auto select-none">
          <g transform="translate(10, 10)">
            {/* Row 1 */}
            <rect x="0" y="0" width="90" height="45" rx="8" fill="#18181B" stroke="#2EC4B6" strokeWidth="2" />
            <text x="45" y="28" textAnchor="middle" fill="#2EC4B6" fontSize="16" fontWeight="black">4</text>

            <rect x="100" y="0" width="90" height="45" rx="8" fill="#18181B" stroke="#2EC4B6" strokeWidth="2" />
            <text x="145" y="28" textAnchor="middle" fill="#2EC4B6" fontSize="16" fontWeight="black">8</text>

            <rect x="200" y="0" width="90" height="45" rx="8" fill="#18181B" stroke="#2EC4B6" strokeWidth="2" />
            <text x="245" y="28" textAnchor="middle" fill="#2EC4B6" fontSize="16" fontWeight="black">16</text>

            {/* Row 2 */}
            <rect x="0" y="55" width="90" height="45" rx="8" fill="#18181B" stroke="#FF7A18" strokeWidth="2" />
            <text x="45" y="83" textAnchor="middle" fill="#FF7A18" fontSize="16" fontWeight="black">5</text>

            <rect x="100" y="55" width="90" height="45" rx="8" fill="#18181B" stroke="#FF7A18" strokeWidth="2" />
            <text x="145" y="83" textAnchor="middle" fill="#FF7A18" fontSize="16" fontWeight="black">10</text>

            <rect x="200" y="55" width="90" height="45" rx="8" fill="#18181B" stroke="#FF7A18" strokeWidth="2" />
            <text x="245" y="83" textAnchor="middle" fill="#FF7A18" fontSize="16" fontWeight="black">20</text>

            {/* Row 3 */}
            <rect x="0" y="110" width="90" height="45" rx="8" fill="#18181B" stroke="#A78BFA" strokeWidth="2" />
            <text x="45" y="138" textAnchor="middle" fill="#A78BFA" fontSize="16" fontWeight="black">7</text>

            <rect x="100" y="110" width="90" height="45" rx="8" fill="#18181B" stroke="#A78BFA" strokeWidth="2" />
            <text x="145" y="138" textAnchor="middle" fill="#A78BFA" fontSize="16" fontWeight="black">14</text>

            <rect x="200" y="110" width="90" height="45" rx="8" fill="#FF7A18" stroke="#FFFFFF" strokeWidth="3" className="animate-pulse" />
            <text x="245" y="138" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="black">?</text>
          </g>
        </svg>
      );
    }

    if (visualType === 'latency_graph') {
      return (
        <svg viewBox="0 0 380 140" className="w-full max-w-[360px] mx-auto select-none">
          {/* Paths */}
          <path d="M 90 70 L 150 40 L 250 40" stroke="#2EC4B6" strokeWidth="3" fill="none" />
          <path d="M 90 70 L 150 100 L 250 100" stroke="#FF7A18" strokeWidth="3" fill="none" />
          <path d="M 250 40 L 300 70" stroke="#2EC4B6" strokeWidth="3" fill="none" />
          <path d="M 250 100 L 300 70" stroke="#FF7A18" strokeWidth="3" fill="none" />

          {/* Nodes */}
          {/* Service A */}
          <g transform="translate(10, 50)">
            <rect width="80" height="40" rx="8" fill="#18181B" stroke="#2EC4B6" strokeWidth="2" />
            <text x="40" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Service A</text>
            <text x="40" y="32" textAnchor="middle" fill="#2EC4B6" fontSize="10" fontWeight="bold">40ms</text>
          </g>

          {/* Service B */}
          <g transform="translate(150, 20)">
            <rect width="100" height="40" rx="8" fill="#18181B" stroke="#FF7A18" strokeWidth="2" />
            <text x="50" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Service B</text>
            <text x="50" y="32" textAnchor="middle" fill="#FF7A18" fontSize="10" fontWeight="bold">120ms (Max)</text>
          </g>

          {/* Service C */}
          <g transform="translate(150, 80)">
            <rect width="100" height="40" rx="8" fill="#18181B" stroke="#A78BFA" strokeWidth="2" />
            <text x="50" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Service C</text>
            <text x="50" y="32" textAnchor="middle" fill="#A78BFA" fontSize="10" fontWeight="bold">50ms (Parallel)</text>
          </g>

          {/* Output */}
          <g transform="translate(290, 50)">
            <circle cx="20" cy="20" r="18" fill="#059669" stroke="#34D399" strokeWidth="2" />
            <text x="20" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">🏁</text>
          </g>
        </svg>
      );
    }

    if (visualType === 'data_transform') {
      return (
        <svg viewBox="0 0 360 120" className="w-full max-w-[340px] mx-auto select-none">
          {/* Grid A */}
          <g transform="translate(10, 20)">
            <rect width="100" height="80" rx="10" fill="#18181B" stroke="#2EC4B6" strokeWidth="2" />
            <text x="50" y="25" textAnchor="middle" fill="#2EC4B6" fontSize="10" fontWeight="bold">Grid A (x3)</text>
            <text x="50" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="black">3 ➔ 9 ➔ 27</text>
          </g>

          {/* Grid B */}
          <g transform="translate(130, 20)">
            <rect width="100" height="80" rx="10" fill="#18181B" stroke="#A78BFA" strokeWidth="2" />
            <text x="50" y="25" textAnchor="middle" fill="#A78BFA" fontSize="10" fontWeight="bold">Grid B (x4)</text>
            <text x="50" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="black">2 ➔ 8 ➔ 32</text>
          </g>

          {/* Grid C */}
          <g transform="translate(250, 20)">
            <rect width="100" height="80" rx="10" fill="#18181B" stroke="#FF7A18" strokeWidth="2" />
            <text x="50" y="25" textAnchor="middle" fill="#FF7A18" fontSize="10" fontWeight="bold">Grid C (x6)</text>
            <text x="50" y="55" textAnchor="middle" fill="#FF7A18" fontSize="14" fontWeight="black">5 ➔ 30 ➔ ?</text>
          </g>
        </svg>
      );
    }

    if (visualType === 'recursion_tree') {
      return (
        <svg viewBox="0 0 340 140" className="w-full max-w-[320px] mx-auto select-none">
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="280" height="30" rx="6" fill="#18181B" stroke="#2EC4B6" strokeWidth="2" />
            <text x="140" y="20" textAnchor="middle" fill="#2EC4B6" fontSize="12" fontWeight="bold">f(4) = 4 + f(3)</text>

            <rect x="30" y="35" width="220" height="30" rx="6" fill="#18181B" stroke="#FF7A18" strokeWidth="2" />
            <text x="140" y="55" textAnchor="middle" fill="#FF7A18" fontSize="12" fontWeight="bold">f(3) = 3 + f(2)</text>

            <rect x="60" y="70" width="160" height="30" rx="6" fill="#18181B" stroke="#A78BFA" strokeWidth="2" />
            <text x="140" y="90" textAnchor="middle" fill="#A78BFA" fontSize="12" fontWeight="bold">f(2) = 2 + f(1)</text>

            <rect x="90" y="105" width="100" height="25" rx="6" fill="#059669" />
            <text x="140" y="122" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">f(1) = 1 Base</text>
          </g>
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 bg-zinc-900 border-[3px] border-black rounded-3xl shadow-[8px_8px_0px_#111] animate-fade-in font-['Inter']">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-black font-['Outfit'] uppercase text-zinc-100">
              Mind Matrix & Visual Logic Arena
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Train analytical thinking, pattern deduction, and cognitive problem-solving with visual diagrams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-[#2EC4B6]/20 border border-[#2EC4B6]/40 text-[#2EC4B6] font-black text-xs rounded-xl">
            Score: {score} XP
          </span>
          <button
            onClick={onBack}
            className="text-xs px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors border border-zinc-700"
          >
            ← All Games
          </button>
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-12 space-y-4">
          <span className="text-6xl animate-bounce">⚡</span>
          <h3 className="text-3xl font-black font-['Outfit'] uppercase text-zinc-100">Mind Matrix Complete!</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Analytical Score: <strong className="text-emerald-400 text-lg">{score} XP Earned</strong>
          </p>
          <button
            onClick={() => { setCurrentIdx(0); setSelectedOpt(null); setScore(0); setStreak(0); setIsCompleted(false); setTimeLeft(25); }}
            className="px-8 py-3 bg-[#2EC4B6] hover:bg-teal-500 text-white font-black uppercase rounded-xl text-sm shadow-[4px_4px_0px_#111]"
          >
            Play Mind Matrix Again
          </button>
        </div>
      ) : (
        <div className="w-full space-y-6">
          
          {/* Progress & Timer */}
          <div className="flex justify-between items-center text-xs">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-bold uppercase tracking-wider">
              {currentPuzzle.title}
            </span>
            <div className="flex items-center gap-3 font-bold">
              {streak > 0 && <span className="text-orange-400 animate-pulse">🔥 {streak}x Combo</span>}
              <span className={`px-3 py-1 rounded-full border ${timeLeft <= 5 ? 'bg-red-500/20 border-red-500 text-red-400 animate-bounce' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}>
                ⏱️ {timeLeft}s Left
              </span>
            </div>
          </div>

          {/* Puzzle Prompt & SVG Visual Card */}
          <div className="p-5 bg-zinc-950 border-2 border-zinc-800 rounded-2xl shadow-inner space-y-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block self-start">Visual Challenge:</span>
            <p className="text-sm font-semibold text-zinc-100 text-center font-['Outfit']">
              {currentPuzzle.prompt}
            </p>
            
            {/* Visual SVG Container */}
            <div className="w-full bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 flex justify-center">
              {renderVisual(currentPuzzle.visual)}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPuzzle.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOpt !== null}
                  className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-red-500/20 border-red-500 text-red-200'
                      : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-extrabold text-zinc-300 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-2xl text-xs font-bold text-center border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/20 border-red-500/40 text-red-300'
            }`}>
              {feedback.msg}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
