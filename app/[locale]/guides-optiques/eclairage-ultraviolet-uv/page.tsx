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

const ROUTE_KEY = "/guides-optiques/eclairage-ultraviolet-uv";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["barres-led-barlights", "projecteurs-spots-led"];
const TOOL_SLUGS = ["brochage-m12-5-pins"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "UV Lighting Guide | Machine Vision Fluorescence Detection",
    metaDescription:
      "Why some defects are invisible under any normal light, and how UV-excited fluorescence reveals them in machine vision inspection — full guide.",
  },
  fr: {
    metaTitle: "Guide Éclairage UV | Détection Fluorescence Vision",
    metaDescription:
      "Pourquoi certains défauts sont invisibles sous toute lumière normale, et comment la fluorescence excitée par UV les révèle en inspection vision.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Les modules UV se câblent sur le même{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>{" "}
        que nos autres éclairages. Pour un contraste de fluorescence maximal, travaillez si possible en enceinte assombrie afin de supprimer la lumière ambiante visible qui, elle, ne contribue en rien au signal fluorescent recherché.
      </p>
    );
  }
  return (
    <p>
      UV modules wire onto the same{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>{" "}
      as our other lights. For maximum fluorescence contrast, work inside a darkened enclosure where possible — ambient visible light adds nothing to the fluorescent signal you're actually trying to capture, and only dilutes it.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Ultraviolet (UV) Lighting for Machine Vision Applications",
    lead: "Some defects don't just have low contrast — they are genuinely invisible under any normal lighting. UV excitation is the only optical technique that can make them appear at all.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Certain features share the exact same color and reflectance as their surroundings under visible or infrared light: a hairline crack in clear plastic, a residue of adhesive, a trace of contaminating oil, or a security marking designed to be undetectable under normal light. No amount of repositioning, filtering or intensity adjustment under white, colored or IR illumination will ever separate these features from their background — the light reflected back to the camera from the defect and from the surrounding material is simply identical.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "Certain materials fluoresce: they absorb high-energy ultraviolet photons and re-emit part of that absorbed energy as visible light at a longer wavelength — a real, well-documented photophysical effect known as the Stokes shift. Machine vision UV sources typically operate in the 365-405nm UV-A band. Illuminate the target with UV, and only the fluorescing material — the adhesive trace, the contaminant, the invisible ink — glows back in visible light, standing out sharply against a background that reflects almost none of it. Pairing the UV source with an optical filter that blocks the reflected UV excitation itself further isolates the fluorescent signal from any residual glare.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage Ultraviolet (UV) pour les Applications de Vision Industrielle",
    lead: "Certains défauts n'ont pas simplement un faible contraste : ils sont réellement invisibles sous tout éclairage normal. L'excitation UV est la seule technique optique capable de les faire apparaître.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Certains détails partagent exactement la même couleur et la même réflectance que leur environnement en lumière visible ou infrarouge : une fissure capillaire dans un plastique transparent, un résidu de colle, une trace d'huile contaminante, ou un marquage de sécurité conçu pour rester indétectable en lumière normale. Aucun repositionnement, filtrage ou ajustement d'intensité en lumière blanche, colorée ou IR ne séparera jamais ces détails de leur fond — la lumière renvoyée à la caméra depuis le défaut et depuis le matériau environnant est tout simplement identique.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "Certains matériaux fluorescent : ils absorbent des photons ultraviolets de haute énergie et réémettent une partie de cette énergie absorbée sous forme de lumière visible à une longueur d'onde plus longue — un effet photophysique réel et bien documenté appelé décalage de Stokes. Les sources UV en vision industrielle fonctionnent typiquement dans la bande UV-A 365-405nm. En éclairant la cible en UV, seul le matériau fluorescent — la trace de colle, le contaminant, l'encre invisible — réémet de la lumière visible, se détachant nettement d'un fond qui n'en réfléchit presque aucune. Associer la source UV à un filtre optique bloquant l'excitation UV réfléchie isole davantage le signal fluorescent de tout reflet résiduel.",
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
  return catalog.segments.find((s) => s.slug === "eclairage-ultraviolet-uv");
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
        keywords: ["UV lighting", "fluorescence detection", "365nm", "405nm", "Stokes shift"],
      })
    : null;

  const faqJsonLd = rich
    ? buildFaqPageJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        faqs:
          locale === "fr"
            ? [
          { question: "Pourquoi certains d\u00e9fauts sont-ils invisibles sous toute lumi\u00e8re normale ?", answer: "Certains d\u00e9tails partagent exactement la m\u00eame couleur et r\u00e9flectance que leur environnement en lumi\u00e8re visible ou infrarouge \u2014 fissure capillaire, r\u00e9sidu de colle, marquage de s\u00e9curit\u00e9 \u2014 si bien qu'aucun r\u00e9glage de position, filtrage ou intensit\u00e9 ne les s\u00e9parera jamais du fond." },
          { question: "Comment l'\u00e9clairage UV les r\u00e9v\u00e8le-t-il ?", answer: "Certains mat\u00e9riaux fluorescent : ils absorbent les photons UV et r\u00e9\u00e9mettent une partie de cette \u00e9nergie en lumi\u00e8re visible \u00e0 plus grande longueur d'onde. \u00c9clairer en UV (bande 365-405nm) fait luire uniquement le mat\u00e9riau fluorescent, qui ressort nettement sur un fond qui n'en r\u00e9fl\u00e9chit presque aucun." },
              ]
            : [
          { question: "Why are some defects invisible under any normal light?", answer: "Certain features share the exact same color and reflectance as their surroundings under visible or infrared light \u2014 a hairline crack, an adhesive residue, a security marking \u2014 so no repositioning, filtering or intensity adjustment will ever separate them from their background." },
          { question: "How does UV lighting reveal them?", answer: "Certain materials fluoresce: they absorb UV photons and re-emit part of that energy as visible light at a longer wavelength. Illuminating with UV in the 365-405nm band makes only the fluorescing material glow, standing out sharply against a background that reflects almost none of it." },
              ],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Ultraviolet (UV) Lighting"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
