// Ilustraciones propias (SVG) para la versión "la carta de La Plazuela".
import React from "react";
import { Easing, interpolate } from "remotion";
import { C, FONT, p } from "./ui";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Campana de restaurante que se levanta y descubre lo que hay debajo (children). */
export const Cloche: React.FC<{ t: number; at: number; width: number; children: React.ReactNode; contentH?: number; label?: string }> = ({
  t,
  at,
  width,
  children,
  contentH = 220,
  label,
}) => {
  const lift = p(t, at, 0.9, Easing.inOut(Easing.cubic));
  const appear = p(t, at - 0.6, 0.5);
  const h = contentH + 60;
  return (
    <div style={{ position: "relative", width, height: h + 40, opacity: appear }}>
      {/* contenido descubierto, sobre fondo liso */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 50,
          height: contentH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          opacity: p(t, at + 0.35, 0.4),
        }}
      >
        {children}
      </div>
      {/* bandeja */}
      <svg width={width} height={60} viewBox={`0 0 ${width} 60`} style={{ position: "absolute", left: 0, bottom: 0 }}>
        <ellipse cx={width / 2} cy={22} rx={width / 2 - 10} ry={16} fill="#fff" stroke={C.text} strokeWidth={4} />
        <ellipse cx={width / 2} cy={20} rx={width / 2 - 60} ry={8} fill="none" stroke={C.line} strokeWidth={3} />
      </svg>
      {/* campana */}
      <svg
        width={width}
        height={h}
        viewBox={`0 0 ${width} ${h}`}
        style={{
          position: "absolute",
          left: 0,
          bottom: 30,
          transformOrigin: `${width * 0.85}px ${h}px`,
          transform: `translateY(${-lift * 160}px) rotate(${lift * 14}deg)`,
          opacity: 1 - p(t, at + 0.45, 0.45),
        }}
      >
        <path d={`M20 ${h - 6} Q20 18 ${width / 2} 18 Q${width - 20} 18 ${width - 20} ${h - 6} Z`} fill={C.grey} stroke={C.text} strokeWidth={4} />
        <path d={`M70 ${h - 30} Q80 70 ${width / 2 - 40} 50`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
        <rect x={width / 2 - 30} y={0} width={60} height={22} rx={11} fill={C.text} />
        <rect x={10} y={h - 10} width={width - 20} height={10} rx={5} fill={C.text} />
      </svg>
      {label && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -52, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.text }}>{label}</div>
      )}
    </div>
  );
};

/** Reloj con la franja 16:00–20:00 que se va sombreando. */
export const ShadedClock: React.FC<{ t: number; at: number; size?: number }> = ({ t, at, size = 420 }) => {
  const pr = p(t, at, 1.4, Easing.inOut(Easing.cubic));
  const r = 180;
  const ang = (h: number) => ((h % 12) / 12) * Math.PI * 2;
  const pt = (h: number, rr: number) => [210 + Math.sin(ang(h)) * rr, 210 - Math.cos(ang(h)) * rr];
  const endH = 4 + 4 * pr;
  const [x0, y0] = pt(4, r - 8);
  const [x1, y1] = pt(endH, r - 8);
  const hand = pt(endH, r - 70);
  return (
    <svg width={size} height={size} viewBox="0 0 420 420">
      <circle cx={210} cy={210} r={r + 12} fill={C.mainSoft} />
      <circle cx={210} cy={210} r={r} fill="#fff" stroke={C.text} strokeWidth={8} />
      {pr > 0.01 && <path d={`M210 210 L${x0} ${y0} A${r - 8} ${r - 8} 0 0 1 ${x1} ${y1} Z`} fill={C.red} opacity={0.85} />}
      {Array.from({ length: 12 }).map((_, i) => {
        const [a, b] = pt(i, r - 14);
        const [c, d] = pt(i, r - 36);
        return <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={C.text} strokeWidth={i % 3 === 0 ? 8 : 4} strokeLinecap="round" />;
      })}
      <line x1={210} y1={210} x2={hand[0]} y2={hand[1]} stroke={C.text} strokeWidth={12} strokeLinecap="round" />
      <line x1={210} y1={210} x2={210} y2={70} stroke={C.text} strokeWidth={7} strokeLinecap="round" transform={`rotate(${pr * 360 * 4} 210 210)`} />
      <circle cx={210} cy={210} r={14} fill={C.text} />
    </svg>
  );
};

