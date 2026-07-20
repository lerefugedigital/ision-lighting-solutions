import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_NAME } from "@/lib/site-config";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-24 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-4">
          {catalog.silos.map((silo) => (
            <div key={silo.slug}>
              <Link href={silo.routeKey as never} className="text-sm font-semibold text-slate-900 hover:underline">
                {silo.content[locale].name}
              </Link>
              <ul className="mt-3 space-y-2">
                {catalog.segments
                  .filter((segment) => segment.siloSlug === silo.slug)
                  .map((segment) => (
                    <li key={segment.slug}>
                      <Link
                        href={segment.routeKey as never}
                        className="text-sm text-slate-500 hover:text-slate-900 hover:underline"
                      >
                        {segment.content[locale].name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} {SITE_NAME}.
        </p>
      </div>
    </footer>
  );
}
