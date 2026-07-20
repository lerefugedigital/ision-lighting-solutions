import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleWithHowToJsonLd, type HowToStepInput } from "@/lib/jsonld";
import { M12Interactive, type M12PinInfo, type M12InteractiveLabels } from "@/components/M12Interactive";

const ROUTE_KEY = "/cablage-integration/brochage-m12-5-pins";

/** Published once; bump only when the pinout/content is meaningfully revised. */
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const RELATED_SLUGS = [
  "convertisseur-pnp-npn",
  "eclairage-stroboscopique-overdrive",
  "compatibilite-camera-cognex",
  "compatibilite-camera-keyence",
];

const PINS: Record<Locale, M12PinInfo[]> = {
  en: [
    {
      number: 1,
      wireColorName: "Brown",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "+24VDC Power Supply (+/- 10% tolerance). Max current depends on LED power.",
      pitfall:
        "Undersized power supply or long cable runs cause voltage drop — LEDs draw peak current during strobe/overdrive, so size the PSU for peak, not average, current.",
    },
    {
      number: 2,
      wireColorName: "White",
      wireColorHex: "#e2e8f0",
      signal: "Dimming (0-10V / PWM)",
      role: "Analog Dimming (0-10V) or PWM. Allows 0 to 100% intensity control.",
      pitfall:
        "A floating (unconnected) Pin 2 can leave brightness undefined or jump to maximum — and a PWM frequency mismatched with the camera's exposure causes visible flicker or banding in captured images.",
    },
    {
      number: 3,
      wireColorName: "Blue",
      wireColorHex: "#2563eb",
      signal: "0V / GND",
      role: "Ground / 0V / GND. Common reference for power and logic signals.",
      pitfall:
        "Never use Pin 3 as a substitute for Functional Earth (Pin 5) — mixing signal ground and shield ground at the wrong point creates ground loops and injects noise into the trigger line.",
    },
    {
      number: 4,
      wireColorName: "Black",
      wireColorHex: "#0f172a",
      signal: "Trigger / Strobe",
      role: "Trigger / Strobe Input. PNP threshold (Active at +24V) or NPN (Active at 0V). Do not exceed max duty cycle in Overdrive mode.",
      pitfall:
        "In pure Flash/Strobe (overdrive) mode, never leave Pin 4 held permanently high — the LEDs are only rated for the strobe's short duty cycle at that current, and continuous drive at overdrive current will burn them out.",
    },
    {
      number: 5,
      wireColorName: "Gray",
      wireColorHex: "#9ca3af",
      signal: "FE (Functional Earth)",
      role: "Functional Earth (FE). Connection to cable shield for optimal EMC protection.",
      pitfall:
        "Pin 5 is frequently left unconnected by mistake — an unterminated shield defeats EMC protection and leaves the trigger/dimming lines exposed to electrical noise from nearby VFDs and servo drives.",
    },
  ],
  fr: [
    {
      number: 1,
      wireColorName: "Marron",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "Alimentation +24VDC (Tolérance +/- 10%). Courant max dépendant de la puissance de la LED.",
      pitfall:
        "Une alimentation sous-dimensionnée ou un câble trop long entraîne une chute de tension : dimensionnez l'alimentation sur le courant de crête (mode overdrive), pas sur le courant moyen.",
    },
    {
      number: 2,
      wireColorName: "Blanc",
      wireColorHex: "#e2e8f0",
      signal: "Gradation (0-10V / PWM)",
      role: "Gradation Analogique (0-10V) ou PWM. Permet le contrôle d'intensité de 0 à 100%.",
      pitfall:
        "Un Pin 2 laissé flottant peut laisser l'intensité indéfinie ou passer au maximum — et une fréquence PWM mal accordée avec l'obturateur de la caméra provoque du scintillement ou du banding visible sur les images.",
    },
    {
      number: 3,
      wireColorName: "Bleu",
      wireColorHex: "#2563eb",
      signal: "0V / Masse",
      role: "Masse / 0V / GND. Référence commune pour l'alimentation et les signaux logiques.",
      pitfall:
        "Ne jamais utiliser le Pin 3 en substitution de la terre fonctionnelle (Pin 5) : mélanger masse signal et masse de blindage au mauvais endroit crée des boucles de masse et injecte du bruit sur la ligne de trigger.",
    },
    {
      number: 4,
      wireColorName: "Noir",
      wireColorHex: "#0f172a",
      signal: "Trigger / Strobe",
      role: "Entrée Trigger / Stroboscope. Seuil PNP (Actif à +24V) ou NPN (Actif à 0V). Ne pas dépasser le rapport cyclique max en mode Overdrive.",
      pitfall:
        "En mode Flash/Strobe pur (overdrive), ne jamais laisser le Pin 4 à l'état haut en continu : les LED ne sont dimensionnées que pour le faible rapport cyclique du strobe à ce courant, et un pilotage continu en overdrive les grille.",
    },
    {
      number: 5,
      wireColorName: "Gris",
      wireColorHex: "#9ca3af",
      signal: "FE (Terre fonctionnelle)",
      role: "Terre Fonctionnelle (FE). Connexion au blindage du câble pour une protection CEM optimale.",
      pitfall:
        "Le Pin 5 est souvent laissé non connecté par erreur : un blindage non relié annule la protection CEM et expose les lignes de trigger/gradation au bruit électrique des variateurs et servomoteurs voisins.",
    },
  ],
  de: [
    {
      number: 1,
      wireColorName: "Braun",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "+24VDC Stromversorgung (+/- 10% Toleranz). Max. Strom hängt von der LED-Leistung ab.",
      pitfall:
        "Eine unterdimensionierte Stromversorgung oder zu lange Kabel verursachen einen Spannungsabfall — dimensionieren Sie das Netzteil auf den Spitzenstrom (Overdrive-Modus), nicht auf den Durchschnittsstrom.",
    },
    {
      number: 2,
      wireColorName: "Weiß",
      wireColorHex: "#e2e8f0",
      signal: "Dimmen (0-10V / PWM)",
      role: "Analoge Dimmung (0-10V) oder PWM. Ermöglicht Intensitätssteuerung von 0 bis 100%.",
      pitfall:
        "Ein offener (nicht angeschlossener) Pin 2 kann die Helligkeit undefiniert lassen oder auf Maximum springen — und eine PWM-Frequenz, die nicht zur Kamerabelichtung passt, verursacht sichtbares Flackern oder Banding im Bild.",
    },
    {
      number: 3,
      wireColorName: "Blau",
      wireColorHex: "#2563eb",
      signal: "0V / Masse",
      role: "Masse / 0V / GND. Gemeinsame Referenz für Strom und Logiksignale.",
      pitfall:
        "Verwenden Sie Pin 3 niemals als Ersatz für die Funktionserde (Pin 5) — das Vermischen von Signalmasse und Schirmmasse am falschen Punkt erzeugt Erdschleifen und koppelt Störungen in die Triggerleitung ein.",
    },
    {
      number: 4,
      wireColorName: "Schwarz",
      wireColorHex: "#0f172a",
      signal: "Trigger / Blitz",
      role: "Trigger / Strobe Eingang. PNP-Schwelle (Aktiv bei +24V) oder NPN (Aktiv bei 0V). Maximales Tastverhältnis im Overdrive-Modus nicht überschreiten.",
      pitfall:
        "Lassen Sie Pin 4 im reinen Flash-/Strobe-Modus (Overdrive) niemals dauerhaft auf High — die LEDs sind nur für das kurze Tastverhältnis des Strobes bei diesem Strom ausgelegt, und dauerhafte Ansteuerung im Overdrive-Strom brennt sie durch.",
    },
    {
      number: 5,
      wireColorName: "Grau",
      wireColorHex: "#9ca3af",
      signal: "FE (Funktionserde)",
      role: "Funktionale Erde (FE). Anschluss an Kabelschirm für optimalen EMV-Schutz.",
      pitfall:
        "Pin 5 wird häufig versehentlich nicht angeschlossen — ein nicht terminierter Schirm hebt den EMV-Schutz auf und setzt die Trigger-/Dimmleitungen elektrischen Störungen von nahegelegenen Frequenzumrichtern und Servoantrieben aus.",
    },
  ],
  it: [
    {
      number: 1,
      wireColorName: "Marrone",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "Alimentazione +24VDC (Tolleranza +/- 10%). Corrente max in base alla potenza del LED.",
      pitfall:
        "Un alimentatore sottodimensionato o un cavo troppo lungo causano una caduta di tensione: dimensiona l'alimentatore sulla corrente di picco (modalità overdrive), non su quella media.",
    },
    {
      number: 2,
      wireColorName: "Bianco",
      wireColorHex: "#e2e8f0",
      signal: "Dimmerazione (0-10V / PWM)",
      role: "Dimmerazione Analogica (0-10V) o PWM. Permette il controllo dell'intensità da 0 a 100%.",
      pitfall:
        "Un Pin 2 lasciato flottante può lasciare l'intensità indefinita o portarla al massimo — e una frequenza PWM non allineata con l'otturatore della camera provoca sfarfallio o banding visibile nelle immagini.",
    },
    {
      number: 3,
      wireColorName: "Blu",
      wireColorHex: "#2563eb",
      signal: "0V / Massa",
      role: "Massa / 0V / GND. Riferimento comune per alimentazione e segnali logici.",
      pitfall:
        "Non usare mai il Pin 3 al posto della terra funzionale (Pin 5): mescolare massa segnale e massa di schermatura nel punto sbagliato crea anelli di massa e inietta disturbi sulla linea di trigger.",
    },
    {
      number: 4,
      wireColorName: "Nero",
      wireColorHex: "#0f172a",
      signal: "Trigger / Strobo",
      role: "Ingresso Trigger / Stroboscopio. Soglia PNP (Attivo a +24V) o NPN (Attivo a 0V). Non superare il duty cycle massimo in modalità Overdrive.",
      pitfall:
        "In modalità Flash/Strobo puro (overdrive), non lasciare mai il Pin 4 costantemente alto: i LED sono dimensionati solo per il breve duty cycle dello strobo a quella corrente, e un pilotaggio continuo in overdrive li brucia.",
    },
    {
      number: 5,
      wireColorName: "Grigio",
      wireColorHex: "#9ca3af",
      signal: "FE (Terra funzionale)",
      role: "Terra Funzionale (FE). Connessione alla schermatura del cavo per una protezione EMC ottimale.",
      pitfall:
        "Il Pin 5 viene spesso lasciato scollegato per errore: uno schermo non collegato annulla la protezione EMC ed espone le linee di trigger/dimmerazione ai disturbi elettrici di inverter e servoazionamenti vicini.",
    },
  ],
};

