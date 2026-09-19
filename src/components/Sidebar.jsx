'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CatCoach from '@/components/CatCoach';
import ParichayaLogo from '@/components/ParichayaLogo';

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z"/>
      </svg>
    )
  },
  {
    id: 'counselor',
    label: 'AI Counsellor',
    href: '/counselor',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.58A21.59 21.59 0 0010 14c2.236 0 4.43-.18 6.57-.524 1.437-.232 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.102 41.102 0 0010 2zm0 8a1 1 0 100-2 1 1 0 000 2zm-4-1a1 1 0 112 0 1 1 0 01-2 0zm9-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
      </svg>
    )
  },
  {
    id: 'ats',
    label: 'ATS Auditor',
    href: '/ats',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1H3a1 1 0 010 2h-.01a1 1 0 01-1-1zM1.99 10a1 1 0 011-1H3a1 1 0 010 2h-.01a1 1 0 01-1-1zM1.99 15.25a1 1 0 011-1H3a1 1 0 010 2h-.01a1 1 0 01-1-1z" clipRule="evenodd"/>
      </svg>
    )
  },
  {
    id: 'arena',
    label: 'Skill Arena',
    href: '/arena',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"/>
      </svg>
    )
  },
  {
    id: 'interview',
    label: 'Mock Interview',
    href: '/interview',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z"/>
        <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5H10.75v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z"/>
      </svg>
    )
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    href: '/roadmap',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zM1.75 7.5a.75.75 0 000 1.5H11a.75.75 0 000-1.5H1.75zm0 4.75a.75.75 0 000 1.5H7a.75.75 0 000-1.5H1.75z" clipRule="evenodd"/>
        <path d="M14.25 9a.75.75 0 01.75.75v4.59l1.47-1.47a.75.75 0 111.06 1.06l-2.75 2.75a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 111.06-1.06l1.47 1.47V9.75A.75.75 0 0114.25 9z"/>
      </svg>
    )
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <>
      {/* Sidebar - Modern SaaS Style */}
      <aside
        className="fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-md border-r border-slate-200/80 shadow-sm"
        style={{
          width: collapsed ? '80px' : '260px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center h-20 px-5 shrink-0 border-b border-slate-100">
          <button
            onClick={onToggle}
            className="w-full flex items-center gap-3 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <ParichayaLogo size={collapsed ? 'small' : 'normal'} showText={!collapsed} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 font-bold font-['Outfit'] text-sm ${
                  active
                    ? 'bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white shadow-lg shadow-orange-500/25'
                    : 'bg-transparent text-slate-600 hover:bg-orange-50/60 hover:text-[#F95721]'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>

                {!collapsed && (
                  <span className="tracking-tight">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-3 border-t border-slate-100 bg-white/50">
          {/* AI Status */}
          {!collapsed && (
            <div className="px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Qwen2.5 3B · On-Device AI</span>
              </div>
            </div>
          )}

          {/* Cat/Bot mascot */}
          {!collapsed && (
            <div className="flex justify-center py-1">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                <CatCoach state="idle" size={42} />
              </div>
            </div>
          )}

          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-gradient-to-br from-[#F95721] to-[#FF7A00] text-white shadow-sm">
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate font-['Outfit']">{user.name}</p>
                  <p className="text-[11px] font-semibold text-slate-500 truncate">
                    {user.xp || 0} XP · Lvl {user.level || 1}
                  </p>
                </div>
              )}
              {!collapsed && (
                <button
                  onClick={logout}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
