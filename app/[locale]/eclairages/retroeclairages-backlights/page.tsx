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
import { BacklightDiagram } from "@/components/diagrams/BacklightDiagram";

const ROUTE_KEY = "/eclairages/retroeclairages-backlights";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "LED Backlights | Contour & Dimensional Machine Vision",
    metaDescription:
      "Industrial LED backlight panels: aluminum frame, M12 connector, 24VDC electronics, uniform diffuse backlighting for silhouette and dimensional measurement.",
  },
  fr: {
    metaTitle: "Rétroéclairages LED | Contrôle Dimensionnel Vision Industrielle",
    metaDescription:
      "Panneaux de rétroéclairage LED industriels : cadre aluminium, connecteur M12, électronique 24VDC, rétroéclairage diffus uniforme pour la mesure de silhouette et de dimensions.",
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
    h1: "Backlights for Contour & Dimensional Inspection",
    lead: "Flat, uniform LED panels placed behind or beneath the target to create a high-contrast silhouette — the reference lighting format for dimensional measurement and contour extraction.",
    introTitle: "What Is a Backlight Used For?",
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
    highlightsTitle: "Technical Highlights",
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
    relatedTitle: RELATED_TITLE.en,
  },
  fr: {
    h1: "Rétroéclairages pour le Contrôle Dimensionnel et de Contour",
    lead: "Panneaux LED plats et uniformes placés derrière ou sous la cible pour créer une silhouette à fort contraste — le format d'éclairage de référence pour la mesure dimensionnelle et l'extraction de contour.",
    introTitle: "À Quoi Sert un Rétroéclairage ?",
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
    highlightsTitle: "Points Forts Techniques",
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
    relatedTitle: RELATED_TITLE.fr,
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
      />
    </>
  );
}
