"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker } from "./shared";

export interface PolarizationDiagramLabels {
  ariaLabel: string;
  source: string;
  filter0: string;
  surface: string;
  filter90: string;
  camera: string;
  blocked: string;
  passed: string;
  caption?: string;
}

export function PolarizationDiagram({ labels }: { labels: PolarizationDiagramLabels }) {
  const uid = useId();
  const glareArrow = `pol-glare-${uid}`;
  const diffuseArrow = `pol-diffuse-${uid}`;

  return (
    <DiagramFrame viewBox="0 0 440 240" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={glareArrow} color={DIAGRAM_COLORS.blocked} />
        <ArrowMarker id={diffuseArrow} color={DIAGRAM_COLORS.reflected} />
      </defs>

      {/* Light source */}
      <rect x={20} y={140} width={30} height={18} rx={3} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />
      <text x={35} y={130} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.text}>
        {labels.source}
      </text>

      {/* Polarizer at the light: 0 degrees (horizontal transmission axis) */}
      <circle cx={110} cy={149} r={22} fill="none" stroke={DIAGRAM_COLORS.camera} strokeWidth={2} />
      <line x1={92} y1={149} x2={128} y2={149} stroke={DIAGRAM_COLORS.amber} strokeWidth={3} />
      <text x={110} y={185} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.text}>
        {labels.filter0}
      </text>

      {/* Reflective surface */}
      <line x1={190} y1={158} x2={280} y2={158} stroke={DIAGRAM_COLORS.surface} strokeWidth={4} strokeLinecap="round" />
      <text x={235} y={180} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.text}>
        {labels.surface}
      </text>

      {/* Incident ray to the surface */}
      <line x1={132} y1={149} x2={225} y2={158} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />

      {/* Specular glare ray, blocked at the crossed polarizer */}
      <line
        x1={225}
        y1={155}
        x2={330}
        y2={80}
        stroke={DIAGRAM_COLORS.blocked}
        strokeWidth={2.5}
        strokeDasharray="6 4"
        markerEnd={`url(#${glareArrow})`}
      />
      <text x={270} y={60} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.blocked}>
        {labels.blocked}
      </text>

      {/* Diffuse ray, passes through the crossed polarizer */}
      <line
        x1={240}
        y1={158}
        x2={330}
        y2={95}
        stroke={DIAGRAM_COLORS.reflected}
        strokeWidth={2.5}
        markerEnd={`url(#${diffuseArrow})`}
      />
      <text x={270} y={200} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.reflected}>
        {labels.passed}
      </text>

      {/* Polarizer at the camera: 90 degrees, crossed (vertical transmission axis) */}
      <circle cx={355} cy={85} r={22} fill="none" stroke={DIAGRAM_COLORS.camera} strokeWidth={2} />
      <line x1={355} y1={67} x2={355} y2={103} stroke={DIAGRAM_COLORS.reflected} strokeWidth={3} />
      <text x={355} y={122} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.text}>
        {labels.filter90}
      </text>

      {/* Camera */}
      <rect x={395} y={70} width={32} height={20} rx={3} fill={DIAGRAM_COLORS.camera} />
      <circle cx={411} cy={80} r={7} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.camera} strokeWidth={2} />
      <text x={411} y={108} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.text}>
        {labels.camera}
      </text>
      <line x1={378} y1={83} x2={395} y2={81} stroke={DIAGRAM_COLORS.reflected} strokeWidth={2} />
    </DiagramFrame>
  );
}
