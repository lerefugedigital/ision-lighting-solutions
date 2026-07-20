import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";
import { META_TITLES } from "./og-titles";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LED spotlights and floodlights for machine vision — Vision Lighting Solutions";

const EYEBROW: Record<Locale, string> = {
  en: "PRODUCT RANGE",
  fr: "GAMME PRODUIT",
  de: "PRODUKTREIHE",
  it: "GAMMA PRODOTTO",
};

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const title = META_TITLES[locale];

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
              {EYEBROW[locale]}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 44, fontWeight: 800, lineHeight: 1.15 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 24, color: "#94a3b8" }}>
              24VDC · M12 · vision-lighting-solutions.com
            </div>
          </div>

          {/* Spotlight visualization: housing with concentric beam-spread rings */}
          <div style={{ position: "relative", display: "flex", width: 260, height: 260, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                left: 5,
                top: 5,
                width: 250,
                height: 250,
                borderRadius: 999,
                border: "1px solid rgba(217,119,6,0.2)",
                display: "flex",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 45,
                top: 45,
                width: 170,
                height: 170,
                borderRadius: 999,
                border: "1px solid rgba(217,119,6,0.4)",
                display: "flex",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 85,
                top: 85,
                width: 90,
                height: 90,
                borderRadius: 999,
                backgroundColor: "#fbbf24",
                display: "flex",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, backgroundColor: "#1e293b", marginBottom: 20 }} />
          <div style={{ display: "flex", fontSize: 20, color: "#64748b" }}>
            Machine Vision Lighting · Industrial LED Product Range
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
