import { JDAnalysis } from '../lib/ranking';
import { Pencil } from 'lucide-react';

export function BiasAudit({ analysis }: { analysis: JDAnalysis }) {
  if (!analysis.biasFlags.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 animate-fadeIn">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pencil className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-amber-800">JD Optimizer</h2>
          <span className="ml-auto rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
            {analysis.biasFlags.length} improvements found
          </span>
        </div>
        <ul className="space-y-3">
          {analysis.biasFlags.map((f, i) => (
            <li key={i} className="flex flex-col gap-1 rounded-xl bg-white/70 p-3 border border-amber-200">
              <span className="text-sm font-semibold text-amber-900">"{f.phrase}"</span>
              <span className="text-sm text-amber-800">{f.reason}</span>
              <span className="text-sm font-medium text-emerald-700">
                → Try: "{f.suggestion}"
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
