import React from "react";
import { C } from "../theme";

const S = C.texto;
const sw = { stroke: S, strokeWidth: 4, strokeLinejoin: "round" as const };

/* ---------- Reloj con agujas ---------- */
export const ClockFace: React.FC<{ cx: number; cy: number; r: number; minuteDeg: number; hourDeg: number; face?: string }> = ({
  cx,
  cy,
  r,
  minuteDeg,
  hourDeg,
  face = C.blanco,
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={face} {...sw} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      return (
        <line
          key={i}
          x1={cx + Math.sin(a) * r * 0.78}
          y1={cy - Math.cos(a) * r * 0.78}
          x2={cx + Math.sin(a) * r * 0.92}
          y2={cy - Math.cos(a) * r * 0.92}
          stroke={S}
          strokeWidth={i % 3 === 0 ? 4 : 2}
        />
      );
    })}
    <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.5} stroke={S} strokeWidth={6} strokeLinecap="round" transform={`rotate(${hourDeg} ${cx} ${cy})`} />
    <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.78} stroke={C.terracota} strokeWidth={4} strokeLinecap="round" transform={`rotate(${minuteDeg} ${cx} ${cy})`} />
    <circle cx={cx} cy={cy} r={4} fill={S} />
  </g>
);

/* ---------- Edificio con torre del reloj (Puerta del Sol, en caricatura) ---------- */
export const SolBuilding: React.FC<{ x: number; y: number; scale?: number; minuteDeg: number; hourDeg: number; dusk?: boolean }> = ({
  x,
  y,
  scale = 1,
  minuteDeg,
  hourDeg,
  dusk,
}) => {
  const wall = dusk ? "#B9644E" : C.terracotaClaro;
  const trim = dusk ? "#F3D9B5" : C.crema;
  const win = dusk ? C.mostaza : "#CFE6E2";
  const windows: React.ReactNode[] = [];
  [360 - 320, 470 - 320].forEach((wy) => {
    for (let i = 0; i < 4; i++) {
      [30 + i * 58, 550 + i * 58].forEach((wx) => {
        windows.push(
          <g key={`${wx}-${wy}`}>
            <rect x={wx - 4} y={320 + wy - 4} width={44} height={68} rx={4} fill={trim} {...sw} strokeWidth={3} />
            <rect x={wx + 4} y={320 + wy + 4} width={28} height={52} rx={2} fill={win} stroke={S} strokeWidth={2} />
          </g>,
        );
      });
    }
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* astabola: mástil y bola */}
      <line x1={400} y1={70} x2={400} y2={8} stroke={S} strokeWidth={5} />
      <circle cx={400} cy={20} r={13} fill={C.mostaza} {...sw} strokeWidth={3} />
      {/* cúpula y torre */}
      <path d="M362 74 Q400 26 438 74 Z" fill={C.teal} {...sw} />
      <rect x={365} y={72} width={70} height={32} fill={trim} {...sw} />
      <rect x={345} y={100} width={110} height={112} fill={trim} {...sw} />
      <ClockFace cx={400} cy={156} r={40} minuteDeg={minuteDeg} hourDeg={hourDeg} />
      {/* cuerpo central con frontón */}
      <polygon points="262,262 400,206 538,262" fill={trim} {...sw} />
      <rect x={280} y={260} width={240} height={340} fill={wall} {...sw} />
      {/* alas */}
      <rect x={0} y={320} width={800} height={280} fill={wall} {...sw} />
      <rect x={280} y={260} width={240} height={340} fill={wall} {...sw} />
      <rect x={-14} y={306} width={828} height={20} fill={trim} {...sw} />
      <rect x={268} y={248} width={264} height={18} fill={trim} {...sw} />
      {/* balaustrada */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={10 + i * 18} y={292} width={8} height={14} fill={trim} stroke={S} strokeWidth={2} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={`r${i}`} x={538 + i * 18} y={292} width={8} height={14} fill={trim} stroke={S} strokeWidth={2} />
      ))}
      <rect x={4} y={286} width={262} height={8} fill={trim} stroke={S} strokeWidth={2} />
      <rect x={534} y={286} width={262} height={8} fill={trim} stroke={S} strokeWidth={2} />
      {windows}
      {/* ventanas centrales */}
      {[300, 375, 450].map((wx) => (
        <g key={wx}>
          <rect x={wx} y={290} width={50} height={70} rx={4} fill={trim} {...sw} strokeWidth={3} />
          <rect x={wx + 8} y={298} width={34} height={54} fill={win} stroke={S} strokeWidth={2} />
        </g>
      ))}
      {/* arcos de entrada */}
      {[300, 375, 450].map((ax) => (
        <path key={ax} d={`M${ax} 600 L${ax} 520 Q${ax + 25} 488 ${ax + 50} 520 L${ax + 50} 600 Z`} fill={dusk ? "#5E3A2E" : "#7A4A3A"} {...sw} strokeWidth={3} />
      ))}
      {/* zócalo */}
      <rect x={0} y={580} width={800} height={20} fill={trim} {...sw} strokeWidth={3} />
    </g>
  );
};

