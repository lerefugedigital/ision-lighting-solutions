import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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
        <LanguageSwitcher />
      </div>
    </header>
  );
}
