import { defineRouting } from "next-intl/routing";

/**
 * FR is the default locale but is still served under its own /fr/ prefix
 * (localePrefix: "always") — unlike the "as-needed" setup on other sites,
 * here every locale, including the default, gets an explicit prefix so
 * "/" always redirects to a real, bookmarkable /fr/ URL.
 */
export const locales = ["fr", "en", "de", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
});
