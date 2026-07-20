import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { buildTechArticleWithHowToJsonLd, type HowToStepInput } from "@/lib/jsonld";
import { PnpNpnConverter, type PnpNpnModeInfo, type PnpNpnConverterLabels } from "@/components/PnpNpnConverter";

const ROUTE_KEY = "/cablage-integration/convertisseur-pnp-npn";
const PUBLISHED_DATE = "2026-07-20";
const MODIFIED_DATE = "2026-07-20";

const RELATED_SLUGS = [
  "brochage-m12-5-pins",
  "compatibilite-camera-cognex",
  "compatibilite-camera-keyence",
  "eclairage-stroboscopique-overdrive",
];

const MODES: Record<Locale, [PnpNpnModeInfo, PnpNpnModeInfo]> = {
  en: [
    {
      mode: "pnp",
      toggleLabel: "Camera output is PNP (sourcing)",
      sourceSignal: "+24V when active (sourcing)",
      convertedSignal: "0V when active (sinking) at Pin 4",
      explanation:
        "The converter inverts a PNP (sourcing) trigger into the NPN (sinking) signal the light's Pin 4 expects — no rewiring or reconfiguration needed on the camera side.",
    },
    {
      mode: "npn",
      toggleLabel: "Camera output is NPN (sinking)",
      sourceSignal: "0V when active (sinking)",
      convertedSignal: "+24V when active (sourcing) at Pin 4",
      explanation:
        "The converter inverts an NPN (sinking) trigger into the PNP (sourcing) signal the light's Pin 4 expects — no rewiring or reconfiguration needed on the camera side.",
    },
  ],
  fr: [
    {
      mode: "pnp",
      toggleLabel: "La sortie caméra est en PNP (source)",
      sourceSignal: "+24V à l'état actif (source)",
      convertedSignal: "0V à l'état actif (drain) sur le Pin 4",
      explanation:
        "Le convertisseur inverse un trigger PNP (source) en signal NPN (drain) attendu par le Pin 4 de l'éclairage — sans recâblage ni reconfiguration côté caméra.",
    },
    {
      mode: "npn",
      toggleLabel: "La sortie caméra est en NPN (drain)",
      sourceSignal: "0V à l'état actif (drain)",
      convertedSignal: "+24V à l'état actif (source) sur le Pin 4",
      explanation:
        "Le convertisseur inverse un trigger NPN (drain) en signal PNP (source) attendu par le Pin 4 de l'éclairage — sans recâblage ni reconfiguration côté caméra.",
    },
  ],
  de: [
    {
      mode: "pnp",
      toggleLabel: "Kameraausgang ist PNP (sourcing)",
      sourceSignal: "+24V im aktiven Zustand (sourcing)",
      convertedSignal: "0V im aktiven Zustand (sinking) an Pin 4",
      explanation:
        "Der Wandler invertiert einen PNP-Trigger (sourcing) in das NPN-Signal (sinking), das Pin 4 der Beleuchtung erwartet — ohne Neuverdrahtung oder Umkonfiguration auf Kameraseite.",
    },
    {
      mode: "npn",
      toggleLabel: "Kameraausgang ist NPN (sinking)",
      sourceSignal: "0V im aktiven Zustand (sinking)",
      convertedSignal: "+24V im aktiven Zustand (sourcing) an Pin 4",
      explanation:
        "Der Wandler invertiert einen NPN-Trigger (sinking) in das PNP-Signal (sourcing), das Pin 4 der Beleuchtung erwartet — ohne Neuverdrahtung oder Umkonfiguration auf Kameraseite.",
    },
  ],
  it: [
    {
      mode: "pnp",
      toggleLabel: "L'uscita camera è PNP (source)",
      sourceSignal: "+24V allo stato attivo (source)",
      convertedSignal: "0V allo stato attivo (sink) sul Pin 4",
      explanation:
        "Il convertitore inverte un trigger PNP (source) nel segnale NPN (sink) atteso dal Pin 4 dell'illuminazione — senza ricablaggio né riconfigurazione lato camera.",
    },
    {
      mode: "npn",
      toggleLabel: "L'uscita camera è NPN (sink)",
      sourceSignal: "0V allo stato attivo (sink)",
      convertedSignal: "+24V allo stato attivo (source) sul Pin 4",
      explanation:
        "Il convertitore inverte un trigger NPN (sink) nel segnale PNP (source) atteso dal Pin 4 dell'illuminazione — senza ricablaggio né riconfigurazione lato camera.",
    },
  ],
};

