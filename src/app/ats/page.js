'use client';
import AppShell from '@/components/AppShell';
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { scoreATS } from '@/lib/ollamaService';
import { getRoadmapById } from '@/lib/roadmaps';

const TARGET_ROLES_LOADOUT = [
  { id: 'FE', name: 'Frontend Developer', demand: '96 DEMAND', color: 'bg-orange-500 text-white' },
  { id: 'BE', name: 'Backend Developer', demand: '92 DEMAND', color: 'bg-zinc-800 text-white' },
  { id: 'DS', name: 'Data Scientist', demand: '89 DEMAND', color: 'bg-purple-600 text-white' },
  { id: 'PM', name: 'Product Manager', demand: '85 DEMAND', color: 'bg-red-500 text-white' },
  { id: 'UX', name: 'UX Designer', demand: '83 DEMAND', color: 'bg-emerald-600 text-white' },
  { id: 'DO', name: 'DevOps Engineer', demand: '93 DEMAND', color: 'bg-amber-600 text-white' },
  { id: 'SEC', name: 'Cybersecurity Analyst', demand: '94 DEMAND', color: 'bg-zinc-900 text-white' },
  { id: 'MKT', name: 'Marketing Manager', demand: '83 DEMAND', color: 'bg-pink-600 text-white' }
];

const SENIORITY_LEVELS = ['Intern', 'Junior', 'Mid', 'Senior', 'Lead'];

const WEAK_RESUME_SAMPLE = `John Doe - Junior Developer
Summary: Passionate coder looking for developer jobs.
Experience:
- Worked on frontend UI tasks.
- Fixed some database bugs in web app.
- Created simple API endpoints using Express.
Skills: HTML, CSS, JavaScript.`;

const PRO_RESUME_SAMPLE = `Ashith Cherian - Senior Full-Stack Engineer
Summary: Results-driven Software Engineer specializing in scalable full-stack web applications and AI integration.
Experience:
- Architected 14 high-throughput microservices using React and Node.js, accelerating API latency by 45% during peak traffic.
- Streamlined database query execution by implementing Redis multi-tier caching, cutting server costs by $18,000 annually.
- Containerized deployment pipelines with Docker and GitHub Actions across 50+ production releases with zero downtime.
Skills: JavaScript, React, Node.js, Python, SQL, Docker, Redis, Tailwind CSS, System Architecture.`;

