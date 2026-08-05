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
import { BrightfieldDarkfieldDiagram } from "@/components/diagrams/BrightfieldDarkfieldDiagram";

const ROUTE_KEY = "/guides-optiques/brightfield-vs-darkfield";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["domes-diffus-rainlights", "barres-led-barlights", "eclairages-coaxiaux"];
const TOOL_SLUGS = ["brochage-m12-5-pins"];


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

interface ComparisonRow {
  criterion: string;
  brightfield: string;
  darkfield: string;
}

interface MaterialUseCase {
  material: string;
  recommendation: string;
}

const COMPARISON_ROWS: Record<RichLocale, ComparisonRow[]> = {
  en: [
    { criterion: "Lighting angle", brightfield: "Direct / on-axis (0°), often coaxial", darkfield: "Low, grazing angle (typically 10-30°)" },
    { criterion: "Default background", brightfield: "Bright — flat surfaces reflect straight into the lens", darkfield: "Dark — specular reflection never reaches the lens" },
    { criterion: "Defect appearance", brightfield: "Dark mark against a bright field", darkfield: "Bright mark against a dark field" },
    { criterion: "Detects best", brightfield: "Flat, mirror-like or etched surfaces, printed codes", darkfield: "Surface-relief defects: scratches, embossing, raised edges" },
    { criterion: "Typical hardware", brightfield: "Coaxial light, ring light mounted on-axis", darkfield: "Bar light or dome light mounted at a shallow angle" },
  ],
  fr: [
    { criterion: "Angle d'éclairage", brightfield: "Direct / dans l'axe (0°), souvent coaxial", darkfield: "Angle bas et rasant (typiquement 10-30°)" },
    { criterion: "Fond par défaut", brightfield: "Fond clair — les surfaces plates réfléchissent droit vers l'objectif", darkfield: "Fond noir — la réflexion spéculaire n'atteint jamais l'objectif" },
    { criterion: "Aspect du défaut", brightfield: "Marque sombre sur fond clair", darkfield: "Marque claire sur fond noir" },
    { criterion: "Détecte le mieux", brightfield: "Surfaces plates, type miroir ou gravées, codes imprimés", darkfield: "Défauts de relief : rayures, embossage, arêtes surélevées" },
    { criterion: "Matériel typique", brightfield: "Éclairage coaxial, anneau lumineux monté dans l'axe", darkfield: "Barre LED ou dôme monté à angle rasant" },
  ],
};

const MATERIAL_USE_CASES: Record<RichLocale, MaterialUseCase[]> = {
  en: [
    {
      material: "Glass",
      recommendation:
        "Brightfield (coaxial) for flat glass to reveal chips and cracks against a uniform bright background; darkfield for surface scratch detection where a low grazing angle scatters light off the scratch itself.",
    },
    {
      material: "Polished metal",
      recommendation:
        "Darkfield is usually the default on polished or mirror-like metal, since brightfield on a highly specular surface tends to wash out shallow surface-relief defects like fine scratches or tool marks.",
    },
    {
      material: "Plastic",
      recommendation:
        "Brightfield for molded plastic parts with printed or laser-marked codes and flat inspection zones; darkfield when checking for sink marks, flow lines or surface scuffs on matte or semi-gloss plastic.",
    },
  ],
  fr: [
    {
      material: "Verre",
      recommendation:
        "Brightfield (coaxial) sur du verre plat pour révéler éclats et fissures sur fond clair uniforme ; darkfield pour la détection de rayures surface, où l'angle rasant disperse la lumière sur la rayure elle-même.",
    },
    {
      material: "Métal poli",
      recommendation:
        "Le darkfield est en général le choix par défaut sur un métal poli ou de type miroir, car le brightfield sur une surface très spéculaire tend à effacer les défauts de relief peu profonds comme les micro-rayures ou traces d'outil.",
    },
    {
      material: "Plastique",
      recommendation:
        "Brightfield pour les pièces plastiques moulées avec codes imprimés ou marqués laser et zones d'inspection planes ; darkfield pour détecter marques de retassure, lignes d'écoulement ou éraflures de surface sur plastique mat ou semi-brillant.",
    },
  ],
};

