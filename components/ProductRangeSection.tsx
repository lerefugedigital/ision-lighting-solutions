"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { DatasheetDownloadModal } from "./DatasheetDownloadModal";
import { CadRequestModal } from "./CadRequestModal";
import { isDatasheetUnlocked, unlockDatasheet } from "@/lib/lead-gate";

export type BarLightSeriesCode = "BAR-STD" | "BAR-PWR" | "BAR-INOX";

export interface ProductRangeSectionProps {
  locale: "en" | "fr";
  /** Real per-series PDF paths from public/downloads, or null to fall back to the browser's print view. */
  datasheetHrefs?: Partial<Record<BarLightSeriesCode, string | null>>;
}

interface SpecRow {
  label: string;
  values: string;
}

interface SeriesInfo {
  code: BarLightSeriesCode;
  name: string;
  description: string;
}

interface RangeText {
  specsTitle: string;
  specsIntro: string;
  columnCharacteristic: string;
  columnOptions: string;
  specs: SpecRow[];
  seriesTitle: string;
  seriesIntro: string;
  series: SeriesInfo[];
  datasheetButton: string;
  cadButton: string;
  reassuranceTitle: string;
  reassuranceDescription: string;
  reassuranceButton: string;
}

const TEXT: Record<"en" | "fr", RangeText> = {
  en: {
    specsTitle: "Range Specifications & Variants",
    specsIntro:
      "Every bar light in the range is configured from the parameters below to match your application and camera.",
    columnCharacteristic: "Characteristic",
    columnOptions: "Available Variants",
    specs: [
      { label: "Available Lengths", values: "100 mm · 200 mm · 300 mm · 450 mm · 600 mm" },
      {
        label: "Wavelengths / Colors",
        values: "Red (630 nm) · Infrared (850 nm) · White (5700 K) · Blue (470 nm) · UV (365 nm / 395 nm)",
      },
      { label: "Operating Modes", values: "Continuous 24V DC · Strobe Overdrive (up to x5 intensity)" },
      { label: "Ingress Protection", values: "IP65 (Standard) · IP69K (Stainless Food-Grade Option)" },
      { label: "Connector", values: "M12 male, 5-pin (standardized wiring)" },
    ],
    seriesTitle: "The 3 Flagship Series",
    seriesIntro: "Pick the series matched to your line speed and environment, then request the datasheet or the 3D model.",
    series: [
      {
        code: "BAR-STD",
        name: "Standard 24V LED Bar Light",
        description: "Ideal for presence detection, code reading and standard grazing illumination.",
      },
      {
        code: "BAR-PWR",
        name: "Overdrive LED Bar Light",
        description: "Built for high-speed lines and short exposure times (< 1 ms).",
      },
      {
        code: "BAR-INOX",
        name: "IP69K 316L Stainless LED Bar Light",
        description: "For washdown, chemical, healthcare and food-processing environments.",
      },
    ],
    datasheetButton: "Datasheet (PDF)",
    cadButton: "3D Model (STEP)",
    reassuranceTitle: "Not sure which length or wavelength fits your camera?",
    reassuranceDescription:
      "Send us your parts — our engineers test the optimal bar light on your application in the lab and send back results within 48h.",
    reassuranceButton: "Test on Your Parts — 48h Turnaround",
  },
  fr: {
    specsTitle: "Caractéristiques & Déclinaisons de la Gamme",
    specsIntro:
      "Chaque barre LED de la gamme se configure à partir des paramètres ci-dessous pour s'adapter à votre application et à votre caméra.",
    columnCharacteristic: "Caractéristique",
    columnOptions: "Déclinaisons Disponibles",
    specs: [
      { label: "Longueurs Disponibles", values: "100 mm · 200 mm · 300 mm · 450 mm · 600 mm" },
      {
        label: "Longueurs d'Onde / Couleurs",
        values: "Rouge (630 nm) · Infrarouge (850 nm) · Blanc (5700 K) · Bleu (470 nm) · UV (365 nm / 395 nm)",
      },
      { label: "Modes de Fonctionnement", values: "Continu 24V DC · Strobe Overdrive (jusqu'à x5 d'intensité)" },
      { label: "Indices de Protection", values: "IP65 (Standard) · IP69K (Option Inox Agroalimentaire)" },
      { label: "Connectique", values: "M12 mâle 5 pôles (câblage standardisé)" },
    ],
    seriesTitle: "Les 3 Séries Phares",
    seriesIntro: "Choisissez la série adaptée à votre cadence et votre environnement, puis demandez la fiche technique ou le modèle 3D.",
    series: [
      {
        code: "BAR-STD",
        name: "Barre LED 24V Standard",
        description: "Idéale pour le contrôle de présence, la lecture de code et l'éclairage rasant standard.",
      },
      {
        code: "BAR-PWR",
        name: "Barre LED Overdrive",
        description: "Conçue pour les cadences rapides et les temps de pose brefs (< 1 ms).",
      },
      {
        code: "BAR-INOX",
        name: "Barre LED IP69K Inox 316L",
        description: "Pour environnements lavables, chimie, santé et agroalimentaire.",
      },
    ],
    datasheetButton: "Fiche Technique (PDF)",
    cadButton: "Modèle 3D (STEP)",
    reassuranceTitle: "Vous hésitez sur la longueur ou la couleur d'éclairage adaptée à votre caméra ?",
    reassuranceDescription:
      "Envoyez-nous vos pièces : nos ingénieurs testent la barre LED optimale pour votre application en laboratoire et vous retournent les résultats sous 48h.",
    reassuranceButton: "Tester sur Vos Pièces en Laboratoire — Prêt 48h",
  },
};

