import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Segment } from "@/data/catalog";
import { ProductConfigTable, type ProductConfigRow, type ProductConfigTableLabels } from "./ProductConfigTable";
import { BeamPatternViewer } from "./BeamPatternViewer";
import { TechnicalDownloads } from "./TechnicalDownloads";
import { ContactForm } from "./ContactForm";
import { SampleTestCTA } from "./SampleTestCTA";
import { ReassuranceBar } from "./ReassuranceBar";

export interface ProductRichContent {
  h1: string;
  lead: string;
  /** Optional wrapper H2 grouping introTitle + highlightsTitle as H3s underneath. Omit to keep both as top-level H2s. */
  principlesTitle?: string;
  introTitle: string;
  introParagraph: string;
  /** Optional native SVG schematic illustrating how this lighting format works. */
  diagram?: React.ReactNode;
  highlightsTitle: string;
  highlights: string[];
  tableLabels: ProductConfigTableLabels;
  rows: ProductConfigRow[];
  disclaimerNote: string;
  /** Optional "Gamme & Séries" block (variants table + series cards + reassurance CTA), built per-page. */
  rangeSection?: React.ReactNode;
  /** Optional interactive wavelength/contrast demo, built per-page. Omit if it's already nested inside rangeSection. */
  wavelengthSimulator?: React.ReactNode;
  /** Built per-page as JSX so it can embed contextual <Link>s to Silo 3 guides. */
  integrationContent: React.ReactNode;
  relatedTitle: string;
  /** Per-page title overrides for shared components — omit to keep each component's own default title. */
  beamPatternTitle?: string;
  technicalDownloadsTitle?: string;
  contactFormTitle?: string;
  sampleTestTitle?: string;
}

interface ProductPageContentProps {
  rich: ProductRichContent | null;
  placeholderH1: string;
  placeholderComingSoon: string;
  relatedSegments: Segment[];
  locale: Locale;
  /** Real PDF path from public/downloads, or null to show the "available on request" fallback. */
  datasheetHref?: string | null;
}

export function ProductPageContent({
  rich,
  placeholderH1,
  placeholderComingSoon,
  relatedSegments,
  locale,
  datasheetHref = null,
}: ProductPageContentProps) {
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
    <main className="mx-auto max-w-4xl px-6 py-16 print:px-0 print:py-0">
      <div className="mb-6 hidden border-b border-slate-300 pb-3 print:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Vision Lighting Solutions — Datasheet Technique
        </p>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {rich.h1}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{rich.lead}</p>

      {rich.principlesTitle ? (
        <section className="mt-10 print:hidden">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {rich.principlesTitle}
          </h2>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.introTitle}</h3>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{rich.introParagraph}</p>
          </div>

          {rich.diagram && <div className="mt-8">{rich.diagram}</div>}

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.highlightsTitle}</h3>
            <ul className="mt-3 space-y-2.5">
              {rich.highlights.map((item) => (
                <li key={item.slice(0, 24)} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <>
          <section className="mt-10 print:hidden">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {rich.introTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{rich.introParagraph}</p>
          </section>

          {rich.diagram && <div className="mt-8">{rich.diagram}</div>}

          <section className="mt-10 print:hidden">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {rich.highlightsTitle}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {rich.highlights.map((item) => (
                <li key={item.slice(0, 24)} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {rich.rangeSection && <section className="mt-10 print:hidden">{rich.rangeSection}</section>}

      <section className="mt-10 break-inside-avoid">
        <ProductConfigTable rows={rich.rows} labels={rich.tableLabels} />
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">{rich.disclaimerNote}</p>
      </section>

      <section className="mt-10 break-inside-avoid">
        <BeamPatternViewer locale={locale as "en" | "fr"} titleOverride={rich.beamPatternTitle} />
      </section>

      {rich.wavelengthSimulator && <section className="mt-10 print:hidden">{rich.wavelengthSimulator}</section>}

      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 print:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        {rich.integrationContent}
      </section>

      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start print:hidden">
        <TechnicalDownloads
          locale={locale as "en" | "fr"}
          productName={rich.h1}
          datasheetHref={datasheetHref}
          titleOverride={rich.technicalDownloadsTitle}
        />
        <ContactForm
          locale={locale as "en" | "fr"}
          contextType="product"
          subjectContext={rich.h1}
          titleOverride={rich.contactFormTitle}
        />
      </div>

      {relatedSegments.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-8 print:hidden dark:border-slate-800">
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

      <div className="mt-14 print:hidden">
        <SampleTestCTA locale={locale as "en" | "fr"} titleOverride={rich.sampleTestTitle} />
      </div>

      <div className="mt-10 print:hidden">
        <ReassuranceBar locale={locale as "en" | "fr"} variant="compact" />
      </div>
    </main>
  );
}
