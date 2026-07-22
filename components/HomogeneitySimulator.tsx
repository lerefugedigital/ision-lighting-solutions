"use client";

import { useId, useState } from "react";

export type HomogeneityVariant = "standard" | "premium";

const ORDER: HomogeneityVariant[] = ["standard", "premium"];

/** Builds a gear silhouette (teeth ring + center hole) as a single evenodd path — a stand-in for a
 *  threaded mechanical part / gear, the kind of contour a backlight is used to measure. */
function buildGearPath(cx: number, cy: number, outerR: number, innerR: number, teeth: number, holeR: number): string {
  const points: string[] = [];
  const step = Math.PI / teeth;
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const outline = `${points.join(" ")} Z`;
  const hole = `M${(cx - holeR).toFixed(1)},${cy} A${holeR},${holeR} 0 1 0 ${(cx + holeR).toFixed(1)},${cy} A${holeR},${holeR} 0 1 0 ${(cx - holeR).toFixed(1)},${cy} Z`;
  return `${outline} ${hole}`;
}

const GEAR_PATH = buildGearPath(200, 112, 72, 58, 10, 24);

interface VariantText {
  toggleLabel: string;
  visualCaption: string;
  chartCaption: string;
}

interface HomogeneityText {
  title: string;
  intro: string;
  chartTitle: string;
  variants: Record<HomogeneityVariant, VariantText>;
}

const TEXT: Record<"en" | "fr", HomogeneityText> = {
  en: {
    title: "Why Is > 90% Homogeneity Critical for Your Measurements?",
    intro: "Switch between the two positions to compare the impact on the sharpness of your dimensional measurements.",
    chartTitle: "Light Intensity Profile (horizontal cross-section)",
    variants: {
      standard: {
        toggleLabel: "Standard / Entry-Level Backlight (Hotspot Effect)",
        visualCaption: "Central hotspot + blurred edges → inaccurate measurements.",
        chartCaption: "Intensity drops at the edges — bell-curve effect.",
      },
      premium: {
        toggleLabel: "Vision Lighting Backlight (Diffuse Homogeneity > 90%)",
        visualCaption: "100% uniform background + crisp edges → pixel-accurate measurements.",
        chartCaption: "Constant intensity ≈ 98% across the full width.",
      },
    },
  },
  fr: {
    title: "Pourquoi l'homogénéité > 90% est critique pour vos mesures ?",
    intro: "Basculez entre les deux positions pour comparer l'impact sur la netteté de vos mesures dimensionnelles.",
    chartTitle: "Profil d'intensité lumineuse (coupe horizontale)",
    variants: {
      standard: {
        toggleLabel: "Backlight standard / bas de gamme (Effet Hotspot)",
        visualCaption: "Point chaud central + contours flous → mesures imprécises.",
        chartCaption: "Chute d'intensité sur les bords — effet en cloche.",
      },
      premium: {
        toggleLabel: "Backlight Vision Lighting (Homogénéité diffuse > 90%)",
        visualCaption: "Fond 100% uniforme + contours nets → mesures fiables au pixel près.",
        chartCaption: "Intensité constante ≈ 98% sur toute la largeur.",
      },
    },
  },
};

export interface HomogeneitySimulatorProps {
  locale: "en" | "fr";
  /** Heading level for the section title — "h3" when nested under a parent H2 (e.g. a specs section). Defaults to "h2". */
  headingLevel?: "h2" | "h3";
}

export function HomogeneitySimulator({ locale, headingLevel = "h2" }: HomogeneitySimulatorProps) {
  const [variant, setVariant] = useState<HomogeneityVariant>("standard");
  const uid = useId();
  const t = TEXT[locale];
  const v = t.variants[variant];
  const isStandard = variant === "standard";

  const gradientId = `homog-hotspot-${uid}`;
  const blurId = `homog-blur-${uid}`;
  const Heading = headingLevel;
  const headingClasses =
    headingLevel === "h3"
      ? "text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
      : "text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
      <Heading className={headingClasses}>{t.title}</Heading>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{t.intro}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        {ORDER.map((key) => {
          const active = variant === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setVariant(key)}
              aria-pressed={active}
              className={`flex-1 rounded-xl border p-3 text-left text-sm font-medium transition ${
                active
                  ? "border-amber-500 bg-amber-50 text-slate-900 dark:border-amber-500 dark:bg-amber-950/20 dark:text-slate-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-amber-700"
              }`}
            >
              {t.variants[key].toggleLabel}
            </button>
          );
        })}
      </div>

      <div key={variant} className="animate-fade-in mt-6 rounded-2xl border border-slate-800 bg-[#0b1220] p-4 sm:p-6">
        <svg viewBox="0 0 400 220" role="img" aria-label={v.visualCaption} className="h-auto w-full">
          <defs>
            <radialGradient id={gradientId} cx="50%" cy="46%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fde68a" />
              <stop offset="65%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
            <filter id={blurId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
          </defs>

          <rect
            x={10}
            y={10}
            width={380}
            height={200}
            rx={10}
            fill={isStandard ? `url(#${gradientId})` : "#ffffff"}
            stroke="#1e293b"
            strokeWidth={2}
          />

          {isStandard && <circle cx={200} cy={100} r={55} fill="#fffbeb" opacity={0.35} />}

          <path
            d={GEAR_PATH}
            fillRule="evenodd"
            fill={isStandard ? "#475569" : "#0f172a"}
            fillOpacity={isStandard ? 0.78 : 1}
            filter={isStandard ? `url(#${blurId})` : undefined}
          />
        </svg>
        <p className="mt-3 text-center text-xs text-slate-400">{v.visualCaption}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-[#0b1220] p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.chartTitle}</p>
        <svg viewBox="0 0 400 90" role="img" aria-label={v.chartCaption} className="mt-2 h-auto w-full">
          <line x1={20} y1={18} x2={380} y2={18} stroke="#334155" strokeWidth={1} strokeDasharray="4 3" />
          <line x1={20} y1={78} x2={380} y2={78} stroke="#334155" strokeWidth={1.5} />
          {isStandard ? (
            <path
              d="M20,64 C90,64 90,16 200,16 C310,16 310,64 380,64"
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          ) : (
            <path d="M20,18 L380,18" fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" />
          )}
          <text x={200} y={12} textAnchor="middle" fontSize={9} fill="#94a3b8">
            100%
          </text>
          <text x={200} y={88} textAnchor="middle" fontSize={9} fill="#94a3b8">
            0%
          </text>
        </svg>
        <p className="mt-2 text-center text-xs text-slate-400">{v.chartCaption}</p>
      </div>
    </div>
  );
}
