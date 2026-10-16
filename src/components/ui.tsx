import React from "react";
import { useCurrentFrame } from "remotion";
import { C, CONTENT_H, FONT_TEXT, FONT_TITLE, FPS, prog } from "../theme";
import { CUES } from "../timing";

/** Tiempo absoluto del audio (s) para un componente montado dentro de una Sequence que empieza en `from` (frames). */
export const useT = (from: number) => (useCurrentFrame() + from) / FPS;

/** Franja inferior (25 %): fondo liso + subtítulos a la derecha de Plazi. */
export const BottomBand: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: CONTENT_H,
      width: 1920,
      height: 1080 - CONTENT_H,
      background: C.cremaOscuro,
      borderTop: `6px solid ${C.mostaza}`,
    }}
  />
);

export const Subtitles: React.FC = () => {
  const T = useCurrentFrame() / FPS;
  const cue = CUES.find((c) => T >= c.start && T < c.end);
  if (!cue) return null;
  const a = prog(T, cue.start, 0.15);
  return (
    <div
      style={{
        position: "absolute",
        left: 380,
        right: 48,
        top: CONTENT_H + 30,
        bottom: 26,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT_TEXT,
          fontWeight: 500,
          fontSize: 46,
          lineHeight: 1.28,
          color: C.texto,
          opacity: a,
          transform: `translateY(${(1 - a) * 8}px)`,
          textWrap: "balance",
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

/** Cabecera de escena (arriba a la izquierda). */
export const Header: React.FC<{ T: number; t0: number; kicker: string; title: string }> = ({ T, t0, kicker, title }) => {
  const a = prog(T, t0, 0.7);
  return (
    <div style={{ position: "absolute", left: 80, top: 40, opacity: a, transform: `translateX(${(1 - a) * -30}px)` }}>
      <div
        style={{
          fontFamily: FONT_TEXT,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: C.teal,
        }}
      >
        {kicker}
      </div>
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 60, color: C.texto, lineHeight: 1.1 }}>{title}</div>
    </div>
  );
};

/** Tarjeta lisa con borde grueso y sombra plana (estilo ilustración). */
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  appear?: number; // 0..1
  bg?: string;
  border?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, appear = 1, bg = C.blanco, border = C.texto, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
      border: `4px solid ${border}`,
      borderRadius: 28,
      boxShadow: `10px 10px 0 rgba(43,42,39,0.18)`,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 40}px) scale(${0.96 + 0.04 * appear})`,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 96,
  color = C.texto,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_TITLE,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1,
      color,
      fontVariantNumeric: "tabular-nums lining-nums",
      letterSpacing: -1,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ size?: number; color?: string; weight?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 34,
  color = C.texto,
  weight = 500,
  children,
  style,
}) => (
  <div style={{ fontFamily: FONT_TEXT, fontWeight: weight, fontSize: size, color, lineHeight: 1.2, ...style }}>{children}</div>
);

/** Píldora/etiqueta de color. */
export const Pill: React.FC<{ bg: string; color?: string; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  bg,
  color = C.blanco,
  size = 30,
  children,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      color,
      fontFamily: FONT_TEXT,
      fontWeight: 700,
      fontSize: size,
      padding: "8px 22px",
      borderRadius: 999,
      border: `3px solid ${C.texto}`,
      ...style,
    }}
  >
    {children}
  </div>
);
