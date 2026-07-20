"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker, CameraGlyph } from "./shared";

export interface BacklightDiagramLabels {
  ariaLabel: string;
  panel: string;
  object: string;
  camera: string;
  caption?: string;
}

const RAY_X = [85, 125, 275, 315];

export function BacklightDiagram({ labels }: { labels: BacklightDiagramLabels }) {
  const uid = useId();
  const arrow = `bk-ray-${uid}`;

  return (
    <DiagramFrame viewBox="0 0 400 240" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={arrow} color={DIAGRAM_COLORS.transmitted} />
      </defs>

      {/* Backlight panel */}
      <rect x={60} y={190} width={280} height={18} rx={4} fill={DIAGRAM_COLORS.amber} opacity={0.85} />
      <text x={200} y={228} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.panel}
      </text>

      {/* Object silhouette blocking the central rays */}
      <rect x={165} y={110} width={70} height={82} rx={14} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.surface} strokeWidth={2} />
      <text x={200} y={155} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.object}
      </text>

      {/* Transmitted rays passing on either side of the object, straight up to the camera */}
      {RAY_X.map((x) => (
        <line
          key={x}
          x1={x}
          y1={188}
          x2={x}
          y2={58}
          stroke={DIAGRAM_COLORS.transmitted}
          strokeWidth={2}
          markerEnd={`url(#${arrow})`}
        />
      ))}

      {/* Camera */}
      <CameraGlyph x={200} y={40} />
      <text x={200} y={18} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.camera}
      </text>
    </DiagramFrame>
  );
}
