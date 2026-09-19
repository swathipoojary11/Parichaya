'use client';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { addXP } from '@/lib/db';
import { useRouter } from 'next/navigation';

const TARGET_ROLES = [
  'Full-Stack Software Engineer',
  'AI / Machine Learning Engineer',
  'Frontend UI/UX Engineer',
  'Backend Systems Architect',
  'Cloud & DevOps Engineer',
  'Cybersecurity Specialist',
  'Data Engineer & Big Data',
  'Mobile App Developer (iOS/Android)',
  'QA & Automation Engineer',
  'Embedded Systems Engineer',
  'Product Manager (Tech)',
  'Product Designer (UI/UX)',
  'Solutions Architect',
  'Technical Program Manager',
  'Site Reliability Engineer (SRE)'
];

const ROADMAP_DATA = {
  'Full-Stack Software Engineer': [
    {
      level: 1,
      title: 'Level 1: Core Fundamentals & Modern JavaScript',
      desc: 'Event loop, asynchronous patterns, modern DOM, semantic HTML & CSS architecture.',
      xpReward: 150,
      badge: '📜 JS Architect',
      tasks: [
        { id: 'fs-1-1', title: 'Master Event Loop, Microtasks & Macrotasks execution order', done: true },
        { id: 'fs-1-2', title: 'Practice ES6+ closures, prototypes, and memory lifecycle', done: true },
        { id: 'fs-1-3', title: 'Construct responsive layouts using Tailwind CSS grid and flex tokens', done: false }
      ],
      resources: [
        { title: 'JavaScript.info (Deep-dive Modern JS)', url: 'https://javascript.info' },
        { title: 'Frontend Developer Roadmap', url: 'https://roadmap.sh/frontend' }
      ]
    },
    {
      level: 2,
      title: 'Level 2: Full-Stack Frameworks & Database Modeling',
      desc: 'Next.js App Router, Server Components vs Client Components, SQL indexing & caching.',
      xpReward: 200,
      badge: '🚀 Stack Master',
      tasks: [
        { id: 'fs-2-1', title: 'Build Next.js App Router application with SSR and dynamic routing', done: false },
        { id: 'fs-2-2', title: 'Optimize relational queries in PostgreSQL and inspect EXPLAIN ANALYZE', done: false },
        { id: 'fs-2-3', title: 'Configure client-side persistence using IndexedDB / idb library', done: false }
      ],
      resources: [
        { title: 'Next.js Official Documentation', url: 'https://nextjs.org/docs' },
        { title: 'PostgreSQL Indexing Mastery', url: 'https://www.postgresqltutorial.com' }
      ]
    },
    {
      level: 3,
      title: 'Level 3: System Design & Production Reliability',
      desc: 'Microservices, REST vs GraphQL, Redis caching, Docker containerization, CI/CD pipelines.',
      xpReward: 300,
      badge: '⚡ Distributed Systems',
      tasks: [
        { id: 'fs-3-1', title: 'Containerize full-stack application with multi-stage Dockerfile', done: false },
        { id: 'fs-3-2', title: 'Implement rate limiting and Redis caching layer to protect APIs', done: false },
        { id: 'fs-3-3', title: 'Solve 10 LeetCode Medium Sliding Window and Two Pointer problems', done: false }
      ],
      resources: [
        { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
        { title: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started' }
      ]
    },
    {
      level: 4,
      title: 'Level 4: Executive Interview Mastery & Portfolio Polish',
      desc: 'STAR behavioral mastery, Google X-Y-Z resume optimization, live coding drills.',
      xpReward: 400,
      badge: '👑 Production Ready',
      tasks: [
        { id: 'fs-4-1', title: 'Complete 3 mock interviews in Parichaya AURA with sub-2 filler words', done: false },
        { id: 'fs-4-2', title: 'Refactor resume bullet points to strict Google X-Y-Z formula', done: false },
        { id: 'fs-4-3', title: 'Achieve >85% ATS score against your dream job description', done: false }
      ],
      resources: [
        { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org' },
        { title: 'Grind 75 Questions', url: 'https://www.techinterviewhandbook.org/grind75' }
      ]
    }
  ],
  'AI / Machine Learning Engineer': [
    {
      level: 1,
      title: 'Level 1: Python Data Foundations & Mathematics',
      desc: 'NumPy vectorized math, Pandas dataframes, Linear Algebra, and Calculus fundamentals.',
      xpReward: 150,
      badge: '🐍 Python Math',
      tasks: [
        { id: 'ai-1-1', title: 'Implement matrix multiplication from scratch without external libraries', done: true },
        { id: 'ai-1-2', title: 'Perform exploratory data analysis (EDA) on a 50k row dataset', done: false }
      ],
      resources: [
        { title: 'Deep Learning Specialization (Andrew Ng)', url: 'https://www.deeplearning.ai' }
      ]
    },
    {
      level: 2,
      title: 'Level 2: Supervised & Unsupervised Machine Learning',
      desc: 'Scikit-Learn models, Ensemble Methods (RandomForest, XGBoost), Gradient Descent.',
      xpReward: 250,
      badge: '🤖 Model Builder',
      tasks: [
        { id: 'ai-2-1', title: 'Build and tune XGBoost classifier achieving >90% ROC-AUC', done: false },
        { id: 'ai-2-2', title: 'Implement K-Means clustering and evaluate silhouette score', done: false }
      ],
      resources: [
        { title: 'Scikit-Learn Documentation', url: 'https://scikit-learn.org' }
      ]
    },
    {
      level: 3,
      title: 'Level 3: Deep Learning, PyTorch & Transformers',
      desc: 'CNNs, RNNs, Transformer Attention mechanism, Fine-tuning HuggingFace models.',
      xpReward: 350,
      badge: '🧠 Neural Architect',
      tasks: [
        { id: 'ai-3-1', title: 'Fine-tune a Llama / Qwen LLM using LoRA on custom JSON dataset', done: false },
        { id: 'ai-3-2', title: 'Deploy Ollama local server API with low-latency streaming endpoints', done: false }
      ],
      resources: [
        { title: 'HuggingFace Course', url: 'https://huggingface.co/course' }
      ]
    }
  ]
};

export default function RoadmapPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState('Full-Stack Software Engineer');
  const [activeLevel, setActiveLevel] = useState(1);

  const currentRoleData = ROADMAP_DATA[selectedRole] || ROADMAP_DATA['Full-Stack Software Engineer'];

  const [quests, setQuests] = useState(currentRoleData);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const data = ROADMAP_DATA[role] || ROADMAP_DATA['Full-Stack Software Engineer'];
    setQuests(data);
    setActiveLevel(1);
  };

  const toggleTask = async (levelIdx, taskId) => {
    const updated = [...quests];
    const target = updated[levelIdx].tasks.find(t => t.id === taskId);
    if (!target) return;

    target.done = !target.done;
    setQuests(updated);

    if (target.done && user?.email) {
      const u = await addXP(user.email, 40);
      if (u) updateUser(u);
    }
  };

  const totalTasks = quests.reduce((acc, q) => acc + q.tasks.length, 0);
  const completedTasks = quests.reduce((acc, q) => acc + q.tasks.filter(t => t.done).length, 0);
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#FFF8F0] to-[#FFF4E6] text-slate-900 font-['Inter'] p-4 lg:p-8 animate-fade-in">
        
        {/* Top Header */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#2EC4B6] text-xs font-bold mb-3">
              <span>🗺️ GAMIFIED RPG SKILL TREE</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight text-slate-900 leading-tight">
              Career Quest Roadmap
            </h1>
            <p className="text-sm md:text-base font-semibold text-slate-600 mt-1 max-w-xl">
              Select your target job role to generate your dynamic skill progression quest line.
            </p>
          </div>

          {/* Progress Card */}
          <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 shrink-0 w-full md:w-80">
            <div className="flex justify-between text-xs font-extrabold uppercase mb-2">
              <span className="text-slate-600">Quest Progress</span>
              <span className="text-[#F95721]">{percentComplete}% Mastery</span>
            </div>
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200 p-0.5 mb-2">
              <div 
                className="bg-gradient-to-r from-[#F95721] to-[#FF7A00] h-full rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <div className="text-xs font-bold text-slate-500 text-right">
              {completedTasks} of {totalTasks} Quests Completed
            </div>
          </div>
        </div>

        {/* Target Job Role Picker Bar (15 Roles) */}
        <div className="max-w-7xl mx-auto mb-8">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block mb-3">
            Target Job Role Quest Line (Select from 15 Target Roles):
          </label>
          <div className="flex flex-wrap gap-2.5">
            {TARGET_ROLES.map((role) => (
              <button
                type="button"
                suppressHydrationWarning
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border ${
                  selectedRole === role
                    ? 'bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white border-transparent shadow-md shadow-orange-500/25 scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* RPG Quest Skill Tree Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Level Progression Tree Nodes */}
          <div className="lg:col-span-4 relative flex flex-col gap-6">
            <div className="absolute left-[30px] top-8 bottom-8 w-1 bg-slate-200 rounded-full" />
            
            {quests.map((q) => {
              const isLevelDone = q.tasks.every(t => t.done);
              const isActive = activeLevel === q.level;

              return (
                <button
                  type="button"
                  suppressHydrationWarning
                  key={q.level}
                  onClick={() => setActiveLevel(q.level)}
                  className="relative flex items-start gap-4 text-left group transition-all"
                >
                  <div 
                    className={`relative z-10 w-16 h-16 rounded-2xl border flex items-center justify-center text-xl font-black shadow-md transition-all ${
                      isLevelDone
                        ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-500/20'
                        : isActive
                        ? 'bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white border-transparent scale-110 shadow-lg shadow-orange-500/30'
                        : 'bg-white text-slate-700 border-slate-200 group-hover:border-orange-300'
                    }`}
                  >
                    {isLevelDone ? '✓' : `L${q.level}`}
                  </div>

                  <div className="pt-2 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F95721]">
                      {q.badge}
                    </span>
                    <h3 className={`text-base font-extrabold font-['Outfit'] ${isActive ? 'text-[#F95721]' : 'text-slate-900'}`}>
                      Level {q.level} Stage
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {q.tasks.filter(t => t.done).length} / {q.tasks.length} Objectives Cleared
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level Stage Objectives & Quests */}
          <div className="lg:col-span-8">
            {quests.filter(q => q.level === activeLevel).map((stage, lIdx) => (
              <div key={stage.level} className="space-y-6 animate-fade-in">
                
                {/* Stage Banner Card */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-[#F95721] border border-orange-200 text-xs font-bold uppercase tracking-widest">
                      {stage.badge}
                    </span>
                    <span className="text-xs font-extrabold text-teal-600 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
                      +{stage.xpReward} XP Stage Reward
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] text-slate-900 mb-2">
                    {stage.title}
                  </h2>
                  <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                {/* Quests Objectives Card */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4 text-slate-900 flex items-center gap-2 font-['Outfit']">
                    <span>🎯</span> Active Quests & Action Objectives
                  </h3>
                  <div className="space-y-3">
                    {stage.tasks.map(task => (
                      <button
                        type="button"
                        suppressHydrationWarning
                        key={task.id}
                        onClick={() => toggleTask(lIdx, task.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left font-bold text-xs transition-all ${
                          task.done 
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-400 line-through' 
                            : 'bg-slate-50 border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 text-slate-900 shadow-sm'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${task.done ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-slate-300'}`}>
                          {task.done && '✓'}
                        </div>
                        <span className="flex-1">{task.title}</span>
                        {!task.done && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F95721] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                            +40 XP
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Vault Card */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4 text-slate-900 flex items-center gap-2 font-['Outfit']">
                    <span>📚</span> Quest Learning Vault Resources
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stage.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 rounded-2xl border border-orange-200/80 bg-orange-50/40 hover:bg-orange-100/50 hover:border-[#F95721] transition-colors font-bold text-xs text-slate-900 flex justify-between items-center"
                      >
                        <span className="truncate pr-2">{res.title}</span>
                        <span className="text-[#F95721]">↗</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Practice Hub Link */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => router.push('/arena')}
                    className="h-12 px-6 rounded-full bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center gap-2"
                  >
                    <span>Practice Skills in Arena</span>
                    <span>→</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </AppShell>
  );
}
