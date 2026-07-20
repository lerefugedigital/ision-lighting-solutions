"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker, CameraGlyph } from "./shared";

export interface BarLightDiagramLabels {
  ariaLabel: string;
  source: string;
  camera: string;
  surface: string;
  angleEqual: string;
  caption?: string;
}

export function BarLightDiagram({ labels }: { labels: BarLightDiagramLabels }) {
  const uid = useId();
  const incidentArrow = `bl-incident-${uid}`;
  const reflectedArrow = `bl-reflected-${uid}`;

  return (
    <DiagramFrame viewBox="0 0 400 220" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={incidentArrow} color={DIAGRAM_COLORS.incident} />
        <ArrowMarker id={reflectedArrow} color={DIAGRAM_COLORS.reflected} />
      </defs>

      {/* Inspected surface */}
      <line x1={40} y1={170} x2={360} y2={170} stroke={DIAGRAM_COLORS.surface} strokeWidth={4} strokeLinecap="round" />
      <text x={200} y={196} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.surface}
      </text>

      {/* Bar light source */}
      <rect x={96} y={30} width={48} height={16} rx={4} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />
      {[108, 120, 132].map((cx) => (
        <circle key={cx} cx={cx} cy={38} r={2.5} fill={DIAGRAM_COLORS.amber} />
      ))}
      <text x={120} y={22} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.source}
      </text>

      {/* Camera */}
      <CameraGlyph x={280} y={40} />
      <text x={280} y={18} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.camera}
      </text>

      {/* Incident ray */}
      <line
        x1={120}
        y1={50}
        x2={197}
        y2={166}
        stroke={DIAGRAM_COLORS.incident}
        strokeWidth={2.5}
        markerEnd={`url(#${incidentArrow})`}
      />
      {/* Reflected ray */}
      <line
        x1={203}
        y1={166}
        x2={280}
        y2={54}
        stroke={DIAGRAM_COLORS.reflected}
        strokeWidth={2.5}
        markerEnd={`url(#${reflectedArrow})`}
      />

      {/* Equal-angle arcs */}
      <path d="M 178 170 A 24 24 0 0 1 190 149" fill="none" stroke={DIAGRAM_COLORS.text} strokeWidth={1.5} />
      <path d="M 222 170 A 24 24 0 0 0 210 149" fill="none" stroke={DIAGRAM_COLORS.text} strokeWidth={1.5} />
      <text x={200} y={214} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.amber}>
        {labels.angleEqual}
      </text>
    </DiagramFrame>
  );
}
