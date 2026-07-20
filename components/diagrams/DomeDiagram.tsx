"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker, CameraGlyph } from "./shared";

export interface DomeDiagramLabels {
  ariaLabel: string;
  dome: string;
  object: string;
  camera: string;
  caption?: string;
}

const DOME_RAY_ORIGINS: Array<{ x: number; y: number; color: "incident" | "reflected" }> = [
  { x: 70, y: 175, color: "incident" },
  { x: 115, y: 95, color: "reflected" },
  { x: 285, y: 95, color: "incident" },
  { x: 330, y: 175, color: "reflected" },
];

export function DomeDiagram({ labels }: { labels: DomeDiagramLabels }) {
  const uid = useId();
  const incidentArrow = `dm-incident-${uid}`;
  const reflectedArrow = `dm-reflected-${uid}`;

  return (
    <DiagramFrame viewBox="0 0 400 260" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={incidentArrow} color={DIAGRAM_COLORS.incident} />
        <ArrowMarker id={reflectedArrow} color={DIAGRAM_COLORS.reflected} />
      </defs>

      {/* Dome shell */}
      <path
        d="M 55 190 A 145 145 0 0 1 345 190"
        fill="none"
        stroke={DIAGRAM_COLORS.surface}
        strokeWidth={3}
      />
      <text x={200} y={70} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.dome}
      </text>

      {/* Diffuse rays converging on the object from multiple points on the dome */}
      {DOME_RAY_ORIGINS.map((ray) => (
        <line
          key={`${ray.x}-${ray.y}`}
          x1={ray.x}
          y1={ray.y}
          x2={200}
          y2={192}
          stroke={ray.color === "incident" ? DIAGRAM_COLORS.incident : DIAGRAM_COLORS.reflected}
          strokeWidth={2}
          markerEnd={`url(#${ray.color === "incident" ? incidentArrow : reflectedArrow})`}
        />
      ))}

      {/* Object at the center */}
      <ellipse cx={200} cy={200} rx={28} ry={14} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />
      <text x={200} y={228} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.object}
      </text>

      {/* Camera looking straight down through the dome's apex opening */}
      <line x1={200} y1={55} x2={200} y2={186} stroke={DIAGRAM_COLORS.camera} strokeWidth={1.5} strokeDasharray="4 4" />
      <CameraGlyph x={200} y={35} />
      <text x={260} y={38} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.camera}
      </text>
    </DiagramFrame>
  );
}
