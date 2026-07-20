"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker, CameraGlyph } from "./shared";

export interface SpotlightDiagramLabels {
  ariaLabel: string;
  source: string;
  camera: string;
  target: string;
  distance: string;
  caption?: string;
}

export function SpotlightDiagram({ labels }: { labels: SpotlightDiagramLabels }) {
  const uid = useId();
  const arrow = `sp-beam-${uid}`;

  return (
    <DiagramFrame viewBox="0 0 420 200" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={arrow} color={DIAGRAM_COLORS.amber} />
      </defs>

      {/* Light source + camera cluster on the left */}
      <rect x={40} y={50} width={34} height={20} rx={4} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />
      <text x={57} y={40} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.source}
      </text>
      <CameraGlyph x={57} y={115} />
      <text x={57} y={140} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.camera}
      </text>

      {/* Diverging beam traveling a long working distance */}
      <line x1={78} y1={58} x2={330} y2={80} stroke={DIAGRAM_COLORS.amber} strokeWidth={2.5} markerEnd={`url(#${arrow})`} />
      <line x1={78} y1={62} x2={330} y2={87} stroke={DIAGRAM_COLORS.amber} strokeWidth={2.5} markerEnd={`url(#${arrow})`} />
      <line x1={78} y1={66} x2={330} y2={94} stroke={DIAGRAM_COLORS.amber} strokeWidth={2.5} markerEnd={`url(#${arrow})`} />

      {/* Working distance indicator */}
      <line x1={90} y1={140} x2={330} y2={140} stroke={DIAGRAM_COLORS.text} strokeWidth={1} strokeDasharray="4 4" />
      <text x={210} y={158} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.distance}
      </text>

      {/* Distant target */}
      <rect x={335} y={55} width={16} height={70} rx={3} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.surface} strokeWidth={2} />
      <text x={343} y={144} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.target}
      </text>
    </DiagramFrame>
  );
}
