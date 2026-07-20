import { routing } from "@/i18n/routing";

/**
 * Builds the `alternates.languages` map for a page's Metadata so Google
 * receives a <link rel="alternate" hreflang="..."> pointing at each
 * locale's own URL for the same canonical page. Every locale, including
 * the default (en), is prefixed (localePrefix: "always"), so the map is a
 * simple `/${locale}${path}` join — no per-locale slug translation.
 * "x-default" points at the default locale's URL.
 */
export function buildLanguageAlternates(path: string): { languages: Record<string, string> } {
  const cleanPath = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `/${locale}${cleanPath}`;
  }
  languages["x-default"] = languages[routing.defaultLocale];
  return { languages };
}
