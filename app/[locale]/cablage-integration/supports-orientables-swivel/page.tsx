import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { THIN_CONTENT_LOCALES, NOINDEX_FOLLOW, isThinContentLocale } from "@/lib/thin-content";
import { buildTechArticleWithHowToJsonLd, buildFaqPageJsonLd, type HowToStepInput } from "@/lib/jsonld";
import { ContactForm } from "@/components/ContactForm";
import { SampleTestCTA } from "@/components/SampleTestCTA";

type RichLocale = "en" | "fr";

const ROUTE_KEY = "/cablage-integration/supports-orientables-swivel";
const PUBLISHED_DATE = "2026-08-27";
const MODIFIED_DATE = "2026-08-27";

const RELATED_SLUGS = [
  "brightfield-vs-darkfield",
  "eliminer-reflets-polarisation",
  "brochage-m12-5-pins",
  "retroeclairages-collimates",
];

interface CompareRow {
  criterion: string;
  swivel: string;
  ball: string;
  arm: string;
}

interface Article {
  h1: string;
  lead: string;
  whatTitle: string;
  whatParagraph: string;
  compareTitle: string;
  compareCriterion: string;
  compareRows: CompareRow[];
  mechTitle: string;
  mechParagraph: string;
  stepsTitle: string;
  steps: HowToStepInput[];
  relatedTitle: string;
}

