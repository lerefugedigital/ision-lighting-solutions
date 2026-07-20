import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { SiloGrid } from "@/components/SiloGrid";
import { SiloB2BSection } from "@/components/SiloB2BSection";

const SILO_SLUG = "equivalences";

type RichLocale = "en" | "fr";

const RICH: Record<RichLocale, { extendedIntro: string; b2bTitle: string; b2bItems: { title: string; body: string }[] }> = {
  en: {
    extendedIntro:
      "Every cross-reference below is built the same way: match the lighting geometry (bar, dome, coaxial), confirm the electrical interface (24VDC supply, M12 wiring), and only then substitute the reference — never the other way around. That order is what keeps a dual-sourcing swap a drop-in replacement instead of a redesign.",
    b2bTitle: "B2B Integration Considerations",
    b2bItems: [
      {
        title: "EMC Compliance",
        body: "Any alternative you qualify must keep the same shielding and connector conventions, or you risk degrading the EMC immunity of an installation that was already validated.",
      },
      {
        title: "LED Thermal Management",
        body: "Check that the alternative's thermal management (body, heat sink) matches the duty profile — continuous or overdrive — of the reference it's replacing.",
      },
      {
        title: "Supply Continuity & Dual Sourcing",
        body: "This is exactly what this silo is for: qualifying a compatible second source so lead times and pricing no longer depend on a single supplier.",
      },
    ],
  },
  fr: {
    extendedIntro:
      "Chaque table de correspondance ci-dessous est construite de la même façon : faire correspondre la géométrie d'éclairage (barre, dôme, coaxial), confirmer l'interface électrique (alimentation 24VDC, câblage M12), et seulement ensuite substituer la référence — jamais l'inverse. C'est cet ordre qui garantit qu'un remplacement en dual sourcing reste un remplacement direct, et non une reconception.",
    b2bTitle: "Considérations d'Intégration B2B",
    b2bItems: [
      {
        title: "Conformité CEM",
        body: "Toute alternative qualifiée doit conserver le même blindage et les mêmes conventions de connectique, sous peine de dégrader l'immunité CEM d'une installation déjà validée.",
      },
      {
        title: "Gestion Thermique des LED",
        body: "Vérifiez que la gestion thermique (corps, dissipateur) de l'alternative correspond au profil d'utilisation — continu ou overdrive — de la référence remplacée.",
      },
      {
        title: "Pérennité d'Approvisionnement & Dual Sourcing",
        body: "C'est précisément l'objet de ce silo : qualifier une seconde source compatible pour que les délais et les prix ne dépendent plus d'un fournisseur unique.",
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
    alternates: buildLanguageAlternates(silo.routeKey),
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
