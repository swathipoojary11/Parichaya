'use client';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <div className="flex flex-col items-center gap-4">
          {/* Logo mark */}
          <div className="relative w-14 h-14 flex items-center justify-center rounded-2xl" style={{ background: 'var(--orange-soft)', border: '1px solid var(--border-orange)' }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <circle cx="12" cy="12" r="9.5" stroke="#F97316" strokeWidth="1.5" strokeDasharray="42 16" strokeLinecap="round"/>
              <path d="M8 7v10" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 7c0 0 7-1 8 4s-8 4-8 4" stroke="#F97316" strokeWidth="1.75" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="absolute -inset-1 rounded-2xl opacity-30 animate-pulse" style={{ background: 'var(--orange-glow)', filter: 'blur(8px)' }} />
          </div>
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm tracking-widest uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Initializing...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <DashboardPage />;
  }

  return <LoginPage />;
}
