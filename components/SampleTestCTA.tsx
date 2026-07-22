import { Link } from "@/i18n/navigation";

export interface SampleTestCTAProps {
  locale: "en" | "fr";
  titleOverride?: string;
}

const TEXT: Record<"en" | "fr", { title: string; description: string; button: string }> = {
  en: {
    title: "Not Sure About the Optical Result?",
    description:
      "Borrow a demo kit to test on your own bench, or send us a sample of your part for a free contrast analysis in our lab.",
    button: "Test on Sample or Borrow Equipment",
  },
  fr: {
    title: "Un Doute sur le Résultat Optique ?",
    description:
      "Empruntez une valise de démo pour tester sur votre propre banc, ou envoyez-nous un échantillon pour une analyse de contraste gratuite en laboratoire.",
    button: "Tester sur Échantillon ou Emprunter du Matériel",
  },
};

export function SampleTestCTA({ locale, titleOverride }: SampleTestCTAProps) {
  const t = TEXT[locale];

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{titleOverride ?? t.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.description}</p>
      <Link
        href={"/test-sur-echantillon" as never}
        className="mt-4 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
      >
        {t.button}
      </Link>
    </div>
  );
}
