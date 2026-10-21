import React from "react";
import { Easing, interpolate } from "remotion";

export const FPS = 30;
export const M = 80; // margen de seguridad

// Paleta: principal cálido, gris oscuro para texto, verde para mejoras. Rojo solo para negativos y alertas.
export const C = {
  bg: "#FBF7F1",
  card: "#FFFFFF",
  main: "#B5522A",
  mainSoft: "#F3E0D3",
  text: "#262626",
  text2: "#4A4A4A",
  line: "#E4DBD0",
  green: "#2E7D32",
  greenSoft: "#E3F1E4",
  red: "#C62828",
  redSoft: "#FDECEA",
  grey: "#B9B1A8",
  prudente: "#E2AE8C",
  central: "#B5522A",
  optimista: "#6B2F12",
};

export const FONT = "Inter, Arial, sans-serif";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const p = (t: number, at: number, dur = 0.5, ease = Easing.out(Easing.cubic)) =>
  interpolate(t, [at, at + dur], [0, 1], { ...cl, easing: ease });

/** Formato español: punto de miles, coma decimal. */
export const fmt = (n: number, dec = 0) => {
  const neg = n < 0;
  const [i, d] = Math.abs(n).toFixed(dec).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (neg && Number(Math.abs(n).toFixed(dec)) !== 0 ? "−" : "") + int + (d ? "," + d : "");
};

/** Aparición: opacidad + desplazamiento corto. */
export const Fade: React.FC<{ t: number; at: number; until?: number; dx?: number; dy?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  t,
  at,
  until,
  dx = 0,
  dy = 24,
  dur = 0.5,
  style,
  children,
}) => {
  const a = p(t, at, dur);
  const b = until !== undefined ? 1 - p(t, until - 0.3, 0.3, Easing.in(Easing.cubic)) : 1;
  return <div style={{ opacity: a * b, transform: `translate(${(1 - a) * dx}px, ${(1 - a) * dy}px)`, ...style }}>{children}</div>;
};

export const Tag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 14, height: 14, borderRadius: 7, background: C.main }} />
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: C.main }}>{text}</div>
  </div>
);

export const Title: React.FC<{ text: string; size?: number }> = ({ text, size = 72 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.1, color: C.text, letterSpacing: -1.5 }}>{text}</div>
);

export const Txt: React.FC<{ size?: number; weight?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 48,
  weight = 500,
  color = C.text,
  style,
  children,
}) => <div style={{ fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: 1.25, color, ...style }}>{children}</div>;

/** Cifra con efecto contador. */
export const Counter: React.FC<{
  t: number;
  at: number;
  value: number;
  dec?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
  dur?: number;
  style?: React.CSSProperties;
}> = ({ t, at, value, dec = 0, prefix = "", suffix = " €", size = 120, color = C.text, dur = 1.3, style }) => {
  const v = value * p(t, at, dur, Easing.out(Easing.cubic));
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -2,
        whiteSpace: "nowrap",
        opacity: p(t, at, 0.2),
        ...style,
      }}
    >
      {prefix}
      {fmt(v, dec)}
      {suffix}
    </div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; accent?: string }> = ({ style, children, accent = C.main }) => (
  <div
    style={{
      background: C.card,
      borderRadius: 24,
      border: `2px solid ${C.line}`,
      borderTop: `8px solid ${accent}`,
      boxShadow: "0 6px 0 rgba(60,40,20,0.07)",
      padding: "28px 32px",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- Iconos (SVG propios) ---------- */
type IP = { size?: number; color?: string };
export const IconWarn: React.FC<IP> = ({ size = 44, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M24 4 L46 43 L2 43 Z" fill={color} />
    <rect x={21.5} y={16} width={5} height={15} rx={2.5} fill="#fff" />
    <circle cx={24} cy={36.5} r={3} fill="#fff" />
  </svg>
);
export const IconInfo: React.FC<IP> = ({ size = 44, color = C.text2 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={22} fill={color} />
    <rect x={21.5} y={20} width={5} height={16} rx={2.5} fill="#fff" />
    <circle cx={24} cy={13.5} r={3} fill="#fff" />
  </svg>
);
export const IconCheck: React.FC<IP & { on?: number }> = ({ size = 56, color = C.green, on = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <rect x={3} y={3} width={50} height={50} rx={12} fill={on > 0.5 ? color : "#fff"} stroke={color} strokeWidth={4} />
    <path d="M15 29 L24 38 L41 19" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={45} strokeDashoffset={45 * (1 - on)} />
  </svg>
);
export const IconArrow: React.FC<{ width?: number; color?: string; progress?: number }> = ({ width = 120, color = C.main, progress = 1 }) => (
  <svg width={width} height={40} viewBox={`0 0 ${width} 40`}>
    <line x1={4} y1={20} x2={4 + (width - 26) * progress} y2={20} stroke={color} strokeWidth={8} strokeLinecap="round" />
    {progress > 0.95 && <path d={`M${width - 26} 6 L${width - 4} 20 L${width - 26} 34 Z`} fill={color} />}
  </svg>
);
export const IconPrice: React.FC<IP> = ({ size = 64, color = C.main }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M6 30 L30 6 L58 6 L58 34 L34 58 Z" fill={color} />
    <circle cx={46} cy={18} r={5} fill="#fff" />
  </svg>
);
export const IconClock: React.FC<IP> = ({ size = 64, color = C.main }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx={32} cy={32} r={28} fill={color} />
    <path d="M32 14 L32 33 L45 40" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconAdmin: React.FC<IP> = ({ size = 64, color = C.main }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x={10} y={6} width={44} height={52} rx={6} fill={color} />
    {[20, 30, 40].map((y) => (
      <rect key={y} x={18} y={y} width={28} height={5} rx={2.5} fill="#fff" />
    ))}
  </svg>
);
export const IconCash: React.FC<IP> = ({ size = 64, color = C.main }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x={4} y={14} width={56} height={36} rx={6} fill={color} />
    <circle cx={32} cy={32} r={10} fill="none" stroke="#fff" strokeWidth={5} />
  </svg>
);
export const IconChart: React.FC<IP> = ({ size = 64, color = C.main }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x={8} y={34} width={12} height={22} rx={3} fill={color} />
    <rect x={26} y={22} width={12} height={34} rx={3} fill={color} />
    <rect x={44} y={10} width={12} height={46} rx={3} fill={color} />
  </svg>
);
export const ICONS: Record<string, React.FC<IP>> = { price: IconPrice, clock: IconClock, admin: IconAdmin, cash: IconCash, chart: IconChart };

/** Caja de aviso/alerta: icono + etiqueta de texto, no solo color. */
export const Notice: React.FC<{ kind: "aviso" | "alerta" | "nota"; size?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  kind,
  size = 36,
  style,
  children,
}) => {
  const isAlert = kind === "alerta";
  const isWarn = kind === "aviso";
  const col = isAlert ? C.red : isWarn ? C.main : C.text2;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        background: isAlert ? C.redSoft : isWarn ? "#FFF6EE" : "#F4F1EC",
        border: `3px solid ${col}`,
        borderRadius: 18,
        padding: "16px 24px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, paddingTop: 2 }}>
        {isAlert || isWarn ? <IconWarn size={44} color={col} /> : <IconInfo size={44} color={col} />}
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, letterSpacing: 1 }}>{isAlert ? "ALERTA" : isWarn ? "AVISO" : "NOTA"}</span>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1.3, color: C.text }}>{children}</div>
    </div>
  );
};
