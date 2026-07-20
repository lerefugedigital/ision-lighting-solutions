import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { SiloGrid } from "@/components/SiloGrid";
import { SiloB2BSection } from "@/components/SiloB2BSection";

const SILO_SLUG = "eclairages";

type RichLocale = "en" | "fr";

const RICH: Record<RichLocale, { extendedIntro: string; b2bTitle: string; b2bItems: { title: string; body: string }[] }> = {
  en: {
    extendedIntro:
      "Every format below solves a different lighting-geometry problem: bar lights illuminate a flat field directly, backlights extract silhouettes, dome lights remove glare from curved or reflective parts, coaxial lighting reveals defects along the camera's own optical axis, and spot/floodlights reach targets no close-mounted light can. Picking the wrong geometry for the surface in front of the camera — not a weak LED — is the single most common reason a lighting setup underperforms.",
    b2bTitle: "B2B Integration Considerations",
    b2bItems: [
      {
        title: "EMC Compliance",
        body: "Our lights use electronics designed for EMC immunity against the conducted and radiated disturbances typical of an industrial environment — VFDs, servo drives — a prerequisite for stable operation near automation equipment.",
      },
      {
        title: "LED Thermal Management",
        body: "Heat dissipation through the aluminum body directly governs LED lifetime and light output over time — a key point to validate for any continuous, high-intensity operation.",
      },
      {
        title: "Supply Continuity & Dual Sourcing",
        body: "Our ranges share a standardized M12 connector and 24VDC supply, making it easier to fit them into a dual-sourcing plan without redesigning the electrical interface.",
      },
    ],
  },
  fr: {
    extendedIntro:
      "Chaque format ci-dessous répond à un problème de géométrie d'éclairage différent : les barres LED éclairent un champ plat directement, les rétroéclairages extraient des silhouettes, les dômes suppriment les reflets sur pièces courbes ou réfléchissantes, l'éclairage coaxial révèle les défauts dans l'axe optique de la caméra, et les projecteurs/spots atteignent des cibles qu'aucun éclairage monté à courte distance ne peut couvrir. Choisir la mauvaise géométrie pour la surface observée — bien avant la puissance de la LED elle-même — est la cause la plus fréquente d'un éclairage sous-performant.",
    b2bTitle: "Considérations d'Intégration B2B",
    b2bItems: [
      {
        title: "Conformité CEM",
        body: "Nos éclairages intègrent une électronique conçue pour l'immunité CEM face aux perturbations conduites et rayonnées propres à l'environnement industriel — variateurs, servomoteurs —, condition nécessaire à un fonctionnement stable à proximité d'automates.",
      },
      {
        title: "Gestion Thermique des LED",
        body: "La dissipation thermique du corps aluminium conditionne directement la durée de vie et le flux lumineux des LED dans le temps — un point clé à valider pour tout fonctionnement continu à haute intensité.",
      },
      {
        title: "Pérennité d'Approvisionnement & Dual Sourcing",
        body: "Nos gammes partagent une connectique M12 et une alimentation 24VDC standardisées, facilitant leur intégration dans un plan de double approvisionnement sans reconception de l'interface électrique.",
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