/** Etiqueta de precio colgada que se balancea y gira para mostrar el nuevo precio. */
export const PriceTag: React.FC<{ t: number; at: number; flipAt: number; from: string; to: string }> = ({ t, at, flipAt, from, to }) => {
  const s = Math.max(0, t - at);
  const swing = Math.sin(s * 3.2) * 9 * Math.exp(-s * 0.7) + (t > flipAt ? Math.sin((t - flipAt) * 4) * 6 * Math.exp(-(t - flipAt) * 1.2) : 0);
  const flip = interpolate(t, [flipAt, flipAt + 0.6], [0, 180], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const showTo = flip > 90;
  return (
    <div style={{ position: "relative", width: 620, height: 520, opacity: p(t, at - 0.3, 0.4) }}>
      <svg width={620} height={120} viewBox="0 0 620 120" style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={310} cy={20} r={14} fill={C.text} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 20, width: 620, height: 500, transformOrigin: "310px 0px", transform: `rotate(${swing}deg)` }}>
        <svg width={620} height={110} viewBox="0 0 620 110" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M310 0 L190 110 M310 0 L430 110" stroke={C.text} strokeWidth={5} fill="none" />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 100,
            width: 500,
            height: 320,
            transform: `perspective(1400px) rotateY(${flip}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: showTo ? C.main : "#fff",
              border: `6px solid ${C.text}`,
              borderRadius: "40px 40px 28px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: showTo ? "rotateY(180deg)" : undefined,
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 17, border: `6px solid ${showTo ? "#fff" : C.text}`, position: "absolute", top: 26 }} />
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: showTo ? "#fff" : C.text2, marginTop: 50 }}>Menú M01</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 130, letterSpacing: -3, color: showTo ? "#fff" : C.text, lineHeight: 1.05 }}>{showTo ? to : from}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Cartel de puerta que gira de ABIERTO a CERRADO 16:00–20:00. */
export const DoorSign: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const s = Math.max(0, t - at);
  const flip = interpolate(t, [at + 0.6, at + 1.3], [0, 180], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const back = flip > 90;
  const swing = Math.sin(s * 3) * 6 * Math.exp(-s * 0.8);
  return (
    <div style={{ position: "relative", width: 600, height: 400, opacity: p(t, at - 0.3, 0.4) }}>
      <svg width={600} height={120} viewBox="0 0 600 120" style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={250} y={4} width={100} height={18} rx={9} fill={C.text} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 14, width: 600, height: 386, transformOrigin: "300px 0px", transform: `rotate(${swing}deg)` }}>
        <svg width={600} height={110} viewBox="0 0 600 110" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M300 0 L120 100 M300 0 L480 100" stroke={C.text} strokeWidth={5} fill="none" />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 90,
            width: 540,
            height: 280,
            transform: `perspective(1400px) rotateX(${flip}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: back ? C.red : C.green,
              border: `6px solid ${C.text}`,
              borderRadius: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: back ? "rotateX(180deg)" : undefined,
              color: "#fff",
              fontFamily: FONT,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 96, letterSpacing: 4 }}>{back ? "CERRADO" : "ABIERTO"}</div>
            {back && <div style={{ fontWeight: 700, fontSize: 64, marginTop: 6 }}>16:00–20:00</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Factura que unas tijeras recortan; el trozo cortado cae con la etiqueta −25%. */
export const CutInvoice: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const cut = p(t, at + 0.3, 1.0, Easing.inOut(Easing.quad));
  const fall = p(t, at + 1.3, 0.8, Easing.in(Easing.quad));
  const snip = Math.abs(Math.sin((t - at) * 9)) * 16 * (cut < 1 ? 1 : 0);
  const lines = [70, 120, 170, 220, 270];
  return (
    <svg width={600} height={640} viewBox="0 0 600 640" style={{ opacity: p(t, at - 0.3, 0.4) }}>
      {/* parte que se queda */}
      <path d="M120 40 L480 40 L480 380 L120 380 Z" fill="#fff" stroke={C.text} strokeWidth={6} strokeLinejoin="round" />
      {lines.map((y, i) => (
        <rect key={y} x={160} y={y} width={i === 0 ? 180 : 280} height={18} rx={9} fill={i === 0 ? C.main : C.line} />
      ))}
      <line x1={120} y1={380} x2={120 + 360 * cut} y2={380} stroke={C.text} strokeWidth={4} strokeDasharray="14 10" />
      {/* parte recortada */}
      <g transform={`translate(${fall * 20} ${fall * 50}) rotate(${fall * 8} 300 470)`}>
        <path d="M120 386 L480 386 L480 540 L120 540 Z" fill={C.redSoft} stroke={C.red} strokeWidth={6} strokeLinejoin="round" />
        <text x={300} y={490} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={84} fill={C.red}>
          −25%
        </text>
      </g>
      {/* tijeras */}
      <g transform={`translate(${100 + 380 * cut} 383)`} opacity={1 - p(t, at + 1.4, 0.4)}>
        <g transform={`rotate(${-snip})`}>
          <path d="M0 0 L-90 -14 L-90 6 Z" fill="#9FA6A6" stroke={C.text} strokeWidth={4} />
          <circle cx={30} cy={-26} r={22} fill="none" stroke={C.main} strokeWidth={10} />
        </g>
        <g transform={`rotate(${snip})`}>
          <path d="M0 0 L-90 14 L-90 -6 Z" fill="#9FA6A6" stroke={C.text} strokeWidth={4} />
          <circle cx={30} cy={26} r={22} fill="none" stroke={C.main} strokeWidth={10} />
        </g>
        <circle r={7} fill={C.text} />
      </g>
    </svg>
  );
};

