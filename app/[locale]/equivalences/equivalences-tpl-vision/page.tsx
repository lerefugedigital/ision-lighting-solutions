import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildEquivalenceItemPageJsonLd } from "@/lib/jsonld";
import {
  TABLE_LABELS,
  ACTION_LABEL,
  LIGHT_TYPES,
  CRITERIA,
  VLS_ALTERNATIVES,
  DISCLAIMER_NOTE,
  RELATED_TITLE,
  RELATED_SLUGS,
  PLACEHOLDER_COMING_SOON,
  ELECTRICAL_TEXT,
  MECHANICAL_TEXT,
  AVAILABILITY_TEXT,
  SUPPORT_TEXT,
  buildEquivalenceHeadings,
  type RichLocale,
} from "@/lib/equivalence-shared-content";
import { EquivalencePageContent, type EquivalenceRichContent } from "@/components/EquivalencePageContent";
import type { EquivalenceRow } from "@/components/EquivalenceTable";

const ROUTE_KEY = "/equivalences/equivalences-tpl-vision";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-22";
const COMPETITOR_NAME = "TPL Vision";
const COMPETITOR_RANGE_LABEL = "TPL Vision — Essential / Expert";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "TPL Vision Equivalent: LED Lighting Alternatives | Vision Lighting",
    metaDescription:
      "Find the direct equivalent to your TPL Vision lighting (Essential Bar, M-TBAL...). Mechanical and electrical 24V M12 compatibility. Quote within 2h.",
  },
  fr: {
    metaTitle: "Équivalence TPL Vision : Alternatives Éclairage LED | Vision Lighting",
    metaDescription:
      "Trouvez l'équivalent direct à vos éclairages TPL Vision (Essential Bar, M-TBAL...). Compatibilité mécanique et électrique 24V M12. Devis sous 2h.",
  },
};

/** Named references only where explicitly known; generic range label otherwise (never a fabricated model code). */
const COMPETITOR_REFS: Record<RichLocale, [string, string, string, string]> = {
  en: ["Essential Bar", "M-TBAL", "TPL Vision — Dome Range", "TPL Vision — Coaxial Range"],
  fr: ["Essential Bar", "M-TBAL", "TPL Vision — Gamme Dômes", "TPL Vision — Gamme Coaxiale"],
};

function buildRows(locale: RichLocale): EquivalenceRow[] {
  return LIGHT_TYPES[locale].map((type, i) => ({
    key: type.routeKey,
    competitorRef: COMPETITOR_REFS[locale][i],
    vlsEquivalent: VLS_ALTERNATIVES[locale][i],
    formatSpec: CRITERIA[locale][i],
    actionHref: `${type.routeKey}#documents-techniques`,
    actionLabel: ACTION_LABEL[locale],
  }));
}

function buildRichContent(locale: RichLocale, h1: string, lead: string): EquivalenceRichContent {
  const headings = buildEquivalenceHeadings(locale, COMPETITOR_NAME);
  return {
    h1,
    lead,
    ...headings,
    electricalText: ELECTRICAL_TEXT[locale],
    mechanicalText: MECHANICAL_TEXT[locale],
    tableLabels: TABLE_LABELS[locale],
    rows: buildRows(locale),
    disclaimerNote: DISCLAIMER_NOTE[locale],
    availabilityText: AVAILABILITY_TEXT[locale],
    supportText: SUPPORT_TEXT[locale],
    relatedTitle: RELATED_TITLE[locale],
  };
}

const RICH_CONTENT: Record<RichLocale, EquivalenceRichContent> = {
  en: buildRichContent(
    "en",
    "Equivalences and Alternatives to TPL Vision Lighting",
    "Looking for an equivalent TPL Vision reference? This page cross-references TPL Vision's lighting families (Essential Bar, M-TBAL and more) with a compatible Vision Lighting Solutions alternative, for buyers securing dual sourcing on machine vision lighting."
  ),
  fr: buildRichContent(
    "fr",
    "Équivalences et Alternatives aux Éclairages TPL Vision",
    "Vous cherchez un équivalent à une référence TPL Vision ? Cette page fait correspondre les familles d'éclairage TPL Vision (Essential Bar, M-TBAL et autres) à une alternative Vision Lighting Solutions compatible, pour les acheteurs sécurisant un dual sourcing sur l'éclairage vision industrielle."
  ),
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
        competitorBrand: COMPETITOR_NAME,
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
