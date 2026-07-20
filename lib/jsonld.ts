import { SITE_URL, SITE_NAME } from "./site-config";

/** Organization + WebSite graph for the homepage — the root identity every other
 * page's Organization/publisher references point back to via @id. */
export function buildOrganizationAndWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ["fr", "en", "de", "it"],
        publisher: { "@id": `${SITE_URL}#organization` },
      },
    ],
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Rendered as its own <script> tag alongside a page's TechArticle/HowTo graph —
 * the questions/answers must restate genuine content already written on the page,
 * never new claims invented purely for rich-result eligibility. */
export function buildFaqPageJsonLd(params: { path: string; locale: string; faqs: FaqItem[] }) {
  const pageUrl = `${SITE_URL}${params.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    inLanguage: params.locale,
    mainEntity: params.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * ItemPage + a comparative ProductModel for Silo 2 (brand equivalences) — the
 * competitor ranges named in `competitorRanges` must be the same real range names
 * already shown in the page's own comparison table (isSimilarTo, not identical:
 * these are compatible alternatives, not the same SKU).
 */
export function buildEquivalenceItemPageJsonLd(params: {
  path: string;
  locale: string;
  name: string;
  description: string;
  image: string;
  competitorBrand: string;
  competitorRanges: string[];
}) {
  const pageUrl = `${SITE_URL}${params.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemPage",
        "@id": `${pageUrl}#itempage`,
        url: pageUrl,
        name: params.name,
        description: params.description,
        inLanguage: params.locale,
        mainEntity: { "@id": `${pageUrl}#productmodel` },
      },
      {
        "@type": "ProductModel",
        "@id": `${pageUrl}#productmodel`,
        name: params.name,
        description: params.description,
        image: params.image,
        url: pageUrl,
        inLanguage: params.locale,
        brand: { "@type": "Brand", name: SITE_NAME },
        manufacturer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        isSimilarTo: params.competitorRanges.map((range) => ({
          "@type": "Product",
          name: range,
          brand: { "@type": "Brand", name: params.competitorBrand },
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: params.name,
        inLanguage: params.locale,
      },
    ],
  };
}

export interface HowToStepInput {
  name: string;
  text: string;
}

/**
 * Combines TechArticle + HowTo (+ a bare WebPage node they both point back
 * to via mainEntityOfPage) into a single @graph so a technical wiring guide
 * can carry both "this is an authoritative article" and "here are the
 * step-by-step instructions" rich-result signals from one script tag.
 */
export function buildTechArticleWithHowToJsonLd(params: {
  /** Locale-prefixed path, e.g. "/en/cablage-integration/brochage-m12-5-pins". */
  path: string;
  locale: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  proficiencyLevel?: "Beginner" | "Expert";
  dependencies?: string;
  totalTime?: string;
  steps: HowToStepInput[];
}) {
  const pageUrl = `${SITE_URL}${params.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${pageUrl}#techarticle`,
        headline: params.headline,
        description: params.description,
        image: params.image,
        inLanguage: params.locale,
        proficiencyLevel: params.proficiencyLevel ?? "Expert",
        ...(params.dependencies ? { dependencies: params.dependencies } : {}),
        datePublished: params.datePublished,
        dateModified: params.dateModified,
        url: pageUrl,
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}#howto`,
        name: params.headline,
        description: params.description,
        image: params.image,
        inLanguage: params.locale,
        ...(params.totalTime ? { totalTime: params.totalTime } : {}),
        step: params.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.name,
          text: step.text,
          url: `${pageUrl}#pin-${index + 1}`,
        })),
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: params.headline,
        inLanguage: params.locale,
      },
    ],
  };
}

export interface ProductConfigRow {
  name: string;
  wavelengths: string;
  opticalWindow: string;
  operatingMode: string;
}

/**
 * ProductModel (not Product) + an ItemList of its standard configurations —
 * deliberately carries no price, offers or availability, since this is a
 * generic product-range page, not a purchasable SKU with real stock data.
 */
export function buildProductModelJsonLd(params: {
  path: string;
  locale: string;
  name: string;
  description: string;
  image: string;
  category: string;
  additionalProperties: Array<{ name: string; value: string }>;
  configurations: ProductConfigRow[];
}) {
  const pageUrl = `${SITE_URL}${params.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProductModel",
        "@id": `${pageUrl}#productmodel`,
        name: params.name,
        description: params.description,
        image: params.image,
        category: params.category,
        url: pageUrl,
        inLanguage: params.locale,
        brand: { "@type": "Brand", name: SITE_NAME },
        manufacturer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        additionalProperty: params.additionalProperties.map((p) => ({
          "@type": "PropertyValue",
          name: p.name,
          value: p.value,
        })),
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#configurations`,
        name: `${params.name} — Standard Configurations`,
        itemListElement: params.configurations.map((c, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "ProductModel",
            name: c.name,
            description: `${c.wavelengths} — ${c.opticalWindow} — ${c.operatingMode}`,
            isVariantOf: { "@id": `${pageUrl}#productmodel` },
          },
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: params.name,
        inLanguage: params.locale,
      },
    ],
  };
}

/**
 * TechArticle without a HowTo — for sourcing/cross-reference guides that compare
 * ranges rather than walk through wiring steps. `mentions` only asserts "this
 * article discusses this real brand name" (a Brand entity, no fabricated Product
 * data), which is the safe way to reference third-party ranges in structured data.
 */
export function buildTechArticleJsonLd(params: {
  path: string;
  locale: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  mentions?: string[];
  keywords?: string[];
}) {
  const pageUrl = `${SITE_URL}${params.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${pageUrl}#techarticle`,
        headline: params.headline,
        description: params.description,
        image: params.image,
        inLanguage: params.locale,
        datePublished: params.datePublished,
        dateModified: params.dateModified,
        url: pageUrl,
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        ...(params.mentions?.length
          ? { mentions: params.mentions.map((name) => ({ "@type": "Brand", name })) }
          : {}),
        ...(params.keywords?.length ? { keywords: params.keywords.join(", ") } : {}),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: params.headline,
        inLanguage: params.locale,
      },
    ],
  };
}
