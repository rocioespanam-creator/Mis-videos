import React from "react";
import { C, FONT_TEXT, FONT_TITLE } from "../theme";

const S = C.texto;
const sw = { stroke: S, strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/* ---------- Pizarra de menú (caballete) ---------- */
export const MenuBoard: React.FC<{
  oldPrice: string;
  newPrice: string;
  strike: number; // 0..1 tachado
  showNew: number; // 0..1
  newColor?: string;
}> = ({ oldPrice, newPrice, strike, showNew, newColor = C.mostaza }) => (
  <svg viewBox="0 0 360 320" width="100%" height="100%">
    <line x1={70} y1={250} x2={40} y2={316} {...sw} stroke="#7A5233" strokeWidth={10} />
    <line x1={290} y1={250} x2={320} y2={316} {...sw} stroke="#7A5233" strokeWidth={10} />
    <rect x={30} y={10} width={300} height={250} rx={14} fill="#A0703F" {...sw} />
    <rect x={46} y={26} width={268} height={218} rx={6} fill={S} />
    <text x={180} y={64} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={26} letterSpacing={3} fill={C.crema}>
      MENÚ DEL DÍA
    </text>
    <line x1={90} y1={78} x2={270} y2={78} stroke={C.crema} strokeWidth={2} opacity={0.5} />
    <text x={180} y={140} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={800} fontSize={58} fill={C.crema} opacity={1 - 0.45 * strike}>
      {oldPrice}
    </text>
    {strike > 0 && <line x1={88} y1={122} x2={88 + 184 * strike} y2={112} stroke={C.rojo} strokeWidth={9} strokeLinecap="round" />}
    <g opacity={showNew} transform={`translate(0 ${(1 - showNew) * 12})`}>
      <text x={180} y={220} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={800} fontSize={62} fill={newColor}>
        {newPrice}
      </text>
    </g>
  </svg>
);

/* ---------- Reloj con franja horaria ---------- */
const polar = (cx: number, cy: number, r: number, hour: number) => {
  const a = (hour / 12) * Math.PI * 2;
  return [cx + Math.sin(a) * r, cy - Math.cos(a) * r];
};
const wedge = (cx: number, cy: number, r: number, h0: number, h1: number) => {
  const [x0, y0] = polar(cx, cy, r, h0);
  const [x1, y1] = polar(cx, cy, r, h1);
  const large = h1 - h0 > 6 ? 1 : 0;
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
};

export const ClockAfternoon: React.FC<{ p: number; size?: number }> = ({ p, size = 260 }) => (
  <svg viewBox="0 0 260 260" width={size} height={size}>
    <circle cx={130} cy={130} r={110} fill={C.blanco} {...sw} strokeWidth={6} />
    <path d={wedge(130, 130, 104, 4, 4 + 4 * p)} fill={C.mostaza} opacity={0.85} />
    {Array.from({ length: 12 }).map((_, i) => {
      const [x0, y0] = polar(130, 130, 92, i);
      const [x1, y1] = polar(130, 130, 104, i);
      return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={S} strokeWidth={i % 3 === 0 ? 5 : 3} />;
    })}
    <text x={polar(130, 130, 70, 4)[0]} y={polar(130, 130, 70, 4)[1] + 8} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={24} fill={S}>
      16
    </text>
    <text x={polar(130, 130, 70, 8)[0]} y={polar(130, 130, 70, 8)[1] + 8} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={24} fill={S}>
      20
    </text>
    <line x1={130} y1={130} x2={polar(130, 130, 60, 4 + 4 * p)[0]} y2={polar(130, 130, 60, 4 + 4 * p)[1]} {...sw} strokeWidth={8} />
    <line x1={130} y1={130} x2={130} y2={52} {...sw} strokeWidth={5} stroke={C.terracota} />
    <circle cx={130} cy={130} r={8} fill={S} />
  </svg>
);

/* ---------- Mesas vacías ---------- */
export const EmptyTables: React.FC<{ T: number; width?: number }> = ({ T, width = 380 }) => (
  <svg viewBox="0 0 380 220" width={width} height={(width * 220) / 380}>
    {[70, 250].map((x, k) => (
      <g key={x}>
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${x + side * 58} 0)`}>
            <rect x={-20} y={60} width={40} height={74} rx={10} fill={C.terracota} {...sw} strokeWidth={3} />
            <rect x={-26} y={128} width={52} height={12} rx={3} fill={C.terracota} {...sw} strokeWidth={3} />
            <line x1={-22} y1={140} x2={-24} y2={196} {...sw} strokeWidth={4} />
            <line x1={22} y1={140} x2={24} y2={196} {...sw} strokeWidth={4} />
          </g>
        ))}
        <ellipse cx={x} cy={120} rx={62} ry={14} fill={C.blanco} {...sw} strokeWidth={3} />
        <line x1={x} y1={134} x2={x} y2={196} {...sw} strokeWidth={6} />
        <ellipse cx={x} cy={198} rx={28} ry={6} fill={S} />
        {/* telaraña/zzz: mesa sin clientes */}
        <text
          x={x + 30}
          y={50 - ((T * 18 + k * 20) % 30)}
          fontFamily={FONT_TEXT}
          fontWeight={700}
          fontSize={30}
          fill={C.teal}
          opacity={0.8}
        >
          z z
        </text>
      </g>
    ))}
    <line x1={0} y1={202} x2={380} y2={202} stroke={S} strokeWidth={3} opacity={0.3} />
  </svg>
);

/* ---------- Hucha ---------- */
export const PiggyBank: React.FC<{ level: number; T: number; draining: boolean; size?: number }> = ({ level, T, draining, size = 340 }) => {
  const coins = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 340 320" width={size} height={(size * 320) / 340}>
      <defs>
        <clipPath id="belly">
          <ellipse cx={170} cy={150} rx={120} ry={92} />
        </clipPath>
      </defs>
      {/* patas */}
      {[95, 135, 205, 245].map((x) => (
        <rect key={x} x={x - 16} y={210} width={32} height={46} rx={8} fill={C.terracotaClaro} {...sw} />
      ))}
      <ellipse cx={170} cy={150} rx={120} ry={92} fill="#F6C9B5" {...sw} />
      {/* nivel de monedas visto a través de la tripa */}
      <g clipPath="url(#belly)">
        <rect x={40} y={242 - 184 * level} width={260} height={200} fill={C.mostaza} />
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={40} x2={300} y1={242 - 184 * level + 14 + i * 18} y2={242 - 184 * level + 14 + i * 18} stroke="#D98E2E" strokeWidth={3} />
        ))}
      </g>
      <ellipse cx={170} cy={150} rx={120} ry={92} fill="none" {...sw} />
      {/* hocico, oreja, ojo, cola */}
      <ellipse cx={296} cy={150} rx={22} ry={30} fill={C.terracotaClaro} {...sw} />
      <circle cx={292} cy={140} r={4} fill={S} />
      <circle cx={292} cy={160} r={4} fill={S} />
      <path d="M220 70 L240 30 L258 82 Z" fill={C.terracotaClaro} {...sw} />
      <circle cx={256} cy={118} r={7} fill={S} />
      <path d="M50 140 Q20 120 34 100 Q48 90 40 76" fill="none" {...sw} />
      <rect x={140} y={56} width={60} height={10} rx={5} fill={S} />
      {/* monedas que salen */}
      {draining &&
        coins.map((i) => {
          const ph = (T * 1.4 + i / coins.length) % 1;
          return (
            <g key={i} transform={`translate(${150 + i * 10 - 20} ${240 + ph * 70})`} opacity={1 - ph}>
              <ellipse rx={14} ry={14} fill={C.mostaza} stroke={S} strokeWidth={3} />
              <text y={6} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={16} fill={S}>
                €
              </text>
            </g>
          );
        })}
    </svg>
  );
};

/* ---------- Reloj ordenado (decisión 1) ---------- */
export const OrderedClock: React.FC<{ p: number; size?: number }> = ({ p, size = 230 }) => {
  const cols = [C.teal, C.tealClaro, C.teal, C.tealClaro];
  return (
    <svg viewBox="0 0 260 260" width={size} height={size}>
      <circle cx={130} cy={130} r={110} fill={C.blanco} {...sw} strokeWidth={6} />
      {cols.map((c, i) => (
        <path key={i} d={wedge(130, 130, 104, i * 3, i * 3 + 3 * Math.min(1, Math.max(0, p * 4 - i)))} fill={c} opacity={0.85} />
      ))}
      {[0, 3, 6, 9].map((h) => {
        const [x, y] = polar(130, 130, 104, h);
        return <line key={h} x1={130} y1={130} x2={x} y2={y} stroke={C.blanco} strokeWidth={5} />;
      })}
      <circle cx={130} cy={130} r={110} fill="none" {...sw} strokeWidth={6} />
      <circle cx={130} cy={130} r={10} fill={S} />
      <g transform={`translate(205 205) scale(${p})`}>
        <circle r={36} fill={C.verde} {...sw} />
        <path d="M-16 0 L-4 12 L18 -12" fill="none" stroke={C.blanco} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/* ---------- Tijeras cortando una factura + móvil con recordatorio (decisión 3) ---------- */
export const ScissorsPhone: React.FC<{ T: number; p: number; height?: number }> = ({ T, p, height = 240 }) => {
  const cut = Math.min(1, p * 1.4);
  const snip = Math.abs(Math.sin(T * 6)) * 18;
  const notif = Math.max(0, Math.min(1, p * 2 - 0.8));
  return (
    <svg viewBox="0 0 440 260" height={height} width={(height * 440) / 260}>
      {/* factura (dos mitades que se separan) */}
      <g transform={`translate(${-cut * 10} ${cut * 6}) rotate(${-cut * 6} 80 230)`}>
        <path d="M30 30 L130 30 L130 240 L30 240 Z" fill={C.blanco} {...sw} />
        {[70, 100, 130, 160].map((y) => (
          <line key={y} x1={48} x2={124} y1={y} y2={y} stroke={S} strokeWidth={3} opacity={0.4} />
        ))}
        <text x={50} y={64} fontFamily={FONT_TITLE} fontWeight={800} fontSize={34} fill={C.terracota}>
          €
        </text>
      </g>
      <g transform={`translate(${cut * 10} ${-cut * 4}) rotate(${cut * 6} 180 230)`}>
        <path d="M130 30 L210 30 L210 240 L130 240 Z" fill={C.blanco} {...sw} />
        {[70, 100, 130, 160].map((y) => (
          <line key={y} x1={136} x2={194} y1={y} y2={y} stroke={S} strokeWidth={3} opacity={0.4} />
        ))}
      </g>
      {/* tijeras */}
      <g transform={`translate(130 ${250 - 220 * cut})`}>
        <g transform={`rotate(${-snip})`}>
          <path d="M0 0 L-8 -70 L4 -70 Z" fill="#BFC6C6" {...sw} strokeWidth={3} />
          <circle cx={-14} cy={26} r={16} fill="none" stroke={C.terracota} strokeWidth={8} />
        </g>
        <g transform={`rotate(${snip})`}>
          <path d="M0 0 L8 -70 L-4 -70 Z" fill="#BFC6C6" {...sw} strokeWidth={3} />
          <circle cx={14} cy={26} r={16} fill="none" stroke={C.terracota} strokeWidth={8} />
        </g>
        <circle r={5} fill={S} />
      </g>
      {/* móvil con recordatorio de reserva */}
      <g transform="translate(270 20)">
        <rect x={0} y={0} width={140} height={230} rx={22} fill={S} />
        <rect x={10} y={22} width={120} height={186} rx={10} fill={C.crema} />
        <rect x={52} y={8} width={36} height={6} rx={3} fill="#555" />
        <g opacity={notif} transform={`translate(0 ${(1 - notif) * 20})`}>
          <rect x={16} y={40} width={108} height={88} rx={12} fill={C.blanco} stroke={C.teal} strokeWidth={4} />
          <path d="M42 62 Q42 50 52 50 Q62 50 62 62 L64 72 L40 72 Z" fill={C.mostaza} stroke={S} strokeWidth={2.5} />
          <circle cx={52} cy={76} r={4} fill={S} />
          <text x={70} y={68} fontFamily={FONT_TEXT} fontWeight={700} fontSize={15} fill={S}>
            Reserva
          </text>
          <text x={26} y={100} fontFamily={FONT_TEXT} fontWeight={500} fontSize={14} fill={S}>
            ¿Confirmas tu
          </text>
          <text x={26} y={118} fontFamily={FONT_TEXT} fontWeight={500} fontSize={14} fill={S}>
            mesa de hoy?
          </text>
        </g>
        <g opacity={notif}>
          <rect x={22} y={144} width={96} height={34} rx={17} fill={C.verde} stroke={S} strokeWidth={2.5} />
          <text x={70} y={167} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={17} fill={C.blanco}>
            Confirmar
          </text>
        </g>
      </g>
    </svg>
  );
};

/* ---------- Calendario 2025 con marzo marcado ---------- */
const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
export const Calendar: React.FC<{ mark: number; width?: number }> = ({ mark, width = 420 }) => (
  <svg viewBox="0 0 420 330" width={width} height={(width * 330) / 420}>
    <rect x={10} y={20} width={400} height={300} rx={18} fill={C.blanco} {...sw} />
    <rect x={10} y={20} width={400} height={64} rx={18} fill={C.teal} {...sw} />
    <rect x={14} y={64} width={392} height={20} fill={C.teal} />
    <line x1={10} y1={84} x2={410} y2={84} stroke={S} strokeWidth={4} />
    <text x={210} y={64} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={700} fontSize={34} fill={C.crema}>
      2025
    </text>
    {[90, 330].map((x) => (
      <rect key={x} x={x - 7} y={6} width={14} height={34} rx={7} fill={C.crema} {...sw} strokeWidth={3} />
    ))}
    {MONTHS.map((m, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 30 + col * 96;
      const y = 100 + row * 72;
      const isMar = i === 2;
      return (
        <g key={m}>
          <rect
            x={x}
            y={y}
            width={84}
            height={60}
            rx={10}
            fill={isMar ? C.mostaza : C.crema}
            stroke={S}
            strokeWidth={isMar ? 4 : 2}
            transform={isMar ? `translate(${x + 42} ${y + 30}) scale(${1 + 0.12 * mark}) translate(${-x - 42} ${-y - 30})` : undefined}
            opacity={isMar ? 0.35 + 0.65 * mark : 1}
          />
          <text x={x + 42} y={y + 40} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={24} fill={S}>
            {m}
          </text>
        </g>
      );
    })}
    {mark > 0 && (
      <circle cx={30 + 2 * 96 + 42} cy={130} r={48 + 6 * mark} fill="none" stroke={C.terracota} strokeWidth={5} strokeDasharray={`${300 * mark} 400`} />
    )}
  </svg>
);

/* ---------- Señal de aviso ---------- */
export const Warning: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg viewBox="0 0 100 90" width={size} height={(size * 90) / 100}>
    <path d="M50 6 L94 84 L6 84 Z" fill={C.mostaza} {...sw} strokeWidth={5} />
    <rect x={45} y={32} width={10} height={30} rx={5} fill={S} />
    <circle cx={50} cy={72} r={6} fill={S} />
  </svg>
);
