import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleJsonLd } from "@/lib/jsonld";
import {
  TABLE_LABELS,
  FORM_LABELS,
  LIGHT_TYPES,
  CRITERIA,
  VLS_ALTERNATIVES,
  DISCLAIMER_NOTE,
  RELATED_TITLE,
  RELATED_SLUGS,
  PLACEHOLDER_COMING_SOON,
  type RichLocale,
} from "@/lib/equivalence-shared-content";
import { EquivalencePageContent, type EquivalenceRichContent } from "@/components/EquivalencePageContent";
import type { EquivalenceRow } from "@/components/EquivalenceTable";

const ROUTE_KEY = "/equivalences/equivalences-advanced-illumination";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const COMPETITOR_RANGE_LABEL = "Advanced Illumination — AL / DL Series";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Advanced Illumination Equivalents & Dual Sourcing | Vision Lighting Solutions",
    metaDescription:
      "Interoperability guide: compatible alternatives to Advanced Illumination lighting ranges for dual sourcing and supply chain continuity.",
  },
  fr: {
    metaTitle: "Équivalences Advanced Illumination & Dual Sourcing | Vision Lighting Solutions",
    metaDescription:
      "Guide d'interopérabilité : alternatives compatibles aux gammes d'éclairage Advanced Illumination pour le dual sourcing et la continuité d'approvisionnement.",
  },
};

function buildRows(locale: RichLocale): EquivalenceRow[] {
  return LIGHT_TYPES[locale].map((type, i) => ({
    lightTypeRouteKey: type.routeKey,
    lightTypeLabel: type.label,
    competitorRange: COMPETITOR_RANGE_LABEL,
    interchangeabilityCriteria: CRITERIA[locale][i],
    vlsAlternative: VLS_ALTERNATIVES[locale][i],
  }));
}

const RICH_CONTENT: Record<RichLocale, EquivalenceRichContent> = {
  en: {
    h1: "Advanced Illumination Lighting Equivalents & Cross-References",
    lead: "Equivalences and compatible alternatives for Advanced Illumination ranges — a technical cross-reference table for buyers securing dual sourcing on machine vision lighting.",
    introTitle: "Why Secure a Second Source for Your Lighting",
    introParagraph:
      "A single unavailable lighting reference can idle an entire inspection cell while a replacement is sourced. Procurement teams running Advanced Illumination lighting increasingly qualify a compatible second source alongside it — not to displace the incumbent supplier, but to shorten lead times, add pricing leverage, and remove a single point of failure from the bill of materials. The table below maps Advanced Illumination's product families to a compatible Vision Lighting Solutions alternative by physical and electrical characteristics.",
    tableLabels: TABLE_LABELS.en,
    rows: buildRows("en"),
    disclaimerNote: DISCLAIMER_NOTE.en,
    formLabels: FORM_LABELS.en,
    formSubjectPrefix: "Equivalence request — Advanced Illumination reference",
    relatedTitle: RELATED_TITLE.en,
  },
  fr: {
    h1: "Équivalences et Correspondances aux Éclairages Advanced Illumination",
    lead: "Équivalences et alternatives compatibles aux gammes Advanced Illumination — table de correspondance technique pour les acheteurs sécurisant un dual sourcing sur l'éclairage vision industrielle.",
    introTitle: "Pourquoi Sécuriser une Seconde Source pour Votre Éclairage",
    introParagraph:
      "Une seule référence d'éclairage indisponible peut immobiliser toute une cellule d'inspection le temps de trouver un remplacement. Les équipes achats travaillant avec des éclairages Advanced Illumination qualifient de plus en plus une seconde source compatible en parallèle — non pour évincer le fournisseur en place, mais pour réduire les délais, gagner un levier tarifaire et supprimer un point de défaillance unique de la nomenclature. Le tableau ci-dessous fait correspondre les familles de produits Advanced Illumination à une alternative Vision Lighting Solutions compatible, sur la base de critères physiques et électriques.",
    tableLabels: TABLE_LABELS.fr,
    rows: buildRows("fr"),
    disclaimerNote: DISCLAIMER_NOTE.fr,
    formLabels: FORM_LABELS.fr,
    formSubjectPrefix: "Demande d'équivalence — référence Advanced Illumination",
    relatedTitle: RELATED_TITLE.fr,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "equivalences-advanced-illumination");
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "en" || locale === "fr") {
    const m = META[locale];
    return {
      title: { absolute: m.metaTitle },
      description: m.metaDescription,
      alternates: buildLanguageAlternates(ROUTE_KEY),
    };
  }
  const fallback = findCatalogSegment()?.content[locale];
  return {
    title: fallback ? { absolute: fallback.metaTitle } : undefined,
    description: fallback?.metaDescription,
    alternates: buildLanguageAlternates(ROUTE_KEY),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const relatedSegments = RELATED_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const isRich = locale === "en" || locale === "fr";
  const rich = isRich ? RICH_CONTENT[locale as RichLocale] : null;
  const fallback = findCatalogSegment()?.content[locale];

  const jsonLd = rich
    ? buildTechArticleJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        headline: rich.h1,
        description: META[locale as RichLocale].metaDescription,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        datePublished: PUBLISHED_DATE,
        dateModified: MODIFIED_DATE,
        mentions: ["Advanced Illumination"],
        keywords: ["dual sourcing", "Advanced Illumination", "machine vision lighting", "cross-reference"],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <EquivalencePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Advanced Illumination Equivalents"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
      />
    </>
  );
}
