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
import { ContactForm } from "@/components/ContactForm";

const ROUTE_KEY = "/guides-optiques/eclairage-camera-matricielle";
const PUBLISHED_DATE = "2026-08-27";
const MODIFIED_DATE = "2026-08-27";
const PRODUCT_SLUGS = [
  "barres-led-barlights",
  "retroeclairages-backlights",
  "domes-diffus-rainlights",
  "eclairages-coaxiaux",
];
const TOOL_SLUGS = ["eclairage-stroboscopique-overdrive", "brochage-m12-5-pins"];

function WiringContent({ locale }: { locale: RichLocale }) {
  if (locale === "fr") {
    return (
      <p>
        Pour un montage matriciel stroboscopique, le Pin 4 du connecteur M12 5 broches standard porte le trigger, et le
        Pin 1 doit être dimensionné sur le courant de crête overdrive — voir le{" "}
        <Link
          href="/cablage-integration/brochage-m12-5-pins"
          className="font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          brochage M12
        </Link>{" "}
        et le{" "}
        <Link
          href="/cablage-integration/eclairage-stroboscopique-overdrive"
          className="font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          guide de calcul overdrive
        </Link>
        . Pour une intégration Cognex ou Keyence, nos guides de compatibilité caméra{" "}
        <Link
          href="/cablage-integration/compatibilite-camera-cognex"
          className="font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          Cognex
        </Link>{" "}
        et{" "}
        <Link
          href="/cablage-integration/compatibilite-camera-keyence"
          className="font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          Keyence
        </Link>{" "}
        détaillent le trigger et les E/S.
      </p>
    );
  }
  return (
    <p>
      For a strobed area scan setup, Pin 4 of the standard M12 5-pin connector carries the trigger, and Pin 1 must be
      sized for the overdrive peak current — see the{" "}
      <Link
        href="/cablage-integration/brochage-m12-5-pins"
        className="font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        M12 pinout
      </Link>{" "}
      and the{" "}
      <Link
        href="/cablage-integration/eclairage-stroboscopique-overdrive"
        className="font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        overdrive calculation guide
      </Link>
      . If you are integrating with a Cognex or Keyence system, our{" "}
      <Link
        href="/cablage-integration/compatibilite-camera-cognex"
        className="font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        Cognex
      </Link>{" "}
      and{" "}
      <Link
        href="/cablage-integration/compatibilite-camera-keyence"
        className="font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        Keyence
      </Link>{" "}
      camera compatibility guides cover the trigger and I/O details.
    </p>
  );
}

interface CompareRow {
  criterion: string;
  areaScan: string;
  lineScan: string;
}

interface ChecklistItem {
  term: string;
  detail: string;
}

const COMPARE_ROWS: Record<RichLocale, CompareRow[]> = {
  en: [
    { criterion: "Illuminated shape", areaScan: "Full 2D rectangle, uniform", lineScan: "A single bright line" },
    {
      criterion: "Flux concentration",
      areaScan: "Spread over the whole field — lower intensity",
      lineScan: "Concentrated on one line — high intensity",
    },
    {
      criterion: "Shutter",
      areaScan: "Global shutter to freeze the whole frame",
      lineScan: "Sensor integrates line by line",
    },
    {
      criterion: "Motion handling",
      areaScan: "Strobe / overdrive sync, short exposure",
      lineScan: "Line rate matched to part speed",
    },
    {
      criterion: "Typical fixture",
      areaScan: "Bar pair, dome, backlight, ring, coaxial",
      lineScan: "High-output line light or focused line",
    },
  ],
  fr: [
    { criterion: "Forme éclairée", areaScan: "Rectangle 2D complet, uniforme", lineScan: "Une seule ligne lumineuse" },
    {
      criterion: "Concentration du flux",
      areaScan: "Répartie sur tout le champ — intensité plus faible",
      lineScan: "Concentrée sur une ligne — forte intensité",
    },
    {
      criterion: "Obturateur",
      areaScan: "Global shutter pour figer toute l'image",
      lineScan: "Le capteur intègre ligne par ligne",
    },
    {
      criterion: "Gestion du mouvement",
      areaScan: "Sync strobe / overdrive, temps de pose court",
      lineScan: "Fréquence ligne accordée à la vitesse pièce",
    },
    {
      criterion: "Montage typique",
      areaScan: "Paire de barres, dôme, rétroéclairage, anneau, coaxial",
      lineScan: "Éclairage ligne haute intensité ou ligne focalisée",
    },
  ],
};

const CHECKLIST: Record<RichLocale, ChecklistItem[]> = {
  en: [
    { term: "Field of view", detail: "Illuminate the full field of view plus ~10–20% margin so the corners are not vignetted." },
    {
      term: "Line speed",
      detail: "Above roughly 1–2 parts per second, plan for strobe / overdrive and a global-shutter camera.",
    },
    {
      term: "Defect type",
      detail: "Pick the geometry from the defect — glare, low contrast, silhouette, surface relief — then size the intensity.",
    },
  ],
  fr: [
    {
      term: "Champ de vision",
      detail: "Éclairez tout le champ de vision plus ~10–20 % de marge pour que les coins ne soient pas vignettés.",
    },
    {
      term: "Vitesse de ligne",
      detail: "Au-delà d'environ 1–2 pièces par seconde, prévoyez du strobe / overdrive et une caméra global shutter.",
    },
    {
      term: "Type de défaut",
      detail: "Choisissez la géométrie à partir du défaut — reflet, manque de contraste, silhouette, relief de surface — puis dimensionnez l'intensité.",
    },
  ],
};

