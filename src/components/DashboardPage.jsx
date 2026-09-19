'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { motion } from 'framer-motion';
import {
  getMissions, createMission,
  getDSAProgress, getSoftSkillHistory, getInterviews,
} from '@/lib/db';

const SKILL_SNAPSHOT = [
  { name: 'Technical', value: 72, color: 'var(--orange)' },
  { name: 'Communication', value: 58, color: 'var(--cyan)' },
  { name: 'DSA', value: 45, color: 'var(--indigo)' },
  { name: 'Resume', value: 80, color: 'var(--emerald)' },
  { name: 'Interview', value: 63, color: 'var(--teal)' },
];

const READINESS_CATS = [
  { label: 'Resume', score: 80, color: 'var(--emerald)' },
  { label: 'Interview', score: 63, color: 'var(--orange)' },
  { label: 'Technical', score: 72, color: 'var(--blue)' },
  { label: 'Communication', score: 58, color: 'var(--cyan)' },
  { label: 'Projects', score: 55, color: 'var(--indigo)' },
];

const QUICK_ACTIONS = [
  { label: 'Audit Resume', icon: '📊', href: '/ats', color: 'var(--orange)', bg: 'var(--orange-soft)', border: 'var(--orange-border)' },
  { label: 'Mock Interview', icon: '🎙️', href: '/interview', color: 'var(--cyan)', bg: 'rgba(72,202,228,0.1)', border: 'rgba(72,202,228,0.25)' },
  { label: 'Skill Arena', icon: '🎮', href: '/arena', color: 'var(--purple)', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  { label: 'Roadmap', icon: '🗺️', href: '/roadmap', color: 'var(--emerald)', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

function ReadinessRing({ score }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
        <motion.circle
          cx="80" cy="80" r={r} fill="none"
          stroke="var(--orange)" strokeWidth="12"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          strokeDashoffset={circ * 0.25}
          style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.6))' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{score}%</span>
        <span className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: 'var(--orange)' }}>Readiness</span>
      </div>
    </div>
  );
}

