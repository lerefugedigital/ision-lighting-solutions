import { Link } from "@/i18n/navigation";

export interface EquivalenceFastTracksProps {
  locale: "en" | "fr";
}

interface CardText {
  title: string;
  subtitle: string;
}

interface EquivalenceFastTracksText {
  header: string;
  crossReference: CardText;
  compatibility: CardText;
  feasibility: CardText;
}

const TEXT: Record<"en" | "fr", EquivalenceFastTracksText> = {
  en: {
    header: "Quick access based on your profile:",
    crossReference: { title: "Find My Direct Reference", subtitle: "Cross-reference table below" },
    compatibility: { title: "Check M12 Compatibility", subtitle: "Pinout & 24V power supply" },
    feasibility: { title: "Request a Feasibility Study", subtitle: "Engineering review within 24h" },
  },
  fr: {
    header: "Accès rapide selon votre profil :",
    crossReference: { title: "Trouver ma Référence Directe", subtitle: "Table de correspondance ci-dessous" },
    compatibility: { title: "Vérifier la Compatibilité M12", subtitle: "Brochage & alimentation 24V" },
    feasibility: { title: "Demander une Étude de Faisabilité", subtitle: "Retour du bureau d'études sous 24h" },
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

export function EquivalenceFastTracks({ locale }: EquivalenceFastTracksProps) {
  const t = TEXT[locale];

  return (
    <div className="print:hidden">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.header}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <a href="#table-correspondance" className={CARD_CLASSES}>
          <CardTitle icon="🔎" title={t.crossReference.title} subtitle={t.crossReference.subtitle} />
        </a>

        <Link href={"/cablage-integration/brochage-m12-5-pins" as never} className={CARD_CLASSES}>
          <CardTitle icon="🔌" title={t.compatibility.title} subtitle={t.compatibility.subtitle} />
        </Link>

        <Link href={"/test-sur-echantillon" as never} className={CARD_CLASSES}>
          <CardTitle icon="📋" title={t.feasibility.title} subtitle={t.feasibility.subtitle} />
        </Link>
      </div>
    </div>
  );
}
