import { RankedCandidate } from '../lib/ranking';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';

function SignalBar({ name, score }: { name: string; score: number }) {
  const color = score >= 80 ? 'bg-teal-500' : score >= 65 ? 'bg-sky-500' : 'bg-amber-500';
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{name}</span>
        <span className="font-medium text-slate-700">{score}</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full ${color} origin-left rounded-full transition-[width] duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function ResultCard({ candidate, index }: { candidate: RankedCandidate; index: number }) {
  const isGold = candidate.rank === 1;
  return (
    <div
      className={`relative rounded-2xl border p-5 shadow-sm animate-slideIn ${
        isGold
          ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-white'
          : 'border-slate-200 bg-white'
      }`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
              isGold ? 'bg-amber-400 text-white' : 'bg-slate-800 text-white'
            }`}
          >
            {isGold ? <Trophy className="h-4 w-4" /> : candidate.rank}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{candidate.name}</div>
            <div className="text-xs text-slate-500">{candidate.roleLabel}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-900 leading-none">{candidate.score}</div>
          <div className="mt-1 text-xs font-medium text-teal-600">
            {candidate.successProbability}% success
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {Object.entries(candidate.signalScores).map(([key, score]) => (
          <SignalBar
            key={key}
            name={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            score={score as number}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {candidate.matchedSignals.map((m) => (
          <span
            key={m}
            className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 border border-teal-200"
          >
            <CheckCircle2 className="h-3 w-3" /> {m}
          </span>
        ))}
        {candidate.gaps.map((g) => (
          <span
            key={g}
            className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-200"
          >
            <XCircle className="h-3 w-3" /> {g}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-600 leading-relaxed">{candidate.reasoning}</p>
    </div>
  );
}

export function RankedResults({ ranked }: { ranked: RankedCandidate[] }) {
  return (
    <section id="results" className="mx-auto max-w-6xl px-4 py-8 animate-fadeIn">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Ranked Candidates</h2>
      <div className="space-y-4">
        {ranked.map((c, i) => (
          <ResultCard key={c.name} candidate={c} index={i} />
        ))}
      </div>
    </section>
  );
}