const LABELS: Record<Locale, M12InteractiveLabels> = {
  en: {
    ariaLabel: "Interactive M12 5-pin A-coded male connector — click a pin to see its wiring details",
    columnPin: "Pin",
    columnWire: "Wire",
    columnSignal: "Signal",
    pitfallLabel: "Common pitfall:",
    emptyStatePrompt: "Hover or click a pin — or a table row — to see its exact role and wiring pitfalls.",
  },
  fr: {
    ariaLabel: "Connecteur M12 mâle 5 broches (codage A) interactif — cliquez sur un pin pour voir son câblage",
    columnPin: "Pin",
    columnWire: "Fil",
    columnSignal: "Signal",
    pitfallLabel: "Piège fréquent :",
    emptyStatePrompt: "Survolez ou cliquez sur un pin — ou une ligne du tableau — pour voir son rôle exact et les erreurs de câblage à éviter.",
  },
  de: {
    ariaLabel: "Interaktiver M12-5-polig-A-kodierter Steckverbinder — klicken Sie auf einen Pin für Details",
    columnPin: "Pin",
    columnWire: "Ader",
    columnSignal: "Signal",
    pitfallLabel: "Häufiger Fehler:",
    emptyStatePrompt: "Bewegen Sie die Maus über einen Pin oder eine Tabellenzeile, um dessen genaue Funktion und Verdrahtungsfehler zu sehen.",
  },
  it: {
    ariaLabel: "Connettore M12 maschio a 5 pin (codifica A) interattivo — clicca su un pin per i dettagli",
    columnPin: "Pin",
    columnWire: "Filo",
    columnSignal: "Segnale",
    pitfallLabel: "Errore comune:",
    emptyStatePrompt: "Passa il mouse o clicca su un pin — o su una riga della tabella — per vederne il ruolo esatto e gli errori di cablaggio da evitare.",
  },
};

