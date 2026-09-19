'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ParichayaLogo from '@/components/ParichayaLogo';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        await signup(name.trim(), email.trim().toLowerCase(), password);
      } else {
        await login(email.trim().toLowerCase(), password);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#FFF8F0] to-[#FFF4E6] font-['Inter'] relative overflow-x-hidden text-slate-900">
      
      {/* Modern SaaS Top Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 py-4 sticky top-0 z-50">
        
        {/* Logo Area */}
        <ParichayaLogo size="normal" showText={true} />

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-8 font-['Outfit'] font-bold text-sm text-slate-600">
          <a href="#" className="hover:text-[#F95721] transition-colors">Audit Engine</a>
          <a href="#" className="hover:text-[#F95721] transition-colors">Career Counselor</a>
          <a href="#" className="hover:text-[#F95721] transition-colors">Skill Arena</a>
          <a href="#" className="hover:text-[#F95721] transition-colors">Mock Interview</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-xs">
            <span className="text-amber-500 font-bold text-xs">🔥 7 day streak</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-[#F95721]">⚡ 240 XP</span>
          </div>
          <button 
            onClick={() => setIsSignUp(true)}
            className="px-5 py-2 text-xs font-bold text-white bg-[#F95721] hover:bg-[#E04815] rounded-full shadow-md shadow-orange-500/25 transition-all"
          >
            Start Free Scan
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text & Auth Form */}
        <div className="flex flex-col items-start z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F95721] text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F95721] animate-pulse" />
            <span>NEW • Real-time ATS Threat Engine v3.0</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-['Outfit'] font-extrabold leading-[1.05] mb-6 tracking-tight text-slate-900">
            Audit your resume. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F95721] via-orange-500 to-amber-500">
              Beat the ATS.
            </span><br/>
            Land the job.
          </h1>
          
          <p className="text-base font-medium text-slate-600 max-w-md mb-8 leading-relaxed">
            Get an instant ATS threat score, role-specific keyword analysis, and AI-powered suggestions. Built for students, job hunters, and pros tired of being filtered out.
          </p>

          {/* Auth Card */}
          <div className="card w-full max-w-sm p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
            <div className="flex gap-2 mb-6 border-b border-slate-100 pb-4">
              {['Sign In', 'Create Account'].map((tab, i) => {
                const active = i === (isSignUp ? 1 : 0);
                return (
                  <button
                    key={tab}
                    onClick={() => { setIsSignUp(i === 1); setError(null); }}
                    className={`flex-1 py-2 text-xs font-bold font-['Outfit'] rounded-full transition-all ${
                      active ? 'bg-[#F95721] text-white shadow-md shadow-orange-500/25' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="FULL NAME"
                    className="input-field"
                    required={isSignUp}
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="input-field"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200 rounded-2xl text-center">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3.5 mt-2"
              >
                {loading ? 'LOADING...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Threat Scan Visual */}
        <div className="relative z-0 hidden md:block">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-extrabold absolute -top-4 left-4 z-20 shadow-xs">
            <span>✓</span>
            <span>CRITICAL HIT +250 XP</span>
          </div>

          <div className="card w-full overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/60">
            
            {/* Window Header */}
            <div className="bg-[#18181B] text-white flex items-center justify-between p-4 px-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                <span className="text-[#F95721]">&gt;_</span> ATS Scan — Frontend Developer
              </div>
              <div className="px-3 py-1 rounded-full bg-[#F95721] text-white font-bold text-[10px] uppercase">
                REC
              </div>
            </div>

            {/* Scan Body */}
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#F95721]" strokeDasharray="78, 100" strokeWidth="3.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black font-['Outfit'] text-slate-900">78</span>
                    <span className="text-[9px] font-bold uppercase text-slate-400">Score</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-extrabold text-[10px] uppercase">
                    <span>⚠️ THREAT: HIGH</span>
                  </div>
                  <h3 className="font-['Outfit'] font-extrabold text-xl leading-tight text-slate-900">ATS Bot is winning...</h3>
                  <p className="text-xs text-slate-500 font-medium">Critical gaps detected in your resume</p>
                </div>
              </div>

              {/* Metric Summary Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center text-xs font-bold text-rose-600">
                  💀 0% METRICS
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center text-xs font-bold text-amber-600">
                  🔥 3 KEYWORDS
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center text-xs font-bold text-slate-700">
                  🎯 NO PORTFOLIO
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