const ARTICLE: Record<RichLocale, Article> = {
  en: {
    h1: "Swivel Mounts & Orientable Brackets for Machine Vision Lighting",
    lead: "The lighting angle is the single most decisive optical parameter for surface-defect detection. A swivel or orientable bracket lets you set that angle on the bench, watch the result live on the camera image, and lock it — without ever moving or refocusing the camera.",
    whatTitle: "What a Swivel Mount Actually Does",
    whatParagraph:
      "Whether a defect shows up at all often comes down to a few degrees of lighting incidence: near-grazing for darkfield scratch and emboss detection, on-axis for brightfield inspection of flat, specular surfaces. A fixed bracket forces you to commit to that angle at design time. A swivel mount decouples the light's angle from its mounting point, giving one lockable rotational axis (sometimes two or three) so you can sweep the incidence angle while looking at the live image, find the angle that maximises defect contrast, and clamp it there repeatably. Because the camera never moves, focus, working distance and calibration are untouched.",
    compareTitle: "Swivel Bracket vs Ball Joint vs Articulated Arm",
    compareCriterion: "Criterion",
    compareRows: [
      {
        criterion: "Degrees of freedom",
        swivel: "1 rotational axis (+ slot travel)",
        ball: "2–3 axes (pan, tilt, roll)",
        arm: "Multi-segment: position + angle",
      },
      {
        criterion: "Angle repeatability",
        swivel: "High — single axis, hard stop or scale",
        ball: "Medium — two axes to re-find at once",
        arm: "Lower — many joints accumulate play",
      },
      {
        criterion: "Rigidity / vibration",
        swivel: "High — short, stiff load path",
        ball: "Medium — depends on clamp torque",
        arm: "Lower — long cantilever, more flex",
      },
      {
        criterion: "Adjustment speed",
        swivel: "Fast for a known plane",
        ball: "Fast for free 3D aiming",
        arm: "Slow, but reaches awkward positions",
      },
      {
        criterion: "Best for",
        swivel: "Bar and line lights at a set incidence",
        ball: "Spot and ring lights needing free aim",
        arm: "Lights that must clear fixtures or reach inside",
      },
    ],
    mechTitle: "Mechanical Integration Notes",
    mechParagraph:
      "Match the bracket's mounting pattern to the light's threaded inserts (M4 and M6 are the common cases on bar lights) and size it for the moment load, not just the mass: a 300 mm bar light on a long arm puts a large torque on the joint and will drift under vibration if the clamp is under-torqued. Route the M12 cable through or along the swivel axis with a service loop so rotating the light never tugs the connector. Use a thread-locking compound on the clamp screws, keep the adjustment range you actually need plus a margin, and check that the bracket does not block the light's own cooling surface or compromise its IP-rated sealing.",
    stepsTitle: "Setting and Locking the Angle",
    steps: [
      {
        name: "Decide the lighting geometry",
        text: "Decide from the defect whether you need brightfield (on-axis) or darkfield (grazing) illumination — this sets the rough incidence-angle band.",
      },
      {
        name: "Estimate the angle range",
        text: "Estimate the incidence-angle range to try, typically 10–30° from the surface for darkfield and near 0° for brightfield.",
      },
      {
        name: "Choose a bracket with margin",
        text: "Choose a bracket whose travel covers that range with margin and has at least one lockable axis in the plane you need.",
      },
      {
        name: "Mount and sweep live",
        text: "Mount the light, open the live camera image and slowly sweep the angle until defect contrast is highest.",
      },
      {
        name: "Lock, torque, re-check",
        text: "Lock the axis, torque the clamp screws to spec with thread-locker, then confirm camera focus and the inspection result are unchanged.",
      },
    ],
    relatedTitle: "Related Optical & Wiring Guides",
  },
  fr: {
    h1: "Supports Orientables et Fixations Swivel pour l'Éclairage de Vision Industrielle",
    lead: "L'angle d'éclairage est le paramètre optique le plus décisif pour la détection de défauts de surface. Un support orientable (swivel) permet de régler cet angle sur le banc, d'en observer le résultat en direct sur l'image caméra, et de le verrouiller — sans jamais déplacer ni refaire la mise au point de la caméra.",
    whatTitle: "Ce Que Fait Réellement un Support Orientable",
    whatParagraph:
      "Qu'un défaut soit visible ou non tient souvent à quelques degrés d'incidence d'éclairage : rasant pour la détection de rayures et d'embossage en darkfield, dans l'axe pour le contrôle brightfield de surfaces planes et spéculaires. Une fixation fixe oblige à figer cet angle dès la conception. Un support orientable découple l'angle de l'éclairage de son point de fixation : il offre un axe de rotation verrouillable (parfois deux ou trois), de sorte que vous pouvez balayer l'angle d'incidence en regardant l'image en direct, trouver l'angle qui maximise le contraste du défaut, et le bloquer là de façon répétable. La caméra ne bougeant pas, la mise au point, la distance de travail et l'étalonnage restent intacts.",
    compareTitle: "Support Swivel vs Rotule vs Bras Articulé",
    compareCriterion: "Critère",
    compareRows: [
      {
        criterion: "Degrés de liberté",
        swivel: "1 axe de rotation (+ course de lumière)",
        ball: "2–3 axes (panoramique, inclinaison, roulis)",
        arm: "Multi-segments : position + angle",
      },
      {
        criterion: "Répétabilité d'angle",
        swivel: "Élevée — axe unique, butée ou graduation",
        ball: "Moyenne — deux axes à retrouver ensemble",
        arm: "Plus faible — le jeu s'accumule sur les articulations",
      },
      {
        criterion: "Rigidité / vibration",
        swivel: "Élevée — chemin d'effort court et rigide",
        ball: "Moyenne — dépend du couple de serrage",
        arm: "Plus faible — long porte-à-faux, plus de flexion",
      },
      {
        criterion: "Rapidité de réglage",
        swivel: "Rapide dans un plan connu",
        ball: "Rapide pour un pointage 3D libre",
        arm: "Lente, mais atteint des positions difficiles",
      },
      {
        criterion: "Idéal pour",
        swivel: "Barres et lignes LED à incidence fixée",
        ball: "Spots et anneaux nécessitant un pointage libre",
        arm: "Éclairages devant contourner un montage ou entrer dedans",
      },
    ],
    mechTitle: "Points d'Intégration Mécanique",
    mechParagraph:
      "Accordez le plan de perçage du support aux inserts filetés de l'éclairage (M4 et M6 sont les cas courants sur les barres LED) et dimensionnez-le sur le moment de charge, pas seulement sur la masse : une barre LED de 300 mm au bout d'un long bras applique un couple important sur l'articulation et dérivera sous vibration si le serrage est insuffisant. Faites passer le câble M12 dans l'axe du swivel ou le long de celui-ci, avec une boucle de service, pour que la rotation de l'éclairage ne tire jamais sur le connecteur. Utilisez un frein-filet sur les vis de serrage, conservez la plage de réglage réellement nécessaire plus une marge, et vérifiez que le support ne masque pas la surface de refroidissement de l'éclairage ni ne compromet son étanchéité IP.",
    stepsTitle: "Régler et Verrouiller l'Angle",
    steps: [
      {
        name: "Choisir la géométrie d'éclairage",
        text: "Déterminez à partir du défaut s'il faut un éclairage brightfield (dans l'axe) ou darkfield (rasant) — cela fixe la plage approximative d'angle d'incidence.",
      },
      {
        name: "Estimer la plage d'angle",
        text: "Estimez la plage d'angle d'incidence à essayer, typiquement 10–30° par rapport à la surface en darkfield, proche de 0° en brightfield.",
      },
      {
        name: "Choisir un support avec marge",
        text: "Choisissez un support dont la course couvre cette plage avec une marge et qui possède au moins un axe verrouillable dans le plan voulu.",
      },
      {
        name: "Monter et balayer en direct",
        text: "Montez l'éclairage, ouvrez l'image caméra en direct et balayez lentement l'angle jusqu'au contraste de défaut le plus élevé.",
      },
      {
        name: "Verrouiller, serrer, recontrôler",
        text: "Verrouillez l'axe, serrez les vis au couple avec frein-filet, puis vérifiez que la mise au point et le résultat d'inspection sont inchangés.",
      },
    ],
    relatedTitle: "Guides Optiques et de Câblage Associés",
  },
};