interface ModalTarget {
  open: boolean;
  series: SeriesInfo | null;
}

const MODAL_CLOSED: ModalTarget = { open: false, series: null };

export function ProductRangeSection({ locale, datasheetHrefs = {} }: ProductRangeSectionProps) {
  const t = TEXT[locale];
  const [datasheetModal, setDatasheetModal] = useState<ModalTarget>(MODAL_CLOSED);
  const [cadModal, setCadModal] = useState<ModalTarget>(MODAL_CLOSED);

  function triggerDatasheetAction(series: SeriesInfo) {
    const href = datasheetHrefs[series.code] ?? null;
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

  function handleDatasheetClick(series: SeriesInfo) {
    if (isDatasheetUnlocked()) {
      triggerDatasheetAction(series);
    } else {
      setDatasheetModal({ open: true, series });
    }
  }

  function handleUnlocked() {
    unlockDatasheet();
    if (datasheetModal.series) triggerDatasheetAction(datasheetModal.series);
  }

  function seriesFullName(series: SeriesInfo): string {
    return locale === "fr" ? `Série ${series.code} — ${series.name}` : `${series.code} Series — ${series.name}`;
  }

  const primaryButtonClasses =
    "flex-1 rounded-lg bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-slate-950 transition hover:bg-amber-400";
  const secondaryButtonClasses =
    "flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-amber-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-slate-100";

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.specsTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.specsIntro}</p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <th className="px-4 py-3">{t.columnCharacteristic}</th>
                <th className="px-4 py-3">{t.columnOptions}</th>
              </tr>
            </thead>
            <tbody>
              {t.specs.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="w-64 px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.label}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.seriesTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.seriesIntro}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {t.series.map((series) => (
            <div
              key={series.code}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {series.code}
              </span>
              <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{series.name}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{series.description}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => handleDatasheetClick(series)} className={primaryButtonClasses}>
                  {t.datasheetButton}
                </button>
                <button
                  type="button"
                  onClick={() => setCadModal({ open: true, series })}
                  className={secondaryButtonClasses}
                >
                  {t.cadButton}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.reassuranceTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.reassuranceDescription}</p>
        <Link
          href={"/test-sur-echantillon" as never}
          className="mt-4 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          {t.reassuranceButton}
        </Link>
      </div>

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