const LABELS: Record<Locale, PnpNpnConverterLabels> = {
  en: {
    cameraOutputLabel: "Camera / PLC Output",
    converterLabel: "PNP ↔ NPN Converter",
    lightPinLabel: "Light — Pin 4 (Trigger)",
    activeStateLabel: "Signal when active:",
  },
  fr: {
    cameraOutputLabel: "Sortie Caméra / Automate",
    converterLabel: "Convertisseur PNP ↔ NPN",
    lightPinLabel: "Éclairage — Pin 4 (Trigger)",
    activeStateLabel: "Signal à l'état actif :",
  },
  de: {
    cameraOutputLabel: "Kamera-/SPS-Ausgang",
    converterLabel: "PNP ↔ NPN Wandler",
    lightPinLabel: "Beleuchtung — Pin 4 (Trigger)",
    activeStateLabel: "Signal im aktiven Zustand:",
  },
  it: {
    cameraOutputLabel: "Uscita Camera / PLC",
    converterLabel: "Convertitore PNP ↔ NPN",
    lightPinLabel: "Illuminazione — Pin 4 (Trigger)",
    activeStateLabel: "Segnale allo stato attivo:",
  },
};

export const ARTICLE = {
  en: {
    metaTitle: "PNP/NPN Converter | Vision Lighting Solutions",
    metaDescription:
      "How to convert between PNP (sourcing) and NPN (sinking) trigger signals to integrate vision lighting with any PLC or camera I/O.",
    h1: "PNP/NPN Signal Converter for Vision Lighting Integration",
    lead: "Toggle your camera or PLC output's signal type below to see how a PNP/NPN converter changes what reaches the light's Pin 4 — and whether you actually need one.",
    recapTitle: "PNP vs NPN, Briefly",
    recapParagraph:
      "A PNP (sourcing) output switches its signal wire to +24V when active; an NPN (sinking) output instead pulls its signal wire down to 0V when active. Our lighting's Pin 4 trigger input must be wired to match whichever convention the upstream source actually uses — see our full M12 pinout guide for the wiring diagram.",
    insideTitle: "Inside a PNP/NPN Converter",
    insideParagraph:
      "Most commercial PNP/NPN converters are small opto-isolated DIN-rail modules: the incoming signal drives an internal LED, and a phototransistor or relay on the output side re-creates the opposite sourcing/sinking behavior. Opto-isolation is worth paying for in an industrial environment — it breaks the electrical connection between the source and the light, so noise or a fault on one side can't propagate to the other.",
    whenNotNeededTitle: "When you probably don't need one",
    whenNotNeededParagraph:
      "Before buying a hardware converter, check whether the source can simply be reconfigured: most modern smart cameras (Cognex, Keyence, Basler) let you set each output's polarity to PNP or NPN in software, with no extra hardware required. A physical converter is really only necessary for older fixed-polarity outputs, or PLC signals you can't safely reconfigure.",
    relatedTitle: "Related wiring guides",
  },
  fr: {
    metaTitle: "Convertisseur PNP/NPN | Vision Lighting Solutions",
    metaDescription:
      "Comment convertir un signal trigger PNP (source) en NPN (drain) et inversement pour intégrer l'éclairage vision à n'importe quel automate ou caméra.",
    h1: "Convertisseur de Signal PNP/NPN pour l'Intégration Éclairage Vision",
    lead: "Basculez le type de signal de votre sortie caméra ou automate ci-dessous pour voir comment un convertisseur PNP/NPN modifie ce qui arrive au Pin 4 de l'éclairage — et si vous en avez réellement besoin.",
    recapTitle: "PNP vs NPN, en Bref",
    recapParagraph:
      "Une sortie PNP (source) amène son fil de signal à +24V à l'état actif ; une sortie NPN (drain) tire au contraire son fil de signal à 0V à l'état actif. L'entrée trigger Pin 4 de notre éclairage doit être câblée selon la convention réellement utilisée par la source en amont — consultez notre guide complet de brochage M12 pour le schéma de câblage.",
    insideTitle: "À l'Intérieur d'un Convertisseur PNP/NPN",
    insideParagraph:
      "La plupart des convertisseurs PNP/NPN du commerce sont de petits modules optocouplés montés sur rail DIN : le signal entrant pilote une LED interne, et un phototransistor ou un relais côté sortie recrée le comportement inverse (source/drain). L'optocouplage vaut la peine d'être payé en environnement industriel : il rompt la liaison électrique entre la source et l'éclairage, empêchant qu'un bruit ou un défaut d'un côté ne se propage à l'autre.",
    whenNotNeededTitle: "Quand Vous N'en Avez Probablement Pas Besoin",
    whenNotNeededParagraph:
      "Avant d'acheter un convertisseur matériel, vérifiez si la source peut simplement être reconfigurée : la plupart des caméras intelligentes modernes (Cognex, Keyence, Basler) permettent de régler la polarité de chaque sortie en PNP ou NPN par logiciel, sans matériel supplémentaire. Un convertisseur physique n'est vraiment nécessaire que pour d'anciennes sorties à polarité fixe, ou des signaux automate que vous ne pouvez pas reconfigurer en toute sécurité.",
    relatedTitle: "Guides de câblage associés",
  },
  de: {
    metaTitle: "PNP/NPN-Wandler | Vision Lighting Solutions",
    metaDescription:
      "So wandeln Sie PNP- (Sourcing) und NPN- (Sinking) Triggersignale um, um Vision-Beleuchtung mit jeder SPS oder Kamera-I/O zu integrieren.",
    h1: "PNP/NPN-Signalwandler für die Integration von Vision-Beleuchtung",
    lead: "Schalten Sie unten den Signaltyp Ihres Kamera- oder SPS-Ausgangs um, um zu sehen, wie ein PNP/NPN-Wandler verändert, was an Pin 4 der Beleuchtung ankommt — und ob Sie überhaupt einen benötigen.",
    recapTitle: "PNP vs NPN, Kurz Erklärt",
    recapParagraph:
      "Ein PNP-Ausgang (sourcing) schaltet seine Signalleitung im aktiven Zustand auf +24V; ein NPN-Ausgang (sinking) zieht seine Signalleitung stattdessen im aktiven Zustand auf 0V. Der Trigger-Eingang Pin 4 unserer Beleuchtung muss passend zur tatsächlich verwendeten Konvention der vorgelagerten Quelle verdrahtet werden — siehe unseren vollständigen M12-Pinbelegungsleitfaden für den Verkabelungsplan.",
    insideTitle: "Innenansicht eines PNP/NPN-Wandlers",
    insideParagraph:
      "Die meisten handelsüblichen PNP/NPN-Wandler sind kleine optogekoppelte Hutschienenmodule: Das eingehende Signal steuert eine interne LED an, und ein Fototransistor oder Relais auf der Ausgangsseite erzeugt das entgegengesetzte Sourcing-/Sinking-Verhalten. Optokopplung lohnt sich in industrieller Umgebung — sie trennt die elektrische Verbindung zwischen Quelle und Beleuchtung, sodass sich Störungen oder ein Fehler auf einer Seite nicht auf die andere übertragen können.",
    whenNotNeededTitle: "Wann Sie Wahrscheinlich Keinen Benötigen",
    whenNotNeededParagraph:
      "Bevor Sie einen Hardware-Wandler kaufen, prüfen Sie, ob die Quelle einfach umkonfiguriert werden kann: Die meisten modernen Smart-Kameras (Cognex, Keyence, Basler) lassen sich per Software auf PNP oder NPN pro Ausgang einstellen, ohne zusätzliche Hardware. Ein physischer Wandler ist wirklich nur bei älteren Ausgängen mit fester Polarität oder SPS-Signalen nötig, die Sie nicht sicher umkonfigurieren können.",
    relatedTitle: "Verwandte Verkabelungsleitfäden",
  },
  it: {
    metaTitle: "Convertitore PNP/NPN | Vision Lighting Solutions",
    metaDescription:
      "Come convertire un segnale trigger PNP (source) in NPN (sink) e viceversa per integrare l'illuminazione vision con qualsiasi PLC o camera.",
    h1: "Convertitore di Segnale PNP/NPN per l'Integrazione dell'Illuminazione Vision",
    lead: "Cambia il tipo di segnale della tua uscita camera o PLC qui sotto per vedere come un convertitore PNP/NPN modifica ciò che arriva al Pin 4 dell'illuminazione — e se ne hai davvero bisogno.",
    recapTitle: "PNP vs NPN, in Breve",
    recapParagraph:
      "Un'uscita PNP (source) porta il proprio filo di segnale a +24V allo stato attivo; un'uscita NPN (sink) porta invece il proprio filo di segnale a 0V allo stato attivo. L'ingresso trigger Pin 4 della nostra illuminazione deve essere cablato secondo la convenzione realmente usata dalla sorgente a monte — consulta la nostra guida completa alla piedinatura M12 per lo schema di cablaggio.",
    insideTitle: "Dentro un Convertitore PNP/NPN",
    insideParagraph:
      "La maggior parte dei convertitori PNP/NPN commerciali sono piccoli moduli optoaccoppiati da guida DIN: il segnale in ingresso pilota un LED interno, e un fototransistor o un relè sul lato uscita ricrea il comportamento opposto (source/sink). L'optoisolamento vale la spesa in ambiente industriale: interrompe il collegamento elettrico tra la sorgente e l'illuminazione, così un disturbo o un guasto da un lato non può propagarsi all'altro.",
    whenNotNeededTitle: "Quando Probabilmente Non Ne Hai Bisogno",
    whenNotNeededParagraph:
      "Prima di acquistare un convertitore hardware, verifica se la sorgente può semplicemente essere riconfigurata: la maggior parte delle camere intelligenti moderne (Cognex, Keyence, Basler) permette di impostare la polarità di ciascuna uscita su PNP o NPN via software, senza hardware aggiuntivo. Un convertitore fisico serve davvero solo per uscite datate a polarità fissa, o segnali PLC che non puoi riconfigurare in sicurezza.",
    relatedTitle: "Guide di cablaggio correlate",
  },
} satisfies Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    lead: string;
    recapTitle: string;
    recapParagraph: string;
    insideTitle: string;
    insideParagraph: string;
    whenNotNeededTitle: string;
    whenNotNeededParagraph: string;
    relatedTitle: string;
  }
