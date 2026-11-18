import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { THIN_CONTENT_LOCALES, NOINDEX_FOLLOW, isThinContentLocale } from "@/lib/thin-content";
import { buildProductModelJsonLd, buildFaqPageJsonLd } from "@/lib/jsonld";
import {
  TABLE_LABELS,
  DISCLAIMER_NOTE,
  PLACEHOLDER_COMING_SOON,
  type RichLocale,
} from "@/lib/product-shared-content";
import { getDatasheetHref } from "@/lib/technical-downloads";
import { ProductPageContent, type ProductRichContent } from "@/components/ProductPageContent";
import type { ProductConfigRow } from "@/components/ProductConfigTable";

const PRODUCT_SLUG = "retroeclairages-collimates";
const ROUTE_KEY = "/eclairages/retroeclairages-collimates";
const PUBLISHED_DATE = "2026-08-27";
const MODIFIED_DATE = "2026-08-27";

const PAGE_RELATED_SLUGS = [
  "retroeclairages-backlights",
  "supports-orientables-swivel",
  "brochage-m12-5-pins",
  "eclairage-stroboscopique-overdrive",
];

const ROWS: Record<RichLocale, ProductConfigRow[]> = {
  en: [
    {
      fieldType: "Diffuse backlight (reference)",
      wavelengths: "White, Red 625 nm, IR 850 nm",
      opticalWindow: "Any size; edge sharpness falls off as the part gets thicker",
      operatingMode: "Continuous or Strobe / Overdrive",
    },
    {
      fieldType: "Collimated backlight (±3–5° half-angle)",
      wavelengths: "Green 525 nm, Red 625 nm, Blue 460 nm",
      opticalWindow: "50×50 mm to 200×200 mm active area (alignment-sensitive)",
      operatingMode: "Continuous or Strobe / Overdrive",
    },
    {
      fieldType: "Telecentric backlight (±1° half-angle)",
      wavelengths: "Green 525 nm (best lens MTF), Red 625 nm",
      opticalWindow: "Matched to the telecentric lens Ø; typ. 25–96 mm",
      operatingMode: "Continuous or Strobe / Overdrive",
    },
  ],
  fr: [
    {
      fieldType: "Rétroéclairage diffus (référence)",
      wavelengths: "Blanc, Rouge 625 nm, IR 850 nm",
      opticalWindow: "Toute taille ; la netteté des bords chute avec l'épaisseur de la pièce",
      operatingMode: "Continu ou Strobe / Overdrive",
    },
    {
      fieldType: "Rétroéclairage collimaté (demi-angle ±3–5°)",
      wavelengths: "Vert 525 nm, Rouge 625 nm, Bleu 460 nm",
      opticalWindow: "Zone active 50×50 mm à 200×200 mm (sensible à l'alignement)",
      operatingMode: "Continu ou Strobe / Overdrive",
    },
    {
      fieldType: "Rétroéclairage télécentrique (demi-angle ±1°)",
      wavelengths: "Vert 525 nm (meilleure FTM objectif), Rouge 625 nm",
      opticalWindow: "Adapté au Ø de l'objectif télécentrique ; typ. 25–96 mm",
      operatingMode: "Continu ou Strobe / Overdrive",
    },
  ],
};

function IntegrationContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Associez ce format à un{" "}
        <Link
          href="/cablage-integration/supports-orientables-swivel"
          className="font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          support orientable ou à réglage fin
        </Link>{" "}
        pour que le panneau collimaté soit parfaitement perpendiculaire à l&apos;axe caméra. Pour l&apos;intégration
        électrique, le{" "}
        <Link
          href="/cablage-integration/brochage-m12-5-pins"
          className="font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          brochage M12 5 broches standard
        </Link>{" "}
        s&apos;applique, et en fonctionnement stroboscopique, notre{" "}
        <Link
          href="/cablage-integration/eclairage-stroboscopique-overdrive"
          className="font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          guide de calcul overdrive
        </Link>{" "}
        garde le rapport cyclique sûr. Vous remplacez un rétroéclairage collimaté ou télécentrique d&apos;une autre
        marque ? Notre{" "}
        <Link href="/equivalences" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
          table d&apos;équivalences et de dual sourcing
        </Link>{" "}
        liste les alternatives compatibles.
      </p>
    );
  }
  return (
    <p>
      Pair this format with a{" "}
      <Link
        href="/cablage-integration/supports-orientables-swivel"
        className="font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        fine-adjust or swivel bracket
      </Link>{" "}
      so the collimated panel sits exactly square to the camera axis. For electrical integration, the{" "}
      <Link
        href="/cablage-integration/brochage-m12-5-pins"
        className="font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        standard M12 5-pin pinout
      </Link>{" "}
      applies, and if you run it strobed, our{" "}
      <Link
        href="/cablage-integration/eclairage-stroboscopique-overdrive"
        className="font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        overdrive calculation guide
      </Link>{" "}
      keeps the duty cycle safe. Replacing another brand&apos;s collimated or telecentric backlight? Our{" "}
      <Link href="/equivalences" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
        brand equivalence &amp; dual-sourcing table
      </Link>{" "}
      lists compatible alternatives.
    </p>
  );
}

