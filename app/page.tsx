'use client';

import React, { useState } from 'react';
import { UserProfile, AtsMetrics, Quest, RankTier, SkillGap } from '@/types';
import CounselorChat from '@/components/counselor/CounselorChat';
import AtsAuditView from '@/components/audit/AtsAuditView';
import MockInterviewPlaceholder from '@/components/interview/MockInterviewPlaceholder';
import QuestChecklist from '@/components/gamification/QuestChecklist';
import { Button } from '@/components/ui/Button';
import {
  Bot,
  FileCheck2,
  Mic,
  Zap,
  ShieldCheck,
  Trophy,
  Flame,
  ChevronRight,
  ListTodo
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'counselor' | 'audit' | 'interview'>('counselor');
  const [showQuestsModal, setShowQuestsModal] = useState<boolean>(false);

  // Global Gamification & User State
  const [totalXp, setTotalXp] = useState<number>(450);
  const [completedStepIds, setCompletedStepIds] = useState<number[]>([1, 2]);

  // Initial Profile Data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    targetRole: 'Full Stack Engineer (Campus Placement)',
    targetIndustry: 'FinTech & Cloud Systems',
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'National Institute of Technology',
    gpa: '8.8 / 10.0 CGPA',
    graduationYear: '2026',
    projects: [
      {
        id: 'proj-1',
        title: 'Distributed Task Scheduler & Queue',
        descriptionXYZ:
          'Accomplished 45% reduction in background async job latency, as measured by processing 100,000+ requests/min at sub-10ms response, by architecting Redis pub/sub queue with Node.js worker pools.',
        techStack: ['TypeScript', 'Node.js', 'Redis', 'Docker', 'PostgreSQL'],
      },
      {
        id: 'proj-2',
        title: 'On-Device ATS Parser & Resume Synthesizer',
        descriptionXYZ:
          'Accomplished 100% zero-cloud data privacy compliance, as measured by local parsing speed of under 50ms, by building client-side WebAssembly parser rules.',
        techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
      },
    ],
    experiences: [
      {
        id: 'exp-1',
        role: 'Backend Engineering Intern',
        company: 'Apex Cloud Labs',
        duration: 'Summer 2025',
        highlights: [
          'Built gRPC microservices with 99.99% uptime for payment transaction routing.',
          'Optimized PostgreSQL index queries resulting in 35% speedup on complex joins.',
        ],
      },
    ],
    techSkills: [
      'TypeScript',
      'React',
      'Next.js App Router',
      'Node.js',
      'PostgreSQL',
      'Git & Docker Basics',
      'RESTful APIs',
    ],
    softSkills: ['Problem Solving', 'Agile Team Collaboration', 'Technical Presentation'],
  });

  // Sample Placement Skill Gaps & Quests
  const initialQuests: Quest[] = [
    {
      id: 'q-redis',
      title: 'Master Redis Distributed Caching',
      category: 'Skill Gap',
      targetSkill: 'Distributed Systems & Caching (Redis)',
      xpReward: 100,
      isCompleted: false,
      description: 'Implement distributed caching layer with TTL eviction policies for API response acceleration.',
      actionText: 'Claim Caching Quest XP (Local Engine)',
    },
    {
      id: 'q-dp',
      title: 'LeetCode Pattern: Dynamic Programming Memoization',
      category: 'LeetCode Pattern',
      patternName: '1D/2D DP Memoization',
      xpReward: 150,
      isCompleted: false,
      description: 'Solve 3 classic DP problems (Coin Change, Longest Common Subsequence) using bottom-up memoization table.',
      actionText: 'Claim DP Pattern XP (Local Engine)',
    },
    {
      id: 'q-two-pointers',
      title: 'LeetCode Pattern: Two Pointers on Arrays',
      category: 'LeetCode Pattern',
      patternName: 'Two Pointers (Left/Right convergence)',
      xpReward: 75,
      isCompleted: true,
      description: 'Master fast-slow pointer and inward convergence patterns for sorted array target searching.',
      actionText: 'Completed (+75 XP)',
    },
    {
      id: 'q-xyz',
      title: 'Refine Google X-Y-Z Resume Bullet Points',
      category: 'Resume Enhancement',
      xpReward: 100,
      isCompleted: false,
      description: 'Ensure every project bullet includes quantified outcome [X], metric [Y], and technical method [Z].',
      actionText: 'Claim Resume XP (Local Engine)',
    },
    {
      id: 'q-system-design',
      title: 'System Design: Load Balancing & Rate Limiting',
      category: 'Skill Gap',
      targetSkill: 'System Design & Load Balancing',
      xpReward: 120,
      isCompleted: false,
      description: 'Study Token Bucket and Sliding Window Log algorithms for API rate limit enforcement.',
      actionText: 'Claim System Design XP (Local Engine)',
    },
  ];

  const [quests, setQuests] = useState<Quest[]>(initialQuests);

  // ATS Metrics State
  const initialAtsMetrics: AtsMetrics = {
    score: 78,
    rankTier: 'Apprentice',
    matchedCount: 5,
    missingCount: 3,
    xyzFormulaAlignmentScore: 90,
    keywordDensityScore: 75,
    formattingScore: 95,
    skillGaps: [
      {
        id: 'sg-1',
        name: 'TypeScript & React',
        category: 'Matched',
        importance: 'High',
        recommendation: 'Core requirement verified in project descriptions.',
      },
      {
        id: 'sg-2',
        name: 'Next.js App Router',
        category: 'Matched',
        importance: 'High',
        recommendation: 'Full stack web architecture pattern matched.',
      },
      {
        id: 'sg-3',
        name: 'REST API & Node.js',
        category: 'Matched',
        importance: 'High',
        recommendation: 'Backend service layer verified.',
      },
      {
        id: 'sg-4',
        name: 'PostgreSQL & SQL',
        category: 'Matched',
        importance: 'Medium',
        recommendation: 'Database storage layer verified.',
      },
      {
        id: 'sg-5',
        name: 'Git & Docker Basics',
        category: 'Matched',
        importance: 'Medium',
        recommendation: 'Containerization & VCS verified.',
      },
      {
        id: 'sg-6',
        name: 'Distributed Systems & Caching (Redis)',
        category: 'Missing',
        importance: 'Critical',
        recommendation: 'High-frequency campus recruiter requirement for backend role.',
        leetCodePattern: 'LRU Cache Design / Hash Map + Double LinkedList',
      },
      {
        id: 'sg-7',
        name: 'Dynamic Programming Memoization',
        category: 'Missing',
        importance: 'High',
        recommendation: 'Frequent technical interview algorithmic pattern.',
        leetCodePattern: '1D/2D DP Table Memoization',
      },
      {
        id: 'sg-8',
        name: 'System Design & Load Balancing',
        category: 'Missing',
        importance: 'Critical',
        recommendation: 'Essential for high-scale backend campus placements.',
        leetCodePattern: 'Token Bucket / Leaky Bucket',
      },
    ],
    xyzChecklist: [
      {
        rule: 'Accomplished [X] Action Quantification',
        passed: true,
        feedback: 'Includes metric outcomes like "45% reduction in latency" and "100% data privacy".',
      },
      {
        rule: 'Measured by [Y] Empirical Scale',
        passed: true,
        feedback: 'Includes scale volume "100,000+ requests/min at sub-10ms response".',
      },
      {
        rule: 'By Doing [Z] Specific Technical Method',
        passed: true,
        feedback: 'Mentions specific tools: "Redis pub/sub queue with Node.js worker pools".',
      },
    ],
  };

  const [atsMetrics, setAtsMetrics] = useState<AtsMetrics>(initialAtsMetrics);

  // Strict Rank Tier Mapping: Novice (<50% score / <300 XP), Apprentice (50-79% score / 300-700 XP), Job-Ready (80%+ score / 700+ XP)
  const calculateRankTier = (xp: number, score: number): RankTier => {
    if (score >= 80 || xp >= 700) return 'Job-Ready';
    if (score >= 50 || xp >= 300) return 'Apprentice';
    return 'Novice';
  };

  const currentRankTier = calculateRankTier(totalXp, atsMetrics.score);

  // Award XP Handler
  const handleAwardXp = (amount: number, reason: string) => {
    const newXp = totalXp + amount;
    setTotalXp(newXp);
    setAtsMetrics((prev) => ({
      ...prev,
      rankTier: calculateRankTier(newXp, prev.score),
    }));
  };

  // Complete Quest Handler
  const handleCompleteQuest = (questId: string, xpReward: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isCompleted: true } : q))
    );

    const newXp = totalXp + xpReward;
    setTotalXp(newXp);

    setAtsMetrics((prev) => {
      const newScore = Math.min(100, prev.score + 5);
      return {
        ...prev,
        score: newScore,
        rankTier: calculateRankTier(newXp, newScore),
        keywordDensityScore: Math.min(100, prev.keywordDensityScore + 5),
      };
    });
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleCompleteStep = (stepId: number) => {
    if (!completedStepIds.includes(stepId)) {
      setCompletedStepIds((prev) => [...prev, stepId]);
    }
    if (stepId === 4) {
      setActiveTab('audit');
    }
  };

  const handleAddSkillAsQuest = (skill: SkillGap) => {
    const newQuest: Quest = {
      id: `quest-${skill.id}`,
      title: `Remediate Skill Gap: ${skill.name}`,
      category: 'Skill Gap',
      targetSkill: skill.name,
      patternName: skill.leetCodePattern,
      xpReward: 100,
      isCompleted: false,
      description: skill.recommendation,
      actionText: 'Claim Skill Remediation XP (Local Engine)',
    };
    setQuests((prev) => [newQuest, ...prev]);

    setAtsMetrics((prev) => ({
      ...prev,
      skillGaps: prev.skillGaps.map((sg) =>
        sg.id === skill.id ? { ...sg, addedToQuests: true } : sg
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col selection:bg-orange-500 selection:text-zinc-950">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-0.5 shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">
                Parichaya
              </h1>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                On-Device Zero-Cloud Placement & Gamification Engine
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Status Bar */}
        <div className="flex items-center gap-3">
          {/* Edge AI Active Connectivity Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>● Zero-Cloud / Edge Active</span>
          </div>

          {/* XP Counter Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold">
            <Zap className="w-4 h-4 fill-orange-400" />
            <span>{totalXp} XP</span>
          </div>

          {/* Current Rank Badge: Novice, Apprentice, Job-Ready */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs font-mono font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-orange-400">{currentRankTier}</span>
          </div>

          <button
            onClick={() => setShowQuestsModal(!showQuestsModal)}
            className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 text-xs"
          >
            <ListTodo className="w-4 h-4" />
            <span className="hidden sm:inline">Quests Hub</span>
          </button>
        </div>
      </header>

      {/* Main Tab Navigation Bar */}
      <div className="bg-zinc-900/60 border-b border-zinc-800/80 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('counselor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'counselor'
                ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Career Counselor (4-Step Chat)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Deterministic ATS Audit Engine</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-orange-400 border border-zinc-800">
              {atsMetrics.score}% Score
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'interview'
                ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Mock Interview Portal (Audio Stream)</span>
          </button>
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {activeTab === 'counselor' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Interactive AI Resume Counselor
                  <span className="text-xs font-mono font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    Step {completedStepIds.length} of 4 Complete
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Converse with the edge AI model to synthesize a Google X-Y-Z formula powered ATS profile.
                </p>
              </div>

              <Button
                variant="primary"
                className="text-xs"
                icon={<ChevronRight className="w-4 h-4" />}
                onClick={() => setActiveTab('audit')}
              >
                Audit Resume (0-Cloud Data)
              </Button>
            </div>

            <CounselorChat
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onCompleteStep={handleCompleteStep}
              onAwardXp={handleAwardXp}
            />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Deterministic ATS Readiness Audit
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {currentRankTier} Tier
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time keyword matching, Google X-Y-Z formula alignment, and missing skill chip remediation.
                </p>
              </div>

              <Button
                variant="emerald"
                className="text-xs"
                icon={<Mic className="w-4 h-4 text-zinc-950" />}
                onClick={() => setActiveTab('interview')}
              >
                Launch Interactive Interview
              </Button>
            </div>

            <AtsAuditView
              atsMetrics={{ ...atsMetrics, rankTier: currentRankTier }}
              onAddSkillAsQuest={handleAddSkillAsQuest}
              onNavigateToQuests={() => setShowQuestsModal(true)}
            />
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Mock Interview Portal & Audio Stream
                  <span className="text-xs font-mono font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    WebSocket Layer Placeholder (Member 3)
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Low-latency voice session endpoint with simulated cadence WPM visualizer.
                </p>
              </div>

              <Button
                variant="primary"
                className="text-xs"
                icon={<Bot className="w-4 h-4" />}
                onClick={() => setActiveTab('counselor')}
              >
                Return to Counselor Chat
              </Button>
            </div>

            <MockInterviewPlaceholder onAwardXp={handleAwardXp} />
          </div>
        )}

        {/* Embedded Remediation Quests Section */}
        <div className="pt-8 border-t border-zinc-800">
          <QuestChecklist
            quests={quests}
            totalXp={totalXp}
            currentRank={currentRankTier}
            onCompleteQuest={handleCompleteQuest}
          />
        </div>
      </main>

      {/* Quests Modal Drawer Overlay */}
      {showQuestsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Gamified Remediation Quests Hub</h3>
              </div>
              <button
                onClick={() => setShowQuestsModal(false)}
                className="text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800"
              >
                Close (ESC)
              </button>
            </div>

            <QuestChecklist
              quests={quests}
              totalXp={totalXp}
              currentRank={currentRankTier}
              onCompleteQuest={handleCompleteQuest}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 px-4 text-center text-xs text-zinc-500 font-mono space-y-1">
        <div className="flex items-center justify-center gap-2 text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Parichaya — 100% Zero-Cloud On-Device Execution</span>
        </div>
        <p>Built for Placement-Seeking Students • Next.js App Router • React • TypeScript • Tailwind CSS</p>
      </footer>
    </div>
  );
}
