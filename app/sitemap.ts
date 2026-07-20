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

/** Per-silo priority tiers for the sitemap — products (Silo 1) rank highest since they
 *  carry the primary commercial intent, then equivalences (Silo 2), then the wiring
 *  tools (Silo 3) and optical guides (Silo 4) which are informational/support content. */
const SILO_PRIORITY: Record<string, number> = {
  eclairages: 0.9,
  equivalences: 0.8,
  "cablage-integration": 0.7,
  "guides-optiques": 0.7,
};

function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (path === "/contact" || path === "/test-sur-echantillon") return 0.7;
  if (path === "/mentions-legales") return 0.5;

  const siloSlug = path.split("/").filter(Boolean)[0];
  const silo = catalog.silos.find((s) => s.slug === siloSlug);
  if (silo) return SILO_PRIORITY[silo.slug] ?? 0.6;

  const segment = catalog.segments.find((s) => s.routeKey === path);
  if (segment) return SILO_PRIORITY[segment.siloSlug] ?? 0.6;

  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...catalog.silos.map((silo) => silo.routeKey),
    ...catalog.segments.map((segment) => segment.routeKey),
    "/contact",
    "/test-sur-echantillon",
    "/mentions-legales",
  ];

  return paths.map((path) => {
    const languages = alternatesFor(path);
    const isUtilityPage = path === "/mentions-legales";
    return {
      url: languages[routing.defaultLocale],
      alternates: { languages },
      priority: priorityFor(path),
      changeFrequency: path === "/" ? "weekly" : isUtilityPage ? "yearly" : "monthly",
    };
  });
}
