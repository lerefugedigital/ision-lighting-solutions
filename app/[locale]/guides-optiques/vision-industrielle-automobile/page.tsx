import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleJsonLd, buildFaqPageJsonLd } from "@/lib/jsonld";
import { PRODUCTS_TITLE, TOOLS_TITLE, PLACEHOLDER_COMING_SOON, type RichLocale } from "@/lib/guide-shared-content";
import { GuidePageContent, type GuideRichContent } from "@/components/GuidePageContent";

const ROUTE_KEY = "/guides-optiques/vision-industrielle-automobile";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["eclairages-coaxiaux", "domes-diffus-rainlights", "barres-led-barlights"];
const TOOL_SLUGS = ["eclairage-stroboscopique-overdrive", "brochage-m12-5-pins"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Automotive Machine Vision Lighting | Guide & Applications",
    metaDescription:
      "Why metallic and painted automotive parts defeat generic lighting, and how to match lighting geometry to weld and surface defects — full guide.",
  },
  fr: {
    metaTitle: "Vision Industrielle Automobile | Guide d'Éclairage",
    metaDescription:
      "Pourquoi les pièces automobiles métalliques et peintes mettent en échec un éclairage générique, et comment adapter la géométrie aux défauts.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Les lignes automobiles fonctionnent à cadence élevée, souvent avec des pièces en mouvement sur convoyeur ou bras robotisé : configurez systématiquement le{" "}
        <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          mode stroboscopique/overdrive
        </Link>{" "}
        pour figer la pièce sans flou de mouvement, en vous appuyant sur le{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>{" "}
        pour la synchronisation avec le trigger caméra.
      </p>
    );
  }
  return (
    <p>
      Automotive lines run at high cycle rates, often with parts moving on a conveyor or robotic arm: systematically configure{" "}
      <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        strobe/overdrive mode
      </Link>{" "}
      to freeze the part without motion blur, using the{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>{" "}
      to synchronize with the camera trigger.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Machine Vision Lighting for the Automotive Industry",
    lead: "Metallic, machined and painted automotive parts are among the hardest surfaces in machine vision to light consistently — and a single lighting geometry rarely works for both a weld seam and a body panel.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Most automotive components are specular or semi-specular: bare metal, machined surfaces, welds and painted panels all reflect light in a fairly narrow, mirror-like cone rather than scattering it evenly in every direction. Under generic diffuse lighting, the exact reflection the camera sees depends heavily on the part's precise angle and position — a slight shift from one cycle to the next on a conveyor or robotic cell can turn a strong, usable signal into a saturated hot spot or a dark dropout, making a single fixed threshold unreliable across the run.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "The fix is to match the lighting's geometry to what the defect actually is, not to the part in general. A weld seam, scratch or machining mark is a local discontinuity in the surface's angle — coaxial or directional lighting reveals it precisely because that angle change makes it reflect differently from the surrounding specular surface, showing up as a clear bright or dark deviation. A curved, painted body panel instead benefits from diffuse dome lighting, which illuminates it from every angle at once and removes the position-dependent hot spots that a directional source would otherwise create — trading the search for one perfect fixed angle for a lighting geometry that stays consistent even as the part's position varies slightly cycle to cycle.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage Vision Industrielle pour le Secteur Automobile",
    lead: "Les pièces automobiles métalliques, usinées et peintes comptent parmi les surfaces les plus difficiles à éclairer de manière homogène en vision industrielle — et une géométrie d'éclairage unique fonctionne rarement à la fois pour un cordon de soudure et un panneau de carrosserie.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "La plupart des composants automobiles sont spéculaires ou semi-spéculaires : métal nu, surfaces usinées, soudures et panneaux peints réfléchissent tous la lumière dans un cône assez étroit, de type miroir, plutôt que de la diffuser uniformément dans toutes les directions. Sous un éclairage diffus générique, le reflet exact perçu par la caméra dépend fortement de l'angle et de la position précis de la pièce — un léger décalage d'un cycle à l'autre sur un convoyeur ou une cellule robotisée peut transformer un signal fort et exploitable en un point chaud saturé ou une zone sombre, rendant un seuil fixe unique peu fiable sur toute la série.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "La solution consiste à adapter la géométrie de l'éclairage à ce qu'est réellement le défaut, et non à la pièce en général. Un cordon de soudure, une rayure ou une marque d'usinage est une discontinuité locale de l'angle de surface — un éclairage coaxial ou directionnel la révèle précisément parce que ce changement d'angle la fait réfléchir différemment de la surface spéculaire environnante, apparaissant comme une déviation claire, sombre ou lumineuse. Un panneau de carrosserie peint et courbe bénéficie au contraire d'un dôme diffus, qui l'éclaire depuis tous les angles à la fois et supprime les points chauds dépendants de la position qu'une source directionnelle créerait sinon — remplaçant la recherche d'un angle fixe parfait par une géométrie d'éclairage qui reste stable même quand la position de la pièce varie légèrement d'un cycle à l'autre.",
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
  return catalog.segments.find((s) => s.slug === "vision-industrielle-automobile");
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
        keywords: ["automotive machine vision", "weld seam inspection", "specular surfaces", "coaxial lighting"],
      })
    : null;

  const faqJsonLd = rich
    ? buildFaqPageJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        faqs:
          locale === "fr"
            ? [
          { question: "Pourquoi un \u00e9clairage g\u00e9n\u00e9rique donne-t-il des r\u00e9sultats incoh\u00e9rents sur pi\u00e8ces automobiles ?", answer: "La plupart des composants automobiles sont sp\u00e9culaires ou semi-sp\u00e9culaires \u2014 m\u00e9tal nu, soudures et panneaux peints r\u00e9fl\u00e9chissent la lumi\u00e8re dans un c\u00f4ne \u00e9troit type miroir. Sous \u00e9clairage diffus g\u00e9n\u00e9rique, le reflet exact d\u00e9pend fortement de l'angle pr\u00e9cis de la pi\u00e8ce, un l\u00e9ger d\u00e9calage d'un cycle \u00e0 l'autre pouvant saturer ou assombrir l'image." },
          { question: "Comment adapter l'\u00e9clairage aux types de d\u00e9fauts automobiles ?", answer: "Un cordon de soudure ou une rayure est une discontinuit\u00e9 locale de l'angle de surface \u2014 un \u00e9clairage coaxial ou directionnel la r\u00e9v\u00e8le car ce changement d'angle r\u00e9fl\u00e9chit diff\u00e9remment de la surface environnante. Un panneau peint courbe b\u00e9n\u00e9ficie au contraire d'un d\u00f4me diffus, qui supprime les points chauds d\u00e9pendants de la position." },
              ]
            : [
          { question: "Why does generic lighting give inconsistent results on automotive parts?", answer: "Most automotive components are specular or semi-specular \u2014 bare metal, welds and painted panels reflect light in a narrow, mirror-like cone. Under generic diffuse lighting, the exact reflection depends heavily on the part's precise angle, so a slight shift between cycles can turn a usable signal into a saturated hot spot or dark dropout." },
          { question: "How do you match lighting to automotive defect types?", answer: "A weld seam or scratch is a local discontinuity in surface angle \u2014 coaxial or directional lighting reveals it because the angle change reflects differently from the surrounding surface. A curved painted panel instead benefits from diffuse dome lighting, which removes position-dependent hot spots." },
              ],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Automotive Machine Vision"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
