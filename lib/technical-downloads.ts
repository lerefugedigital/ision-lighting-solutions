import fs from "node:fs";
import path from "node:path";
import type { RichLocale } from "./product-shared-content";

/**
 * Real assets only: checks whether a real PDF has been dropped in
 * `public/downloads/{slug}/datasheet-{locale}.pdf`. Returns null (not a fabricated link)
 * when the file doesn't exist yet, so the UI can fall back to an "available on request" state.
 */
export function getDatasheetHref(slug: string, locale: RichLocale): string | null {
  const fileName = `datasheet-${locale}.pdf`;
  const absolutePath = path.join(process.cwd(), "public", "downloads", slug, fileName);
  return fs.existsSync(absolutePath) ? `/downloads/${slug}/${fileName}` : null;
}
