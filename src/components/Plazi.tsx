import React from "react";
import { staticFile, useCurrentFrame, random, interpolate, Easing } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { C, FPS } from "../theme";

export type Gesture = "wave" | "point" | "thumbs";
export type GestureCue = { t: number; type: Gesture; dur?: number };

const AUDIO = staticFile("narracion.mp3");

/** Apertura de boca 0..1 a partir del volumen de la narración. */
const useMouth = (frame: number) => {
  const audioData = useAudioData(AUDIO);
  if (!audioData) return 0;
  const bins = visualizeAudio({ fps: FPS, frame, audioData, numberOfSamples: 32, smoothing: true });
  // la voz se concentra en las bandas bajas-medias
  const voice = bins.slice(0, 12).reduce((a, b) => a + b, 0) / 12;
  // calibrado: silencio ≈ 0,001; voz ≈ 0,008–0,06
  return Math.min(1, Math.sqrt(Math.max(0, voice - 0.003) / 0.045));
};

/** Ángulo del brazo (0 = colgando) para el gesto activo. */
const armPose = (T: number, cues: GestureCue[]) => {
  for (const g of cues) {
    const dur = g.dur ?? 2.6;
    if (T >= g.t && T <= g.t + dur) {
      const up = interpolate(T, [g.t, g.t + 0.35, g.t + dur - 0.4, g.t + dur], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });
      const target = g.type === "wave" ? -158 : g.type === "point" ? -122 : -150;
      const wiggle = g.type === "wave" ? Math.sin((T - g.t) * 14) * 16 * up : 0;
      return { angle: -15 + (target + 15) * up + wiggle, type: g.type, up };
    }
  }
  return { angle: -15, type: "point" as Gesture, up: 0 };
};

const Hand: React.FC<{ type: Gesture; angle: number }> = ({ type, angle }) => {
  // la mano se dibuja en coordenadas de pantalla (contra-rotada)
  const s = { stroke: C.texto, strokeWidth: 3, fill: C.piel } as const;
  if (type === "wave") {
    return (
      <g transform={`rotate(${-angle})`}>
        {[-12, -4, 4, 12].map((x, i) => (
          <rect key={i} x={x - 3.5} y={-30} width={7} height={18} rx={3.5} {...s} />
        ))}
        <rect x={-21} y={-14} width={7} height={14} rx={3.5} transform="rotate(-35 -17 -6)" {...s} />
        <circle r={14} {...s} />
      </g>
    );
  }
  if (type === "thumbs") {
    return (
      <g transform={`rotate(${-angle})`}>
        <rect x={-4} y={-34} width={9} height={22} rx={4.5} {...s} />
        <rect x={-14} y={-14} width={28} height={26} rx={8} {...s} />
      </g>
    );
  }
  // point: dedo índice en la dirección del brazo
  return (
    <g>
      <rect x={-4} y={4} width={8} height={26} rx={4} {...s} />
      <circle r={13} {...s} />
    </g>
  );
};

/**
 * Plazi: camarera joven en caricatura (personaje original).
 * Caja fija 330 × 270 en la esquina inferior izquierda (franja inferior, fuera de la zona de datos).
 */
