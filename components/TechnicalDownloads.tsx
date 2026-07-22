"use client";

import { useState } from "react";
import { CadRequestModal } from "./CadRequestModal";
import { DatasheetDownloadModal } from "./DatasheetDownloadModal";
import { isDatasheetUnlocked, unlockDatasheet } from "@/lib/lead-gate";

export interface TechnicalDownloadsProps {
  locale: "en" | "fr";
  productName: string;
  /** Real PDF path from public/downloads, or null to fall back to the browser's print-to-PDF view. */
  datasheetHref: string | null;
  titleOverride?: string;
}

const TEXT = {
  en: {
    title: "Technical Documents",
    datasheetLabel: "Product Datasheet (PDF)",
    cadLabel: "Request the 3D Model (STEP)",
  },
  fr: {
    title: "Documents Techniques",
    datasheetLabel: "Datasheet Produit (PDF)",
    cadLabel: "Demander le modèle 3D (STEP)",
  },
} as const;

export function TechnicalDownloads({ locale, productName, datasheetHref, titleOverride }: TechnicalDownloadsProps) {
  const [cadModalOpen, setCadModalOpen] = useState(false);
  const [datasheetModalOpen, setDatasheetModalOpen] = useState(false);
  const t = TEXT[locale];

  const primaryButtonClasses =
    "flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400";

  function triggerDatasheetAction() {
    if (datasheetHref) {
      const link = document.createElement("a");
      link.href = datasheetHref;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  }

  function handleDatasheetClick() {
    if (isDatasheetUnlocked()) {
      triggerDatasheetAction();
    } else {
      setDatasheetModalOpen(true);
    }
  }

  function handleUnlocked() {
    unlockDatasheet();
    triggerDatasheetAction();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8 print:hidden">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{titleOverride ?? t.title}</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={handleDatasheetClick} className={primaryButtonClasses}>
          {t.datasheetLabel}
        </button>

        <button type="button" onClick={() => setCadModalOpen(true)} className={primaryButtonClasses}>
          {t.cadLabel}
        </button>
      </div>

      <DatasheetDownloadModal
        locale={locale}
        productName={productName}
        isOpen={datasheetModalOpen}
        onClose={() => setDatasheetModalOpen(false)}
        onUnlocked={handleUnlocked}
      />

      <CadRequestModal
        locale={locale}
        productName={productName}
        isOpen={cadModalOpen}
        onClose={() => setCadModalOpen(false)}
      />
    </section>
  );
}
