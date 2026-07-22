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
  RELATED_SLUGS,
  PLACEHOLDER_COMING_SOON,
  type RichLocale,
} from "@/lib/product-shared-content";
import { getDatasheetHref } from "@/lib/technical-downloads";
import { ProductPageContent, type ProductRichContent } from "@/components/ProductPageContent";
import type { ProductConfigRow } from "@/components/ProductConfigTable";
import { BacklightDiagram } from "@/components/diagrams/BacklightDiagram";
import { ProductRangeSection, type ProductRangeSectionProps } from "@/components/ProductRangeSection";
import { HomogeneitySimulator } from "@/components/HomogeneitySimulator";
import { WavelengthContrastSimulator } from "@/components/WavelengthContrastSimulator";

const PRODUCT_SLUG = "retroeclairages-backlights";
const ROUTE_KEY = "/eclairages/retroeclairages-backlights";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

type BacklightSeriesCode = "BKL-STD" | "BKL-PWR" | "BKL-SLIM / INOX";

const SERIES_SLUGS: Record<BacklightSeriesCode, string> = {
  "BKL-STD": "retroeclairages-backlights-bkl-std",
  "BKL-PWR": "retroeclairages-backlights-bkl-pwr",
  "BKL-SLIM / INOX": "retroeclairages-backlights-bkl-slim-inox",
};

/** This page also surfaces the camera-compatibility guides alongside the usual M12/Overdrive ones. */
const PAGE_RELATED_SLUGS = [...RELATED_SLUGS, "compatibilite-camera-cognex", "compatibilite-camera-keyence"];

type RangeContent = Omit<ProductRangeSectionProps, "locale" | "datasheetHrefs">;

const RANGE_CONTENT: Record<RichLocale, RangeContent> = {
  en: {
    specsTitle: "Range Specifications and Formats",
    specsIntro:
      "Every backlight in the range is configured from the parameters below to match your application and camera.",
    columnCharacteristic: "Characteristic",
    columnOptions: "Available Variants",
    specs: [
      { label: "Uniformity", values: "> 90% across the full active surface (distortion-free contour measurement)" },
      { label: "Standard Formats", values: "50×50 mm · 100×100 mm · 200×200 mm · 300×300 mm · Custom formats" },
      { label: "Thickness", values: "Ultra-thin: 12 mm to 25 mm depending on series, for tight-space integration" },
      { label: "Wavelengths", values: "Red (630 nm) · Infrared (850 nm — plastic penetration) · White · Blue" },
      { label: "Operating Modes", values: "Continuous 24V DC · Strobe Overdrive (exposure time < 100 µs)" },
    ],
    seriesTitle: "The 3 LED Backlight Series",
    seriesIntro: "Pick the series matched to your line speed and environment, then request the datasheet or the 3D model.",
    series: [
      {
        code: "BKL-STD",
        name: "Standard 24V Diffuse Backlight",
        description: "Silhouette control and dimensional measurement at standard line speed.",
      },
      {
        code: "BKL-PWR",
        name: "High-Intensity Overdrive Backlight",
        description: "Built for high-speed lines and strobe operation.",
      },
      {
        code: "BKL-SLIM / INOX",
        name: "Ultra-Thin Backlight & IP69K Food-Grade Version",
        description: "Tight-space integration, or washdown food-processing environments.",
      },
    ],
    datasheetButtonLabel: "Datasheet (PDF)",
    cadButtonLabel: "3D Model (STEP)",
    useCases: {
      title: "Industrial Applications and Use Cases",
      items: [
        "Dimensional measurement of machined parts and thread pitch",
        "Fill-level control (bottles, vials)",
        "Opacity, bubble and inclusion inspection in glass or plastic",
      ],
    },
  },
  fr: {
    specsTitle: "Spécifications et Formats de la Gamme",
    specsIntro:
      "Chaque rétroéclairage de la gamme se configure à partir des paramètres ci-dessous pour s'adapter à votre application et à votre caméra.",
    columnCharacteristic: "Caractéristique",
    columnOptions: "Déclinaisons Disponibles",
    specs: [
      { label: "Homogénéité", values: "> 90% sur toute la surface utile (mesure de contours sans distorsion)" },
      { label: "Formats Standard", values: "50×50 mm · 100×100 mm · 200×200 mm · 300×300 mm · Formats sur-mesure" },
      { label: "Épaisseur", values: "Ultra-fine : 12 mm à 25 mm selon séries, pour intégration en espace restreint" },
      { label: "Longueurs d'Onde", values: "Rouge (630 nm) · Infrarouge (850 nm — pénétration plastiques) · Blanc · Bleu" },
      { label: "Modes de Fonctionnement", values: "Continu 24V DC · Overdrive stroboscopique (temps de pose < 100 µs)" },
    ],
    seriesTitle: "Les 3 Séries de Backlights LED",
    seriesIntro: "Choisissez la série adaptée à votre cadence et votre environnement, puis demandez la fiche technique ou le modèle 3D.",
    series: [
      {
        code: "BKL-STD",
        name: "Backlight Diffus Standard 24V",
        description: "Contrôle de silhouette et mesure dimensionnelle en cadence standard.",
      },
      {
        code: "BKL-PWR",
        name: "Backlight Overdrive Haute Intensité",
        description: "Conçu pour les cadences rapides et le mode stroboscopique.",
      },
      {
        code: "BKL-SLIM / INOX",
        name: "Backlight Ultra-Fin & Version IP69K Agroalimentaire",
        description: "Intégration en espace restreint, ou environnement lavable agroalimentaire.",
      },
    ],
    datasheetButtonLabel: "Fiche Technique (PDF)",
    cadButtonLabel: "Modèle 3D (STEP)",
    useCases: {
      title: "Applications et Cas d'Usage Industriels",
      items: [
        "Mesure dimensionnelle de pièces usinées et de pas de vis",
        "Contrôle de niveau de remplissage (bouteilles, flacons)",
        "Inspection d'opacité, de bulles et d'inclusions dans le verre ou le plastique",
      ],
    },
  },
};

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Backlight & Industrial Machine Vision Backlighting 24V | Vision Lighting",
    metaDescription:
      "High-uniformity LED backlights for silhouette control, dimensional measurement and liquid level inspection. Compact formats, large formats and IP69K.",
  },
  fr: {
    metaTitle: "Rétroéclairage & Backlight Vision Industrielle 24V | Vision Lighting",
    metaDescription:
      "Rétroéclairages LED haute homogénéité pour contrôle de silhouettes, mesure dimensionnelle et niveau de liquide. Formats compacts, grands formats et IP69K.",
  },
};

