import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";

const SILO_SLUG = "cablage-integration";

/** Has its own dedicated route (with the interactive M12 tool) — excluded here to avoid a route conflict. */
const DEDICATED_SLUGS = [
  "brochage-m12-5-pins",
  "compatibilite-camera-cognex",
  "compatibilite-camera-keyence",
  "convertisseur-pnp-npn",
  "eclairage-stroboscopique-overdrive",
];

export function generateStaticParams() {
  const segments = catalog.segments.filter(
    (s) => s.siloSlug === SILO_SLUG && !DEDICATED_SLUGS.includes(s.slug)
  );
  return routing.locales.flatMap((locale) => segments.map((s) => ({ locale, segment: s.slug })));
}

function findSegment(slug: string) {
  if (DEDICATED_SLUGS.includes(slug)) return undefined;
  return catalog.segments.find((s) => s.slug === slug && s.siloSlug === SILO_SLUG);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; segment: string }>;
}): Promise<Metadata> {
  const { locale, segment: segmentSlug } = await params;
  const segment = findSegment(segmentSlug);
  if (!segment) return {};
  const content = segment.content[locale];
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: buildLanguageAlternates(segment.routeKey, locale),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale; segment: string }> }) {
  const { locale, segment: segmentSlug } = await params;
  setRequestLocale(locale);

  const segment = findSegment(segmentSlug);
  if (!segment) notFound();
  const content = segment.content[locale];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{content.h1}</h1>
      <p className="mt-6 text-slate-600">{content.metaDescription}</p>
      <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400">
        Content coming soon.
      </p>
    </main>
  );
}
