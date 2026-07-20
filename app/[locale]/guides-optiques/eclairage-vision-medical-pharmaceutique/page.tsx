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

const ROUTE_KEY = "/guides-optiques/eclairage-vision-medical-pharmaceutique";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";
const PRODUCT_SLUGS = ["retroeclairages-backlights", "domes-diffus-rainlights"];
const TOOL_SLUGS = ["eclairage-stroboscopique-overdrive", "brochage-m12-5-pins"];

const META: Record<RichLocale, { metaTitle: string; metaDescription: string }> = {
  en: {
    metaTitle: "Medical & Pharma Machine Vision Lighting | Guide",
    metaDescription:
      "Why translucent tablets and reflective blister foil defeat generic lighting, and how backlight silhouettes and diffuse domes solve it.",
  },
  fr: {
    metaTitle: "Vision Médicale & Pharmaceutique | Guide Éclairage",
    metaDescription:
      "Pourquoi comprimés translucides et films de blister réfléchissants mettent en échec un éclairage générique, et comment silhouette et dôme diffus y répondent.",
  },
};

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Le comptage pharmaceutique tourne souvent à plusieurs milliers d'unités par minute : configurez le{" "}
        <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          mode stroboscopique/overdrive
        </Link>{" "}
        pour figer chaque comprimé sans flou de mouvement, en synchronisant le déclenchement via le{" "}
        <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          brochage M12 standard
        </Link>
        .
      </p>
    );
  }
  return (
    <p>
      Pharmaceutical counting often runs at several thousand units per minute: configure{" "}
      <Link href="/cablage-integration/eclairage-stroboscopique-overdrive" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        strobe/overdrive mode
      </Link>{" "}
      to freeze each tablet without motion blur, synchronizing the trigger through the{" "}
      <Link href="/cablage-integration/brochage-m12-5-pins" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        standard M12 pinout
      </Link>
      .
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Machine Vision Lighting for Medical & Pharmaceutical Applications",
    lead: "A translucent tablet and a crinkled foil blister fail for opposite optical reasons — and patient safety leaves no room for an unreliable inspection either way.",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Two very different optical failures show up constantly in pharmaceutical inspection. Tablets and capsules are often translucent or share a near-identical color with the tray or belt beneath them, so under front lighting their outline blends into the background and a vision system struggles to count or measure them reliably. Blister pack foil, meanwhile, is a crinkled, highly reflective surface: under direct lighting it throws back sharp, position-dependent hot spots that saturate the image and hide the very cavity or seal defect the inspection is meant to catch. Both problems occur on lines running at very high speed, where patient safety and regulatory compliance leave essentially no tolerance for a missed or double-counted unit.",
    solutionTitle: "The Optical Solution",
    solutionParagraph:
      "Each failure has a distinct, well-established fix. For counting and shape verification, backlighting the tablet from behind turns it into a sharp, high-contrast silhouette regardless of its own surface color or any printed marking — the same contour-extraction principle used for any dimensional measurement, just applied to a pill on a tray. For blister foil, diffuse dome lighting illuminates the crinkled surface from every angle simultaneously, removing the single hard reflection a direct light would create and replacing it with a uniform, glare-free field where an actual seal or cavity defect stands out on its own.",
    wiringTitle: "Wiring & Integration Recommendations",
    wiringContent: <WiringContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage Vision Industrielle pour les Applications Médicales et Pharmaceutiques",
    lead: "Un comprimé translucide et un film de blister froissé échouent pour des raisons optiques opposées — et la sécurité du patient ne laisse aucune place à une inspection peu fiable, dans un cas comme dans l'autre.",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Deux échecs optiques très différents reviennent constamment en inspection pharmaceutique. Les comprimés et gélules sont souvent translucides ou partagent une couleur quasi identique à celle du plateau ou du tapis sous eux : sous un éclairage frontal, leur contour se fond dans le fond et le système de vision peine à les compter ou les mesurer de façon fiable. Le film de blister, de son côté, est une surface froissée et très réfléchissante : sous éclairage direct, il renvoie des points chauds nets et dépendants de la position qui saturent l'image et masquent précisément le défaut d'alvéole ou de scellage que l'inspection doit détecter. Ces deux problèmes surviennent sur des lignes à très grande vitesse, où la sécurité du patient et la conformité réglementaire ne tolèrent quasiment aucune unité manquée ou comptée en double.",
    solutionTitle: "La Solution Optique",
    solutionParagraph:
      "Chaque échec a sa solution propre, bien établie. Pour le comptage et la vérification de forme, rétroéclairer le comprimé par l'arrière en fait une silhouette nette et à fort contraste, quelle que soit la couleur de sa surface ou tout marquage imprimé — le même principe d'extraction de contour utilisé pour toute mesure dimensionnelle, appliqué ici à un comprimé sur un plateau. Pour le film de blister, un dôme diffus éclaire la surface froissée depuis tous les angles simultanément, supprimant le reflet dur unique qu'un éclairage direct créerait, au profit d'un champ uniforme et sans reflet où un véritable défaut d'alvéole ou de scellage se distingue de lui-même.",
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
  return catalog.segments.find((s) => s.slug === "eclairage-vision-medical-pharmaceutique");
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
        keywords: ["pharmaceutical vision", "pill counting", "blister pack inspection", "backlight silhouette"],
      })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Medical & Pharmaceutical Vision"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
      />
    </>
  );
}
