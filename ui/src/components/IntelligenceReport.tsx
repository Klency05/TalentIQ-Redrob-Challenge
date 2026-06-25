import { useState } from 'react';
import { RankedCandidate, TalentReport } from '../lib/ranking';
import { ChevronDown, TrendingUp, AlertOctagon, Compass, Info } from 'lucide-react';

type Props = {
  ranked: RankedCandidate[];
  talentReports: TalentReport[];
};

export function IntelligenceReport({ ranked, talentReports }: Props) {
  const lowerRanked = ranked.filter((c) => c.rank > 1);
  const [selectedName, setSelectedName] = useState(lowerRanked[0]?.name ?? '');
  const [open, setOpen] = useState(false);

  const selected = ranked.find((c) => c.name === selectedName) ?? lowerRanked[0];
  const report = talentReports.find((r) => r.name === selected?.name);

  if (!selected || !report) return null;

  const gapEntries = [
    { label: 'Hard', data: report.gaps.hardGap },
    { label: 'Signal', data: report.gaps.signalGap },
    { label: 'Context', data: report.gaps.contextGap },
  ];

  return (
    <section id="report" className="mx-auto max-w-6xl px-4 py-8 animate-fadeIn">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Talent Intelligence Report</h2>

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
        <p className="text-xs leading-relaxed text-blue-700">
          In a live platform, this report is automatically emailed to each candidate after the hiring decision is made — giving them a personal roadmap, not just a rejection.
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-1">Select a lower-ranked candidate</label>
        <div className="relative max-w-sm">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <span>#{selected.rank} — {selected.name}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
              {lowerRanked.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { setSelectedName(c.name); setOpen(false); }}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-teal-50 first:rounded-t-xl last:rounded-b-xl"
                >
                  #{c.rank} — {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-slate-700">Why Others Ranked Above</h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
            {report.whyOthersRankedAbove.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="h-4 w-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-slate-700">Gaps & Timeline</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {gapEntries.map(({ label, data }) => (
              <li key={label} className="border-l-2 border-rose-300 pl-3">
                <div className="font-medium text-slate-800">{label} gap</div>
                <div>{data.description}</div>
                <div className="mt-1 text-xs text-slate-500">{data.timeline}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-4 w-4 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-700">Better-Fit Role Suggestions</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {report.betterFitRoles.map((r, i) => (
              <li key={i}>
                <div className="font-medium text-slate-800">{r.title}</div>
                <div className="text-xs text-slate-500">{r.reason}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