function ExtraContent({ locale }: { locale: RichLocale }) {
  const rows = COMPARISON_ROWS[locale];
  const useCases = MATERIAL_USE_CASES[locale];
  const title = locale === "fr" ? "Tableau Comparatif Brightfield vs Darkfield" : "Brightfield vs Darkfield Comparison Table";
  const useCasesTitle = locale === "fr" ? "Cas d'Usage par Matériau" : "Use Cases by Material";
  const colCriterion = locale === "fr" ? "Critère" : "Criterion";

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <th className="px-4 py-3">{colCriterion}</th>
              <th className="px-4 py-3">Brightfield</th>
              <th className="px-4 py-3">Darkfield</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.criterion} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.criterion}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.brightfield}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.darkfield}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{useCasesTitle}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {useCases.map((useCase) => (
          <div key={useCase.material} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <dt className="font-semibold text-slate-900 dark:text-slate-100">{useCase.material}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{useCase.recommendation}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Brightfield vs Darkfield Lighting: Which to Choose?",
    lead: "The exact same scratch can appear as a bright line on a dark background, or a dark line on a bright background — the difference is entirely the lighting angle, not the defect itself.",
    principlesTitle: "Brightfield vs Darkfield Lighting: Understanding the Problem and the Solution",
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
    extraContent: <ExtraContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Fond Clair vs Fond Noir (Brightfield vs Darkfield) en Vision Industrielle",
    lead: "Exactement la même rayure peut apparaître comme une ligne claire sur fond noir, ou une ligne sombre sur fond clair — la différence tient entièrement à l'angle d'éclairage fond clair fond noir choisi, pas au défaut lui-même.",
    principlesTitle: "Éclairage Brightfield vs Darkfield : Comprendre le Problème et la Solution",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Une rayure, une gravure ou un marquage embossé est une discontinuité locale de l'angle de surface par rapport à la zone plate environnante. Un angle d'éclairage unique, choisi arbitrairement, échoue souvent précisément sur cette classe de défaut : la même discontinuité qui réfléchit la lumière vers la caméra sous un angle donné la réfléchit de façon complètement différente — ou pas du tout — dès que l'angle change, et choisir le mauvais angle peut masquer le défaut même que l'inspection est censée détecter.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "C'est exactement la distinction entre l'éclairage brightfield et darkfield, un principe bien établi issu de l'optique et de la microscopie qui s'applique directement à la vision industrielle. En brightfield, la source est positionnée de sorte que sa lumière soit réfléchie directement vers la caméra par la surface plate et intacte — l'image est claire par défaut, et une rayure ou un défaut qui disperse cette lumière hors de l'objectif apparaît comme une marque sombre. En darkfield, la source est au contraire placée selon un angle rasant et oblique choisi pour que la réflexion spéculaire de la surface plate n'atteigne jamais l'objectif — l'image est sombre par défaut, et seul un bord surélevé, une rayure ou une gravure qui disperse la lumière vers l'objectif sous cet angle précis apparaît comme une marque claire sur fond sombre. Le brightfield convient aux surfaces plates de type miroir observées dans l'axe (le rôle d'un éclairage coaxial) ; le darkfield convient à la détection de rayures surface et autres défauts de relief comme les embossages, et s'obtient généralement avec une barre LED ou un dôme monté selon un angle bas et rasant plutôt que de face.",
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
    extraContent: <ExtraContent locale="fr" />,
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
        keywords: ["brightfield", "darkfield", "grazing angle lighting", "specular reflection", "scratch detection"],
      })
    : null;

  const faqJsonLd = rich
    ? buildFaqPageJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        faqs:
          locale === "fr"
            ? [
          { question: "Pourquoi une m\u00eame rayure peut-elle appara\u00eetre claire ou sombre selon l'\u00e9clairage ?", answer: "Une rayure, gravure ou marque en relief est une discontinuit\u00e9 locale de l'angle de surface par rapport \u00e0 la zone plate environnante. Un angle d'\u00e9clairage choisi arbitrairement \u00e9choue souvent sur ce type de d\u00e9faut car cette discontinuit\u00e9 r\u00e9fl\u00e9chit la lumi\u00e8re diff\u00e9remment \u2014 ou pas du tout \u2014 d\u00e8s que l'angle change." },
          { question: "Quelle est la diff\u00e9rence entre l'\u00e9clairage brightfield et darkfield ?", answer: "En brightfield, la source r\u00e9fl\u00e9chit directement vers la cam\u00e9ra sur la surface plate : l'image est claire par d\u00e9faut et un d\u00e9faut appara\u00eet sombre. En darkfield, la source est en incidence rasante afin que la r\u00e9flexion sp\u00e9culaire n'atteigne jamais l'objectif : l'image est sombre par d\u00e9faut et seule une ar\u00eate ou une rayure appara\u00eet claire." },
              ]
            : [
          { question: "Why can the same scratch appear bright or dark depending on the lighting?", answer: "A scratch, engraving or embossed mark is a small, local discontinuity in a surface's angle relative to the surrounding flat area. A single, arbitrarily chosen lighting angle often fails on this class of defect because the same discontinuity reflects light differently \u2014 or not at all \u2014 as the angle changes." },
          { question: "What's the difference between brightfield and darkfield lighting?", answer: "In brightfield lighting, the source reflects straight back into the camera off the flat surface, so the image is bright by default and a defect appears dark. In darkfield lighting, the source sits at a grazing angle so specular reflection never reaches the lens, so the image is dark by default and only a raised edge or scratch appears bright." },
              ],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
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
