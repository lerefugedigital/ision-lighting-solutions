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
import { DomeDiagram } from "@/components/diagrams/DomeDiagram";

const ROUTE_KEY = "/eclairages/domes-diffus-rainlights";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Diffuse Dome Lights | Shadow-Free Vision Illumination",
    metaDescription:
      "Industrial diffuse dome lights: aluminum housing, M12 connector, 24VDC electronics, omnidirectional shadow-free illumination for reflective and curved surfaces.",
  },
  fr: {
    metaTitle: "Dômes Diffus LED | Éclairage Vision Sans Ombre",
    metaDescription:
      "Dômes diffus industriels : corps aluminium, connecteur M12, électronique 24VDC, éclairage omnidirectionnel sans ombre pour surfaces réfléchissantes et courbes.",
  },
};

const ROWS: Record<RichLocale, ProductConfigRow[]> = {
  en: [
    {
      fieldType: "Standard Dome",
      wavelengths: "White, Red, Blue, Infrared",
      opticalWindow: "From 60mm to 300mm inner diameter (configuration dependent)",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
    {
      fieldType: "Open-Center Dome (Coaxial Viewing)",
      wavelengths: "White, Red, Infrared",
      opticalWindow: "From 60mm to 300mm inner diameter (configuration dependent)",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
  ],
  fr: [
    {
      fieldType: "Dôme Standard",
      wavelengths: "Blanc, Rouge, Bleu, Infrarouge",
      opticalWindow: "De 60mm à 300mm de diamètre intérieur (selon configuration)",
      operatingMode: "Continu ou Strobe/Overdrive",
    },
    {
      fieldType: "Dôme à Centre Ouvert (Vision Coaxiale)",
      wavelengths: "Blanc, Rouge, Infrarouge",
      opticalWindow: "De 60mm à 300mm de diamètre intérieur (selon configuration)",
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
    h1: "Diffuse Dome Lights for Reflective & Curved Surfaces",
    lead: "Hemispherical diffuse illuminators that light the target from every angle at once — the reference format for shiny, curved or textured surfaces where direct lighting causes glare.",
    introTitle: "What Is a Diffuse Dome Light Used For?",
    introParagraph:
      "A dome light illuminates the target from a hemisphere of diffuse directions simultaneously rather than from one fixed angle. Where a bar light on a shiny, curved or crinkled surface produces a single hard reflection that can blind the camera, a dome surrounds the part with light so no single glare point dominates — ideal for metal caps, blister packs, curved glass or embossed surfaces. For flat, mirror-like or etched surfaces viewed straight-on, a coaxial light is generally the better-suited choice instead.",
    diagram: (
      <DomeDiagram
        labels={{
          ariaLabel: "Diagram of a diffuse dome light: light converging on the object from many directions at once",
          dome: "Diffuse Dome",
          object: "Object",
          camera: "Camera",
          caption: "Light reaches the object from every direction simultaneously — no single angle dominates.",
        }}
      />
    ),
    highlightsTitle: "Technical Highlights",
    highlights: [
      "Hemispherical diffusing shell delivering omnidirectional, shadow-free light.",
      "Industrial design: aluminum/composite housing, integrated M12 connector, hardened 24VDC electronics.",
      "Optional open-center design allowing a coaxially mounted camera to view straight through the dome's apex.",
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
    h1: "Dômes Diffus pour Surfaces Réfléchissantes et Courbes",
    lead: "Éclairages hémisphériques diffus qui illuminent la cible depuis tous les angles à la fois — le format de référence pour les surfaces brillantes, courbes ou texturées où un éclairage direct provoque des reflets.",
    introTitle: "À Quoi Sert un Dôme Diffus ?",
    introParagraph:
      "Un dôme diffus éclaire la cible depuis un hémisphère de directions diffuses simultanément, plutôt que depuis un angle fixe unique. Là où une barre LED sur une surface brillante, courbe ou froissée produit un reflet dur unique pouvant aveugler la caméra, un dôme entoure la pièce de lumière de sorte qu'aucun point de reflet ne domine — idéal pour les capsules métalliques, les blisters, le verre courbe ou les surfaces embossées. Pour des surfaces plates, de type miroir ou gravées, observées de face, un éclairage coaxial est généralement le choix plus adapté.",
    diagram: (
      <DomeDiagram
        labels={{
          ariaLabel: "Schéma d'un dôme diffus : lumière convergeant sur l'objet depuis de nombreuses directions à la fois",
          dome: "Dôme Diffus",
          object: "Objet",
          camera: "Caméra",
          caption: "La lumière atteint l'objet depuis toutes les directions à la fois — aucun angle ne domine.",
        }}
      />
    ),
    highlightsTitle: "Points Forts Techniques",
    highlights: [
      "Coque diffusante hémisphérique délivrant une lumière omnidirectionnelle, sans ombre.",
      "Conception industrielle : corps aluminium/composite, connecteur M12 intégré, électronique durcie 24VDC.",
      "Design à centre ouvert en option, permettant à une caméra montée coaxialement de voir directement à travers le sommet du dôme.",
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
  return catalog.segments.find((s) => s.slug === "domes-diffus-rainlights");
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
        category: "Machine Vision Diffuse Dome Lights",
        additionalProperties: [
          { name: "Power Supply", value: "24VDC industrial" },
          { name: "Body Material", value: "Aluminum / composite" },
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
        placeholderH1={fallback?.h1 ?? "Diffuse Dome Lights"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
      />
    </>
  );
}
