'use client';
import { useState } from 'react';
import { addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

export default function WaterJug({ onBack }) {
  const { user, updateUser } = useAuth();
  const [jugA, setJugA] = useState(0); // Max 4L
  const [jugB, setJugB] = useState(0); // Max 3L
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [history, setHistory] = useState(['Started puzzle: Jug A (0/4L), Jug B (0/3L)']);

  const MAX_A = 4;
  const MAX_B = 3;
  const TARGET = 2;

  const checkWin = (newA, newB) => {
    if ((newA === TARGET || newB === TARGET) && !solved) {
      setSolved(true);
      if (user?.email) {
        addXP(user.email, 150).then(u => { if (u) updateUser(u); });
      }
    }
  };

  const addMove = (desc, newA, newB) => {
    setJugA(newA);
    setJugB(newB);
    setMoves(m => m + 1);
    setHistory(h => [desc, ...h.slice(0, 7)]);
    checkWin(newA, newB);
  };

  const fillA = () => addMove(`Filled Jug A (4L)`, MAX_A, jugB);
  const fillB = () => addMove(`Filled Jug B (3L)`, jugA, MAX_B);
  const emptyA = () => addMove(`Emptied Jug A`, 0, jugB);
  const emptyB = () => addMove(`Emptied Jug B`, jugA, 0);

  const pourAtoB = () => {
    const spaceInB = MAX_B - jugB;
    const amountToPour = Math.min(jugA, spaceInB);
    addMove(`Poured ${amountToPour}L from A to B`, jugA - amountToPour, jugB + amountToPour);
  };

  const pourBtoA = () => {
    const spaceInA = MAX_A - jugA;
    const amountToPour = Math.min(jugB, spaceInA);
    addMove(`Poured ${amountToPour}L from B to A`, jugA + amountToPour, jugB - amountToPour);
  };

  const resetGame = () => {
    setJugA(0);
    setJugB(0);
    setMoves(0);
    setSolved(false);
    setHistory(['Game reset']);
  };

  // SVG Height percentages
  const heightA = (jugA / MAX_A) * 140;
  const heightB = (jugB / MAX_B) * 140;

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <span>💧</span> The 4L & 3L Water Jug Challenge
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Goal: Measure <span className="text-orange-400 font-bold">exactly 2 Liters</span> using only Fill, Empty, and Pour operations.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
        >
          ← All Games
        </button>
      </div>

      {/* Solved Banner */}
      {solved && (
        <div className="w-full mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-emerald-300 animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <div className="font-bold text-base">Brilliant Logic! You solved it in {moves} moves!</div>
              <div className="text-xs text-emerald-400">Awarded +150 XP for spatial analytical reasoning</div>
            </div>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* SVG Jug Visualizer */}
      <div className="flex flex-wrap justify-center items-end gap-12 my-6">
        {/* Jug A (4L) */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-zinc-300 mb-2">Jug A (Capacity: 4L)</div>
          <svg width="120" height="180" viewBox="0 0 120 180" className="drop-shadow-lg">
            {/* Jug Outline Glass */}
            <rect x="15" y="20" width="90" height="150" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
            {/* Measurement Marks */}
            <line x1="15" y1="57.5" x2="30" y2="57.5" stroke="#71717a" strokeWidth="2" />
            <text x="35" y="61" fill="#71717a" fontSize="10" fontFamily="sans-serif">3L</text>
            
            <line x1="15" y1="95" x2="35" y2="95" stroke="#f97316" strokeWidth="3" />
            <text x="40" y="99" fill="#f97316" fontSize="11" fontWeight="bold" fontFamily="sans-serif">2L (TARGET)</text>
            
            <line x1="15" y1="132.5" x2="30" y2="132.5" stroke="#71717a" strokeWidth="2" />
            <text x="35" y="136" fill="#71717a" fontSize="10" fontFamily="sans-serif">1L</text>

            {/* Water Fill with SVG clip */}
            <rect
              x="19"
              y={166 - heightA}
              width="82"
              height={heightA}
              rx="4"
              fill="#38bdf8"
              fillOpacity="0.75"
              className="water-level"
            />
          </svg>
          <div className="mt-2 text-base font-extrabold text-sky-400">{jugA} / 4 Liters</div>
        </div>

        {/* Jug B (3L) */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-zinc-300 mb-2">Jug B (Capacity: 3L)</div>
          <svg width="110" height="180" viewBox="0 0 110 180" className="drop-shadow-lg">
            {/* Jug Outline Glass */}
            <rect x="15" y="30" width="80" height="140" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
            {/* Measurement Marks */}
            <line x1="15" y1="76" x2="28" y2="76" stroke="#71717a" strokeWidth="2" />
            <text x="32" y="80" fill="#71717a" fontSize="10" fontFamily="sans-serif">2L</text>

            <line x1="15" y1="123" x2="28" y2="123" stroke="#71717a" strokeWidth="2" />
            <text x="32" y="127" fill="#71717a" fontSize="10" fontFamily="sans-serif">1L</text>

            {/* Water Fill with SVG clip */}
            <rect
              x="19"
              y={166 - heightB}
              width="72"
              height={heightB}
              rx="4"
              fill="#38bdf8"
              fillOpacity="0.75"
              className="water-level"
            />
          </svg>
          <div className="mt-2 text-base font-extrabold text-sky-400">{jugB} / 3 Liters</div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg mb-6">
        <button
          onClick={fillA}
          disabled={jugA === MAX_A || solved}
          className="p-2.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-xl text-zinc-200 transition-colors border border-zinc-700"
        >
          Fill Jug A (4L)
        </button>
        <button
          onClick={fillB}
          disabled={jugB === MAX_B || solved}
          className="p-2.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-xl text-zinc-200 transition-colors border border-zinc-700"
        >
          Fill Jug B (3L)
        </button>
        <button
          onClick={pourAtoB}
          disabled={jugA === 0 || jugB === MAX_B || solved}
          className="p-2.5 text-xs font-bold bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 disabled:opacity-30 rounded-xl transition-colors border border-orange-500/30"
        >
          Pour A → B
        </button>
        <button
          onClick={pourBtoA}
          disabled={jugB === 0 || jugA === MAX_A || solved}
          className="p-2.5 text-xs font-bold bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 disabled:opacity-30 rounded-xl transition-colors border border-orange-500/30"
        >
          Pour B → A
        </button>
        <button
          onClick={emptyA}
          disabled={jugA === 0 || solved}
          className="p-2.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-xl text-red-400 transition-colors border border-zinc-700"
        >
          Empty Jug A
        </button>
        <button
          onClick={emptyB}
          disabled={jugB === 0 || solved}
          className="p-2.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-xl text-red-400 transition-colors border border-zinc-700"
        >
          Empty Jug B
        </button>
      </div>

      {/* Move counter & history log */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-400">
        <div>Moves: <span className="font-bold text-zinc-100">{moves}</span></div>
        <div className="italic text-zinc-500 truncate max-w-xs">{history[0]}</div>
        <button onClick={resetGame} className="text-zinc-400 hover:text-white underline">
          Reset Puzzle
        </button>
      </div>
    </div>
  );
}
