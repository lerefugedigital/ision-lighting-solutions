import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/hreflang";
import { ContactForm } from "@/components/ContactForm";

const ROUTE_KEY = "/contact";

const META: Record<Locale, { metaTitle: string; metaDescription: string; h1: string; lead: string }> = {
  en: {
    metaTitle: "Contact Us | Vision Lighting Solutions Engineering Team",
    metaDescription: "Get in touch with our machine vision lighting engineers for product specifications, technical quotes, or wiring and integration questions today.",
    h1: "Contact Our Team",
    lead: "Whichever silo your question belongs to, this form reaches the same team of application engineers.",
  },
  fr: {
    metaTitle: "Contactez Nos Ingénieurs | Vision Lighting Solutions",
    metaDescription: "Contactez nos ingénieurs en éclairage vision industrielle pour vos spécifications produit, devis technique, ou questions de câblage et d'intégration.",
    h1: "Contacter Notre Équipe",
    lead: "Quel que soit le silo concerné par votre question, ce formulaire atteint la même équipe d'ingénieurs d'application.",
  },
  de: {
    metaTitle: "Kontakt | Vision Lighting Solutions",
    metaDescription: "Kontaktieren Sie unsere Ingenieure für Bildverarbeitungsbeleuchtung für Spezifikationen, Angebote oder technische Fragen.",
    h1: "Unser Team Kontaktieren",
    lead: "Kontaktieren Sie unser Team für Spezifikationen, Angebote oder technische Fragen.",
  },
  it: {
    metaTitle: "Contatti | Vision Lighting Solutions",
    metaDescription: "Contatta i nostri ingegneri per l'illuminazione della visione industriale per specifiche, preventivi o domande tecniche.",
    h1: "Contatta il Nostro Team",
    lead: "Contatta il nostro team per specifiche, preventivi o domande tecniche.",
  },
};

const PLACEHOLDER_COMING_SOON: Record<"de" | "it", string> = {
  de: "Das Kontaktformular ist in Kürze auf Deutsch verfügbar. Bitte wechseln Sie oben zur englischen oder französischen Version.",
  it: "Il modulo di contatto sarà presto disponibile in italiano. Passa alla versione inglese o francese qui sopra.",
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
    alternates: buildLanguageAlternates(ROUTE_KEY, locale),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const m = META[locale];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{m.h1}</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{m.lead}</p>

      <div className="mt-10">
        {locale === "en" || locale === "fr" ? (
          <ContactForm locale={locale} contextType="general" />
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400 dark:border-slate-700">
            {PLACEHOLDER_COMING_SOON[locale as "de" | "it"]}
          </p>
        )}
      </div>
    </main>
  );
}
