import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Big, Card, Label, Pill, useT } from "../components/ui";
import { C, CONTENT_H, FONT_TITLE, fmtDec, pop, prog } from "../theme";
import { at, atWord } from "../timing";
import { Cloud, Facade, OsoMadrono, Pigeon, Plant, SolBuilding, StreetLamp, TerraceTable, Walker } from "../illustrations/madrid";

const WALKERS = [
  { x0: 120, y: 744, s: 1.0, v: 70, color: C.teal },
  { x0: 520, y: 704, s: 0.8, v: -55, color: C.mostaza },
  { x0: 980, y: 770, s: 1.1, v: 60, color: C.terracota },
  { x0: 1350, y: 716, s: 0.85, v: -65, color: "#7A5C8E" },
  { x0: 1800, y: 758, s: 1.0, v: 80, color: C.tealClaro },
  { x0: 2300, y: 790, s: 1.1, v: -60, color: C.mostaza },
  { x0: 2550, y: 724, s: 0.9, v: 50, color: C.terracota },
  { x0: 3100, y: 800, s: 1.15, v: -70, color: C.teal },
  { x0: 3500, y: 706, s: 0.8, v: 55, color: "#7A5C8E" },
];

const PIGEONS = [
  { x0: 200, y: 180, v: 140, s: 1 },
  { x0: 300, y: 230, v: 150, s: 0.8 },
  { x0: 1300, y: 120, v: 120, s: 0.9 },
  { x0: 1420, y: 160, v: 130, s: 0.7 },
  { x0: 2400, y: 140, v: 140, s: 0.9 },
  { x0: 2600, y: 100, v: 125, s: 0.8 },
];

const WORLD = 3840;
const wrap = (x: number) => ((x % WORLD) + WORLD) % WORLD;

export const Scene1Sol: React.FC<{ from: number }> = ({ from }) => {
  const T = useT(from);
  const tSales = atWord(0, "en 2024 vendisteis", "1,16");
  const tPct = at(0, "un 14%");
  const tLoss = at(0, "el año cerró");

  const pan = interpolate(T, [3.6, 6.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const camX = -pan * 1920;
  const minuteDeg = T * 90;
  const hourDeg = 330 + T * 7.5;

  const title = pop(T, 0.3);
  const kpi = pop(T, tSales - 0.4);
  const sales = 1.16 * prog(T, tSales - 0.4, 1.4);
  const pct = pop(T, tPct);
  const loss = pop(T, tLoss);

  return (
    <AbsoluteFill>
      <svg width={1920} height={CONTENT_H} viewBox={`0 0 1920 ${CONTENT_H}`} style={{ position: "absolute", top: 0 }}>
        <g transform={`translate(${camX} 0)`}>
          <rect x={-10} y={0} width={WORLD + 20} height={CONTENT_H} fill={C.cielo} />
          <circle cx={1720} cy={130} r={62} fill={C.mostaza} stroke={C.texto} strokeWidth={4} />
          {[
            [260, 300, 1],
            [1500, 260, 0.8],
            [2250, 200, 1.1],
            [3000, 120, 0.9],
          ].map(([cx, cy, s], i) => (
            <Cloud key={i} x={cx + T * 8 - pan * -600} y={cy} s={s} />
          ))}
          {/* suelo */}
          <rect x={-10} y={640} width={WORLD + 20} height={CONTENT_H - 640} fill={C.suelo} />
          <line x1={-10} y1={640} x2={WORLD + 10} y2={640} stroke={C.texto} strokeWidth={4} />
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={i} x1={i * 100} y1={640} x2={i * 100 - 60} y2={CONTENT_H} stroke={C.texto} strokeWidth={2} opacity={0.12} />
          ))}

          {/* Puerta del Sol */}
          <SolBuilding x={560} y={40} minuteDeg={minuteDeg} hourDeg={hourDeg} />
          <StreetLamp x={300} y={700} />
          <StreetLamp x={1420} y={700} />
          <OsoMadrono x={1640} y={700} scale={1.05} />

          {/* calle de La Plazuela */}
          <rect x={2440} y={180} width={280} height={460} fill={C.terracotaClaro} stroke={C.texto} strokeWidth={4} />
          {[230, 360, 490].map((wy) => (
            <rect key={wy} x={2560} y={wy} width={70} height={90} fill="#CFE6E2" stroke={C.texto} strokeWidth={3} />
          ))}
          <Facade x={2740} y={0} />
          <StreetLamp x={2720} y={700} />
          <Plant x={3175} y={690} />
          <Plant x={3365} y={690} />
          <TerraceTable x={2870} y={740} colors={[C.teal, C.mostaza]} T={T} />
          <TerraceTable x={3080} y={770} colors={["#7A5C8E", C.terracotaClaro]} T={T} />
          <TerraceTable x={3480} y={770} colors={[C.mostaza, C.teal]} T={T} />
          <TerraceTable x={3690} y={740} colors={[C.terracota, C.tealClaro]} T={T} />

          {WALKERS.map((w, i) => (
            <Walker key={i} x={wrap(w.x0 + w.v * T)} y={w.y} s={w.s} color={w.color} phase={T * 9 + i} dir={w.v > 0 ? 1 : -1} />
          ))}
          {PIGEONS.map((p, i) => (
            <Pigeon key={i} x={wrap(p.x0 + p.v * T)} y={p.y + Math.sin(T * 2 + i) * 14} s={p.s} flap={T * 16 + i} />
          ))}
        </g>
      </svg>

      {/* Título */}
      <Card x={60} y={40} w={640} h={196} appear={title} bg={C.crema}>
        <div style={{ padding: "26px 40px" }}>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 86, color: C.terracota, lineHeight: 1 }}>La Plazuela</div>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 46, color: C.texto, marginTop: 12 }}>
            <span style={{ color: C.mostaza }}>·</span> Un plan para 2025
          </div>
        </div>
      </Card>

      {/* Dato clave: ventas */}
      <Card x={60} y={272} w={640} h={330} appear={kpi}>
        <div style={{ padding: "30px 40px" }}>
          <Label size={36} weight={700} color={C.teal}>
            Ventas 2024
          </Label>
          <Big size={140} style={{ marginTop: 10, whiteSpace: "nowrap" }}>
            {fmtDec(sales)} M€
          </Big>
          <div style={{ marginTop: 26, opacity: pct, transform: `scale(${0.8 + 0.2 * pct})`, transformOrigin: "left center" }}>
            <Pill bg={C.verde} size={36}>
              +14% desde 2022
            </Pill>
          </div>
        </div>
      </Card>

      {/* …y aun así, pérdidas */}
      <Card x={60} y={630} w={640} h={110} appear={loss} bg={C.blanco} border={C.rojo}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 34px", gap: 18 }}>
          <svg width={54} height={54} viewBox="0 0 54 54">
            <circle cx={27} cy={27} r={24} fill={C.rojo} stroke={C.texto} strokeWidth={3} />
            <path d="M27 14 L27 34 M19 27 L27 36 L35 27" stroke={C.blanco} strokeWidth={5} fill="none" strokeLinecap="round" />
          </svg>
          <Label size={32} weight={700} color={C.rojo} style={{ whiteSpace: "nowrap" }}>
            Y aun así, 2024 cerró en pérdidas
          </Label>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
