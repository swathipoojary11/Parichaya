"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { openDB, getOrCreateProfile } from "@/lib/db";
import { checkOllamaHealth } from "@/lib/ollama";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState({ checking: true, ok: false });

  const fetchProfile = async () => {
    try {
      if (typeof window !== "undefined") {
        await openDB();
        const p = await getOrCreateProfile();
        setProfile(p);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    checkOllamaHealth().then(res => setOllamaStatus({ checking: false, ok: res.ok }));

    const handleDbChange = () => fetchProfile();
    window.addEventListener("aura-db-changed", handleDbChange);
    return () => window.removeEventListener("aura-db-changed", handleDbChange);
  }, []);

  const navLinks = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/counselor", label: "Counselor Intake", icon: "🧭" },
    { href: "/ats-audit", label: "ATS Resume Audit", icon: "📑" },
    { href: "/skillquest", label: "SkillQuest Arena", icon: "⚡" },
    { href: "/interview", label: "Video Arena", icon: "📹" },
    { href: "/interview/feedback", label: "Session Feedback", icon: "🎯" },
    { href: "/roadmap", label: "Quest Roadmap", icon: "🗺️" },
    { href: "/resources", label: "DSA Resources", icon: "📚" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Drawer Trigger + Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNavDrawerOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors flex items-center justify-center font-bold"
              aria-label="Open Navigation Drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <a href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                P
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center">
                  PARICHAYA <span className="text-orange-500 ml-1 font-bold">AURA</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">On-Device Career Engine</span>
              </div>
            </a>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
            {navLinks.slice(0, 6).map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Telemetry & AI Chat Drawer Toggle */}
          <div className="flex items-center space-x-3">
            {/* Ollama Status Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${ollamaStatus.ok ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="text-slate-700 font-bold text-[11px]">
                {ollamaStatus.checking ? "AI checking..." : ollamaStatus.ok ? "Qwen2.5 3B Local" : "AI Offline"}
              </span>
            </div>

            {/* Profile Quick Pill */}
            {profile && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
                <span className="text-xs font-bold text-orange-700">{profile.readinessScore}%</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                  Lvl {Math.floor((profile.totalXp || 0) / 100) + 1}
                </span>
              </div>
            )}

            {/* Chat Assistant Toggle Button */}
            <button
              onClick={() => setIsChatDrawerOpen(!isChatDrawerOpen)}
              className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md transition-all flex items-center space-x-2 text-xs"
            >
              <span>💬</span>
              <span className="hidden sm:inline font-bold">AI Coach</span>
            </button>
          </div>
        </div>
      </header>

      {/* Off-Canvas Navigation Drawer */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-slide-left border-r border-slate-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white">
                  P
                </div>
                <div>
                  <h2 className="font-extrabold text-base">PARICHAYA</h2>
                  <p className="text-xs text-orange-400 font-mono font-bold">Off-Canvas Hub</p>
                </div>
              </div>
              <button
                onClick={() => setIsNavDrawerOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Dynamic Profile Box */}
            {profile && (
              <div className="p-4 bg-orange-50/60 border-b border-orange-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{profile.fullName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">
                    {profile.skillLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">🎯 {profile.targetRole}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>Readiness Index</span>
                    <span>{profile.readinessScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${profile.readinessScore}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Navigation Menu
              </span>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsNavDrawerOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Footer Telemetry */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs space-y-2">
              <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                <span>Database:</span>
                <span className="text-emerald-600 font-bold">IndexedDB (v1)</span>
              </div>
              <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                <span>Telemetry:</span>
                <span className="text-orange-600 font-bold">ws://127.0.0.1:3001</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Off-Canvas Chat Feedback Drawer */}
      {isChatDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsChatDrawerOpen(false)}
          />

          {/* Chat Drawer Body */}
          <div className="relative w-[440px] max-w-[90vw] bg-white h-full shadow-2xl z-10 animate-slide-right p-3">
            <ChatFeedbackPanel
              contextTitle="AURA AI Placement Coach"
              isOpen={isChatDrawerOpen}
              onClose={() => setIsChatDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-medium">
        PARICHAYA Career Platform &bull; 100% Privacy-First On-Device AI Engine &bull; Qwen2.5 3B Local Model
      </footer>
    </div>
  );
}
