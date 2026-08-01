import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { THIN_CONTENT_LOCALES, NOINDEX_FOLLOW, isThinContentLocale } from "@/lib/thin-content";
import { buildTechArticleJsonLd } from "@/lib/jsonld";
import { ContactForm } from "@/components/ContactForm";
import { SampleTestCTA } from "@/components/SampleTestCTA";
import { ReassuranceBar } from "@/components/ReassuranceBar";
import { EquivalenceFastTracks } from "@/components/EquivalenceFastTracks";

const ROUTE_KEY = "/equivalences/guide-interchangeabilite-led";
const PUBLISHED_DATE = "2026-08-01";
const MODIFIED_DATE = "2026-08-01";

/** The only two locales with written body copy for this guide. */
type RichLocale = "en" | "fr";

const BRAND_MENTIONS = ["TPL Vision", "Advanced Illumination", "Smart Vision Lights"];

interface MethodStep {
  title: string;
  body: string;
}

interface RichContent {
  h1: string;
  lead: string;
  methodTitle: string;
  methodIntro: string;
  steps: [MethodStep, MethodStep, MethodStep, MethodStep];
  cautionTitle: string;
  cautionBody: string;
  contactTitle: string;
  brandsTitle: string;
  brandsIntro: string;
}

const RICH_CONTENT: Record<RichLocale, RichContent> = {
  fr: {
    h1: "Guide d'Interchangeabilité et Remplacement des Éclairages LED",
    lead: "Remplacer un éclairage LED vision industrielle par un équivalent compatible ne se résume pas à trouver une référence qui « ressemble » à l'originale. Quatre critères, vérifiés dans cet ordre, déterminent si une alternative peut réellement se substituer à la référence d'origine sans reprise de câblage ni de programme automate.",
    methodTitle: "La Méthode en 4 Étapes pour Remplacer un Éclairage LED",
    methodIntro:
      "Chaque étape contraint la suivante : un format incompatible rend inutile la vérification de la tension, une tension incompatible rend inutile la vérification du connecteur, et ainsi de suite. Vérifiez-les dans cet ordre.",
    steps: [
      {
        title: "1. Format Monomodule",
        body: "Confirmez d'abord que l'éclairage d'origine est bien un format monomodule (corps aluminium unique intégrant LED, diffuseur et électronique) et non une architecture modulaire pilotée par un contrôleur externe. Un remplacement direct ne fonctionne qu'entre deux produits de la même architecture — comparer un monomodule à un système modulaire aboutit presque toujours à un remplacement partiel qui ne restaure pas les mêmes performances.",
      },
      {
        title: "2. Tension d'Alimentation 24V",
        body: "Vérifiez que l'alternative fonctionne bien en 24V DC, le standard quasi universel en vision industrielle. Une tension différente n'empêche pas physiquement le remplacement mais impose de reprendre l'alimentation et, potentiellement, de revalider la conformité électrique de l'ensemble — un coût caché qui annule souvent l'intérêt du dual sourcing.",
      },
      {
        title: "3. Connectique M12",
        body: "Confirmez que le connecteur M12 et son brochage (nombre de broches, codage) correspondent à celui de la référence remplacée. Un connecteur physiquement compatible mais dont le brochage diffère (signal de trigger, masse, blindage) peut endommager l'électronique ou empêcher le déclenchement du strobe — consultez notre brochage M12 5 broches de référence avant tout câblage.",
      },
      {
        title: "4. Calcul d'Équivalence de Flux Lumineux",
        body: "Une fois le format, la tension et la connectique validés, comparez le flux lumineux effectif à la distance de travail réelle — et non la seule puissance nominale en watts. Deux éclairages de puissance identique peuvent produire un contraste très différent sur votre pièce selon la longueur d'onde et l'angle de faisceau ; un test sur échantillon reste le seul moyen de confirmer l'équivalence optique avant un remplacement en série.",
      },
    ],
    cautionTitle: "Un remplacement en 4 étapes, jamais dans le désordre",
    cautionBody:
      "Valider le flux lumineux avant d'avoir confirmé la connectique, ou la connectique avant la tension, expose à un remplacement qui semble correct sur le papier mais échoue à l'intégration. Notre bureau d'études valide gratuitement ces 4 points sur votre référence d'origine avant que vous ne commandiez l'alternative.",
    contactTitle: "Demander une Validation d'Équivalence",
    brandsTitle: "Équivalences par Marque",
    brandsIntro:
      "Vous connaissez déjà la marque à remplacer ? Consultez directement la table de correspondance dédiée pour identifier l'alternative Vision Lighting Solutions compatible.",
  },
  en: {
    h1: "LED Lighting Interchangeability and Replacement Guide",
    lead: "Replacing a machine vision LED light with a compatible equivalent is not just about finding a reference that \"looks like\" the original. Four criteria, checked in this order, determine whether an alternative can actually substitute for the original reference without rewiring or PLC program changes.",
    methodTitle: "The 4-Step Method for Replacing an LED Light",
    methodIntro:
      "Each step constrains the next: an incompatible format makes checking the voltage pointless, an incompatible voltage makes checking the connector pointless, and so on. Check them in this order.",
    steps: [
      {
        title: "1. Single-Module (Monobloc) Format",
        body: "First confirm that the original light is genuinely a single-module format (one aluminum body integrating the LEDs, diffuser and electronics) rather than a modular architecture driven by an external controller. A direct replacement only works between two products of the same architecture — comparing a monobloc light to a modular system almost always results in a partial replacement that doesn't restore the same performance.",
      },
      {
        title: "2. 24V Supply Voltage",
        body: "Verify that the alternative runs on 24V DC, the near-universal standard in machine vision. A different voltage doesn't physically prevent the swap, but it forces you to redo the power supply and potentially re-validate the electrical compliance of the whole setup — a hidden cost that often erases the point of dual sourcing.",
      },
      {
        title: "3. M12 Connector",
        body: "Confirm that the M12 connector and its pinout (pin count, coding) match the reference being replaced. A connector that's physically compatible but wired to a different pinout (trigger signal, ground, shielding) can damage the electronics or prevent the strobe from firing — check our standard M12 5-pin pinout guide before wiring anything.",
      },
      {
        title: "4. Luminous Flux Equivalence Calculation",
        body: "Once format, voltage and connector are validated, compare the effective luminous flux at the real working distance — not just the nominal wattage. Two lights of identical power can produce very different contrast on your part depending on wavelength and beam angle; a sample test remains the only way to confirm optical equivalence before a production-scale replacement.",
      },
    ],
    cautionTitle: "A 4-Step Replacement, Never Out of Order",
    cautionBody:
      "Validating luminous flux before confirming the connector, or the connector before the voltage, sets you up for a replacement that looks correct on paper but fails at integration. Our engineering team validates these 4 points on your original reference for free before you order the alternative.",
    contactTitle: "Request an Equivalence Validation",
    brandsTitle: "Brand-Specific Equivalents",
    brandsIntro:
      "Already know which brand you need to replace? Go straight to the dedicated cross-reference table to identify the compatible Vision Lighting Solutions alternative.",
  },
};

