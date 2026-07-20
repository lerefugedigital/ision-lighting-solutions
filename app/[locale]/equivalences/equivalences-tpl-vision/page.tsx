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

const ROUTE_KEY = "/equivalences/equivalences-tpl-vision";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const COMPETITOR_RANGE_LABEL = "TPL Vision — Essential / Expert";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "TPL Vision Equivalents & Dual Sourcing | Vision Lighting",
    metaDescription:
      "Interoperability guide: compatible alternatives to TPL Vision lighting ranges for dual sourcing and supply chain continuity — request a quote.",
  },
  fr: {
    metaTitle: "Équivalences TPL Vision & Dual Sourcing | Vision Lighting",
    metaDescription:
      "Guide d'interopérabilité : alternatives compatibles aux gammes d'éclairage TPL Vision pour le dual sourcing et la continuité d'approvisionnement.",
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
    h1: "TPL Vision Lighting Equivalents & Cross-References",
    lead: "Equivalences and compatible alternatives for TPL Vision ranges — a technical cross-reference table for buyers securing dual sourcing on machine vision lighting.",
    introTitle: "Why Secure a Second Source for Your Lighting",
    introParagraph:
      "Machine vision lighting is a small line item that can stop an entire production line if it fails and no equivalent is on hand. Buyers increasingly qualify a second, compatible source for their TPL Vision references — not to replace the relationship, but to protect lead times, gain pricing flexibility, and avoid a single point of failure in the bill of materials. The table below maps TPL Vision's product families to a compatible Vision Lighting Solutions alternative by physical and electrical characteristics.",
    tableLabels: TABLE_LABELS.en,
    rows: buildRows("en"),
    disclaimerNote: DISCLAIMER_NOTE.en,
    relatedTitle: RELATED_TITLE.en,
  },
  fr: {
    h1: "Équivalences et Correspondances aux Éclairages TPL Vision",
    lead: "Équivalences et alternatives compatibles aux gammes TPL Vision — table de correspondance technique pour les acheteurs sécurisant un dual sourcing sur l'éclairage vision industrielle.",
    introTitle: "Pourquoi Sécuriser une Seconde Source pour Votre Éclairage",
    introParagraph:
      "L'éclairage de vision industrielle est une ligne de nomenclature modeste qui peut pourtant arrêter toute une ligne de production en cas de rupture sans équivalent disponible. De plus en plus d'acheteurs qualifient une seconde source compatible pour leurs références TPL Vision — non pour remplacer la relation existante, mais pour protéger les délais, gagner en flexibilité tarifaire et éviter un point de défaillance unique dans la nomenclature. Le tableau ci-dessous fait correspondre les familles de produits TPL Vision à une alternative Vision Lighting Solutions compatible, sur la base de critères physiques et électriques.",
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
  return catalog.segments.find((s) => s.slug === "equivalences-tpl-vision");
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
        competitorBrand: "TPL Vision",
        competitorRanges: [COMPETITOR_RANGE_LABEL],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <EquivalencePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "TPL Vision Equivalents"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
      />
    </>
  );
}
