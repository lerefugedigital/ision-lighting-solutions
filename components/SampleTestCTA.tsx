export interface SampleTestCTAProps {
  locale: "en" | "fr";
  /** Anchor id of the contact form on the same page to scroll to. */
  targetId: string;
}

const TEXT: Record<"en" | "fr", { title: string; description: string; button: string }> = {
  en: {
    title: "Not Sure About the Optical Result?",
    description:
      "Send us a sample of your part. Our engineers run a free contrast test in our lab and send you back an image report.",
    button: "Request a Free Sample Test",
  },
  fr: {
    title: "Un Doute sur le Résultat Optique ?",
    description:
      "Envoyez-nous un échantillon de votre pièce. Nos ingénieurs réalisent un test de contraste gratuit en laboratoire et vous renvoient un rapport d'image.",
    button: "Demander un Test Gratuit",
  },
};

export function SampleTestCTA({ locale, targetId }: SampleTestCTAProps) {
  const t = TEXT[locale];

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.description}</p>
      <a
        href={`#${targetId}`}
        className="mt-4 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
      >
        {t.button}
      </a>
    </div>
  );
}
