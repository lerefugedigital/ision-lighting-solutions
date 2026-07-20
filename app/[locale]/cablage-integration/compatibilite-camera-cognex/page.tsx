import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleWithHowToJsonLd, type HowToStepInput } from "@/lib/jsonld";
import { CameraCompatibility, type CameraCompatInfo, type CameraCompatibilityLabels } from "@/components/CameraCompatibility";

const ROUTE_KEY = "/cablage-integration/compatibilite-camera-cognex";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const RELATED_SLUGS = [
  "brochage-m12-5-pins",
  "convertisseur-pnp-npn",
  "eclairage-stroboscopique-overdrive",
  "compatibilite-camera-keyence",
];

const CAMERAS: Record<Locale, CameraCompatInfo[]> = {
  en: [
    {
      slug: "insight-2000",
      name: "In-Sight 2000 Series",
      application: "Compact vision sensor for presence/absence and simple ID checks.",
      ioType: "Opto-isolated digital I/O, PNP or NPN configurable in software.",
      voltage: "24 VDC (10-30 V input range).",
      wiringNote:
        "Dedicate one output to the light's Pin 4 and match its configured polarity — don't share it with a Pass/Fail signal.",
    },
    {
      slug: "insight-7000",
      name: "In-Sight 7000 Series",
      application: "Industrial-grade vision system for inspection and gauging on production lines.",
      ioType: "Opto-isolated digital I/O, PNP or NPN configurable per output.",
      voltage: "24 VDC (10-30 V input range).",
      wiringNote: "Verify the output's configured polarity in In-Sight Explorer before wiring it to Pin 4.",
    },
    {
      slug: "insight-8000-9000",
      name: "In-Sight 8000 / 9000 Series",
      application: "High-resolution vision system for demanding inspection and deep learning applications.",
      ioType: "Opto-isolated digital I/O, PNP or NPN configurable, additional high-speed I/O available.",
      voltage: "24 VDC (10-30 V input range).",
      wiringNote: "Use a dedicated high-speed output for the strobe signal to minimize trigger jitter.",
    },
    {
      slug: "dataman-470-475",
      name: "DataMan 470 / 475",
      application: "Fixed-mount barcode / 2D code reader for track & trace applications.",
      ioType: "Opto-isolated digital I/O, configurable via DataMan Setup Tool.",
      voltage: "24 VDC (10-30 V input range).",
      wiringNote: "Use a dedicated trigger/strobe output, not the \"Good Read\" output, to avoid missed strobes on failed reads.",
    },
  ],
  fr: [
    {
      slug: "insight-2000",
      name: "Série In-Sight 2000",
      application: "Capteur de vision compact pour la présence/absence et les contrôles d'identification simples.",
      ioType: "E/S numériques optocouplées, configurables en PNP ou NPN par logiciel.",
      voltage: "24 VDC (plage d'entrée 10-30 V).",
      wiringNote:
        "Dédiez une sortie au Pin 4 de l'éclairage et faites correspondre sa polarité configurée — ne la partagez pas avec un signal Pass/Fail.",
    },
    {
      slug: "insight-7000",
      name: "Série In-Sight 7000",
      application: "Système de vision industriel pour l'inspection et le contrôle dimensionnel en ligne de production.",
      ioType: "E/S numériques optocouplées, configurables en PNP ou NPN par sortie.",
      voltage: "24 VDC (plage d'entrée 10-30 V).",
      wiringNote: "Vérifiez la polarité configurée de la sortie dans In-Sight Explorer avant de la câbler au Pin 4.",
    },
    {
      slug: "insight-8000-9000",
      name: "Série In-Sight 8000 / 9000",
      application: "Système de vision haute résolution pour l'inspection exigeante et les applications de deep learning.",
      ioType: "E/S numériques optocouplées, PNP ou NPN configurables, E/S haute vitesse additionnelles disponibles.",
      voltage: "24 VDC (plage d'entrée 10-30 V).",
      wiringNote: "Utilisez une sortie haute vitesse dédiée pour le signal de strobe afin de minimiser la gigue du trigger.",
    },
    {
      slug: "dataman-470-475",
      name: "DataMan 470 / 475",
      application: "Lecteur de codes-barres / 2D fixe pour les applications de traçabilité.",
      ioType: "E/S numériques optocouplées, configurables via DataMan Setup Tool.",
      voltage: "24 VDC (plage d'entrée 10-30 V).",
      wiringNote:
        "Utilisez une sortie trigger/strobe dédiée, pas la sortie « Good Read », pour éviter les strobes manqués sur les lectures échouées.",
    },
  ],
  de: [
    {
      slug: "insight-2000",
      name: "In-Sight 2000 Serie",
      application: "Kompakter Vision-Sensor für Anwesenheits-/Abwesenheitsprüfung und einfache ID-Kontrollen.",
      ioType: "Optogekoppelte digitale I/O, per Software als PNP oder NPN konfigurierbar.",
      voltage: "24 VDC (Eingangsbereich 10-30 V).",
      wiringNote:
        "Widmen Sie einen Ausgang dem Pin 4 der Beleuchtung und passen Sie dessen konfigurierte Polarität an — teilen Sie ihn nicht mit einem Pass/Fail-Signal.",
    },
    {
      slug: "insight-7000",
      name: "In-Sight 7000 Serie",
      application: "Industrietaugliches Bildverarbeitungssystem für Inspektion und Messung in Fertigungslinien.",
      ioType: "Optogekoppelte digitale I/O, pro Ausgang als PNP oder NPN konfigurierbar.",
      voltage: "24 VDC (Eingangsbereich 10-30 V).",
      wiringNote: "Überprüfen Sie die konfigurierte Polarität des Ausgangs in In-Sight Explorer, bevor Sie ihn mit Pin 4 verdrahten.",
    },
    {
      slug: "insight-8000-9000",
      name: "In-Sight 8000 / 9000 Serie",
      application: "Hochauflösendes Bildverarbeitungssystem für anspruchsvolle Inspektion und Deep-Learning-Anwendungen.",
      ioType: "Optogekoppelte digitale I/O, PNP oder NPN konfigurierbar, zusätzliche Hochgeschwindigkeits-I/O verfügbar.",
      voltage: "24 VDC (Eingangsbereich 10-30 V).",
      wiringNote: "Verwenden Sie einen dedizierten Hochgeschwindigkeitsausgang für das Blitzsignal, um Trigger-Jitter zu minimieren.",
    },
    {
      slug: "dataman-470-475",
      name: "DataMan 470 / 475",
      application: "Fest montierter Barcode-/2D-Code-Leser für Track-&-Trace-Anwendungen.",
      ioType: "Optogekoppelte digitale I/O, konfigurierbar über das DataMan Setup Tool.",
      voltage: "24 VDC (Eingangsbereich 10-30 V).",
      wiringNote:
        "Verwenden Sie einen dedizierten Trigger-/Blitzausgang statt des „Good Read\"-Ausgangs, um verpasste Blitze bei fehlgeschlagenen Lesungen zu vermeiden.",
    },
  ],
  it: [
    {
      slug: "insight-2000",
      name: "Serie In-Sight 2000",
      application: "Sensore di visione compatto per verifica presenza/assenza e controlli di identificazione semplici.",
      ioType: "I/O digitali optoaccoppiati, configurabili come PNP o NPN via software.",
      voltage: "24 VDC (intervallo di ingresso 10-30 V).",
      wiringNote:
        "Dedica un'uscita al Pin 4 dell'illuminazione e fai corrispondere la sua polarità configurata — non condividerla con un segnale Pass/Fail.",
    },
    {
      slug: "insight-7000",
      name: "Serie In-Sight 7000",
      application: "Sistema di visione di livello industriale per ispezione e controllo dimensionale in linea di produzione.",
      ioType: "I/O digitali optoaccoppiati, configurabili come PNP o NPN per uscita.",
      voltage: "24 VDC (intervallo di ingresso 10-30 V).",
      wiringNote: "Verifica la polarità configurata dell'uscita in In-Sight Explorer prima di cablarla al Pin 4.",
    },
    {
      slug: "insight-8000-9000",
      name: "Serie In-Sight 8000 / 9000",
      application: "Sistema di visione ad alta risoluzione per ispezioni esigenti e applicazioni di deep learning.",
      ioType: "I/O digitali optoaccoppiati, PNP o NPN configurabili, I/O aggiuntivi ad alta velocità disponibili.",
      voltage: "24 VDC (intervallo di ingresso 10-30 V).",
      wiringNote: "Usa un'uscita ad alta velocità dedicata per il segnale di strobo per minimizzare il jitter del trigger.",
    },
    {
      slug: "dataman-470-475",
      name: "DataMan 470 / 475",
      application: "Lettore di codici a barre / 2D fisso per applicazioni di tracciabilità.",
      ioType: "I/O digitali optoaccoppiati, configurabili tramite DataMan Setup Tool.",
      voltage: "24 VDC (intervallo di ingresso 10-30 V).",
      wiringNote:
        "Usa un'uscita trigger/strobo dedicata, non l'uscita \"Good Read\", per evitare strobi mancati sulle letture fallite.",
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
    metaTitle: "Cognex Camera Compatibility | Vision Lighting Solutions",
    metaDescription:
      "Compatible lighting, I/O configuration and trigger wiring for integrating our machine vision lights with Cognex In-Sight and DataMan cameras.",
    h1: "Vision Lighting Compatibility with Cognex Cameras",
    lead: "Cognex In-Sight and DataMan cameras drive their trigger and strobe signals through software-configurable, opto-isolated digital I/O. Click a camera series below to see its I/O type, voltage, and exactly how to wire it to our lighting.",
    expertTitle: "Synchronizing Trigger and Exposure",
    expertParagraphs: [
      "On every Cognex camera, each digital output can be individually assigned in In-Sight Explorer (or the DataMan Setup Tool) to a specific signal — Acquisition Trigger, Strobe, Pass/Fail, Good Read, and more — and each output's polarity can be set independently to Active High (PNP/sourcing) or Active Low (NPN/sinking).",
      "The most common integration mistake isn't a wiring error at all: it's reusing an output that's already assigned to Pass/Fail or Good Read signaling to also drive the light. Whenever another event toggles that output, the light fires an unplanned strobe — wasting LED lifetime and, on fast lines, washing out the very frame the camera is trying to capture. Always dedicate a single output exclusively to the strobe signal.",
    ],
    overdriveTitle: "Cable routing warning",
    overdriveParagraph:
      "Keep the trigger/strobe cable short and shielded, especially when it runs alongside VFD or servo drive cabling. A long, unshielded run between the camera's output and the light's Pin 4 picks up electrical noise that can cause false triggers or jitter in the strobe timing — tie the cable shield to Pin 5 (FE) at the lighting end, not to the camera's signal ground.",
    relatedTitle: "Related wiring guides",
  },
  fr: {
    metaTitle: "Compatibilité Caméra Cognex | Vision Lighting Solutions",
    metaDescription:
      "Éclairages compatibles, configuration des E/S et câblage du trigger pour intégrer nos éclairages vision aux caméras Cognex In-Sight et DataMan.",
    h1: "Compatibilité des Éclairages Vision avec les Caméras Cognex",
    lead: "Les caméras Cognex In-Sight et DataMan pilotent leurs signaux de trigger et de strobe via des E/S numériques optocouplées configurables par logiciel. Cliquez sur une série de caméra ci-dessous pour voir son type d'E/S, sa tension, et comment la câbler exactement à notre éclairage.",
    expertTitle: "Synchroniser Trigger et Exposition",
    expertParagraphs: [
      "Sur toute caméra Cognex, chaque sortie numérique peut être assignée individuellement dans In-Sight Explorer (ou le DataMan Setup Tool) à un signal précis — trigger d'acquisition, strobe, Pass/Fail, Good Read, etc. — et la polarité de chaque sortie peut être réglée indépendamment en Active High (PNP/source) ou Active Low (NPN/drain).",
      "L'erreur d'intégration la plus fréquente n'est pas une erreur de câblage : c'est la réutilisation d'une sortie déjà assignée au signal Pass/Fail ou Good Read pour piloter aussi l'éclairage. Dès qu'un autre événement bascule cette sortie, l'éclairage déclenche un strobe non planifié — usant inutilement les LED et, sur les lignes rapides, saturant l'image même que la caméra tente de capturer. Dédiez toujours une sortie unique et exclusive au signal de strobe.",
    ],
    overdriveTitle: "Avertissement sur le cheminement du câble",
    overdriveParagraph:
      "Gardez le câble trigger/strobe court et blindé, surtout s'il chemine à proximité de câbles de variateur ou de servomoteur. Un câble long et non blindé entre la sortie caméra et le Pin 4 de l'éclairage capte du bruit électrique pouvant provoquer des déclenchements intempestifs ou de la gigue sur le timing du strobe — reliez le blindage du câble au Pin 5 (FE) côté éclairage, pas à la masse signal de la caméra.",
    relatedTitle: "Guides de câblage associés",
  },
  de: {
    metaTitle: "Cognex Kamera-Kompatibilität | Vision Lighting Solutions",
    metaDescription:
      "Kompatible Beleuchtung, I/O-Konfiguration und Triggerverdrahtung zur Integration unserer Vision-Beleuchtung mit Cognex In-Sight und DataMan Kameras.",
    h1: "Kompatibilität von Vision-Beleuchtung mit Cognex-Kameras",
    lead: "Cognex In-Sight und DataMan Kameras steuern ihre Trigger- und Blitzsignale über softwarekonfigurierbare, optogekoppelte digitale I/O. Klicken Sie unten auf eine Kameraserie, um deren I/O-Typ, Spannung und die genaue Verkabelung mit unserer Beleuchtung zu sehen.",
    expertTitle: "Trigger und Belichtung Synchronisieren",
    expertParagraphs: [
      "Bei jeder Cognex-Kamera kann jeder digitale Ausgang in In-Sight Explorer (oder dem DataMan Setup Tool) individuell einem bestimmten Signal zugewiesen werden — Aufnahmetrigger, Blitz, Pass/Fail, Good Read und mehr — und die Polarität jedes Ausgangs kann unabhängig auf Active High (PNP/Sourcing) oder Active Low (NPN/Sinking) gesetzt werden.",
      "Der häufigste Integrationsfehler ist gar kein Verdrahtungsfehler: Es ist die Wiederverwendung eines bereits für Pass/Fail- oder Good-Read-Signalisierung zugewiesenen Ausgangs, um auch die Beleuchtung anzusteuern. Sobald ein anderes Ereignis diesen Ausgang umschaltet, löst die Beleuchtung einen ungeplanten Blitz aus — das verschwendet LED-Lebensdauer und überbelichtet auf schnellen Linien genau das Bild, das die Kamera aufnehmen soll. Widmen Sie dem Blitzsignal immer einen einzigen, exklusiven Ausgang.",
    ],
    overdriveTitle: "Warnung zur Kabelführung",
    overdriveParagraph:
      "Halten Sie das Trigger-/Blitzkabel kurz und geschirmt, besonders wenn es entlang von Frequenzumrichter- oder Servoantriebskabeln verläuft. Eine lange, ungeschirmte Strecke zwischen dem Kameraausgang und Pin 4 der Beleuchtung nimmt elektrische Störungen auf, die Fehlauslösungen oder Jitter im Blitz-Timing verursachen können — verbinden Sie den Kabelschirm mit Pin 5 (FE) auf der Beleuchtungsseite, nicht mit der Signalmasse der Kamera.",
    relatedTitle: "Verwandte Verkabelungsleitfäden",
  },
  it: {
    metaTitle: "Compatibilità Camera Cognex | Vision Lighting Solutions",
    metaDescription:
      "Illuminazioni compatibili, configurazione I/O e cablaggio del trigger per integrare le nostre illuminazioni vision con le camere Cognex In-Sight e DataMan.",
    h1: "Compatibilità dell'Illuminazione Vision con le Camere Cognex",
    lead: "Le camere Cognex In-Sight e DataMan pilotano i segnali di trigger e strobo tramite I/O digitali optoaccoppiati configurabili via software. Clicca su una serie di camere qui sotto per vedere il suo tipo di I/O, la tensione e come cablarla esattamente alla nostra illuminazione.",
    expertTitle: "Sincronizzare Trigger ed Esposizione",
    expertParagraphs: [
      "Su ogni camera Cognex, ciascuna uscita digitale può essere assegnata individualmente in In-Sight Explorer (o nel DataMan Setup Tool) a un segnale specifico — trigger di acquisizione, strobo, Pass/Fail, Good Read e altro — e la polarità di ciascuna uscita può essere impostata indipendentemente su Active High (PNP/source) o Active Low (NPN/sink).",
      "L'errore di integrazione più comune non è affatto un errore di cablaggio: è il riutilizzo di un'uscita già assegnata alla segnalazione Pass/Fail o Good Read per pilotare anche l'illuminazione. Ogni volta che un altro evento commuta quell'uscita, l'illuminazione attiva uno strobo non pianificato — consumando inutilmente la vita dei LED e, sulle linee veloci, saturando proprio il fotogramma che la camera sta cercando di catturare. Dedica sempre un'unica uscita esclusiva al segnale di strobo.",
    ],
    overdriveTitle: "Avvertenza sul percorso del cavo",
    overdriveParagraph:
      "Mantieni il cavo trigger/strobo corto e schermato, specialmente quando corre insieme a cavi di inverter o servoazionamenti. Un percorso lungo e non schermato tra l'uscita della camera e il Pin 4 dell'illuminazione capta disturbi elettrici che possono causare trigger falsi o jitter nel timing dello strobo — collega la schermatura del cavo al Pin 5 (FE) lato illuminazione, non alla massa segnale della camera.",
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
    { name: "Identify your camera series", text: "Identify your Cognex camera series and confirm its digital I/O runs at 24 VDC (10-30 V range)." },
    { name: "Dedicate an output to the strobe", text: "In In-Sight Explorer (or DataMan Setup Tool), configure a dedicated output for the strobe/trigger signal, separate from Pass/Fail or Good Read." },
    { name: "Match the output polarity", text: "Set that output's polarity to Active High (PNP) or Active Low (NPN) to match the light's Pin 4 wiring." },
    { name: "Wire the common ground", text: "Wire the camera's 0V/common reference to the light's Pin 3 (GND) so both share a common ground." },
    { name: "Test at low speed first", text: "Test the trigger at a low frame rate first, then verify strobe timing against the camera's exposure before running at full line speed." },
  ],
  fr: [
    { name: "Identifiez votre série de caméra", text: "Identifiez la série de votre caméra Cognex et confirmez que ses E/S numériques fonctionnent en 24 VDC (plage 10-30 V)." },
    { name: "Dédiez une sortie au strobe", text: "Dans In-Sight Explorer (ou DataMan Setup Tool), configurez une sortie dédiée au signal strobe/trigger, distincte du Pass/Fail ou du Good Read." },
    { name: "Faites correspondre la polarité", text: "Réglez la polarité de cette sortie en Active High (PNP) ou Active Low (NPN) pour correspondre au câblage du Pin 4 de l'éclairage." },
    { name: "Câblez la masse commune", text: "Câblez la référence 0V/commune de la caméra au Pin 3 (GND) de l'éclairage afin que les deux partagent une masse commune." },
    { name: "Testez d'abord à basse vitesse", text: "Testez le trigger à basse cadence d'abord, puis vérifiez le timing du strobe par rapport à l'exposition de la caméra avant de passer à pleine vitesse de ligne." },
  ],
  de: [
    { name: "Kameraserie identifizieren", text: "Identifizieren Sie Ihre Cognex-Kameraserie und bestätigen Sie, dass die digitale I/O mit 24 VDC (Bereich 10-30 V) läuft." },
    { name: "Ausgang für den Blitz widmen", text: "Konfigurieren Sie in In-Sight Explorer (oder dem DataMan Setup Tool) einen dedizierten Ausgang für das Blitz-/Triggersignal, getrennt von Pass/Fail oder Good Read." },
    { name: "Polarität anpassen", text: "Stellen Sie die Polarität dieses Ausgangs auf Active High (PNP) oder Active Low (NPN) ein, passend zur Pin-4-Verdrahtung der Beleuchtung." },
    { name: "Gemeinsame Masse verdrahten", text: "Verdrahten Sie die 0V-/Bezugsmasse der Kamera mit Pin 3 (GND) der Beleuchtung, damit beide eine gemeinsame Masse teilen." },
    { name: "Zuerst bei niedriger Geschwindigkeit testen", text: "Testen Sie den Trigger zunächst bei niedriger Bildrate und prüfen Sie dann das Blitz-Timing gegen die Kamerabelichtung, bevor Sie mit voller Liniengeschwindigkeit fahren." },
  ],
  it: [
    { name: "Identifica la serie della camera", text: "Identifica la serie della tua camera Cognex e conferma che i suoi I/O digitali funzionino a 24 VDC (intervallo 10-30 V)." },
    { name: "Dedica un'uscita allo strobo", text: "In In-Sight Explorer (o DataMan Setup Tool), configura un'uscita dedicata al segnale strobo/trigger, separata da Pass/Fail o Good Read." },
    { name: "Fai corrispondere la polarità", text: "Imposta la polarità di quell'uscita su Active High (PNP) o Active Low (NPN) per corrispondere al cablaggio del Pin 4 dell'illuminazione." },
    { name: "Cabla la massa comune", text: "Cabla il riferimento 0V/comune della camera al Pin 3 (GND) dell'illuminazione in modo che entrambi condividano una massa comune." },
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
    alternates: buildLanguageAlternates(ROUTE_KEY),
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
    dependencies: "Cognex In-Sight or DataMan camera with configurable digital I/O, 24 VDC common supply, our M12 5-pin lighting.",
    totalTime: "PT15M",
    steps,
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
