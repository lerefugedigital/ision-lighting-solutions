"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker, CameraGlyph } from "./shared";

export interface BrightfieldDarkfieldDiagramLabels {
  ariaLabel: string;
  brightfield: string;
  darkfield: string;
  source: string;
  camera: string;
  defect: string;
  missed: string;
  caption?: string;
}

export function BrightfieldDarkfieldDiagram({ labels }: { labels: BrightfieldDarkfieldDiagramLabels }) {
  const uid = useId();
  const incidentArrow = `bd-incident-${uid}`;
  const reflectedArrow = `bd-reflected-${uid}`;
  const missedArrow = `bd-missed-${uid}`;

  return (
    <DiagramFrame viewBox="0 0 440 240" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={incidentArrow} color={DIAGRAM_COLORS.incident} />
        <ArrowMarker id={reflectedArrow} color={DIAGRAM_COLORS.reflected} />
        <ArrowMarker id={missedArrow} color={DIAGRAM_COLORS.blocked} />
      </defs>

      {/* Divider */}
      <line x1={220} y1={20} x2={220} y2={220} stroke={DIAGRAM_COLORS.border} strokeWidth={1} />

      {/* --- Brightfield (left) --- */}
      <text x={110} y={26} textAnchor="middle" fontSize={13} fill={DIAGRAM_COLORS.amber} fontWeight={700}>
        {labels.brightfield}
      </text>
      <line x1={30} y1={170} x2={190} y2={170} stroke={DIAGRAM_COLORS.surface} strokeWidth={4} strokeLinecap="round" />

      <rect x={65} y={55} width={40} height={14} rx={3} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />
      <text x={85} y={48} textAnchor="middle" fontSize={10} fill={DIAGRAM_COLORS.text}>
        {labels.source}
      </text>
      <CameraGlyph x={150} y={62} />

      <line x1={85} y1={70} x2={107} y2={166} stroke={DIAGRAM_COLORS.incident} strokeWidth={2} markerEnd={`url(#${incidentArrow})`} />
      <line x1={113} y1={166} x2={150} y2={78} stroke={DIAGRAM_COLORS.reflected} strokeWidth={2} markerEnd={`url(#${reflectedArrow})`} />

      {/* --- Darkfield (right) --- */}
      <text x={330} y={26} textAnchor="middle" fontSize={13} fill={DIAGRAM_COLORS.amber} fontWeight={700}>
        {labels.darkfield}
      </text>
      <line x1={250} y1={170} x2={410} y2={170} stroke={DIAGRAM_COLORS.surface} strokeWidth={4} strokeLinecap="round" />
      {/* Small surface defect */}
      <path d="M 322 170 L 330 158 L 338 170 Z" fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={1.5} />
      <text x={330} y={190} textAnchor="middle" fontSize={10} fill={DIAGRAM_COLORS.text}>
        {labels.defect}
      </text>

      <rect x={258} y={158} width={40} height={14} rx={3} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={2} />
      <text x={278} y={178} textAnchor="middle" fontSize={10} fill={DIAGRAM_COLORS.text}>
        {labels.source}
      </text>
      <CameraGlyph x={330} y={45} />

      {/* Grazing incident ray */}
      <line x1={298} y1={163} x2={328} y2={163} stroke={DIAGRAM_COLORS.incident} strokeWidth={2} markerEnd={`url(#${incidentArrow})`} />
      {/* Specular reflection missing the camera */}
      <line
        x1={332}
        y1={163}
        x2={400}
        y2={140}
        stroke={DIAGRAM_COLORS.blocked}
        strokeWidth={2}
        strokeDasharray="5 4"
        markerEnd={`url(#${missedArrow})`}
      />
      <text x={434} y={125} textAnchor="end" fontSize={9} fill={DIAGRAM_COLORS.blocked}>
        {labels.missed}
      </text>
      {/* Scatter off the defect, straight up to the camera */}
      <line x1={330} y1={158} x2={330} y2={60} stroke={DIAGRAM_COLORS.reflected} strokeWidth={2} markerEnd={`url(#${reflectedArrow})`} />
    </DiagramFrame>
  );
}
