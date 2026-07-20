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
import { SpotlightDiagram } from "@/components/diagrams/SpotlightDiagram";

const ROUTE_KEY = "/eclairages/projecteurs-spots-led";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "LED Spotlights | Long-Range Machine Vision Illumination",
    metaDescription:
      "Industrial LED spotlights and floodlights: aluminum housing, M12 connector, 24VDC electronics, narrow and wide beam optics for long working distances.",
  },
  fr: {
    metaTitle: "Projecteurs Spots LED | Éclairage Vision Longue Distance",
    metaDescription:
      "Projecteurs et spots LED industriels : corps aluminium, connecteur M12, électronique 24VDC, optiques faisceau étroit et large pour longues distances de travail.",
  },
};

const ROWS: Record<RichLocale, ProductConfigRow[]> = {
  en: [
    {
      fieldType: "Narrow Beam (Spot)",
      wavelengths: "White, Red, Infrared",
      opticalWindow: "Beam angle and working distance dependent on configuration — available on request",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
    {
      fieldType: "Wide Beam (Flood)",
      wavelengths: "White, Red, Blue, Infrared",
      opticalWindow: "Beam angle and working distance dependent on configuration — available on request",
      operatingMode: "Continuous or Strobe/Overdrive",
    },
  ],
  fr: [
    {
      fieldType: "Faisceau Étroit (Spot)",
      wavelengths: "Blanc, Rouge, Infrarouge",
      opticalWindow: "Angle de faisceau et distance de travail selon configuration — disponibles sur demande",
      operatingMode: "Continu ou Strobe/Overdrive",
    },
    {
      fieldType: "Faisceau Large (Flood)",
      wavelengths: "Blanc, Rouge, Bleu, Infrarouge",
      opticalWindow: "Angle de faisceau et distance de travail selon configuration — disponibles sur demande",
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
    h1: "LED Spotlights & Floodlights for Long-Range Inspection",
    lead: "Focused directional illuminators built for long working distances and large fields of view — the format of choice when the target can't be lit at close range.",
    introTitle: "What Are LED Spotlights & Floodlights Used For?",
    introParagraph:
      "Spotlights and floodlights use a focusing lens or reflector to project light over long working distances, well beyond what a close-mounted bar, dome, backlight or coaxial light is built for. A narrow-beam spot concentrates light on a distant, contained field; a wide-beam flood covers a large area instead — both suited to outdoor inspection, large-object scanning, or any high-ambient-light environment where the camera needs to out-compete sunlight or factory floor lighting rather than simply illuminate a nearby part.",
    diagram: (
      <SpotlightDiagram
        labels={{
          ariaLabel: "Diagram of a spotlight: a directional beam projected over a long working distance to a distant target",
          source: "Spotlight",
          camera: "Camera",
          target: "Distant Target",
          distance: "Long Working Distance",
          caption: "A focused beam reaches targets no close-mounted light format can illuminate.",
        }}
      />
    ),
    highlightsTitle: "Technical Highlights",
    highlights: [
      "Focusing lens or reflector optics engineered for long working distances.",
      "Robust aluminum housing (IP-rated options available on request), integrated M12 connector, hardened 24VDC electronics.",
      "Narrow-beam (spot) and wide-beam (flood) optics available depending on the application.",
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
    h1: "Projecteurs et Spots LED pour l'Inspection Longue Distance",
    lead: "Éclairages directionnels focalisés conçus pour les longues distances de travail et les larges champs de vision — le format de choix lorsque la cible ne peut pas être éclairée à courte distance.",
    introTitle: "À Quoi Servent les Projecteurs et Spots LED ?",
    introParagraph:
      "Les projecteurs et spots utilisent une lentille de focalisation ou un réflecteur pour projeter la lumière sur de longues distances de travail, bien au-delà de ce pour quoi une barre LED, un dôme, un rétroéclairage ou un éclairage coaxial monté à courte distance sont conçus. Un spot à faisceau étroit concentre la lumière sur un champ distant et contenu ; un projecteur à faisceau large couvre au contraire une grande surface — tous deux adaptés à l'inspection en extérieur, au scan de grands objets, ou à tout environnement en forte lumière ambiante où la caméra doit primer sur la lumière du soleil ou l'éclairage d'atelier plutôt que simplement éclairer une pièce proche.",
    diagram: (
      <SpotlightDiagram
        labels={{
          ariaLabel: "Schéma d'un projecteur : un faisceau directionnel projeté sur une longue distance de travail vers une cible distante",
          source: "Projecteur",
          camera: "Caméra",
          target: "Cible Distante",
          distance: "Longue Distance de Travail",
          caption: "Un faisceau focalisé atteint des cibles qu'aucun format d'éclairage monté à courte distance ne peut couvrir.",
        }}
      />
    ),
    highlightsTitle: "Points Forts Techniques",
    highlights: [
      "Optique à lentille de focalisation ou réflecteur conçue pour les longues distances de travail.",
      "Boîtier aluminium robuste (options IP disponibles sur demande), connecteur M12 intégré, électronique durcie 24VDC.",
      "Optiques à faisceau étroit (spot) et faisceau large (flood) disponibles selon l'application.",
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
  return catalog.segments.find((s) => s.slug === "projecteurs-spots-led");
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
        category: "Machine Vision LED Spotlights & Floodlights",
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
        placeholderH1={fallback?.h1 ?? "LED Spotlights & Floodlights"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
      />
    </>
  );
}
