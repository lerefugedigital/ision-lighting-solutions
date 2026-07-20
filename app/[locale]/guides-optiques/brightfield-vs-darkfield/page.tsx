import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleJsonLd } from "@/lib/jsonld";
import { PRODUCTS_TITLE, TOOLS_TITLE, PLACEHOLDER_COMING_SOON, type RichLocale } from "@/lib/guide-shared-content";
import { GuidePageContent, type GuideRichContent } from "@/components/GuidePageContent";
import { BrightfieldDarkfieldDiagram } from "@/components/diagrams/BrightfieldDarkfieldDiagram";

const ROUTE_KEY = "/guides-optiques/brightfield-vs-darkfield";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["domes-diffus-rainlights", "barres-led-barlights", "eclairages-coaxiaux"];
const TOOL_SLUGS = ["brochage-m12-5-pins"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Brightfield vs Darkfield Lighting | Machine Vision Comparison",
    metaDescription:
      "Why the same scratch can appear bright or dark depending on lighting angle, and how to choose between brightfield and darkfield illumination.",
  },
  fr: {
    metaTitle: "Brightfield vs Darkfield | Comparatif Éclairage Vision Industrielle",
    metaDescription:
      "Pourquoi une même rayure peut apparaître claire ou sombre selon l'angle d'éclairage, et comment choisir entre brightfield et darkfield.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Que vous montiez la source en incidence directe (brightfield) ou rasante (darkfield), le câblage reste identique : le{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>{" "}
        ne dépend pas de l'angle de montage. C'est la précision mécanique de cet angle, bien plus que le câblage électrique, qui déterminera la réussite du montage en darkfield.
      </p>
    );
  }
  return (
    <p>
      Whether you mount the source at direct incidence (brightfield) or a grazing angle (darkfield), the wiring stays identical: the{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>{" "}
      doesn't depend on mounting angle. It's the mechanical precision of that angle, far more than the electrical wiring, that determines whether a darkfield setup succeeds.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Brightfield vs Darkfield Lighting: Which to Choose?",
    lead: "The exact same scratch can appear as a bright line on a dark background, or a dark line on a bright background — the difference is entirely the lighting angle, not the defect itself.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "A scratch, engraving or embossed mark is a small, local discontinuity in a surface's angle relative to the surrounding flat area. A single, arbitrarily chosen lighting angle often fails specifically on this class of defect: the same discontinuity that reflects light one way toward the camera at one lighting angle reflects it a completely different way — or not at all — the moment the angle changes, and choosing the wrong one can hide the very defect the inspection is meant to find.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "This is exactly the distinction between brightfield and darkfield illumination, a well-established principle from optics and microscopy that applies directly to machine vision. In brightfield lighting, the source is positioned so its light reflects straight back into the camera off the flat, undamaged surface — the image is bright by default, and a scratch or defect that scatters that light away from the lens appears as a dark mark against it. In darkfield lighting, the source instead sits at a grazing, oblique angle chosen so that specular reflection off the flat surface never reaches the lens at all — the image is dark by default, and only a raised edge, scratch or engraving that happens to scatter light back toward the lens at that specific angle appears as a bright mark against the dark field. Brightfield suits flat, mirror-like surfaces best viewed on-axis (a job for coaxial lighting); darkfield suits surface-relief defects like scratches and embossing, and is typically achieved with a bar or dome light mounted at a low, grazing angle instead of straight on.",
    diagram: (
      <BrightfieldDarkfieldDiagram
        labels={{
          ariaLabel: "Side-by-side diagram comparing brightfield lighting (direct reflection into the camera) and darkfield lighting (grazing angle, only a defect scatters light into the camera)",
          brightfield: "Brightfield",
          darkfield: "Darkfield",
          source: "Light",
          camera: "Camera",
          defect: "Defect",
          missed: "Reflection misses the lens",
          caption: "Brightfield: flat areas reflect straight into the lens. Darkfield: only a defect scatters light toward it.",
        }}
      />
    ),
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage Brightfield vs Darkfield : Lequel Choisir ?",
    lead: "Exactement la même rayure peut apparaître comme une ligne claire sur fond sombre, ou une ligne sombre sur fond clair — la différence tient entièrement à l'angle d'éclairage, pas au défaut lui-même.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Une rayure, une gravure ou un marquage embossé est une discontinuité locale de l'angle de surface par rapport à la zone plate environnante. Un angle d'éclairage unique, choisi arbitrairement, échoue souvent précisément sur cette classe de défaut : la même discontinuité qui réfléchit la lumière vers la caméra sous un angle donné la réfléchit de façon complètement différente — ou pas du tout — dès que l'angle change, et choisir le mauvais angle peut masquer le défaut même que l'inspection est censée détecter.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "C'est exactement la distinction entre l'éclairage brightfield et darkfield, un principe bien établi issu de l'optique et de la microscopie qui s'applique directement à la vision industrielle. En brightfield, la source est positionnée de sorte que sa lumière soit réfléchie directement vers la caméra par la surface plate et intacte — l'image est claire par défaut, et une rayure ou un défaut qui disperse cette lumière hors de l'objectif apparaît comme une marque sombre. En darkfield, la source est au contraire placée selon un angle rasant et oblique choisi pour que la réflexion spéculaire de la surface plate n'atteigne jamais l'objectif — l'image est sombre par défaut, et seul un bord surélevé, une rayure ou une gravure qui disperse la lumière vers l'objectif sous cet angle précis apparaît comme une marque claire sur fond sombre. Le brightfield convient aux surfaces plates de type miroir observées dans l'axe (le rôle d'un éclairage coaxial) ; le darkfield convient aux défauts de relief comme les rayures et embossages, et s'obtient généralement avec une barre LED ou un dôme monté selon un angle bas et rasant plutôt que de face.",
    diagram: (
      <BrightfieldDarkfieldDiagram
        labels={{
          ariaLabel: "Schéma comparatif brightfield (réflexion directe vers la caméra) et darkfield (angle rasant, seul un défaut disperse la lumière vers la caméra)",
          brightfield: "Brightfield",
          darkfield: "Darkfield",
          source: "Éclairage",
          camera: "Caméra",
          defect: "Défaut",
          missed: "Le reflet manque l'objectif",
          caption: "Brightfield : les zones plates réfléchissent droit vers l'objectif. Darkfield : seul un défaut y disperse la lumière.",
        }}
      />
    ),
    wiringTitle: "Recommandations de Câblage et d'Intégration",
    wiringContent: <WiringContent locale="fr" />,
    productsTitle: PRODUCTS_TITLE.fr,
    toolsTitle: TOOLS_TITLE.fr,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "brightfield-vs-darkfield");
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

  const productSegments = PRODUCT_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );
  const toolSegments = TOOL_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const isRich = locale === "en" || locale === "fr";
  const rich = isRich ? RICH_CONTENT[locale as RichLocale] : null;
  const fallback = findCatalogSegment()?.content[locale];

  const jsonLd = rich
    ? buildTechArticleJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        headline: rich.h1,
        description: META[locale as RichLocale].metaDescription,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        datePublished: PUBLISHED_DATE,
        dateModified: MODIFIED_DATE,
        keywords: ["brightfield", "darkfield", "grazing angle lighting", "specular reflection", "scratch detection"],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Brightfield vs Darkfield"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
