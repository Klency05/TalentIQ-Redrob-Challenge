import { DarkHorseCandidate } from '../lib/ranking';
import { Star } from 'lucide-react';

export function DarkHorseSpotlight({ candidate }: { candidate: DarkHorseCandidate }) {
  if (!candidate) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-2xl border border-teal-300 bg-gradient-to-br from-teal-50 via-white to-amber-50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 animate-pulse-glow">
            <Star className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Dark Horse Spotlight</h2>
            <p className="text-xs text-slate-500">Underrated candidate with breakout potential</p>
          </div>
        </div>
        <div className="text-sm text-slate-700">
          <span className="font-semibold">{candidate.name}</span> — {candidate.reasoning}
        </div>
        {candidate.strengths?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.strengths.map((s) => (
              <span
                key={s}
                className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
