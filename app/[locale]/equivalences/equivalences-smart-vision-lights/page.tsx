import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildEquivalenceItemPageJsonLd } from "@/lib/jsonld";
import {
  TABLE_LABELS,
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

const ROUTE_KEY = "/equivalences/equivalences-smart-vision-lights";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const COMPETITOR_RANGE_LABEL = "Smart Vision Lights — L Series / RM Series";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Smart Vision Lights LED Equivalents | Vision Lighting",
    metaDescription:
      "Interoperability guide: compatible alternatives to Smart Vision Lights ranges for dual sourcing and supply chain continuity — get a quote today.",
  },
  fr: {
    metaTitle: "Équivalences Smart Vision Lights | Vision Lighting",
    metaDescription:
      "Guide d'interopérabilité : alternatives compatibles aux gammes Smart Vision Lights pour le dual sourcing — demandez votre étude de correspondance.",
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
    h1: "Smart Vision Lights Equivalents & Cross-References",
    lead: "Equivalences and compatible alternatives for Smart Vision Lights ranges — a technical cross-reference table for buyers securing dual sourcing on machine vision lighting.",
    introTitle: "Why Secure a Second Source for Your Lighting",
    introParagraph:
      "When a lighting reference goes out of stock or lead times stretch out, the inspection cell it feeds stops with it. Buyers running Smart Vision Lights equipment increasingly qualify a compatible second source in parallel — not to displace the incumbent supplier, but to protect lead times, gain pricing flexibility, and remove a single point of failure from the bill of materials. The table below maps Smart Vision Lights' product families to a compatible Vision Lighting Solutions alternative by physical and electrical characteristics.",
    tableLabels: TABLE_LABELS.en,
    rows: buildRows("en"),
    disclaimerNote: DISCLAIMER_NOTE.en,
    relatedTitle: RELATED_TITLE.en,
  },
  fr: {
    h1: "Équivalences et Correspondances aux Éclairages Smart Vision Lights",
    lead: "Équivalences et alternatives compatibles aux gammes Smart Vision Lights — table de correspondance technique pour les acheteurs sécurisant un dual sourcing sur l'éclairage vision industrielle.",
    introTitle: "Pourquoi Sécuriser une Seconde Source pour Votre Éclairage",
    introParagraph:
      "Quand une référence d'éclairage tombe en rupture ou que les délais s'allongent, c'est toute la cellule d'inspection qu'elle alimente qui s'arrête avec elle. Les acheteurs équipés en Smart Vision Lights qualifient de plus en plus une seconde source compatible en parallèle — non pour évincer le fournisseur en place, mais pour protéger les délais, gagner en flexibilité tarifaire et supprimer un point de défaillance unique de la nomenclature. Le tableau ci-dessous fait correspondre les familles de produits Smart Vision Lights à une alternative Vision Lighting Solutions compatible, sur la base de critères physiques et électriques.",
    tableLabels: TABLE_LABELS.fr,
    rows: buildRows("fr"),
    disclaimerNote: DISCLAIMER_NOTE.fr,
    relatedTitle: RELATED_TITLE.fr,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "equivalences-smart-vision-lights");
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "en" || locale === "fr") {
    const m = META[locale];
    return {
      title: { absolute: m.metaTitle },
      description: m.metaDescription,
      alternates: buildLanguageAlternates(ROUTE_KEY, locale),
    };
  }
  const fallback = findCatalogSegment()?.content[locale];
  return {
    title: fallback ? { absolute: fallback.metaTitle } : undefined,
    description: fallback?.metaDescription,
    alternates: buildLanguageAlternates(ROUTE_KEY, locale),
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
    ? buildEquivalenceItemPageJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        name: rich.h1,
        description: META[locale as RichLocale].metaDescription,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        competitorBrand: "Smart Vision Lights",
        competitorRanges: [COMPETITOR_RANGE_LABEL],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <EquivalencePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Smart Vision Lights Equivalents"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
      />
    </>
  );
}
