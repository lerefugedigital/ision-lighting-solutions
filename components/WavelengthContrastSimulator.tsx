"use client";

import { useId, useState } from "react";

type WavelengthKey = "red" | "blue" | "ir" | "uv" | "white";
type SampleKey = "bottle" | "pcb";

const WAVELENGTH_ORDER: WavelengthKey[] = ["red", "blue", "ir", "uv", "white"];
const SAMPLE_ORDER: SampleKey[] = ["bottle", "pcb"];

const SWATCH: Record<WavelengthKey, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  ir: "#7f1d1d",
  uv: "#8b5cf6",
  white: "#e2e8f0",
};

interface SimulatorText {
  title: string;
  intro: string;
  wavelengthLabels: Record<WavelengthKey, string>;
  sampleLabels: Record<SampleKey, string>;
  explanations: Record<SampleKey, Record<WavelengthKey, string>>;
}

const TEXT: Record<"en" | "fr", SimulatorText> = {
  en: {
    title: "Optical Contrast Simulator: Pick the Right Wavelength",
    intro: "Select a light color and a sample to see how wavelength choice reveals — or hides — a feature for the camera.",
    wavelengthLabels: {
      red: "Red (630 nm)",
      blue: "Blue (470 nm)",
      ir: "Infrared (850 nm)",
      uv: "UV (365 nm)",
      white: "White (5700 K)",
    },
    sampleLabels: {
      bottle: "Dark Plastic Bottle with Liquid Level",
      pcb: "Printed Circuit Board (PCB) with Conformal Coating & Silkscreen",
    },
    explanations: {
      bottle: {
        red: "Red light is largely absorbed or scattered by the dark pigmented plastic: the liquid level stays invisible, and the bottle appears as a uniform opaque silhouette.",
        blue: "Blue is absorbed even more strongly by dark pigments than red, so the bottle likewise stays fully opaque and the level remains invisible.",
        ir: "Infrared (850 nm) passes through dark, opaque plastics to reveal light transmission through the liquid, making the fill level appear with maximum sharpness.",
        uv: "UV is almost completely blocked by the dark plastic material: no transmission is possible, and the liquid level stays invisible.",
        white: "As with red or blue visible light, white does not penetrate the dark material: the bottle's contents remain invisible to the camera.",
      },
      pcb: {
        red: "Under standard red light the board renders with neutral contrast: substrate, copper traces and silkscreen are all visible without any feature being emphasized.",
        blue: "Blue is strongly absorbed by the green solder mask and well reflected by bare copper, sharply bringing out the conductive traces for inspection.",
        ir: "Infrared slightly penetrates dark resins and can reveal elements beneath certain opaque coatings, but adds little extra contrast on standard copper or silkscreen.",
        uv: "The UV-reactive conformal coating fluoresces under 365 nm excitation, instantly revealing poorly coated areas, bubbles or coating gaps invisible under visible light.",
        white: "White reproduces the board's natural visual appearance — a useful colorimetric reference, but without emphasizing any specific defect.",
      },
    },
  },
  fr: {
    title: "Simulateur de Contraste Optique : Choisissez la Bonne Longueur d'Onde",
    intro: "Sélectionnez une couleur d'éclairage et un échantillon pour voir comment la longueur d'onde fait ressortir — ou masque — un détail pour la caméra.",
    wavelengthLabels: {
      red: "Rouge (630 nm)",
      blue: "Bleu (470 nm)",
      ir: "Infrarouge (850 nm)",
      uv: "UV (365 nm)",
      white: "Blanc (5700 K)",
    },
    sampleLabels: {
      bottle: "Flacon Plastique Sombre avec Niveau de Liquide",
      pcb: "Circuit Imprimé (PCB) avec Vernis & Sérigraphie",
    },
    explanations: {
      bottle: {
        red: "Le rouge est en grande partie absorbé ou diffusé par le plastique pigmenté sombre : le niveau de liquide reste invisible, le flacon apparaît comme une silhouette opaque uniforme.",
        blue: "Le bleu, encore plus absorbé par les pigments sombres que le rouge, laisse également le flacon totalement opaque et le niveau invisible.",
        ir: "L'infrarouge (850 nm) traverse les matières plastiques sombres et opaques pour révéler la transmission lumineuse à travers le liquide, faisant apparaître le niveau de remplissage avec une netteté maximale.",
        uv: "L'UV est presque totalement bloqué par la matière plastique sombre : aucune transmission n'est possible, le niveau de liquide reste invisible.",
        white: "Comme en lumière visible rouge ou bleue, le blanc ne pénètre pas la matière sombre : le contenu du flacon reste invisible pour la caméra.",
      },
      pcb: {
        red: "En rouge standard, le circuit apparaît avec un contraste neutre : substrat, pistes cuivre et sérigraphie sont visibles sans mise en avant particulière.",
        blue: "Le bleu est fortement absorbé par le vernis épargne vert et bien réfléchi par le cuivre nu, ce qui fait ressortir nettement les pistes conductrices pour l'inspection.",
        ir: "L'infrarouge pénètre légèrement les résines sombres et peut révéler des éléments situés sous certains revêtements opaques, mais apporte peu de contraste supplémentaire sur le cuivre ou la sérigraphie standard.",
        uv: "Le vernis de protection réactif aux UV fluoresce sous excitation 365 nm, révélant instantanément les zones mal recouvertes, les bulles ou les manques de vernis invisibles en lumière visible.",
        white: "Le blanc reproduit le rendu visuel naturel du circuit — une référence colorimétrique utile, mais sans mise en avant d'un défaut particulier.",
      },
    },
  },
};

