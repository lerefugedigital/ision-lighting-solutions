import { Link } from "@/i18n/navigation";

export interface WiringFastTracksProps {
  locale: "en" | "fr";
}

interface CardText {
  title: string;
  subtitle: string;
}

interface WiringFastTracksText {
  header: string;
  pinout: CardText;
  strobe: CardText;
  support: CardText;
}

const TEXT: Record<"en" | "fr", WiringFastTracksText> = {
  en: {
    header: "Quick access based on your profile:",
    pinout: { title: "M12 Pinout Diagram", subtitle: "Interactive 5-pin wiring" },
    strobe: { title: "Strobe / Overdrive Trigger", subtitle: "Duty cycle calculator" },
    support: { title: "Direct Wiring Support", subtitle: "An engineer answers you" },
  },
  fr: {
    header: "Accès rapide selon votre profil :",
    pinout: { title: "Schéma Pinout M12", subtitle: "Câblage 5 broches interactif" },
    strobe: { title: "Trigger Strobe / Overdrive", subtitle: "Calculateur de rapport cyclique" },
    support: { title: "Support Câblage Direct", subtitle: "Un ingénieur vous répond" },
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

export function WiringFastTracks({ locale }: WiringFastTracksProps) {
  const t = TEXT[locale];

  return (
    <div className="print:hidden">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.header}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Link href={"/cablage-integration/brochage-m12-5-pins" as never} className={CARD_CLASSES}>
          <CardTitle icon="📐" title={t.pinout.title} subtitle={t.pinout.subtitle} />
        </Link>

        <Link href={"/cablage-integration/eclairage-stroboscopique-overdrive" as never} className={CARD_CLASSES}>
          <CardTitle icon="⚡" title={t.strobe.title} subtitle={t.strobe.subtitle} />
        </Link>

        <a href="#contact-form" className={CARD_CLASSES}>
          <CardTitle icon="🛠️" title={t.support.title} subtitle={t.support.subtitle} />
        </a>
      </div>
    </div>
  );
}