const RICH_CONTENT: Record<RichLocale, ProductRichContent> = {
  en: {
    h1: "Collimated Backlights for High-Precision Machine Vision Measurement",
    lead: "A collimated backlight emits near-parallel rays instead of light scattered in every direction — so the silhouette edge is set by the part's true geometry, not by whichever ray happened to graze it. It is the reference format for micron-level dimensional measurement.",
    principlesTitle: "Collimated Backlighting: Principle and Advantages",
    introTitle: "What a Collimated Backlight Is and When to Use It",
    introParagraph:
      "A standard diffuse backlight radiates light at all angles. On a thin, flat part that is fine, but on a part with any thickness the camera also collects rays that pass the edge at a shallow angle, so the measured edge blurs and shifts depending on where the part sits in the field — a systematic measurement error. A collimated backlight uses a lens or a structured film to send rays nearly parallel to the optical axis. Only rays travelling straight toward the lens reach the sensor, so the silhouette edge is defined by the part's real profile and stays stable across the field of view. Use a collimated backlight for dimensional gauging of machined parts, thread and bore inspection, glass and transparent-part edges, and any measurement where repeatability at the micron level matters — especially when it is paired with a telecentric lens.",
    highlightsTitle: "Selection Criteria: Collimation Angle, Wavelength, Footprint",
    highlights: [
      "Collimation half-angle: ±1° to ±5° typical. A tighter angle gives sharper edges on thick parts but a smaller usable area and a tighter mechanical alignment tolerance to the camera axis.",
      "Wavelength: green 525 nm is the common default — short enough for a sharp edge and where most lenses have their best MTF; blue 460 nm for the finest edges, red 625 nm for compatibility with existing red setups, IR 850 nm to see through some plastics.",
      "Footprint and depth: the active area must cover the largest part plus margin, and there must be room behind the conveyor for the collimating optic, which is deeper than a flat diffuse panel.",
      "Telecentric-lens pairing: the backlight's collimation angle should meet or exceed the lens acceptance angle, otherwise the lens re-introduces the edge error the backlight removed.",
      "Alignment: a collimated source must sit square to the camera axis — pair it with a fine-adjust or swivel bracket so the opposition can be set and locked precisely.",
    ],
    tableLabels: TABLE_LABELS.en,
    rows: ROWS.en,
    disclaimerNote: DISCLAIMER_NOTE.en,
    integrationContent: <IntegrationContent locale="en" />,
    relatedTitle: "Integration Guides & Related Formats",
    contactFormContextType: "lighting_diagnostic",
  },
  fr: {
    h1: "Rétroéclairages Collimatés Haute Précision pour la Vision Industrielle",
    lead: "Un rétroéclairage collimaté émet des rayons quasi parallèles au lieu d'une lumière diffusée dans toutes les directions — le bord de la silhouette est alors défini par la géométrie réelle de la pièce, et non par le rayon qui l'a effleuré. C'est le format de référence pour la mesure dimensionnelle au micron.",
    principlesTitle: "Rétroéclairage Collimaté : Principe et Avantages",
    introTitle: "Ce Qu'est un Rétroéclairage Collimaté et Quand l'Utiliser",
    introParagraph:
      "Un rétroéclairage diffus standard rayonne la lumière dans toutes les directions. Sur une pièce fine et plane, c'est sans conséquence, mais sur une pièce présentant une épaisseur, la caméra capte aussi des rayons qui franchissent le bord sous un angle rasant : le bord mesuré devient flou et se déplace selon la position de la pièce dans le champ — une erreur de mesure systématique. Un rétroéclairage collimaté utilise une lentille ou un film structuré pour envoyer des rayons quasi parallèles à l'axe optique. Seuls les rayons se dirigeant droit vers l'objectif atteignent le capteur : le bord de la silhouette est défini par le profil réel de la pièce et reste stable dans tout le champ de vision. Utilisez un rétroéclairage collimaté pour la mesure dimensionnelle de pièces usinées, le contrôle de filetages et d'alésages, les bords de verre et de pièces transparentes, et toute mesure exigeant une répétabilité au micron — en particulier associé à un objectif télécentrique.",
    highlightsTitle: "Critères de Choix : Angle de Collimation, Longueur d'Onde, Encombrement",
    highlights: [
      "Demi-angle de collimation : ±1° à ±5° typique. Un angle plus serré donne des bords plus nets sur les pièces épaisses, mais une surface utile plus petite et une tolérance d'alignement mécanique plus stricte par rapport à l'axe caméra.",
      "Longueur d'onde : le vert 525 nm est le choix courant — assez court pour un bord net et là où la plupart des objectifs ont leur meilleure FTM ; bleu 460 nm pour les bords les plus fins, rouge 625 nm pour la compatibilité avec un montage rouge existant, IR 850 nm pour traverser certains plastiques.",
      "Encombrement et profondeur : la zone active doit couvrir la plus grande pièce avec une marge, et il faut de la place derrière le convoyeur pour l'optique de collimation, plus profonde qu'un panneau diffus plat.",
      "Association objectif télécentrique : l'angle de collimation du rétroéclairage doit être au moins égal à l'angle d'acceptance de l'objectif, sinon l'objectif réintroduit l'erreur de bord que le rétroéclairage a supprimée.",
      "Alignement : une source collimatée doit être perpendiculaire à l'axe caméra — associez-la à un support orientable ou à réglage fin pour régler et verrouiller l'opposition avec précision.",
    ],
    tableLabels: TABLE_LABELS.fr,
    rows: ROWS.fr,
    disclaimerNote: DISCLAIMER_NOTE.fr,
    integrationContent: <IntegrationContent locale="fr" />,
    relatedTitle: "Guides d'Intégration et Formats Associés",
    contactFormContextType: "lighting_diagnostic",
  },
};

