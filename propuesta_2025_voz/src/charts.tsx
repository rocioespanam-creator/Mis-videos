import React from "react";
import { C, FONT, fmt, p } from "./ui";

export type Col = { label: string; value: number; text: string; color: string; textColor?: string };

/**
 * Gráfico de columnas en HTML (las etiquetas largas pueden partirse en dos líneas).
 * Admite valores negativos (por debajo de la línea de cero). Las columnas se dibujan de izquierda a derecha.
 */
export const ColumnChart: React.FC<{
  t: number;
  at: number;
  stagger?: number;
  dur?: number;
  width: number;
  height: number;
  cols: Col[];
  colWidth?: number;
  valueSize?: number;
  labelSize?: number;
  labelH?: number;
  min?: number;
  max?: number;
  countUp?: boolean;
  decimals?: number;
  ats?: number[]; // momento de cada columna (si se da, sustituye a at + i·stagger)
}> = ({ t, at, ats, stagger = 0.4, dur = 0.6, width, height, cols, colWidth = 150, valueSize = 36, labelSize = 36, labelH = 56, min, max, countUp = false, decimals = 0 }) => {
  const vMax = max ?? Math.max(0, ...cols.map((c) => c.value));
  const vMin = min ?? Math.min(0, ...cols.map((c) => c.value));
  const top = valueSize + 18; // espacio para la cifra encima
  const negRoom = vMin < 0 ? valueSize + 18 : 0; // espacio para la cifra debajo de una columna negativa
  const plotH = height - labelH - top - negRoom;
  const k = plotH / (vMax - vMin);
  const zeroY = top + vMax * k;
  const slot = width / cols.length;
  return (
    <div style={{ position: "relative", width, height }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: zeroY - 1.5, height: 3, background: C.text, opacity: 0.8 }} />
      {cols.map((c, i) => {
        const t0 = ats?.[i] ?? at + i * stagger;
        const pr = p(t, t0, dur);
        const h = Math.abs(c.value) * k * pr;
        const x = slot * i + (slot - colWidth) / 2;
        const neg = c.value < 0;
        const shown = countUp ? fmt(c.value * pr, decimals) + c.text.replace(/^[−\d.,\s]+/, " ") : c.text;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: x,
                width: colWidth,
                top: neg ? zeroY : zeroY - h,
                height: Math.max(h, 0),
                background: c.color,
                borderRadius: neg ? "0 0 8px 8px" : "8px 8px 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: slot * i,
                width: slot,
                top: neg ? zeroY + h + 8 : zeroY - h - valueSize - 12,
                textAlign: "center",
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: valueSize,
                color: c.textColor ?? (neg ? C.red : C.text),
                opacity: p(t, t0 + dur * 0.6, 0.3),
                whiteSpace: "nowrap",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {shown}
            </div>
            <div
              style={{
                position: "absolute",
                left: slot * i,
                width: slot,
                top: height - labelH + 8,
                textAlign: "center",
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: labelSize,
                lineHeight: 1.15,
                color: C.text,
                opacity: p(t, t0, 0.3),
              }}
            >
              {c.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export type Step = { label: string; delta: number; text: string; kind: string };

/** Puente de caja en cascada horizontal: cada fila arranca donde acabó la anterior. */
export const Waterfall: React.FC<{ t: number; at: number; ats?: number[]; stagger: number; dur: number; width: number; steps: Step[]; rowH?: number; labelW?: number; valueW?: number }> = ({
  t,
  at,
  ats,
  stagger,
  dur,
  width,
  steps,
  rowH = 66,
  labelW = 470,
  valueW = 230,
}) => {
  let level = 0;
  const bars = steps.map((s) => {
    if (s.kind === "total" || s.kind === "final") {
      level = s.delta;
      return { from: 0, to: s.delta, ...s };
    }
    const from = level;
    level += s.delta;
    return { from, to: level, ...s };
  });
  const vMax = Math.max(...bars.map((b) => Math.max(b.from, b.to)));
  const plotW = width - labelW - valueW - 20;
  const k = plotW / vMax;
  return (
    <div style={{ position: "relative", width, height: rowH * steps.length }}>
      <div style={{ position: "absolute", left: labelW, top: 0, bottom: 0, width: 3, background: C.text, opacity: 0.8 }} />
      {bars.map((b, i) => {
        const t0 = ats?.[i] ?? at + i * stagger;
        const pr = p(t, t0, dur);
        const lo = Math.min(b.from, b.to);
        const hi = Math.max(b.from, b.to);
        const color = b.kind === "neg" ? C.red : b.kind === "pos" || b.kind === "final" ? C.green : C.grey;
        const w = (hi - lo) * k * pr;
        // las bajadas crecen hacia la izquierda desde el nivel anterior; las subidas, hacia la derecha
        const left = labelW + (b.kind === "neg" ? b.from * k - w : lo * k);
        const y = i * rowH;
        const next = bars[i + 1];
        const txtColor = b.kind === "neg" ? C.red : b.kind === "pos" || b.kind === "final" ? C.green : C.text;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: 0,
                width: labelW - 20,
                top: y,
                height: rowH,
                display: "flex",
                alignItems: "center",
                fontFamily: FONT,
                fontWeight: b.kind === "final" ? 800 : 600,
                fontSize: 36,
                color: b.kind === "final" ? C.green : C.text,
                opacity: p(t, t0, 0.3),
                whiteSpace: "nowrap",
              }}
            >
              {b.label}
            </div>
            <div
              style={{
                position: "absolute",
                left,
                width: w,
                top: y + 10,
                height: rowH - 20,
                background: color,
                borderRadius: 6,
                boxShadow: b.kind === "final" && w > 1 ? `0 0 0 4px ${C.bg}, 0 0 0 8px ${C.green}` : undefined,
              }}
            />
            {next && next.kind !== "final" && (
              <div
                style={{
                  position: "absolute",
                  left: labelW + b.to * k - 1.5,
                  top: y + rowH - 10,
                  height: 20,
                  borderLeft: `3px dashed ${C.text2}`,
                  opacity: p(t, ats?.[i + 1] ?? at + (i + 1) * stagger, 0.3),
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: width - valueW,
                width: valueW,
                top: y,
                height: rowH,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: b.kind === "final" ? 40 : 36,
                color: txtColor,
                opacity: p(t, t0 + dur * 0.6, 0.3),
                whiteSpace: "nowrap",
              }}
            >
              {b.text}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
