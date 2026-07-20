"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker, CameraGlyph } from "./shared";

export interface CoaxialDiagramLabels {
  ariaLabel: string;
  source: string;
  beamsplitter: string;
  camera: string;
  object: string;
  caption?: string;
}

export function CoaxialDiagram({ labels }: { labels: CoaxialDiagramLabels }) {
  const uid = useId();
  const incidentArrow = `cx-incident-${uid}`;
  const returnArrow = `cx-return-${uid}`;

  return (
    <DiagramFrame viewBox="0 0 400 260" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={incidentArrow} color={DIAGRAM_COLORS.incident} />
        <ArrowMarker id={returnArrow} color={DIAGRAM_COLORS.reflected} />
      </defs>

      {/* Camera looking straight down the optical axis */}
      <CameraGlyph x={200} y={38} />
      <text x={200} y={16} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.camera}
      </text>
      <line x1={200} y1={55} x2={200} y2={112} stroke={DIAGRAM_COLORS.camera} strokeWidth={1.5} strokeDasharray="4 4" />

      {/* Beamsplitter at 45 degrees */}
      <line x1={172} y1={110} x2={228} y2={150} stroke={DIAGRAM_COLORS.surface} strokeWidth={3} strokeDasharray="6 3" />
      <text x={272} y={135} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.beamsplitter}
      </text>

      {/* Light source, horizontal ray into the beamsplitter */}
      <rect x={44} y={122} width={30} height={16} rx={3} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />
      <text x={59} y={112} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.source}
      </text>
      <line
        x1={76}
        y1={130}
        x2={195}
        y2={130}
        stroke={DIAGRAM_COLORS.incident}
        strokeWidth={2.5}
        markerEnd={`url(#${incidentArrow})`}
      />

      {/* Reflected ray turning down the optical axis onto the object */}
      <line
        x1={200}
        y1={132}
        x2={200}
        y2={210}
        stroke={DIAGRAM_COLORS.incident}
        strokeWidth={2.5}
        markerEnd={`url(#${incidentArrow})`}
      />

      {/* Return ray from the object back up through the beamsplitter to the camera */}
      <line
        x1={210}
        y1={205}
        x2={210}
        y2={115}
        stroke={DIAGRAM_COLORS.reflected}
        strokeWidth={2}
        strokeDasharray="5 4"
        markerEnd={`url(#${returnArrow})`}
      />

      {/* Object */}
      <rect x={175} y={212} width={50} height={16} rx={3} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.surface} strokeWidth={2} />
      <text x={200} y={246} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.object}
      </text>
    </DiagramFrame>
  );
}