const FAQS: Record<RichLocale, { question: string; answer: string }[]> = {
  en: [
    {
      question: "What is the difference between a collimated and a diffuse backlight?",
      answer:
        "A diffuse backlight radiates light at all angles; a collimated backlight sends near-parallel rays along the optical axis. On a part with any thickness, the diffuse version lets the camera collect edge-grazing rays, so the measured edge blurs and shifts with part position, while the collimated version keeps the silhouette edge defined by the part's true profile and stable across the field.",
    },
    {
      question: "When should I use a collimated backlight instead of a diffuse one?",
      answer:
        "Use a collimated backlight for dimensional gauging of machined parts, thread and bore inspection, glass and transparent-part edges, and any measurement needing micron-level repeatability — particularly when it is paired with a telecentric lens. A diffuse backlight remains adequate for thin, flat parts and simple presence or counting checks.",
    },
    {
      question: "Does a collimated backlight need a telecentric lens?",
      answer:
        "Not always, but the two are complementary. The backlight's collimation angle should meet or exceed the lens acceptance angle; pairing a collimated backlight with a telecentric lens gives the most position-independent measurement, whereas a standard entocentric lens can re-introduce part of the edge error on thick parts.",
    },
  ],
  fr: [
    {
      question: "Quelle est la différence entre un rétroéclairage collimaté et un rétroéclairage diffus ?",
      answer:
        "Un rétroéclairage diffus émet la lumière dans toutes les directions ; un rétroéclairage collimaté envoie des rayons quasi parallèles à l'axe optique. Sur une pièce présentant une épaisseur, la version diffuse laisse la caméra capter des rayons rasant le bord : le bord mesuré devient flou et se déplace selon la position de la pièce, alors que la version collimatée garde le bord de la silhouette défini par le profil réel et stable dans tout le champ.",
    },
    {
      question: "Quand utiliser un rétroéclairage collimaté plutôt que diffus ?",
      answer:
        "Utilisez un rétroéclairage collimaté pour la mesure dimensionnelle de pièces usinées, le contrôle de filetages et d'alésages, les bords de verre et de pièces transparentes, et toute mesure exigeant une répétabilité au micron — en particulier associé à un objectif télécentrique. Un rétroéclairage diffus reste suffisant pour les pièces fines et planes et les contrôles simples de présence ou de comptage.",
    },
    {
      question: "Un rétroéclairage collimaté nécessite-t-il un objectif télécentrique ?",
      answer:
        "Pas toujours, mais les deux sont complémentaires. L'angle de collimation du rétroéclairage doit être au moins égal à l'angle d'acceptance de l'objectif ; l'association d'un rétroéclairage collimaté et d'un objectif télécentrique donne la mesure la plus indépendante de la position, tandis qu'un objectif entocentrique standard peut réintroduire une partie de l'erreur de bord sur les pièces épaisses.",
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === PRODUCT_SLUG);
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

  const relatedSegments = PAGE_RELATED_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const isRich = locale === "en" || locale === "fr";
  const rich = isRich ? RICH_CONTENT[locale as RichLocale] : null;
  const datasheetHref = isRich ? getDatasheetHref(PRODUCT_SLUG, locale as RichLocale) : null;
  const fallback = findCatalogSegment()?.content[locale];

  const jsonLd = rich
    ? buildProductModelJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        name: rich.h1,
        description: fallback?.metaDescription ?? rich.lead,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        category: "Machine Vision Collimated LED Backlights",
        additionalProperties: [
          { name: "Collimation Half-Angle", value: "±1° to ±5° (configuration dependent)" },
          { name: "Power Supply", value: "24VDC industrial" },
          { name: "Connector", value: "M12, 5-pin" },
          { name: "Available Wavelengths", value: "Green 525 nm, Blue 460 nm, Red 625 nm, IR 850 nm (configuration dependent)" },
        ],
        configurations: ROWS[locale as RichLocale].map((r) => ({
          name: r.fieldType,
          wavelengths: r.wavelengths,
          opticalWindow: r.opticalWindow,
          operatingMode: r.operatingMode,
        })),
      })
    : null;

  const faqJsonLd = rich
    ? buildFaqPageJsonLd({ path: `/${locale}${ROUTE_KEY}`, locale, faqs: FAQS[locale as RichLocale] })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <ProductPageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Collimated Backlights"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        relatedSegments={relatedSegments}
        locale={locale}
        datasheetHref={datasheetHref}
      />
    </>
  );
}
