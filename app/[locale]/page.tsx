import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { buildLanguageAlternates } from "@/lib/hreflang";

const COPY: Record<Locale, { metaTitle: string; metaDescription: string; heroTitle: string; heroBody: string }> = {
  en: {
    metaTitle: "Machine Vision Lighting Solutions | LED Lighting for Industrial Vision",
    metaDescription:
      "Vision Lighting Solutions designs and supplies LED lighting for machine vision: bar lights, backlights, coaxial and dome lights, plus brand equivalents and integration guides.",
    heroTitle: "Machine Vision Lighting, Engineered for Reliable Inspection",
    heroBody:
      "From LED bar lights to coaxial and dome lighting, we help integrators and manufacturers choose, wire and deploy the right illumination for every inspection challenge.",
  },
  fr: {
    metaTitle: "Solutions d'Éclairage pour la Vision Industrielle | Éclairage LED",
    metaDescription:
      "Vision Lighting Solutions conçoit et fournit des éclairages LED pour la vision industrielle : barres, rétroéclairages, dômes et éclairages coaxiaux, équivalences et guides d'intégration.",
    heroTitle: "L'Éclairage Vision Industrielle, Pensé pour une Inspection Fiable",
    heroBody:
      "Des barres LED aux éclairages coaxiaux et dômes diffus, nous aidons intégrateurs et industriels à choisir, câbler et déployer l'éclairage adapté à chaque défi d'inspection.",
  },
  de: {
    metaTitle: "Beleuchtungslösungen für die Bildverarbeitung | LED-Beleuchtung",
    metaDescription:
      "Vision Lighting Solutions entwickelt und liefert LED-Beleuchtung für die Bildverarbeitung: Balkenleuchten, Hintergrundbeleuchtung, Koaxial- und Kuppelleuchten, Äquivalente und Integrationsleitfäden.",
    heroTitle: "Vision-Beleuchtung, Konzipiert für Zuverlässige Inspektion",
    heroBody:
      "Von LED-Balkenleuchten bis zu Koaxial- und Kuppelbeleuchtung helfen wir Integratoren und Herstellern, die richtige Beleuchtung für jede Inspektionsaufgabe zu wählen, zu verkabeln und einzusetzen.",
  },
  it: {
    metaTitle: "Soluzioni di Illuminazione per la Visione Industriale | Illuminazione LED",
    metaDescription:
      "Vision Lighting Solutions progetta e fornisce illuminazioni LED per la visione industriale: barre, retroilluminazioni, cupole e illuminazioni coassiali, equivalenze e guide di integrazione.",
    heroTitle: "Illuminazione per la Visione Industriale, Progettata per un'Ispezione Affidabile",
    heroBody:
      "Dalle barre LED alle illuminazioni coassiali e a cupola, aiutiamo integratori e produttori a scegliere, cablare e implementare l'illuminazione giusta per ogni sfida di ispezione.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: buildLanguageAlternates("/"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="mt-6 max-w-2xl text-slate-600">{t.heroBody}</p>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {catalog.silos.map((silo) => (
          <Link
            key={silo.slug}
            href={silo.routeKey as never}
            className="rounded-xl border border-slate-200 p-6 transition hover:border-amber-500 hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{silo.content[locale].name}</h2>
            <p className="mt-2 text-sm text-slate-500">{silo.content[locale].metaDescription}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
