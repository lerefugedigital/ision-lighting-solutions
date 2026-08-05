import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleWithHowToJsonLd, buildFaqPageJsonLd, type HowToStepInput } from "@/lib/jsonld";
import { ContactForm } from "@/components/ContactForm";
import { WiringFastTracks } from "@/components/WiringFastTracks";
import { StrobeOverdriveSimulator, type StrobeOverdriveLabels } from "@/components/StrobeOverdriveSimulator";
import { M12Interactive, type M12PinInfo, type M12InteractiveLabels } from "@/components/M12Interactive";
import { SampleTestCTA } from "@/components/SampleTestCTA";

const ROUTE_KEY = "/cablage-integration/eclairage-stroboscopique-overdrive";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const RELATED_SLUGS = [
  "brochage-m12-5-pins",
  "convertisseur-pnp-npn",
  "compatibilite-camera-cognex",
  "compatibilite-camera-keyence",
];

const LABELS: Record<Locale, StrobeOverdriveLabels> = {
  en: {
    pulseWidthLabel: "Strobe Pulse Width",
    frequencyLabel: "Trigger Frequency",
    periodLabel: "Cycle period",
    dutyCycleLabel: "Duty Cycle",
    onLabel: "STROBE ON",
    offLabel: "OFF",
    safeMessage: "Within the typical safe range for overdrive operation.",
    warningMessage: "Exceeds the {threshold}% typical overdrive duty cycle limit — check your light's datasheet before running continuously at this rate, or you risk burning out the LEDs.",
    thresholdNote: "Default threshold shown is a common conservative value (10%) — your light's actual maximum duty cycle depends on its datasheet and overdrive current multiplier.",
  },
  fr: {
    pulseWidthLabel: "Largeur d'Impulsion Strobe",
    frequencyLabel: "Fréquence de Trigger",
    periodLabel: "Période de cycle",
    dutyCycleLabel: "Rapport Cyclique",
    onLabel: "STROBE ACTIF",
    offLabel: "OFF",
    safeMessage: "Dans la plage typiquement sûre pour un fonctionnement en overdrive.",
    warningMessage: "Dépasse la limite typique de rapport cyclique overdrive de {threshold}% — vérifiez la datasheet de votre éclairage avant de fonctionner en continu à ce régime, sous peine de griller les LED.",
    thresholdNote: "Le seuil par défaut affiché est une valeur conservatrice courante (10 %) — le rapport cyclique maximal réel de votre éclairage dépend de sa datasheet et de son multiplicateur de courant overdrive.",
  },
  de: {
    pulseWidthLabel: "Strobe-Impulsbreite",
    frequencyLabel: "Trigger-Frequenz",
    periodLabel: "Zyklusdauer",
    dutyCycleLabel: "Tastverhältnis",
    onLabel: "STROBE AN",
    offLabel: "AUS",
    safeMessage: "Im typisch sicheren Bereich für den Overdrive-Betrieb.",
    warningMessage: "Überschreitet das typische Overdrive-Tastverhältnislimit von {threshold}% — prüfen Sie das Datenblatt Ihrer Beleuchtung, bevor Sie dauerhaft mit dieser Rate arbeiten, sonst riskieren Sie, die LEDs durchzubrennen.",
    thresholdNote: "Der angezeigte Standardschwellenwert ist ein üblicher konservativer Wert (10 %) — das tatsächliche maximale Tastverhältnis Ihrer Beleuchtung hängt von deren Datenblatt und Overdrive-Strommultiplikator ab.",
  },
  it: {
    pulseWidthLabel: "Larghezza Impulso Strobo",
    frequencyLabel: "Frequenza di Trigger",
    periodLabel: "Periodo di ciclo",
    dutyCycleLabel: "Duty Cycle",
    onLabel: "STROBO ATTIVO",
    offLabel: "OFF",
    safeMessage: "Nell'intervallo tipicamente sicuro per il funzionamento in overdrive.",
    warningMessage: "Supera il limite tipico di duty cycle overdrive del {threshold}% — verifica la scheda tecnica della tua illuminazione prima di operare in continuo a questo regime, o rischi di bruciare i LED.",
    thresholdNote: "La soglia predefinita mostrata è un valore conservativo comune (10%) — il duty cycle massimo reale della tua illuminazione dipende dalla sua scheda tecnica e dal moltiplicatore di corrente overdrive.",
  },
};

/** Same standard M12 5-pin A-coded connector as the dedicated pinout guide, reused here with the
 *  focus on Pin 4 (Trigger/Strobe) so overdrive wiring can be checked without leaving this page. */
