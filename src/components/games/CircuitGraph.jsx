'use client';
import { useState } from 'react';
import { addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

export default function CircuitGraph({ onBack }) {
  const { user, updateUser } = useAuth();
  const [switchA, setSwitchA] = useState(false);
  const [switchB, setSwitchB] = useState(true);
  const [switchC, setSwitchC] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  // Logic Gate Evaluation
  const gateAndOutput = switchA && switchB; // AND Gate
  const gateOrOutput = switchB || switchC;  // OR Gate
  const finalCoreOutput = (gateAndOutput ? 1 : 0) ^ (gateOrOutput ? 1 : 0); // XOR Gate (High when outputs differ)

  const handleToggle = (sw) => {
    let nextA = switchA;
    let nextB = switchB;
    let nextC = switchC;

    if (sw === 'A') nextA = !switchA;
    if (sw === 'B') nextB = !switchB;
    if (sw === 'C') nextC = !switchC;

    setSwitchA(nextA);
    setSwitchB(nextB);
    setSwitchC(nextC);

    const andOut = nextA && nextB;
    const orOut = nextB || nextC;
    const coreOut = (andOut ? 1 : 0) ^ (orOut ? 1 : 0);

    if (coreOut === 1 && !isSolved) {
      setIsSolved(true);
      if (user?.email) {
        addXP(user.email, 150).then(u => { if (u) updateUser(u); });
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 bg-zinc-900 border-[3px] border-black rounded-3xl shadow-[8px_8px_0px_#111] animate-fade-in font-['Inter']">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-2xl font-black font-['Outfit'] uppercase text-zinc-100">
              Logic Gate & Circuit SVG Puzzle
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Toggle binary switches A, B, C to route logic signals through AND, OR, and XOR gates to power the Core Server.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors border border-zinc-700"
        >
          ← All Games
        </button>
      </div>

      {/* Interactive Circuit SVG Canvas */}
      <div className="w-full bg-zinc-950 p-6 rounded-2xl border-2 border-zinc-800 shadow-inner flex flex-col items-center">
        
        <svg viewBox="0 0 600 260" className="w-full max-w-[550px] h-auto select-none">
          
          {/* Wire Connections */}
          {/* A to AND */}
          <path d="M 80 50 L 220 50 L 220 80" stroke={switchA ? '#2EC4B6' : '#3F3F46'} strokeWidth="4" fill="none" className="transition-colors" />
          {/* B to AND & OR */}
          <path d="M 80 130 L 160 130 L 160 100 L 220 100" stroke={switchB ? '#2EC4B6' : '#3F3F46'} strokeWidth="4" fill="none" className="transition-colors" />
          <path d="M 160 130 L 160 160 L 220 160" stroke={switchB ? '#2EC4B6' : '#3F3F46'} strokeWidth="4" fill="none" className="transition-colors" />
          {/* C to OR */}
          <path d="M 80 210 L 220 210 L 220 180" stroke={switchC ? '#2EC4B6' : '#3F3F46'} strokeWidth="4" fill="none" className="transition-colors" />

          {/* AND Output to XOR */}
          <path d="M 280 90 L 380 90 L 380 115" stroke={gateAndOutput ? '#FF7A18' : '#3F3F46'} strokeWidth="4" fill="none" className="transition-colors" />
          {/* OR Output to XOR */}
          <path d="M 280 170 L 380 170 L 380 145" stroke={gateOrOutput ? '#FF7A18' : '#3F3F46'} strokeWidth="4" fill="none" className="transition-colors" />

          {/* XOR Output to CORE */}
          <path d="M 440 130 L 500 130" stroke={finalCoreOutput === 1 ? '#34D399' : '#3F3F46'} strokeWidth="6" strokeDasharray={finalCoreOutput === 1 ? "6 2" : "none"} fill="none" className="transition-colors animate-pulse" />

          {/* Gate Nodes */}
          {/* AND GATE */}
          <g transform="translate(220, 70)">
            <rect x="0" y="0" width="60" height="40" rx="8" fill="#18181B" stroke={gateAndOutput ? '#FF7A18' : '#3F3F46'} strokeWidth="2" />
            <text x="30" y="24" textAnchor="middle" fill="#E4E4E7" fontSize="12" fontWeight="black">AND</text>
          </g>

          {/* OR GATE */}
          <g transform="translate(220, 150)">
            <rect x="0" y="0" width="60" height="40" rx="8" fill="#18181B" stroke={gateOrOutput ? '#FF7A18' : '#3F3F46'} strokeWidth="2" />
            <text x="30" y="24" textAnchor="middle" fill="#E4E4E7" fontSize="12" fontWeight="black">OR</text>
          </g>

          {/* XOR GATE */}
          <g transform="translate(380, 110)">
            <rect x="0" y="0" width="60" height="40" rx="8" fill="#18181B" stroke={finalCoreOutput === 1 ? '#34D399' : '#3F3F46'} strokeWidth="2" />
            <text x="30" y="24" textAnchor="middle" fill="#E4E4E7" fontSize="12" fontWeight="black">XOR</text>
          </g>

          {/* Core Server Node */}
          <g transform="translate(500, 100)">
            <circle cx="30" cy="30" r="28" fill={finalCoreOutput === 1 ? '#059669' : '#18181B'} stroke={finalCoreOutput === 1 ? '#34D399' : '#52525B'} strokeWidth="4" className="transition-all" />
            <text x="30" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="16">{finalCoreOutput === 1 ? '⚡' : '🔴'}</text>
          </g>

        </svg>

        {/* Interactive Toggle Controls */}
        <div className="flex gap-6 mt-4">
          <button
            onClick={() => handleToggle('A')}
            className={`px-5 py-2.5 rounded-xl border-2 font-black text-xs transition-all ${
              switchA ? 'bg-[#2EC4B6] text-white border-black shadow-[3px_3px_0px_#111]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            Switch A: {switchA ? 'HIGH [1]' : 'LOW [0]'}
          </button>
          
          <button
            onClick={() => handleToggle('B')}
            className={`px-5 py-2.5 rounded-xl border-2 font-black text-xs transition-all ${
              switchB ? 'bg-[#2EC4B6] text-white border-black shadow-[3px_3px_0px_#111]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            Switch B: {switchB ? 'HIGH [1]' : 'LOW [0]'}
          </button>

          <button
            onClick={() => handleToggle('C')}
            className={`px-5 py-2.5 rounded-xl border-2 font-black text-xs transition-all ${
              switchC ? 'bg-[#2EC4B6] text-white border-black shadow-[3px_3px_0px_#111]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            Switch C: {switchC ? 'HIGH [1]' : 'LOW [0]'}
          </button>
        </div>

      </div>

      {/* Success State */}
      {finalCoreOutput === 1 && (
        <div className="w-full mt-6 p-5 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl text-center space-y-1 animate-pulse">
          <h3 className="text-xl font-black font-['Outfit'] uppercase text-emerald-300">
            ⚡ CORE NODE POWERED HIGH!
          </h3>
          <p className="text-xs text-zinc-300 font-bold">XOR Logic Gate Output = 1 • +150 XP Earned!</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end w-full mt-6 pt-4 border-t border-zinc-800">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#FF7A18] hover:bg-orange-600 text-white font-black uppercase text-xs rounded-xl shadow-[4px_4px_0px_#111]"
        >
          Return to Arena
        </button>
      </div>

    </div>
  );
}
