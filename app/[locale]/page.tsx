import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildOrganizationAndWebsiteJsonLd } from "@/lib/jsonld";
import { ReassuranceBar } from "@/components/ReassuranceBar";
import { CaseStudies } from "@/components/CaseStudies";

const COPY: Record<Locale, { metaTitle: string; metaDescription: string; heroTitle: string; heroBody: string }> = {
  en: {
    metaTitle: "Machine Vision Lighting Solutions | LED Illumination",
    metaDescription:
      "Vision Lighting Solutions designs and supplies LED lighting for machine vision: bar lights, backlights, coaxial and dome lights — request a quote.",
    heroTitle: "Machine Vision Lighting, Engineered for Reliable Inspection",
    heroBody:
      "From LED bar lights to coaxial and dome lighting, we help integrators and manufacturers choose, wire and deploy the right illumination for every inspection challenge.",
  },
  fr: {
    metaTitle: "Solutions d'Éclairage Vision Industrielle | Éclairage LED",
    metaDescription:
      "Vision Lighting Solutions conçoit des éclairages LED pour la vision industrielle : barres, rétroéclairages, dômes et coaxiaux — demandez un devis.",
    heroTitle: "L'Éclairage Vision Industrielle, Pensé pour une Inspection Fiable",
    heroBody:
      "Des barres LED aux éclairages coaxiaux et dômes diffus, nous aidons intégrateurs et industriels à choisir, câbler et déployer l'éclairage adapté à chaque défi d'inspection.",
  },
  de: {
    metaTitle: "Beleuchtungslösungen für die Bildverarbeitung | LED-Beleuchtung",
    metaDescription:
      "Vision Lighting Solutions entwickelt und liefert LED-Beleuchtung für die Bildverarbeitung: Balkenleuchten, Hintergrundbeleuchtung, Koaxial- und Kuppelleuchten, Äquivalente und Integrationsleitfäden.",
    heroTitle: "Vision-Beleuchtung, Konzipiert für Zuverlässige Inspektion",
    heroBody:
      "Von LED-Balkenleuchten bis zu Koaxial- und Kuppelbeleuchtung helfen wir Integratoren und Herstellern, die richtige Beleuchtung für jede Inspektionsaufgabe zu wählen, zu verkabeln und einzusetzen.",
  },
  it: {
    metaTitle: "Soluzioni di Illuminazione per la Visione Industriale | Illuminazione LED",
    metaDescription:
      "Vision Lighting Solutions progetta e fornisce illuminazioni LED per la visione industriale: barre, retroilluminazioni, cupole e illuminazioni coassiali, equivalenze e guide di integrazione.",
    heroTitle: "Illuminazione per la Visione Industriale, Progettata per un'Ispezione Affidabile",
    heroBody:
      "Dalle barre LED alle illuminazioni coassiali e a cupola, aiutiamo integratori e produttori a scegliere, cablare e implementare l'illuminazione giusta per ogni sfida di ispezione.",
  },
};

type RichLocale = "en" | "fr";

interface MethodologyStep {
  title: string;
  body: string;
  href: string;
}

interface OpticalChallenge {
  label: string;
  body: string;
  href: string;
}

interface RichHomeContent {
  methodologyTitle: string;
  methodologyIntro: string;
  methodologySteps: MethodologyStep[];
  challengeTitle: string;
  challengeIntro: string;
  challenges: OpticalChallenge[];
  siloSectionTitle: string;
}