const ROWS: Record<RichLocale, ProductConfigRow[]> = {
  en: [
    {
      fieldType: "Standard Rectangular Panel",
      wavelengths: "White, Red, Infrared",
      opticalWindow: "From 50×50mm to 300×300mm active area (configuration dependent)",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
    {
      fieldType: "Custom Cut-Out Panel",
      wavelengths: "White, Red, Infrared",
      opticalWindow: "Dimensions on request, dependent on application",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
  ],
  fr: [
    {
      fieldType: "Panneau Rectangulaire Standard",
      wavelengths: "Blanc, Rouge, Infrarouge",
      opticalWindow: "De 50×50mm à 300×300mm de zone active (selon configuration)",
      operatingMode: "Continu ou Strobe/Overdrive",
    },
    {
      fieldType: "Panneau à Découpe Sur Mesure",
      wavelengths: "Blanc, Rouge, Infrarouge",
      opticalWindow: "Dimensions sur demande, selon l'application",
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
    h1: "Backlights & LED Backlighting for Industrial Machine Vision",
    lead: "Flat, uniform LED panels placed behind or beneath the target to create a high-contrast silhouette — the reference lighting format for dimensional measurement and contour extraction.",
    principlesTitle: "Industrial Machine Vision Backlighting: Principles and Advantages",
    introTitle: "What Is a Backlight Used For in Machine Vision?",
    introParagraph:
      "A backlight is a diffuse LED panel placed behind or underneath the object, turning it into a dark silhouette against a bright, uniform background. That contrast is exactly what dimensional measurement, edge/contour detection and hole or feature counting need — where a bar light illuminates the front surface directly and a dome light handles reflective or curved parts, a backlight instead removes surface detail entirely in favor of a clean outline.",
    diagram: (
      <BacklightDiagram
        labels={{
          ariaLabel: "Diagram of a backlight panel: light transmitted around an opaque object, straight to the camera",
          panel: "Backlight Panel",
          object: "Object",
          camera: "Camera",
          caption: "The object blocks the central rays, producing a sharp silhouette against the glowing panel.",
        }}
      />
    ),
    highlightsTitle: "Technical Highlights: Uniformity and Exposure Time",
    highlights: [
      "Industrial design: aluminum frame for heat dissipation, integrated M12 connector for a standardized wiring harness.",
      "Hardened 24VDC electronics built for continuous production-line duty.",
      "Uniform diffuse output across the full panel via an opal diffuser, minimizing hot spots at the silhouette's edge.",
      "White LED is the most common choice for maximum contrast; Red or Infrared available for specific material or contrast requirements.",
      "Compatible with continuous and strobe/overdrive operation for high-speed lines.",
    ],
    tableLabels: TABLE_LABELS.en,
    rows: ROWS.en,
    disclaimerNote: DISCLAIMER_NOTE.en,
    integrationContent: <IntegrationContent locale="en" />,
    relatedTitle: "Integration Guides and Camera Compatibility (Cognex, Keyence...)",
    beamPatternTitle: "Optical Beam Pattern Visualization and Formats",
    technicalDownloadsTitle: "Datasheets and 3D CAD Files (STEP)",
    contactFormTitle: "Request a Datasheet or a Quote",
    sampleTestTitle: "Validate Your Application: Free Sample Testing",
  },
  fr: {
    h1: "Rétroéclairages & Backlights LED pour Vision Industrielle",
    lead: "Panneaux LED plats et uniformes placés derrière ou sous la cible pour créer une silhouette à fort contraste — le format d'éclairage de référence pour la mesure dimensionnelle et l'extraction de contour.",
    principlesTitle: "Rétroéclairage Vision Industrielle : Principes et Avantages",
    introTitle: "À Quoi Sert un Rétroéclairage en Vision Industrielle ?",
    introParagraph:
      "Un rétroéclairage est un panneau LED diffus placé derrière ou sous l'objet, le transformant en silhouette sombre sur un fond lumineux et uniforme. C'est exactement le contraste dont ont besoin la mesure dimensionnelle, la détection de contour/bord et le comptage de trous ou de détails — là où une barre LED éclaire directement la surface avant et un dôme diffus traite les pièces réfléchissantes ou courbes, un rétroéclairage supprime au contraire tout détail de surface au profit d'un contour net.",
    diagram: (
      <BacklightDiagram
        labels={{
          ariaLabel: "Schéma d'un rétroéclairage : lumière transmise autour d'un objet opaque, directement vers la caméra",
          panel: "Panneau de Rétroéclairage",
          object: "Objet",
          camera: "Caméra",
          caption: "L'objet bloque les rayons centraux, produisant une silhouette nette sur le panneau lumineux.",
        }}
      />
    ),
    highlightsTitle: "Points Forts Techniques : Homogénéité et Temps de Pose",
    highlights: [
      "Conception industrielle : cadre en aluminium pour la dissipation thermique, connecteur M12 intégré pour un câblage standardisé.",
      "Électronique durcie 24VDC conçue pour un fonctionnement continu en environnement de production.",
      "Éclairage diffus homogène sur toute la surface du panneau grâce à un diffuseur opale, sans point chaud sur le contour de la silhouette.",
      "Le Blanc est l'option la plus courante pour un contraste maximal ; Rouge ou Infrarouge disponibles pour des besoins spécifiques de matière ou de contraste.",
      "Compatible fonctionnement continu et stroboscopique/overdrive pour les lignes à cadence élevée.",
    ],
    tableLabels: TABLE_LABELS.fr,
    rows: ROWS.fr,
    disclaimerNote: DISCLAIMER_NOTE.fr,
    integrationContent: <IntegrationContent locale="fr" />,
    relatedTitle: "Guides d'Intégration et Compatibilité Caméra (Cognex, Keyence...)",
    beamPatternTitle: "Visualisation des Faisceaux Optiques et Formats",
    technicalDownloadsTitle: "Fiches Techniques et Fichiers CAO 3D (STEP)",
    contactFormTitle: "Demander une Fiche Technique ou un Devis",
    sampleTestTitle: "Valider Votre Application : Test Gratuit sur Échantillon",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "retroeclairages-backlights");
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

  const relatedSegments = PAGE_RELATED_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const isRich = locale === "en" || locale === "fr";
  const datasheetHref = isRich ? getDatasheetHref(PRODUCT_SLUG, locale as RichLocale) : null;
  const fallback = findCatalogSegment()?.content[locale];

  const rich = isRich
    ? {
        ...RICH_CONTENT[locale as RichLocale],
        rangeSection: (
          <ProductRangeSection
            locale={locale as RichLocale}
            {...RANGE_CONTENT[locale as RichLocale]}
            afterSpecs={
              <div className="space-y-8">
                <HomogeneitySimulator locale={locale as RichLocale} headingLevel="h3" />
                <WavelengthContrastSimulator locale={locale as RichLocale} headingLevel="h3" />
              </div>
            }
            datasheetHrefs={{
              "BKL-STD": getDatasheetHref(SERIES_SLUGS["BKL-STD"], locale as RichLocale),
              "BKL-PWR": getDatasheetHref(SERIES_SLUGS["BKL-PWR"], locale as RichLocale),
              "BKL-SLIM / INOX": getDatasheetHref(SERIES_SLUGS["BKL-SLIM / INOX"], locale as RichLocale),
            }}
          />
        ),
      }
    : null;

  const jsonLd = rich
    ? buildProductModelJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        name: rich.h1,
        description: META[locale as RichLocale].metaDescription,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        category: "Machine Vision LED Backlights",
        additionalProperties: [
          { name: "Power Supply", value: "24VDC industrial" },
          { name: "Body Material", value: "Aluminum" },
          { name: "Connector", value: "M12, 5-pin" },
          { name: "Available Wavelengths", value: "White, Red, Infrared (configuration dependent)" },
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
        placeholderH1={fallback?.h1 ?? "Backlights"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
        datasheetHref={datasheetHref}
      />
    </>
  );
}
