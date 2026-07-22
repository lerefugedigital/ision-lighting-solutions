"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { CadRequestModal } from "./CadRequestModal";

export interface FastTracksProps {
  locale: "en" | "fr";
  productName: string;
}

interface FastTrackText {
  header: string;
  cad: { title: string; subtitle: string };
  specs: { title: string; subtitle: string };
  sample: { title: string; subtitle: string };
}

const TEXT: Record<"en" | "fr", FastTrackText> = {
  en: {
    header: "Quick access based on your profile:",
    cad: { title: "CAD Files & 3D Models", subtitle: "STEP models for SolidWorks & CAD" },
    specs: { title: "Specifications & Formats", subtitle: "Dimensions, 24V power & PDF datasheets" },
    sample: { title: "Validate on Your Parts", subtitle: "Free lab testing & 48h turnaround" },
  },
  fr: {
    header: "Accès rapide selon votre profil :",
    cad: { title: "Fichiers CAO & Modèles 3D", subtitle: "Modèles STEP pour SolidWorks & CAO" },
    specs: { title: "Spécifications & Formats", subtitle: "Dimensions, alimentation 24V & fiches PDF" },
    sample: { title: "Valider sur Vos Pièces", subtitle: "Test gratuit en labo & prêt sous 48h" },
  },
};

const CARD_CLASSES =
  "flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-amber-500 hover:bg-amber-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-amber-500 dark:hover:bg-amber-950/20";

function CardTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <>
      <span aria-hidden="true" className="text-2xl leading-none">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</span>
        <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
      </span>
    </>
  );
}

export function FastTracks({ locale, productName }: FastTracksProps) {
  const [cadModalOpen, setCadModalOpen] = useState(false);
  const t = TEXT[locale];

  return (
    <div className="print:hidden">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.header}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => setCadModalOpen(true)} className={CARD_CLASSES}>
          <CardTitle icon="📐" title={t.cad.title} subtitle={t.cad.subtitle} />
        </button>

        <a href="#specifications-gamme" className={CARD_CLASSES}>
          <CardTitle icon="📄" title={t.specs.title} subtitle={t.specs.subtitle} />
        </a>

        <Link href={"/test-sur-echantillon" as never} className={CARD_CLASSES}>
          <CardTitle icon="🧪" title={t.sample.title} subtitle={t.sample.subtitle} />
        </Link>
      </div>

      <CadRequestModal
        locale={locale}
        productName={productName}
        isOpen={cadModalOpen}
        onClose={() => setCadModalOpen(false)}
      />
    </div>
  );
}
