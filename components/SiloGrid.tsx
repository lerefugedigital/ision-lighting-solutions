import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Segment } from "@/data/catalog";

export function SiloGrid({ segments, locale }: { segments: Segment[]; locale: Locale }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {segments.map((segment) => (
        <Link
          key={segment.slug}
          href={segment.routeKey as never}
          className="rounded-xl border border-slate-200 p-6 transition hover:border-amber-500 hover:shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">{segment.content[locale].name}</h2>
          <p className="mt-2 text-sm text-slate-500">{segment.content[locale].metaDescription}</p>
        </Link>
      ))}
    </div>
  );
}
