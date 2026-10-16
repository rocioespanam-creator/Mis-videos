import React from "react";
import { AbsoluteFill } from "remotion";
import { Big, Card, Header, Label, Pill, useT } from "../components/ui";
import { C, FONT_TEXT, FONT_TITLE, fmtInt, lerp, out, pop, prog } from "../theme";
import { at, atWord } from "../timing";
import { ClockAfternoon, EmptyTables, MenuBoard, PiggyBank } from "../illustrations/objects";

const EBITDA = [
  { year: "2022", v: 102040, color: C.teal },
  { year: "2023", v: 54604, color: C.mostaza },
  { year: "2024", v: -4822, color: C.rojo },
];

const EbitdaChart: React.FC<{ T: number; t0: number; tTags: number; tOk: number }> = ({ T, t0, tTags, tOk }) => {
  const zero = 440;
  const k = 240 / 102040;
  const xs = [300, 720, 1140];
  return (
    <svg viewBox="0 0 1760 600" width={1752} height={592}>
      <text x={60} y={70} fontFamily={FONT_TEXT} fontWeight={700} fontSize={34} fill={C.texto}>
        EBITDA por año
      </text>
      <line x1={60} y1={zero} x2={1360} y2={zero} stroke={C.texto} strokeWidth={4} />
      {EBITDA.map((d, i) => {
        const p = prog(T, t0 + 0.3 + i * 0.7, 1.1);
        const h = Math.abs(d.v) * k * p;
        const y = d.v >= 0 ? zero - h : zero;
        const val = d.v * p;
        const tag = pop(T, tTags + i * 0.25);
        return (
          <g key={d.year}>
            <rect x={xs[i] - 120} y={y} width={240} height={Math.max(h, 0.01)} rx={10} fill={d.color} stroke={C.texto} strokeWidth={4} />
            <text
              x={xs[i]}
              y={d.v >= 0 ? y - 22 : zero + h + 62}
              textAnchor="middle"
              fontFamily={FONT_TITLE}
              fontWeight={800}
              fontSize={60}
              fill={d.v >= 0 ? C.texto : C.rojo}
              opacity={p > 0 ? 1 : 0}
            >
              {fmtInt(val)} €
            </text>
            <text x={xs[i]} y={575} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={36} fill={C.texto}>
              {d.year}
            </text>
            {i > 0 && (
              <g opacity={tag} transform={`translate(${xs[i]} 140) scale(${0.7 + 0.3 * tag})`}>
                <line x1={0} y1={26} x2={0} y2={i === 1 ? 92 : 245} stroke={C.texto} strokeWidth={3} strokeDasharray="8 8" />
                <rect x={-150} y={-30} width={300} height={56} rx={28} fill={C.blanco} stroke={C.texto} strokeWidth={3} />
                <text y={10} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={28} fill={C.texto}>
                  {i === 1 ? "Baja la carta" : "Abren las tardes"}
                </text>
              </g>
            )}
          </g>
        );
      })}
      {/* clientes y calidad: igual que en 2022 */}
      {["Clientes", "Calidad"].map((s, i) => {
        const a = pop(T, tOk + i * 0.35);
        return (
          <g key={s} opacity={a} transform={`translate(1430 ${200 + i * 110}) scale(${0.8 + 0.2 * a})`}>
            <rect x={0} y={-44} width={290} height={88} rx={20} fill={C.crema} stroke={C.texto} strokeWidth={3} />
            <circle cx={42} cy={0} r={24} fill={C.verde} stroke={C.texto} strokeWidth={3} />
            <path d="M31 0 L39 9 L53 -8" fill="none" stroke={C.blanco} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <text x={80} y={-6} fontFamily={FONT_TEXT} fontWeight={700} fontSize={28} fill={C.texto}>
              {s}
            </text>
            <text x={80} y={26} fontFamily={FONT_TEXT} fontWeight={500} fontSize={24} fill={C.texto}>
              como en 2022
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const HBar: React.FC<{ label: string; value: number; color: string; p: number; max: number; width: number }> = ({ label, value, color, p, max, width }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, height: 62 }}>
    <Label size={30} weight={700} style={{ width: 140 }}>
      {label}
    </Label>
    <div style={{ width: (width * value * p) / max, height: 46, background: color, border: `3px solid ${C.texto}`, borderRadius: 10, opacity: p > 0 ? 1 : 0 }} />
    <Big size={46} style={{ opacity: p > 0 ? 1 : 0, whiteSpace: "nowrap" }}>
      {fmtInt(value * p)} €
    </Big>
  </div>
);

export const Scene2Diagnostico: React.FC<{ from: number }> = ({ from }) => {
  const T = useT(from);
  const t0 = at(1, "Lo primero");
  const tOk = at(1, "el problema no son");
  const tTags = at(1, "El problema son dos");
  const tCarta = at(1, "En 2023 se bajó");
  const tPrices = at(1, "el menú del día pasó");
  const t1280 = atWord(1, "el menú del día pasó", "12,80");
  const tDeja = at(1, "y cada menú empezó");
  const tTardes = at(1, "Y en 2024 abristeis");
  const tVenden = at(1, "venden unos");
  const tCuesta = at(1, "pero el equipo nuevo");
  const tMitad = at(1, "y la mitad de esas horas");
  const tRes = at(1, "Resultado");
  const tBenef = at(1, "el beneficio pasa");
  const tCaja = at(1, "y la caja se queda");

  const chartVis = out(T, tCarta - 0.5, 0.45) * prog(T, t0 - 0.4, 0.5);
  const cardsOut = out(T, tRes - 0.3, 0.45);
  const c1 = pop(T, tCarta) * cardsOut;
  const c2 = pop(T, tTardes) * cardsOut;
  const res = pop(T, tRes + 0.2);
  const caja = pop(T, tCaja - 0.6);

  return (
    <AbsoluteFill>
      <Header T={T} t0={t0 - 0.4} kicker="Diagnóstico" title="Dos decisiones que restan beneficio" />

      {chartVis > 0 && (
        <Card x={80} y={176} w={1760} h={600} appear={chartVis}>
          <EbitdaChart T={T} t0={t0} tTags={tTags} tOk={tOk} />
        </Card>
      )}

      {/* Tarjeta 1: la carta */}
      {c1 > 0.001 && (
        <Card x={80} y={176} w={840} h={604} appear={c1}>
          <div style={{ padding: "26px 36px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
            <Pill bg={C.mostaza} color={C.texto} size={28} style={{ alignSelf: "flex-start" }}>
              2023 · Se baja la carta
            </Pill>
            <div style={{ height: 300, marginTop: 14, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 340, height: 300 }}>
                <MenuBoard oldPrice="15,40 €" newPrice="12,80 €" strike={prog(T, tPrices + 0.6, 0.8)} showNew={prog(T, t1280 - 0.1, 0.5)} />
              </div>
            </div>
            <div style={{ marginTop: "auto", textAlign: "center", opacity: prog(T, tDeja, 0.5) }}>
              <Label size={34}>Cada menú deja</Label>
              <Big size={92} color={C.rojo} style={{ marginTop: 6 }}>
                2,58 € menos
              </Big>
            </div>
          </div>
        </Card>
      )}

      {/* Tarjeta 2: las tardes */}
      {c2 > 0.001 && (
        <Card x={1000} y={176} w={840} h={604} appear={c2}>
          <div style={{ padding: "26px 36px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
            <Pill bg={C.mostaza} color={C.texto} size={28} style={{ alignSelf: "flex-start" }}>
              2024 · Se abren las tardes (16–20 h)
            </Pill>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14, height: 200 }}>
              <ClockAfternoon p={prog(T, tTardes + 0.3, 1.2)} size={196} />
              <EmptyTables T={T} width={380} />
            </div>
            <div style={{ marginTop: 22 }}>
              <HBar label="Venden" value={68600} color={C.teal} p={prog(T, tVenden + 0.3, 1.0)} max={75400} width={400} />
              <HBar label="Cuestan" value={75400} color={C.rojo} p={prog(T, tCuesta + 0.4, 1.0)} max={75400} width={400} />
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 18, opacity: prog(T, tMitad, 0.5) }}>
              <Big size={80} color={C.rojo}>
                49%
              </Big>
              <Label size={34} weight={500}>
                de sus horas, sin clientes
              </Label>
            </div>
          </div>
        </Card>
      )}

      {/* Resultado: beneficio y caja */}
      {res > 0.001 && (
        <Card x={80} y={176} w={840} h={604} appear={res}>
          <div style={{ padding: "34px 44px" }}>
            <Label size={36} weight={700} color={C.teal}>
              Beneficio (EBITDA)
            </Label>
            <div style={{ marginTop: 34, display: "flex", alignItems: "baseline", gap: 20 }}>
              <Label size={36} weight={700} style={{ width: 100 }}>
                2022
              </Label>
              <Big size={96}>102.040 €</Big>
            </div>
            <svg width={120} height={110} style={{ marginLeft: 200, marginTop: 10 }} viewBox="0 0 120 110" opacity={prog(T, tBenef + 0.6, 0.5)}>
              <path d="M60 6 L60 80 M30 54 L60 86 L90 54" fill="none" stroke={C.rojo} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 20, opacity: prog(T, tBenef + 1.2, 0.5) }}>
              <Label size={36} weight={700} style={{ width: 100 }}>
                2024
              </Label>
              <Big size={96} color={C.rojo}>
                −4.822 €
              </Big>
            </div>
          </div>
        </Card>
      )}
      {caja > 0.001 && (
        <Card x={1000} y={176} w={840} h={604} appear={caja}>
          <div style={{ padding: "34px 44px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
            <Label size={36} weight={700} color={C.teal}>
              Caja
            </Label>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
              <PiggyBank level={0.9 - 0.45 * prog(T, tCaja, 1.6)} T={T} draining={T > tCaja && T < tCaja + 2.4} size={380} />
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 16 }}>
              <Label size={34}>de 111.000 a</Label>
              <Big size={92} color={C.rojo}>
                55.000 €
              </Big>
            </div>
          </div>
        </Card>
      )}
    </AbsoluteFill>
  );
};