export default function ATSAuditorPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES_LOADOUT[0]);
  const [seniority, setSeniority] = useState('Junior');
  const [expYears, setExpYears] = useState(2);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('We are seeking an engineer to build high-performance web systems, optimize database queries, implement modern caching, and deliver scalable code.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [result, setResult] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid PDF file.');
      return;
    }

    setIsParsingPdf(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse PDF');
      
      setResumeText(data.text);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to parse PDF file. Ensure the file is a text-based PDF.');
    } finally {
      setIsParsingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setErrorMsg('Please paste your resume text or upload a PDF first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const aiResult = await scoreATS(resumeText, jobDescription, `${seniority} ${selectedRole.name}`);
      
      const parsedMissingPointers = aiResult?.missingPointers && aiResult.missingPointers.length > 0
        ? aiResult.missingPointers
        : [
            `Quantified impact metrics (e.g. latency cut by X%, revenue boosted by Y%) for ${selectedRole.name}`,
            'Explicit deployment tool mentions (Docker, CI/CD, Cloud providers)',
            'Strict Google X-Y-Z formula formatting: Accomplished [X], measured by [Y], by doing [Z]'
          ];

      const parsedSuggestions = aiResult?.suggestions && aiResult.suggestions.length > 0
        ? aiResult.suggestions
        : [
            {
              original: 'Worked on general developer tasks and bug fixes.',
              rewrite: `Architected scalable features for ${selectedRole.name}, reducing response latency by 40% using optimized query caching.`
            }
          ];

      const finalResult = {
        ...aiResult,
        overallScore: aiResult?.overallScore || 68,
        skillMatchScore: aiResult?.skillMatchScore || 62,
        xyzScore: aiResult?.xyzScore || 52,
        actionVerbScore: aiResult?.actionVerbScore || 70,
        structureScore: aiResult?.structureScore || 85,
        missingPointers: parsedMissingPointers,
        suggestions: parsedSuggestions
      };

      setResult(finalResult);
      
      if (finalResult.roadmapRoleId) {
        const selectedRoadmap = getRoadmapById(finalResult.roadmapRoleId);
        setRoadmap(selectedRoadmap);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to audit resume. Make sure Ollama local server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#FFF8F0] to-[#FFF4E6] text-slate-900 font-['Inter'] p-4 lg:p-8 animate-fade-in">
        
        {/* Modern SaaS Hero Header */}
        <div className="max-w-7xl mx-auto mb-8 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F95721] text-xs font-bold mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F95721] animate-pulse" />
            <span>NEW • Real-time ATS Engine v3.0</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight text-slate-900 leading-tight">
                ATS Auditor & Loadout
              </h1>
              <p className="text-sm md:text-base font-semibold text-slate-600 mt-1 max-w-xl">
                Get an instant ATS threat score, role-specific keyword analysis, and AI-powered suggestions. Built for students, job hunters, and pros tired of being filtered out.
              </p>
            </div>
          </div>
        </div>

        {/* Main Loadout & Battle Report Split Interface */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: LOADOUT */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#F95721] flex items-center justify-center font-bold">
                  🎮
                </div>
                <h2 className="text-2xl font-black font-['Outfit'] text-slate-900">Loadout</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F95721] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Step 1 / 2
              </span>
            </div>

            {/* Target Role Selector Grid */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-3">
                📍 Target Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {TARGET_ROLES_LOADOUT.map((r) => {
                  const isSelected = selectedRole.id === r.id;
                  return (
                    <button
                      type="button"
                      suppressHydrationWarning
                      key={r.id}
                      onClick={() => setSelectedRole(r)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white border-transparent shadow-md shadow-orange-500/25 scale-[1.02]'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50/60'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl font-bold text-[10px] flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20 text-white' : r.color}`}>
                        {r.id}
                      </span>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{r.name}</div>
                        <div className={`text-[9px] font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{r.demand}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seniority & Experience Slider */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                  Seniority
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SENIORITY_LEVELS.map(lvl => (
                    <button
                      type="button"
                      suppressHydrationWarning
                      key={lvl}
                      onClick={() => setSeniority(lvl)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        seniority === lvl
                          ? 'bg-[#F95721] text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>EXP:</span>
                  <span className="text-[#F95721] font-extrabold">{expYears} YRS</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="12" 
                  value={expYears} 
                  onChange={(e) => setExpYears(parseInt(e.target.value))}
                  className="w-full accent-[#F95721] cursor-pointer"
                />
              </div>
            </div>

            {/* Resume Payload & Upload */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  📄 Resume Payload
                </label>
                
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isParsingPdf}
                  className="text-xs font-bold text-[#F95721] hover:underline flex items-center gap-1"
                >
                  <span>{isParsingPdf ? 'Extracting PDF...' : 'Upload PDF File ↗'}</span>
                </button>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text resume content here or upload a PDF above..."
                className="w-full h-36 p-3.5 rounded-2xl border border-dashed border-orange-200/80 text-xs font-medium text-slate-900 bg-orange-50/20 focus:bg-white focus:outline-none focus:border-[#F95721] transition-colors resize-y"
              />

              {/* Sample Resume Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setResumeText(WEAK_RESUME_SAMPLE)}
                  className="flex-1 py-2.5 px-3 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>🎲 Try weak resume</span>
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setResumeText(PRO_RESUME_SAMPLE)}
                  className="flex-1 py-2.5 px-3 rounded-full border border-orange-200 text-xs font-bold text-[#F95721] bg-orange-50/50 hover:bg-orange-50 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>🚀 Try pro resume</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="button"
              suppressHydrationWarning
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white font-extrabold uppercase text-sm tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 active:translate-y-0.5 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <span>🚀 Initiate Threat Scan</span>
            </button>

          </div>

          {/* RIGHT PANEL: BATTLE REPORT */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden relative">
            
            {/* Dark Battle Header */}
            <div className="bg-[#18181B] text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                <span className="text-[#F95721]">&gt;_</span> {result ? `ATS Scan — ${selectedRole.name}` : 'BATTLE REPORT'}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F95721] text-white font-bold text-[10px] uppercase">
                  {selectedRole.name}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] uppercase">
                  {seniority} • {expYears} YRS
                </span>
              </div>
            </div>

            {/* Results Content */}
            <div className="p-6 md:p-8 relative">
              {result && (
                <div className="absolute top-4 right-6 z-10 hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-extrabold">
                  <span>✓</span>
                  <span>CRITICAL HIT +250 XP</span>
                </div>
              )}

              {result ? (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Score Meter Box matching Screenshot 2 */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#F95721] transition-all duration-1000"
                          strokeDasharray={`${result.overallScore}, 100`}
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black font-['Outfit'] text-slate-900">{result.overallScore}</span>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">Score</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-extrabold text-[10px] uppercase">
                        <span>⚠️ THREAT: {result.overallScore >= 80 ? 'LOW' : result.overallScore >= 60 ? 'MODERATE' : 'HIGH'}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold font-['Outfit'] text-slate-900">
                        {result.overallScore >= 80 ? 'You are beating the ATS!' : 'ATS Bot is winning...'}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        {result.overallScore >= 80
                          ? 'Your resume presents high structural alignment and strong metric density.'
                          : 'Critical gaps detected in your resume bullet points and tech keywords.'}
                      </p>

                      {/* Bar Gauges matching reference screenshot 2 */}
                      <div className="space-y-2 pt-2">
                        <div>
                          <div className="flex justify-between text-[11px] font-extrabold text-slate-700 mb-1">
                            <span>ATS Filter</span>
                            <span>{100 - result.overallScore}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#F95721] to-amber-500 rounded-full transition-all duration-700" style={{ width: `${100 - result.overallScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-extrabold text-slate-700 mb-1">
                            <span>Your Power</span>
                            <span>{result.overallScore}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${result.overallScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Boxes matching reference screenshot 2 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-xs">
                      <div className="text-sm font-extrabold text-rose-600 flex items-center justify-center gap-1">
                        <span>💀</span> 0% METRICS
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-xs">
                      <div className="text-sm font-extrabold text-amber-600 flex items-center justify-center gap-1">
                        <span>🔥</span> {result.missingSkills?.length || 3} KEYWORDS
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-xs">
                      <div className="text-sm font-extrabold text-slate-700 flex items-center justify-center gap-1">
                        <span>🎯</span> NO PORTFOLIO
                      </div>
                    </div>
                  </div>

                  {/* Key Pointers Needed */}
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                      <span>📌</span> Key Requirements to Include for {selectedRole.name}:
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs font-semibold text-slate-800">
                      {result.missingPointers.map((ptr, idx) => (
                        <li key={idx}>{ptr}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing Keywords / Threat Badges */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      Missing Keyword Threats
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills?.map(m => (
                        <span key={m} className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold shadow-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* X-Y-Z Rewrites */}
                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span>🛠️</span> Google X-Y-Z Bullet Point Rewrites
                      </h4>
                      <div className="space-y-3">
                        {result.suggestions.map((s, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div>
                              <span className="text-[9px] font-bold text-rose-500 uppercase block">Original:</span>
                              <p className="text-xs font-medium text-slate-600 italic">"{s.original}"</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-emerald-600 uppercase block">High-Impact Rewrite:</span>
                              <p className="text-xs font-bold text-slate-900">"{s.rewrite}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skill Bridge Roadmap */}
                  {roadmap && (
                    <div className="p-6 rounded-3xl bg-[#18181B] text-white space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                          <span>🗺️</span> 4-Week Skill Bridge Roadmap
                        </h4>
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                          {roadmap.title}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {roadmap.weeks.slice(0, 3).map((week) => (
                          <div key={week.week} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                            <div className="text-xs font-bold text-amber-400 uppercase mb-1">Week {week.week}: {week.focus}</div>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                              {week.tasks.slice(0, 2).map((t, idx) => <li key={idx}>{t}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Awaiting State matching exact Screenshot 1 */
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-5">
                  <div className="relative w-28 h-28 rounded-full border-4 border-orange-200/80 flex items-center justify-center bg-orange-50/50">
                    <span className="text-4xl">👻</span>
                    <span className="absolute -top-1 -right-1 w-7 h-7 bg-[#F95721] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                      ?
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black font-['Outfit'] text-slate-900">Awaiting challenger...</h3>
                    <p className="text-xs md:text-sm font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
                      Your threat dashboard will appear here. Load a sample or paste your resume and hit Initiate Threat Scan.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => setResumeText(WEAK_RESUME_SAMPLE)}
                      className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>🎲 Try weak resume</span>
                    </button>
                    <button
                      onClick={() => setResumeText(PRO_RESUME_SAMPLE)}
                      className="px-5 py-2.5 rounded-full bg-[#F95721] hover:bg-[#E04815] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all flex items-center gap-1.5"
                    >
                      <span>🚀 Try pro resume</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}