const BRAND_SLUGS = ["equivalences-tpl-vision", "equivalences-advanced-illumination", "equivalences-smart-vision-lights"];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "guide-interchangeabilite-led");
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

  const isRich = locale === "en" || locale === "fr";
  const rich = isRich ? RICH_CONTENT[locale as RichLocale] : null;
  const fallback = findCatalogSegment()?.content[locale];

  const brandSegments = BRAND_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const jsonLd = rich
    ? buildTechArticleJsonLd({
        path: `/${locale}${ROUTE_KEY}`,
        locale,
        headline: rich.h1,
        description: fallback?.metaDescription ?? rich.lead,
        image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
        datePublished: PUBLISHED_DATE,
        dateModified: MODIFIED_DATE,
        mentions: BRAND_MENTIONS,
        keywords: ["LED interchangeability", "M12 connector", "24V DC", "luminous flux equivalence"],
      })
    : null;

  if (!rich) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {fallback?.h1 ?? "LED Interchangeability Guide"}
        </h1>
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400 dark:border-slate-700">
          Content coming soon.
        </p>
      </main>
    );
  }

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {rich.h1}
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{rich.lead}</p>

        <div className="mt-8">
          <EquivalenceFastTracks locale={locale as "en" | "fr"} />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {rich.methodTitle}
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{rich.methodIntro}</p>

          <div className="mt-8 space-y-6">
            {rich.steps.map((step) => (
              <div key={step.title}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.cautionTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{rich.cautionBody}</p>
        </section>

        <div className="mt-14">
          <ContactForm
            locale={locale as "en" | "fr"}
            contextType="equivalence"
            subjectContext={rich.h1}
            titleOverride={rich.contactTitle}
          />
        </div>

        <div className="mt-8">
          <SampleTestCTA locale={locale as "en" | "fr"} />
        </div>

        {brandSegments.length > 0 && (
          <section id="table-correspondance" className="mt-14 scroll-mt-20 border-t border-slate-200 pt-8 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.brandsTitle}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{rich.brandsIntro}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {brandSegments.map((segment) => (
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

        <div className="mt-14">
          <ReassuranceBar locale={locale as "en" | "fr"} variant="compact" />
        </div>
      </main>
    </>
  );
}