/* ---------- Estatua del oso y el madroño (caricatura) ---------- */
export const OsoMadrono: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  const bear = "#6B4A33";
  const berries = [
    [-40, -262], [-10, -300], [30, -282], [62, -250], [-52, -232], [10, -246], [44, -312], [-24, -276], [70, -275], [0, -330],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-70} y={-104} width={140} height={16} rx={4} fill="#E9DCC6" {...sw} />
      <rect x={-58} y={-90} width={116} height={90} fill="#E9DCC6" {...sw} />
      <rect x={-40} y={-70} width={80} height={44} rx={4} fill="none" stroke={S} strokeWidth={2} opacity={0.5} />
      {/* tronco */}
      <path d="M18 -104 C 22 -150, 12 -190, 22 -240 L 36 -240 C 30 -190, 40 -150, 36 -104 Z" fill="#7A5233" {...sw} />
      {/* copa */}
      {[
        [-34, -258, 44],
        [62, -252, 46],
        [26, -282, 62],
        [16, -322, 40],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={C.teal} {...sw} />
      ))}
      {berries.map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r={6} fill={C.terracota} stroke={S} strokeWidth={2} />
      ))}
      {/* oso de pie apoyado en el tronco */}
      <rect x={-34} y={-136} width={16} height={34} rx={7} fill={bear} {...sw} />
      <rect x={-12} y={-136} width={16} height={34} rx={7} fill={bear} {...sw} />
      <ellipse cx={-14} cy={-160} rx={26} ry={40} fill={bear} {...sw} transform="rotate(14 -14 -160)" />
      <rect x={-6} y={-190} width={34} height={14} rx={7} fill={bear} {...sw} transform="rotate(-22 -6 -190)" />
      <circle cx={-14} cy={-210} r={7} fill={bear} {...sw} strokeWidth={3} />
      <circle cx={8} cy={-213} r={7} fill={bear} {...sw} strokeWidth={3} />
      <circle cx={-2} cy={-196} r={19} fill={bear} {...sw} />
      <ellipse cx={12} cy={-190} rx={9} ry={7} fill="#A07A5A" stroke={S} strokeWidth={2.5} />
      <circle cx={18} cy={-192} r={3} fill={S} />
      <circle cx={0} cy={-201} r={2.6} fill={S} />
    </g>
  );
};

/* ---------- Persona caminando ---------- */
export const Walker: React.FC<{ x: number; y: number; s?: number; color: string; hair?: string; phase: number; dir?: 1 | -1 }> = ({
  x,
  y,
  s = 1,
  color,
  hair = C.pelo,
  phase,
  dir = 1,
}) => {
  const a = Math.sin(phase) * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
      <line x1={0} y1={-48} x2={0} y2={0} stroke={S} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a} 0 -48)`} />
      <line x1={0} y1={-48} x2={0} y2={0} stroke={S} strokeWidth={8} strokeLinecap="round" transform={`rotate(${-a} 0 -48)`} />
      <line x1={0} y1={-90} x2={0} y2={-52} stroke={C.piel} strokeWidth={8} strokeLinecap="round" transform={`rotate(${-a * 0.8} 0 -90)`} />
      <rect x={-17} y={-100} width={34} height={56} rx={14} fill={color} {...sw} strokeWidth={3} />
      <line x1={0} y1={-90} x2={0} y2={-52} stroke={C.piel} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a * 0.8} 0 -90)`} />
      <circle cx={0} cy={-116} r={16} fill={C.piel} {...sw} strokeWidth={3} />
      <path d="M-16 -118 Q-14 -136 0 -134 Q16 -136 16 -118 Q8 -126 -16 -118 Z" fill={hair} stroke={S} strokeWidth={3} />
      <circle cx={8} cy={-116} r={2.2} fill={S} />
    </g>
  );
};

