"use client";

import { useId } from "react";
import { DIAGRAM_COLORS, DiagramFrame, ArrowMarker } from "./shared";

export type BeamPatternVariant = "direct" | "diffuse" | "focused";

export interface BeamPatternDiagramLabels {
  ariaLabel: string;
  ledLabel: string;
  opticLabel: string;
  targetLabel: string;
  zoneLabel: string;
  caption?: string;
}

const BEAM_COLOR: Record<BeamPatternVariant, string> = {
  direct: "#22d3ee",
  diffuse: "#34d399",
  focused: "#f87171",
};

const LED_X = [130, 200, 270];

export function BeamPatternDiagram({
  variant,
  labels,
}: {
  variant: BeamPatternVariant;
  labels: BeamPatternDiagramLabels;
}) {
  const uid = useId();
  const arrowId = `beam-${variant}-${uid}`;
  const color = BEAM_COLOR[variant];

  return (
    <DiagramFrame viewBox="0 0 400 250" ariaLabel={labels.ariaLabel} caption={labels.caption}>
      <defs>
        <ArrowMarker id={arrowId} color={color} />
      </defs>

      {/* 3 LED emitters */}
      {LED_X.map((x) => (
        <g key={x}>
          <rect x={x - 10} y={30} width={20} height={14} rx={3} fill={DIAGRAM_COLORS.body} stroke={DIAGRAM_COLORS.amber} strokeWidth={1.5} />
          <circle cx={x} cy={37} r={2} fill={DIAGRAM_COLORS.amber} />
        </g>
      ))}
      <text x={200} y={20} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.ledLabel}
      </text>

      {/* Optic in front of the LEDs — shape depends on variant */}
      {variant === "diffuse" && (
        <rect
          x={100}
          y={53}
          width={200}
          height={11}
          rx={3}
          fill={DIAGRAM_COLORS.camera}
          fillOpacity={0.12}
          stroke={DIAGRAM_COLORS.camera}
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
      )}
      {variant === "direct" &&
        LED_X.map((x) => (
          <rect key={x} x={x - 7} y={54} width={14} height={8} rx={4} fill="none" stroke={DIAGRAM_COLORS.camera} strokeWidth={1.5} />
        ))}
      {variant === "focused" &&
        LED_X.map((x) => (
          <rect key={x} x={x - 9} y={51} width={18} height={13} rx={6} fill="none" stroke={DIAGRAM_COLORS.camera} strokeWidth={2} />
        ))}
      <text x={200} y={80} textAnchor="middle" fontSize={11} fill={DIAGRAM_COLORS.text}>
        {labels.opticLabel}
      </text>

      {/* Beam envelope + rays — geometry depends on variant */}
      {variant === "direct" && (
        <>
          <polygon points="130,66 270,66 245,188 155,188" fill={color} fillOpacity={0.08} />
          {[
            { x1: 130, x2: 155 },
            { x1: 200, x2: 200 },
            { x1: 270, x2: 245 },
          ].map((r) => (
            <line
              key={r.x1}
              x1={r.x1}
              y1={66}
              x2={r.x2}
              y2={186}
              stroke={color}
              strokeWidth={2}
              markerEnd={`url(#${arrowId})`}
            />
          ))}
        </>
      )}

      {variant === "diffuse" && (
        <>
          <polygon points="130,64 270,64 350,188 50,188" fill={color} fillOpacity={0.08} />
          {[
            [130, 60],
            [130, 130],
            [130, 200],
            [200, 120],
            [200, 200],
            [200, 280],
            [270, 200],
            [270, 270],
            [270, 340],
          ].map(([x1, x2], i) => (
            <line
              key={i}
              x1={x1}
              y1={64}
              x2={x2}
              y2={186}
              stroke={color}
              strokeWidth={1.25}
              strokeOpacity={0.75}
              markerEnd={`url(#${arrowId})`}
            />
          ))}
        </>
      )}

      {variant === "focused" && (
        <>
          <polygon points="121,64 139,64 205,188 195,188" fill={color} fillOpacity={0.1} />
          <polygon points="191,64 209,64 205,188 195,188" fill={color} fillOpacity={0.1} />
          <polygon points="261,64 279,64 205,188 195,188" fill={color} fillOpacity={0.1} />
          {LED_X.map((x) => (
            <line key={x} x1={x} y1={64} x2={200} y2={186} stroke={color} strokeWidth={2} markerEnd={`url(#${arrowId})`} />
          ))}
          <circle cx={200} cy={190} r={13} fill={color} fillOpacity={0.25} />
          <circle cx={200} cy={190} r={6} fill={color} />
        </>
      )}

      {/* Working-distance / target plane */}
      <line x1={30} y1={198} x2={370} y2={198} stroke={DIAGRAM_COLORS.surface} strokeWidth={3} strokeLinecap="round" />
      {variant === "direct" && <rect x={150} y={194} width={100} height={8} rx={2} fill={color} fillOpacity={0.4} />}
      {variant === "diffuse" && <rect x={55} y={194} width={290} height={8} rx={2} fill={color} fillOpacity={0.35} />}
      {variant === "focused" && <rect x={190} y={194} width={20} height={8} rx={2} fill={color} fillOpacity={0.6} />}

      <text x={200} y={222} textAnchor="middle" fontSize={12} fill={DIAGRAM_COLORS.text}>
        {labels.targetLabel}
      </text>
      <text x={200} y={240} textAnchor="middle" fontSize={11} fill={color}>
        {labels.zoneLabel}
      </text>
    </DiagramFrame>
  );
}
