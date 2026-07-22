"use client";

import { useState } from "react";
import { BeamPatternDiagram, type BeamPatternVariant } from "./diagrams/BeamPatternDiagram";

const ORDER: BeamPatternVariant[] = ["direct", "diffuse", "focused"];

const TEXT = {
  en: {
    title: "Optical Beam Pattern Visualization",
    intro: "Select a beam type to see how the light behaves in cross-section at working distance.",
    items: {
      direct: {
        name: "Standard Direct Beam",
        description:
          "3 LEDs behind standard lenses send lightly collimated, slightly divergent rays that concentrate on a medium-sized zone at working distance.",
      },
      diffuse: {
        name: "Wide Diffuse Beam",
        description:
          "3 LEDs behind an opal diffuser scatter light in many directions, producing wide, homogeneous coverage — ideal for eliminating specular glare.",
      },
      focused: {
        name: "Narrow Focused Beam",
        description:
          "3 LEDs behind high-precision aspheric lenses converge sharply onto a small area, increasing local intensity at the focal point.",
      },
    },
    diagram: {
      direct: {
        ariaLabel:
          "Cross-section diagram: 3 LEDs behind standard lenses producing a slightly divergent beam that concentrates on a medium-sized zone at working distance.",
        ledLabel: "3 LEDs",
        opticLabel: "Standard lens",
        targetLabel: "Working distance",
        zoneLabel: "Medium zone — slightly divergent beam",
      },
      diffuse: {
        ariaLabel:
          "Cross-section diagram: 3 LEDs behind an opal diffuser scattering light widely for homogeneous coverage over a large area.",
        ledLabel: "3 LEDs",
        opticLabel: "Opal diffuser",
        targetLabel: "Working distance",
        zoneLabel: "Wide zone — homogeneous, low glare",
      },
      focused: {
        ariaLabel:
          "Cross-section diagram: 3 LEDs behind aspheric lenses converging sharply onto a narrow focal point, maximizing local intensity.",
        ledLabel: "3 LEDs",
        opticLabel: "Aspheric lens",
        targetLabel: "Working distance",
        zoneLabel: "Narrow focal point — maximum local intensity",
      },
    },
  },
  fr: {
    title: "Visualisation des Faisceaux Optiques",
    intro: "Sélectionnez un type de faisceau pour voir le comportement de la lumière en coupe, à la distance de travail.",
    items: {
      direct: {
        name: "Faisceau Direct Standard",
        description:
          "3 LEDs derrière des lentilles standard envoient des rayons légèrement collimatés et divergents, concentrés sur une zone de taille moyenne à la distance de travail.",
      },
      diffuse: {
        name: "Faisceau Diffus Large",
        description:
          "3 LEDs derrière un diffuseur opale dispersent la lumière dans de nombreuses directions, pour une couverture large et homogène — idéal pour éliminer les reflets spéculaires.",
      },
      focused: {
        name: "Faisceau Focalisé Étroit",
        description:
          "3 LEDs derrière des lentilles asphériques de haute précision convergent précisément sur une petite zone, augmentant l'intensité locale au point focal.",
      },
    },
    diagram: {
      direct: {
        ariaLabel:
          "Schéma en coupe : 3 LEDs derrière des lentilles standard produisant un faisceau légèrement divergent concentré sur une zone de taille moyenne à la distance de travail.",
        ledLabel: "3 LEDs",
        opticLabel: "Lentille standard",
        targetLabel: "Distance de travail",
        zoneLabel: "Zone moyenne — faisceau légèrement divergent",
      },
      diffuse: {
        ariaLabel:
          "Schéma en coupe : 3 LEDs derrière un diffuseur opale dispersant la lumière largement pour une couverture homogène sur une grande zone.",
        ledLabel: "3 LEDs",
        opticLabel: "Diffuseur opale",
        targetLabel: "Distance de travail",
        zoneLabel: "Zone large — homogène, faibles reflets",
      },
      focused: {
        ariaLabel:
          "Schéma en coupe : 3 LEDs derrière des lentilles asphériques convergeant précisément sur un point focal étroit, maximisant l'intensité locale.",
        ledLabel: "3 LEDs",
        opticLabel: "Lentille asphérique",
        targetLabel: "Distance de travail",
        zoneLabel: "Point focal étroit — intensité locale maximale",
      },
    },
  },
} as const;

export function BeamPatternViewer({ locale, titleOverride }: { locale: "en" | "fr"; titleOverride?: string }) {
  const [variant, setVariant] = useState<BeamPatternVariant>("direct");
  const t = TEXT[locale];

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{titleOverride ?? t.title}</h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 print:hidden">{t.intro}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-3 print:hidden">
          {ORDER.map((key) => {
            const item = t.items[key];
            const active = variant === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setVariant(key)}
                aria-pressed={active}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/20"
                    : "border-slate-200 bg-white hover:border-amber-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-amber-700"
                }`}
              >
                <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</span>
              </button>
            );
          })}
        </div>

        <div key={variant} className="animate-fade-in">
          <BeamPatternDiagram variant={variant} labels={t.diagram[variant]} />
        </div>
      </div>
    </section>
  );
}