>;

const STEP_TEMPLATES: Record<Locale, Array<{ name: string; text: string }>> = {
  en: [
    { name: "Identify the source signal type", text: "Identify whether your camera or PLC output is PNP (sourcing) or NPN (sinking)." },
    { name: "Identify the target wiring", text: "Identify what wiring your light's Pin 4 trigger input expects (PNP or NPN)." },
    { name: "Check for a software option first", text: "Check whether the source can be reconfigured in software before adding hardware — most modern smart cameras support both polarities." },
    { name: "Wire the converter", text: "If reconfiguration isn't possible, wire a PNP/NPN converter module between the source output and the light's Pin 4." },
    { name: "Test at low speed first", text: "Test the trigger at a low frame rate first, then verify strobe behavior before running at full line speed." },
  ],
  fr: [
    { name: "Identifiez le type de signal source", text: "Identifiez si votre sortie caméra ou automate est en PNP (source) ou NPN (drain)." },
    { name: "Identifiez le câblage cible", text: "Identifiez le câblage attendu par l'entrée trigger Pin 4 de votre éclairage (PNP ou NPN)." },
    { name: "Vérifiez d'abord l'option logicielle", text: "Vérifiez si la source peut être reconfigurée par logiciel avant d'ajouter du matériel — la plupart des caméras intelligentes modernes supportent les deux polarités." },
    { name: "Câblez le convertisseur", text: "Si la reconfiguration n'est pas possible, câblez un module convertisseur PNP/NPN entre la sortie source et le Pin 4 de l'éclairage." },
    { name: "Testez d'abord à basse vitesse", text: "Testez le trigger à basse cadence d'abord, puis vérifiez le comportement du strobe avant de passer à pleine vitesse de ligne." },
  ],
  de: [
    { name: "Signaltyp der Quelle identifizieren", text: "Identifizieren Sie, ob Ihr Kamera- oder SPS-Ausgang PNP (sourcing) oder NPN (sinking) ist." },
    { name: "Zielverdrahtung identifizieren", text: "Identifizieren Sie, welche Verdrahtung der Trigger-Eingang Pin 4 Ihrer Beleuchtung erwartet (PNP oder NPN)." },
    { name: "Zuerst Softwareoption prüfen", text: "Prüfen Sie, ob die Quelle per Software umkonfiguriert werden kann, bevor Sie Hardware hinzufügen — die meisten modernen Smart-Kameras unterstützen beide Polaritäten." },
    { name: "Wandler verdrahten", text: "Ist eine Umkonfiguration nicht möglich, verdrahten Sie ein PNP/NPN-Wandlermodul zwischen dem Quellausgang und Pin 4 der Beleuchtung." },
    { name: "Zuerst bei niedriger Geschwindigkeit testen", text: "Testen Sie den Trigger zunächst bei niedriger Bildrate und prüfen Sie dann das Blitzverhalten, bevor Sie mit voller Liniengeschwindigkeit fahren." },
  ],
  it: [
    { name: "Identifica il tipo di segnale sorgente", text: "Identifica se la tua uscita camera o PLC è PNP (source) o NPN (sink)." },
    { name: "Identifica il cablaggio target", text: "Identifica quale cablaggio si aspetta l'ingresso trigger Pin 4 della tua illuminazione (PNP o NPN)." },
    { name: "Verifica prima l'opzione software", text: "Verifica se la sorgente può essere riconfigurata via software prima di aggiungere hardware — la maggior parte delle camere intelligenti moderne supporta entrambe le polarità." },
    { name: "Cabla il convertitore", text: "Se la riconfigurazione non è possibile, cabla un modulo convertitore PNP/NPN tra l'uscita sorgente e il Pin 4 dell'illuminazione." },
    { name: "Testa prima a bassa velocità", text: "Testa prima il trigger a un frame rate basso, poi verifica il comportamento dello strobo prima di procedere a piena velocità di linea." },
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
    dependencies: "PNP or NPN camera/PLC trigger output, opto-isolated PNP/NPN converter module (if needed), our M12 5-pin lighting.",
    totalTime: "PT10M",
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
        <PnpNpnConverter modes={MODES[locale]} labels={LABELS[locale]} />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t.recapTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{t.recapParagraph}</p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t.insideTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{t.insideParagraph}</p>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <h3 className="font-semibold text-amber-900 dark:text-amber-300">{t.whenNotNeededTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/90 dark:text-amber-300/90">
            {t.whenNotNeededParagraph}
          </p>
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
