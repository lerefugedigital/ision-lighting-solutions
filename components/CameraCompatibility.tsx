"use client";

import { useState } from "react";

export interface CameraCompatInfo {
  slug: string;
  name: string;
  application: string;
  ioType: string;
  voltage: string;
  wiringNote: string;
}

export interface CameraCompatibilityLabels {
  ioLabel: string;
  voltageLabel: string;
  wiringNoteLabel: string;
  emptyStatePrompt: string;
}

interface CameraCompatibilityProps {
  cameras: CameraCompatInfo[];
  labels: CameraCompatibilityLabels;
}

export function CameraCompatibility({ cameras, labels }: CameraCompatibilityProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = cameras.find((c) => c.slug === activeSlug) ?? null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cameras.map((camera) => {
          const isActive = activeSlug === camera.slug;
          return (
            <button
              key={camera.slug}
              type="button"
              aria-pressed={isActive}
              onMouseEnter={() => setActiveSlug(camera.slug)}
              onFocus={() => setActiveSlug(camera.slug)}
              onClick={() => setActiveSlug(camera.slug)}
              className={
                "rounded-xl border p-4 text-left transition outline-none " +
                (isActive
                  ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30"
                  : "border-slate-200 bg-white hover:border-amber-400 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-amber-500")
              }
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{camera.name}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{camera.application}</p>
            </button>
          );
        })}
      </div>

      <div
        className="mt-6 min-h-[128px] rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950"
        aria-live="polite"
      >
        {active ? (
          <>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{active.name}</p>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">{labels.ioLabel}</dt>
                <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">{active.ioType}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">{labels.voltageLabel}</dt>
                <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">{active.voltage}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <strong>{labels.wiringNoteLabel}</strong> {active.wiringNote}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">{labels.emptyStatePrompt}</p>
        )}
      </div>
    </div>
  );
}
