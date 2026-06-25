import { useState } from 'react';
import { Candidate, DEFAULT_CANDIDATES, DEFAULT_JD } from '../lib/ranking';
import { Loader2, ListChecks } from 'lucide-react';

type Props = {
  onRank: (jd: string, candidates: Candidate[]) => void;
  loading: boolean;
};

export function InputSection({ onRank, loading }: Props) {
  const [jd, setJd] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>(
    Array.from({ length: 5 }, () => ({ name: '', profile: '' }))
  );

  function updateCandidate(i: number, field: keyof Candidate, value: string) {
    setCandidates((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  return (
    <section id="input" className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Paste Job Description
          </label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={18}
            placeholder="Paste your job description here..."
            className="w-full resize-y rounded-xl border border-slate-300 p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Candidates (up to 5)</label>
          <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
            {candidates.map((c, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3">
                <input
                  value={c.name}
                  onChange={(e) => updateCandidate(i, 'name', e.target.value)}
                  placeholder={`Candidate ${i + 1} name`}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <textarea
                  value={c.background}
                  onChange={(e) => updateCandidate(i, 'background', e.target.value)}
                  rows={3}
                  placeholder="Background / profile summary..."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => onRank(jd, candidates)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ListChecks className="h-4 w-4" />
              Rank Candidates
            </>
          )}
        </button>
      </div>
    </section>
  );
}
