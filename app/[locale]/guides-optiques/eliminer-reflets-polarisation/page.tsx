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

const ROUTE_KEY = "/guides-optiques/eliminer-reflets-polarisation";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["domes-diffus-rainlights", "eclairages-coaxiaux", "barres-led-barlights"];
const TOOL_SLUGS = ["brochage-m12-5-pins"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Polarized Lighting | Eliminating Glare in Machine Vision",
    metaDescription:
      "Why a saturated glare hot spot destroys image data no exposure setting can recover, and how crossed polarizing filters remove it.",
  },
  fr: {
    metaTitle: "Éclairage Polarisé | Éliminer les Reflets en Vision Industrielle",
    metaDescription:
      "Pourquoi un point de reflet saturé détruit une donnée image qu'aucun réglage d'exposition ne peut récupérer, et comment des filtres polarisants croisés l'éliminent.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Un filtre polarisant se monte en amont sur la source lumineuse et se câble comme n'importe lequel de nos éclairages via le{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>{" "}
        — seul un second filtre polarisant, placé sur l'objectif de la caméra et orienté en croisé, est nécessaire côté optique pour compléter le montage.
      </p>
    );
  }
  return (
    <p>
      A polarizing filter mounts on the light source itself and wires the same as any of our lights via the{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>{" "}
      — only a second polarizing filter, placed on the camera lens and crossed against the light's, is needed on the optical side to complete the setup.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Eliminating Reflections & Glare with Polarized Lighting",
    lead: "A saturated glare hot spot isn't just \"too bright\" — it's a pixel with no information left in it, and no exposure or gain adjustment can bring back data that was never captured.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Metallic, glass and wet surfaces reflect a large fraction of incident light specularly, in a narrow, mirror-like cone. When that reflection points straight into the camera's lens, it clips the sensor at those pixels — the region reads as pure white regardless of what feature, defect or code sits underneath the glare. Because a clipped pixel carries no information, no amount of re-exposing, re-gaining or re-processing the image afterward can recover what the sensor never actually measured; the only fix has to happen at the light itself, before the reflection ever reaches the lens.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "Unpolarized light reflecting specularly off a non-metallic surface becomes partially linearly polarized in the process — a real, well-established property of dielectric reflection. Light scattered diffusely from beneath the surface or from a rougher matte area, by contrast, keeps a much more random mix of polarization states. Placing a linear polarizing filter on the light source, and a second linear polarizing filter on the camera lens rotated 90° relative to the first — a \"crossed\" configuration — blocks most of that specularly polarized glare while still passing a large share of the depolarized diffuse light. The saturated hot spot disappears, and the feature that was hiding underneath it becomes visible.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éliminer les Reflets et Éblouissements par Éclairage Polarisé",
    lead: "Un point de reflet saturé n'est pas simplement « trop lumineux » — c'est un pixel qui ne contient plus aucune information, et aucun réglage d'exposition ou de gain ne peut restituer une donnée qui n'a jamais été capturée.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Les surfaces métalliques, vitrées ou humides réfléchissent une grande partie de la lumière incidente de façon spéculaire, dans un cône étroit de type miroir. Lorsque ce reflet pointe directement vers l'objectif de la caméra, il sature le capteur sur ces pixels — la zone apparaît blanc pur, quel que soit le détail, défaut ou code situé sous le reflet. Un pixel saturé ne portant plus aucune information, aucun réajustement d'exposition, de gain ou de traitement d'image a posteriori ne peut récupérer ce que le capteur n'a en réalité jamais mesuré ; la correction doit se faire au niveau de l'éclairage lui-même, avant même que le reflet n'atteigne l'objectif.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "La lumière non polarisée réfléchie de façon spéculaire par une surface non métallique devient partiellement polarisée linéairement au cours de cette réflexion — une propriété réelle et bien établie de la réflexion diélectrique. La lumière diffusée depuis sous la surface, ou depuis une zone mate plus rugueuse, conserve à l'inverse un mélange de polarisations bien plus aléatoire. Placer un filtre polarisant linéaire sur la source lumineuse, et un second filtre polarisant linéaire sur l'objectif de la caméra tourné à 90° par rapport au premier — une configuration « croisée » — bloque l'essentiel de ce reflet spéculaire polarisé tout en laissant passer une large part de la lumière diffuse dépolarisée. Le point de saturation disparaît, et le détail qu'il masquait devient visible.",
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
  return catalog.segments.find((s) => s.slug === "eliminer-reflets-polarisation");
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
        keywords: ["polarized lighting", "crossed polarizers", "specular glare", "linear polarization"],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Eliminating Reflections with Polarization"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
