"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { DatasheetDownloadModal } from "./DatasheetDownloadModal";
import { CadRequestModal } from "./CadRequestModal";
import { isDatasheetUnlocked, unlockDatasheet } from "@/lib/lead-gate";

export interface RangeSpecRow {
  label: string;
  values: string;
}

export interface RangeSeriesInfo {
  code: string;
  name: string;
  description: string;
}

export interface RangeReassurance {
  title: string;
  description: string;
  button: string;
}

export interface RangeUseCases {
  title: string;
  intro?: string;
  items: string[];
}

export interface ProductRangeSectionProps {
  locale: "en" | "fr";
  /** Optional anchor id on the specs block, for in-page "jump to" links (e.g. hero fast-track cards). */
  sectionId?: string;
  specsTitle: string;
  specsIntro: string;
  columnCharacteristic: string;
  columnOptions: string;
  specs: RangeSpecRow[];
  /** Optional content rendered right after the specs table, before the series cards (e.g. an interactive demo). */
  afterSpecs?: React.ReactNode;
  seriesTitle: string;
  seriesIntro: string;
  series: RangeSeriesInfo[];
  datasheetButtonLabel: string;
  cadButtonLabel: string;
  /** Real per-series PDF paths from public/downloads, keyed by series code, or null to fall back to the browser's print view. */
  datasheetHrefs?: Record<string, string | null>;
  /** Optional decision-support CTA banner (e.g. link to the sample-testing tunnel). Omit to skip. */
  reassurance?: RangeReassurance;
  /** Optional "used for" applications section. Omit to skip. */
  useCases?: RangeUseCases;
}

interface ModalTarget {
  open: boolean;
  series: RangeSeriesInfo | null;
}

const MODAL_CLOSED: ModalTarget = { open: false, series: null };

export function ProductRangeSection({
  locale,
  sectionId,
  specsTitle,
  specsIntro,
  columnCharacteristic,
  columnOptions,
  specs,
  afterSpecs,
  seriesTitle,
  seriesIntro,
  series,
  datasheetButtonLabel,
  cadButtonLabel,
  datasheetHrefs = {},
  reassurance,
  useCases,
}: ProductRangeSectionProps) {
  const [datasheetModal, setDatasheetModal] = useState<ModalTarget>(MODAL_CLOSED);
  const [cadModal, setCadModal] = useState<ModalTarget>(MODAL_CLOSED);

  function triggerDatasheetAction(target: RangeSeriesInfo) {
    const href = datasheetHrefs[target.code] ?? null;
    if (href) {
      const link = document.createElement("a");
      link.href = href;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  }

  function handleDatasheetClick(target: RangeSeriesInfo) {
    if (isDatasheetUnlocked()) {
      triggerDatasheetAction(target);
    } else {
      setDatasheetModal({ open: true, series: target });
    }
  }

  function handleUnlocked() {
    unlockDatasheet();
    if (datasheetModal.series) triggerDatasheetAction(datasheetModal.series);
  }

  function seriesFullName(target: RangeSeriesInfo): string {
    return locale === "fr" ? `Série ${target.code} — ${target.name}` : `${target.code} Series — ${target.name}`;
  }

  function seriesHeading(target: RangeSeriesInfo): string {
    return locale === "fr" ? `Série ${target.code} : ${target.name}` : `${target.code} Series: ${target.name}`;
  }

  const primaryButtonClasses =
    "flex-1 rounded-lg bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-slate-950 transition hover:bg-amber-400";
  const secondaryButtonClasses =
    "flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-amber-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-slate-100";

  return (
    <div className="space-y-10">
      <div id={sectionId} className={sectionId ? "scroll-mt-20" : undefined}>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{specsTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{specsIntro}</p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <th className="px-4 py-3">{columnCharacteristic}</th>
                <th className="px-4 py-3">{columnOptions}</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="w-64 px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.label}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {afterSpecs}

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{seriesTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{seriesIntro}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {series.map((item) => (
            <div
              key={item.code}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {item.code}
              </span>
              <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{seriesHeading(item)}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => handleDatasheetClick(item)} className={primaryButtonClasses}>
                  {datasheetButtonLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setCadModal({ open: true, series: item })}
                  className={secondaryButtonClasses}
                >
                  {cadButtonLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {useCases && (
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{useCases.title}</h2>
          {useCases.intro && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{useCases.intro}</p>
          )}
          <ul className="mt-4 space-y-2.5">
            {useCases.items.map((item) => (
              <li key={item.slice(0, 24)} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {reassurance && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{reassurance.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{reassurance.description}</p>
          <Link
            href={"/test-sur-echantillon" as never}
            className="mt-4 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            {reassurance.button}
          </Link>
        </div>
      )}

      {datasheetModal.series && (
        <DatasheetDownloadModal
          locale={locale}
          productName={seriesFullName(datasheetModal.series)}
          isOpen={datasheetModal.open}
          onClose={() => setDatasheetModal(MODAL_CLOSED)}
          onUnlocked={handleUnlocked}
        />
      )}

      {cadModal.series && (
        <CadRequestModal
          locale={locale}
          productName={seriesFullName(cadModal.series)}
          isOpen={cadModal.open}
          onClose={() => setCadModal(MODAL_CLOSED)}
        />
      )}
    </div>
  );
}
