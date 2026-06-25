import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">TalentIQ</h1>
          <p className="text-sm text-slate-400">AI-Powered Talent Intelligence Platform</p>
        </div>
        <nav className="ml-auto hidden sm:flex items-center gap-6 text-sm text-slate-300">
          <a className="hover:text-white transition-colors" href="#input">Rank</a>
          <a className="hover:text-white transition-colors" href="#results">Results</a>
          <a className="hover:text-white transition-colors" href="#report">Reports</a>
        </nav>
      </div>
    </header>
  );
}
