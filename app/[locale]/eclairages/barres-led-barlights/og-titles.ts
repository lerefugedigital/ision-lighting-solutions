import type { Locale } from "@/i18n/routing";

/** Title shown on the OG image for every locale — en/fr use the rich H1, de/it fall back to the catalog's existing translated H1. */
export const META_TITLES: Record<Locale, string> = {
  en: "LED Bar Lights for Machine Vision",
  fr: "Barres LED (Barlights) pour la Vision Industrielle",
  de: "LED-Balkenleuchten für die Bildverarbeitung",
  it: "Barre LED (Barlights) per la Visione Industriale",
};
