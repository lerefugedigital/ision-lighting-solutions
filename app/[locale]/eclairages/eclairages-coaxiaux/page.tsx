import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildProductModelJsonLd } from "@/lib/jsonld";
import {
  TABLE_LABELS,
  DISCLAIMER_NOTE,
  RELATED_TITLE,
  RELATED_SLUGS,
  PLACEHOLDER_COMING_SOON,
  type RichLocale,
} from "@/lib/product-shared-content";
import { getDatasheetHref } from "@/lib/technical-downloads";
import { ProductPageContent, type ProductRichContent } from "@/components/ProductPageContent";
import type { ProductConfigRow } from "@/components/ProductConfigTable";
import { CoaxialDiagram } from "@/components/diagrams/CoaxialDiagram";

const PRODUCT_SLUG = "eclairages-coaxiaux";
const ROUTE_KEY = "/eclairages/eclairages-coaxiaux";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Coaxial LED Lighting | Specular Surface Machine Vision",
    metaDescription:
      "Industrial coaxial LED lighting: aluminum housing, M12 connector, 24VDC electronics, homogeneous on-axis illumination for specular and etched surfaces.",
  },
  fr: {
    metaTitle: "Éclairage Coaxial LED | Vision sur Surfaces Spéculaires",
    metaDescription:
      "Éclairage coaxial LED industriel : corps aluminium, connecteur M12, électronique 24VDC, éclairage homogène dans l'axe optique pour surfaces spéculaires et gravées.",
  },
};

