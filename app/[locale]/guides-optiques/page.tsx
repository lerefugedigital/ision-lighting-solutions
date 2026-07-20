import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { SiloGrid } from "@/components/SiloGrid";

const SILO_SLUG = "guides-optiques";

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {silo.content[locale].h1}
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600">{silo.content[locale].metaDescription}</p>
      <div className="mt-12">
        <SiloGrid segments={segments} locale={locale} />
      </div>
    </main>
  );
}
