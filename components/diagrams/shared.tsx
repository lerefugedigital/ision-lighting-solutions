import type { ReactNode } from "react";

/** Shared industrial-dark palette for every optical diagram, independent of site light/dark mode
 *  (like a permanently dark "scope" panel) so colored rays keep consistent, strong contrast. */
export const DIAGRAM_COLORS = {
  bg: "#0b1220",
  border: "#1e293b",
  surface: "#64748b",
  body: "#334155",
  camera: "#e2e8f0",
  incident: "#3b82f6",
  reflected: "#22c55e",
  transmitted: "#22c55e",
  amber: "#fbbf24",
  blocked: "#ef4444",
  text: "#94a3b8",
} as const;

export function DiagramFrame({
  viewBox,
  ariaLabel,
  caption,
  children,
}: {
  viewBox: string;
  ariaLabel: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">
      <svg viewBox={viewBox} role="img" aria-label={ariaLabel} className="h-auto w-full">
        {children}
      </svg>
      {caption && <p className="mt-3 text-center text-xs text-slate-400">{caption}</p>}
    </div>
  );
}

export function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill={color} />
    </marker>
  );
}

export function CameraGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-16} y={-10} width={32} height={20} rx={3} fill={DIAGRAM_COLORS.camera} />
      <rect x={-6} y={-17} width={12} height={7} rx={1} fill={DIAGRAM_COLORS.camera} />
      <circle cx={0} cy={0} r={7} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.camera} strokeWidth={2} />
      <circle cx={0} cy={0} r={2.5} fill={DIAGRAM_COLORS.camera} />
    </g>
  );
}
