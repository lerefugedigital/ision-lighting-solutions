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

const ROUTE_KEY = "/guides-optiques/eclairage-inox-ip69k-agroalimentaire";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["barres-led-barlights", "domes-diffus-rainlights"];
const TOOL_SLUGS = ["brochage-m12-5-pins"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "IP69K Stainless Lighting | Food & Beverage Machine Vision",
    metaDescription:
      "Why standard aluminum lighting fails in food and beverage washdown environments, and what an IP69K rating actually certifies.",
  },
  fr: {
    metaTitle: "Éclairage Inox IP69K | Vision Industrielle Agroalimentaire",
    metaDescription:
      "Pourquoi un éclairage aluminium standard échoue en environnement de lavage agroalimentaire, et ce que certifie réellement un indice IP69K.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Un boîtier IP69K ne suffit pas à lui seul : le connecteur doit suivre le même niveau d'étanchéité. Vérifiez que votre variante de{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          connecteur M12
        </Link>{" "}
        est elle-même certifiée IP69K, sans quoi le point faible de l'installation se déplace simplement du corps de l'éclairage vers sa connectique.
      </p>
    );
  }
  return (
    <p>
      An IP69K housing alone isn't enough — the connector must match the same sealing level. Confirm that your{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        M12 connector
      </Link>{" "}
      variant is itself IP69K-rated; otherwise the installation's weak point simply moves from the light's housing to its wiring.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "IP69K Stainless Steel Lighting for the Food Industry",
    lead: "A washdown hose is a far harsher test than any splash or dust an office or warehouse camera will ever see — and most industrial lighting was never built to survive it.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Food and beverage production lines are washed down daily with high-pressure, high-temperature water combined with detergents and sometimes corrosive cleaning agents. A standard aluminum enclosure rated for dust and light splashing (typical IP54 or IP65 ratings) is not validated against a close-range, high-pressure, high-temperature jet — repeated washdown cycles force water past seals never designed for that stress, corrode the aluminum body over cleaning-chemical exposure, and eventually reach the electronics inside. Worse, a housing with crevices, sharp internal corners or dead zones becomes a place where cleaning residue and bacteria can accumulate — turning the light itself into a contamination risk on a hygienic line.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "IP69K is a real, defined ingress protection rating (per ISO 20653 / DIN 40050-9): the \"6\" certifies the enclosure is fully dust-tight, and the \"9K\" certifies it has been tested against high-pressure, high-temperature water jets from close range at multiple angles using a rotating nozzle — the exact stress profile of an industrial washdown hose. Pairing that rating with a 316L-grade stainless steel body (the standard food-industry material for corrosion resistance against chlorides and cleaning chemicals) and a hygienic design free of crevices and dead zones addresses both problems at once: the light survives the washdown, and it doesn't become a place for contamination to hide.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage Inox IP69K pour l'Industrie Agroalimentaire",
    lead: "Un lavage au jet est un test bien plus sévère que la moindre éclaboussure ou poussière que verra jamais une caméra de bureau ou d'entrepôt — et la plupart des éclairages industriels n'ont jamais été conçus pour y survivre.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Les lignes de production agroalimentaires sont lavées quotidiennement à l'eau haute pression et haute température, combinée à des détergents et parfois des produits de nettoyage corrosifs. Un boîtier aluminium standard classé pour la poussière et les projections légères (indices IP54 ou IP65 typiques) n'est pas validé face à un jet haute pression et haute température à courte distance — les cycles de lavage répétés forcent l'eau à travers des joints jamais conçus pour cette contrainte, corrodent le corps aluminium au contact des produits de nettoyage, et finissent par atteindre l'électronique interne. Pire encore, un boîtier présentant des recoins, des arêtes internes vives ou des zones mortes devient un endroit où résidus de nettoyage et bactéries peuvent s'accumuler — transformant l'éclairage lui-même en risque de contamination sur une ligne hygiénique.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "L'IP69K est un indice de protection réel et défini (norme ISO 20653 / DIN 40050-9) : le « 6 » certifie un boîtier totalement étanche à la poussière, et le « 9K » certifie qu'il a été testé contre des jets d'eau haute pression et haute température à courte distance et sous plusieurs angles, via une buse rotative — exactement le profil de contrainte d'un lavage industriel au jet. Associer cet indice à un corps en acier inoxydable qualité 316L (matériau standard de l'agroalimentaire pour sa résistance à la corrosion face aux chlorures et produits de nettoyage) et à une conception hygiénique sans recoin ni zone morte traite les deux problèmes à la fois : l'éclairage survit au lavage, et ne devient pas un lieu de contamination.",
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
  return catalog.segments.find((s) => s.slug === "eclairage-inox-ip69k-agroalimentaire");
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
        keywords: ["IP69K", "stainless steel lighting", "washdown", "hygienic design", "316L"],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "IP69K Stainless Lighting"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