const ROWS: Record<RichLocale, ProductConfigRow[]> = {
  en: [
    {
      fieldType: "Standard Coaxial Field",
      wavelengths: "White, Red, Blue, Infrared",
      opticalWindow: "Working distance and field diameter dependent on configuration — available on request",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
    {
      fieldType: "Extended Working-Distance Coaxial",
      wavelengths: "White, Red, Infrared",
      opticalWindow: "Working distance and field diameter dependent on configuration — available on request",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
  ],
  fr: [
    {
      fieldType: "Champ Coaxial Standard",
      wavelengths: "Blanc, Rouge, Bleu, Infrarouge",
      opticalWindow: "Distance de travail et diamètre du champ selon configuration — disponibles sur demande",
      operatingMode: "Continu ou Strobe/Overdrive",
    },
    {
      fieldType: "Coaxial Longue Distance de Travail",
      wavelengths: "Blanc, Rouge, Infrarouge",
      opticalWindow: "Distance de travail et diamètre du champ selon configuration — disponibles sur demande",
      operatingMode: "Continu ou Strobe/Overdrive",
    },
  ],
};

function IntegrationContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Consultez notre{" "}
        <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          guide de calcul Overdrive
        </Link>{" "}
        pour optimiser l&apos;intensité de ce produit, et notre{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>{" "}
        pour son intégration électrique.
      </p>
    );
  }
  return (
    <p>
      See our{" "}
      <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        overdrive calculation guide
      </Link>{" "}
      to optimize this product&apos;s intensity, and our{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>{" "}
      for its electrical integration.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, ProductRichContent> = {
  en: {
    h1: "Coaxial Lighting for Specular & Etched Surfaces",
    lead: "Light projected through a beamsplitter along the camera's exact optical axis — the reference format for revealing defects, engravings and codes on shiny or mirror-like parts.",
    introTitle: "What Is Coaxial Lighting Used For?",
    introParagraph:
      "Coaxial lighting sends light through a beamsplitter so it travels along precisely the same axis as the camera's lens. Only surfaces perpendicular to that axis reflect light straight back into the lens — flat areas appear bright and uniform, while any scratch, engraving, dent or laser-marked code that breaks that perpendicularity appears dark by contrast. That makes it the reference choice for flat, mirror-like or etched metal parts, where a dome light (built for curved or irregular reflective surfaces) or a bar light (built for flat matte surfaces) would instead wash the same defects out.",
    diagram: (
      <CoaxialDiagram
        labels={{
          ariaLabel: "Diagram of coaxial lighting: a beamsplitter aligns the light source with the camera's optical axis",
          source: "Light Source",
          beamsplitter: "Beamsplitter (45°)",
          camera: "Camera",
          object: "Object",
          caption: "The beamsplitter aligns the light source with the camera's own optical axis.",
        }}
      />
    ),
    highlightsTitle: "Technical Highlights",
    highlights: [
      "Integrated beamsplitter directing light exactly along the camera's optical axis.",
      "Compact industrial housing, integrated M12 connector, hardened 24VDC electronics.",
      "Homogeneous coaxial field, free of the mounting-angle hot spots common with off-axis lighting.",
      "Multiple LED wavelength options: White, Red, Blue, Infrared (availability depends on configuration).",
      "Compatible with continuous and strobe/overdrive operation for high-speed lines.",
    ],
    tableLabels: TABLE_LABELS.en,
    rows: ROWS.en,
    disclaimerNote: DISCLAIMER_NOTE.en,
    integrationContent: <IntegrationContent locale="en" />,
    relatedTitle: RELATED_TITLE.en,
  },
  fr: {
    h1: "Éclairages Coaxiaux pour Surfaces Spéculaires et Gravées",
    lead: "Lumière projetée à travers un diviseur optique dans l'axe optique exact de la caméra — le format de référence pour révéler défauts, gravures et codes sur des pièces brillantes ou de type miroir.",
    introTitle: "À Quoi Sert un Éclairage Coaxial ?",
    introParagraph:
      "L'éclairage coaxial envoie la lumière à travers un diviseur optique de sorte qu'elle parcoure exactement le même axe que l'objectif de la caméra. Seules les surfaces perpendiculaires à cet axe renvoient la lumière directement vers l'objectif — les zones plates apparaissent lumineuses et uniformes, tandis qu'une rayure, une gravure, un choc ou un code marqué au laser qui rompt cette perpendicularité apparaît sombre par contraste. C'est ce qui en fait le choix de référence pour les pièces métalliques plates, de type miroir ou gravées, là où un dôme diffus (conçu pour les surfaces réfléchissantes courbes ou irrégulières) ou une barre LED (conçue pour les surfaces plates mates) effaceraient au contraire ces mêmes défauts.",
    diagram: (
      <CoaxialDiagram
        labels={{
          ariaLabel: "Schéma de l'éclairage coaxial : un diviseur optique aligne la source lumineuse sur l'axe optique de la caméra",
          source: "Source Lumineuse",
          beamsplitter: "Diviseur Optique (45°)",
          camera: "Caméra",
          object: "Objet",
          caption: "Le diviseur optique aligne la source lumineuse sur l'axe optique propre de la caméra.",
        }}
      />
    ),
    highlightsTitle: "Points Forts Techniques",
    highlights: [
      "Diviseur optique intégré dirigeant la lumière exactement dans l'axe optique de la caméra.",
      "Boîtier industriel compact, connecteur M12 intégré, électronique durcie 24VDC.",
      "Champ coaxial homogène, sans les points chauds liés à l'angle de montage courants avec un éclairage hors axe.",
      "Plusieurs options de longueur d'onde LED : Blanc, Rouge, Bleu, Infrarouge (disponibilité selon configuration).",
      "Compatible fonctionnement continu et stroboscopique/overdrive pour les lignes à cadence élevée.",
    ],
    tableLabels: TABLE_LABELS.fr,
    rows: ROWS.fr,
    disclaimerNote: DISCLAIMER_NOTE.fr,
    integrationContent: <IntegrationContent locale="fr" />,
    relatedTitle: RELATED_TITLE.fr,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "eclairages-coaxiaux");
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
  const datasheetHref = rich ? getDatasheetHref(PRODUCT_SLUG, locale as RichLocale) : null;
  const fallback = findCatalogSegment()?.content[locale];

  const jsonLd = rich
    ? buildProductModelJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        name: rich.h1,
        description: META[locale as RichLocale].metaDescription,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        category: "Machine Vision Coaxial Lighting",
        additionalProperties: [
          { name: "Power Supply", value: "24VDC industrial" },
          { name: "Body Material", value: "Aluminum" },
          { name: "Connector", value: "M12, 5-pin" },
          { name: "Available Wavelengths", value: "White, Red, Blue, Infrared (configuration dependent)" },
        ],
        configurations: ROWS[locale as RichLocale].map((r) => ({
          name: r.fieldType,
          wavelengths: r.wavelengths,
          opticalWindow: r.opticalWindow,
          operatingMode: r.operatingMode,
        })),
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <ProductPageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Coaxial Lighting"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
        datasheetHref={datasheetHref}
      />
    </>
  );
}
