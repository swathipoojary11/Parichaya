'use client';
import { useState, useEffect, Suspense } from 'react';
import AppShell from '@/components/AppShell';
import XYZBuilder from '@/components/games/XYZBuilder';
import SentenceUpgrade from '@/components/games/SentenceUpgrade';
import WaterJug from '@/components/games/WaterJug';
import CodeSandbox from '@/components/games/CodeSandbox';
import SoftSkillsAssessment from '@/components/games/SoftSkillsAssessment';
import MindMatrix from '@/components/games/MindMatrix';
import HanoiTower from '@/components/games/HanoiTower';
import CircuitGraph from '@/components/games/CircuitGraph';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

const GAMES = [
  {
    id: 'softskills',
    title: 'Soft Skills Battle Arena',
    category: 'Communication',
    icon: '🗣️',
    desc: '15-question evaluation suite covering workplace decisions, email tone, and executive phrasing.',
    xp: '+200 XP / Round',
    badge: '15 Battle Levels',
    color: '#2EC4B6',
    bg: '#E6F9F6' // Vibrant Light Teal
  },
  {
    id: 'mindmatrix',
    title: 'Mind Matrix & Visual Logic',
    category: 'Cognitive & Mind',
    icon: '🧠',
    desc: 'Train analytical thinking, pattern deduction, and numerical logic with visual SVG diagrams.',
    xp: '+150 XP / Game',
    badge: 'Visual Diagrams',
    color: '#8B5CF6',
    bg: '#F3E8FF' // Vibrant Light Purple
  },
  {
    id: 'hanoi',
    title: 'Tower of Hanoi SVG Puzzle',
    category: 'Spatial SVG Puzzle',
    icon: '🗼',
    desc: 'Interactive spatial logic puzzle: Transfer disks across pegs adhering to strict size ordering constraints.',
    xp: '+150 XP On Solve',
    badge: 'SVG Spatial',
    color: '#FF7A18',
    bg: '#FFF3EB' // Vibrant Light Orange
  },
  {
    id: 'circuit',
    title: 'Logic Gate & Circuit SVG',
    category: 'Spatial SVG Puzzle',
    icon: '⚡',
    desc: 'Interactive SVG circuit: Toggle binary switches to route signals through AND, OR, and XOR gates.',
    xp: '+150 XP On Solve',
    badge: 'SVG Circuit',
    color: '#10B981',
    bg: '#ECFDF5' // Vibrant Light Emerald
  },
  {
    id: 'waterjug',
    title: '4L & 3L Water Jug SVG',
    category: 'Spatial SVG Puzzle',
    icon: '💧',
    desc: 'Classic interactive SVG puzzle: Measure exactly 2 Liters with fill, empty, and pour constraints.',
    xp: '+150 XP On Solve',
    badge: 'SVG Jugs',
    color: '#0284C7',
    bg: '#E0F2FE' // Vibrant Light Cyan
  },
  {
    id: 'xyz',
    title: 'Google X-Y-Z Impact Builder',
    category: 'Resume & Communication',
    icon: '🧩',
    desc: 'Rearrange accomplishment chips to construct executive Google X-Y-Z bullet points.',
    xp: '+60 XP / Challenge',
    badge: '7 Tech Domains',
    color: '#D97706',
    bg: '#FEF3C7' // Vibrant Light Yellow/Amber
  },
  {
    id: 'dsa',
    title: 'DSA Code Studio',
    category: 'Algorithms & Code',
    icon: '💻',
    desc: 'In-browser JavaScript sandbox with 30 challenges tested against automated suites.',
    xp: '+100 XP / Problem',
    badge: '30 Problems',
    color: '#DB2777',
    bg: '#FCE7F3' // Vibrant Light Pink
  },
  {
    id: 'upgrade',
    title: 'Sentence Upgrade',
    category: 'Communication',
    icon: '⚡',
    desc: 'Identify and convert weak junior task descriptions into high-leverage senior phrasing.',
    xp: '+50 XP / Question',
    badge: 'MCQ',
    color: '#059669',
    bg: '#D1FAE5' // Vibrant Light Green
  }
];

function ArenaContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeGame, setActiveGame] = useState(null);
  const [returnTo, setReturnTo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    const game = searchParams.get('game');
    const returnUrl = searchParams.get('returnTo');
    if (game) {
      setActiveGame(game);
    }
    if (returnUrl) {
      setReturnTo(returnUrl);
    }
  }, [searchParams]);

  const handleBack = () => {
    if (returnTo) {
      router.push(returnTo);
    } else {
      setActiveGame(null);
    }
  };

  const filteredGames = activeCategory === 'ALL'
    ? GAMES
    : GAMES.filter(g => g.category.toUpperCase().includes(activeCategory.toUpperCase()));

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col font-['Inter'] animate-fade-in">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-4 text-gray-700 font-bold">
          <button onClick={() => router.push('/dashboard')} className="hover:text-black transition-colors">
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#FF7A18]">Gamified Skill Arena</span>
        </div>

        {/* Active Game Views */}
        {activeGame === 'softskills' && <SoftSkillsAssessment onBack={handleBack} />}
        {activeGame === 'mindmatrix' && <MindMatrix onBack={handleBack} />}
        {activeGame === 'hanoi' && <HanoiTower onBack={handleBack} />}
        {activeGame === 'circuit' && <CircuitGraph onBack={handleBack} />}
        {activeGame === 'waterjug' && <WaterJug onBack={handleBack} />}
        {activeGame === 'xyz' && <XYZBuilder onBack={() => setActiveGame(null)} />}
        {activeGame === 'dsa' && <CodeSandbox onBack={() => setActiveGame(null)} />}
        {activeGame === 'upgrade' && <SentenceUpgrade onBack={() => setActiveGame(null)} />}

        {/* Arcade Selection Hub */}
        {!activeGame && (
          <div className="space-y-8">
            
            {/* Top Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-[4px] border-black pb-6">
              <div>
                <div className="badge badge-yellow mb-2 font-black rotate-[-1deg]">
                  ARCADE GAME SUITE
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tight text-black flex items-center gap-3">
                  <span>🎮</span> Skill Arena & Visual Puzzles
                </h1>
                <p className="text-sm md:text-base font-semibold text-gray-700 mt-1 max-w-2xl">
                  Interactive SVG spatial puzzles, cognitive matrix challenges, and communication battle arenas.
                </p>
              </div>

              <div className="p-4 rounded-2xl border-[3px] border-black bg-white shadow-[6px_6px_0px_#111] flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#FF7A18] text-white font-black text-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#111]">
                  {user?.level || 1}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Arcade Rank</div>
                  <div className="text-base font-black text-black">{user?.xp || 0} Total XP</div>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['ALL', 'SPATIAL SVG PUZZLE', 'COGNITIVE & MIND', 'COMMUNICATION', 'ALGORITHMS & CODE'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
                    activeCategory === cat
                      ? 'bg-[#FF7A18] text-white border-black shadow-[3px_3px_0px_#111]'
                      : 'bg-white text-gray-800 border-black hover:bg-orange-50 shadow-[2px_2px_0px_#111]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Colorful Game Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className="group cursor-pointer p-6 rounded-2xl border-[4px] border-black shadow-[6px_6px_0px_#111] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#111] transition-all flex flex-col justify-between"
                  style={{ backgroundColor: game.bg }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#111]" style={{ backgroundColor: game.color }}>
                        {game.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-black bg-white text-black shadow-[2px_2px_0px_#111]">
                        {game.badge}
                      </span>
                    </div>

                    <div className="text-[10px] font-black uppercase tracking-widest text-[#FF7A18] mb-1">
                      {game.category}
                    </div>
                    <h3 className="text-xl font-black font-['Outfit'] uppercase mb-2 text-black">
                      {game.title}
                    </h3>
                    <p className="text-xs font-bold text-gray-800 leading-relaxed mb-6">
                      {game.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-black/40">
                    <span className="text-xs font-black text-black bg-white px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_#111]">{game.xp}</span>
                    <span className="text-xs font-black uppercase text-black bg-[#FF7A18] text-white px-3 py-1.5 rounded-xl border border-black shadow-[2px_2px_0px_#111] group-hover:translate-x-1 transition-transform">
                      PLAY GAME →
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}

export default function ArenaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading Skill Arena...</div>}>
      <ArenaContent />
    </Suspense>
  );
}
