import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Segment } from "@/data/catalog";
import { ContactForm } from "./ContactForm";
import { SampleTestCTA } from "./SampleTestCTA";
import { CaseStudies } from "./CaseStudies";

export interface GuideRichContent {
  h1: string;
  lead: string;
  problemTitle: string;
  problemParagraph: string;
  solutionTitle: string;
  solutionParagraph: string;
  /** Optional native SVG schematic illustrating the optical principle just explained. */
  diagram?: ReactNode;
  wiringTitle: string;
  /** Built per-page as JSX so it can embed contextual <Link>s to Silo 3 guides. */
  wiringContent: ReactNode;
  productsTitle: string;
  toolsTitle: string;
}

interface GuidePageContentProps {
  rich: GuideRichContent | null;
  placeholderH1: string;
  placeholderComingSoon: string;
  productSegments: Segment[];
  toolSegments: Segment[];
  locale: Locale;
}

function SegmentLinkGrid({ segments, locale }: { segments: Segment[]; locale: Locale }) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
      {segments.map((segment) => (
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
  );
}

export function GuidePageContent({
  rich,
  placeholderH1,
  placeholderComingSoon,
  productSegments,
  toolSegments,
  locale,
}: GuidePageContentProps) {
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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {rich.h1}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{rich.lead}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {rich.problemTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{rich.problemParagraph}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {rich.solutionTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{rich.solutionParagraph}</p>
      </section>

      {rich.diagram && <div className="mt-8">{rich.diagram}</div>}

      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{rich.wiringTitle}</h2>
        <div className="mt-3">{rich.wiringContent}</div>
      </section>

      <div className="mt-14">
        <SampleTestCTA locale={locale as "en" | "fr"} />
      </div>

      <div id="contact-form" className="mt-8 scroll-mt-8">
        <ContactForm locale={locale as "en" | "fr"} contextType="optical_guide" subjectContext={rich.h1} />
      </div>

      {productSegments.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.productsTitle}</h2>
          <SegmentLinkGrid segments={productSegments} locale={locale} />
        </section>
      )}

      {toolSegments.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.toolsTitle}</h2>
          <SegmentLinkGrid segments={toolSegments} locale={locale} />
        </section>
      )}

      <div className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
        <CaseStudies locale={locale as "en" | "fr"} />
      </div>
    </main>
  );
}
