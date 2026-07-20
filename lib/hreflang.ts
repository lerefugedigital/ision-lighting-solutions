import { routing, type Locale } from "@/i18n/routing";

/**
 * Builds the `alternates.canonical` + `alternates.languages` map for a page's
 * Metadata: the canonical always points at the *current* locale's own URL (never
 * a different locale's page — this isn't a duplicate-content canonical, each
 * locale is its own indexable page), and languages gives Google a
 * <link rel="alternate" hreflang="..."> for every locale of the same page.
 * Every locale, including the default (en), is prefixed (localePrefix: "always"),
 * so each entry is a simple `/${locale}${path}` join — no per-locale slug
 * translation. "x-default" points at the default locale's URL. Both resolve to
 * absolute apex URLs (SITE_URL, no www) via metadataBase on the root layout.
 */
export function buildLanguageAlternates(path: string, currentLocale: Locale): { canonical: string; languages: Record<string, string> } {
  const cleanPath = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `/${locale}${cleanPath}`;
  }
  languages["x-default"] = languages[routing.defaultLocale];
  return { canonical: `/${currentLocale}${cleanPath}`, languages };
}
