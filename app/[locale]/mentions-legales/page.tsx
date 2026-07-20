import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/hreflang";

const ROUTE_KEY = "/mentions-legales";

type RichLocale = "en" | "fr";

const META: Record<Locale, { metaTitle: string; metaDescription: string; h1: string }> = {
  en: {
    metaTitle: "Legal Notice & Privacy Policy | Vision Lighting Solutions",
    metaDescription:
      "Legal notice, GDPR data protection policy, cookie declaration and technical liability limitation for vision-lighting-solutions.com.",
    h1: "Legal Notice & Privacy Policy",
  },
  fr: {
    metaTitle: "Mentions Légales & Politique de Confidentialité | Vision Lighting Solutions",
    metaDescription:
      "Mentions légales, politique de protection des données RGPD, déclaration cookies et limitation de responsabilité technique de vision-lighting-solutions.com.",
    h1: "Mentions Légales & Politique de Confidentialité",
  },
  de: {
    metaTitle: "Impressum & Datenschutz | Vision Lighting Solutions",
    metaDescription: "Impressum, DSGVO-Datenschutzerklärung und Cookie-Hinweis für vision-lighting-solutions.com.",
    h1: "Impressum & Datenschutzerklärung",
  },
  it: {
    metaTitle: "Note Legali & Privacy | Vision Lighting Solutions",
    metaDescription: "Note legali, informativa privacy GDPR e dichiarazione cookie per vision-lighting-solutions.com.",
    h1: "Note Legali & Informativa sulla Privacy",
  },
};

const PLACEHOLDER_COMING_SOON: Record<"de" | "it", string> = {
  de: "Der vollständige Inhalt dieser Seite ist in Kürze auf Deutsch verfügbar. Für die englische oder französische Version wechseln Sie bitte die Sprache oben.",
  it: "Il contenuto completo di questa pagina sarà presto disponibile in italiano. Per la versione inglese o francese, cambia lingua in alto.",
};

interface CompanyField {
  label: string;
  value: string;
  configurable: boolean;
}

interface RichContent {
  lead: string;
  section1Title: string;
  companyFields: CompanyField[];
  ipParagraph: string;
  section2Title: string;
  gdprParagraphs: [string, string, string];
  section3Title: string;
  cookiesParagraph: string;
  section4Title: string;
  liabilityParagraph: string;
}

