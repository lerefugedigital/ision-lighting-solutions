import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";
import { ARTICLE } from "./page";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "M12 5-pin A-coded wiring diagram — Vision Lighting Solutions";

const EYEBROW: Record<Locale, string> = {
  en: "WIRING GUIDE",
  fr: "GUIDE DE CÂBLAGE",
  de: "VERKABELUNGSLEITFADEN",
  it: "GUIDA AL CABLAGGIO",
};

/** Same wire colors as the interactive tool, same clockwise A-coded layout, pin 1 at 12 o'clock. */
const PIN_COLORS = ["#a16207", "#e2e8f0", "#2563eb", "#0f172a", "#9ca3af"];

function pinPosition(index: number, center: number, radius: number) {
  const angleDeg = 90 - index * 72;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(angleRad),
    y: center - radius * Math.sin(angleRad),
  };
}

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const title = ARTICLE[locale].h1;
  const eyebrow = EYEBROW[locale];

  const connectorSize = 340;
  const center = connectorSize / 2;

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
            <div style={{ display: "flex", marginTop: 24, fontSize: 52, fontWeight: 800, lineHeight: 1.15 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 24, color: "#94a3b8" }}>
              M12 5-Pin · A-Coded · vision-lighting-solutions.com
            </div>
          </div>

          {/* Stylized M12 connector */}
          <div
            style={{
              position: "relative",
              width: connectorSize,
              height: connectorSize,
              display: "flex",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: connectorSize,
                height: connectorSize,
                borderRadius: 999,
                backgroundImage: "linear-gradient(135deg, #94a3b8 0%, #475569 100%)",
                display: "flex",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 30,
                width: connectorSize - 60,
                height: connectorSize - 60,
                borderRadius: 999,
                backgroundImage: "linear-gradient(160deg, #1e293b 0%, #020617 100%)",
                border: "3px solid #334155",
                display: "flex",
              }}
            />
            {PIN_COLORS.map((color, i) => {
              const { x, y } = pinPosition(i, center, 92);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x - 17,
                    top: y - 17,
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    backgroundColor: color,
                    border: "2px solid #0f172a",
                    display: "flex",
                  }}
                />
              );
            })}
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