const M12_PINS: Record<Locale, M12PinInfo[]> = {
  en: [
    {
      number: 1,
      wireColorName: "Brown",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "+24VDC power supply. Size it for the overdrive peak current, not the average continuous current.",
      pitfall: "An undersized 24V controller/PSU sags under overdrive peak current draw, corrupting the strobe pulse shape.",
    },
    {
      number: 2,
      wireColorName: "White",
      wireColorHex: "#e2e8f0",
      signal: "Dimming (0-10V / PWM)",
      role: "Analog dimming or PWM intensity control — not used to set overdrive current, only continuous-mode brightness.",
      pitfall: "A floating Pin 2 leaves brightness undefined; it plays no role in the overdrive duty cycle itself.",
    },
    {
      number: 3,
      wireColorName: "Blue",
      wireColorHex: "#2563eb",
      signal: "0V / GND",
      role: "Ground / 0V reference shared between the LED controller and the camera's trigger output.",
      pitfall: "Never substitute Pin 3 for the shield ground on Pin 5 — it injects noise into the trigger edge timing.",
    },
    {
      number: 4,
      wireColorName: "Black",
      wireColorHex: "#0f172a",
      signal: "Trigger / Strobe",
      role: "The overdrive strobe input: a pulsed PNP (active-high) or NPN (active-low) signal whose pulse width and frequency set the duty cycle.",
      pitfall: "Holding Pin 4 permanently high (or low) in overdrive mode is a 100% duty cycle — it burns out the LEDs within seconds.",
    },
    {
      number: 5,
      wireColorName: "Gray",
      wireColorHex: "#9ca3af",
      signal: "FE (Functional Earth)",
      role: "Cable shield connection for EMC protection of the trigger line running to the flash LED controller.",
      pitfall: "Leaving Pin 5 unconnected exposes the fast trigger edge to noise from nearby VFD or servo cabling, causing jitter.",
    },
  ],
  fr: [
    {
      number: 1,
      wireColorName: "Marron",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "Alimentation +24VDC du contrôleur flash LED 24V. Dimensionnez-la sur le courant de crête overdrive, pas sur le courant continu moyen.",
      pitfall: "Un contrôleur/alimentation 24V sous-dimensionné s'affaisse sous l'appel de courant de crête overdrive, ce qui déforme l'impulsion strobe.",
    },
    {
      number: 2,
      wireColorName: "Blanc",
      wireColorHex: "#e2e8f0",
      signal: "Gradation (0-10V / PWM)",
      role: "Gradation analogique ou PWM en mode continu — ne sert pas à régler le courant overdrive, seulement la luminosité hors strobe.",
      pitfall: "Un Pin 2 laissé flottant rend la luminosité indéfinie ; il n'intervient pas dans le rapport cyclique overdrive lui-même.",
    },
    {
      number: 3,
      wireColorName: "Bleu",
      wireColorHex: "#2563eb",
      signal: "0V / Masse",
      role: "Référence 0V commune entre le contrôleur LED et la sortie trigger de la caméra.",
      pitfall: "Ne jamais substituer le Pin 3 à la masse de blindage du Pin 5 : cela injecte du bruit dans le timing du front de trigger.",
    },
    {
      number: 4,
      wireColorName: "Noir",
      wireColorHex: "#0f172a",
      signal: "Trigger / Strobe",
      role: "L'entrée strobe overdrive : un signal pulsé PNP (actif à l'état haut) ou NPN (actif à l'état bas) dont la largeur d'impulsion et la fréquence fixent le rapport cyclique.",
      pitfall: "Maintenir le Pin 4 en continu à l'état haut (ou bas) en mode overdrive équivaut à un rapport cyclique de 100 % — cela grille les LED en quelques secondes.",
    },
    {
      number: 5,
      wireColorName: "Gris",
      wireColorHex: "#9ca3af",
      signal: "FE (Terre fonctionnelle)",
      role: "Connexion au blindage du câble pour la protection CEM de la ligne trigger reliant le contrôleur flash LED 24V.",
      pitfall: "Un Pin 5 non connecté expose le front de trigger rapide au bruit électrique des variateurs ou servomoteurs voisins, provoquant de la gigue.",
    },
  ],
  de: [
    {
      number: 1,
      wireColorName: "Braun",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "+24VDC-Versorgung des Blitz-LED-Controllers. Dimensionieren Sie sie auf den Overdrive-Spitzenstrom, nicht auf den durchschnittlichen Dauerstrom.",
      pitfall: "Ein unterdimensionierter 24V-Controller/Netzteil bricht unter der Overdrive-Spitzenstromlast ein und verformt den Strobe-Impuls.",
    },
    {
      number: 2,
      wireColorName: "Weiß",
      wireColorHex: "#e2e8f0",
      signal: "Dimmen (0-10V / PWM)",
      role: "Analoge Dimmung oder PWM im Dauerlichtmodus — steuert nicht den Overdrive-Strom, nur die Helligkeit außerhalb des Strobes.",
      pitfall: "Ein offener Pin 2 lässt die Helligkeit undefiniert; er spielt beim Overdrive-Tastverhältnis selbst keine Rolle.",
    },
    {
      number: 3,
      wireColorName: "Blau",
      wireColorHex: "#2563eb",
      signal: "0V / Masse",
      role: "Gemeinsame 0V-Referenz zwischen LED-Controller und Kamera-Triggerausgang.",
      pitfall: "Ersetzen Sie Pin 3 niemals durch die Schirmmasse von Pin 5 — das koppelt Störungen in das Timing der Triggerflanke ein.",
    },
    {
      number: 4,
      wireColorName: "Schwarz",
      wireColorHex: "#0f172a",
      signal: "Trigger / Blitz",
      role: "Der Overdrive-Strobe-Eingang: ein gepulstes PNP- (active-high) oder NPN-Signal (active-low), dessen Impulsbreite und Frequenz das Tastverhältnis festlegen.",
      pitfall: "Pin 4 im Overdrive-Modus dauerhaft auf High (oder Low) zu halten entspricht 100% Tastverhältnis — das brennt die LEDs innerhalb von Sekunden durch.",
    },
    {
      number: 5,
      wireColorName: "Grau",
      wireColorHex: "#9ca3af",
      signal: "FE (Funktionserde)",
      role: "Kabelschirmanschluss zum EMV-Schutz der Triggerleitung zum 24V-Blitz-LED-Controller.",
      pitfall: "Ein nicht angeschlossener Pin 5 setzt die schnelle Triggerflanke Störungen von nahegelegenen Frequenzumrichtern oder Servoantrieben aus und verursacht Jitter.",
    },
  ],
  it: [
    {
      number: 1,
      wireColorName: "Marrone",
      wireColorHex: "#7c4a1e",
      signal: "+24 VDC",
      role: "Alimentazione +24VDC del controller flash LED 24V. Dimensionala sulla corrente di picco overdrive, non su quella continua media.",
      pitfall: "Un controller/alimentatore 24V sottodimensionato cede sotto l'assorbimento di picco overdrive, deformando l'impulso strobo.",
    },
    {
      number: 2,
      wireColorName: "Bianco",
      wireColorHex: "#e2e8f0",
      signal: "Dimmerazione (0-10V / PWM)",
      role: "Dimmerazione analogica o PWM in modalità continua — non imposta la corrente overdrive, solo la luminosità fuori strobo.",
      pitfall: "Un Pin 2 lasciato flottante rende la luminosità indefinita; non interviene nel duty cycle overdrive stesso.",
    },
    {
      number: 3,
      wireColorName: "Blu",
      wireColorHex: "#2563eb",
      signal: "0V / Massa",
      role: "Riferimento 0V comune tra il controller LED e l'uscita trigger della camera.",
      pitfall: "Non sostituire mai il Pin 3 con la massa di schermatura del Pin 5: inietta disturbi nel timing del fronte di trigger.",
    },
    {
      number: 4,
      wireColorName: "Nero",
      wireColorHex: "#0f172a",
      signal: "Trigger / Strobo",
      role: "L'ingresso strobo overdrive: un segnale pulsato PNP (attivo alto) o NPN (attivo basso) la cui larghezza di impulso e frequenza fissano il duty cycle.",
      pitfall: "Mantenere il Pin 4 costantemente alto (o basso) in modalità overdrive equivale a un duty cycle del 100% — brucia i LED in pochi secondi.",
    },
    {
      number: 5,
      wireColorName: "Grigio",
      wireColorHex: "#9ca3af",
      signal: "FE (Terra funzionale)",
      role: "Connessione alla schermatura del cavo per la protezione EMC della linea trigger verso il controller flash LED 24V.",
      pitfall: "Un Pin 5 non collegato espone il fronte di trigger veloce ai disturbi elettrici di inverter o servoazionamenti vicini, causando jitter.",
    },
  ],
};

