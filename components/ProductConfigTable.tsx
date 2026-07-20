export interface ProductConfigRow {
  fieldType: string;
  wavelengths: string;
  opticalWindow: string;
  operatingMode: string;
}

export interface ProductConfigTableLabels {
  columnFieldType: string;
  columnWavelengths: string;
  columnWindow: string;
  columnOperatingMode: string;
}

export function ProductConfigTable({ rows, labels }: { rows: ProductConfigRow[]; labels: ProductConfigTableLabels }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <th className="px-4 py-3">{labels.columnFieldType}</th>
            <th className="px-4 py-3">{labels.columnWavelengths}</th>
            <th className="px-4 py-3">{labels.columnWindow}</th>
            <th className="px-4 py-3">{labels.columnOperatingMode}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.fieldType} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.fieldType}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.wavelengths}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.opticalWindow}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.operatingMode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
