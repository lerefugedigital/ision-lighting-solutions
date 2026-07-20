import type { ProductConfigTableLabels } from "@/components/ProductConfigTable";
import type { EquivalenceRequestFormLabels } from "@/components/EquivalenceRequestForm";

/** The only two locales with written body copy for Silo 1 product pages. */
export type RichLocale = "en" | "fr";

export const TABLE_LABELS: Record<RichLocale, ProductConfigTableLabels> = {
  en: {
    columnFieldType: "Light Field / Beam Type",
    columnWavelengths: "Wavelength Options",
    columnWindow: "Typical Optical Window",
    columnOperatingMode: "Operating Mode",
  },
  fr: {
    columnFieldType: "Type de Champ Lumineux / Faisceau",
    columnWavelengths: "Options de Longueurs d'Onde",
    columnWindow: "Fenêtre Optique Type",
    columnOperatingMode: "Type de Fonctionnement",
  },
};

export const FORM_LABELS: Record<RichLocale, EquivalenceRequestFormLabels> = {
  en: {
    title: "Request Specifications & a Quote",
    description:
      "Tell us your application (target size, working distance, surface type) and one of our engineers will recommend the right configuration within 24 business hours.",
    placeholder: "e.g. target size, working distance, surface type…",
    submitLabel: "Request Specifications",
    disclaimer: "No obligation. Response from an engineer within 24 business hours.",
  },
  fr: {
    title: "Demander les Spécifications / Un Devis",
    description:
      "Indiquez-nous votre application (taille de cible, distance de travail, type de surface) : un de nos ingénieurs vous recommande la configuration adaptée sous 24h ouvrées.",
    placeholder: "ex : taille de la cible, distance de travail, type de surface…",
    submitLabel: "Demander les Spécifications",
    disclaimer: "Sans engagement. Réponse d'un ingénieur sous 24h ouvrées.",
  },
};

export const DISCLAIMER_NOTE: Record<RichLocale, string> = {
  en: "Dimensions and optical windows shown are generic and given as typical ranges. Exact figures depend on the configuration selected — available on request from our engineering team.",
  fr: "Les dimensions et fenêtres optiques indiquées sont génériques et données à titre de plages typiques. Les valeurs exactes dépendent de la configuration choisie — disponibles sur demande auprès de notre équipe d'ingénierie.",
};

export const RELATED_TITLE: Record<RichLocale, string> = {
  en: "Integration & Compatibility Guides",
  fr: "Guides d'Intégration et de Compatibilité",
};

/** Silo 3 wiring/integration guides relevant to every product page. */
export const RELATED_SLUGS = ["brochage-m12-5-pins", "eclairage-stroboscopique-overdrive"];

export const PLACEHOLDER_COMING_SOON: Record<"de" | "it", string> = {
  de: "Inhalt in Kürze verfügbar.",
  it: "Contenuto in arrivo a breve.",
};