export const Plazi: React.FC<{ gestures: GestureCue[] }> = ({ gestures }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const mouth = useMouth(frame);

  // parpadeo cada ~3-4,5 s
  let blink = 1;
  const period = 110;
  const k = Math.floor(frame / period);
  const blinkAt = k * period + Math.floor(random(`blink-${k}`) * 40);
  const d = frame - blinkAt;
  if (d >= 0 && d < 6) blink = [0.5, 0.1, 0.1, 0.4, 0.8, 1][d];

  const bob = Math.sin(T * 2.2) * 2;
  const arm = armPose(T, gestures);
  const headTilt = arm.type === "point" ? arm.up * 5 : arm.type === "wave" ? -arm.up * 4 : 0;
  const stroke = { stroke: C.texto, strokeWidth: 3.5, strokeLinejoin: "round" as const };

  return (
    <svg
      width={330}
      height={270}
      viewBox="0 0 330 270"
      style={{ position: "absolute", left: 24, bottom: 0, overflow: "hidden" }}
    >
      <g transform={`translate(0 ${bob})`}>
        {/* brazo derecho (gestos) detrás del cuerpo cuando baja */}
        <g transform={`translate(228 196) rotate(${arm.angle})`}>
          <rect x={-15} y={-6} width={30} height={46} rx={14} fill={C.blanco} {...stroke} />
          <rect x={-11} y={34} width={22} height={52} rx={11} fill={C.piel} {...stroke} />
          <g transform="translate(0 94)">
            <Hand type={arm.type} angle={arm.angle} />
          </g>
        </g>

        {/* cuerpo: camisa blanca */}
        <path d="M78 272 C 80 205, 110 172, 165 170 C 220 172, 250 205, 252 272 Z" fill={C.blanco} {...stroke} />
        {/* cuello de la camisa */}
        <path d="M145 172 L165 196 L185 172" fill="none" {...stroke} />
        {/* delantal terracota con tirantes */}
        <path d="M112 272 L118 212 Q165 202 212 212 L218 272 Z" fill={C.terracota} {...stroke} />
        <line x1={122} y1={212} x2={136} y2={176} {...stroke} stroke={C.terracota} strokeWidth={8} />
        <line x1={208} y1={212} x2={194} y2={176} {...stroke} stroke={C.terracota} strokeWidth={8} />
        <rect x={146} y={236} width={38} height={26} rx={5} fill={C.terracotaClaro} {...stroke} strokeWidth={2.5} />
        {/* bolígrafo en el bolsillo */}
        <rect x={172} y={224} width={6} height={18} rx={2} fill={C.teal} stroke={C.texto} strokeWidth={2} />

        {/* libreta en la mano izquierda */}
        <g transform="translate(70 198) rotate(-10)">
          <rect x={0} y={0} width={62} height={78} rx={6} fill={C.crema} {...stroke} />
          <rect x={0} y={0} width={62} height={14} rx={6} fill={C.mostaza} {...stroke} />
          {[28, 40, 52, 64].map((y) => (
            <line key={y} x1={10} x2={52} y1={y} y2={y} stroke={C.texto} strokeWidth={2} opacity={0.35} />
          ))}
          <circle cx={58} cy={46} r={13} fill={C.piel} {...stroke} />
        </g>

        {/* cabeza */}
        <g transform={`rotate(${headTilt} 165 110)`}>
          {/* pelo de atrás y moño */}
          <circle cx={165} cy={30} r={25} fill={C.pelo} {...stroke} />
          <ellipse cx={165} cy={98} rx={66} ry={68} fill={C.pelo} {...stroke} />
          {/* cuello */}
          <rect x={150} y={146} width={30} height={30} fill={C.piel} {...stroke} />
          {/* orejas */}
          <circle cx={108} cy={108} r={11} fill={C.piel} {...stroke} />
          <circle cx={222} cy={108} r={11} fill={C.piel} {...stroke} />
          <circle cx={108} cy={122} r={4} fill={C.mostaza} stroke={C.texto} strokeWidth={2} />
          <circle cx={222} cy={122} r={4} fill={C.mostaza} stroke={C.texto} strokeWidth={2} />
          {/* cara */}
          <ellipse cx={165} cy={106} rx={57} ry={58} fill={C.piel} {...stroke} />
          {/* flequillo */}
          <path
            d="M106 98 C 104 46, 226 40, 224 98 C 210 76, 190 66, 168 70 C 160 58, 140 56, 128 66 C 118 74, 110 86, 106 98 Z"
            fill={C.pelo}
            {...stroke}
          />
          {/* cejas */}
          <path d="M131 88 Q141 82 151 87" fill="none" {...stroke} strokeWidth={3.5} strokeLinecap="round" />
          <path d="M179 87 Q189 82 199 88" fill="none" {...stroke} strokeWidth={3.5} strokeLinecap="round" />
          {/* ojos */}
          <g transform={`translate(141 106) scale(1 ${blink})`}>
            <ellipse rx={7} ry={9} fill={C.texto} />
            <circle cx={2.5} cy={-3} r={2.4} fill={C.blanco} />
          </g>
          <g transform={`translate(189 106) scale(1 ${blink})`}>
            <ellipse rx={7} ry={9} fill={C.texto} />
            <circle cx={2.5} cy={-3} r={2.4} fill={C.blanco} />
          </g>
          {/* mejillas */}
          <circle cx={127} cy={128} r={10} fill={C.terracotaClaro} opacity={0.55} />
          <circle cx={203} cy={128} r={10} fill={C.terracotaClaro} opacity={0.55} />
          {/* nariz */}
          <path d="M163 114 Q167 122 162 124" fill="none" stroke={C.texto} strokeWidth={2.5} strokeLinecap="round" />
          {/* boca animada con la voz */}
          <path
            d={`M148 133 Q165 ${136 - mouth * 2} 182 133 Q165 ${139 + mouth * 20} 148 133 Z`}
            fill="#7A2E2E"
            stroke={C.texto}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {mouth > 0.35 && <ellipse cx={165} cy={136 + mouth * 12} rx={7} ry={3 + mouth * 2} fill="#E07A7A" />}
        </g>
      </g>
    </svg>
  );
};
