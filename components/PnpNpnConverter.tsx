"use client";

import { useState } from "react";

export type PnpNpnMode = "pnp" | "npn";

export interface PnpNpnModeInfo {
  mode: PnpNpnMode;
  toggleLabel: string;
  sourceSignal: string;
  convertedSignal: string;
  explanation: string;
}

export interface PnpNpnConverterLabels {
  cameraOutputLabel: string;
  converterLabel: string;
  lightPinLabel: string;
  activeStateLabel: string;
}

interface PnpNpnConverterProps {
  modes: [PnpNpnModeInfo, PnpNpnModeInfo];
  labels: PnpNpnConverterLabels;
}

export function PnpNpnConverter({ modes, labels }: PnpNpnConverterProps) {
  const [activeMode, setActiveMode] = useState<PnpNpnMode>("pnp");
  const current = modes.find((m) => m.mode === activeMode) ?? modes[0];
  const wireColor = activeMode === "pnp" ? "#d97706" : "#2563eb";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      {/* Toggle */}
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m.mode}
            type="button"
            aria-pressed={activeMode === m.mode}
            onClick={() => setActiveMode(m.mode)}
            className={
              "flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition outline-none " +
              (activeMode === m.mode
                ? "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-amber-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300")
            }
          >
            {m.toggleLabel}
          </button>
        ))}
      </div>

      {/* Diagram */}
      <div className="mt-8 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-wide text-slate-400">{labels.cameraOutputLabel}</p>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{current.sourceSignal}</p>
        </div>

        <div className="flex flex-col items-center gap-1 px-1">
          <div className="h-0.5 w-6 sm:w-10" style={{ backgroundColor: wireColor }} />
          <span className="text-lg" style={{ color: wireColor }}>
            →
          </span>
        </div>

        <div className="flex-1 rounded-xl border-2 p-4 text-center" style={{ borderColor: wireColor }}>
          <p className="text-xs uppercase tracking-wide text-slate-400">{labels.converterLabel}</p>
          <p className="mt-2 text-sm font-semibold" style={{ color: wireColor }}>
            {activeMode === "pnp" ? "PNP → NPN" : "NPN → PNP"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 px-1">
          <div className="h-0.5 w-6 sm:w-10" style={{ backgroundColor: wireColor }} />
          <span className="text-lg" style={{ color: wireColor }}>
            →
          </span>
        </div>

        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-wide text-slate-400">{labels.lightPinLabel}</p>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{current.convertedSignal}</p>
        </div>
      </div>

      {/* Explanation */}
      <div
        className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        aria-live="polite"
      >
        <strong>{labels.activeStateLabel}</strong> {current.explanation}
      </div>
    </div>
  );
}
