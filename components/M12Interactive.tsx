"use client";

import { useState } from "react";

export interface M12PinInfo {
  number: 1 | 2 | 3 | 4 | 5;
  wireColorName: string;
  wireColorHex: string;
  signal: string;
  role: string;
  pitfall: string;
}

export interface M12InteractiveLabels {
  ariaLabel: string;
  columnPin: string;
  columnWire: string;
  columnSignal: string;
  pitfallLabel: string;
  emptyStatePrompt: string;
}

interface M12InteractiveProps {
  pins: M12PinInfo[];
  labels: M12InteractiveLabels;
}

const CENTER = 110;
const PIN_RADIUS_FROM_CENTER = 74;

/** Pin 1 at 12 o'clock, then clockwise for pins 2-5 — matches the standard
 *  M12 5-pin A-coded layout used across sensor/lighting vendor datasheets. */
function pinPosition(index: number) {
  const angleDeg = 90 - index * 72;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + PIN_RADIUS_FROM_CENTER * Math.cos(angleRad),
    y: CENTER - PIN_RADIUS_FROM_CENTER * Math.sin(angleRad),
  };
}

export function M12Interactive({ pins, labels }: M12InteractiveProps) {
  const [activePin, setActivePin] = useState<number | null>(null);
  const active = pins.find((p) => p.number === activePin) ?? null;

  return (
    <div className="grid gap-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[220px_1fr] sm:p-8">
      <svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label={labels.ariaLabel} className="mx-auto shrink-0">
        <defs>
          <radialGradient id="m12-body" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="60%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>
          <radialGradient id="m12-face" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>

        {/* Knurled coupling nut */}
        <circle cx={CENTER} cy={CENTER} r="104" fill="url(#m12-body)" stroke="#475569" strokeWidth="2" />
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i * 360) / 28;
          const rad = (a * Math.PI) / 180;
          const x1 = CENTER + 104 * Math.cos(rad);
          const y1 = CENTER - 104 * Math.sin(rad);
          const x2 = CENTER + 96 * Math.cos(rad);
          const y2 = CENTER - 96 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="1.5" opacity="0.5" />;
        })}

        {/* A-code keyway marker */}
        <rect x={CENTER - 8} y="206" width="16" height="10" rx="2" fill="#334155" />

        {/* Connector face (male, pin side) */}
        <circle cx={CENTER} cy={CENTER} r="88" fill="url(#m12-face)" stroke="#334155" strokeWidth="2" />

        {pins.map((pin, i) => {
          const { x, y } = pinPosition(i);
          const isActive = activePin === pin.number;
          return (
            <g
              key={pin.number}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`Pin ${pin.number}: ${pin.signal}`}
              onMouseEnter={() => setActivePin(pin.number)}
              onFocus={() => setActivePin(pin.number)}
              onClick={() => setActivePin(pin.number)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActivePin(pin.number);
                }
              }}
              className="cursor-pointer outline-none"
            >
              {isActive && <circle cx={x} cy={y} r="18" fill={pin.wireColorHex} opacity="0.35" />}
              <circle
                cx={x}
                cy={y}
                r="11"
                fill={isActive ? pin.wireColorHex : "#94a3b8"}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
                {pin.number}
              </text>
            </g>
          );
        })}
      </svg>

      <div>
        <div
          className="min-h-[104px] rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
          aria-live="polite"
        >
          {active ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{ backgroundColor: active.wireColorHex }}
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Pin {active.number} — {active.wireColorName} — {active.signal}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{active.role}</p>
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                <strong>{labels.pitfallLabel}</strong> {active.pitfall}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">{labels.emptyStatePrompt}</p>
          )}
        </div>

        <table className="mt-5 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th className="py-2 pr-3">{labels.columnPin}</th>
              <th className="py-2 pr-3">{labels.columnWire}</th>
              <th className="py-2">{labels.columnSignal}</th>
            </tr>
          </thead>
          <tbody>
            {pins.map((pin) => {
              const isActive = activePin === pin.number;
              return (
                <tr
                  key={pin.number}
                  tabIndex={0}
                  onMouseEnter={() => setActivePin(pin.number)}
                  onFocus={() => setActivePin(pin.number)}
                  onClick={() => setActivePin(pin.number)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActivePin(pin.number);
                    }
                  }}
                  className={
                    "cursor-pointer border-b border-slate-100 outline-none transition dark:border-slate-800 " +
                    (isActive ? "bg-amber-50 dark:bg-amber-950/30" : "hover:bg-slate-100 dark:hover:bg-slate-800/60")
                  }
                >
                  <td className="py-2 pr-3 font-semibold text-slate-900 dark:text-slate-100">{pin.number}</td>
                  <td className="py-2 pr-3">
                    <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: pin.wireColorHex }}
                        aria-hidden="true"
                      />
                      {pin.wireColorName}
                    </span>
                  </td>
                  <td className="py-2 text-slate-700 dark:text-slate-300">{pin.signal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