const BOTTLE_OPAQUE_FILL: Record<WavelengthKey, string> = {
  red: "#3f1d1d",
  blue: "#1e2a45",
  ir: "#e2e8f0",
  uv: "#150c24",
  white: "#27303f",
};

function BottleVisual({ wavelength, filterId }: { wavelength: WavelengthKey; filterId: string }) {
  const reveal = wavelength === "ir";
  const fill = BOTTLE_OPAQUE_FILL[wavelength];

  return (
    <>
      <defs>
        <clipPath id={filterId}>
          <rect x={150} y={70} width={100} height={150} rx={14} />
        </clipPath>
      </defs>

      {/* Bottle neck */}
      <rect x={182} y={45} width={36} height={28} rx={4} fill={reveal ? "#e2e8f0" : fill} />
      {/* Bottle body */}
      <rect x={150} y={70} width={100} height={150} rx={14} fill={fill} stroke="#334155" strokeWidth={2} />

      {reveal && (
        <g clipPath={`url(#${filterId})`}>
          <rect x={140} y={150} width={120} height={80} fill="#020617" />
          <line x1={150} y1={150} x2={250} y2={150} stroke="#020617" strokeWidth={4} />
        </g>
      )}

      <text x={200} y={244} textAnchor="middle" fontSize={11} fill="#94a3b8">
        {reveal ? "≈ 55%" : "?"}
      </text>
    </>
  );
}

