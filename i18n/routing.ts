import { defineRouting } from "next-intl/routing";

/**
 * EN is the default locale but is still served under its own /en/ prefix
 * (localePrefix: "always") — unlike the "as-needed" setup on other sites,
 * here every locale, including the default, gets an explicit prefix so
 * "/" always redirects to a real, bookmarkable /en/ URL.
 */
export const locales = ["en", "fr", "de", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
});
