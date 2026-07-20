import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";
import { ARTICLE } from "./page";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Keyence camera compatibility — Vision Lighting Solutions";

const EYEBROW: Record<Locale, string> = {
  en: "COMPATIBILITY GUIDE",
  fr: "GUIDE DE COMPATIBILITÉ",
  de: "KOMPATIBILITÄTSLEITFADEN",
  it: "GUIDA ALLA COMPATIBILITÀ",
};

const SERIES_LABELS = ["CV-X Series", "XG-X Series", "IV Series", "SR-2000 Series"];

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const title = ARTICLE[locale].h1;
  const eyebrow = EYEBROW[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#020617",
          backgroundImage: "linear-gradient(135deg, #0f172a 0%, #020617 65%)",
          fontFamily: "sans-serif",
          color: "#f8fafc",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#d97706",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: "#020617" }} />
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>Vision Lighting Solutions</span>
        </div>

        {/* Main content row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "6px 14px",
                borderRadius: 999,
                backgroundColor: "rgba(217,119,6,0.16)",
                color: "#fbbf24",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              {eyebrow}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 46, fontWeight: 800, lineHeight: 1.15 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 24, color: "#94a3b8" }}>
              Keyence CV-X, XG-X &amp; SR-2000 · vision-lighting-solutions.com
            </div>
          </div>

          {/* Camera series stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
            {SERIES_LABELS.map((label, i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: 300,
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: i === 0 ? "2px solid #d97706" : "1px solid #334155",
                  backgroundColor: i === 0 ? "rgba(217,119,6,0.12)" : "#0f172a",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    backgroundColor: i === 0 ? "#fbbf24" : "#475569",
                    display: "flex",
                  }}
                />
                <span style={{ fontSize: 22, fontWeight: 600, color: i === 0 ? "#fbbf24" : "#cbd5e1" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer divider */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, backgroundColor: "#1e293b", marginBottom: 20 }} />
          <div style={{ display: "flex", fontSize: 20, color: "#64748b" }}>
            Machine Vision Lighting · Wiring &amp; Integration Guides
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
