import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

/**
 * Locales still served as untranslated placeholders ("Content coming soon")
 * on a subset of pages. Until real DE/IT copy is written for a given page,
 * it must stay out of search: excluded from that page's hreflang alternates
 * (on every locale variant, so FR/EN pages stop advertising it too) and
 * marked `noindex` on its own DE/IT render, and excluded from the sitemap.
 */
export const THIN_CONTENT_LOCALES = ["de", "it"] as const;

export type ThinContentLocale = (typeof THIN_CONTENT_LOCALES)[number];

export function isThinContentLocale(locale: Locale): locale is ThinContentLocale {
  return (THIN_CONTENT_LOCALES as readonly string[]).includes(locale);
}

/** `robots` value for a placeholder DE/IT render: kept out of the index, but
 *  crawlable so links on it (nav, footer) still pass equity. */
export const NOINDEX_FOLLOW: Metadata["robots"] = { index: false, follow: true };

/**
 * Route keys (path relative to the locale prefix) of pages whose DE/IT render
 * is still a "Content coming soon" placeholder. Consumed by `sitemap.ts` to
 * drop the DE/IT entries from each page's `alternates.languages` there too —
 * kept as an explicit list (rather than derived from the catalog) since it
 * tracks translation status, not silo membership. Update this list as DE/IT
 * copy is written for a page.
 */
export const THIN_CONTENT_ROUTE_KEYS: readonly string[] = [
  "/eclairages/barres-led-barlights",
  "/eclairages/domes-diffus-rainlights",
  "/eclairages/eclairages-coaxiaux",
  "/eclairages/projecteurs-spots-led",
  "/eclairages/retroeclairages-backlights",
  "/equivalences/equivalences-advanced-illumination",
  "/equivalences/equivalences-smart-vision-lights",
  "/equivalences/equivalences-tpl-vision",
  "/equivalences/guide-interchangeabilite-led",
  "/guides-optiques/brightfield-vs-darkfield",
  "/guides-optiques/choisir-couleur-led-vision",
  "/guides-optiques/eclairage-infrarouge-industriel",
  "/guides-optiques/eclairage-inox-ip69k-agroalimentaire",
  "/guides-optiques/eclairage-ultraviolet-uv",
  "/guides-optiques/eclairage-vision-medical-pharmaceutique",
  "/guides-optiques/eliminer-reflets-polarisation",
  "/guides-optiques/vision-industrielle-automobile",
  "/eclairages/retroeclairages-collimates",
  "/cablage-integration/supports-orientables-swivel",
  "/guides-optiques/eclairage-camera-matricielle",
  "/contact",
  "/mentions-legales",
  "/test-sur-echantillon",
];
