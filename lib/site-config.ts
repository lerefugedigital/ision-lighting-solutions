/** Single source of truth for the production domain — used by metadataBase,
 *  robots.txt and the sitemap. Canonical apex domain (no www); override per
 *  environment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vision-lighting-solutions.com";

export const SITE_NAME = "Vision Lighting Solutions";