const M12_LABELS: Record<Locale, M12InteractiveLabels> = {
  en: {
    ariaLabel: "Interactive M12 5-pin A-coded connector focused on the Trigger/Strobe wiring for overdrive mode",
    columnPin: "Pin",
    columnWire: "Wire",
    columnSignal: "Signal",
    pitfallLabel: "Common pitfall:",
    emptyStatePrompt: "Hover or click a pin — or a table row — to see its role in an overdrive strobe wiring setup.",
  },
  fr: {
    ariaLabel: "Connecteur M12 5 broches (codage A) interactif centré sur le câblage Trigger/Strobe en mode overdrive",
    columnPin: "Pin",
    columnWire: "Fil",
    columnSignal: "Signal",
    pitfallLabel: "Piège fréquent :",
    emptyStatePrompt: "Survolez ou cliquez sur un pin — ou une ligne du tableau — pour voir son rôle dans un câblage strobe overdrive.",
  },
  de: {
    ariaLabel: "Interaktiver M12-5-polig-A-kodierter Steckverbinder mit Fokus auf die Trigger-/Strobe-Verdrahtung im Overdrive-Modus",
    columnPin: "Pin",
    columnWire: "Ader",
    columnSignal: "Signal",
    pitfallLabel: "Häufiger Fehler:",
    emptyStatePrompt: "Bewegen Sie die Maus über einen Pin oder eine Tabellenzeile, um dessen Rolle bei der Overdrive-Strobe-Verdrahtung zu sehen.",
  },
  it: {
    ariaLabel: "Connettore M12 a 5 pin (codifica A) interattivo focalizzato sul cablaggio Trigger/Strobo in modalità overdrive",
    columnPin: "Pin",
    columnWire: "Filo",
    columnSignal: "Segnale",
    pitfallLabel: "Errore comune:",
    emptyStatePrompt: "Passa il mouse o clicca su un pin — o su una riga della tabella — per vedere il suo ruolo nel cablaggio strobo overdrive.",
  },
};

