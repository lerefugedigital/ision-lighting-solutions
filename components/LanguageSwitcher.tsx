"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === activeLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest" aria-label="Language">
      {routing.locales.map((locale, i) => (
        <div key={locale} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-400/40">|</span>}
          <button
            type="button"
            onClick={() => switchTo(locale)}
            disabled={isPending}
            aria-current={locale === activeLocale ? "true" : undefined}
            className={
              "transition disabled:opacity-60 " +
              (locale === activeLocale ? "text-amber-500" : "text-slate-500 hover:text-slate-900")
            }
          >
            {locale.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
}
