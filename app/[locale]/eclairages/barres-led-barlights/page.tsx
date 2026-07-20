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
import { ProductPageContent, type ProductRichContent } from "@/components/ProductPageContent";
import type { ProductConfigRow } from "@/components/ProductConfigTable";
import { BarLightDiagram } from "@/components/diagrams/BarLightDiagram";

const ROUTE_KEY = "/eclairages/barres-led-barlights";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "LED Bar Lights | Machine Vision Illumination",
    metaDescription:
      "Industrial LED bar lights for machine vision: aluminum body, M12 connector, 24VDC electronics, uniform field illumination in White, Red, Blue or Infrared.",
  },
  fr: {
    metaTitle: "Barres LED Barlights | Éclairage Vision Industrielle",
    metaDescription:
      "Barres LED industrielles pour vision industrielle : corps aluminium, connecteur M12, électronique 24VDC, éclairage de champ uniforme en Blanc, Rouge, Bleu ou Infrarouge.",
  },
};

const ROWS: Record<RichLocale, ProductConfigRow[]> = {
  en: [
    {
      fieldType: "Standard Direct Beam",
      wavelengths: "White, Red, Blue, Infrared",
      opticalWindow: "From 50mm to 500mm active length (configuration dependent)",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
    {
      fieldType: "Wide Diffuse Beam",
      wavelengths: "White, Red, Infrared",
      opticalWindow: "From 50mm to 500mm active length (configuration dependent)",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
    {
      fieldType: "Narrow Focused Beam",
      wavelengths: "White, Red, Blue, Infrared",
      opticalWindow: "From 50mm to 500mm active length (configuration dependent)",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
  ],
  fr: [
    {
      fieldType: "Faisceau Direct Standard",
      wavelengths: "Blanc, Rouge, Bleu, Infrarouge",
      opticalWindow: "De 50mm à 500mm de longueur active (selon configuration)",
      operatingMode: "Continu ou Strobe/Overdrive",
    },
    {
      fieldType: "Faisceau Diffus Large",
      wavelengths: "Blanc, Rouge, Infrarouge",
      opticalWindow: "De 50mm à 500mm de longueur active (selon configuration)",
      operatingMode: "Continu ou Strobe/Overdrive",
    },
    {
      fieldType: "Faisceau Focalisé Étroit",
      wavelengths: "Blanc, Rouge, Bleu, Infrarouge",
      opticalWindow: "De 50mm à 500mm de longueur active (selon configuration)",
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
    h1: "LED Bar Lights for Machine Vision",
    lead: "Linear LED bar lights delivering uniform, high-output illumination across a wide flat field — the workhorse lighting format for line-scan and area-scan inspection.",
    introTitle: "What Is an LED Bar Light Used For?",
    introParagraph:
      "A bar light is a linear array of LEDs behind an optical diffuser, mounted at a direct or grazing angle to illuminate a flat or gently curved field of view. It's the default choice for conveyor-line inspection, label and print verification, and any application needing even illumination across a wide, elongated area — where a dome light would be used instead for reflective or curved parts, and a coaxial light for specular, mirror-like surfaces.",
    diagram: (
      <BarLightDiagram
        labels={{
          ariaLabel: "Diagram of an LED bar light: incident beam and reflection at equal angles into the camera",
          source: "LED Bar Light",
          camera: "Camera",
          surface: "Inspected Surface",
          angleEqual: "θ (incidence) = θ' (reflection)",
          caption: "Angle of incidence equals angle of reflection — the geometry behind every direct lighting setup.",
        }}
      />
    ),
    highlightsTitle: "Technical Highlights",
    highlights: [
      "Industrial design: aluminum body for heat dissipation, integrated M12 connector for a standardized wiring harness.",
      "Hardened 24VDC electronics built for continuous production-line duty.",
      "Uniform light output across the full bar length via an opal diffuser, minimizing hot spots.",
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
    h1: "Barres LED (Barlights) pour la Vision Industrielle",
    lead: "Barres LED linéaires délivrant un éclairage uniforme et haute intensité sur un champ plat et large — le format d'éclairage de référence pour l'inspection en ligne et en zone.",
    introTitle: "À Quoi Sert une Barre LED ?",
    introParagraph:
      "Une barre LED est un alignement linéaire de LED derrière un diffuseur optique, monté en incidence directe ou rasante pour éclairer un champ de vision plat ou légèrement courbe. C'est le choix par défaut pour l'inspection sur ligne de convoyage, la vérification d'étiquettes et d'impression, et toute application nécessitant un éclairage homogène sur une zone large et allongée — là où un dôme diffus serait plutôt utilisé pour des pièces réfléchissantes ou courbes, et un éclairage coaxial pour des surfaces spéculaires de type miroir.",
    diagram: (
      <BarLightDiagram
        labels={{
          ariaLabel: "Schéma d'une barre LED : faisceau incident et réflexion à angles égaux vers la caméra",
          source: "Barre LED",
          camera: "Caméra",
          surface: "Surface Inspectée",
          angleEqual: "θ (incidence) = θ' (réflexion)",
          caption: "L'angle d'incidence égale l'angle de réflexion — la géométrie derrière tout montage en éclairage direct.",
        }}
      />
    ),
    highlightsTitle: "Points Forts Techniques",
    highlights: [
      "Conception industrielle : corps en aluminium pour la dissipation thermique, connecteur M12 intégré pour un câblage standardisé.",
      "Électronique durcie 24VDC conçue pour un fonctionnement continu en environnement de production.",
      "Éclairage homogène sur toute la longueur de la barre grâce à un diffuseur opale, sans point chaud.",
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
  return catalog.segments.find((s) => s.slug === "barres-led-barlights");
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
    ? buildProductModelJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        name: rich.h1,
        description: META[locale as RichLocale].metaDescription,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        category: "Machine Vision LED Bar Lights",
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
        placeholderH1={fallback?.h1 ?? "LED Bar Lights"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
      />
    </>
  );
}