const RICH_CONTENT: Record<RichLocale, RichContent> = {
  en: {
    lead: "Legal information about this website's publisher, hosting, data protection practices, and the scope of the technical information provided.",
    section1Title: "Site Publisher & Intellectual Property",
    companyFields: [
      { label: "Publisher", value: "Vision Lighting Solutions", configurable: false },
      { label: "Company name & registered address", value: "[Company name / address to configure]", configurable: true },
      { label: "Company registration / VAT number", value: "[Registration number / VAT number]", configurable: true },
      { label: "Publication director", value: "[Publication director name]", configurable: true },
      { label: "Host", value: "Vercel Inc. (see vercel.com/legal for the host's full registered address)", configurable: false },
    ],
    ipParagraph:
      "All content on this website — including text, technical diagrams, illustrations, and the Vision Lighting Solutions name and logo — is the property of Vision Lighting Solutions or its licensors, and is protected under applicable intellectual property law. Reproduction, in whole or in part, without prior written authorization is prohibited, except for private, non-commercial use.",
    section2Title: "Personal Data Protection (GDPR)",
    gdprParagraphs: [
      "Vision Lighting Solutions collects personal data (name, professional email, company, phone number, and project description) exclusively through the contact forms on this website. This data is processed for the sole purpose of responding to your industrial inquiry — technical questions, specification requests, quotes, or cross-reference studies — and is not used for unsolicited marketing or shared with third parties beyond what is strictly necessary to answer your request.",
      "Processing is based on your consent, given when you submit a form, and on Vision Lighting Solutions' legitimate interest in responding to commercial and technical inquiries. Data is retained only for as long as necessary to handle your request and, where a business relationship follows, for the duration of that relationship plus any applicable legal retention period.",
      "In accordance with the EU General Data Protection Regulation (GDPR), you have the right to access, rectify, erase, restrict, or object to the processing of your personal data, and the right to data portability. To exercise these rights, contact our data protection team at privacy@vision-lighting-solutions.com. You also have the right to lodge a complaint with your national data protection supervisory authority.",
    ],
    section3Title: "Cookies & Tracking",
    cookiesParagraph:
      "This website does not use advertising cookies or third-party tracking cookies, and does not run any behavioral advertising or analytics tracking script. Any strictly necessary technical cookie (for example, to remember your selected language) is used solely to make the site function correctly and does not require consent under the ePrivacy Directive's exemption for essential cookies.",
    section4Title: "Limitation of Technical Liability",
    liabilityParagraph:
      "The optical diagrams, wiring schematics, wavelength ranges, and technical explanations provided throughout this website are illustrative and educational in nature. They are simplified representations intended to explain general optical and electrical principles, not engineering specifications for a specific installation. Vision Lighting Solutions cannot be held liable for any direct or indirect consequences resulting from the use of this information without independent verification against the relevant manufacturer datasheet and validation by a qualified engineer. For an exact specification, please contact our engineering team.",
  },
  fr: {
    lead: "Informations légales concernant l'éditeur de ce site, son hébergement, ses pratiques de protection des données, et le périmètre des informations techniques fournies.",
    section1Title: "Édition du Site et Propriété Intellectuelle",
    companyFields: [
      { label: "Éditeur", value: "Vision Lighting Solutions", configurable: false },
      { label: "Raison sociale & Adresse", value: "[Nom de la société / adresse à configurer]", configurable: true },
      { label: "SIRET / TVA Intracommunautaire", value: "[Numéro SIRET / TVA]", configurable: true },
      { label: "Responsable de la publication", value: "[Nom du responsable de publication]", configurable: true },
      { label: "Hébergeur", value: "Vercel Inc. (voir vercel.com/legal pour l'adresse complète de l'hébergeur)", configurable: false },
    ],
    ipParagraph:
      "L'ensemble du contenu de ce site — textes, schémas techniques, illustrations, ainsi que le nom et le logo Vision Lighting Solutions — est la propriété de Vision Lighting Solutions ou de ses concédants, et est protégé par le droit de la propriété intellectuelle applicable. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite, à l'exception d'un usage privé et non commercial.",
    section2Title: "Protection des Données Personnelles (RGPD)",
    gdprParagraphs: [
      "Vision Lighting Solutions collecte des données personnelles (nom, email professionnel, société, téléphone et description de projet) exclusivement via les formulaires de contact de ce site. Ces données sont traitées dans le seul but de répondre à votre demande industrielle — questions techniques, demandes de spécifications, devis ou études de correspondance — et ne sont ni utilisées à des fins de prospection non sollicitée, ni transmises à des tiers au-delà de ce qui est strictement nécessaire pour traiter votre demande.",
      "Le traitement repose sur votre consentement, donné lors de la soumission d'un formulaire, ainsi que sur l'intérêt légitime de Vision Lighting Solutions à répondre aux demandes commerciales et techniques. Les données sont conservées uniquement le temps nécessaire au traitement de votre demande et, si une relation commerciale s'ensuit, pendant la durée de cette relation, augmentée des délais de conservation légaux applicables.",
      "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition au traitement de vos données personnelles, ainsi que d'un droit à la portabilité. Pour exercer ces droits, contactez notre équipe de protection des données à privacy@vision-lighting-solutions.com. Vous disposez également du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente en matière de protection des données.",
    ],
    section3Title: "Cookies & Traçabilité",
    cookiesParagraph:
      "Ce site n'utilise aucun cookie publicitaire ni cookie de traçage tiers, et n'exécute aucun script de publicité comportementale ou de suivi analytique. Les éventuels cookies techniques strictement nécessaires (par exemple pour mémoriser la langue sélectionnée) ne servent qu'au bon fonctionnement du site et ne nécessitent pas de consentement, conformément à l'exemption prévue par la directive ePrivacy pour les cookies essentiels.",
    section4Title: "Limitation de Responsabilité Technique",
    liabilityParagraph:
      "Les schémas optiques, diagrammes de câblage, plages de longueurs d'onde et explications techniques fournis sur ce site ont une vocation illustrative et pédagogique. Ce sont des représentations simplifiées destinées à expliquer des principes optiques et électriques généraux, et non des spécifications d'ingénierie pour une installation donnée. Vision Lighting Solutions ne saurait être tenue responsable des conséquences directes ou indirectes résultant de l'utilisation de ces informations sans vérification indépendante auprès de la fiche technique du fabricant concerné et validation par un ingénieur qualifié. Pour une spécification exacte, contactez notre équipe d'ingénierie.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale];
  return {
    title: { absolute: m.metaTitle },
    description: m.metaDescription,
    alternates: buildLanguageAlternates(ROUTE_KEY),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const m = META[locale];
  const rich = locale === "en" || locale === "fr" ? RICH_CONTENT[locale] : null;

  if (!rich) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {m.h1}
        </h1>
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400 dark:border-slate-700">
          {PLACEHOLDER_COMING_SOON[locale as "de" | "it"]}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{m.h1}</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{rich.lead}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {rich.section1Title}
        </h2>
        <dl className="mt-4 space-y-3">
          {rich.companyFields.map((field) => (
            <div key={field.label} className="sm:flex sm:gap-3">
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 sm:w-64 sm:shrink-0">
                {field.label}
              </dt>
              <dd
                className={
                  field.configurable
                    ? "mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 sm:mt-0"
                    : "mt-1 text-sm text-slate-700 dark:text-slate-300 sm:mt-0"
                }
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-300">{rich.ipParagraph}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {rich.section2Title}
        </h2>
        {rich.gdprParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 30)} className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {rich.section3Title}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{rich.cookiesParagraph}</p>
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{rich.section4Title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{rich.liabilityParagraph}</p>
      </section>
    </main>
  );
}
