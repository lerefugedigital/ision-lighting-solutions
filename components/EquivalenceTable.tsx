import { Link } from "@/i18n/navigation";

export interface EquivalenceRow {
  /** Unique key for the row (not necessarily rendered). */
  key: string;
  competitorRef: string;
  vlsEquivalent: string;
  formatSpec: string;
  actionHref: string;
  actionLabel: string;
}

export interface EquivalenceTableLabels {
  columnCompetitorRef: string;
  columnVlsEquivalent: string;
  columnFormatSpec: string;
  columnAction: string;
}

export function EquivalenceTable({ rows, labels }: { rows: EquivalenceRow[]; labels: EquivalenceTableLabels }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <th className="px-4 py-3">{labels.columnCompetitorRef}</th>
            <th className="px-4 py-3">{labels.columnVlsEquivalent}</th>
            <th className="px-4 py-3">{labels.columnFormatSpec}</th>
            <th className="px-4 py-3">{labels.columnAction}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.competitorRef}</td>
              <td className="px-4 py-3 font-medium text-amber-700 dark:text-amber-400">{row.vlsEquivalent}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.formatSpec}</td>
              <td className="px-4 py-3">
                <Link
                  href={row.actionHref as never}
                  className="inline-flex whitespace-nowrap rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400"
                >
                  {row.actionLabel}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
