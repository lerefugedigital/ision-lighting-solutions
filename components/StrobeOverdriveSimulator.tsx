"use client";

import { useState } from "react";

export interface StrobeOverdriveLabels {
  pulseWidthLabel: string;
  frequencyLabel: string;
  periodLabel: string;
  dutyCycleLabel: string;
  onLabel: string;
  offLabel: string;
  safeMessage: string;
  /** Contains a "{threshold}" token, replaced with the numeric percent at render time. */
  warningMessage: string;
  thresholdNote: string;
}

interface StrobeOverdriveSimulatorProps {
  labels: StrobeOverdriveLabels;
  /** Conservative default; the actual limit always depends on the light's datasheet. */
  safeThresholdPercent?: number;
}

export function StrobeOverdriveSimulator({ labels, safeThresholdPercent = 10 }: StrobeOverdriveSimulatorProps) {
  const [pulseWidthMs, setPulseWidthMs] = useState(0.5);
  const [frequencyHz, setFrequencyHz] = useState(50);

  const periodMs = 1000 / frequencyHz;
  const dutyCyclePercent = Math.min(100, (pulseWidthMs / periodMs) * 100);
  const isSafe = dutyCyclePercent <= safeThresholdPercent;
  const onWidthPercent = Math.min(100, dutyCyclePercent);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {labels.pulseWidthLabel}: <strong>{pulseWidthMs.toFixed(2)} ms</strong>
          </span>
          <input
            type="range"
            min={0.05}
            max={5}
            step={0.05}
            value={pulseWidthMs}
            onChange={(e) => setPulseWidthMs(Number(e.target.value))}
            className="mt-2 w-full accent-amber-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {labels.frequencyLabel}: <strong>{frequencyHz} Hz</strong>
          </span>
          <input
            type="range"
            min={1}
            max={500}
            step={1}
            value={frequencyHz}
            onChange={(e) => setFrequencyHz(Number(e.target.value))}
            className="mt-2 w-full accent-amber-500"
          />
        </label>
      </div>

      {/* Pulse train visualization */}
      <div className="mt-8">
        <div className="flex h-10 w-full overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
          <div
            className="flex h-full items-center justify-center bg-amber-500 text-xs font-semibold text-slate-950"
            style={{ width: `${onWidthPercent}%` }}
          >
            {onWidthPercent > 12 ? labels.onLabel : ""}
          </div>
          <div className="flex h-full flex-1 items-center justify-center bg-slate-200 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {100 - onWidthPercent > 12 ? labels.offLabel : ""}
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">{labels.periodLabel}: {periodMs.toFixed(2)} ms</p>
      </div>

      {/* Result */}
      <div
        className={
          "mt-6 rounded-xl border p-5 " +
          (isSafe
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
            : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20")
        }
        aria-live="polite"
      >
        <p
          className={
            "text-lg font-semibold " + (isSafe ? "text-emerald-900 dark:text-emerald-300" : "text-red-900 dark:text-red-300")
          }
        >
          {labels.dutyCycleLabel}: {dutyCyclePercent.toFixed(2)}%
        </p>
        <p className={"mt-2 text-sm leading-relaxed " + (isSafe ? "text-emerald-800/90 dark:text-emerald-300/90" : "text-red-800/90 dark:text-red-300/90")}>
          {isSafe
            ? labels.safeMessage
            : labels.warningMessage.replace("{threshold}", String(safeThresholdPercent))}
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{labels.thresholdNote}</p>
      </div>
    </div>
  );
}
