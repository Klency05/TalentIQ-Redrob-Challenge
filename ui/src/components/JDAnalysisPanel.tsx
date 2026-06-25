import { JDAnalysis } from '../lib/ranking';
import { AlertTriangle } from 'lucide-react';

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function Meter({ score }: { score: number }) {
  const color = score >= 75 ? 'bg-teal-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span>JD Quality Score</span>
        <span className={score >= 75 ? 'text-teal-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600'}>
          {score}/100
        </span>
      </div>
      <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full ${color} origin-left animate-scaleX rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function JDAnalysisPanel({ analysis }: { analysis: JDAnalysis }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 animate-fadeIn">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">JD Analysis</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Hard Requirements</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.hardRequirements.map((r) => (
              <Pill key={r} className="bg-teal-50 text-teal-700 border border-teal-200">
                {r}
              </Pill>
            ))}
          </div>
          <Meter score={analysis.qualityScore} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Soft Signals</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.softSignals.map((s) => (
              <Pill key={s} className="bg-sky-50 text-sky-700 border border-sky-200">
                {s}
              </Pill>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Hidden Needs</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.hiddenNeeds.map((h) => (
              <Pill key={h} className="bg-violet-50 text-violet-700 border border-violet-200">
                {h}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {analysis.biasFlags.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Bias flags detected:</strong> {analysis.biasFlags.length} phrase(s) may deter qualified applicants. See Bias Audit below.
          </span>
        </div>
      )}
    </section>
  );
}