export const ARTICLE = {
  en: {
    metaTitle: "M12 5-Pin A-Coded Pinout & Wiring Diagram | Vision Lighting Solutions",
    metaDescription: "Standard M12 5-pin A-coded pinout for industrial machine vision lighting.",
    h1: "M12 5-Pin (A-Coded) Wiring Diagram for Machine Vision Lighting",
    lead: "Standard M12 5-pin A-coded pinout for industrial machine vision lighting: click a pin below — or a row in the table — to see its exact role, wire color, and the wiring mistakes automation engineers make most often.",
    expertTitle: "PNP vs NPN & Strobe Mode",
    expertParagraphs: [
      "Most industrial vision cameras — including Cognex In-Sight, Keyence CV-X/XG, and Basler ace — drive their I/O trigger lines through optocoupled outputs rather than a direct transistor switch. This optical isolation protects the camera's internal electronics from voltage spikes on the lighting side, but it also means the trigger signal on Pin 4 must match the wiring convention the camera's output expects.",
      "In a PNP (sourcing) configuration, the camera output switches Pin 4 to +24V to trigger the light — the strobe is active-high. In an NPN (sinking) configuration, the same output instead pulls Pin 4 down to 0V to trigger — the strobe is active-low. Wiring the wrong polarity won't damage the light, but the strobe will fire constantly (or never) — mismatched polarity is the single most common reason a \"dead\" light turns out to be perfectly functional hardware, simply wired backwards.",
    ],
    overdriveTitle: "Overdrive warning",
    overdriveParagraph:
      "When a light is configured for pure Flash/Strobe (overdrive) operation, its LEDs are only rated to handle overdrive current during the strobe's short duty cycle — typically a few percent of the cycle time. Never leave Pin 4 held continuously high (or low, in NPN wiring) in this mode: without the trigger toggling, the driver keeps pushing overdrive current through the LEDs well past their thermal limit, and they will burn out — usually within seconds, not minutes.",
    relatedTitle: "Related wiring guides",
  },
  fr: {
    metaTitle: "Brochage M12 5 Broches (Codage A) | Vision Lighting Solutions",
    metaDescription: "Brochage M12 5 broches (Codage A) pour éclairage de vision industrielle.",
    h1: "Brochage M12 5 Broches (Codage A) pour Éclairage de Vision Industrielle",
    lead: "Brochage M12 5 broches (codage A) pour éclairage de vision industrielle : cliquez sur un pin ci-dessous — ou sur une ligne du tableau — pour voir son rôle exact, la couleur du fil, et les erreurs de câblage les plus fréquentes chez les automaticiens.",
    expertTitle: "PNP vs NPN & Mode Stroboscopique",
    expertParagraphs: [
      "La plupart des caméras de vision industrielle — Cognex In-Sight, Keyence CV-X/XG, Basler ace — pilotent leurs entrées/sorties de trigger via des sorties optocouplées plutôt qu'un simple transistor de commutation. Cette isolation optique protège l'électronique interne de la caméra des surtensions côté éclairage, mais impose aussi que le signal du Pin 4 corresponde à la convention de câblage attendue par la sortie caméra.",
      "En configuration PNP (source), la sortie caméra amène le Pin 4 à +24V pour déclencher l'éclairage : le strobe est actif à l'état haut. En configuration NPN (drain), la même sortie tire au contraire le Pin 4 à 0V pour déclencher : le strobe est actif à l'état bas. Se tromper de polarité n'endommage pas l'éclairage, mais le strobe se déclenchera en continu (ou jamais) — c'est la cause la plus fréquente d'un éclairage « en panne » qui s'avère en réalité un matériel parfaitement fonctionnel, simplement câblé à l'envers.",
    ],
    overdriveTitle: "Avertissement Overdrive",
    overdriveParagraph:
      "Lorsqu'un éclairage est configuré en mode Flash/Strobe pur (overdrive), ses LED ne sont dimensionnées pour supporter le courant d'overdrive que pendant le faible rapport cyclique du strobe — typiquement quelques pourcents du temps de cycle. Ne laissez jamais le Pin 4 à l'état haut (ou bas, en câblage NPN) en continu dans ce mode : sans bascule du trigger, le driver continue de pousser le courant d'overdrive dans les LED bien au-delà de leur limite thermique, et elles grillent — généralement en quelques secondes, pas en quelques minutes.",
    relatedTitle: "Guides de câblage associés",
  },
  de: {
    metaTitle: "M12 5-polig A-kodiert Pinbelegung | Vision Lighting Solutions",
    metaDescription: "M12 5-polig A-kodiert Pinbelegung für industrielle Bildverarbeitung.",
    h1: "M12-5-polige (A-kodierte) Pinbelegung für Vision-Beleuchtung",
    lead: "M12 5-polig A-kodiert Pinbelegung für industrielle Bildverarbeitung: Klicken Sie auf einen Pin unten — oder auf eine Tabellenzeile — um seine genaue Funktion, Aderfarbe und die häufigsten Verdrahtungsfehler von Automatisierungstechnikern zu sehen.",
    expertTitle: "PNP vs NPN & Blitzmodus",
    expertParagraphs: [
      "Die meisten industriellen Bildverarbeitungskameras — Cognex In-Sight, Keyence CV-X/XG, Basler ace — steuern ihre Trigger-I/O-Leitungen über optogekoppelte Ausgänge statt über einen direkten Transistorschalter an. Diese optische Trennung schützt die interne Elektronik der Kamera vor Spannungsspitzen auf der Beleuchtungsseite, bedeutet aber auch, dass das Triggersignal an Pin 4 der vom Kameraausgang erwarteten Verdrahtungskonvention entsprechen muss.",
      "In einer PNP-Konfiguration (Sourcing) schaltet der Kameraausgang Pin 4 auf +24V, um die Beleuchtung auszulösen — der Strobe ist active-high. In einer NPN-Konfiguration (Sinking) zieht derselbe Ausgang Pin 4 stattdessen auf 0V, um auszulösen — der Strobe ist active-low. Eine falsche Polarität beschädigt die Beleuchtung nicht, aber der Strobe löst dauerhaft (oder nie) aus — falsch verdrahtete Polarität ist der häufigste Grund, warum eine scheinbar „defekte\" Beleuchtung sich als voll funktionsfähige, aber falsch verdrahtete Hardware entpuppt.",
    ],
    overdriveTitle: "Overdrive-Warnung",
    overdriveParagraph:
      "Wenn eine Beleuchtung für reinen Flash-/Strobe-Betrieb (Overdrive) konfiguriert ist, sind ihre LEDs nur dafür ausgelegt, den Overdrive-Strom während des kurzen Tastverhältnisses des Strobes zu verkraften — typischerweise wenige Prozent der Zykluszeit. Lassen Sie Pin 4 in diesem Modus niemals dauerhaft auf High (oder bei NPN-Verdrahtung auf Low) — ohne Umschalten des Triggers treibt der Treiber weiterhin Overdrive-Strom durch die LEDs, weit über deren thermische Grenze hinaus, und sie brennen durch — meist innerhalb von Sekunden, nicht Minuten.",
    relatedTitle: "Verwandte Verkabelungsleitfäden",
  },
  it: {
    metaTitle: "Piedinatura M12 a 5 Pin (Codifica A) | Vision Lighting Solutions",
    metaDescription: "Piedinatura M12 a 5 pin (Codifica A) per illuminazione visione industriale.",
    h1: "Piedinatura M12 a 5 Pin (Codifica A) per Illuminazione Visione Industriale",
    lead: "Piedinatura M12 a 5 pin (codifica A) per illuminazione visione industriale: clicca su un pin qui sotto — o su una riga della tabella — per vedere il suo ruolo esatto, il colore del filo e gli errori di cablaggio più comuni tra gli automatori.",
    expertTitle: "PNP vs NPN & Modalità Stroboscopica",
    expertParagraphs: [
      "La maggior parte delle camere per visione industriale — Cognex In-Sight, Keyence CV-X/XG, Basler ace — pilota le proprie linee di I/O trigger tramite uscite optoaccoppiate anziché un semplice interruttore a transistor. Questo isolamento ottico protegge l'elettronica interna della camera dai picchi di tensione lato illuminazione, ma impone anche che il segnale sul Pin 4 corrisponda alla convenzione di cablaggio attesa dall'uscita della camera.",
      "In configurazione PNP (source), l'uscita della camera porta il Pin 4 a +24V per attivare l'illuminazione: lo strobo è attivo a livello alto. In configurazione NPN (sink), la stessa uscita porta invece il Pin 4 a 0V per attivare: lo strobo è attivo a livello basso. Sbagliare la polarità non danneggia l'illuminazione, ma lo strobo si attiverà in continuo (o mai) — è la causa più frequente di un'illuminazione apparentemente \"guasta\" che in realtà è hardware perfettamente funzionante, semplicemente cablato al contrario.",
    ],
    overdriveTitle: "Avvertenza Overdrive",
    overdriveParagraph:
      "Quando un'illuminazione è configurata in modalità Flash/Strobo puro (overdrive), i suoi LED sono dimensionati per sopportare la corrente di overdrive solo durante il breve duty cycle dello strobo — tipicamente qualche punto percentuale del tempo di ciclo. Non lasciare mai il Pin 4 costantemente alto (o basso, in cablaggio NPN) in questa modalità: senza la commutazione del trigger, il driver continua a spingere corrente di overdrive nei LED ben oltre il loro limite termico, e questi si bruciano — solitamente in pochi secondi, non minuti.",
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

/** Localized verb template turning a pin's existing role/signal copy into a HowTo step instruction. */
const STEP_TEXT: Record<Locale, (pin: M12PinInfo) => string> = {
  en: (pin) =>
    `Connect the ${pin.wireColorName.toLowerCase()} wire (Pin ${pin.number}) to ${pin.signal}. ${pin.role}`,
  fr: (pin) =>
    `Raccordez le fil ${pin.wireColorName.toLowerCase()} (Pin ${pin.number}) à ${pin.signal}. ${pin.role}`,
  de: (pin) =>
    `Verbinden Sie die ${pin.wireColorName.toLowerCase()} Ader (Pin ${pin.number}) mit ${pin.signal}. ${pin.role}`,
  it: (pin) =>
    `Collega il filo ${pin.wireColorName.toLowerCase()} (Pin ${pin.number}) a ${pin.signal}. ${pin.role}`,
};

const DEPENDENCIES: Record<Locale, string> = {
  en: "M12 5-pin A-coded female cable, 24 VDC power supply, PNP or NPN compatible camera trigger output.",
  fr: "Câble femelle M12 5 broches (codage A), alimentation 24 VDC, sortie trigger caméra compatible PNP ou NPN.",
  de: "M12-5-polig A-kodiertes Buchsenkabel, 24-VDC-Stromversorgung, PNP- oder NPN-kompatibler Kamera-Triggerausgang.",
  it: "Cavo femmina M12 a 5 pin (codifica A), alimentatore 24 VDC, uscita trigger camera compatibile PNP o NPN.",
};

function buildHowToSteps(locale: Locale): HowToStepInput[] {
  return PINS[locale].map((pin) => ({
    name: `Pin ${pin.number} — ${pin.signal}`,
    text: STEP_TEXT[locale](pin),
  }));
}

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

  const jsonLd = buildTechArticleWithHowToJsonLd({
    path: `/${locale}${ROUTE_KEY}`,
    locale,
    headline: t.h1,
    description: t.metaDescription,
    image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    dependencies: DEPENDENCIES[locale],
    totalTime: "PT10M",
    steps: buildHowToSteps(locale),
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {t.h1}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{t.lead}</p>

      <div className="mt-10">
        <M12Interactive pins={PINS[locale]} labels={LABELS[locale]} />
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