/* ---------- Paloma en vuelo ---------- */
export const Pigeon: React.FC<{ x: number; y: number; s?: number; flap: number }> = ({ x, y, s = 1, flap }) => {
  const w = Math.sin(flap) * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-4 0 Q-22 ${-14 - w} -38 ${-6 - w * 1.4}`} fill="none" stroke={S} strokeWidth={4} strokeLinecap="round" />
      <path d={`M4 0 Q22 ${-14 - w} 38 ${-6 - w * 1.4}`} fill="none" stroke={S} strokeWidth={4} strokeLinecap="round" />
      <ellipse cx={0} cy={2} rx={12} ry={7} fill="#A9AFAE" stroke={S} strokeWidth={3} />
      <circle cx={12} cy={-2} r={5} fill="#A9AFAE" stroke={S} strokeWidth={2.5} />
    </g>
  );
};

/* ---------- Nube ---------- */
export const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 20 Q-90 -10 -55 -14 Q-50 -48 -10 -42 Q10 -70 45 -46 Q85 -50 82 -12 Q105 0 90 20 Z" fill={C.blanco} stroke={S} strokeWidth={3} />
  </g>
);

/* ---------- Fachada de La Plazuela ---------- */
export const Facade: React.FC<{ x: number; y: number; scale?: number; dusk?: boolean }> = ({ x, y, scale = 1, dusk }) => {
  const wall = dusk ? "#E5B36F" : C.mostazaClaro;
  const glass = dusk ? "#FFD27A" : "#CFE6E2";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={0} y={0} width={1060} height={640} fill={wall} {...sw} />
      <rect x={-16} y={-14} width={1092} height={26} fill={C.terracota} {...sw} />
      {/* pisos superiores con balcones */}
      {[50, 200].map((wy) =>
        [90, 285, 480, 675, 870].map((wx) => (
          <g key={`${wx}-${wy}`}>
            <rect x={wx - 26} y={wy} width={22} height={112} fill={C.teal} stroke={S} strokeWidth={3} />
            <rect x={wx + 104} y={wy} width={22} height={112} fill={C.teal} stroke={S} strokeWidth={3} />
            <rect x={wx} y={wy} width={100} height={124} fill={glass} {...sw} strokeWidth={3} />
            <line x1={wx + 50} y1={wy} x2={wx + 50} y2={wy + 124} stroke={S} strokeWidth={3} />
            <rect x={wx - 14} y={wy + 120} width={128} height={10} fill={C.crema} stroke={S} strokeWidth={3} />
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={i} x1={wx - 8 + i * 19} y1={wy + 84} x2={wx - 8 + i * 19} y2={wy + 120} stroke={S} strokeWidth={3} />
            ))}
            <line x1={wx - 12} y1={wy + 84} x2={wx + 112} y2={wy + 84} stroke={S} strokeWidth={4} />
          </g>
        )),
      )}
      {/* letrero */}
      <rect x={300} y={346} width={460} height={64} rx={10} fill={C.teal} {...sw} />
      <text x={530} y={392} textAnchor="middle" fontFamily="Fraunces" fontWeight={700} fontSize={44} fill={C.crema}>
        La Plazuela
      </text>
      {/* planta baja */}
      <rect x={40} y={500} width={360} height={140} fill={glass} {...sw} />
      <rect x={660} y={500} width={360} height={140} fill={glass} {...sw} />
      {[40, 660].map((gx) =>
        [70, 180, 290].map((lx) => (
          <g key={`${gx}-${lx}`}>
            <line x1={gx + lx} y1={500} x2={gx + lx} y2={526} stroke={S} strokeWidth={2} />
            <circle cx={gx + lx} cy={534} r={9} fill={C.mostaza} stroke={S} strokeWidth={2} />
          </g>
        )),
      )}
      <rect x={455} y={480} width={150} height={160} rx={6} fill={C.terracota} {...sw} />
      <circle cx={585} cy={565} r={5} fill={C.mostaza} stroke={S} strokeWidth={2} />
      {/* toldo terracota */}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={20 + i * 51} y={426} width={51} height={48} fill={i % 2 ? C.crema : C.terracota} stroke={S} strokeWidth={2} />
      ))}
      <rect x={20} y={426} width={1020} height={48} fill="none" {...sw} />
      {Array.from({ length: 20 }).map((_, i) => (
        <path key={i} d={`M${20 + i * 51} 474 Q${45 + i * 51} 500 ${71 + i * 51} 474 Z`} fill={i % 2 ? C.crema : C.terracota} {...sw} strokeWidth={3} />
      ))}
    </g>
  );
};

/* ---------- Mesa de terraza con dos comensales ---------- */
export const TerraceTable: React.FC<{ x: number; y: number; s?: number; colors: [string, string]; T: number }> = ({ x, y, s = 1, colors, T }) => {
  const nod = Math.sin(T * 3 + x) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((side, i) => (
        <g key={side} transform={`translate(${side * 62} ${i ? nod : -nod})`}>
          <rect x={-20} y={-96} width={40} height={60} rx={16} fill={colors[i]} {...sw} strokeWidth={3} />
          <circle cx={0} cy={-112} r={17} fill={C.piel} {...sw} strokeWidth={3} />
          <path d="M-17 -114 Q-15 -134 0 -132 Q17 -134 17 -114 Q6 -124 -17 -114 Z" fill={i ? "#2B2A27" : C.pelo} stroke={S} strokeWidth={3} />
          <rect x={-26} y={-40} width={52} height={10} rx={3} fill={C.terracota} stroke={S} strokeWidth={3} />
          <line x1={-22} y1={-30} x2={-24} y2={10} stroke={S} strokeWidth={4} />
          <line x1={22} y1={-30} x2={24} y2={10} stroke={S} strokeWidth={4} />
        </g>
      ))}
      <line x1={0} y1={-44} x2={0} y2={8} stroke={S} strokeWidth={6} />
      <ellipse cx={0} cy={8} rx={28} ry={6} fill={S} />
      <ellipse cx={0} cy={-50} rx={62} ry={14} fill={C.blanco} {...sw} strokeWidth={3} />
      <ellipse cx={-18} cy={-54} rx={14} ry={4} fill={C.mostaza} stroke={S} strokeWidth={2} />
      <rect x={12} y={-74} width={10} height={22} rx={3} fill={C.tealClaro} stroke={S} strokeWidth={2} />
    </g>
  );
};

export const Plant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -40 Q-30 -80 -10 -110 Q0 -70 0 -40 Z" fill={C.teal} stroke={S} strokeWidth={3} />
    <path d="M0 -40 Q30 -86 14 -118 Q4 -76 0 -40 Z" fill={C.tealClaro} stroke={S} strokeWidth={3} />
    <path d="M0 -40 Q-44 -60 -40 -84 Q-12 -66 0 -40 Z" fill={C.tealClaro} stroke={S} strokeWidth={3} />
    <path d="M-24 -44 L24 -44 L18 0 L-18 0 Z" fill={C.terracota} {...sw} strokeWidth={3} />
  </g>
);

export const StreetLamp: React.FC<{ x: number; y: number; s?: number; lit?: boolean }> = ({ x, y, s = 1, lit }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {lit && <circle cx={0} cy={-232} r={46} fill={C.mostaza} opacity={0.35} />}
    <rect x={-6} y={-220} width={12} height={220} fill={S} />
    <rect x={-16} y={-14} width={32} height={14} rx={3} fill={S} />
    <path d="M-20 -220 L20 -220 L14 -250 L-14 -250 Z" fill={lit ? C.mostaza : C.crema} {...sw} strokeWidth={3} />
    <path d="M-16 -250 L0 -264 L16 -250 Z" fill={S} />
  </g>
);