function PcbVisual({ wavelength, filterId }: { wavelength: WavelengthKey; filterId: string }) {
  const highlightTraces = wavelength === "blue";
  const fluoresce = wavelength === "uv";
  const dimTraces = wavelength === "ir";

  const boardFill = fluoresce ? "#1e1033" : highlightTraces ? "#0f2a1c" : "#14532d";
  const traceStroke = highlightTraces ? "#fde047" : fluoresce ? "#4c1d95" : "#94a3b8";
  const traceWidth = highlightTraces ? 3.5 : 2;
  const traceOpacity = fluoresce ? 0.2 : dimTraces ? 0.45 : 0.9;

  const traceY = [70, 100, 130, 160];

  return (
    <>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <rect x={60} y={40} width={280} height={180} rx={10} fill={boardFill} stroke="#0b1220" strokeWidth={2} />

      {traceY.map((y) => (
        <line
          key={y}
          x1={90}
          y1={y}
          x2={310}
          y2={y}
          stroke={traceStroke}
          strokeWidth={traceWidth}
          strokeOpacity={traceOpacity}
          strokeLinecap="round"
        />
      ))}

      {/* Component footprints */}
      <rect x={90} y={185} width={36} height={20} rx={2} fill="#0b1220" stroke="#475569" strokeWidth={1.5} opacity={fluoresce ? 0.4 : 1} />
      <rect x={270} y={185} width={36} height={20} rx={2} fill="#0b1220" stroke="#475569" strokeWidth={1.5} opacity={fluoresce ? 0.4 : 1} />

      {/* Silkscreen text lines */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={150 + i * 4}
          y1={52 + i * 6}
          x2={190 + i * 4}
          y2={52 + i * 6}
          stroke="#f8fafc"
          strokeWidth={1.5}
          opacity={fluoresce ? 0.3 : 0.85}
        />
      ))}

      {fluoresce && (
        <g filter={`url(#${filterId})`}>
          <ellipse cx={140} cy={110} rx={38} ry={30} fill="#4ade80" opacity={0.55} />
          <ellipse cx={230} cy={90} rx={34} ry={26} fill="#22d3ee" opacity={0.5} />
          <ellipse cx={260} cy={150} rx={30} ry={24} fill="#4ade80" opacity={0.45} />
          {/* Un-fluorescing gap: a coating defect revealed by the absence of glow */}
          <ellipse cx={190} cy={140} rx={16} ry={12} fill="#1e1033" opacity={0.9} />
        </g>
      )}
    </>
  );
}

export interface WavelengthContrastSimulatorProps {
  locale: "en" | "fr";
  /** Heading level for the section title — "h3" when nested under a parent H2 (e.g. a specs section). Defaults to "h2". */
  headingLevel?: "h2" | "h3";
}

export function WavelengthContrastSimulator({ locale, headingLevel = "h2" }: WavelengthContrastSimulatorProps) {
  const [wavelength, setWavelength] = useState<WavelengthKey>("red");
  const [sample, setSample] = useState<SampleKey>("bottle");
  const uid = useId();
  const t = TEXT[locale];
  const explanation = t.explanations[sample][wavelength];
  const Heading = headingLevel;
  const headingClasses =
    headingLevel === "h3"
      ? "text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
      : "text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
      <Heading className={headingClasses}>{t.title}</Heading>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{t.intro}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {WAVELENGTH_ORDER.map((key) => {
          const active = wavelength === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setWavelength(key)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
                active
                  ? "border-amber-500 bg-amber-50 text-slate-900 dark:border-amber-500 dark:bg-amber-950/20 dark:text-slate-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-amber-700"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full border border-slate-400/60 dark:border-slate-500"
                style={{ backgroundColor: SWATCH[key] }}
              />
              {t.wavelengthLabels[key]}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {SAMPLE_ORDER.map((key) => {
          const active = sample === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSample(key)}
              aria-pressed={active}
              className={`flex-1 rounded-xl border p-3 text-left text-sm font-medium transition ${
                active
                  ? "border-amber-500 bg-amber-50 text-slate-900 dark:border-amber-500 dark:bg-amber-950/20 dark:text-slate-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-amber-700"
              }`}
            >
              {t.sampleLabels[key]}
            </button>
          );
        })}
      </div>

      <div key={`${sample}-${wavelength}`} className="animate-fade-in mt-6 rounded-2xl border border-slate-800 bg-[#0b1220] p-4 sm:p-6">
        <svg viewBox="0 0 400 260" role="img" aria-label={explanation} className="h-auto w-full">
          {sample === "bottle" ? (
            <BottleVisual wavelength={wavelength} filterId={`wcs-clip-${uid}`} />
          ) : (
            <PcbVisual wavelength={wavelength} filterId={`wcs-glow-${uid}`} />
          )}
        </svg>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-slate-300">
        {explanation}
      </div>
    </div>
  );
}