export const ARTICLE = {
  en: {
    h1: "Strobe & Overdrive Lighting Setup for High-Speed Inspection",
    lead: "Adjust the pulse width and trigger frequency below to see the resulting duty cycle in real time — the single number that determines whether an overdrive setup is safe or headed for LED failure.",
    whatTitle: "What Overdrive Lighting Actually Is",
    whatParagraph:
      "An LED can safely handle a peak current far above its continuous (DC) rated maximum, as long as that current only flows for a short pulse and the average power dissipated over time stays within the LED's thermal limits. Overdrive lighting exploits exactly that: the driver pushes several times the continuous-rated current through the LEDs, but only for the brief strobe pulse synchronized to the camera's exposure — trading continuous brightness for a much brighter, much shorter flash that freezes motion a continuous-mode light never could.",
    syncTitle: "Synchronizing the Pulse to the Camera's Exposure",
    syncParagraph:
      "The strobe pulse needs to fall inside the camera's exposure window, not just near it. Add the camera's trigger-to-exposure delay (check its datasheet) when timing Pin 4's rising edge, and keep the pulse width shorter than the exposure time itself — a pulse that starts before the shutter opens or ends before it closes only wastes light and produces an unevenly lit, partially dark frame instead of the crisp, frozen image overdrive is meant to deliver.",
    overdriveTitle: "Why exceeding the duty cycle destroys LEDs",
    overdriveParagraph:
      "The duty cycle limit exists because LED junction heat only has the \"off\" portion of each cycle to dissipate. Push the duty cycle too high at overdrive current and the junction temperature climbs cycle after cycle instead of resetting — the LED doesn't fail instantly, but its phosphor degrades and its junction overheats until it fails open, typically within seconds to minutes of continuous over-limit operation, not gradually over months. Never leave Pin 4 held permanently high in overdrive mode — that's a 100% duty cycle, and it is the single fastest way to destroy an overdriven light.",
    wiringTitle: "M12 Wiring for the Trigger Signal",
    wiringParagraph:
      "The overdrive duty cycle is set in software, but it starts with the physical wiring: on the standard M12 5-pin connector, Pin 4 carries the Trigger/Strobe signal that drives the 24V flash LED controller, while Pin 1 (+24VDC) must be sized for the overdrive peak current, not the average continuous current. Click a pin below to see its exact role in an overdrive strobe wiring setup.",
    relatedTitle: "Related wiring guides",
  },
  fr: {
    h1: "Éclairage Stroboscopique & Mode Overdrive pour la Vision Industrielle",
    lead: "Ajustez la largeur d'impulsion et la fréquence de trigger ci-dessous pour voir le rapport cyclique résultant en temps réel — le chiffre unique qui détermine si un montage overdrive strobe est sûr ou promis à la défaillance des LED.",
    whatTitle: "Ce Qu'est Réellement l'Éclairage Overdrive",
    whatParagraph:
      "Une LED peut supporter en toute sécurité un courant de crête bien supérieur à son maximum continu (DC), tant que ce courant ne circule que pendant une brève impulsion (temps de flash, ou pulse width) et que la puissance moyenne dissipée dans le temps reste dans les limites thermiques de la LED. L'éclairage stroboscopique vision en mode overdrive exploite exactement cela : le contrôleur flash LED 24V pousse plusieurs fois le courant nominal continu dans les LED, mais seulement pendant la brève impulsion stroboscopique synchronisée à l'exposition de la caméra — échangeant une luminosité continue contre un flash bien plus intense et bien plus court, capable de figer un mouvement qu'un éclairage en mode continu ne pourrait jamais capturer.",
    syncTitle: "Synchroniser l'Impulsion avec l'Exposition de la Caméra",
    syncParagraph:
      "L'impulsion stroboscopique doit tomber à l'intérieur de la fenêtre d'exposition de la caméra, pas simplement à proximité. Ajoutez le délai trigger-vers-exposition de la caméra (vérifiez sa datasheet) au moment de synchroniser le front montant du Pin 4, et gardez un temps de flash (pulse width) plus court que le temps d'exposition lui-même — une impulsion qui démarre avant l'ouverture de l'obturateur ou se termine avant sa fermeture ne fait que gaspiller de la lumière et produit une image inégalement éclairée et partiellement sombre, au lieu de l'image nette et figée que l'overdrive est censé fournir.",
    overdriveTitle: "Pourquoi Dépasser le Rapport Cyclique Détruit les LED",
    overdriveParagraph:
      "La limite de rapport cyclique (duty cycle) existe parce que la chaleur de jonction de la LED ne dispose que de la portion « off » de chaque cycle pour se dissiper. Poussez le rapport cyclique trop haut au courant overdrive et la température de jonction grimpe cycle après cycle au lieu de se réinitialiser — la LED ne tombe pas en panne instantanément, mais son phosphore se dégrade et sa jonction surchauffe jusqu'à une défaillance en circuit ouvert, typiquement en quelques secondes à quelques minutes de fonctionnement continu au-delà de la limite, pas progressivement sur des mois. Ne laissez jamais le Pin 4 à l'état haut en continu en mode overdrive : c'est un rapport cyclique de 100 %, et c'est le moyen le plus rapide de détruire un éclairage overdrive.",
    wiringTitle: "Câblage M12 du Signal Trigger",
    wiringParagraph:
      "Le rapport cyclique overdrive se règle en logiciel, mais il se joue en premier lieu sur le câblage physique : sur le connecteur M12 5 broches standard, le Pin 4 porte le signal Trigger/Strobe qui pilote le contrôleur flash LED 24V, tandis que le Pin 1 (+24VDC) doit être dimensionné pour le courant de crête overdrive et non pour le courant continu moyen. Cliquez sur un pin ci-dessous pour voir son rôle exact dans un montage stroboscopique overdrive.",
    relatedTitle: "Guides de câblage associés",
  },
  de: {
    h1: "Blitz- und Overdrive-Beleuchtung für Hochgeschwindigkeits-Inspektion Einrichten",
    lead: "Passen Sie unten Impulsbreite und Trigger-Frequenz an, um das resultierende Tastverhältnis in Echtzeit zu sehen — die eine Zahl, die entscheidet, ob ein Overdrive-Setup sicher ist oder auf einen LED-Ausfall zusteuert.",
    whatTitle: "Was Overdrive-Beleuchtung Wirklich Ist",
    whatParagraph:
      "Eine LED kann sicher einen Spitzenstrom weit über ihrem kontinuierlichen (DC) Nennmaximum verkraften, solange dieser Strom nur für einen kurzen Impuls fließt und die über die Zeit gemittelte abgeführte Leistung innerhalb der thermischen Grenzen der LED bleibt. Overdrive-Beleuchtung nutzt genau das: Der Treiber schickt ein Vielfaches des kontinuierlichen Nennstroms durch die LEDs, aber nur für den kurzen, synchron zur Kamerabelichtung getakteten Blitzimpuls — ein Tausch von kontinuierlicher Helligkeit gegen einen viel helleren, viel kürzeren Blitz, der Bewegung einfriert, die eine Dauerlicht-Beleuchtung niemals einfangen könnte.",
    syncTitle: "Den Impuls mit der Kamerabelichtung Synchronisieren",
    syncParagraph:
      "Der Blitzimpuls muss innerhalb des Belichtungsfensters der Kamera liegen, nicht nur in dessen Nähe. Addieren Sie die Trigger-zu-Belichtung-Verzögerung der Kamera (siehe Datenblatt) bei der Taktung der steigenden Flanke von Pin 4, und halten Sie die Impulsbreite kürzer als die Belichtungszeit selbst — ein Impuls, der vor dem Öffnen des Verschlusses beginnt oder vor dessen Schließen endet, verschwendet nur Licht und erzeugt ein ungleichmäßig beleuchtetes, teilweise dunkles Bild statt des scharfen, eingefrorenen Bildes, das Overdrive liefern soll.",
    overdriveTitle: "Warum das Überschreiten des Tastverhältnisses LEDs Zerstört",
    overdriveParagraph:
      "Die Tastverhältnisgrenze existiert, weil die Sperrschichtwärme der LED nur den „Aus\"-Anteil jedes Zyklus zur Abfuhr hat. Treiben Sie das Tastverhältnis bei Overdrive-Strom zu hoch, steigt die Sperrschichttemperatur Zyklus für Zyklus, statt sich zurückzusetzen — die LED fällt nicht sofort aus, aber ihr Phosphor degradiert und ihre Sperrschicht überhitzt, bis sie als offener Stromkreis ausfällt, typischerweise innerhalb von Sekunden bis Minuten dauerhaften Über-Limit-Betriebs, nicht allmählich über Monate. Lassen Sie Pin 4 im Overdrive-Modus niemals dauerhaft auf High — das ist ein Tastverhältnis von 100 % und der schnellste Weg, eine übersteuerte Beleuchtung zu zerstören.",
    wiringTitle: "M12-Verdrahtung für das Triggersignal",
    wiringParagraph:
      "Das Overdrive-Tastverhältnis wird per Software eingestellt, entscheidet sich aber zuerst bei der physischen Verdrahtung: Am Standard-M12-5-Pin-Steckverbinder führt Pin 4 das Trigger-/Blitzsignal, das den 24V-Blitz-LED-Controller ansteuert, während Pin 1 (+24VDC) auf den Overdrive-Spitzenstrom ausgelegt sein muss, nicht auf den durchschnittlichen Dauerstrom. Klicken Sie unten auf einen Pin, um seine genaue Rolle bei der Overdrive-Strobe-Verdrahtung zu sehen.",
    relatedTitle: "Verwandte Verkabelungsleitfäden",
  },
  it: {
    h1: "Configurare un'Illuminazione Stroboscopica e Overdrive per l'Ispezione Rapida",
    lead: "Regola la larghezza dell'impulso e la frequenza di trigger qui sotto per vedere il duty cycle risultante in tempo reale — il singolo numero che determina se una configurazione overdrive è sicura o destinata al guasto dei LED.",
    whatTitle: "Cos'è Realmente l'Illuminazione Overdrive",
    whatParagraph:
      "Un LED può sopportare in sicurezza una corrente di picco ben superiore al suo massimo continuo (DC), a condizione che tale corrente scorra solo per un breve impulso e che la potenza media dissipata nel tempo rimanga entro i limiti termici del LED. L'illuminazione overdrive sfrutta esattamente questo: il driver spinge nei LED una corrente pari a più volte quella nominale continua, ma solo per il breve impulso stroboscopico sincronizzato con l'esposizione della camera — scambiando una luminosità continua per un flash molto più intenso e molto più breve, capace di bloccare un movimento che un'illuminazione in modalità continua non potrebbe mai catturare.",
    syncTitle: "Sincronizzare l'Impulso con l'Esposizione della Camera",
    syncParagraph:
      "L'impulso stroboscopico deve cadere all'interno della finestra di esposizione della camera, non semplicemente nelle sue vicinanze. Aggiungi il ritardo trigger-esposizione della camera (verifica la sua scheda tecnica) quando sincronizzi il fronte di salita del Pin 4, e mantieni la larghezza dell'impulso più corta del tempo di esposizione stesso — un impulso che inizia prima dell'apertura dell'otturatore o termina prima della sua chiusura spreca solo luce e produce un'immagine illuminata in modo disomogeneo e parzialmente scura, invece dell'immagine nitida e bloccata che l'overdrive dovrebbe fornire.",
    overdriveTitle: "Perché Superare il Duty Cycle Distrugge i LED",
    overdriveParagraph:
      "Il limite di duty cycle esiste perché il calore di giunzione del LED ha a disposizione solo la porzione \"off\" di ogni ciclo per dissiparsi. Spingi il duty cycle troppo in alto a corrente overdrive e la temperatura di giunzione sale ciclo dopo ciclo invece di resettarsi — il LED non si guasta istantaneamente, ma il suo fosforo si degrada e la sua giunzione si surriscalda fino al guasto in circuito aperto, tipicamente entro secondi o minuti di funzionamento continuo oltre il limite, non gradualmente nell'arco di mesi. Non lasciare mai il Pin 4 costantemente alto in modalità overdrive: è un duty cycle del 100%, ed è il modo più rapido per distruggere un'illuminazione in overdrive.",
    wiringTitle: "Cablaggio M12 del Segnale Trigger",
    wiringParagraph:
      "Il duty cycle overdrive si imposta via software, ma dipende innanzitutto dal cablaggio fisico: sul connettore M12 a 5 pin standard, il Pin 4 porta il segnale Trigger/Strobo che pilota il controller flash LED 24V, mentre il Pin 1 (+24VDC) deve essere dimensionato sulla corrente di picco overdrive, non su quella continua media. Clicca su un pin qui sotto per vedere il suo ruolo esatto in un cablaggio strobo overdrive.",
    relatedTitle: "Guide di cablaggio correlate",
  },
} satisfies Record<
  Locale,
  {
    h1: string;
    lead: string;
    whatTitle: string;
    whatParagraph: string;
    syncTitle: string;
    syncParagraph: string;
    overdriveTitle: string;
    overdriveParagraph: string;
    wiringTitle: string;
    wiringParagraph: string;
    relatedTitle: string;
  }
