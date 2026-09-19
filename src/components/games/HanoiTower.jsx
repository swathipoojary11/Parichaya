'use client';
import { useState } from 'react';
import { addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

export default function HanoiTower({ onBack }) {
  const { user, updateUser } = useAuth();
  const [pegs, setPegs] = useState({
    A: [3, 2, 1], // Disk 3 (largest) at bottom, Disk 1 (smallest) at top
    B: [],
    C: []
  });
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const diskColors = {
    1: '#FF7A18', // Smallest - Orange
    2: '#2EC4B6', // Medium - Teal
    3: '#A78BFA'  // Largest - Purple
  };

  const diskWidths = {
    1: 60,
    2: 100,
    3: 140
  };

  const handlePegClick = async (pegId) => {
    if (isSolved) return;

    if (!selectedPeg) {
      // Pick up top disk from peg if available
      if (pegs[pegId].length > 0) {
        setSelectedPeg(pegId);
      }
    } else {
      if (selectedPeg === pegId) {
        // Deselect
        setSelectedPeg(null);
        return;
      }

      const sourceDisks = [...pegs[selectedPeg]];
      const targetDisks = [...pegs[pegId]];
      const diskToMove = sourceDisks[sourceDisks.length - 1];
      const topTargetDisk = targetDisks[targetDisks.length - 1];

      // Validate Tower of Hanoi rule: Cannot place larger disk on smaller disk
      if (!topTargetDisk || diskToMove < topTargetDisk) {
        sourceDisks.pop();
        targetDisks.push(diskToMove);

        const newPegs = {
          ...pegs,
          [selectedPeg]: sourceDisks,
          [pegId]: targetDisks
        };

        setPegs(newPegs);
        setMoves(m => m + 1);
        setSelectedPeg(null);

        // Check Win Condition: All 3 disks transferred to Peg C
        if (newPegs.C.length === 3) {
          setIsSolved(true);
          if (user?.email) {
            const u = await addXP(user.email, 150);
            if (u) updateUser(u);
          }
        }
      } else {
        alert('Invalid Move! A larger disk cannot be placed on top of a smaller disk.');
        setSelectedPeg(null);
      }
    }
  };

  const handleReset = () => {
    setPegs({ A: [3, 2, 1], B: [], C: [] });
    setSelectedPeg(null);
    setMoves(0);
    setIsSolved(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 bg-zinc-900 border-[3px] border-black rounded-3xl shadow-[8px_8px_0px_#111] animate-fade-in font-['Inter']">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗼</span>
            <h2 className="text-2xl font-black font-['Outfit'] uppercase text-zinc-100">
              Tower of Hanoi SVG Spatial Puzzle
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Transfer all 3 disks from Peg A to Peg C. Rule: Never place a larger disk on a smaller disk!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-[#FF7A18]/20 border border-[#FF7A18]/40 text-[#FF7A18] font-black text-xs rounded-xl">
            Moves: {moves} (Min: 7)
          </span>
          <button
            onClick={onBack}
            className="text-xs px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors border border-zinc-700"
          >
            ← All Games
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="w-full bg-zinc-950 p-6 rounded-2xl border-2 border-zinc-800 shadow-inner flex flex-col items-center">
        
        <svg viewBox="0 0 600 240" className="w-full max-w-[550px] h-auto select-none">
          {/* Base Stand */}
          <rect x="20" y="210" width="560" height="16" rx="8" fill="#27272A" stroke="#3F3F46" strokeWidth="2" />

          {/* Peg A */}
          <g onClick={() => handlePegClick('A')} className="cursor-pointer group">
            <rect x="110" y="50" width="12" height="160" rx="6" fill={selectedPeg === 'A' ? '#FF7A18' : '#52525B'} className="transition-colors" />
            <text x="116" y="238" textAnchor="middle" fill="#A1A1AA" fontSize="12" fontWeight="bold">PEG A</text>
            {pegs.A.map((diskSize, idx) => (
              <rect
                key={diskSize}
                x={116 - diskWidths[diskSize] / 2}
                y={192 - idx * 24}
                width={diskWidths[diskSize]}
                height="20"
                rx="6"
                fill={diskColors[diskSize]}
                stroke="#000000"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            ))}
          </g>

          {/* Peg B */}
          <g onClick={() => handlePegClick('B')} className="cursor-pointer group">
            <rect x="294" y="50" width="12" height="160" rx="6" fill={selectedPeg === 'B' ? '#FF7A18' : '#52525B'} className="transition-colors" />
            <text x="300" y="238" textAnchor="middle" fill="#A1A1AA" fontSize="12" fontWeight="bold">PEG B</text>
            {pegs.B.map((diskSize, idx) => (
              <rect
                key={diskSize}
                x={300 - diskWidths[diskSize] / 2}
                y={192 - idx * 24}
                width={diskWidths[diskSize]}
                height="20"
                rx="6"
                fill={diskColors[diskSize]}
                stroke="#000000"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            ))}
          </g>

          {/* Peg C */}
          <g onClick={() => handlePegClick('C')} className="cursor-pointer group">
            <rect x="478" y="50" width="12" height="160" rx="6" fill={selectedPeg === 'C' ? '#FF7A18' : '#52525B'} className="transition-colors" />
            <text x="484" y="238" textAnchor="middle" fill="#A1A1AA" fontSize="12" fontWeight="bold">PEG C (TARGET)</text>
            {pegs.C.map((diskSize, idx) => (
              <rect
                key={diskSize}
                x={484 - diskWidths[diskSize] / 2}
                y={192 - idx * 24}
                width={diskWidths[diskSize]}
                height="20"
                rx="6"
                fill={diskColors[diskSize]}
                stroke="#000000"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            ))}
          </g>
        </svg>

        {/* Selected Peg Indicator */}
        <div className="mt-4 text-center">
          {selectedPeg ? (
            <span className="text-xs font-black uppercase text-[#FF7A18] animate-pulse">
              Selected: Peg {selectedPeg} • Click target peg to place disk
            </span>
          ) : (
            <span className="text-xs font-bold text-zinc-500">
              Click a peg to select its top disk
            </span>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {isSolved && (
        <div className="w-full mt-6 p-6 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl text-center space-y-2 animate-bounce">
          <span className="text-4xl">🎉</span>
          <h3 className="text-2xl font-black font-['Outfit'] uppercase text-emerald-300">
            Tower Solved in {moves} Moves!
          </h3>
          <p className="text-xs text-zinc-300 font-bold">+150 XP Awarded to your Career Catalyst Profile!</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center w-full mt-6 pt-4 border-t border-zinc-800">
        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-700"
        >
          Reset Puzzle
        </button>
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
