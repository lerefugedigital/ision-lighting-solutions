import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { SiloGrid } from "@/components/SiloGrid";
import { SiloB2BSection } from "@/components/SiloB2BSection";

const SILO_SLUG = "cablage-integration";

type RichLocale = "en" | "fr";

const RICH: Record<RichLocale, { extendedIntro: string; b2bTitle: string; b2bItems: { title: string; body: string }[] }> = {
  en: {
    extendedIntro:
      "Wiring an industrial light correctly is less about the connector itself than about three decisions made before the first wire is crimped: the trigger polarity your camera or PLC expects (PNP or NPN), the duty cycle your application needs (continuous or strobe/overdrive), and the shielding path that keeps electrical noise out of that trigger line. The guides below cover all three.",
    b2bTitle: "B2B Integration Considerations",
    b2bItems: [
      {
        title: "EMC Compliance",
        body: "The standard M12 pinout includes a functional earth (FE) pin dedicated to cable shielding — wiring it correctly is the first line of defense against EMC disturbances in an industrial environment.",
      },
      {
        title: "LED Thermal Management",
        body: "The operating mode chosen at wiring time — continuous vs. strobe/overdrive — directly affects LED heating and must be validated before the line goes into production.",
      },
      {
        title: "Supply Continuity & Dual Sourcing",
        body: "A standardized connector and pinout across our entire range means a light can be upgraded or replaced without redoing the electrical integration.",
      },
    ],
  },
  fr: {
    extendedIntro:
      "Câbler correctement un éclairage industriel tient moins au connecteur lui-même qu'à trois décisions prises avant même de sertir le premier fil : la polarité de trigger attendue par votre caméra ou automate (PNP ou NPN), le rapport cyclique requis par votre application (continu ou stroboscopique/overdrive), et le chemin de blindage qui protège cette ligne de trigger du bruit électrique. Les guides ci-dessous couvrent ces trois points.",
    b2bTitle: "Considérations d'Intégration B2B",
    b2bItems: [
      {
        title: "Conformité CEM",
        body: "Le brochage M12 standard inclut une broche de terre fonctionnelle (FE) dédiée au blindage du câble — son raccordement correct est la première ligne de défense contre les perturbations CEM en environnement industriel.",
      },
      {
        title: "Gestion Thermique des LED",
        body: "Le mode de fonctionnement choisi au câblage — continu ou stroboscopique/overdrive — a un impact direct sur l'échauffement des LED et doit être validé avant la mise en production de la ligne.",
      },
      {
        title: "Pérennité d'Approvisionnement & Dual Sourcing",
        body: "Une connectique et un brochage standardisés sur toute notre gamme permettent de faire évoluer ou remplacer un éclairage sans reprendre l'intégration électrique.",
      },
    ],
  },
};

function getSilo() {
  const silo = catalog.silos.find((s) => s.slug === SILO_SLUG);
  if (!silo) throw new Error(`Silo "${SILO_SLUG}" missing from catalog`);
  return silo;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const silo = getSilo();
  const content = silo.content[locale];
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: buildLanguageAlternates(silo.routeKey, locale),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const silo = getSilo();
  const segments = catalog.segments.filter((s) => s.siloSlug === SILO_SLUG);
  const rich = locale === "en" || locale === "fr" ? RICH[locale] : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {silo.content[locale].h1}
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">{silo.content[locale].metaDescription}</p>
      {rich && <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">{rich.extendedIntro}</p>}
      <div className="mt-12">
        <SiloGrid segments={segments} locale={locale} />
      </div>
      {rich && (
        <div className="mt-4">
          <SiloB2BSection title={rich.b2bTitle} items={rich.b2bItems} />
        </div>
      )}
    </main>
  );
}