/** Ticket de caja que sale impreso línea a línea. */
export const Ticket: React.FC<{ t: number; at: number; step: number; rows: { label: string; text: string; kind: string }[]; width?: number }> = ({
  t,
  at,
  step,
  rows,
  width = 820,
}) => {
  const rowH = 58;
  const total = rows.length;
  const shown = Math.min(total, Math.max(0, (t - at) / step + 1));
  const paperH = 110 + rowH * shown + 30;
  return (
    <div style={{ position: "relative", width, height: 110 + rowH * total + 60 }}>
      {/* impresora */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, background: C.text, borderRadius: 18 }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 36, height: 10, background: "#000", borderRadius: 5 }} />
      {/* papel */}
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 42,
          height: paperH,
          background: "#fff",
          boxShadow: "0 4px 0 rgba(0,0,0,0.06)",
          overflow: "hidden",
          clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),95% 100%,90% calc(100% - 12px),85% 100%,80% calc(100% - 12px),75% 100%,70% calc(100% - 12px),65% 100%,60% calc(100% - 12px),55% 100%,50% calc(100% - 12px),45% 100%,40% calc(100% - 12px),35% 100%,30% calc(100% - 12px),25% 100%,20% calc(100% - 12px),15% 100%,10% calc(100% - 12px),5% 100%,0 calc(100% - 12px))",
        }}
      >
        <div style={{ padding: "30px 34px 0", fontFamily: FONT }}>
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 36, letterSpacing: 4, color: C.text, borderBottom: `3px dashed ${C.grey}`, paddingBottom: 14 }}>
            PUENTE DE CAJA · CENTRAL
          </div>
          {rows.map((r, i) => {
            const a = p(t, at + i * step, 0.35);
            const col = r.kind === "neg" ? C.red : r.kind === "pos" || r.kind === "final" ? C.green : C.text;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: rowH,
                  opacity: a,
                  borderTop: r.kind === "final" ? `4px solid ${C.text}` : undefined,
                  background: r.kind === "final" ? C.greenSoft : undefined,
                  margin: r.kind === "final" ? "8px -34px 0" : undefined,
                  padding: r.kind === "final" ? "0 34px" : undefined,
                }}
              >
                <span style={{ fontSize: 36, fontWeight: r.kind === "final" ? 800 : 500, color: r.kind === "final" ? C.green : C.text }}>{r.label}</span>
                <span style={{ fontSize: r.kind === "final" ? 44 : 38, fontWeight: 800, color: col, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{r.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
