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
import { BarLightDiagram } from "@/components/diagrams/BarLightDiagram";
import { ProductRangeSection, type ProductRangeSectionProps } from "@/components/ProductRangeSection";
import { WavelengthContrastSimulator } from "@/components/WavelengthContrastSimulator";
import { FastTracks } from "@/components/FastTracks";

type BarLightSeriesCode = "BAR-STD" | "BAR-PWR" | "BAR-INOX";

const SERIES_SLUGS: Record<BarLightSeriesCode, string> = {
  "BAR-STD": "barres-led-barlights-bar-std",
  "BAR-PWR": "barres-led-barlights-bar-pwr",
  "BAR-INOX": "barres-led-barlights-bar-inox",
};

type RangeContent = Omit<ProductRangeSectionProps, "locale" | "datasheetHrefs">;

const RANGE_CONTENT: Record<RichLocale, RangeContent> = {
  en: {
    specsTitle: "Range Specifications & Variants",
    specsIntro:
      "Every bar light in the range is configured from the parameters below to match your application and camera.",
    columnCharacteristic: "Characteristic",
    columnOptions: "Available Variants",
    specs: [
      { label: "Available Lengths", values: "100 mm · 200 mm · 300 mm · 450 mm · 600 mm" },
      {
        label: "Wavelengths / Colors",
        values: "Red (630 nm) · Infrared (850 nm) · White (5700 K) · Blue (470 nm) · UV (365 nm / 395 nm)",
      },
      { label: "Operating Modes", values: "Continuous 24V DC · Strobe Overdrive (up to x5 intensity)" },
      { label: "Ingress Protection", values: "IP65 (Standard) · IP69K (Stainless Food-Grade Option)" },
      { label: "Connector", values: "M12 male, 5-pin (standardized wiring)" },
    ],
    seriesTitle: "The 3 Flagship Series",
    seriesIntro: "Pick the series matched to your line speed and environment, then request the datasheet or the 3D model.",
    series: [
      {
        code: "BAR-STD",
        name: "Standard 24V LED Bar Light",
        description: "Ideal for presence detection, code reading and standard grazing illumination.",
      },
      {
        code: "BAR-PWR",
        name: "Overdrive LED Bar Light",
        description: "Built for high-speed lines and short exposure times (< 1 ms).",
      },
      {
        code: "BAR-INOX",
        name: "IP69K 316L Stainless LED Bar Light",
        description: "For washdown, chemical, healthcare and food-processing environments.",
      },
    ],
    datasheetButtonLabel: "Datasheet (PDF)",
    cadButtonLabel: "3D Model (STEP)",
    reassurance: {
      title: "Not sure which length or wavelength fits your camera?",
      description:
        "Send us your parts — our engineers test the optimal bar light on your application in the lab and send back results within 48h.",
      button: "Test on Your Parts — 48h Turnaround",
    },
  },
  fr: {
    specsTitle: "Caractéristiques & Déclinaisons de la Gamme",
    specsIntro:
      "Chaque barre LED de la gamme se configure à partir des paramètres ci-dessous pour s'adapter à votre application et à votre caméra.",
    columnCharacteristic: "Caractéristique",
    columnOptions: "Déclinaisons Disponibles",
    specs: [
      { label: "Longueurs Disponibles", values: "100 mm · 200 mm · 300 mm · 450 mm · 600 mm" },
      {
        label: "Longueurs d'Onde / Couleurs",
        values: "Rouge (630 nm) · Infrarouge (850 nm) · Blanc (5700 K) · Bleu (470 nm) · UV (365 nm / 395 nm)",
      },
      { label: "Modes de Fonctionnement", values: "Continu 24V DC · Strobe Overdrive (jusqu'à x5 d'intensité)" },
      { label: "Indices de Protection", values: "IP65 (Standard) · IP69K (Option Inox Agroalimentaire)" },
      { label: "Connectique", values: "M12 mâle 5 pôles (câblage standardisé)" },
    ],
    seriesTitle: "Les 3 Séries Phares",
    seriesIntro: "Choisissez la série adaptée à votre cadence et votre environnement, puis demandez la fiche technique ou le modèle 3D.",
    series: [
      {
        code: "BAR-STD",
        name: "Barre LED 24V Standard",
        description: "Idéale pour le contrôle de présence, la lecture de code et l'éclairage rasant standard.",
      },
      {
        code: "BAR-PWR",
        name: "Barre LED Overdrive",
        description: "Conçue pour les cadences rapides et les temps de pose brefs (< 1 ms).",
      },
      {
        code: "BAR-INOX",
        name: "Barre LED IP69K Inox 316L",
        description: "Pour environnements lavables, chimie, santé et agroalimentaire.",
      },
    ],
    datasheetButtonLabel: "Fiche Technique (PDF)",
    cadButtonLabel: "Modèle 3D (STEP)",
    reassurance: {
      title: "Vous hésitez sur la longueur ou la couleur d'éclairage adaptée à votre caméra ?",
      description:
        "Envoyez-nous vos pièces : nos ingénieurs testent la barre LED optimale pour votre application en laboratoire et vous retournent les résultats sous 48h.",
      button: "Tester sur Vos Pièces en Laboratoire — Prêt 48h",
    },
  },
};

const PRODUCT_SLUG = "barres-led-barlights";
const ROUTE_KEY = "/eclairages/barres-led-barlights";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "LED Bar Lights | Industrial Machine Vision Illumination",
    metaDescription:
      "Industrial LED bar lights: aluminum body, M12 connector, 24VDC electronics, uniform field illumination in White, Red, Blue or IR — get a quote.",
  },
  fr: {
    metaTitle: "Barres LED Barlights | Éclairage Vision Industrielle",
    metaDescription:
      "Barres LED industrielles : corps aluminium, connecteur M12, électronique 24VDC, éclairage uniforme en Blanc, Rouge, Bleu ou IR — demandez un devis.",
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
        pour son intégration électrique. Vous remplacez une référence d'une autre marque ? Consultez notre{" "}
        <Link href="/equivalences" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          table d'équivalences et de dual sourcing
        </Link>{" "}
        pour identifier l'alternative compatible.
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
      for its electrical integration. Replacing a reference from another brand? See our{" "}
      <Link href="/equivalences" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        brand equivalence and dual sourcing table
      </Link>{" "}
      to find the compatible alternative.
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
  const datasheetHref = isRich ? getDatasheetHref(PRODUCT_SLUG, locale as RichLocale) : null;
  const fallback = findCatalogSegment()?.content[locale];

  const rich = isRich
    ? {
        ...RICH_CONTENT[locale as RichLocale],
        heroFastTracks: (
          <FastTracks locale={locale as RichLocale} productName={RICH_CONTENT[locale as RichLocale].h1} />
        ),
        rangeSection: (
          <ProductRangeSection
            locale={locale as RichLocale}
            sectionId="specifications-gamme"
            {...RANGE_CONTENT[locale as RichLocale]}
            datasheetHrefs={{
              "BAR-STD": getDatasheetHref(SERIES_SLUGS["BAR-STD"], locale as RichLocale),
              "BAR-PWR": getDatasheetHref(SERIES_SLUGS["BAR-PWR"], locale as RichLocale),
              "BAR-INOX": getDatasheetHref(SERIES_SLUGS["BAR-INOX"], locale as RichLocale),
            }}
          />
        ),
        wavelengthSimulator: <WavelengthContrastSimulator locale={locale as RichLocale} />,
      }
    : null;

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
        datasheetHref={datasheetHref}
      />
    </>
  );
}
