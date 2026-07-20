import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleWithHowToJsonLd, buildFaqPageJsonLd, type HowToStepInput } from "@/lib/jsonld";
import { ContactForm } from "@/components/ContactForm";
import { CameraCompatibility, type CameraCompatInfo, type CameraCompatibilityLabels } from "@/components/CameraCompatibility";

const ROUTE_KEY = "/cablage-integration/compatibilite-camera-keyence";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const RELATED_SLUGS = [
  "brochage-m12-5-pins",
  "convertisseur-pnp-npn",
  "eclairage-stroboscopique-overdrive",
  "compatibilite-camera-cognex",
];

const CAMERAS: Record<Locale, CameraCompatInfo[]> = {
  en: [
    {
      slug: "cv-x",
      name: "CV-X Series",
      application: "High-end multi-camera vision system controller for complex, multi-line inspection.",
      ioType: "Digital I/O via terminal block, supports both NPN and PNP wiring; dedicated STROBE terminal.",
      voltage: "24 VDC.",
      wiringNote:
        "Use the controller's dedicated STROBE terminal for the light's Pin 4 rather than a general-purpose output — it's already meant to drive a strobe signal.",
    },
    {
      slug: "xg-x",
      name: "XG-X Series",
      application: "Compact vision system controller for single or dual-camera inspection cells.",
      ioType: "Digital I/O via terminal block, NPN or PNP wiring supported.",
      voltage: "24 VDC.",
      wiringNote:
        "Confirm the unit's wiring convention before connecting — older XG-X documentation defaults to NPN (sinking) even though PNP wiring is supported.",
    },
    {
      slug: "iv-series",
      name: "IV Series",
      application: "All-in-one compact vision sensor for presence, position and basic inspection checks.",
      ioType: "Digital I/O via connector cable, NPN or PNP configurable.",
      voltage: "24 VDC.",
      wiringNote: "The IV series' compact housing limits output drive current — use it to trigger a light's own driver, not to power the LEDs directly.",
    },
    {
      slug: "sr-2000",
      name: "SR-2000 Series",
      application: "Fixed-mount 1D/2D code reader for track & trace applications.",
      ioType: "Digital I/O via terminal block, NPN or PNP wiring supported.",
      voltage: "24 VDC.",
      wiringNote: "Use a dedicated trigger/strobe terminal, not the read-result output, to avoid missed strobes on failed reads.",
    },
  ],
  fr: [
    {
      slug: "cv-x",
      name: "Série CV-X",
      application: "Contrôleur de vision multi-caméra haut de gamme pour l'inspection complexe multi-lignes.",
      ioType: "E/S numériques sur bornier, câblage NPN ou PNP supporté ; borne STROBE dédiée.",
      voltage: "24 VDC.",
      wiringNote:
        "Utilisez la borne STROBE dédiée du contrôleur pour le Pin 4 de l'éclairage plutôt qu'une sortie généraliste — elle est déjà prévue pour piloter un signal de strobe.",
    },
    {
      slug: "xg-x",
      name: "Série XG-X",
      application: "Contrôleur de vision compact pour cellules d'inspection à une ou deux caméras.",
      ioType: "E/S numériques sur bornier, câblage NPN ou PNP supporté.",
      voltage: "24 VDC.",
      wiringNote:
        "Vérifiez la convention de câblage de l'unité avant de connecter — la documentation des anciens XG-X est par défaut en NPN (drain) même si le câblage PNP est supporté.",
    },
    {
      slug: "iv-series",
      name: "Série IV",
      application: "Capteur de vision compact tout-en-un pour la présence, le positionnement et les contrôles basiques.",
      ioType: "E/S numériques sur câble connecteur, configurable NPN ou PNP.",
      voltage: "24 VDC.",
      wiringNote: "Le boîtier compact de la série IV limite le courant de sortie — utilisez-le pour déclencher le driver de l'éclairage, pas pour alimenter directement les LED.",
    },
    {
      slug: "sr-2000",
      name: "Série SR-2000",
      application: "Lecteur de codes 1D/2D fixe pour les applications de traçabilité.",
      ioType: "E/S numériques sur bornier, câblage NPN ou PNP supporté.",
      voltage: "24 VDC.",
      wiringNote: "Utilisez une borne trigger/strobe dédiée, pas la sortie de résultat de lecture, pour éviter les strobes manqués sur les lectures échouées.",
    },
  ],
  de: [
    {
      slug: "cv-x",
      name: "CV-X Serie",
      application: "Hochwertiger Mehrkamera-Bildverarbeitungscontroller für komplexe, mehrlinige Inspektion.",
      ioType: "Digitale I/O über Klemmenblock, NPN- und PNP-Verdrahtung unterstützt; dedizierte STROBE-Klemme.",
      voltage: "24 VDC.",
      wiringNote:
        "Verwenden Sie die dedizierte STROBE-Klemme des Controllers für Pin 4 der Beleuchtung statt eines Allzweckausgangs — sie ist bereits für ein Blitzsignal vorgesehen.",
    },
    {
      slug: "xg-x",
      name: "XG-X Serie",
      application: "Kompakter Bildverarbeitungscontroller für Ein- oder Zweikamera-Prüfzellen.",
      ioType: "Digitale I/O über Klemmenblock, NPN- oder PNP-Verdrahtung unterstützt.",
      voltage: "24 VDC.",
      wiringNote:
        "Bestätigen Sie die Verdrahtungskonvention des Geräts vor dem Anschluss — ältere XG-X-Dokumentation geht standardmäßig von NPN (Sinking) aus, obwohl PNP-Verdrahtung unterstützt wird.",
    },
    {
      slug: "iv-series",
      name: "IV Serie",
      application: "Kompakter All-in-One-Bildverarbeitungssensor für Anwesenheit, Position und einfache Prüfungen.",
      ioType: "Digitale I/O über Anschlusskabel, NPN oder PNP konfigurierbar.",
      voltage: "24 VDC.",
      wiringNote: "Das kompakte Gehäuse der IV-Serie begrenzt den Ausgangsstrom — nutzen Sie es, um den Treiber der Beleuchtung zu triggern, nicht um die LEDs direkt zu versorgen.",
    },
    {
      slug: "sr-2000",
      name: "SR-2000 Serie",
      application: "Fest montierter 1D/2D-Code-Leser für Track-&-Trace-Anwendungen.",
      ioType: "Digitale I/O über Klemmenblock, NPN- oder PNP-Verdrahtung unterstützt.",
      voltage: "24 VDC.",
      wiringNote: "Verwenden Sie eine dedizierte Trigger-/Blitzklemme statt des Leseergebnis-Ausgangs, um verpasste Blitze bei fehlgeschlagenen Lesungen zu vermeiden.",
    },
  ],
  it: [
    {
      slug: "cv-x",
      name: "Serie CV-X",
      application: "Controller di visione multi-camera di fascia alta per ispezioni complesse multi-linea.",
      ioType: "I/O digitali su morsettiera, cablaggio NPN o PNP supportato; morsetto STROBE dedicato.",
      voltage: "24 VDC.",
      wiringNote:
        "Usa il morsetto STROBE dedicato del controller per il Pin 4 dell'illuminazione invece di un'uscita generica — è già pensato per pilotare un segnale di strobo.",
    },
    {
      slug: "xg-x",
      name: "Serie XG-X",
      application: "Controller di visione compatto per celle di ispezione a una o due camere.",
      ioType: "I/O digitali su morsettiera, cablaggio NPN o PNP supportato.",
      voltage: "24 VDC.",
      wiringNote:
        "Verifica la convenzione di cablaggio dell'unità prima di collegare — la documentazione dei vecchi XG-X è di default in NPN (sink) anche se il cablaggio PNP è supportato.",
    },
    {
      slug: "iv-series",
      name: "Serie IV",
      application: "Sensore di visione compatto tutto-in-uno per presenza, posizione e controlli di base.",
      ioType: "I/O digitali su cavo connettore, configurabile NPN o PNP.",
      voltage: "24 VDC.",
      wiringNote: "L'involucro compatto della serie IV limita la corrente d'uscita — usalo per attivare il driver dell'illuminazione, non per alimentare direttamente i LED.",
    },
    {
      slug: "sr-2000",
      name: "Serie SR-2000",
      application: "Lettore di codici 1D/2D fisso per applicazioni di tracciabilità.",
      ioType: "I/O digitali su morsettiera, cablaggio NPN o PNP supportato.",
      voltage: "24 VDC.",
      wiringNote: "Usa un morsetto trigger/strobo dedicato, non l'uscita del risultato di lettura, per evitare strobi mancati sulle letture fallite.",
    },
  ],
};

