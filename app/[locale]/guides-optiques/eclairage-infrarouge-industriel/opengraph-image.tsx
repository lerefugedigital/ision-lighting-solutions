import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";
import { META_TITLES } from "./og-titles";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Industrial infrared lighting guide — Vision Lighting Solutions";

const EYEBROW: Record<Locale, string> = {
  en: "OPTICAL GUIDE",
  fr: "GUIDE OPTIQUE",
  de: "OPTISCHER LEITFADEN",
  it: "GUIDA OTTICA",
};

const SPECTRUM = ["#7c3aed", "#2563eb", "#16a34a", "#eab308", "#f97316", "#dc2626"];

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

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}>
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
          <div style={{ display: "flex", marginTop: 24, fontSize: 46, fontWeight: 800, lineHeight: 1.15 }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 24, color: "#94a3b8" }}>
            850-940nm · vision-lighting-solutions.com
          </div>

          {/* Spectrum bar: visible band + highlighted invisible IR band */}
          <div style={{ display: "flex", marginTop: 40, height: 56, width: "100%", borderRadius: 10, overflow: "hidden" }}>
            {SPECTRUM.map((color) => (
              <div key={color} style={{ display: "flex", flex: 1, backgroundColor: color }} />
            ))}
            <div
              style={{
                display: "flex",
                flex: 1.6,
                backgroundColor: "#1e293b",
                border: "2px solid #fbbf24",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                color: "#fbbf24",
              }}
            >
              IR
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, backgroundColor: "#1e293b", marginBottom: 20 }} />
          <div style={{ display: "flex", fontSize: 20, color: "#64748b" }}>
            Machine Vision Lighting · Optical & Application Guides
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
