import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { catalog } from "@/data/catalog";
import { SITE_URL } from "@/lib/site-config";

function alternatesFor(path: string) {
  const cleanPath = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${cleanPath}`;
  }
  languages["x-default"] = languages[routing.defaultLocale];
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...catalog.silos.map((silo) => silo.routeKey),
    ...catalog.segments.map((segment) => segment.routeKey),
    "/contact",
    "/mentions-legales",
  ];

  return paths.map((path) => {
    const languages = alternatesFor(path);
    const depth = path.split("/").filter(Boolean).length;
    const isUtilityPage = path === "/contact" || path === "/mentions-legales";
    return {
      url: languages[routing.defaultLocale],
      alternates: { languages },
      priority: path === "/" ? 1 : isUtilityPage ? 0.5 : depth === 1 ? 0.8 : 0.6,
      changeFrequency: path === "/" ? "weekly" : isUtilityPage ? "yearly" : "monthly",
    };
  });
}