const LABELS: Record<Locale, CameraCompatibilityLabels> = {
  en: {
    ioLabel: "I/O Type",
    voltageLabel: "Voltage",
    wiringNoteLabel: "Wiring note:",
    emptyStatePrompt: "Hover or click a camera series to see its I/O type and how to wire it to the light.",
  },
  fr: {
    ioLabel: "Type d'E/S",
    voltageLabel: "Tension",
    wiringNoteLabel: "Note de câblage :",
    emptyStatePrompt: "Survolez ou cliquez sur une série de caméra pour voir son type d'E/S et comment la câbler à l'éclairage.",
  },
  de: {
    ioLabel: "I/O-Typ",
    voltageLabel: "Spannung",
    wiringNoteLabel: "Verkabelungshinweis:",
    emptyStatePrompt: "Bewegen Sie die Maus über eine Kameraserie oder klicken Sie darauf, um deren I/O-Typ und die Verkabelung mit der Beleuchtung zu sehen.",
  },
  it: {
    ioLabel: "Tipo di I/O",
    voltageLabel: "Tensione",
    wiringNoteLabel: "Nota di cablaggio:",
    emptyStatePrompt: "Passa il mouse o clicca su una serie di camere per vedere il suo tipo di I/O e come cablarla all'illuminazione.",
  },
};