function MiniMissionCard({ mission, onGo }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4, boxShadow: '0 0 25px rgba(249,115,22,0.4)' }}
      className="relative overflow-hidden rounded-2xl p-4 cursor-pointer group"
      style={{ background: 'var(--surface)', border: '1px solid var(--orange-border)' }}
      onClick={onGo}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)' }}
      />
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-[10px] tracking-widest uppercase mb-1 flex items-center gap-2" style={{ color: 'var(--orange)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> ACTIVE MISSION
          </span>
          <h3 className="text-sm font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            {mission.title}
          </h3>
        </div>
        <div
          className="shrink-0 px-2 py-1 rounded-lg text-xs font-bold font-mono"
          style={{ background: 'rgba(249,115,22,0.2)', color: 'var(--orange)', textShadow: '0 0 5px rgba(249,115,22,0.5)' }}
        >
          +{mission.xpBounty} XP
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {mission.taskDescription}
      </p>
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{mission.difficulty}</span>
        <span className="text-xs font-semibold transition-transform group-hover:translate-x-1" style={{ color: 'var(--orange)' }}>
          Launch Sequence →
        </span>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [missions, setMissions] = useState([]);
  const [dsaCount, setDsaCount] = useState(0);
  const [softSkillCount, setSoftSkillCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [currentRole, setCurrentRole] = useState('Full Stack Developer');
  const [greeting, setGreeting] = useState('SYSTEM ONLINE');

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = useCallback(async () => {
    if (!user?.email) return;
    try {
      if (user.targetRole) setCurrentRole(user.targetRole);

      let mList = await getMissions(user.email);
      if (!mList || mList.length === 0) {
        const init = [
          { id: 'm-1', title: 'Query Quest', category: 'Technical', skillGap: 'Database Optimization', taskDescription: 'Diagnose slow queries and restructure composite indexes.', difficulty: 'Intermediate', xpBounty: 120, targetUrl: '/arena' },
          { id: 'm-2', title: 'Sliding Window Drill', category: 'DSA', skillGap: 'Two Pointers', taskDescription: 'Solve Longest Substring Without Repeating Characters in the DSA Studio.', difficulty: 'Medium', xpBounty: 100, targetUrl: '/arena' },
          { id: 'm-3', title: 'STAR Mastery', category: 'Soft Skills', skillGap: 'Executive Presence', taskDescription: 'Complete 1 Mock Interview with sub-3 filler words.', difficulty: 'Intermediate', xpBounty: 150, targetUrl: '/interview' },
        ];
        for (const m of init) await createMission(user.email, m);
        mList = await getMissions(user.email);
      }
      setMissions(mList);

      const dsa = await getDSAProgress(user.email);
      setDsaCount(Array.isArray(dsa) ? dsa.filter(p => p.solved).length : 0);

      const ss = await getSoftSkillHistory(user.email);
      setSoftSkillCount(Array.isArray(ss) ? ss.length : 0);

      const iv = await getInterviews(user.email);
      setInterviewCount(Array.isArray(iv) ? iv.length : 0);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  }, [user?.email]);

  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const nextLevelXP = level * 500;
  const xpProgress = Math.min(100, Math.round((xp % 500) / 5));
  const readiness = Math.round(
    (SKILL_SNAPSHOT.reduce((sum, s) => sum + s.value, 0) / SKILL_SNAPSHOT.length)
  );
  const featuredMission = missions[0];

  return (
    <AppShell>
      <motion.div 
        className="p-6 lg:p-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ─── HEADER ─── */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--emerald)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {greeting}
            </p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
              Welcome back, <span style={{ color: 'var(--orange)' }}>{user?.name?.split(' ')[0] || 'Operator'}</span>.
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Target Directive: <span className="font-semibold text-white" style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}>{currentRole}</span>
            </p>
          </div>

          {/* Level + XP HUD Element */}
          <div
            className="flex items-center gap-4 px-5 py-3 rounded-2xl shrink-0 backdrop-blur-lg"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
          >
            <div className="text-center">
              <div className="text-xl font-bold font-mono" style={{ color: 'var(--orange)', textShadow: '0 0 10px rgba(249,115,22,0.5)' }}>Lvl {level}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Level</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
            <div>
              <div className="text-sm font-bold mb-1.5 font-mono" style={{ color: 'var(--text-primary)' }}>{xp} <span className="text-xs opacity-50">XP</span></div>
              <div className="w-32 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ boxShadow: '0 0 10px rgba(249,115,22,0.8)' }}
                />
              </div>
              <div className="text-[9px] uppercase tracking-wide mt-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>{nextLevelXP - (xp % 500)} TO NEXT</div>
            </div>
          </div>
        </motion.div>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">

            {/* YOUR NEXT MOVE — featured mission */}
            <motion.div variants={itemVariants}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Mission Control</p>
              {featuredMission ? (
                <MiniMissionCard
                  mission={featuredMission}
                  onGo={() => router.push(featuredMission.targetUrl || '/arena')}
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--shadow-orange)' }}
                  className="rounded-2xl p-5 cursor-pointer backdrop-blur-lg"
                  style={{ background: 'var(--surface)', border: '1px solid var(--orange-border)' }}
                  onClick={() => router.push('/counselor')}
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--orange)' }}>SYSTEM INITIALIZATION</p>
                  <h3 className="text-base font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Complete your career intake</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Provide telemetry so PARICHAYA can build your personalized HUD.</p>
                  <span className="inline-block mt-3 text-xs font-semibold" style={{ color: 'var(--orange)' }}>Initialize →</span>
                </motion.div>
              )}
            </motion.div>

            {/* Quick actions */}
            <motion.div variants={itemVariants}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Quick Access</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUICK_ACTIONS.map(a => (
                  <motion.button
                    key={a.label}
                    whileHover={{ scale: 1.05, y: -4, boxShadow: `0 8px 25px ${a.bg}` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(a.href)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl backdrop-blur-md"
                    style={{ background: 'var(--surface)', border: `1px solid ${a.border}` }}
                  >
                    <span className="text-2xl drop-shadow-md">{a.icon}</span>
                    <span className="text-xs font-bold tracking-wide" style={{ color: a.color }}>{a.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Skill Snapshot */}
            <motion.div variants={itemVariants}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Telemetry Breakdown</p>
              <div
                className="rounded-2xl p-6 space-y-5 backdrop-blur-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                {SKILL_SNAPSHOT.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>{skill.name}</span>
                      <span className="text-xs font-bold font-mono" style={{ color: skill.color, textShadow: `0 0 8px ${skill.color}` }}>{skill.value}%</span>
                    </div>
                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: skill.color, boxShadow: `0 0 10px ${skill.color}` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value}%` }}
                        transition={{ duration: 1, delay: 0.3 + (i * 0.1), ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Career Readiness Ring */}
            <motion.div variants={itemVariants}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Combat Readiness</p>
              <div
                className="rounded-2xl p-6 flex flex-col items-center backdrop-blur-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <ReadinessRing score={readiness} />
                <div className="w-full mt-6 space-y-3">
                  {READINESS_CATS.map((cat, i) => (
                    <div key={cat.label} className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>{cat.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            className="h-full rounded-full" 
                            style={{ background: cat.color, boxShadow: `0 0 5px ${cat.color}` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.score}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + (i * 0.1) }}
                          />
                        </div>
                        <span className="text-[10px] font-bold font-mono w-6 text-right" style={{ color: cat.color }}>{cat.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Recommendation */}
            <motion.div variants={itemVariants}
              className="rounded-2xl p-5 backdrop-blur-lg"
              style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--emerald)', textShadow: '0 0 5px rgba(16,185,129,0.5)' }}>COACH DIRECTIVE</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Based on current telemetry, prioritize <span className="font-bold text-white">SQL query optimization</span> and <span className="font-bold text-white">STAR-method communication</span> before engaging in the next mock interview.
              </p>
            </motion.div>

            {/* All Missions */}
            {missions.length > 1 && (
              <motion.div variants={itemVariants}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Mission Log</p>
                <div className="space-y-2">
                  {missions.slice(1).map(m => (
                    <motion.div
                      key={m.id}
                      whileHover={{ scale: 1.02, x: 4, background: 'var(--surface-hover)', borderColor: 'var(--border-strong)' }}
                      onClick={() => router.push(m.targetUrl || '/arena')}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer backdrop-blur-sm"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{m.title}</p>
                        <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.category} · {m.difficulty}</p>
                      </div>
                      <span className="text-xs font-bold font-mono shrink-0" style={{ color: 'var(--orange)' }}>+{m.xpBounty}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
