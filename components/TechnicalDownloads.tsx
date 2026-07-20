"use client";

import { useState } from "react";
import { CadRequestModal } from "./CadRequestModal";

export interface TechnicalDownloadsProps {
  locale: "en" | "fr";
  productName: string;
  /** Real PDF path from public/downloads, or null to show the "available on request" fallback. */
  datasheetHref: string | null;
}

const CONTACT_EMAIL = "sourcing@vision-lighting-solutions.com";

const TEXT = {
  en: {
    title: "Technical Documents",
    datasheetLabel: "Product Datasheet (PDF)",
    datasheetUnavailable: "Available on request",
    cadLabel: "3D CAD File (STEP / IGES)",
    datasheetSubjectPrefix: "Datasheet Request",
  },
  fr: {
    title: "Documents Techniques",
    datasheetLabel: "Datasheet Produit (PDF)",
    datasheetUnavailable: "Disponible sur demande",
    cadLabel: "Fichier CAD 3D (STEP / IGES)",
    datasheetSubjectPrefix: "Demande de Fiche Technique",
  },
} as const;

export function TechnicalDownloads({ locale, productName, datasheetHref }: TechnicalDownloadsProps) {
  const [cadModalOpen, setCadModalOpen] = useState(false);
  const t = TEXT[locale];

  const datasheetMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `[Vision Lighting Solutions] ${t.datasheetSubjectPrefix} - ${productName}`
  )}`;

  const primaryButtonClasses =
    "flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400";
  const secondaryButtonClasses =
    "flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-amber-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-slate-100";

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.title}</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {datasheetHref ? (
          <a href={datasheetHref} download className={primaryButtonClasses}>
            {t.datasheetLabel}
          </a>
        ) : (
          <a href={datasheetMailto} className={secondaryButtonClasses}>
            <span>{t.datasheetLabel}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{t.datasheetUnavailable}</span>
          </a>
        )}

        <button type="button" onClick={() => setCadModalOpen(true)} className={primaryButtonClasses}>
          {t.cadLabel}
        </button>
      </div>

      <CadRequestModal
        locale={locale}
        productName={productName}
        isOpen={cadModalOpen}
        onClose={() => setCadModalOpen(false)}
      />
    </section>
  );
}