export const ARTICLE = {
  en: {
    metaTitle: "Keyence Camera Compatibility | Vision Lighting Solutions",
    metaDescription:
      "Compatible lighting, I/O terminals and trigger wiring for integrating our machine vision lights with Keyence CV-X, XG-X, IV and SR-2000 cameras.",
    h1: "Vision Lighting Compatibility with Keyence Cameras",
    lead: "Keyence vision controllers expose digital I/O through a terminal block or connector supporting both NPN and PNP wiring, and most models include a terminal dedicated to strobe output. Click a camera series below to see its I/O type, voltage, and exactly how to wire it to our lighting.",
    expertTitle: "Trigger Modes & the Dedicated STROBE Terminal",
    expertParagraphs: [
      "Unlike vision systems that require you to repurpose a general-purpose output for lighting, most Keyence controllers (CV-X, XG-X, SR-2000) expose a terminal labeled STROBE specifically to drive an external light in sync with image acquisition. Wiring the light's Pin 4 to this dedicated terminal is simpler and safer than reassigning a shared I/O point — there's no risk of another signal (a read-result or NG output) accidentally firing the strobe.",
      "Keyence documentation, especially for older XG-X units, frequently defaults its wiring diagrams to NPN (sinking) convention even where the hardware also supports PNP. Before wiring Pin 4, confirm which convention your specific controller and firmware version actually use — don't assume from a similar-looking older manual.",
    ],
    overdriveTitle: "Multi-camera fan-out warning",
    overdriveParagraph:
      "CV-X controllers can run several cameras from one unit, and it's tempting to wire multiple lights off a single STROBE terminal to save I/O points. Don't: a single strobe output has limited drive current, and splitting it across several lights without a signal buffer/fan-out driver causes weak, inconsistent, or delayed strobing on some units. Wire one STROBE output per light, or add a dedicated fan-out driver when more lights are needed than the controller has strobe terminals.",
    relatedTitle: "Related wiring guides",
  },
  fr: {
    metaTitle: "Compatibilité Caméra Keyence | Vision Lighting Solutions",
    metaDescription:
      "Éclairages compatibles, bornes d'E/S et câblage du trigger pour intégrer nos éclairages vision aux caméras Keyence CV-X, XG-X, IV et SR-2000.",
    h1: "Compatibilité des Éclairages Vision avec les Caméras Keyence",
    lead: "Les contrôleurs de vision Keyence exposent leurs E/S numériques via un bornier ou un connecteur supportant le câblage NPN et PNP, et la plupart des modèles disposent d'une borne dédiée à la sortie stroboscopique. Cliquez sur une série de caméra ci-dessous pour voir son type d'E/S, sa tension, et comment la câbler exactement à notre éclairage.",
    expertTitle: "Modes de Trigger & Borne STROBE Dédiée",
    expertParagraphs: [
      "Contrairement aux systèmes de vision qui obligent à réaffecter une sortie généraliste à l'éclairage, la plupart des contrôleurs Keyence (CV-X, XG-X, SR-2000) exposent une borne nommée STROBE spécifiquement destinée à piloter un éclairage externe en synchronisation avec l'acquisition d'image. Câbler le Pin 4 de l'éclairage sur cette borne dédiée est plus simple et plus sûr que de réaffecter un point d'E/S partagé : aucun risque qu'un autre signal (résultat de lecture ou sortie NG) déclenche accidentellement le strobe.",
      "La documentation Keyence, en particulier pour les anciennes unités XG-X, présente fréquemment des schémas de câblage par défaut en convention NPN (drain) même quand le matériel supporte aussi le PNP. Avant de câbler le Pin 4, vérifiez quelle convention votre contrôleur et sa version de firmware utilisent réellement — ne présumez rien à partir d'un manuel plus ancien d'apparence similaire.",
    ],
    overdriveTitle: "Avertissement sur le fan-out multi-caméra",
    overdriveParagraph:
      "Les contrôleurs CV-X peuvent piloter plusieurs caméras depuis une seule unité, et il est tentant de câbler plusieurs éclairages sur une seule borne STROBE pour économiser des points d'E/S. Ne le faites pas : une sortie stroboscopique unique a un courant de pilotage limité, et la répartir sur plusieurs éclairages sans driver fan-out/tampon de signal provoque un déclenchement faible, incohérent ou retardé sur certaines unités. Câblez une sortie STROBE par éclairage, ou ajoutez un driver fan-out dédié si vous avez besoin de plus d'éclairages que de bornes strobe disponibles.",
    relatedTitle: "Guides de câblage associés",
  },
  de: {
    metaTitle: "Keyence Kamera-Kompatibilität | Vision Lighting Solutions",
    metaDescription:
      "Kompatible Beleuchtung, I/O-Klemmen und Triggerverdrahtung zur Integration unserer Vision-Beleuchtung mit Keyence CV-X, XG-X, IV und SR-2000 Kameras.",
    h1: "Kompatibilität von Vision-Beleuchtung mit Keyence-Kameras",
    lead: "Keyence Bildverarbeitungscontroller stellen ihre digitale I/O über einen Klemmenblock oder Steckverbinder bereit, der sowohl NPN- als auch PNP-Verdrahtung unterstützt, und die meisten Modelle verfügen über eine dedizierte Klemme für den Blitz-Ausgang. Klicken Sie unten auf eine Kameraserie, um deren I/O-Typ, Spannung und die genaue Verkabelung mit unserer Beleuchtung zu sehen.",
    expertTitle: "Triggermodi & die Dedizierte STROBE-Klemme",
    expertParagraphs: [
      "Im Gegensatz zu Bildverarbeitungssystemen, bei denen Sie einen Allzweckausgang für die Beleuchtung umwidmen müssen, verfügen die meisten Keyence-Controller (CV-X, XG-X, SR-2000) über eine mit STROBE bezeichnete Klemme, die speziell zur Ansteuerung einer externen Beleuchtung synchron zur Bildaufnahme dient. Die Verdrahtung von Pin 4 der Beleuchtung mit dieser dedizierten Klemme ist einfacher und sicherer als die Umwidmung eines gemeinsam genutzten I/O-Punkts — es besteht kein Risiko, dass ein anderes Signal (Leseergebnis oder NG-Ausgang) versehentlich den Blitz auslöst.",
      "Die Keyence-Dokumentation, besonders für ältere XG-X-Geräte, zeigt Verdrahtungsschemata häufig standardmäßig in NPN-Konvention (Sinking), auch wenn die Hardware ebenfalls PNP unterstützt. Bestätigen Sie vor der Verdrahtung von Pin 4, welche Konvention Ihr konkreter Controller und dessen Firmware-Version tatsächlich verwenden — verlassen Sie sich nicht auf ein ähnlich aussehendes älteres Handbuch.",
    ],
    overdriveTitle: "Warnung zum Mehrkamera-Fan-out",
    overdriveParagraph:
      "CV-X-Controller können mehrere Kameras von einer Einheit aus betreiben, und es ist verlockend, mehrere Beleuchtungen an einer einzigen STROBE-Klemme zu verdrahten, um I/O-Punkte zu sparen. Tun Sie das nicht: Ein einzelner Blitz-Ausgang hat begrenzten Ausgangsstrom, und die Aufteilung auf mehrere Beleuchtungen ohne Signalpuffer/Fan-out-Treiber führt bei manchen Geräten zu schwachem, inkonsistentem oder verzögertem Blitzen. Verdrahten Sie einen STROBE-Ausgang pro Beleuchtung, oder fügen Sie einen dedizierten Fan-out-Treiber hinzu, wenn mehr Beleuchtungen benötigt werden als der Controller Blitzklemmen hat.",
    relatedTitle: "Verwandte Verkabelungsleitfäden",
  },
  it: {
    metaTitle: "Compatibilità Camera Keyence | Vision Lighting Solutions",
    metaDescription:
      "Illuminazioni compatibili, morsetti I/O e cablaggio del trigger per integrare le nostre illuminazioni vision con le camere Keyence CV-X, XG-X, IV e SR-2000.",
    h1: "Compatibilità dell'Illuminazione Vision con le Camere Keyence",
    lead: "I controller di visione Keyence espongono i loro I/O digitali tramite una morsettiera o un connettore che supporta il cablaggio sia NPN che PNP, e la maggior parte dei modelli include un morsetto dedicato all'uscita stroboscopica. Clicca su una serie di camere qui sotto per vedere il suo tipo di I/O, la tensione e come cablarla esattamente alla nostra illuminazione.",
    expertTitle: "Modalità Trigger & Morsetto STROBE Dedicato",
    expertParagraphs: [
      "A differenza dei sistemi di visione che obbligano a riassegnare un'uscita generica all'illuminazione, la maggior parte dei controller Keyence (CV-X, XG-X, SR-2000) espone un morsetto denominato STROBE specificamente destinato a pilotare un'illuminazione esterna in sincronia con l'acquisizione dell'immagine. Cablare il Pin 4 dell'illuminazione su questo morsetto dedicato è più semplice e sicuro che riassegnare un punto di I/O condiviso — nessun rischio che un altro segnale (risultato di lettura o uscita NG) attivi accidentalmente lo strobo.",
      "La documentazione Keyence, specialmente per le unità XG-X più datate, mostra spesso schemi di cablaggio predefiniti in convenzione NPN (sink) anche quando l'hardware supporta anche il PNP. Prima di cablare il Pin 4, verifica quale convenzione utilizzi realmente il tuo controller specifico e la sua versione firmware — non presumere nulla da un manuale più vecchio dall'aspetto simile.",
    ],
    overdriveTitle: "Avvertenza sul fan-out multi-camera",
    overdriveParagraph:
      "I controller CV-X possono pilotare più camere da un'unica unità, ed è allettante cablare più illuminazioni su un singolo morsetto STROBE per risparmiare punti di I/O. Non farlo: un'unica uscita stroboscopica ha corrente di pilotaggio limitata, e suddividerla su più illuminazioni senza un driver fan-out/buffer di segnale causa uno strobo debole, incoerente o ritardato su alcune unità. Cabla un'uscita STROBE per ogni illuminazione, oppure aggiungi un driver fan-out dedicato se servono più illuminazioni dei morsetti strobo disponibili sul controller.",
    relatedTitle: "Guide di cablaggio correlate",
  },
} satisfies Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    lead: string;
    expertTitle: string;
    expertParagraphs: [string, string];
    overdriveTitle: string;
    overdriveParagraph: string;
    relatedTitle: string;
  }
