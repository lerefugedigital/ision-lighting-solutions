/** The only two locales with written body copy for Silo 4 guide pages. */
export type RichLocale = "en" | "fr";

export const PRODUCTS_TITLE: Record<RichLocale, string> = {
  en: "Recommended Lighting Formats",
  fr: "Formats d'Éclairage Recommandés",
};

export const TOOLS_TITLE: Record<RichLocale, string> = {
  en: "Integration Tools",
  fr: "Outils d'Intégration",
};

export const PLACEHOLDER_COMING_SOON: Record<"de" | "it", string> = {
  de: "Inhalt in Kürze verfügbar.",
  it: "Contenuto in arrivo a breve.",
};
