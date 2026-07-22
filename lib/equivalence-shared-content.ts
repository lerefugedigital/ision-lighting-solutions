import type { EquivalenceTableLabels } from "@/components/EquivalenceTable";

/** The only two locales with written body copy for Silo 2 equivalence pages. */
export type RichLocale = "en" | "fr";

export const TABLE_LABELS: Record<RichLocale, EquivalenceTableLabels> = {
  en: {
    columnCompetitorRef: "Competitor Reference",
    columnVlsEquivalent: "VLS Equivalent",
    columnFormatSpec: "Format / Specification",
    columnAction: "Action",
  },
  fr: {
    columnCompetitorRef: "Référence Concurrent",
    columnVlsEquivalent: "Équivalent VLS",
    columnFormatSpec: "Format / Spécification",
    columnAction: "Action",
  },
};

export const ACTION_LABEL: Record<RichLocale, string> = {
  en: "Request a Quote / Datasheet",
  fr: "Demander un Devis / Fiche",
};

/** Silo 1 (product) route keys the equivalence table rows link out to. */
export const LIGHT_TYPES: Record<RichLocale, Array<{ routeKey: string; label: string }>> = {
  en: [
    { routeKey: "/eclairages/barres-led-barlights", label: "LED Bar Light" },
    { routeKey: "/eclairages/retroeclairages-backlights", label: "Backlight" },
    { routeKey: "/eclairages/domes-diffus-rainlights", label: "Diffuse Dome Light" },
    { routeKey: "/eclairages/eclairages-coaxiaux", label: "Coaxial Light" },
  ],
  fr: [
    { routeKey: "/eclairages/barres-led-barlights", label: "Barre LED" },
    { routeKey: "/eclairages/retroeclairages-backlights", label: "Backlight" },
    { routeKey: "/eclairages/domes-diffus-rainlights", label: "Dôme Diffus" },
    { routeKey: "/eclairages/eclairages-coaxiaux", label: "Coaxial" },
  ],
};

/** Physical/dimensional format-and-spec text per light type — deliberately generic, never a fabricated spec. */
export const CRITERIA: Record<RichLocale, [string, string, string, string]> = {
  en: [
    "Standard 24VDC supply; common M12 connector (pinout to confirm); length and beam angle to compare against the exact datasheet.",
    "Standard 24VDC supply; active area size and cut-out dimensions to confirm against the exact reference.",
    "Standard 24VDC supply; outer diameter and height to compare; mounting pattern to validate physically.",
    "Standard 24VDC supply; working distance and beamsplitter diameter to verify against the model's datasheet.",
  ],
  fr: [
    "Alimentation standard 24VDC ; connectique M12 usuelle (brochage à confirmer) ; longueur et angle de faisceau à comparer selon la datasheet exacte.",
    "Alimentation standard 24VDC ; dimensions de la zone active et découpe à confirmer selon la référence exacte.",
    "Alimentation standard 24VDC ; diamètre extérieur et hauteur à comparer ; fixation à valider physiquement.",
    "Alimentation standard 24VDC ; distance de travail et diamètre du diviseur optique à vérifier selon la datasheet du modèle.",
  ],
};

/** Our own generic range name per light type — constant across every competitor comparison page. */
export const VLS_ALTERNATIVES: Record<RichLocale, [string, string, string, string]> = {
  en: ["VLS BarLight Range", "VLS BackLight Range", "VLS DomeLight Range", "VLS CoaxLight Range"],
  fr: ["Gamme VLS BarLight", "Gamme VLS BackLight", "Gamme VLS DomeLight", "Gamme VLS CoaxLight"],
};

export const DISCLAIMER_NOTE: Record<RichLocale, string> = {
  en: "Competitor references are named for reference only. Always confirm the exact part reference and specifications against the manufacturer's own datasheet before replacing a light.",
  fr: "Les références concurrentes sont citées à titre de repère uniquement. Vérifiez toujours la référence exacte et les spécifications sur la fiche technique du fabricant avant tout remplacement.",
};

export const RELATED_TITLE: Record<RichLocale, string> = {
  en: "Verify Electrical Compatibility",
  fr: "Vérifier la Compatibilité Électrique",
};

/** Silo 3 wiring tools that let a buyer confirm the swap is electrically compatible. */
export const RELATED_SLUGS = ["brochage-m12-5-pins", "eclairage-stroboscopique-overdrive"];

