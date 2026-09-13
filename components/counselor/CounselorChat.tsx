'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, CounselorChatMessage } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Bot,
  User,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  FileText,
  Zap,
  Sparkles,
  Code
} from 'lucide-react';

export interface CounselorChatProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onCompleteStep?: (stepId: number) => void;
  onAwardXp?: (amount: number, reason: string) => void;
}

export const CounselorChat: React.FC<CounselorChatProps> = ({
  userProfile,
  onUpdateProfile,
  onCompleteStep,
  onAwardXp,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showResumePreview, setShowResumePreview] = useState<boolean>(true);

  // Form States
  const [step1Role, setStep1Role] = useState(userProfile.targetRole || 'Full Stack Engineer (Campus Placement)');
  const [step1Industry, setStep1Industry] = useState(userProfile.targetIndustry || 'FinTech & Cloud Systems');

  const [step2Degree, setStep2Degree] = useState(userProfile.degree || 'B.Tech in Computer Science & Engineering');
  const [step2Institution, setStep2Institution] = useState(userProfile.institution || 'National Institute of Technology');
  const [step2Gpa, setStep2Gpa] = useState(userProfile.gpa || '8.8 / 10.0 CGPA');
  const [step2GradYear, setStep2GradYear] = useState(userProfile.graduationYear || '2026');

  // Step 3: Google X-Y-Z formula inputs
  const [projTitle, setProjTitle] = useState('Distributed Task Scheduler & Queue System');
  const [projX, setProjX] = useState('Reduced background async job latency by 45%');
  const [projY, setProjY] = useState('processed 100,000+ requests/min at sub-10ms response');
  const [projZ, setProjZ] = useState('architected Redis pub/sub queue with Node.js worker pools');
  const [projTech, setProjTech] = useState('TypeScript, Node.js, Redis, Docker, PostgreSQL');

  // Step 4: Work Experience & Leadership
  const [expRole, setExpRole] = useState('Backend Engineering Intern');
  const [expCompany, setExpCompany] = useState('Apex Cloud Labs');
  const [expHighlights, setExpHighlights] = useState(
    'Built gRPC microservices with 99.99% uptime, reduced query execution time by 35% through indexing optimizations.'
  );

  const stepsList = [
    { id: 1, name: 'Target Role & Domain', icon: Briefcase },
    { id: 2, name: 'Education & Credentials', icon: GraduationCap },
    { id: 3, name: 'Projects & Tech Stack (Google X-Y-Z Formula)', icon: FolderGit2 },
    { id: 4, name: 'Work Experience & Leadership', icon: Award },
  ];

  // Chat message trajectory
  const [messages, setMessages] = useState<CounselorChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Greetings! I am your on-device AI Career Counselor. Let's build your placement-ready, ATS-optimized profile. First, what is your primary Target Role & Domain for campus recruitment?",
      timestamp: '12:00 PM',
      stepId: 1,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (sender: 'ai' | 'user', text: string, stepId?: number) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stepId,
      },
    ]);
  };

  const handleStepSelect = (stepId: number) => {
    setCurrentStep(stepId);
    const stepObj = stepsList.find((s) => s.id === stepId);
    if (!stepObj) return;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(
        'ai',
        `Navigated to Step ${stepId}: ${stepObj.name}. Please enter your details below to update your zero-cloud resume digest.`,
        stepId
      );
    }, 400);
  };

  // Handle Step 1 Submission
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Role.trim()) return;

    const userMsgText = `Target Role: ${step1Role} | Target Industry: ${step1Industry}`;
    addMessage('user', userMsgText, 1);
    onUpdateProfile({ targetRole: step1Role, targetIndustry: step1Industry });

    if (onAwardXp) onAwardXp(50, 'Completed Step 1: Target Role & Domain');
    if (onCompleteStep) onCompleteStep(1);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(2);
      addMessage(
        'ai',
        `Step 1 Complete! Next is Step 2: Education & Credentials. Please confirm your academic institution, major, and CGPA score.`,
        2
      );
    }, 600);
  };

  // Handle Step 2 Submission
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const userMsgText = `Degree: ${step2Degree} | College: ${step2Institution} | CGPA: ${step2Gpa} (${step2GradYear})`;
    addMessage('user', userMsgText, 2);
    onUpdateProfile({
      degree: step2Degree,
      institution: step2Institution,
      gpa: step2Gpa,
      graduationYear: step2GradYear,
    });

    if (onAwardXp) onAwardXp(50, 'Completed Step 2: Education & Credentials');
    if (onCompleteStep) onCompleteStep(2);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(3);
      addMessage(
        'ai',
        `Step 2 Complete! Advancing to Step 3: Projects & Tech Stack (Google X-Y-Z Formula). Enter your accomplishment [X], metric [Y], and technical method [Z].`,
        3
      );
    }, 600);
  };

  // Handle Step 3 Submission
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullXYZDescription = `Accomplished ${projX}, as measured by ${projY}, by doing ${projZ}.`;
    const techArray = projTech.split(',').map((t) => t.trim()).filter(Boolean);

    const updatedProjects = [
      {
        id: `proj-${Date.now()}`,
        title: projTitle,
        descriptionXYZ: fullXYZDescription,
        techStack: techArray,
      },
      ...userProfile.projects,
    ];

    addMessage(
      'user',
      `Project: ${projTitle}\nFormula: Accomplished ${projX}, measured by ${projY}, by doing ${projZ}.\nTech: ${projTech}`,
      3
    );

    onUpdateProfile({
      projects: updatedProjects,
      techSkills: Array.from(new Set([...userProfile.techSkills, ...techArray])),
    });

    if (onAwardXp) onAwardXp(75, 'Completed Step 3: Google X-Y-Z Formula');
    if (onCompleteStep) onCompleteStep(3);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(4);
      addMessage(
        'ai',
        `Step 3 Complete! Finally, Step 4: Work Experience & Leadership. Detail your internship or technical leadership impact bullets.`,
        4
      );
    }, 600);
  };

  // Handle Step 4 Submission
  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp = {
      id: `exp-${Date.now()}`,
      role: expRole,
      company: expCompany,
      duration: 'Summer 2025',
      highlights: [expHighlights],
    };

    const updatedExps = [newExp, ...userProfile.experiences];

    addMessage(
      'user',
      `Role: ${expRole} at ${expCompany}\nHighlights: ${expHighlights}`,
      4
    );

    onUpdateProfile({ experiences: updatedExps });

    if (onAwardXp) onAwardXp(100, 'Completed Step 4: Work Experience & Leadership');
    if (onCompleteStep) onCompleteStep(4);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(
        'ai',
        `🎉 Congratulations! All 4 Counselor steps are synchronized and complete. You can now launch the Deterministic ATS Audit Engine to inspect your Readiness Meter!`,
        4
      );
    }, 700);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Chat Console (7 cols on desktop) */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {/* Step Progress Pills Header */}
        <Card variant="accent" className="!p-4">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            {stepsList.map((step) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepSelect(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isCurrent
                      ? 'bg-orange-500 text-zinc-950 font-bold shadow-md shadow-orange-500/20'
                      : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800/60 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span>
                    Step {step.id}: {step.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Chat Box */}
        <Card className="h-[480px] flex flex-col justify-between overflow-hidden !p-0">
          {/* Header */}
          <div className="p-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  AI Career Counselor
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    Step {currentStep} of 4 Active
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-orange-400">
                  Active: {stepsList[currentStep - 1].name}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowResumePreview(!showResumePreview)}
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800/60 px-2.5 py-1 rounded border border-zinc-700/50 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span>{showResumePreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
          </div>

          {/* Messages Trajectory Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    msg.sender === 'ai'
                      ? 'bg-orange-500 text-zinc-950 font-bold'
                      : 'bg-zinc-700 text-zinc-200 font-semibold'
                  }`}
                >
                  {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'ai'
                      ? 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-100'
                      : 'bg-orange-500 text-zinc-950 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`text-[9px] block mt-1.5 text-right font-mono ${
                      msg.sender === 'ai' ? 'text-zinc-500' : 'text-zinc-900/70'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs italic bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-800 w-max">
                <Bot className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>Synchronizing counselor step data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Step Form Input Area */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800">
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-3">
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Briefcase className="w-3.5 h-3.5" />
                  Step 1: Target Role & Domain
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Target Job Title</label>
                    <input
                      type="text"
                      value={step1Role}
                      onChange={(e) => setStep1Role(e.target.value)}
                      placeholder="e.g. Full Stack Engineer"
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Target Industry / Domain</label>
                    <input
                      type="text"
                      value={step1Industry}
                      onChange={(e) => setStep1Industry(e.target.value)}
                      placeholder="e.g. FinTech / SaaS"
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" icon={<ChevronRight className="w-4 h-4" />}>
                  Proceed to Next Step (0-Cloud Data)
                </Button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-3">
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Step 2: Education & Credentials
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Degree & Major</label>
                    <input
                      type="text"
                      value={step2Degree}
                      onChange={(e) => setStep2Degree(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">College / University</label>
                    <input
                      type="text"
                      value={step2Institution}
                      onChange={(e) => setStep2Institution(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">CGPA / GPA Score</label>
                    <input
                      type="text"
                      value={step2Gpa}
                      onChange={(e) => setStep2Gpa(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={step2GradYear}
                      onChange={(e) => setStep2GradYear(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" icon={<ChevronRight className="w-4 h-4" />}>
                  Proceed to Next Step (0-Cloud Data)
                </Button>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-3">
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  Step 3: Projects & Tech Stack (Google X-Y-Z Formula)
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="Project Title (e.g. Distributed Task Queue)"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs text-white"
                  />

                  <div className="grid grid-cols-1 gap-2 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-400 shrink-0">Accomplished [X]:</span>
                      <input
                        type="text"
                        value={projX}
                        onChange={(e) => setProjX(e.target.value)}
                        placeholder="Reduced job latency by 45%"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 shrink-0">Measured by [Y]:</span>
                      <input
                        type="text"
                        value={projY}
                        onChange={(e) => setProjY(e.target.value)}
                        placeholder="processed 100k requests/min"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 shrink-0">By doing [Z]:</span>
                      <input
                        type="text"
                        value={projZ}
                        onChange={(e) => setProjZ(e.target.value)}
                        placeholder="architected Redis pub/sub queue"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="Tech Stack (comma separated: TypeScript, Redis, Docker)"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <Button type="submit" className="w-full" icon={<ChevronRight className="w-4 h-4" />}>
                  Proceed to Next Step (0-Cloud Data)
                </Button>
              </form>
            )}

            {currentStep === 4 && (
              <form onSubmit={handleStep4Submit} className="space-y-3">
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Award className="w-3.5 h-3.5" />
                  Step 4: Work Experience & Leadership
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="Role Title"
                      className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="Company / Org"
                      className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={expHighlights}
                    onChange={(e) => setExpHighlights(e.target.value)}
                    placeholder="Key impact bullet (e.g., Built gRPC microservices with 99.99% uptime)"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" icon={<Sparkles className="w-4 h-4" />}>
                  Synthesize Final ATS Profile (Local Engine)
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>

      {/* Right Resume Preview Drawer Card (5 cols on desktop) */}
      {showResumePreview && (
        <div className="lg:col-span-5 space-y-4">
          <Card variant="accent" className="space-y-4 sticky top-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Live Resume ATS Preview</h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Step {currentStep} Synchronized
              </span>
            </div>

            {/* Resume Document Mock Sheet */}
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-xs space-y-4 shadow-inner max-h-[580px] overflow-y-auto">
              <div className="text-center border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-white tracking-tight uppercase">
                  Candidate Profile
                </h4>
                <p className="text-[11px] font-mono text-orange-400 mt-0.5">
                  Target: {userProfile.targetRole || 'Full Stack Engineer'} ({userProfile.targetIndustry || 'Tech'})
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  On-Device Zero-Cloud Encrypted Digest
                </p>
              </div>

              {/* Education Section */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 border-b border-zinc-800/80 pb-1 mb-2 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Education & Credentials
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-zinc-200">
                    <span>{userProfile.degree || 'B.Tech CSE'}</span>
                    <span className="font-mono text-zinc-400">{userProfile.graduationYear || '2026'}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>{userProfile.institution || 'NIT Campus'}</span>
                    <span className="font-mono text-emerald-400">{userProfile.gpa || '8.8 CGPA'}</span>
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 border-b border-zinc-800/80 pb-1 mb-2 flex items-center gap-1">
                  <FolderGit2 className="w-3 h-3" />
                  Technical Projects (Google X-Y-Z Formula)
                </div>
                <div className="space-y-3">
                  {userProfile.projects && userProfile.projects.length > 0 ? (
                    userProfile.projects.map((proj) => (
                      <div key={proj.id} className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800/80">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-zinc-100">{proj.title}</span>
                          <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded">
                            X-Y-Z Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed pl-2 border-l-2 border-orange-500/50">
                          {proj.descriptionXYZ}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {proj.techStack.map((tech) => (
                            <span key={tech} className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-zinc-500 italic">No projects added yet.</p>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 border-b border-zinc-800/80 pb-1 mb-2 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Experience & Leadership
                </div>
                <div className="space-y-2">
                  {userProfile.experiences && userProfile.experiences.length > 0 ? (
                    userProfile.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between text-zinc-200 font-medium">
                          <span>{exp.role}</span>
                          <span className="text-zinc-400 text-[11px] font-mono">{exp.company}</span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-0.5">
                          {exp.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-zinc-500 italic">No experience added yet.</p>
                  )}
                </div>
              </div>

              {/* Skills Footer */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 border-b border-zinc-800/80 pb-1 mb-2 flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  Extracted Tech Stack Keywords
                </div>
                <div className="flex flex-wrap gap-1">
                  {userProfile.techSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono bg-zinc-800 text-orange-400 px-2 py-0.5 rounded border border-zinc-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full text-xs"
                onClick={() => {
                  if (onCompleteStep) onCompleteStep(4);
                }}
              >
                Audit Resume (0-Cloud Data)
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CounselorChat;
