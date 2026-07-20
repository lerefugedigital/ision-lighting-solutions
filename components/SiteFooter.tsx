import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_NAME } from "@/lib/site-config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

const FOOTER_TEXT: Record<
  Locale,
  {
    description: string;
    columnProducts: string;
    columnTools: string;
    columnSourcing: string;
    contactLabel: string;
    sampleTestLabel: string;
    legalLabel: string;
    rightsReserved: string;
  }
> = {
  en: {
    description:
      "Industrial LED lighting engineered for machine vision — bar lights, backlights, domes, coaxial and long-range illumination.",
    columnProducts: "Products & Ranges",
    columnTools: "R&D & Tools",
    columnSourcing: "Sourcing & Contact",
    contactLabel: "Contact Form",
    sampleTestLabel: "Sample Test Request",
    legalLabel: "Legal Notice",
    rightsReserved: "All rights reserved.",
  },
  fr: {
    description:
      "Éclairage LED industriel conçu pour la vision industrielle — barres, rétroéclairages, dômes, coaxial et éclairage longue distance.",
    columnProducts: "Produits & Gammes",
    columnTools: "R&D & Outils",
    columnSourcing: "Sourcing & Contact",
    contactLabel: "Formulaire de Contact",
    sampleTestLabel: "Demande de Test sur Échantillon",
    legalLabel: "Mentions Légales",
    rightsReserved: "Tous droits réservés.",
  },
  de: {
    description:
      "Industrielle LED-Beleuchtung für die Bildverarbeitung — Balkenleuchten, Hintergrundbeleuchtung, Kuppeln, Koaxial- und Langstreckenbeleuchtung.",
    columnProducts: "Produkte & Sortimente",
    columnTools: "F&E & Werkzeuge",
    columnSourcing: "Sourcing & Kontakt",
    contactLabel: "Kontaktformular",
    sampleTestLabel: "Musterprüfung Anfragen",
    legalLabel: "Impressum",
    rightsReserved: "Alle Rechte vorbehalten.",
  },
  it: {
    description:
      "Illuminazione LED industriale per la visione industriale — barre, retroilluminazioni, cupole, coassiale e illuminazione a lunga distanza.",
    columnProducts: "Prodotti & Gamme",
    columnTools: "R&S & Strumenti",
    columnSourcing: "Sourcing & Contatto",
    contactLabel: "Modulo di Contatto",
    sampleTestLabel: "Richiedi un Test su Campione",
    legalLabel: "Note Legali",
    rightsReserved: "Tutti i diritti riservati.",
  },
};

/** Silo 3 tools curated for the footer, rather than every wiring guide. */
const TOOL_SLUGS = ["eclairage-stroboscopique-overdrive", "brochage-m12-5-pins"];

function findSegment(slug: string) {
  const segment = catalog.segments.find((s) => s.slug === slug);
  if (!segment) throw new Error(`Segment "${slug}" missing from catalog`);
  return segment;
}

function findSilo(slug: string) {
  const silo = catalog.silos.find((s) => s.slug === slug);
  if (!silo) throw new Error(`Silo "${slug}" missing from catalog`);
  return silo;
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = FOOTER_TEXT[locale];
  const productSegments = catalog.segments.filter((s) => s.siloSlug === "eclairages");
  const guidesOptiquesSilo = findSilo("guides-optiques");
  const equivalencesSilo = findSilo("equivalences");

  return (
    <footer className="mt-24 border-t border-slate-200 print:hidden dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand + language */}
          <div>
            <Link href="/" aria-label="Vision Lighting Solutions — Home">
              <Logo variant="full" height={26} showSubtitle={false} />
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t.description}</p>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Column 2: Products & Ranges (Silo 1) */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.columnProducts}</h2>
            <ul className="mt-3 space-y-2">
              {productSegments.map((segment) => (
                <li key={segment.slug}>
                  <Link
                    href={segment.routeKey as never}
                    className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    {segment.content[locale].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: R&D & Tools (Silo 3 highlights + Silo 4 hub) */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.columnTools}</h2>
            <ul className="mt-3 space-y-2">
              {TOOL_SLUGS.map((slug) => {
                const segment = findSegment(slug);
                return (
                  <li key={segment.slug}>
                    <Link
                      href={segment.routeKey as never}
                      className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      {segment.content[locale].name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href={guidesOptiquesSilo.routeKey as never}
                  className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {guidesOptiquesSilo.content[locale].name}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sourcing & Contact (Silo 2 + contact + legal) */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.columnSourcing}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={equivalencesSilo.routeKey as never}
                  className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {equivalencesSilo.content[locale].name}
                </Link>
              </li>
              <li>
                <Link
                  href={"/contact" as never}
                  className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {t.contactLabel}
                </Link>
              </li>
              <li>
                <Link
                  href={"/test-sur-echantillon" as never}
                  className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {t.sampleTestLabel}
                </Link>
              </li>
              <li>
                <Link
                  href={"/mentions-legales" as never}
                  className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {t.legalLabel}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} {SITE_NAME} — {t.rightsReserved}
          </p>
          <Link
            href={"/mentions-legales" as never}
            className="text-xs text-slate-400 hover:text-slate-700 hover:underline dark:text-slate-500 dark:hover:text-slate-300"
          >
            {t.legalLabel}
          </Link>
        </div>
      </div>
    </footer>
  );
}
