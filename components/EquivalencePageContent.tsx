import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Segment } from "@/data/catalog";
import { EquivalenceTable, type EquivalenceRow, type EquivalenceTableLabels } from "./EquivalenceTable";
import { ContactForm } from "./ContactForm";
import { ReassuranceBar } from "./ReassuranceBar";

export interface EquivalenceRichContent {
  h1: string;
  lead: string;
  introTitle: string;
  introParagraph: string;
  tableLabels: EquivalenceTableLabels;
  rows: EquivalenceRow[];
  disclaimerNote: string;
  relatedTitle: string;
}

interface EquivalencePageContentProps {
  rich: EquivalenceRichContent | null;
  placeholderH1: string;
  placeholderComingSoon: string;
  relatedSegments: Segment[];
  locale: Locale;
}

export function EquivalencePageContent({
  rich,
  placeholderH1,
  placeholderComingSoon,
  relatedSegments,
  locale,
}: EquivalencePageContentProps) {
  if (!rich) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {placeholderH1}
        </h1>
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400 dark:border-slate-700">
          {placeholderComingSoon}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {rich.h1}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{rich.lead}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {rich.introTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{rich.introParagraph}</p>
      </section>

      <section className="mt-10">
        <EquivalenceTable rows={rich.rows} labels={rich.tableLabels} />
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">{rich.disclaimerNote}</p>
      </section>

      <div className="mt-14">
        <ContactForm locale={locale as "en" | "fr"} contextType="equivalence" subjectContext={rich.h1} />
      </div>

      {relatedSegments.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.relatedTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedSegments.map((segment) => (
              <li key={segment.slug}>
                <Link
                  href={segment.routeKey as never}
                  className="block rounded-lg border border-slate-200 p-4 text-sm text-slate-700 transition hover:border-amber-500 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-slate-100"
                >
                  {segment.content[locale].name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-14">
        <ReassuranceBar locale={locale as "en" | "fr"} variant="compact" />
      </div>
    </main>
  );
}
