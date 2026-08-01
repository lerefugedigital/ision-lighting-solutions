declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires a GA4 event; no-ops during SSR or if gtag hasn't loaded yet (e.g. consent pending). */
export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/**
 * Fires the standardized GA4 "generate_lead" conversion event on every successful
 * form submission across the site (ContactForm, DatasheetDownloadModal, CadRequestModal,
 * TestSampleTunnel) — `lead_category` carries the silo (eclairages, equivalences,
 * cablage-integration, guides-optiques, test-sur-echantillon, general) so leads can be
 * segmented by content silo in GA4/Ads reporting, independent from the more granular
 * `form_type` used for internal funnel analysis.
 */
export function trackLeadGenerated(params: {
  silo: string;
  formType: string;
  subject?: string;
  locale: string;
  sourceUrl?: string;
}) {
  trackEvent("generate_lead", {
    lead_category: params.silo,
    form_type: params.formType,
    ...(params.subject ? { form_subject: params.subject } : {}),
    locale: params.locale,
    ...(params.sourceUrl ? { source_url: params.sourceUrl } : {}),
  });
}