>;

const STEP_TEMPLATES: Record<Locale, Array<{ name: string; text: string }>> = {
  en: [
    { name: "Determine your exposure window", text: "Determine the camera's required exposure time and the line speed to know the maximum available strobe window." },
    { name: "Check the light's datasheet", text: "Check your light's datasheet for its maximum overdrive current multiplier and maximum safe duty cycle." },
    { name: "Set a safe pulse width", text: "Set the strobe pulse width shorter than the exposure window and well within the datasheet's maximum duty cycle at your trigger frequency." },
    { name: "Wire a pulsed, not held, trigger", text: "Wire Pin 4 to a properly pulsed trigger signal synchronized to the camera's exposure — never a signal held continuously high." },
    { name: "Verify before full-speed operation", text: "Verify the actual duty cycle with the calculator or an oscilloscope before running the line at full production speed." },
  ],
  fr: [
    { name: "Déterminez votre fenêtre d'exposition", text: "Déterminez le temps d'exposition requis par la caméra et la vitesse de ligne pour connaître la fenêtre de strobe maximale disponible." },
    { name: "Vérifiez la datasheet de l'éclairage", text: "Vérifiez dans la datasheet de votre éclairage son multiplicateur de courant overdrive maximal et son rapport cyclique de sécurité maximal." },
    { name: "Réglez une largeur d'impulsion sûre", text: "Réglez la largeur d'impulsion stroboscopique plus courte que la fenêtre d'exposition, et bien en dessous du rapport cyclique maximal de la datasheet à votre fréquence de trigger." },
    { name: "Câblez un trigger pulsé, pas maintenu", text: "Câblez le Pin 4 sur un signal trigger correctement pulsé, synchronisé à l'exposition caméra — jamais un signal maintenu en continu à l'état haut." },
    { name: "Vérifiez avant la pleine vitesse", text: "Vérifiez le rapport cyclique réel avec le calculateur ou un oscilloscope avant de faire fonctionner la ligne à pleine vitesse de production." },
  ],
  de: [
    { name: "Belichtungsfenster bestimmen", text: "Bestimmen Sie die von der Kamera benötigte Belichtungszeit und die Liniengeschwindigkeit, um das maximal verfügbare Strobe-Fenster zu kennen." },
    { name: "Datenblatt der Beleuchtung prüfen", text: "Prüfen Sie im Datenblatt Ihrer Beleuchtung den maximalen Overdrive-Strommultiplikator und das maximale sichere Tastverhältnis." },
    { name: "Sichere Impulsbreite einstellen", text: "Stellen Sie die Strobe-Impulsbreite kürzer als das Belichtungsfenster ein, und deutlich unter dem maximalen Tastverhältnis des Datenblatts bei Ihrer Trigger-Frequenz." },
    { name: "Gepulsten, nicht gehaltenen Trigger verdrahten", text: "Verdrahten Sie Pin 4 mit einem korrekt gepulsten, zur Kamerabelichtung synchronisierten Triggersignal — niemals mit einem dauerhaft auf High gehaltenen Signal." },
    { name: "Vor Volllastbetrieb überprüfen", text: "Überprüfen Sie das tatsächliche Tastverhältnis mit dem Rechner oder einem Oszilloskop, bevor Sie die Linie mit voller Produktionsgeschwindigkeit betreiben." },
  ],
  it: [
    { name: "Determina la finestra di esposizione", text: "Determina il tempo di esposizione richiesto dalla camera e la velocità di linea per conoscere la finestra di strobo massima disponibile." },
    { name: "Verifica la scheda tecnica dell'illuminazione", text: "Verifica nella scheda tecnica della tua illuminazione il moltiplicatore di corrente overdrive massimo e il duty cycle di sicurezza massimo." },
    { name: "Imposta una larghezza di impulso sicura", text: "Imposta la larghezza dell'impulso stroboscopico più corta della finestra di esposizione, e ben al di sotto del duty cycle massimo della scheda tecnica alla tua frequenza di trigger." },
    { name: "Cabla un trigger pulsato, non mantenuto", text: "Cabla il Pin 4 su un segnale trigger correttamente pulsato, sincronizzato con l'esposizione della camera — mai un segnale mantenuto costantemente alto." },
    { name: "Verifica prima della piena velocità", text: "Verifica il duty cycle reale con il calcolatore o un oscilloscopio prima di far funzionare la linea a piena velocità di produzione." },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function findCatalogSegment() {
  return catalog.segments.find((s) => s.slug === "eclairage-stroboscopique-overdrive");
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const content = findCatalogSegment()?.content[locale];
  return {
    title: content ? { absolute: content.metaTitle } : undefined,
    description: content?.metaDescription,
    alternates: buildLanguageAlternates(ROUTE_KEY, locale),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = ARTICLE[locale];
  const content = findCatalogSegment()?.content[locale];
  const relatedSegments = RELATED_SLUGS.map((slug) => catalog.segments.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  const steps: HowToStepInput[] = STEP_TEMPLATES[locale];

  const jsonLd = buildTechArticleWithHowToJsonLd({
    path: `/${locale}${ROUTE_KEY}`,
    locale,
    headline: t.h1,
    description: content?.metaDescription ?? t.lead,
    image: `${SITE_URL}/${locale}${ROUTE_KEY}/opengraph-image`,
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    dependencies: "Overdrive-capable machine vision light, camera with configurable trigger/exposure, our M12 5-pin lighting connector.",
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
          { question: "Qu'est-ce que l'\u00e9clairage overdrive et pourquoi limiter le rapport cyclique ?", answer: "L'overdrive alimente un ensemble LED avec un courant cr\u00eate bien sup\u00e9rieur \u00e0 sa valeur continue, pour une impulsion tr\u00e8s courte, afin d'augmenter la luminosit\u00e9 et figer le mouvement sur des lignes rapides \u2014 d\u00e9passer le rapport cyclique r\u00e9sultant surchauffe et d\u00e9truit l'ensemble LED." },
          { question: "Comment calculer un rapport cyclique overdrive s\u00fbr ?", answer: "Ajustez la largeur d'impulsion et la fr\u00e9quence de trigger sur cette page pour voir le rapport cyclique r\u00e9sultant en temps r\u00e9el \u2014 le chiffre unique qui d\u00e9termine si un montage overdrive est s\u00fbr ou promis \u00e0 la d\u00e9faillance des LED." },
                ]
              : [
          { question: "What is overdrive lighting and why does it need a duty cycle limit?", answer: "Overdrive drives an LED array with a peak current well above its continuous rating for a very short pulse, boosting brightness to freeze motion on fast-moving lines \u2014 exceeding the resulting duty cycle overheats and destroys the LED array." },
          { question: "How do I calculate a safe overdrive duty cycle?", answer: "Adjust the pulse width and trigger frequency on this page to see the resulting duty cycle in real time \u2014 the single number that determines whether an overdrive setup is safe or headed for LED failure." },
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

      {(locale === "en" || locale === "fr") && (
        <div className="mt-8">
          <WiringFastTracks locale={locale} />
        </div>
      )}

      <div className="mt-10">
        <StrobeOverdriveSimulator labels={LABELS[locale]} />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.whatTitle}</h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{t.whatParagraph}</p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t.syncTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{t.syncParagraph}</p>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
          <h3 className="font-semibold text-red-900 dark:text-red-300">{t.overdriveTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-red-800 dark:text-red-300/90">{t.overdriveParagraph}</p>
        </div>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t.wiringTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{t.wiringParagraph}</p>
        <div className="mt-6">
          <M12Interactive pins={M12_PINS[locale]} labels={M12_LABELS[locale]} />
        </div>
      </section>

      {(locale === "en" || locale === "fr") && (
        <div className="mt-14">
          <SampleTestCTA locale={locale} />
        </div>
      )}

      {(locale === "en" || locale === "fr") && (
        <div id="contact-form" className="mt-8 scroll-mt-8">
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