function ExtraContent({ locale }: { locale: RichLocale }) {
  const rows = COMPARE_ROWS[locale];
  const checklist = CHECKLIST[locale];
  const tableTitle =
    locale === "fr" ? "Éclairage Matriciel vs Linéaire : Ce Qui Change" : "Area Scan vs Line Scan Lighting Requirements";
  const checklistTitle = locale === "fr" ? "Check-list de Sélection" : "Selection Checklist";
  const colCriterion = locale === "fr" ? "Critère" : "Criterion";
  const colArea = locale === "fr" ? "Caméra matricielle" : "Area scan camera";
  const colLine = locale === "fr" ? "Caméra linéaire" : "Line scan camera";

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{tableTitle}</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <th className="px-4 py-3">{colCriterion}</th>
              <th className="px-4 py-3">{colArea}</th>
              <th className="px-4 py-3">{colLine}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.criterion} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.criterion}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.areaScan}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.lineScan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{checklistTitle}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {checklist.map((item) => (
          <div
            key={item.term}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <dt className="font-semibold text-slate-900 dark:text-slate-100">{item.term}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

const RICH_CONTENT: Record<RichLocale, GuideRichContent> = {
  en: {
    h1: "Lighting for Area Scan Cameras: How to Choose the Right Illumination",
    lead: "An area scan camera captures the whole 2D field in a single exposure, so every square millimetre of the field of view has to be lit evenly at the same instant. That one constraint drives almost every lighting decision that follows.",
    principlesTitle: "Matching the Lighting to an Area Scan Sensor",
    problemTitle: "The Physical Problem",
    problemParagraph:
      "Unlike a line scan setup, where all the available light can be concentrated into a single bright line the part is transported through, an area scan camera needs the entire rectangular field of view illuminated uniformly in one shot. Two consequences follow. First, the same total light output is spread over a much larger area, so effective intensity at the sensor is lower and either the exposure has to lengthen or the light has to be brighter. Second, any exposure long enough to gather that light while the part is moving smears the whole frame, not just one row — motion blur is a full-frame problem on an area scan sensor.",
    solutionTitle: "The Lighting Solution",
    solutionParagraph:
      "Start by sizing the illuminated area to the full field of view plus a margin, so the corners are not left dim — uniformity matters because a bright-to-dark gradient across the frame reads to the inspection algorithm as a real change in the part. Then choose the geometry from the defect, not the camera: a bar light or brightfield ring for direct front lighting, a diffuse dome for reflective or curved parts, a backlight for silhouette and dimensional measurement, a coaxial light for flat specular surfaces on the camera axis. For moving parts, drive the light in strobe or overdrive mode synchronised to the camera trigger and use a global-shutter sensor, so the whole frame is exposed in one short flash that freezes motion. Keep the strobe pulse inside the exposure window and within the light's duty-cycle limit.",
    wiringTitle: "Wiring & Integration",
    wiringContent: <WiringContent locale="en" />,
    extraContent: <ExtraContent locale="en" />,
    productsTitle: PRODUCTS_TITLE.en,
    toolsTitle: TOOLS_TITLE.en,
  },
  fr: {
    h1: "Éclairage pour Caméras Matricielles (Area Scan) : Comment Bien Choisir",
    lead: "Une caméra matricielle (area scan) capture tout le champ 2D en une seule exposition : chaque millimètre carré du champ de vision doit donc être éclairé uniformément au même instant. Cette seule contrainte gouverne presque toutes les décisions d'éclairage qui suivent.",
    principlesTitle: "Accorder l'Éclairage au Capteur Matriciel",
    problemTitle: "Le Problème Physique",
    problemParagraph:
      "Contrairement à un montage linéaire, où toute la lumière disponible peut être concentrée sur une seule ligne lumineuse que la pièce traverse, une caméra matricielle a besoin que tout le rectangle du champ de vision soit éclairé uniformément en une prise. Deux conséquences. D'abord, le même flux total est réparti sur une surface bien plus grande : l'intensité effective au capteur est plus faible, et il faut soit allonger le temps de pose, soit augmenter la puissance. Ensuite, tout temps de pose assez long pour collecter cette lumière pendant que la pièce bouge étale toute l'image, pas seulement une ligne — le flou de mouvement est un problème plein cadre sur un capteur matriciel.",
    solutionTitle: "La Solution d'Éclairage",
    solutionParagraph:
      "Commencez par dimensionner la zone éclairée sur tout le champ de vision plus une marge, pour que les coins ne restent pas sombres — l'homogénéité compte, car un dégradé clair-sombre dans l'image est interprété par l'algorithme comme une vraie variation de la pièce. Choisissez ensuite la géométrie à partir du défaut, pas de la caméra : une barre LED ou un anneau brightfield pour un éclairage frontal direct, un dôme diffus pour les pièces réfléchissantes ou courbes, un rétroéclairage pour la silhouette et la mesure dimensionnelle, un éclairage coaxial pour les surfaces planes spéculaires dans l'axe caméra. Pour les pièces en mouvement, pilotez l'éclairage en mode strobe ou overdrive synchronisé au trigger caméra et utilisez un capteur global shutter, afin que toute l'image soit exposée en un flash court qui fige le mouvement. Gardez l'impulsion strobe dans la fenêtre d'exposition et dans la limite de rapport cyclique de l'éclairage.",
    wiringTitle: "Câblage et Intégration",
    wiringContent: <WiringContent locale="fr" />,
    extraContent: <ExtraContent locale="fr" />,
    productsTitle: PRODUCTS_TITLE.fr,
    toolsTitle: TOOLS_TITLE.fr,
  },
};

const FAQS: Record<RichLocale, { question: string; answer: string }[]> = {
  en: [
    {
      question: "What lighting is best for an area scan camera?",
      answer:
        "There is no single best light — the geometry is chosen from the defect: a bar light or brightfield ring for direct front lighting, a diffuse dome for reflective or curved parts, a backlight for dimensional measurement, a coaxial light for flat specular surfaces. What is specific to an area scan camera is that whichever geometry you pick must illuminate the entire field of view uniformly in one exposure.",
    },
    {
      question: "Do I need strobe lighting with an area scan camera?",
      answer:
        "Only if the part is moving. Because an area scan sensor exposes the whole frame at once, any exposure long enough to gather light on a moving part blurs the entire image. Driving the light in strobe or overdrive mode synchronised to the trigger, with a global-shutter sensor, replaces a long exposure with one short bright flash that freezes motion.",
    },
    {
      question: "How is lighting for an area scan camera different from a line scan camera?",
      answer:
        "A line scan setup concentrates all its light into a single bright line that the part is moved through, so intensity on that line is very high. An area scan camera needs the full rectangular field lit evenly in one shot, so the same output is spread thinner and uniformity across the whole frame, not just one line, becomes the priority.",
    },
  ],
  fr: [
    {
      question: "Quel éclairage pour une caméra matricielle (area scan) ?",
      answer:
        "Il n'y a pas d'éclairage unique idéal — la géométrie se choisit à partir du défaut : une barre LED ou un anneau brightfield pour un éclairage frontal direct, un dôme diffus pour les pièces réfléchissantes ou courbes, un rétroéclairage pour la mesure dimensionnelle, un éclairage coaxial pour les surfaces planes spéculaires. Ce qui est propre à une caméra matricielle, c'est que la géométrie retenue doit éclairer tout le champ de vision uniformément en une seule exposition.",
    },
    {
      question: "Faut-il un éclairage stroboscopique avec une caméra matricielle ?",
      answer:
        "Seulement si la pièce bouge. Comme un capteur matriciel expose toute l'image d'un coup, tout temps de pose assez long pour collecter la lumière sur une pièce en mouvement floute l'image entière. Piloter l'éclairage en mode strobe ou overdrive synchronisé au trigger, avec un capteur global shutter, remplace un temps de pose long par un flash court et intense qui fige le mouvement.",
    },
    {
      question: "En quoi l'éclairage d'une caméra matricielle diffère-t-il d'une caméra linéaire ?",
      answer:
        "Un montage linéaire concentre toute sa lumière sur une seule ligne lumineuse que la pièce traverse : l'intensité sur cette ligne est très élevée. Une caméra matricielle a besoin que tout le rectangle du champ soit éclairé uniformément en une prise : le même flux est réparti plus finement, et l'homogénéité sur toute l'image, pas seulement sur une ligne, devient la priorité.",
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "eclairage-camera-matricielle");
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
          "lighting for area scan camera",
          "area scan camera lighting",
          "éclairage caméra matricielle",
          "area scan",
          "strobe lighting",
          "global shutter",
          "machine vision lighting",
          "field of view uniformity",
        ],
      })
    : null;

  const faqJsonLd = rich
    ? buildFaqPageJsonLd({ path: `/${locale}${ROUTE_KEY}`, locale, faqs: FAQS[locale as RichLocale] })
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <GuidePageContent
        rich={rich}
        placeholderH1={fallback?.h1 ?? "Lighting for Area Scan Cameras"}
        placeholderComingSoon={PLACEHOLDER_COMING_SOON[locale as "de" | "it"] ?? "Content coming soon."}
        productSegments={productSegments}
        toolSegments={toolSegments}
        locale={locale}
        contactSlot={
          isRich ? (
            <ContactForm
              locale={locale as RichLocale}
              contextType="lighting_diagnostic"
              subjectContext={RICH_CONTENT[locale as RichLocale].h1}
            />
          ) : undefined
        }
      />
    </>
  );
}