const RICH_HOME: Record<RichLocale, RichHomeContent> = {
  en: {
    methodologyTitle: "Our Optical Analysis Methodology",
    methodologyIntro:
      "Before recommending a product, we work through the same three-step analysis on every application — the order matters, because each step constrains the next.",
    methodologySteps: [
      {
        title: "1. Wavelength Selection",
        body: "Match the LED wavelength to what needs to stand out — a color's own wavelength brightens it, its complementary wavelength darkens it. Getting this step right often solves a contrast problem before touching anything else.",
        href: "/guides-optiques/choisir-couleur-led-vision",
      },
      {
        title: "2. Peak vs. Continuous Power",
        body: "Decide whether the application needs continuous illumination or a strobed overdrive pulse — and if overdrive, calculate the resulting duty cycle before wiring anything, since exceeding it is the fastest way to destroy an LED array.",
        href: "/cablage-integration/eclairage-stroboscopique-overdrive",
      },
      {
        title: "3. Lighting Geometry",
        body: "Choose the lighting angle and format based on what the defect actually is, not the part in general: brightfield for flat mirror-like surfaces viewed on-axis, darkfield for surface-relief defects like scratches, diffuse dome lighting for curved or reflective parts.",
        href: "/guides-optiques/brightfield-vs-darkfield",
      },
    ],
    challengeTitle: "What's Your Optical Challenge?",
    challengeIntro: "Start from the problem your camera is having, not the product catalog.",
    challenges: [
      {
        label: "Glare & Reflections",
        body: "A hot spot is clipping your sensor and hiding what's underneath.",
        href: "/guides-optiques/eliminer-reflets-polarisation",
      },
      {
        label: "Low Contrast",
        body: "Two distinct features read as the same gray level to your camera.",
        href: "/guides-optiques/choisir-couleur-led-vision",
      },
      {
        label: "High-Speed Lines",
        body: "Parts move too fast for continuous lighting without motion blur.",
        href: "/cablage-integration/eclairage-stroboscopique-overdrive",
      },
      {
        label: "Washdown Environment",
        body: "A standard aluminum housing won't survive high-pressure, high-temperature cleaning.",
        href: "/guides-optiques/eclairage-inox-ip69k-agroalimentaire",
      },
    ],
    siloSectionTitle: "Explore by Silo",
  },
  fr: {
    methodologyTitle: "Notre Méthodologie d'Analyse Optique",
    methodologyIntro:
      "Avant de recommander un produit, nous appliquons la même analyse en trois étapes à chaque application — l'ordre compte, car chaque étape contraint la suivante.",
    methodologySteps: [
      {
        title: "1. Choix de la Longueur d'Onde",
        body: "Faire correspondre la longueur d'onde LED à ce qui doit ressortir — la longueur d'onde propre d'une couleur l'éclaircit, sa complémentaire l'assombrit. Bien traiter cette étape résout souvent un problème de contraste avant même de toucher au reste.",
        href: "/guides-optiques/choisir-couleur-led-vision",
      },
      {
        title: "2. Calcul de la Puissance Crête/Continue",
        body: "Déterminer si l'application requiert un éclairage continu ou une impulsion stroboscopique en overdrive — et si overdrive, calculer le rapport cyclique résultant avant tout câblage, car le dépasser est le moyen le plus rapide de détruire un ensemble LED.",
        href: "/cablage-integration/eclairage-stroboscopique-overdrive",
      },
      {
        title: "3. Géométrie d'Éclairage",
        body: "Choisir l'angle et le format d'éclairage en fonction de ce qu'est réellement le défaut, et non de la pièce en général : brightfield pour les surfaces plates de type miroir observées dans l'axe, darkfield pour les défauts de relief comme les rayures, dôme diffus pour les pièces courbes ou réfléchissantes.",
        href: "/guides-optiques/brightfield-vs-darkfield",
      },
    ],
    challengeTitle: "Quel Est Votre Défi Optique ?",
    challengeIntro: "Partez du problème que rencontre votre caméra, pas du catalogue produit.",
    challenges: [
      {
        label: "Reflets Saturants",
        body: "Un point chaud sature votre capteur et masque ce qu'il y a dessous.",
        href: "/guides-optiques/eliminer-reflets-polarisation",
      },
      {
        label: "Manque de Contraste",
        body: "Deux éléments distincts apparaissent au même niveau de gris pour votre caméra.",
        href: "/guides-optiques/choisir-couleur-led-vision",
      },
      {
        label: "Cadence Élevée",
        body: "Les pièces se déplacent trop vite pour un éclairage continu sans flou de mouvement.",
        href: "/cablage-integration/eclairage-stroboscopique-overdrive",
      },
      {
        label: "Environnement Lavable",
        body: "Un boîtier aluminium standard ne survit pas à un lavage haute pression et haute température.",
        href: "/guides-optiques/eclairage-inox-ip69k-agroalimentaire",
      },
    ],
    siloSectionTitle: "Explorer par Silo",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: buildLanguageAlternates("/", locale),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];
  const rich = locale === "en" || locale === "fr" ? RICH_HOME[locale] : null;
  const jsonLd = buildOrganizationAndWebsiteJsonLd();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="mt-6 max-w-2xl text-slate-600 dark:text-slate-300">{t.heroBody}</p>
      </section>

      {rich && (
        <>
          <div className="mt-10">
            <ReassuranceBar locale={locale as "en" | "fr"} variant="full" />
          </div>

          <section className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {rich.methodologyTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{rich.methodologyIntro}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {rich.methodologySteps.map((step) => (
                <Link
                  key={step.title}
                  href={step.href as never}
                  className="rounded-xl border border-slate-200 p-6 transition hover:border-amber-500 hover:shadow-sm dark:border-slate-800 dark:hover:border-amber-500"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.body}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {rich.challengeTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{rich.challengeIntro}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rich.challenges.map((challenge) => (
                <Link
                  key={challenge.label}
                  href={challenge.href as never}
                  className="rounded-xl border border-slate-200 p-6 transition hover:border-amber-500 hover:shadow-sm dark:border-slate-800 dark:hover:border-amber-500"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{challenge.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{challenge.body}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <CaseStudies locale={locale as "en" | "fr"} />
          </section>
        </>
      )}

      <section className="mt-20">
        {rich && (
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {rich.siloSectionTitle}
          </h2>
        )}
        <div className={"grid gap-6 sm:grid-cols-2 lg:grid-cols-4" + (rich ? " mt-8" : "")}>
          {catalog.silos.map((silo) => (
            <Link
              key={silo.slug}
              href={silo.routeKey as never}
              className="rounded-xl border border-slate-200 p-6 transition hover:border-amber-500 hover:shadow-sm dark:border-slate-800 dark:hover:border-amber-500"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{silo.content[locale].name}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{silo.content[locale].metaDescription}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
