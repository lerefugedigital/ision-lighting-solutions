import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { THIN_CONTENT_LOCALES, NOINDEX_FOLLOW, isThinContentLocale } from "@/lib/thin-content";
import { buildTechArticleJsonLd, buildFaqPageJsonLd } from "@/lib/jsonld";
import { PRODUCTS_TITLE, TOOLS_TITLE, PLACEHOLDER_COMING_SOON, type RichLocale } from "@/lib/guide-shared-content";
import { GuidePageContent, type GuideRichContent } from "@/components/GuidePageContent";

const ROUTE_KEY = "/guides-optiques/eclairage-inox-ip69k-agroalimentaire";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["barres-led-barlights", "domes-diffus-rainlights"];
const TOOL_SLUGS = ["brochage-m12-5-pins"];


interface MaterialOption {
  name: string;
  description: string;
}

const CIP_SIP_TEXT: Record<RichLocale, { title: string; paragraph: string }> = {
  en: {
    title: "Resistance to CIP/SIP Cleaning Agents",
    paragraph:
      "Pharmaceutical inspection optics and food-grade lighting are frequently exposed not just to a washdown hose but to Clean-in-Place (CIP) and Sterilize-in-Place (SIP) cycles: circulating caustic soda or nitric acid rinses at elevated temperature, followed in pharma lines by steam sterilization well above 100°C. A 316L stainless steel body resists the chloride and acid exposure of CIP cycles far better than 304-grade steel or aluminum, but the seals, gaskets and optical window matter just as much — EPDM or FKM gaskets and a chemically resistant window coating are what actually keep CIP/SIP chemistry from reaching the electronics after hundreds of repeated cycles.",
  },
  fr: {
    title: "Résistance aux Agents de Nettoyage CIP/SIP",
    paragraph:
      "L'éclairage pharmaceutique et agroalimentaire n'est pas seulement exposé au lavage au jet, mais aussi aux cycles de nettoyage en place (CIP — Clean-in-Place) et de stérilisation en place (SIP — Sterilize-in-Place) : circulation de soude caustique ou d'acide nitrique à température élevée, suivie en environnement pharmaceutique d'une stérilisation vapeur bien au-delà de 100°C. Un corps en inox 316L résiste au chlorure et à l'acide des cycles CIP bien mieux qu'un acier 304 ou qu'un boîtier aluminium, mais les joints et la fenêtre optique comptent tout autant — des joints EPDM ou FKM et un revêtement de fenêtre chimiquement résistant sont ce qui empêche réellement la chimie du CIP/SIP d'atteindre l'électronique après des centaines de cycles répétés.",
  },
};

const MATERIALS_TEXT: Record<RichLocale, { title: string; intro: string; options: MaterialOption[] }> = {
  en: {
    title: "Choosing Materials: Body and Optical Window",
    intro:
      "In corrosive-environment lighting, the housing alloy and the window material are two independent decisions — getting one right doesn't compensate for the other.",
    options: [
      {
        name: "316L Stainless Steel Body",
        description:
          "The standard food and pharmaceutical grade: low carbon content (the \"L\") avoids carbide precipitation during welding, keeping corrosion resistance intact at the seams — the weak point on a lower-grade body.",
      },
      {
        name: "Tempered Glass Window",
        description:
          "Best optical clarity and scratch resistance for CIP/SIP-cycled lines; more resistant to solvent and chemical exposure than PMMA, at the cost of being more fragile under mechanical shock.",
      },
      {
        name: "PMMA (Acrylic) Window",
        description:
          "Lighter and more impact-resistant than glass, suited to lines with a risk of physical knocks; more sensitive to certain aggressive cleaning solvents, so confirm chemical compatibility with your specific CIP agent.",
      },
    ],
  },
  fr: {
    title: "Choix des Matériaux : Corps et Fenêtre Optique",
    intro:
      "En éclairage pour environnements corrosifs, l'alliage du boîtier et le matériau de la fenêtre sont deux décisions indépendantes — bien choisir l'un ne compense pas l'autre.",
    options: [
      {
        name: "Corps Inox 316L",
        description:
          "La qualité standard agroalimentaire et pharmaceutique : la faible teneur en carbone (le « L ») évite la précipitation de carbures lors du soudage, ce qui préserve la résistance à la corrosion au niveau des soudures — le point faible d'un corps de qualité inférieure.",
      },
      {
        name: "Fenêtre en Verre Trempé",
        description:
          "Meilleure clarté optique et résistance aux rayures pour les lignes soumises à des cycles CIP/SIP répétés ; plus résistante aux solvants et à l'exposition chimique que le PMMA, au prix d'une plus grande fragilité aux chocs mécaniques.",
      },
      {
        name: "Fenêtre en PMMA (Acrylique)",
        description:
          "Plus légère et plus résistante aux chocs que le verre, adaptée aux lignes exposées à des chocs physiques ; plus sensible à certains solvants de nettoyage agressifs — vérifiez la compatibilité chimique avec votre agent CIP spécifique.",
      },
    ],
  },
};

