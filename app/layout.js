import "./globals.css";

export const metadata = {
  title: "AURA — AI-Powered Resume & Interview Coach",
  description: "100% On-Device, Privacy-First Career Acceleration Suite powered by local Qwen2.5 3B"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-50 flex flex-col min-h-screen">
        <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
                A
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-50">
                AURA <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 ml-2">Local AI</span>
              </span>
            </div>
            <nav className="flex items-center space-x-6 text-sm font-medium text-zinc-400">
              <a href="/" className="hover:text-orange-400 transition-colors text-zinc-50">Dashboard</a>
              <a href="/counselor" className="hover:text-orange-400 transition-colors">Counselor</a>
              <a href="/ats-audit" className="hover:text-orange-400 transition-colors">ATS Audit</a>
              <a href="/skillquest" className="hover:text-orange-400 transition-colors font-bold text-orange-400">SkillQuest</a>
              <a href="/interview" className="hover:text-orange-400 transition-colors">Video Arena</a>
              <a href="/roadmap" className="hover:text-orange-400 transition-colors">Quests</a>
              <a href="/resources" className="hover:text-orange-400 transition-colors">Resources</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">
          {children}
        </main>
        <footer className="border-t border-zinc-800 bg-zinc-900/50 py-4 text-center text-xs text-zinc-500">
          AURA Edge Career Engine &bull; 100% On-Device & Private &bull; Powered by Ollama Qwen2.5 3B
        </footer>
      </body>
    </html>
  );
}
