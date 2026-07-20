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

const ROUTE_KEY = "/guides-optiques/eclairage-infrarouge-industriel";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["barres-led-barlights", "retroeclairages-backlights"];
const TOOL_SLUGS = ["brochage-m12-5-pins", "eclairage-stroboscopique-overdrive"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Industrial Infrared (IR) Lighting | Machine Vision Guide",
    metaDescription:
      "Why infrared lighting sees through materials that look opaque under visible light, and how to apply it in machine vision inspection.",
  },
  fr: {
    metaTitle: "Éclairage Infrarouge Industriel | Guide Vision Industrielle",
    metaDescription:
      "Pourquoi l'éclairage infrarouge traverse des matériaux qui semblent opaques en lumière visible, et comment l'appliquer en inspection vision industrielle.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Les modules IR se câblent sur le même{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>{" "}
        que nos autres éclairages. Comme la pénétration IR demande souvent un courant plus élevé, synchronisez la source en{" "}
        <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          mode stroboscopique/overdrive
        </Link>{" "}
        plutôt qu'en continu : cela fige la pièce en mouvement et limite l'échauffement des LED au seul instant du déclenchement caméra.
      </p>
    );
  }
  return (
    <p>
      IR modules wire onto the same{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>{" "}
      as our other lights. Because IR penetration often calls for higher drive current, synchronize the source in{" "}
      <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        strobe/overdrive mode
      </Link>{" "}
      rather than continuous: it freezes the moving part and confines LED heating to the instant of the camera trigger.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Industrial Infrared (IR) Lighting for Machine Vision",
    lead: "Infrared illumination sees past what visible light cannot: it passes through materials that look opaque to the human eye, without ever disturbing a human operator standing next to the line.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "A vision system often needs to inspect a feature that visible light simply cannot reach — fill level through a dark plastic bottle, a weld seam under a coating, print hidden beneath an opaque film. Under standard white or colored illumination, the outer material absorbs the light before it ever reaches the feature of interest, and the camera sees nothing but a uniformly dark or saturated surface. Adding more visible light doesn't help: the material blocks it regardless of intensity.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "A material's opacity is wavelength-dependent, not absolute. Many carbon-loaded plastics and dark inks that absorb almost all visible light (400-700nm) become significantly more transmissive in the near-infrared band, typically around 850nm or 940nm — the same physical effect that lets a TV remote's IR beam pass through a visibly opaque black plastic bezel. Illuminating with IR LEDs at these wavelengths lets the camera's sensor (which remains sensitive slightly beyond the visible range) capture what's hidden beneath the surface. As a secondary benefit, IR sits outside the 380-740nm band the human eye perceives, so an IR-lit inspection station doesn't add visible glare or flicker for nearby operators.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage Infrarouge (IR) Industriel pour la Vision Industrielle",
    lead: "L'éclairage infrarouge voit au-delà de ce que la lumière visible ne peut pas atteindre : il traverse des matériaux qui semblent opaques à l'œil humain, sans jamais gêner un opérateur posté à côté de la ligne.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Un système de vision doit souvent inspecter un détail que la lumière visible ne peut tout simplement pas atteindre : un niveau de remplissage à travers une bouteille plastique sombre, un cordon de soudure sous un revêtement, une impression cachée sous un film opaque. Sous un éclairage blanc ou coloré standard, le matériau externe absorbe la lumière avant qu'elle n'atteigne le détail recherché, et la caméra ne voit qu'une surface uniformément sombre ou saturée. Augmenter la lumière visible n'aide en rien : le matériau la bloque quelle que soit son intensité.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "L'opacité d'un matériau dépend de la longueur d'onde, elle n'est pas absolue. De nombreux plastiques chargés en carbone et encres sombres qui absorbent presque toute la lumière visible (400-700nm) deviennent nettement plus transmissifs dans la bande proche infrarouge, typiquement autour de 850nm ou 940nm — le même effet physique qui permet au faisceau IR d'une télécommande de traverser une façade en plastique noir visiblement opaque. Éclairer avec des LED IR à ces longueurs d'onde permet au capteur de la caméra (sensible légèrement au-delà du visible) de capturer ce qui est caché sous la surface. En bénéfice secondaire, l'IR se situe hors de la bande 380-740nm perçue par l'œil humain : un poste d'inspection éclairé en IR n'ajoute ni éblouissement ni scintillement visible pour les opérateurs à proximité.",
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
  return catalog.segments.find((s) => s.slug === "eclairage-infrarouge-industriel");
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
        keywords: ["infrared lighting", "IR machine vision", "850nm", "940nm", "material transmittance"],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Industrial Infrared Lighting"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
