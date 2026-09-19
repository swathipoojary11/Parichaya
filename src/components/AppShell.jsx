'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!user) return <>{children}</>;

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Atmospheric background */}
      <div className="atmosphere pointer-events-none" aria-hidden="true">
        {/* Blue glow top-center */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.09) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        {/* Orange accent — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '8%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        {/* Indigo accent — left mid */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Sidebar */}
      <div className="hidden md:block shrink-0" style={{ width: sidebarWidth, transition: 'width 0.3s ease' }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: 240 }}>
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10" style={{ transition: 'margin 0.3s ease' }}>
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center justify-between h-14 px-4 shrink-0"
          style={{ background: 'rgba(10,22,40,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl"
            style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd"/>
            </svg>
          </button>

          <span
            className="font-bold text-sm tracking-widest"
            style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', letterSpacing: '0.1em' }}
          >
            PARICHAYA
          </span>

          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'var(--orange-soft)', color: 'var(--orange)', border: '1px solid var(--orange-border)' }}
          >
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
