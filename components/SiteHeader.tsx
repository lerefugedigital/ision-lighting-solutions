import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

const SAMPLE_TEST_LABEL: Record<Locale, string> = {
  fr: "Tester un éclairage",
  en: "Test on Sample",
  de: "Beleuchtung Testen",
  it: "Testa un'Illuminazione",
};

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-slate-200 print:hidden dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" aria-label="Vision Lighting Solutions — Home">
          <Logo variant="full" height={32} />
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-600 sm:flex">
          {catalog.silos.map((silo) => (
            <Link key={silo.slug} href={silo.routeKey as never} className="hover:text-slate-900">
              {silo.content[locale].name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={"/test-sur-echantillon" as never}
            className="inline-flex shrink-0 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 sm:px-4 sm:text-sm"
          >
            {SAMPLE_TEST_LABEL[locale]}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