>;

const STEP_TEMPLATES: Record<Locale, Array<{ name: string; text: string }>> = {
  en: [
    { name: "Identify your camera series", text: "Identify your Keyence camera series and confirm its digital I/O runs at 24 VDC." },
    { name: "Locate the STROBE terminal", text: "Locate the controller's dedicated STROBE terminal (CV-X, XG-X, SR-2000) or configure a strobe output (IV series)." },
    { name: "Match the wiring convention", text: "Confirm whether the terminal is wired NPN (sinking) or PNP (sourcing) and match the light's Pin 4 wiring accordingly." },
    { name: "Wire the common ground", text: "Wire the controller's 0V/common reference to the light's Pin 3 (GND) so both share a common ground." },
    { name: "Test at low speed first", text: "Test the trigger at a low frame rate first, then verify strobe timing against the camera's exposure before running at full line speed." },
  ],
  fr: [
    { name: "Identifiez votre série de caméra", text: "Identifiez la série de votre caméra Keyence et confirmez que ses E/S numériques fonctionnent en 24 VDC." },
    { name: "Localisez la borne STROBE", text: "Localisez la borne STROBE dédiée du contrôleur (CV-X, XG-X, SR-2000) ou configurez une sortie strobe (série IV)." },
    { name: "Faites correspondre la convention de câblage", text: "Vérifiez si la borne est câblée en NPN (drain) ou PNP (source) et faites correspondre le câblage du Pin 4 de l'éclairage en conséquence." },
    { name: "Câblez la masse commune", text: "Câblez la référence 0V/commune du contrôleur au Pin 3 (GND) de l'éclairage afin que les deux partagent une masse commune." },
    { name: "Testez d'abord à basse vitesse", text: "Testez le trigger à basse cadence d'abord, puis vérifiez le timing du strobe par rapport à l'exposition de la caméra avant de passer à pleine vitesse de ligne." },
  ],
  de: [
    { name: "Kameraserie identifizieren", text: "Identifizieren Sie Ihre Keyence-Kameraserie und bestätigen Sie, dass die digitale I/O mit 24 VDC läuft." },
    { name: "STROBE-Klemme lokalisieren", text: "Lokalisieren Sie die dedizierte STROBE-Klemme des Controllers (CV-X, XG-X, SR-2000) oder konfigurieren Sie einen Blitz-Ausgang (IV-Serie)." },
    { name: "Verdrahtungskonvention anpassen", text: "Bestätigen Sie, ob die Klemme NPN (Sinking) oder PNP (Sourcing) verdrahtet ist, und passen Sie die Pin-4-Verdrahtung der Beleuchtung entsprechend an." },
    { name: "Gemeinsame Masse verdrahten", text: "Verdrahten Sie die 0V-/Bezugsmasse des Controllers mit Pin 3 (GND) der Beleuchtung, damit beide eine gemeinsame Masse teilen." },
    { name: "Zuerst bei niedriger Geschwindigkeit testen", text: "Testen Sie den Trigger zunächst bei niedriger Bildrate und prüfen Sie dann das Blitz-Timing gegen die Kamerabelichtung, bevor Sie mit voller Liniengeschwindigkeit fahren." },
  ],
  it: [
    { name: "Identifica la serie della camera", text: "Identifica la serie della tua camera Keyence e conferma che i suoi I/O digitali funzionino a 24 VDC." },
    { name: "Individua il morsetto STROBE", text: "Individua il morsetto STROBE dedicato del controller (CV-X, XG-X, SR-2000) o configura un'uscita strobo (serie IV)." },
    { name: "Fai corrispondere la convenzione di cablaggio", text: "Verifica se il morsetto è cablato in NPN (sink) o PNP (source) e fai corrispondere di conseguenza il cablaggio del Pin 4 dell'illuminazione." },
    { name: "Cabla la massa comune", text: "Cabla il riferimento 0V/comune del controller al Pin 3 (GND) dell'illuminazione in modo che entrambi condividano una massa comune." },
    { name: "Testa prima a bassa velocità", text: "Testa prima il trigger a un frame rate basso, poi verifica il timing dello strobo rispetto all'esposizione della camera prima di procedere a piena velocità di linea." },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = ARTICLE[locale];
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: buildLanguageAlternates(ROUTE_KEY, locale),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = ARTICLE[locale];
  const relatedSegments = RELATED_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const steps: HowToStepInput[] = STEP_TEMPLATES[locale];

  const jsonLd = buildTechArticleWithHowToJsonLd({
    path: `/${locale}${ROUTE_KEY}`,
    locale,
    headline: t.h1,
    description: t.metaDescription,
    image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    dependencies: "Keyence CV-X, XG-X, IV or SR-2000 camera with a STROBE terminal, 24 VDC common supply, our M12 5-pin lighting.",
    totalTime: "PT15M",
    steps,
  });

  const faqJsonLd =
    locale === "en" || locale === "fr"
      ? buildFaqPageJsonLd({
          path: `/${locale}${ROUTE_KEY}`,
          locale,
          faqs:
            locale === "fr"
              ? [
          { question: "Comment les contr\u00f4leurs Keyence g\u00e8rent-ils le c\u00e2blage trigger et strobe ?", answer: "Les contr\u00f4leurs de vision Keyence exposent leurs E/S num\u00e9riques via un bornier ou un connecteur supportant le c\u00e2blage NPN et PNP, et la plupart des mod\u00e8les disposent d'une borne d\u00e9di\u00e9e \u00e0 la sortie stroboscopique." },
          { question: "Que faut-il pour c\u00e2bler une cam\u00e9ra Keyence \u00e0 un \u00e9clairage Vision Lighting Solutions ?", answer: "S\u00e9lectionnez votre s\u00e9rie de cam\u00e9ra Keyence sur cette page pour voir son type d'E/S, sa tension, et le c\u00e2blage exact permettant de connecter sa sortie strobe au connecteur M12 de notre \u00e9clairage." },
                ]
              : [
          { question: "How do Keyence vision controllers handle trigger and strobe wiring?", answer: "Keyence vision controllers expose digital I/O through a terminal block or connector supporting both NPN and PNP wiring, and most models include a terminal dedicated to strobe output." },
          { question: "What do I need to wire a Keyence camera to Vision Lighting Solutions lighting?", answer: "Select your Keyence camera series on this page to see its I/O type, voltage, and the exact wiring needed to connect its strobe output to our lighting's M12 connector." },
                ],
        })
      : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {t.h1}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{t.lead}</p>

      <div className="mt-10">
        <CameraCompatibility cameras={CAMERAS[locale]} labels={LABELS[locale]} />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t.expertTitle}
        </h2>
        {t.expertParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 30)} className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            {paragraph}
          </p>
        ))}

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
          <h3 className="font-semibold text-red-900 dark:text-red-300">{t.overdriveTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-red-800 dark:text-red-300/90">{t.overdriveParagraph}</p>
        </div>
      </section>

      {(locale === "en" || locale === "fr") && (
        <div className="mt-14">
          <ContactForm locale={locale} contextType="wiring" subjectContext={t.h1} />
        </div>
      )}

      {relatedSegments.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.relatedTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedSegments.map((segment) => (
              <li key={segment.slug}>
                <Link
                  href={segment.routeKey as never}
                  className="block rounded-lg border border-slate-200 p-4 text-sm text-slate-700 transition hover:border-amber-500 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-slate-100"
                >
                  {segment.content[locale].name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
