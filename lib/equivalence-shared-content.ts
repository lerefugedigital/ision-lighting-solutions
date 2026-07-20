import type { EquivalenceTableLabels } from "@/components/EquivalenceTable";

/** The only two locales with written body copy for Silo 2 equivalence pages. */
export type RichLocale = "en" | "fr";

export const TABLE_LABELS: Record<RichLocale, EquivalenceTableLabels> = {
  en: {
    columnType: "Lighting Type",
    columnCompetitor: "Targeted Competitor Range",
    columnCriteria: "Interchangeability Criteria",
    columnAlternative: "Vision Lighting Solutions Alternative",
  },
  fr: {
    columnType: "Type d'Éclairage",
    columnCompetitor: "Gamme Concurrente Ciblée",
    columnCriteria: "Critères d'Interchangeabilité",
    columnAlternative: "Alternative Vision Lighting Solutions",
  },
};

/** Silo 1 (product) route keys the "Lighting Type" column links out to. */
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

/** Physical/dimensional interchangeability criteria — deliberately generic, never a fabricated spec. */
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
  en: "Competitor ranges are named for reference only. Always confirm the exact part reference and specifications against the manufacturer's own datasheet before replacing a light.",
  fr: "Les gammes concurrentes sont citées à titre de repère uniquement. Vérifiez toujours la référence exacte et les spécifications sur la fiche technique du fabricant avant tout remplacement.",
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