const FAQS: Record<RichLocale, { question: string; answer: string }[]> = {
  en: [
    {
      question: "What is a swivel mount in machine vision?",
      answer:
        "A swivel mount is a bracket with a lockable rotational axis that holds a light and lets you set its angle relative to the part independently of where it is mounted. It exists because the lighting incidence angle — grazing for darkfield, on-axis for brightfield — is what decides whether a surface defect is visible, and that angle is best tuned empirically on the bench.",
    },
    {
      question: "Swivel bracket or ball joint — which for lighting?",
      answer:
        "Use a single-axis swivel bracket when the light needs a set incidence angle in one known plane, such as a bar light for darkfield: it is the most rigid and the most repeatable. Use a ball joint when a spot or ring light needs free 3D aiming and you can accept re-finding two axes at once.",
    },
    {
      question: "Can I change the lighting angle without refocusing the camera?",
      answer:
        "Yes — that is the main reason to use a swivel mount. The bracket moves only the light, so the camera's focus, working distance and calibration stay fixed while you sweep the incidence angle and lock it at the point of best defect contrast.",
    },
  ],
  fr: [
    {
      question: "Qu'est-ce qu'un support orientable (swivel) en vision industrielle ?",
      answer:
        "Un support orientable est une fixation dotée d'un axe de rotation verrouillable qui tient l'éclairage et permet de régler son angle par rapport à la pièce indépendamment de son point de montage. Il existe parce que l'angle d'incidence de l'éclairage — rasant en darkfield, dans l'axe en brightfield — détermine si un défaut de surface est visible, et cet angle se règle au mieux empiriquement sur le banc.",
    },
    {
      question: "Support swivel ou rotule — lequel pour l'éclairage ?",
      answer:
        "Utilisez un support swivel à axe unique quand l'éclairage a besoin d'un angle d'incidence fixé dans un plan connu, par exemple une barre LED en darkfield : c'est le plus rigide et le plus répétable. Utilisez une rotule quand un spot ou un anneau nécessite un pointage 3D libre et que vous pouvez accepter de retrouver deux axes à la fois.",
    },
    {
      question: "Puis-je changer l'angle d'éclairage sans refaire la mise au point de la caméra ?",
      answer:
        "Oui — c'est la principale raison d'utiliser un support orientable. Le support ne déplace que l'éclairage : la mise au point, la distance de travail et l'étalonnage de la caméra restent fixes pendant que vous balayez l'angle d'incidence et le verrouillez au meilleur contraste de défaut.",
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "supports-orientables-swivel");
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

  const fallback = findCatalogSegment()?.content[locale];
  const isRich = locale === "en" || locale === "fr";

  if (!isRich) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {fallback?.h1 ?? "Swivel Mounts & Brackets"}
        </h1>
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400 dark:border-slate-700">
          {locale === "de" ? "Inhalt in Kürze verfügbar." : "Contenuto in arrivo a breve."}
        </p>
      </main>
    );
  }

  const t = ARTICLE[locale as RichLocale];
  const relatedSegments = RELATED_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const jsonLd = buildTechArticleWithHowToJsonLd({
    path: `/${locale}${ROUTE_KEY}`,
    locale,
    headline: t.h1,
    description: fallback?.metaDescription ?? t.lead,
    image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    dependencies:
      "A machine vision light with M4/M6 threaded inserts, a lockable swivel or orientable bracket, the camera already focused on the part.",
    totalTime: "PT10M",
    steps: t.steps,
  });

  const faqJsonLd = buildFaqPageJsonLd({ path: `/${locale}${ROUTE_KEY}`, locale, faqs: FAQS[locale as RichLocale] });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{t.h1}</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{t.lead}</p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.whatTitle}</h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{t.whatParagraph}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.compareTitle}</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <th className="px-4 py-3">{t.compareCriterion}</th>
                <th className="px-4 py-3">Swivel</th>
                <th className="px-4 py-3">{locale === "fr" ? "Rotule" : "Ball joint"}</th>
                <th className="px-4 py-3">{locale === "fr" ? "Bras articulé" : "Articulated arm"}</th>
              </tr>
            </thead>
            <tbody>
              {t.compareRows.map((row) => (
                <tr key={row.criterion} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{row.criterion}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.swivel}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.ball}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.arm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t.mechTitle}</h2>
        <p className="mt-3">{t.mechParagraph}</p>
        <p className="mt-3">
          {locale === "fr" ? "Détail du câblage : " : "Wiring detail: "}
          <Link
            href="/cablage-integration/brochage-m12-5-pins"
            className="font-medium text-amber-600 hover:underline dark:text-amber-400"
          >
            {locale === "fr" ? "brochage M12 5 broches standard" : "standard M12 5-pin pinout"}
          </Link>
          {locale === "fr"
            ? ". Le brochage ne dépend pas de l'angle de montage — c'est la précision mécanique de l'axe orientable qui décide de la réussite du réglage."
            : ". The pinout does not depend on mounting angle — it is the mechanical precision of the orientable axis that decides whether the setup succeeds."}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.stepsTitle}</h2>
        <ol className="mt-4 space-y-4">
          {t.steps.map((step, index) => (
            <li key={step.name} id={`step-${index + 1}`} className="scroll-mt-20 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {index + 1}. {step.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-14">
        <SampleTestCTA locale={locale as RichLocale} />
      </div>

      <div id="contact-form" className="mt-8 scroll-mt-8">
        <ContactForm locale={locale as RichLocale} contextType="lighting_diagnostic" subjectContext={t.h1} />
      </div>

      {relatedSegments.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.relatedTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedSegments.map((segment) => (
              <li key={segment.slug}>
                <Link
                  href={segment.routeKey as never}
                  className="block rounded-lg border border-slate-200 p-4 text-sm text-slate-700 transition hover:border-amber-500 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-slate-100"
                >
                  {segment.content[locale].name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
