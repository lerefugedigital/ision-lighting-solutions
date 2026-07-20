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

const ROUTE_KEY = "/guides-optiques/choisir-couleur-led-vision";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["barres-led-barlights", "domes-diffus-rainlights", "eclairages-coaxiaux"];
const TOOL_SLUGS = ["brochage-m12-5-pins"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Choosing LED Color | Machine Vision Wavelength Guide",
    metaDescription:
      "Why a monochrome camera can miss a color-coded defect entirely, and how choosing the right LED wavelength restores contrast — read our full guide.",
  },
  fr: {
    metaTitle: "Choisir la Couleur LED | Guide Vision Industrielle",
    metaDescription:
      "Pourquoi une caméra monochrome peut manquer un défaut pourtant visible en couleur, et comment la bonne longueur d'onde LED restaure le contraste.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Le choix de la longueur d'onde est purement optique : il ne change rien au{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>{" "}
        de nos éclairages. Comme Blanc, Rouge, Bleu et Infrarouge partagent le même connecteur et la même alimentation 24VDC sur une gamme donnée, tester plusieurs couleurs sur votre application ne demande aucun recâblage.
      </p>
    );
  }
  return (
    <p>
      Wavelength choice is purely optical: it changes nothing about the{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>{" "}
      of our lights. Because White, Red, Blue and Infrared share the same connector and 24VDC supply across a given range, testing several colors on your application requires no rewiring at all.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "How to Choose the Right LED Color for Machine Vision",
    lead: "Two features that look clearly different to a human eye can produce the exact same gray level to a monochrome camera — and the wrong LED color is usually why.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Most machine vision cameras are monochrome sensors: they measure light intensity, not hue. Under a given illumination wavelength, a red feature on a green background might reflect almost identically to how the green background reflects, producing two regions of nearly the same gray level in the image — even though a human eye, with its three types of color receptors, would separate them instantly. Pick the wrong wavelength, and a perfectly visible color-coded defect, print, or component simply disappears into the background as far as the camera is concerned.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "A colored surface strongly reflects light of its own color and strongly absorbs light of the complementary color on the color wheel — a direct, well-established consequence of selective reflectance. Illuminating a red feature with red light makes it reflect brightly, appearing light in the image; illuminating that same red feature with blue or green light instead makes it absorb strongly, appearing dark. Maximizing contrast between two differently colored regions is therefore a matter of choosing a wavelength that one region reflects and the other absorbs — brightening what you want visible, and darkening what you want suppressed, before the camera ever sees a single pixel.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Comment Choisir la Bonne Couleur LED en Vision Industrielle",
    lead: "Deux détails clairement différents à l'œil humain peuvent produire exactement le même niveau de gris pour une caméra monochrome — et le mauvais choix de couleur LED en est généralement la cause.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "La plupart des caméras de vision industrielle sont des capteurs monochromes : ils mesurent l'intensité lumineuse, pas la teinte. Sous une longueur d'onde d'éclairage donnée, un détail rouge sur un fond vert peut réfléchir presque aussi bien que le fond vert lui-même, produisant deux zones de niveau de gris quasi identique dans l'image — alors qu'un œil humain, avec ses trois types de récepteurs colorés, les séparerait instantanément. Choisissez la mauvaise longueur d'onde, et un défaut, une impression ou un composant pourtant parfaitement visible en couleur disparaît purement et simplement dans le fond pour la caméra.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "Une surface colorée réfléchit fortement la lumière de sa propre couleur et absorbe fortement la lumière de la couleur complémentaire sur le cercle chromatique — une conséquence directe et bien établie de la réflectance sélective. Éclairer un détail rouge en lumière rouge le fait réfléchir fortement, apparaissant clair dans l'image ; éclairer ce même détail rouge en lumière bleue ou verte le fait au contraire absorber fortement, apparaissant sombre. Maximiser le contraste entre deux zones de couleurs différentes revient donc à choisir une longueur d'onde que l'une réfléchit et que l'autre absorbe — éclaircissant ce que vous voulez voir, et assombrissant ce que vous voulez supprimer, avant même que la caméra ne voie le moindre pixel.",
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
  return catalog.segments.find((s) => s.slug === "choisir-couleur-led-vision");
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
        keywords: ["LED color selection", "wavelength", "complementary color contrast", "monochrome camera"],
      })
    : null;

  const faqJsonLd = rich
    ? buildFaqPageJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        faqs:
          locale === "fr"
            ? [
          { question: "Pourquoi une cam\u00e9ra monochrome peut-elle manquer un d\u00e9faut visible en couleur ?", answer: "La plupart des cam\u00e9ras de vision mesurent l'intensit\u00e9 lumineuse, pas la teinte. Sous une mauvaise longueur d'onde, un d\u00e9tail color\u00e9 peut r\u00e9fl\u00e9chir presque comme son fond, produisant un niveau de gris quasi identique dans l'image, alors qu'un \u0153il humain les s\u00e9parerait instantan\u00e9ment." },
          { question: "Comment choisir la bonne longueur d'onde LED pour le contraste ?", answer: "Une surface color\u00e9e r\u00e9fl\u00e9chit fortement sa propre couleur et absorbe la couleur compl\u00e9mentaire. \u00c9clairer un d\u00e9tail rouge en rouge le rend clair ; l'\u00e9clairer en bleu ou vert le rend sombre \u2014 maximiser le contraste consiste \u00e0 choisir la longueur d'onde que chaque zone r\u00e9fl\u00e9chit ou absorbe." },
              ]
            : [
          { question: "Why can a monochrome camera miss a color-coded defect?", answer: "Most machine vision cameras measure light intensity, not hue. Under the wrong illumination wavelength, a colored feature can reflect almost identically to its background, producing nearly the same gray level in the image even though the human eye would separate them instantly." },
          { question: "How do you choose the right LED wavelength for contrast?", answer: "A colored surface strongly reflects light of its own color and absorbs the complementary color. Illuminating a red feature with red light makes it appear bright; illuminating it with blue or green light makes it appear dark \u2014 maximizing contrast is a matter of choosing the wavelength each region reflects or absorbs." },
              ],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Choosing LED Color"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
