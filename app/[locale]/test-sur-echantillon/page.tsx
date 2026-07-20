import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { TestSampleTunnel } from "@/components/TestSampleTunnel";
import { ReassuranceBar } from "@/components/ReassuranceBar";

const ROUTE_KEY = "/test-sur-echantillon";

const META: Record<Locale, { metaTitle: string; metaDescription: string; h1: string; lead: string }> = {
  en: {
    metaTitle: "Sample Test & Demo Loan Request | Vision Lighting Solutions",
    metaDescription:
      "Borrow a demo lighting kit within 48h or send us a sample for a free optical lab analysis with a complete image report — request yours today.",
    h1: "Validate your optical feasibility before buying — No commitment",
    lead: "Borrow a demo lighting kit within 48h, or get a full lab study on your own parts with an image report.",
  },
  fr: {
    metaTitle: "Test sur Échantillon & Prêt de Matériel | Vision Lighting",
    metaDescription:
      "Empruntez une valise de démonstration sous 48h ou envoyez-nous un échantillon pour une analyse optique gratuite en laboratoire avec rapport d'images.",
    h1: "Validez votre faisabilité optique avant achat — Sans engagement",
    lead: "Prêt de matériel de démonstration sous 48h ou étude complète sur vos pièces en laboratoire avec rapport d'images.",
  },
  de: {
    metaTitle: "Musterprüfung & Testgerät Anfragen | Vision Lighting Solutions",
    metaDescription: "Leihen Sie ein Demo-Kit oder senden Sie uns ein Muster für einen kostenlosen Labortest.",
    h1: "Validieren Sie Ihre optische Machbarkeit vor dem Kauf — Unverbindlich",
    lead: "Kontaktieren Sie unser Team, um ein Demo-Kit auszuleihen oder ein Muster zur Analyse einzusenden.",
  },
  it: {
    metaTitle: "Richiedi un Test su Campione o un Kit Demo | Vision Lighting Solutions",
    metaDescription: "Prendi in prestito un kit demo o inviaci un campione per un'analisi di laboratorio gratuita.",
    h1: "Valida la tua fattibilità ottica prima dell'acquisto — Senza impegno",
    lead: "Contatta il nostro team per prendere in prestito un kit demo o inviare un campione per un'analisi.",
  },
};

const PLACEHOLDER_COMING_SOON: Record<"de" | "it", string> = {
  de: "Das Anfrageformular ist in Kürze auf Deutsch verfügbar. Bitte wechseln Sie oben zur englischen oder französischen Version.",
  it: "Il modulo di richiesta sarà presto disponibile in italiano. Passa alla versione inglese o francese qui sopra.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale];
  return {
    title: { absolute: m.metaTitle },
    description: m.metaDescription,
    alternates: buildLanguageAlternates(ROUTE_KEY, locale),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const m = META[locale];
  const isRich = locale === "en" || locale === "fr";

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{m.h1}</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{m.lead}</p>

      <div className="mt-10">
        {isRich ? (
          <TestSampleTunnel locale={locale} />
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400 dark:border-slate-700">
            {PLACEHOLDER_COMING_SOON[locale as "de" | "it"]}
          </p>
        )}
      </div>

      {isRich && (
        <div className="mt-14">
          <ReassuranceBar locale={locale} variant="compact" />
        </div>
      )}
    </main>
  );
}
