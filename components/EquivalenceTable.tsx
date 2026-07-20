import { Link } from "@/i18n/navigation";

export interface EquivalenceRow {
  lightTypeRouteKey: string;
  lightTypeLabel: string;
  competitorRange: string;
  interchangeabilityCriteria: string;
  vlsAlternative: string;
}

export interface EquivalenceTableLabels {
  columnType: string;
  columnCompetitor: string;
  columnCriteria: string;
  columnAlternative: string;
}

export function EquivalenceTable({ rows, labels }: { rows: EquivalenceRow[]; labels: EquivalenceTableLabels }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <th className="px-4 py-3">{labels.columnType}</th>
            <th className="px-4 py-3">{labels.columnCompetitor}</th>
            <th className="px-4 py-3">{labels.columnCriteria}</th>
            <th className="px-4 py-3">{labels.columnAlternative}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.lightTypeRouteKey} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
              <td className="px-4 py-3 font-medium">
                <Link
                  href={row.lightTypeRouteKey as never}
                  className="text-slate-900 hover:text-amber-600 hover:underline dark:text-slate-100 dark:hover:text-amber-400"
                >
                  {row.lightTypeLabel}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.competitorRange}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.interchangeabilityCriteria}</td>
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.vlsAlternative}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
