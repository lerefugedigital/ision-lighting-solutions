import type { Locale } from "@/i18n/routing";

/**
 * Data/schema split from routing on purpose: this file only ever stores a
 * locale-agnostic `slug` and `routeKey` (the URL path shared by every
 * locale, since this site uses a single set of slugs under `/{locale}/...`
 * rather than per-locale translated URLs). Localized copy lives in
 * `content`, keyed by locale.
 */

export type LocalizedContent = Record<
  Locale,
  {
    name: string;
    h1: string;
    metaTitle: string;
    metaDescription: string;
  }
>;

export interface Segment {
  slug: string;
  siloSlug: string;
  /** Path relative to the locale prefix, e.g. "/eclairages/barres-led-barlights". */
  routeKey: string;
  content: LocalizedContent;
}

export interface Silo {
  slug: string;
  routeKey: string;
  content: LocalizedContent;
}

/** A standalone route that belongs to no silo (home, contact, legal, lead-gen pages). */
export interface StandalonePage {
  slug: string;
  /** Path relative to the locale prefix, e.g. "/contact", or "/" for the home page. */
  routeKey: string;
  content: LocalizedContent;
}

export interface Catalog {
  silos: Silo[];
  segments: Segment[];
  pages: StandalonePage[];
}

export const catalog: Catalog = {
  silos: [
    // SILO 1 — Products
    {
      slug: "eclairages",
      routeKey: "/eclairages",
      content: {
        en: {
          name: "Lighting Products",
          h1: "Machine Vision Lighting Products",
          metaTitle: "Machine Vision LED Lighting | Bar, Back, Dome & Coaxial Lights",
          metaDescription:
            "Browse our full range of industrial machine vision lighting: LED bar lights, backlights, diffuse dome lights, coaxial lights and spotlights for reliable inspection.",
        },
        fr: {
          name: "Éclairages",
          h1: "Éclairages LED pour la Vision Industrielle",
          metaTitle: "Éclairage Vision Industrielle LED | Barres, Rétroéclairages, Dômes",
          metaDescription:
            "Découvrez notre gamme complète d'éclairages pour la vision industrielle : barres LED, rétroéclairages, dômes diffus, éclairages coaxiaux et projecteurs.",
        },
        de: {
          name: "Beleuchtungen",
          h1: "LED-Beleuchtung für die Bildverarbeitung",
          metaTitle: "LED-Beleuchtung für Machine Vision | Balken-, Hinter- & Kuppelleuchten",
          metaDescription:
            "Entdecken Sie unser komplettes Sortiment an Beleuchtungslösungen für die industrielle Bildverarbeitung: LED-Balkenleuchten, Hintergrundbeleuchtung, Kuppel- und Koaxialleuchten.",
        },
        it: {
          name: "Illuminazioni",
          h1: "Illuminazione LED per la Visione Industriale",
          metaTitle: "Illuminazione LED per Visione Industriale | Barre, Retroilluminazioni, Cupole",
          metaDescription:
            "Scopri la nostra gamma completa di illuminazioni per la visione industriale: barre LED, retroilluminazioni, cupole diffuse, illuminazioni coassiali e proiettori.",
        },
      },
    },

    // SILO 2 — Brand equivalents
    {
      slug: "equivalences",
      routeKey: "/equivalences",
      content: {
        en: {
          name: "Brand Equivalents",
          h1: "Machine Vision Lighting Brand Equivalents",
          metaTitle: "LED Lighting Equivalents | TPL Vision, Advanced Illumination, Smart Vision Lights",
          metaDescription:
            "Find drop-in equivalents for TPL Vision, Advanced Illumination and Smart Vision Lights products, plus our full LED interchangeability guide.",
        },
        fr: {
          name: "Équivalences",
          h1: "Équivalences d'Éclairages pour la Vision Industrielle",
          metaTitle: "Équivalences Éclairage LED | TPL Vision, Advanced Illumination, Smart Vision Lights",
          metaDescription:
            "Trouvez les équivalences directes aux produits TPL Vision, Advanced Illumination et Smart Vision Lights, ainsi que notre guide complet d'interchangeabilité LED.",
        },
        de: {
          name: "Markenäquivalente",
          h1: "Äquivalente Beleuchtungen für die Bildverarbeitung",
          metaTitle: "LED-Beleuchtung Äquivalente | TPL Vision, Advanced Illumination, Smart Vision Lights",
          metaDescription:
            "Finden Sie direkte Äquivalente zu Produkten von TPL Vision, Advanced Illumination und Smart Vision Lights sowie unseren vollständigen LED-Austauschleitfaden.",
        },
        it: {
          name: "Equivalenze",
          h1: "Equivalenze di Illuminazione per la Visione Industriale",
          metaTitle: "Equivalenze Illuminazione LED | TPL Vision, Advanced Illumination, Smart Vision Lights",
          metaDescription:
            "Trova le equivalenze dirette ai prodotti TPL Vision, Advanced Illumination e Smart Vision Lights, oltre alla nostra guida completa all'intercambiabilità LED.",
        },
      },
    },

    // SILO 3 — Wiring & integration tools
    {
      slug: "cablage-integration",
      routeKey: "/cablage-integration",
      content: {
        en: {
          name: "Wiring & Integration",
          h1: "Wiring & Integration Tools for Vision Lighting",
          metaTitle: "Vision Lighting Wiring Guides | M12 Pinout, Strobe, PNP/NPN, Camera Compatibility",
          metaDescription:
            "M12 5-pin wiring diagrams, strobe/overdrive setup, PNP/NPN conversion and camera compatibility guides for Cognex and Keyence machine vision integrations.",
        },
        fr: {
          name: "Câblage & Intégration",
          h1: "Outils de Câblage et d'Intégration pour l'Éclairage Vision",
          metaTitle: "Câblage Éclairage Vision | Brochage M12, Stroboscopie, PNP/NPN, Caméras",
          metaDescription:
            "Brochage M12 5 broches, configuration stroboscopique/overdrive, conversion PNP/NPN et guides de compatibilité caméra pour vos intégrations Cognex et Keyence.",
        },
        de: {
          name: "Verkabelung & Integration",
          h1: "Verkabelungs- und Integrationswerkzeuge für Vision-Beleuchtung",
          metaTitle: "Verkabelung Vision-Beleuchtung | M12-Pinbelegung, Blitz, PNP/NPN, Kamera-Kompatibilität",
          metaDescription:
            "M12-5-Pin-Pinbelegung, Blitz-/Overdrive-Konfiguration, PNP/NPN-Wandlung und Kamera-Kompatibilitätsleitfäden für Ihre Cognex- und Keyence-Integrationen.",
        },
        it: {
          name: "Cablaggio & Integrazione",
          h1: "Strumenti di Cablaggio e Integrazione per l'Illuminazione Vision",
          metaTitle: "Cablaggio Illuminazione Vision | Piedinatura M12, Strobo, PNP/NPN, Compatibilità Camere",
          metaDescription:
            "Piedinatura M12 a 5 pin, configurazione stroboscopica/overdrive, conversione PNP/NPN e guide di compatibilità camera per le tue integrazioni Cognex e Keyence.",
        },
      },
    },

    // SILO 4 — Optical guides (colors / sectors / R&D)
    {
      slug: "guides-optiques",
      routeKey: "/guides-optiques",
      content: {
        en: {
          name: "Optical Guides",
          h1: "Optical & Application Guides for Machine Vision Lighting",
          metaTitle: "Machine Vision Lighting Guides | Wavelength, Color, Sector Applications",
          metaDescription:
            "Technical guides on infrared, UV, LED color selection, IP69K stainless lighting, and sector applications from automotive to medical machine vision.",
        },
        fr: {
          name: "Guides Optiques",
          h1: "Guides Optiques et Applicatifs pour l'Éclairage Vision",
          metaTitle: "Guides Éclairage Vision Industrielle | Longueur d'Onde, Couleur, Secteurs",
          metaDescription:
            "Guides techniques sur l'infrarouge, l'UV, le choix de la couleur LED, l'éclairage inox IP69K et les applications sectorielles, de l'automobile au médical.",
        },
        de: {
          name: "Optische Leitfäden",
          h1: "Optische Leitfäden und Anwendungen für Vision-Beleuchtung",
          metaTitle: "Leitfäden Vision-Beleuchtung | Wellenlänge, Farbe, Branchenanwendungen",
          metaDescription:
            "Technische Leitfäden zu Infrarot, UV, LED-Farbwahl, IP69K-Edelstahlbeleuchtung und Branchenanwendungen von der Automobilindustrie bis zur Medizintechnik.",
        },
        it: {
          name: "Guide Ottiche",
          h1: "Guide Ottiche e Applicative per l'Illuminazione Vision",
          metaTitle: "Guide Illuminazione Visione Industriale | Lunghezza d'Onda, Colore, Settori",
          metaDescription:
            "Guide tecniche su infrarosso, UV, scelta del colore LED, illuminazione inox IP69K e applicazioni settoriali, dall'automotive al medicale.",
        },
      },
    },
  ],

  segments: [
    // ---- SILO 1: eclairages ----
    {
      slug: "barres-led-barlights",
      siloSlug: "eclairages",
      routeKey: "/eclairages/barres-led-barlights",
      content: {
        en: {
          name: "LED Bar Lights",
          h1: "LED Bar Lights for Machine Vision",
          metaTitle: "LED Bar Lights | Industrial Machine Vision Illumination",
          metaDescription:
            "Industrial LED bar lights: aluminum body, M12 connector, 24VDC electronics, uniform field illumination in White, Red, Blue or IR — get a quote.",
        },
        fr: {
          name: "Barres LED (Barlights)",
          h1: "Barres LED (Barlights) pour la Vision Industrielle",
          metaTitle: "Barres LED Barlights | Éclairage Vision Industrielle",
          metaDescription:
            "Barres LED industrielles : corps aluminium, connecteur M12, électronique 24VDC, éclairage uniforme en Blanc, Rouge, Bleu ou IR — demandez un devis.",
        },
        de: {
          name: "LED-Balkenleuchten (Barlights)",
          h1: "LED-Balkenleuchten für die Bildverarbeitung",
          metaTitle: "LED-Balkenleuchten | Beleuchtung für Machine Vision",
          metaDescription:
            "Leistungsstarke LED-Balkenleuchten für Zeilen- und Flächenkamera-Inspektion, in verschiedenen Längen, Winkeln und Farben für gleichmäßige Feldausleuchtung.",
        },
        it: {
          name: "Barre LED (Barlights)",
          h1: "Barre LED (Barlights) per la Visione Industriale",
          metaTitle: "Barre LED Barlights | Illuminazione Visione Industriale",
          metaDescription:
            "Barre LED ad alta intensità per ispezione a scansione lineare e in area, disponibili in diverse lunghezze, angoli e colori per un'illuminazione uniforme del campo.",
        },
      },
    },
    {
      slug: "retroeclairages-backlights",
      siloSlug: "eclairages",
      routeKey: "/eclairages/retroeclairages-backlights",
      content: {
        en: {
          name: "Backlights",
          h1: "Backlights for Contour & Dimensional Inspection",
          metaTitle: "Backlight & Industrial Machine Vision Backlighting 24V | Vision Lighting",
          metaDescription:
            "High-uniformity LED backlights for silhouette control, dimensional measurement and liquid level inspection. Compact formats, large formats and IP69K.",
        },
        fr: {
          name: "Rétroéclairages (Backlights)",
          h1: "Rétroéclairages pour le Contrôle Dimensionnel et de Contour",
          metaTitle: "Rétroéclairage & Backlight Vision Industrielle 24V | Vision Lighting",
          metaDescription:
            "Rétroéclairages LED haute homogénéité pour contrôle de silhouettes, mesure dimensionnelle et niveau de liquide. Formats compacts, grands formats et IP69K.",
        },
        de: {
          name: "Hintergrundbeleuchtung (Backlights)",
          h1: "Hintergrundbeleuchtung für Kontur- und Maßprüfung",
          metaTitle: "LED-Hintergrundbeleuchtung | Kontur- & Maßprüfung Machine Vision",
          metaDescription:
            "Gleichmäßige LED-Hintergrundbeleuchtung für Silhouetten-, Kontur- und Maßmessung, mit maximalem Kontrast für die Kantenerkennung.",
        },
        it: {
          name: "Retroilluminazioni (Backlights)",
          h1: "Retroilluminazioni per il Controllo Dimensionale e di Contorno",
          metaTitle: "Retroilluminazioni LED | Controllo Dimensionale Visione Industriale",
          metaDescription:
            "Retroilluminazioni LED uniformi per la misurazione di sagome, contorni e dimensioni, che massimizzano il contrasto per il rilevamento dei bordi.",
        },
      },
    },
    {
      slug: "domes-diffus-rainlights",
      siloSlug: "eclairages",
      routeKey: "/eclairages/domes-diffus-rainlights",
      content: {
        en: {
          name: "Diffuse Dome Lights",
          h1: "Diffuse Dome Lights for Reflective & Curved Surfaces",
          metaTitle: "Diffuse Dome Lights | Shadow-Free Vision Illumination",
          metaDescription:
            "Industrial diffuse dome lights: aluminum housing, M12 connector, 24VDC electronics, omnidirectional shadow-free illumination — request a quote.",
        },
        fr: {
          name: "Dômes Diffus (Rainlights)",
          h1: "Dômes Diffus pour Surfaces Réfléchissantes et Courbes",
          metaTitle: "Dômes Diffus LED | Éclairage Vision Sans Ombre Industriel",
          metaDescription:
            "Dômes diffus industriels : corps aluminium, connecteur M12, électronique 24VDC, éclairage omnidirectionnel sans ombre — demandez un devis gratuit.",
        },
        de: {
          name: "Diffuse Kuppelleuchten (Rainlights)",
          h1: "Diffuse Kuppelleuchten für Reflektierende und Gewölbte Oberflächen",
          metaTitle: "Diffuse Kuppelleuchten | Schattenfreie Vision-Beleuchtung",
          metaDescription:
            "Diffuse Kuppelbeleuchtung sorgt für eine omnidirektionale, schattenfreie Ausleuchtung reflektierender, gewölbter oder strukturierter Oberflächen.",
        },
        it: {
          name: "Cupole Diffuse (Rainlights)",
          h1: "Cupole Diffuse per Superfici Riflettenti e Curve",
          metaTitle: "Cupole Diffuse LED | Illuminazione Vision Senza Ombre",
          metaDescription:
            "L'illuminazione a cupola diffusa offre un'illuminazione omnidirezionale senza ombre per superfici riflettenti, curve o testurizzate soggette a riflessi.",
        },
      },
    },
    {
      slug: "eclairages-coaxiaux",
      siloSlug: "eclairages",
      routeKey: "/eclairages/eclairages-coaxiaux",
      content: {
        en: {
          name: "Coaxial Lighting",
          h1: "Coaxial Lighting for Specular & Etched Surfaces",
          metaTitle: "Coaxial LED Lighting | Specular Surface Machine Vision",
          metaDescription:
            "Industrial coaxial LED lighting: aluminum housing, M12 connector, 24VDC electronics, homogeneous on-axis illumination — request a free quote.",
        },
        fr: {
          name: "Éclairages Coaxiaux",
          h1: "Éclairage Coaxial pour la Vision Industrielle : Suppression des Reflets",
          metaTitle: "Éclairage Coaxial Vision Industrielle | Source Lumineuse Sans Reflet",
          metaDescription:
            "Éclairage coaxial LED industriel : corps aluminium, connecteur M12, électronique 24VDC, éclairage homogène dans l'axe optique — demandez un devis.",
        },
        de: {
          name: "Koaxialbeleuchtung",
          h1: "Koaxialbeleuchtung für Spiegelnde und Gravierte Oberflächen",
          metaTitle: "Koaxiale LED-Beleuchtung | Vision auf Spiegelnden Oberflächen",
          metaDescription:
            "Koaxiale Beleuchtung projiziert Licht entlang der optischen Achse der Kamera und macht Oberflächenfehler, Gravuren und Codes auf glänzenden Teilen sichtbar.",
        },
        it: {
          name: "Illuminazioni Coassiali",
          h1: "Illuminazioni Coassiali per Superfici Speculari e Incise",
          metaTitle: "Illuminazione Coassiale LED | Visione su Superfici Speculari",
          metaDescription:
            "L'illuminazione coassiale proietta la luce lungo l'asse ottico della camera, rivelando difetti, incisioni e codici su parti lucide o speculari.",
        },
      },
    },
    {
      slug: "projecteurs-spots-led",
      siloSlug: "eclairages",
      routeKey: "/eclairages/projecteurs-spots-led",
      content: {
        en: {
          name: "LED Spotlights",
          h1: "LED Spotlights & Floodlights for Long-Range Inspection",
          metaTitle: "LED Spotlights | Long-Range Machine Vision Illumination",
          metaDescription:
            "Industrial LED spotlights and floodlights: aluminum housing, M12 connector, 24VDC electronics, narrow and wide beam optics for long working distances.",
        },
        fr: {
          name: "Projecteurs & Spots LED",
          h1: "Projecteurs et Spots LED pour l'Inspection Longue Distance",
          metaTitle: "Projecteurs Spots LED | Éclairage Vision Longue Distance",
          metaDescription:
            "Projecteurs et spots LED industriels : corps aluminium, connecteur M12, électronique 24VDC, optiques faisceau étroit et large — demandez un devis.",
        },
        de: {
          name: "LED-Strahler & Spots",
          h1: "LED-Strahler und Spots für Langstrecken-Inspektion",
          metaTitle: "LED-Strahler | Vision-Beleuchtung für Große Entfernungen",
          metaDescription:
            "Hochintensive LED-Strahler und Spots für große Arbeitsabstände, weite Sichtfelder und Inspektion bei starkem Umgebungslicht.",
        },
        it: {
          name: "Proiettori & Spot LED",
          h1: "Proiettori e Spot LED per l'Ispezione a Lunga Distanza",
          metaTitle: "Proiettori Spot LED | Illuminazione Vision a Lunga Distanza",
          metaDescription:
            "Proiettori e spot LED ad alta intensità per grandi distanze di lavoro, ampi campi visivi e ispezione in condizioni di forte luce ambientale.",
        },
      },
    },

    // ---- SILO 2: equivalences ----
    {
      slug: "equivalences-tpl-vision",
      siloSlug: "equivalences",
      routeKey: "/equivalences/equivalences-tpl-vision",
      content: {
        en: {
          name: "TPL Vision Equivalents",
          h1: "TPL Vision Lighting Equivalents & Cross-References",
          metaTitle: "TPL Vision Equivalent: LED Lighting Alternatives | Vision Lighting",
          metaDescription:
            "Find the direct equivalent to your TPL Vision lighting (Essential Bar, M-TBAL...). Mechanical and electrical 24V M12 compatibility. Quote within 2h.",
        },
        fr: {
          name: "Équivalences TPL Vision",
          h1: "Équivalences et Correspondances aux Éclairages TPL Vision",
          metaTitle: "Équivalences & Remplacement Éclairages TPL Vision | Dual Sourcing B2B",
          metaDescription:
            "Trouvez l'équivalent direct à vos éclairages TPL Vision (Essential Bar, M-TBAL...). Compatibilité mécanique et électrique 24V M12. Devis sous 2h.",
        },
        de: {
          name: "TPL Vision Äquivalente",
          h1: "TPL Vision Beleuchtung: Äquivalente und Querverweise",
          metaTitle: "TPL Vision Äquivalente | LED-Beleuchtung Querverweis",
          metaDescription:
            "Querverweisleitfaden, der TPL-Vision-Beleuchtungsreferenzen kompatiblen Alternativen mit identischen Spezifikationen und Befestigungen zuordnet.",
        },
        it: {
          name: "Equivalenze TPL Vision",
          h1: "Equivalenze e Corrispondenze con le Illuminazioni TPL Vision",
          metaTitle: "Equivalenze TPL Vision | Corrispondenza Illuminazione LED",
          metaDescription:
            "Guida di corrispondenza che collega i riferimenti TPL Vision ad alternative compatibili, con specifiche e fissaggi identici.",
        },
      },
    },
    {
      slug: "equivalences-advanced-illumination",
      siloSlug: "equivalences",
      routeKey: "/equivalences/equivalences-advanced-illumination",
      content: {
        en: {
          name: "Advanced Illumination Equivalents",
          h1: "Advanced Illumination Lighting Equivalents & Cross-References",
          metaTitle: "Advanced Illumination Equivalent: LED Alternatives | Vision Lighting",
          metaDescription:
            "Replace your Advanced Illumination lighting (Bar lights, Backlights...). Direct 1:1 replacement for machine vision and integrators.",
        },
        fr: {
          name: "Équivalences Advanced Illumination",
          h1: "Équivalences et Correspondances aux Éclairages Advanced Illumination",
          metaTitle: "Équivalence Advanced Illumination : Alternatives LED | Vision Lighting",
          metaDescription:
            "Remplacez vos éclairages Advanced Illumination (Bar lights, Backlights...). Remplacement direct 1:1 pour vision industrielle et intégrateurs.",
        },
        de: {
          name: "Advanced Illumination Äquivalente",
          h1: "Advanced Illumination Beleuchtung: Äquivalente und Querverweise",
          metaTitle: "Advanced Illumination Äquivalente | LED-Beleuchtung Querverweis",
          metaDescription:
            "Querverweisleitfaden, der Advanced-Illumination-Referenzen kompatiblen Alternativen mit identischen Spezifikationen und Befestigungen zuordnet.",
        },
        it: {
          name: "Equivalenze Advanced Illumination",
          h1: "Equivalenze e Corrispondenze con le Illuminazioni Advanced Illumination",
          metaTitle: "Equivalenze Advanced Illumination | Corrispondenza Illuminazione LED",
          metaDescription:
            "Guida di corrispondenza che collega i riferimenti Advanced Illumination ad alternative compatibili, con specifiche e fissaggi identici.",
        },
      },
    },
    {
      slug: "equivalences-smart-vision-lights",
      siloSlug: "equivalences",
      routeKey: "/equivalences/equivalences-smart-vision-lights",
      content: {
        en: {
          name: "Smart Vision Lights Equivalents",
          h1: "Smart Vision Lights Equivalents & Cross-References",
          metaTitle: "Smart Vision Lights Equivalent: Lighting Alternatives | Vision Lighting",
          metaDescription:
            "Find a compatible alternative to your Smart Vision Lights spotlights and bars (S75, Brick Light...). Standard M12 connectivity and 24h support.",
        },
        fr: {
          name: "Équivalences Smart Vision Lights",
          h1: "Équivalences et Correspondances aux Éclairages Smart Vision Lights",
          metaTitle: "Équivalence Smart Vision Lights : Alternatives Éclairage | Vision Lighting",
          metaDescription:
            "Trouvez une alternative compatible à vos projecteurs et barres Smart Vision Lights (S75, Brick Light...). Connectique standard M12 et support 24h.",
        },
        de: {
          name: "Smart Vision Lights Äquivalente",
          h1: "Smart Vision Lights Beleuchtung: Äquivalente und Querverweise",
          metaTitle: "Smart Vision Lights Äquivalente | LED-Beleuchtung Querverweis",
          metaDescription:
            "Querverweisleitfaden, der Smart-Vision-Lights-Referenzen kompatiblen Alternativen mit identischen Spezifikationen und Befestigungen zuordnet.",
        },
        it: {
          name: "Equivalenze Smart Vision Lights",
          h1: "Equivalenze e Corrispondenze con le Illuminazioni Smart Vision Lights",
          metaTitle: "Equivalenze Smart Vision Lights | Corrispondenza Illuminazione LED",
          metaDescription:
            "Guida di corrispondenza che collega i riferimenti Smart Vision Lights ad alternative compatibili, con specifiche e fissaggi identici.",
        },
      },
    },
    {
      slug: "guide-interchangeabilite-led",
      siloSlug: "equivalences",
      routeKey: "/equivalences/guide-interchangeabilite-led",
      content: {
        en: {
          name: "LED Interchangeability Guide",
          h1: "LED Lighting Interchangeability and Replacement Guide",
          metaTitle: "LED Interchangeability Guide | Replacement Method & Equivalence",
          metaDescription:
            "How to replace a machine vision LED light with a compatible equivalent: single-module format, 24V DC supply, M12 connector and luminous flux equivalence.",
        },
        fr: {
          name: "Guide d'Interchangeabilité LED",
          h1: "Guide d'Interchangeabilité et Remplacement des Éclairages LED",
          metaTitle: "Guide d'Interchangeabilité LED | Méthode de Remplacement",
          metaDescription:
            "Comment remplacer un éclairage LED vision industrielle par un équivalent compatible : format monomodule, alimentation 24V DC, connectique M12 et calcul de flux lumineux.",
        },
        de: {
          name: "LED-Austauschleitfaden",
          h1: "Wie Wählt Man eine Austauschbare LED-Beleuchtungsalternative",
          metaTitle: "LED-Austauschleitfaden | Beleuchtung für Machine Vision",
          metaDescription:
            "Ein praktischer Leitfaden zum Vergleich von Wellenlänge, Abstrahlwinkel, Befestigung und Steckverbindern zwischen Marken vor dem Austausch.",
        },
        it: {
          name: "Guida all'Intercambiabilità LED",
          h1: "Come Scegliere un'Alternativa LED Intercambiabile",
          metaTitle: "Guida all'Intercambiabilità LED | Illuminazione Visione Industriale",
          metaDescription:
            "Una guida pratica per confrontare lunghezza d'onda, angolo del fascio, fissaggio e connettori tra marchi prima di sostituire un'illuminazione vision.",
        },
      },
    },

    // ---- SILO 3: cablage-integration ----
    {
      slug: "brochage-m12-5-pins",
      siloSlug: "cablage-integration",
      routeKey: "/cablage-integration/brochage-m12-5-pins",
      content: {
        en: {
          name: "M12 5-Pin Wiring Diagram",
          h1: "M12 5-Pin (A-Coded) Wiring Diagram for Machine Vision Lighting",
          metaTitle: "M12 5-Pin Wiring Diagram | Vision Lighting Solutions",
          metaDescription:
            "Standard M12 5-pin A-coded pinout for industrial machine vision lighting — wire colors, roles and common wiring mistakes explained pin by pin.",
        },
        fr: {
          name: "Brochage M12 5 Broches",
          h1: "Brochage M12 5 Broches (Codage A) pour Éclairage de Vision Industrielle",
          metaTitle: "Brochage M12 5 Broches | Vision Lighting Solutions",
          metaDescription:
            "Brochage M12 5 broches (codage A) pour éclairage vision industrielle : couleurs de fils, rôles et erreurs courantes expliqués broche par broche.",
        },
        de: {
          name: "M12-5-Pin-Pinbelegung",
          h1: "M12-5-polige (A-kodierte) Pinbelegung für Vision-Beleuchtung",
          metaTitle: "M12 5-polig A-kodiert Pinbelegung | Vision Lighting Solutions",
          metaDescription: "M12 5-polig A-kodiert Pinbelegung für industrielle Bildverarbeitung.",
        },
        it: {
          name: "Piedinatura M12 5 Pin",
          h1: "Piedinatura M12 a 5 Pin (Codifica A) per Illuminazione Visione Industriale",
          metaTitle: "Piedinatura M12 a 5 Pin (Codifica A) | Vision Lighting Solutions",
          metaDescription: "Piedinatura M12 a 5 pin (Codifica A) per illuminazione visione industriale.",
        },
      },
    },
    {
      slug: "eclairage-stroboscopique-overdrive",
      siloSlug: "cablage-integration",
      routeKey: "/cablage-integration/eclairage-stroboscopique-overdrive",
      content: {
        en: {
          name: "Strobe & Overdrive Lighting",
          h1: "Strobe & Overdrive Lighting Setup for High-Speed Inspection",
          metaTitle: "Strobe & Overdrive Lighting | Vision Lighting Solutions",
          metaDescription:
            "How to configure strobe and overdrive modes to boost peak LED brightness and freeze motion on fast lines — calculate your safe duty cycle now.",
        },
        fr: {
          name: "Éclairage Stroboscopique & Overdrive",
          h1: "Éclairage Stroboscopique & Mode Overdrive pour la Vision Industrielle",
          metaTitle: "Éclairage Stroboscopique & Overdrive | Vision Lighting",
          metaDescription:
            "Comment configurer les modes stroboscopique et overdrive pour augmenter la luminosité crête LED et figer le mouvement sur des lignes rapides.",
        },
        de: {
          name: "Blitz- & Overdrive-Beleuchtung",
          h1: "Blitz- und Overdrive-Beleuchtung für Hochgeschwindigkeits-Inspektion Einrichten",
          metaTitle: "Blitz- & Overdrive-Beleuchtung | Vision Lighting Solutions",
          metaDescription:
            "So konfigurieren Sie Blitz- und Overdrive-Modi, um die maximale LED-Helligkeit zu erhöhen und Bewegungen auf schnellen Linien einzufrieren.",
        },
        it: {
          name: "Illuminazione Stroboscopica & Overdrive",
          h1: "Configurare un'Illuminazione Stroboscopica e Overdrive per l'Ispezione Rapida",
          metaTitle: "Illuminazione Stroboscopica & Overdrive | Vision Lighting Solutions",
          metaDescription:
            "Come configurare le modalità stroboscopica e overdrive per aumentare la luminosità di picco dei LED e bloccare il movimento su linee veloci.",
        },
      },
    },
    {
      slug: "convertisseur-pnp-npn",
      siloSlug: "cablage-integration",
      routeKey: "/cablage-integration/convertisseur-pnp-npn",
      content: {
        en: {
          name: "PNP/NPN Converter",
          h1: "PNP/NPN Signal Converter for Vision Lighting Integration",
          metaTitle: "PNP/NPN Signal Converter | Vision Lighting Solutions",
          metaDescription:
            "How to convert PNP (sourcing) and NPN (sinking) trigger signals to wire vision lighting to any PLC or camera I/O — request a free quote today.",
        },
        fr: {
          name: "Convertisseur PNP/NPN",
          h1: "Convertisseur de Signal PNP/NPN pour l'Intégration Éclairage Vision",
          metaTitle: "Convertisseur de Signal PNP/NPN | Vision Lighting Solutions",
          metaDescription:
            "Comment convertir un signal trigger PNP (source) en NPN (drain) et inversement pour intégrer l'éclairage vision à n'importe quel automate ou caméra.",
        },
        de: {
          name: "PNP/NPN-Wandler",
          h1: "PNP/NPN-Signalwandler für die Integration von Vision-Beleuchtung",
          metaTitle: "PNP/NPN-Wandler | Vision Lighting Solutions",
          metaDescription:
            "So wandeln Sie PNP- (Sourcing) und NPN- (Sinking) Triggersignale um, um Vision-Beleuchtung mit jeder SPS oder Kamera-I/O zu integrieren.",
        },
        it: {
          name: "Convertitore PNP/NPN",
          h1: "Convertitore di Segnale PNP/NPN per l'Integrazione dell'Illuminazione Vision",
          metaTitle: "Convertitore PNP/NPN | Vision Lighting Solutions",
          metaDescription:
            "Come convertire un segnale trigger PNP (source) in NPN (sink) e viceversa per integrare l'illuminazione vision con qualsiasi PLC o camera.",
        },
      },
    },
    {
      slug: "compatibilite-camera-cognex",
      siloSlug: "cablage-integration",
      routeKey: "/cablage-integration/compatibilite-camera-cognex",
      content: {
        en: {
          name: "Cognex Camera Compatibility",
          h1: "Vision Lighting Compatibility with Cognex Cameras",
          metaTitle: "Cognex Camera Compatibility | Vision Lighting Solutions",
          metaDescription:
            "Compatible lighting, I/O configuration and trigger wiring for integrating our machine vision lights with Cognex In-Sight and DataMan cameras.",
        },
        fr: {
          name: "Compatibilité Caméras Cognex",
          h1: "Compatibilité des Éclairages Vision avec les Caméras Cognex",
          metaTitle: "Compatibilité Éclairage Caméra Cognex In-Sight & VisionPro | Câblage M12",
          metaDescription:
            "Éclairages compatibles, configuration des E/S et câblage du trigger pour intégrer nos éclairages vision aux caméras Cognex In-Sight et DataMan.",
        },
        de: {
          name: "Kompatibilität mit Cognex-Kameras",
          h1: "Kompatibilität von Vision-Beleuchtung mit Cognex-Kameras",
          metaTitle: "Cognex Kamera-Kompatibilität | Vision Lighting Solutions",
          metaDescription:
            "Kompatible Beleuchtung, I/O-Konfiguration und Triggerverdrahtung zur Integration unserer Vision-Beleuchtung mit Cognex In-Sight und DataMan Kameras.",
        },
        it: {
          name: "Compatibilità Camere Cognex",
          h1: "Compatibilità dell'Illuminazione Vision con le Camere Cognex",
          metaTitle: "Compatibilità Camera Cognex | Vision Lighting Solutions",
          metaDescription:
            "Illuminazioni compatibili, configurazione I/O e cablaggio del trigger per integrare le nostre illuminazioni vision con le camere Cognex In-Sight e DataMan.",
        },
      },
    },
    {
      slug: "compatibilite-camera-keyence",
      siloSlug: "cablage-integration",
      routeKey: "/cablage-integration/compatibilite-camera-keyence",
      content: {
        en: {
          name: "Keyence Camera Compatibility",
          h1: "Vision Lighting Compatibility with Keyence Cameras",
          metaTitle: "Keyence Camera Compatibility | Vision Lighting Solutions",
          metaDescription:
            "Compatible lighting, I/O terminals and trigger wiring for integrating our machine vision lights with Keyence CV-X, XG-X, IV and SR-2000 cameras.",
        },
        fr: {
          name: "Compatibilité Caméras Keyence",
          h1: "Compatibilité des Éclairages Vision avec les Caméras Keyence",
          metaTitle: "Compatibilité Caméra Keyence | Vision Lighting Solutions",
          metaDescription:
            "Éclairages compatibles, bornes d'E/S et câblage du trigger pour intégrer nos éclairages vision aux caméras Keyence CV-X, XG-X, IV et SR-2000.",
        },
        de: {
          name: "Kompatibilität mit Keyence-Kameras",
          h1: "Kompatibilität von Vision-Beleuchtung mit Keyence-Kameras",
          metaTitle: "Keyence Kamera-Kompatibilität | Vision Lighting Solutions",
          metaDescription:
            "Kompatible Beleuchtung, I/O-Klemmen und Triggerverdrahtung zur Integration unserer Vision-Beleuchtung mit Keyence CV-X, XG-X, IV und SR-2000 Kameras.",
        },
        it: {
          name: "Compatibilità Camere Keyence",
          h1: "Compatibilità dell'Illuminazione Vision con le Camere Keyence",
          metaTitle: "Compatibilità Camera Keyence | Vision Lighting Solutions",
          metaDescription:
            "Illuminazioni compatibili, morsetti I/O e cablaggio del trigger per integrare le nostre illuminazioni vision con le camere Keyence CV-X, XG-X, IV e SR-2000.",
        },
      },
    },

    // ---- SILO 4: guides-optiques ----
    {
      slug: "eclairage-infrarouge-industriel",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/eclairage-infrarouge-industriel",
      content: {
        en: {
          name: "Industrial Infrared Lighting",
          h1: "Industrial Infrared (IR) Lighting for Machine Vision",
          metaTitle: "Industrial Infrared (IR) Lighting | Machine Vision Guide",
          metaDescription:
            "Why infrared lighting sees through materials that look opaque under visible light, and how to apply it in machine vision — read our full guide.",
        },
        fr: {
          name: "Éclairage Infrarouge Industriel",
          h1: "Éclairage Infrarouge (IR) Industriel pour la Vision Industrielle",
          metaTitle: "Éclairage Infrarouge Industriel | Guide Vision Industrielle",
          metaDescription:
            "Pourquoi l'éclairage infrarouge traverse des matériaux qui semblent opaques en lumière visible, et comment l'appliquer en inspection industrielle.",
        },
        de: {
          name: "Industrielle Infrarotbeleuchtung",
          h1: "Industrielle Infrarot (IR) Beleuchtung für die Bildverarbeitung",
          metaTitle: "Industrielle Infrarotbeleuchtung | Machine-Vision-Leitfaden",
          metaDescription:
            "Wann und wie Infrarot (IR) Beleuchtung in der Bildverarbeitung eingesetzt wird: Verpackungsdurchdringung, Blendreduktion und diskreter Betrieb.",
        },
        it: {
          name: "Illuminazione Infrarossa Industriale",
          h1: "Illuminazione Infrarossa (IR) Industriale per la Visione Industriale",
          metaTitle: "Illuminazione Infrarossa Industriale | Guida Visione Industriale",
          metaDescription:
            "Quando e come usare l'illuminazione infrarossa (IR) nella visione industriale: penetrazione degli imballaggi, riduzione dei riflessi e discrezione visiva.",
        },
      },
    },
    {
      slug: "eclairage-ultraviolet-uv",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/eclairage-ultraviolet-uv",
      content: {
        en: {
          name: "Ultraviolet (UV) Lighting",
          h1: "Ultraviolet (UV) Lighting for Machine Vision Applications",
          metaTitle: "UV Lighting Guide | Machine Vision Fluorescence Detection",
          metaDescription:
            "Why some defects are invisible under any normal light, and how UV-excited fluorescence reveals them in machine vision inspection — full guide.",
        },
        fr: {
          name: "Éclairage Ultraviolet (UV)",
          h1: "Éclairage Ultraviolet (UV) pour les Applications de Vision Industrielle",
          metaTitle: "Guide Éclairage UV | Détection Fluorescence Vision",
          metaDescription:
            "Pourquoi certains défauts sont invisibles sous toute lumière normale, et comment la fluorescence excitée par UV les révèle en inspection vision.",
        },
        de: {
          name: "Ultraviolett (UV) Beleuchtung",
          h1: "Ultraviolett (UV) Beleuchtung für Bildverarbeitungsanwendungen",
          metaTitle: "UV-Beleuchtungsleitfaden | Fluoreszenzerkennung Machine Vision",
          metaDescription:
            "UV-Beleuchtung zur Sichtbarmachung fluoreszierender Markierungen, Verunreinigungen, Risse und Klebstoffspuren, die im sichtbaren Licht unsichtbar sind.",
        },
        it: {
          name: "Illuminazione Ultravioletta (UV)",
          h1: "Illuminazione Ultravioletta (UV) per Applicazioni di Visione Industriale",
          metaTitle: "Guida Illuminazione UV | Rilevamento per Fluorescenza Visione Industriale",
          metaDescription:
            "Usare l'illuminazione UV per rivelare marcature fluorescenti, contaminazioni, crepe e tracce di colla invisibili con la luce visibile standard.",
        },
      },
    },
    {
      slug: "choisir-couleur-led-vision",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/choisir-couleur-led-vision",
      content: {
        en: {
          name: "Choosing LED Color",
          h1: "How to Choose the Right LED Color for Machine Vision",
          metaTitle: "Choosing LED Color | Machine Vision Wavelength Guide",
          metaDescription:
            "Why a monochrome camera can miss a color-coded defect entirely, and how choosing the right LED wavelength restores contrast — read our full guide.",
        },
        fr: {
          name: "Choisir la Couleur LED",
          h1: "Comment Choisir la Bonne Couleur LED en Vision Industrielle",
          metaTitle: "Choisir la Couleur LED | Guide Vision Industrielle",
          metaDescription:
            "Pourquoi une caméra monochrome peut manquer un défaut pourtant visible en couleur, et comment la bonne longueur d'onde LED restaure le contraste.",
        },
        de: {
          name: "LED-Farbe Wählen",
          h1: "Wie Wählt Man die Richtige LED-Farbe für die Bildverarbeitung",
          metaTitle: "LED-Farbwahl | Wellenlängen-Leitfaden Machine Vision",
          metaDescription:
            "Ein praktischer Leitfaden zur Wahl der LED-Wellenlänge (rot, blau, grün, weiß oder IR) je nach Zielfarbe, Oberfläche und Kontrastanforderung.",
        },
        it: {
          name: "Scegliere il Colore LED",
          h1: "Come Scegliere il Colore LED Giusto per la Visione Industriale",
          metaTitle: "Scegliere il Colore LED | Guida Lunghezza d'Onda Visione Industriale",
          metaDescription:
            "Una guida pratica per scegliere una lunghezza d'onda LED rossa, blu, verde, bianca o IR in base al colore del target e al contrasto richiesto.",
        },
      },
    },
    {
      slug: "eclairage-inox-ip69k-agroalimentaire",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/eclairage-inox-ip69k-agroalimentaire",
      content: {
        en: {
          name: "IP69K Stainless Lighting for Pharma & Food",
          h1: "IP69K Stainless Steel LED Lighting for Pharmaceutical and Food Environments",
          metaTitle: "IP69K Stainless Lighting | Pharmaceutical Inspection Optics & Food",
          metaDescription:
            "Why standard aluminum lighting fails in corrosive pharmaceutical and food washdown environments, and what IP69K, CIP/SIP resistance and 316L actually certify.",
        },
        fr: {
          name: "Éclairage Inox IP69K Pharma & Agroalimentaire",
          h1: "Éclairage LED Inox IP69K pour Milieux Pharmaceutiques et Agroalimentaires",
          metaTitle: "Éclairage Pharmaceutique Inox IP69K | Environnements Corrosifs",
          metaDescription:
            "Pourquoi un éclairage aluminium standard échoue en environnement corrosif pharmaceutique ou agroalimentaire, et ce que certifient IP69K, CIP/SIP et l'inox 316L.",
        },
        de: {
          name: "IP69K-Edelstahlbeleuchtung für die Lebensmittelindustrie",
          h1: "IP69K-Edelstahlbeleuchtung für die Lebensmittelindustrie",
          metaTitle: "IP69K-Edelstahlbeleuchtung | Machine Vision Lebensmittelindustrie",
          metaDescription:
            "IP69K-zertifizierte Edelstahlbeleuchtung, die Hochdruckreinigung und die Hygienestandards der Lebensmittel- und Getränkeindustrie übersteht.",
        },
        it: {
          name: "Illuminazione Inox IP69K per l'Alimentare",
          h1: "Illuminazione Inox IP69K per l'Industria Alimentare",
          metaTitle: "Illuminazione Inox IP69K | Visione Industriale Alimentare",
          metaDescription:
            "Illuminazioni in acciaio inox certificate IP69K, progettate per resistere al lavaggio ad alta pressione e agli standard igienici del settore alimentare.",
        },
      },
    },
    {
      slug: "vision-industrielle-automobile",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/vision-industrielle-automobile",
      content: {
        en: {
          name: "Automotive Machine Vision",
          h1: "Machine Vision Lighting for the Automotive Industry",
          metaTitle: "Automotive Machine Vision Lighting | Guide & Applications",
          metaDescription:
            "Why metallic and painted automotive parts defeat generic lighting, and how to match lighting geometry to weld and surface defects — full guide.",
        },
        fr: {
          name: "Vision Industrielle Automobile",
          h1: "Éclairage Vision Industrielle pour le Secteur Automobile",
          metaTitle: "Vision Industrielle Automobile | Guide d'Éclairage",
          metaDescription:
            "Pourquoi les pièces automobiles métalliques et peintes mettent en échec un éclairage générique, et comment adapter la géométrie aux défauts.",
        },
        de: {
          name: "Automobil Machine Vision",
          h1: "Vision-Beleuchtung für die Automobilindustrie",
          metaTitle: "Automobil Machine Vision Beleuchtung | Leitfaden und Anwendungen",
          metaDescription:
            "Beleuchtungsstrategien für die Automobilinspektion: Schweißnahtkontrolle, Oberflächenfehlererkennung und robuste Montageprüfung in der Linie.",
        },
        it: {
          name: "Visione Industriale Automotive",
          h1: "Illuminazione Vision Industriale per il Settore Automotive",
          metaTitle: "Visione Industriale Automotive | Guida e Applicazioni Illuminazione",
          metaDescription:
            "Strategie di illuminazione per l'ispezione automotive: controllo saldature, rilevamento difetti superficiali e verifica assemblaggio in linea.",
        },
      },
    },
    {
      slug: "eclairage-vision-medical-pharmaceutique",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/eclairage-vision-medical-pharmaceutique",
      content: {
        en: {
          name: "Medical & Pharmaceutical Vision",
          h1: "Machine Vision Lighting for Medical & Pharmaceutical Applications",
          metaTitle: "Medical & Pharma Vision Lighting Guide | Vision Lighting",
          metaDescription:
            "Why translucent tablets and reflective blister foil defeat generic lighting, and how backlight silhouettes and diffuse domes solve it — full guide.",
        },
        fr: {
          name: "Vision Médicale & Pharmaceutique",
          h1: "Éclairage Vision Industrielle pour les Applications Médicales et Pharmaceutiques",
          metaTitle: "Vision Médicale & Pharmaceutique | Guide Éclairage",
          metaDescription:
            "Pourquoi comprimés translucides et blister réfléchissant mettent en échec un éclairage générique, et comment silhouette et dôme diffus y répondent.",
        },
        de: {
          name: "Medizin- & Pharma-Vision",
          h1: "Vision-Beleuchtung für Medizinische und Pharmazeutische Anwendungen",
          metaTitle: "Medizin- & Pharma Machine Vision Beleuchtung | Leitfaden",
          metaDescription:
            "Beleuchtung für Tablettenzählung, Blisterpackungsprüfung, Etikettenverifizierung und reinraumtaugliche Bildverarbeitung in Medizin- und Pharmalinien.",
        },
        it: {
          name: "Visione Medicale & Farmaceutica",
          h1: "Illuminazione Vision Industriale per Applicazioni Medicali e Farmaceutiche",
          metaTitle: "Visione Medicale & Farmaceutica | Guida Illuminazione",
          metaDescription:
            "Illuminazione per conteggio compresse, ispezione blister, verifica etichette e visione compatibile con camere bianche nelle linee medicali e farmaceutiche.",
        },
      },
    },
    {
      slug: "brightfield-vs-darkfield",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/brightfield-vs-darkfield",
      content: {
        en: {
          name: "Brightfield vs Darkfield",
          h1: "Brightfield vs Darkfield Lighting: Which to Choose?",
          metaTitle: "Brightfield vs Darkfield Lighting | Vision Lighting Guide",
          metaDescription:
            "Why the same scratch can appear bright or dark depending on lighting angle, and how to choose between brightfield and darkfield illumination.",
        },
        fr: {
          name: "Brightfield vs Darkfield",
          h1: "Fond Clair vs Fond Noir (Brightfield vs Darkfield) en Vision Industrielle",
          metaTitle: "Brightfield vs Darkfield | Éclairage Fond Clair Fond Noir Vision",
          metaDescription:
            "Pourquoi une même rayure apparaît claire ou sombre selon l'angle d'éclairage, et comment choisir entre fond clair et fond noir pour la détection de rayures surface.",
        },
        de: {
          name: "Hellfeld vs Dunkelfeld",
          h1: "Hellfeld- vs. Dunkelfeldbeleuchtung: Welche Wählen?",
          metaTitle: "Hellfeld vs Dunkelfeld | Vergleich Vision-Beleuchtung",
          metaDescription:
            "Ein direkter Vergleich der Hellfeld- und Dunkelfeld-Beleuchtungstechniken und wann jede davon Oberflächenfehler am besten sichtbar macht.",
        },
        it: {
          name: "Brightfield vs Darkfield",
          h1: "Illuminazione Brightfield vs Darkfield: Quale Scegliere?",
          metaTitle: "Brightfield vs Darkfield | Confronto Illuminazione Visione Industriale",
          metaDescription:
            "Un confronto dettagliato tra le tecniche di illuminazione brightfield e darkfield, e quando ciascuna rivela meglio i difetti superficiali.",
        },
      },
    },
    {
      slug: "eliminer-reflets-polarisation",
      siloSlug: "guides-optiques",
      routeKey: "/guides-optiques/eliminer-reflets-polarisation",
      content: {
        en: {
          name: "Eliminating Reflections with Polarization",
          h1: "Eliminating Reflections & Glare with Polarized Lighting",
          metaTitle: "Polarized Lighting | Eliminating Glare in Machine Vision",
          metaDescription:
            "Why a saturated glare hot spot destroys image data no exposure setting can recover, and how crossed polarizing filters remove it — full guide.",
        },
        fr: {
          name: "Éliminer les Reflets par Polarisation",
          h1: "Éliminer les Reflets et Éblouissements par Éclairage Polarisé",
          metaTitle: "Éclairage Polarisé | Éliminer les Reflets en Vision",
          metaDescription:
            "Pourquoi un reflet saturé détruit une donnée image qu'aucun réglage d'exposition ne récupère, et comment des filtres polarisants croisés le retirent.",
        },
        de: {
          name: "Reflexionen mit Polarisation Eliminieren",
          h1: "Reflexionen und Blendung mit Polarisierter Beleuchtung Eliminieren",
          metaTitle: "Polarisierte Beleuchtung | Blendungsreduktion in Machine Vision",
          metaDescription:
            "Wie Polarisationsfilter an Leuchten und Objektiven spiegelnde Reflexionen auf metallischen, gläsernen oder nassen Oberflächen entfernen.",
        },
        it: {
          name: "Eliminare i Riflessi con la Polarizzazione",
          h1: "Eliminare Riflessi e Abbagliamenti con l'Illuminazione Polarizzata",
          metaTitle: "Illuminazione Polarizzata | Eliminare i Riflessi in Visione Industriale",
          metaDescription:
            "Come i filtri polarizzanti su illuminazioni e ottiche eliminano i riflessi speculari su superfici metalliche, vetrate o bagnate durante l'ispezione.",
        },
      },
    },
  ],

  pages: [
    {
      slug: "home",
      routeKey: "/",
      content: {
        en: {
          name: "Home",
          h1: "Machine Vision Lighting, Engineered for Reliable Inspection",
          metaTitle: "Machine Vision Lighting Solutions | LED Illumination",
          metaDescription:
            "Vision Lighting Solutions designs and supplies LED lighting for machine vision: bar lights, backlights, coaxial and dome lights — request a quote.",
        },
        fr: {
          name: "Accueil",
          h1: "L'Éclairage Vision Industrielle, Pensé pour une Inspection Fiable",
          metaTitle: "Solutions d'Éclairage Vision Industrielle | Éclairage LED",
          metaDescription:
            "Vision Lighting Solutions conçoit des éclairages LED pour la vision industrielle : barres, rétroéclairages, dômes et coaxiaux — demandez un devis.",
        },
        de: {
          name: "Startseite",
          h1: "Vision-Beleuchtung, Konzipiert für Zuverlässige Inspektion",
          metaTitle: "Beleuchtungslösungen für die Bildverarbeitung | LED-Beleuchtung",
          metaDescription:
            "Vision Lighting Solutions entwickelt und liefert LED-Beleuchtung für die Bildverarbeitung: Balkenleuchten, Hintergrundbeleuchtung, Koaxial- und Kuppelleuchten, Äquivalente und Integrationsleitfäden.",
        },
        it: {
          name: "Home",
          h1: "Illuminazione per la Visione Industriale, Progettata per un'Ispezione Affidabile",
          metaTitle: "Soluzioni di Illuminazione per la Visione Industriale | Illuminazione LED",
          metaDescription:
            "Vision Lighting Solutions progetta e fornisce illuminazioni LED per la visione industriale: barre, retroilluminazioni, cupole e illuminazioni coassiali, equivalenze e guide di integrazione.",
        },
      },
    },
    {
      slug: "contact",
      routeKey: "/contact",
      content: {
        en: {
          name: "Contact",
          h1: "Contact Our Team",
          metaTitle: "Contact Us | Vision Lighting Solutions Engineering Team",
          metaDescription:
            "Get in touch with our machine vision lighting engineers for product specifications, technical quotes, or wiring and integration questions today.",
        },
        fr: {
          name: "Contact",
          h1: "Contacter Notre Équipe",
          metaTitle: "Contactez Nos Ingénieurs | Vision Lighting Solutions",
          metaDescription:
            "Contactez nos ingénieurs en éclairage vision industrielle pour vos spécifications produit, devis technique, ou questions de câblage et d'intégration.",
        },
        de: {
          name: "Kontakt",
          h1: "Unser Team Kontaktieren",
          metaTitle: "Kontakt | Vision Lighting Solutions",
          metaDescription:
            "Kontaktieren Sie unsere Ingenieure für Bildverarbeitungsbeleuchtung für Spezifikationen, Angebote oder technische Fragen.",
        },
        it: {
          name: "Contatti",
          h1: "Contatta il Nostro Team",
          metaTitle: "Contatti | Vision Lighting Solutions",
          metaDescription:
            "Contatta i nostri ingegneri per l'illuminazione della visione industriale per specifiche, preventivi o domande tecniche.",
        },
      },
    },
    {
      slug: "test-sur-echantillon",
      routeKey: "/test-sur-echantillon",
      content: {
        en: {
          name: "Sample Test Request",
          h1: "Validate your optical feasibility before buying — No commitment",
          metaTitle: "Sample Test & Demo Loan Request | Vision Lighting Solutions",
          metaDescription:
            "Borrow a demo lighting kit within 48h or send us a sample for a free optical lab analysis with a complete image report — request yours today.",
        },
        fr: {
          name: "Test sur Échantillon",
          h1: "Validez votre faisabilité optique avant achat — Sans engagement",
          metaTitle: "Test sur Échantillon & Prêt de Matériel | Vision Lighting",
          metaDescription:
            "Empruntez une valise de démonstration sous 48h ou envoyez-nous un échantillon pour une analyse optique gratuite en laboratoire avec rapport d'images.",
        },
        de: {
          name: "Musterprüfung",
          h1: "Validieren Sie Ihre optische Machbarkeit vor dem Kauf — Unverbindlich",
          metaTitle: "Musterprüfung & Testgerät Anfragen | Vision Lighting Solutions",
          metaDescription: "Leihen Sie ein Demo-Kit oder senden Sie uns ein Muster für einen kostenlosen Labortest.",
        },
        it: {
          name: "Test su Campione",
          h1: "Valida la tua fattibilità ottica prima dell'acquisto — Senza impegno",
          metaTitle: "Richiedi un Test su Campione o un Kit Demo | Vision Lighting Solutions",
          metaDescription: "Prendi in prestito un kit demo o inviaci un campione per un'analisi di laboratorio gratuita.",
        },
      },
    },
    {
      slug: "mentions-legales",
      routeKey: "/mentions-legales",
      content: {
        en: {
          name: "Legal Notice",
          h1: "Legal Notice & Privacy Policy",
          metaTitle: "Legal Notice & Privacy Policy | Vision Lighting Solutions",
          metaDescription:
            "Legal notice, GDPR data protection policy, cookie declaration and technical liability limitation for vision-lighting-solutions.com — read details.",
        },
        fr: {
          name: "Mentions Légales",
          h1: "Mentions Légales & Politique de Confidentialité",
          metaTitle: "Mentions Légales & Confidentialité | Vision Lighting",
          metaDescription:
            "Mentions légales, politique de protection des données RGPD, déclaration cookies et limitation de responsabilité technique — consultez les détails.",
        },
        de: {
          name: "Impressum",
          h1: "Impressum & Datenschutzerklärung",
          metaTitle: "Impressum & Datenschutz | Vision Lighting Solutions",
          metaDescription: "Impressum, DSGVO-Datenschutzerklärung und Cookie-Hinweis für vision-lighting-solutions.com.",
        },
        it: {
          name: "Note Legali",
          h1: "Note Legali & Informativa sulla Privacy",
          metaTitle: "Note Legali & Privacy | Vision Lighting Solutions",
          metaDescription: "Note legali, informativa privacy GDPR e dichiarazione cookie per vision-lighting-solutions.com.",
        },
      },
    },
  ],
};