function ExtraContent({ locale }: { locale: RichLocale }) {
  const cipSip = CIP_SIP_TEXT[locale];
  const materials = MATERIALS_TEXT[locale];

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{cipSip.title}</h2>
      <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{cipSip.paragraph}</p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{materials.title}</h2>
      <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{materials.intro}</p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {materials.options.map((option) => (
          <div key={option.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <dt className="font-semibold text-slate-900 dark:text-slate-100">{option.name}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{option.description}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

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
    h1: "IP69K Stainless Steel LED Lighting for Pharmaceutical and Food Environments",
    lead: "A washdown hose or a steam sterilization cycle is a far harsher test than any splash or dust an office or warehouse camera will ever see — and most industrial lighting, including most pharmaceutical inspection optics, was never built to survive it.",
    principlesTitle: "IP69K Stainless Lighting: Understanding the Problem and the Solution",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Food, beverage and pharmaceutical production lines are washed down daily with high-pressure, high-temperature water combined with detergents and, in corrosive environments, aggressive cleaning or sterilizing agents. A standard aluminum enclosure rated for dust and light splashing (typical IP54 or IP65 ratings) is not validated against a close-range, high-pressure, high-temperature jet — repeated washdown or CIP/SIP cycles force water and chemistry past seals never designed for that stress, corrode the aluminum body, and eventually reach the electronics inside. Worse, a housing with crevices, sharp internal corners or dead zones becomes a place where cleaning residue and bacteria can accumulate — turning the light itself into a contamination risk on a hygienic or pharmaceutical line.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "IP69K is a real, defined ingress protection rating (per ISO 20653 / DIN 40050-9): the \"6\" certifies the enclosure is fully dust-tight, and the \"9K\" certifies it has been tested against high-pressure, high-temperature water jets from close range at multiple angles using a rotating nozzle — the exact stress profile of an industrial washdown hose. Pairing that rating with a 316L-grade stainless steel body (the standard material for corrosive environments, resisting chlorides and cleaning chemicals in both food and pharmaceutical settings) and a hygienic design free of crevices and dead zones addresses both problems at once: the light survives the washdown or CIP/SIP cycle, and it doesn't become a place for contamination to hide.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    extraContent: <ExtraContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage LED Inox IP69K pour Milieux Pharmaceutiques et Agroalimentaires",
    lead: "Un lavage au jet ou un cycle de stérilisation vapeur est un test bien plus sévère que la moindre éclaboussure ou poussière que verra jamais une caméra de bureau ou d'entrepôt — et la plupart des éclairages industriels, y compris beaucoup d'éclairages pharmaceutiques, n'ont jamais été conçus pour y survivre. Cette page aborde l'inspection optique pharmaceutique, le nettoyage CIP SIP, l'inox 316L et les exigences d'un environnement corrosif lavable.",
    principlesTitle: "Éclairage Inox IP69K : Comprendre le Problème et la Solution",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Les lignes de production agroalimentaires et pharmaceutiques sont lavées quotidiennement à l'eau haute pression et haute température, combinée à des détergents et, en environnements corrosifs, à des agents de nettoyage ou de stérilisation agressifs. Un boîtier aluminium standard classé pour la poussière et les projections légères (indices IP54 ou IP65 typiques) n'est pas validé face à un jet haute pression et haute température à courte distance — les cycles de lavage ou CIP/SIP répétés forcent l'eau et la chimie à travers des joints jamais conçus pour cette contrainte, corrodent le corps aluminium, et finissent par atteindre l'électronique interne. Pire encore, un boîtier présentant des recoins, des arêtes internes vives ou des zones mortes devient un endroit où résidus de nettoyage et bactéries peuvent s'accumuler — transformant l'éclairage lui-même en risque de contamination sur une ligne hygiénique ou pharmaceutique.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "L'IP69K est un indice de protection réel et défini (norme ISO 20653 / DIN 40050-9) : le « 6 » certifie un boîtier totalement étanche à la poussière, et le « 9K » certifie qu'il a été testé contre des jets d'eau haute pression et haute température à courte distance et sous plusieurs angles, via une buse rotative — exactement le profil de contrainte d'un lavage industriel au jet. Associer cet indice à un corps en acier inoxydable qualité 316L (matériau standard des environnements corrosifs, résistant aux chlorures et produits de nettoyage aussi bien en agroalimentaire qu'en pharmaceutique) et à une conception hygiénique sans recoin ni zone morte traite les deux problèmes à la fois : l'éclairage survit au lavage ou au cycle CIP/SIP, et ne devient pas un lieu de contamination.",
    wiringTitle: "Recommandations de Câblage et d'Intégration",
    wiringContent: <WiringContent locale="fr" />,
    extraContent: <ExtraContent locale="fr" />,
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
  const alternates = buildLanguageAlternates(ROUTE_KEY, locale, { excludeLocales: THIN_CONTENT_LOCALES });
  const content = findCatalogSegment()?.content[locale];
  return {
    title: content ? { absolute: content.metaTitle } : undefined,
    description: content?.metaDescription,
    alternates,
    ...(isThinContentLocale(locale) ? { robots: NOINDEX_FOLLOW } : {}),
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
        description: fallback?.metaDescription ?? rich.lead,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        datePublished: PUBLISHED_DATE,
        dateModified: MODIFIED_DATE,
        keywords: [
          "IP69K",
          "stainless steel lighting",
          "washdown",
          "hygienic design",
          "316L",
          "pharmaceutical inspection optics",
          "CIP/SIP",
          "corrosive environment lighting",
          "inspection optique pharmaceutique",
          "nettoyage CIP SIP",
          "inox 316L",
          "environnement corrosif lavable",
        ],
      })
    : null;

  const faqJsonLd = rich
    ? buildFaqPageJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        faqs:
          locale === "fr"
            ? [
          { question: "Pourquoi un \u00e9clairage aluminium standard \u00e9choue-t-il en lavage agroalimentaire ?", answer: "Un bo\u00eetier aluminium class\u00e9 pour la poussi\u00e8re et les projections l\u00e9g\u00e8res n'est pas valid\u00e9 face \u00e0 un jet haute pression et haute temp\u00e9rature \u00e0 courte distance \u2014 les lavages r\u00e9p\u00e9t\u00e9s forcent l'eau \u00e0 travers les joints, corrodent l'aluminium et finissent par atteindre l'\u00e9lectronique interne." },
          { question: "Que certifie r\u00e9ellement un indice IP69K ?", answer: "IP69K certifie que le bo\u00eetier est totalement \u00e9tanche \u00e0 la poussi\u00e8re et a \u00e9t\u00e9 test\u00e9 contre des jets d'eau haute pression et haute temp\u00e9rature \u00e0 courte distance sous plusieurs angles \u2014 le profil exact d'un lavage industriel, g\u00e9n\u00e9ralement associ\u00e9 \u00e0 un corps en inox 316L." },
          { question: "Un \u00e9clairage IP69K r\u00e9siste-t-il aux cycles CIP/SIP pharmaceutiques ?", answer: "Un corps en inox 316L associ\u00e9 \u00e0 des joints EPDM ou FKM et une fen\u00eatre optique chimiquement r\u00e9sistante (verre ou PMMA selon le solvant utilis\u00e9) r\u00e9siste aux cycles de nettoyage en place (CIP) et de st\u00e9rilisation en place (SIP) typiques des lignes pharmaceutiques \u2014 v\u00e9rifiez la compatibilit\u00e9 chimique de la fen\u00eatre avec votre agent CIP sp\u00e9cifique." },
              ]
            : [
          { question: "Why does standard aluminum lighting fail in food washdown environments?", answer: "A standard aluminum enclosure rated for dust and light splashing is not validated against a close-range, high-pressure, high-temperature jet \u2014 repeated washdown cycles force water past seals, corrode the aluminum body, and eventually reach the electronics inside." },
          { question: "What does an IP69K rating actually certify?", answer: "IP69K certifies the enclosure is fully dust-tight and has been tested against high-pressure, high-temperature water jets from close range at multiple angles \u2014 the exact stress profile of an industrial washdown hose, typically paired with a 316L stainless steel body." },
          { question: "Does IP69K lighting survive pharmaceutical CIP/SIP cycles?", answer: "A 316L stainless steel body paired with EPDM or FKM gaskets and a chemically resistant optical window (glass or PMMA depending on the solvent used) withstands the Clean-in-Place (CIP) and Sterilize-in-Place (SIP) cycles typical of pharmaceutical lines \u2014 confirm the window's chemical compatibility with your specific CIP agent." },
              ],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
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
