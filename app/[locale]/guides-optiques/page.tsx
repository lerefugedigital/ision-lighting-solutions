import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { SiloGrid } from "@/components/SiloGrid";
import { SiloB2BSection } from "@/components/SiloB2BSection";

const SILO_SLUG = "guides-optiques";

type RichLocale = "en" | "fr";

const RICH: Record<RichLocale, { extendedIntro: string; b2bTitle: string; b2bItems: { title: string; body: string }[] }> = {
  en: {
    extendedIntro:
      "These guides don't start from a product — they start from the physical problem a camera is failing to solve: a reflection that saturates the sensor, a color that disappears into its background, a defect that's invisible under normal light. Each one explains the underlying optical principle first, then points to the lighting geometry and wiring that actually implement it.",
    b2bTitle: "B2B Integration Considerations",
    b2bItems: [
      {
        title: "EMC Compliance",
        body: "Choosing an optical technique (wavelength, polarization) has no EMC impact by itself — immunity to disturbances is decided at the wiring and shielding level, covered in our Wiring & Integration silo.",
      },
      {
        title: "LED Thermal Management",
        body: "Some techniques — overdrive, UV, high-power IR — place a heavier load on the electronics and thermal dissipation of the light, a point to anticipate as early as the optical study phase.",
      },
      {
        title: "Supply Continuity & Dual Sourcing",
        body: "Documenting the underlying physical principle — not a single product reference — makes it easier to reproduce the solution with an alternative source if a supply chain disruption occurs.",
      },
    ],
  },
  fr: {
    extendedIntro:
      "Ces guides ne partent pas d'un produit — ils partent du problème physique qui met une caméra en échec : un reflet qui sature le capteur, une couleur qui disparaît dans son fond, un défaut invisible sous éclairage normal. Chacun explique d'abord le principe optique sous-jacent, puis renvoie vers la géométrie d'éclairage et le câblage qui le mettent réellement en œuvre.",
    b2bTitle: "Considérations d'Intégration B2B",
    b2bItems: [
      {
        title: "Conformité CEM",
        body: "Le choix d'une technique optique (longueur d'onde, polarisation) n'a pas d'impact CEM en soi ; l'immunité aux perturbations se joue au niveau du câblage et du blindage, traité dans notre silo Câblage & Intégration.",
      },
      {
        title: "Gestion Thermique des LED",
        body: "Certaines techniques — overdrive, UV, IR haute puissance — sollicitent davantage l'électronique et la dissipation thermique de l'éclairage, un point à anticiper dès la phase d'étude optique.",
      },
      {
        title: "Pérennité d'Approvisionnement & Dual Sourcing",
        body: "Documenter le principe physique retenu — et non une référence produit unique — facilite la reproduction de la solution avec une source alternative en cas de rupture d'approvisionnement.",
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