export const PLACEHOLDER_COMING_SOON: Record<"de" | "it", string> = {
  de: "Inhalt in Kürze verfügbar.",
  it: "Contenuto in arrivo a breve.",
};

/** Shared, competitor-agnostic body copy for the "Direct Compatibility" and "Why VLS" sections. */
export const ELECTRICAL_TEXT: Record<RichLocale, string> = {
  en: "Our equivalents share the same electrical architecture as the original references: standard 24V DC supply and 5-pin M12 connector, for a swap that requires no rewiring or PLC program changes. Always confirm the exact pinout against the specific reference being replaced.",
  fr: "Nos équivalences reprennent la même architecture électrique que les références d'origine : alimentation standard 24V DC et connecteur M12 5 broches, pour un remplacement sans modification de câblage ni de programme automate. Le brochage exact reste à valider selon la référence précise remplacée.",
};

export const MECHANICAL_TEXT: Record<RichLocale, string> = {
  en: "VLS ranges target the same formats and mounting hole spacing as their targeted equivalents, for integration into your existing mechanical mount without redrilling. Exact dimensions (length, cut-out, hole spacing) should be confirmed against the specific reference before replacing it.",
  fr: "Les gammes VLS visent les mêmes formats et entraxes de fixation que leurs équivalents ciblés, pour une intégration dans le support mécanique existant sans re-perçage. Les cotes exactes (longueur, découpe, entraxe) sont à confirmer selon la référence précise avant remplacement.",
};

export const AVAILABILITY_TEXT: Record<RichLocale, string> = {
  en: "In-stock or short-lead-time alternatives, shipped from Europe, to protect your production line without waiting on the export lead times of a non-European supplier.",
  fr: "Alternatives en stock ou à délai court, expédiées depuis l'Europe, pour sécuriser votre ligne de production sans attendre les délais export d'un fournisseur hors Europe.",
};

export const SUPPORT_TEXT: Record<RichLocale, string> = {
  en: "Our engineering team validates your optical schematic and overdrive calculation within 24h, and you can borrow a demo case to test the equivalence on your own parts in our lab before validating the replacement.",
  fr: "Notre bureau d'études valide votre schéma optique et votre calcul overdrive sous 24h, et vous pouvez emprunter une valise de démonstration pour tester l'équivalence sur vos propres pièces en laboratoire avant de valider le remplacement.",
};

interface EquivalenceHeadings {
  compatibilityTitle: string;
  electricalTitle: string;
  mechanicalTitle: string;
  tableTitle: string;
  whyTitle: string;
  availabilityTitle: string;
  supportTitle: string;
  ctaTitle: string;
}

/** Builds the shared hN structure for an equivalence page, with the competitor name interpolated where required. */
export function buildEquivalenceHeadings(locale: RichLocale, competitorName: string): EquivalenceHeadings {
  if (locale === "fr") {
    return {
      compatibilityTitle: `Remplacer vos Éclairages ${competitorName} : Compatibilité Directe`,
      electricalTitle: "Compatibilité Électrique (24V DC & Connecteurs M12)",
      mechanicalTitle: "Compatibilité Mécanique et Entraxe de Fixation",
      tableTitle: `Tableau Correspondances et Équivalences Directes ${competitorName}`,
      whyTitle: "Pourquoi Choisir une Alternative Vision Lighting Solutions ?",
      availabilityTitle: "Disponibilité et Délais de Livraison Courts",
      supportTitle: "Support Technique et Validation Optique en Laboratoire",
      ctaTitle: "Demander une Équivalence sur Mesure ou un Devis",
    };
  }
  return {
    compatibilityTitle: `Replacing Your ${competitorName} Lighting: Direct Compatibility`,
    electricalTitle: "Electrical Compatibility (24V DC & M12 Connectors)",
    mechanicalTitle: "Mechanical Compatibility and Mounting Hole Spacing",
    tableTitle: `${competitorName} Cross-Reference and Direct Equivalence Table`,
    whyTitle: "Why Choose a Vision Lighting Solutions Alternative?",
    availabilityTitle: "Availability and Short Lead Times",
    supportTitle: "Technical Support and Lab Optical Validation",
    ctaTitle: "Request a Custom Equivalence or a Quote",
  };
}
