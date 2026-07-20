import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleWithHowToJsonLd, type HowToStepInput } from "@/lib/jsonld";
import { StrobeOverdriveSimulator, type StrobeOverdriveLabels } from "@/components/StrobeOverdriveSimulator";

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

export const ARTICLE = {
  en: {
    metaTitle: "Strobe & Overdrive Lighting | Vision Lighting Solutions",
    metaDescription:
      "How to configure strobe and overdrive modes to boost peak LED brightness and freeze motion on fast-moving lines without motion blur.",
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
    relatedTitle: "Related wiring guides",
  },
  fr: {
    metaTitle: "Éclairage Stroboscopique & Overdrive | Vision Lighting Solutions",
    metaDescription:
      "Comment configurer les modes stroboscopique et overdrive pour augmenter la luminosité crête LED et figer le mouvement sur des lignes rapides.",
    h1: "Configurer un Éclairage Stroboscopique et Overdrive pour l'Inspection Rapide",
    lead: "Ajustez la largeur d'impulsion et la fréquence de trigger ci-dessous pour voir le rapport cyclique résultant en temps réel — le chiffre unique qui détermine si un montage overdrive est sûr ou promis à la défaillance des LED.",
    whatTitle: "Ce Qu'est Réellement l'Éclairage Overdrive",
    whatParagraph:
      "Une LED peut supporter en toute sécurité un courant de crête bien supérieur à son maximum continu (DC), tant que ce courant ne circule que pendant une brève impulsion et que la puissance moyenne dissipée dans le temps reste dans les limites thermiques de la LED. L'éclairage overdrive exploite exactement cela : le driver pousse plusieurs fois le courant nominal continu dans les LED, mais seulement pendant la brève impulsion stroboscopique synchronisée à l'exposition de la caméra — échangeant une luminosité continue contre un flash bien plus intense et bien plus court, capable de figer un mouvement qu'un éclairage en mode continu ne pourrait jamais capturer.",
    syncTitle: "Synchroniser l'Impulsion avec l'Exposition de la Caméra",
    syncParagraph:
      "L'impulsion stroboscopique doit tomber à l'intérieur de la fenêtre d'exposition de la caméra, pas simplement à proximité. Ajoutez le délai trigger-vers-exposition de la caméra (vérifiez sa datasheet) au moment de synchroniser le front montant du Pin 4, et gardez une largeur d'impulsion plus courte que le temps d'exposition lui-même — une impulsion qui démarre avant l'ouverture de l'obturateur ou se termine avant sa fermeture ne fait que gaspiller de la lumière et produit une image inégalement éclairée et partiellement sombre, au lieu de l'image nette et figée que l'overdrive est censé fournir.",
    overdriveTitle: "Pourquoi Dépasser le Rapport Cyclique Détruit les LED",
    overdriveParagraph:
      "La limite de rapport cyclique existe parce que la chaleur de jonction de la LED ne dispose que de la portion « off » de chaque cycle pour se dissiper. Poussez le rapport cyclique trop haut au courant overdrive et la température de jonction grimpe cycle après cycle au lieu de se réinitialiser — la LED ne tombe pas en panne instantanément, mais son phosphore se dégrade et sa jonction surchauffe jusqu'à une défaillance en circuit ouvert, typiquement en quelques secondes à quelques minutes de fonctionnement continu au-delà de la limite, pas progressivement sur des mois. Ne laissez jamais le Pin 4 à l'état haut en continu en mode overdrive : c'est un rapport cyclique de 100 %, et c'est le moyen le plus rapide de détruire un éclairage overdrive.",
    relatedTitle: "Guides de câblage associés",
  },
  de: {
    metaTitle: "Blitz- & Overdrive-Beleuchtung | Vision Lighting Solutions",
    metaDescription:
      "So konfigurieren Sie Blitz- und Overdrive-Modi, um die maximale LED-Helligkeit zu erhöhen und Bewegungen auf schnellen Linien einzufrieren.",
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
    relatedTitle: "Verwandte Verkabelungsleitfäden",
  },
  it: {
    metaTitle: "Illuminazione Stroboscopica & Overdrive | Vision Lighting Solutions",
    metaDescription:
      "Come configurare le modalità stroboscopica e overdrive per aumentare la luminosità di picco dei LED e bloccare il movimento su linee veloci.",
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
    relatedTitle: "Guide di cablaggio correlate",
  },
} satisfies Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    lead: string;
    whatTitle: string;
    whatParagraph: string;
    syncTitle: string;
    syncParagraph: string;
    overdriveTitle: string;
    overdriveParagraph: string;
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
    dependencies: "Overdrive-capable machine vision light, camera with configurable trigger/exposure, our M12 5-pin lighting connector.",
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
