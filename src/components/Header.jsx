'use client';
import { useAuth } from '@/contexts/AuthContext';
import ParichayaLogo from '@/components/ParichayaLogo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <ParichayaLogo size="normal" showText={true} />

          {/* Navigation links matching reference image */}
          <nav className="hidden lg:flex items-center gap-6 font-['Outfit'] font-bold text-sm text-slate-600">
            <Link
              href="/ats"
              className={`hover:text-[#F95721] transition-colors ${pathname === '/ats' ? 'text-[#F95721]' : ''}`}
            >
              Audit
            </Link>
            <Link
              href="/counselor"
              className={`hover:text-[#F95721] transition-colors ${pathname === '/counselor' ? 'text-[#F95721]' : ''}`}
            >
              Forge
            </Link>
            <Link
              href="/arena"
              className={`hover:text-[#F95721] transition-colors ${pathname === '/arena' ? 'text-[#F95721]' : ''}`}
            >
              Skill Arena
            </Link>
            <Link
              href="/roadmap"
              className={`hover:text-[#F95721] transition-colors ${pathname === '/roadmap' ? 'text-[#F95721]' : ''}`}
            >
              Leaderboard
            </Link>
          </nav>
        </div>

        {/* Right side widgets matching exact reference screenshots */}
        <div className="flex items-center gap-3">
          {/* Streak pill badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-white text-slate-700 rounded-full border border-slate-200 shadow-xs">
            <span className="text-amber-500">🔥</span>
            <span>7 day streak</span>
          </div>

          {/* XP pill badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-xs shadow-orange-500/20">
            <span>⚡</span>
            <span>{user.xp || 240} XP</span>
          </div>

          {/* Free Scan / Quick Scan CTA button */}
          <Link
            href="/ats"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#F95721] hover:bg-[#E04815] rounded-full shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925a1.5 1.5 0 001.035 1.035l4.925 1.414a.75.75 0 000-1.442L4.728 7.757a.75.75 0 01-.517-.517L2.797 2.315a.75.75 0 00-.308-.026zM16.895 2.289a.75.75 0 01.826.95l-1.414 4.925a1.5 1.5 0 01-1.035 1.035l-4.925 1.414a.75.75 0 010-1.442l4.925-1.414a.75.75 0 00.517-.517l1.414-4.925a.75.75 0 01.308-.026z"/>
            </svg>
            <span>Start Free Scan</span>
          </Link>

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <button
              onClick={logout}
              className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
