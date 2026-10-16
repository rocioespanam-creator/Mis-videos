import React from "react";
import { AbsoluteFill } from "remotion";
import { Big, Card, Header, Label, Pill, useT } from "../components/ui";
import { C, FONT_TEXT, FONT_TITLE, fmtDec, out, pop, prog } from "../theme";
import { at } from "../timing";

const YEARS = ["2022", "2023", "2024"];
const LP = [15.4, 12.8, 13.0];
const MAD = [13.9, 14.5, 14.8];

const LineChart: React.FC<{ T: number; tMad: number; tLp: number; tGap: number; tLow: number }> = ({ T, tMad, tLp, tGap, tLow }) => {
  const xs = [330, 860, 1390];
  const y = (v: number) => 540 - (v - 12) * 100;
  const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${xs[i]} ${y(v)}`).join(" ");
  const len = 1200;
  const pMad = prog(T, tMad, 1.6);
  const pLp = prog(T, tLp, 1.6);
  const gap = pop(T, tGap);
  const low = pop(T, tLow);
  const pt = (vals: number[], p: number, color: string, above: boolean[]) =>
    vals.map((v, i) => {
      const a = Math.max(0, Math.min(1, p * 2.2 - i * 0.6));
      const ly = above[i] ? y(v) - 34 : y(v) + 74;
      return (
        <g key={i} opacity={a}>
          <circle cx={xs[i]} cy={y(v)} r={14} fill={color} stroke={C.texto} strokeWidth={4} />
          <rect x={xs[i] - 92} y={ly - 46} width={184} height={60} rx={14} fill={C.blanco} stroke={color} strokeWidth={4} />
          <text x={xs[i]} y={ly - 2} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={800} fontSize={42} fill={C.texto}>
            {fmtDec(v)} €
          </text>
        </g>
      );
    });
  return (
    <svg viewBox="0 0 1760 600" width={1752} height={592}>
      <text x={60} y={66} fontFamily={FONT_TEXT} fontWeight={700} fontSize={34} fill={C.texto}>
        Precio del menú del día
      </text>
      {/* leyenda */}
      <g transform="translate(1100 54)">
        <line x1={0} y1={0} x2={50} y2={0} stroke={C.terracota} strokeWidth={10} strokeLinecap="round" />
        <text x={64} y={10} fontFamily={FONT_TEXT} fontWeight={700} fontSize={28} fill={C.texto}>
          La Plazuela
        </text>
        <line x1={290} y1={0} x2={340} y2={0} stroke={C.teal} strokeWidth={10} strokeLinecap="round" />
        <text x={354} y={10} fontFamily={FONT_TEXT} fontWeight={700} fontSize={28} fill={C.texto}>
          Media Madrid
        </text>
      </g>
      {[12, 13, 14, 15, 16].map((v) => (
        <g key={v}>
          <line x1={150} x2={1620} y1={y(v)} y2={y(v)} stroke={C.texto} strokeWidth={2} opacity={0.12} />
          <text x={130} y={y(v) + 9} textAnchor="end" fontFamily={FONT_TEXT} fontSize={26} fill={C.texto} opacity={0.6}>
            {v} €
          </text>
        </g>
      ))}
      {YEARS.map((yr, i) => (
        <text key={yr} x={xs[i]} y={590} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={34} fill={C.texto}>
          {yr}
        </text>
      ))}
      <path d={path(MAD)} fill="none" stroke={C.teal} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - pMad)} />
      <path d={path(LP)} fill="none" stroke={C.terracota} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - pLp)} />
      {pt(MAD, pMad, C.teal, [false, true, true])}
      {pt(LP, pLp, C.terracota, [true, false, false])}
      {/* 2022: más caro que la media */}
      <g opacity={gap} transform={`translate(${xs[0] + 60} 482) scale(${0.7 + 0.3 * gap})`}>
        <rect x={-215} y={-34} width={430} height={64} rx={32} fill={C.crema} stroke={C.texto} strokeWidth={3} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={28} fill={C.texto}>
          2022: +1,50 € sobre la media
        </text>
      </g>
      {/* 2023-2024: por debajo */}
      <g opacity={low} transform={`translate(${(xs[1] + xs[2]) / 2} 362) scale(${0.7 + 0.3 * low})`}>
        <rect x={-190} y={-30} width={380} height={56} rx={28} fill={C.terracota} stroke={C.texto} strokeWidth={3} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={28} fill={C.blanco}>
          Por debajo de la media
        </text>
      </g>
    </svg>
  );
};

const Pin: React.FC<{ x: number; y: number; color: string; price: string; p: number; big?: boolean; name?: string }> = ({ x, y, color, price, p, big, name }) => {
  if (p <= 0) return null;
  const s = big ? 1.3 : 1;
  return (
    <g transform={`translate(${x} ${y - (1 - Math.min(p, 1)) * 60})`} opacity={Math.min(1, p * 2)}>
      <g transform={`scale(${s})`}>
        <ellipse cx={0} cy={4} rx={16} ry={5} fill={C.texto} opacity={0.25} />
        <path d="M0 0 C -10 -18, -26 -30, -26 -48 A26 26 0 1 1 26 -48 C 26 -30, 10 -18, 0 0 Z" fill={color} stroke={C.texto} strokeWidth={4} />
        <circle cx={0} cy={-48} r={10} fill={C.blanco} stroke={C.texto} strokeWidth={3} />
      </g>
      <rect x={-88} y={-80 * s - 82} width={176} height={64} rx={16} fill={C.blanco} stroke={color} strokeWidth={big ? 6 : 4} />
      <text x={0} y={-80 * s - 36} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={800} fontSize={42} fill={C.texto}>
        {price}
      </text>
      {name && (
        <g>
          <rect x={-96} y={14} width={192} height={44} rx={22} fill={C.terracota} stroke={C.texto} strokeWidth={3} />
          <text x={0} y={45} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={26} fill={C.blanco}>
            {name}
          </text>
        </g>
      )}
    </g>
  );
};

const Road: React.FC<{ d: string; w?: number }> = ({ d, w = 30 }) => (
  <g>
    <path d={d} fill="none" stroke={C.texto} strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={C.blanco} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const SolMap: React.FC<{ T: number; tLp: number; tVec: number }> = ({ T, tLp, tVec }) => (
  <svg viewBox="0 0 1010 604" width={1002} height={596}>
    <rect width={1010} height={604} fill={C.cremaOscuro} />
    {/* manzanas */}
    {[
      [40, 150, 220, 110],
      [300, 150, 180, 120],
      [720, 130, 240, 90],
      [60, 330, 300, 100],
      [700, 300, 280, 100],
      [120, 520, 300, 80],
      [620, 470, 340, 60],
    ].map(([x, y, w, h], i) => (
      <rect key={i} x={x} y={y} width={w} height={h} rx={14} fill={i % 2 ? C.mostazaClaro : "#EFCFB9"} opacity={0.7} />
    ))}
    <Road d="M-20 120 Q 500 60 1030 70" w={44} />
    <Road d="M560 360 L 610 80" />
    <Road d="M470 360 L 350 90" />
    <Road d="M450 400 L -20 470" />
    <Road d="M430 370 L -20 300" />
    <Road d="M600 420 L 1030 520" />
    <Road d="M620 360 L 1030 250" />
    <Road d="M520 430 L 520 620" w={24} />
    {/* plaza */}
    <ellipse cx={520} cy={390} rx={140} ry={74} fill={C.blanco} stroke={C.texto} strokeWidth={4} />
    <text x={520} y={398} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={24} fill={C.texto} opacity={0.75}>
      Puerta del Sol
    </text>
    <text x={160} y={104} fontFamily={FONT_TEXT} fontWeight={700} fontSize={24} fill={C.texto} opacity={0.75} transform="rotate(-4 160 104)">
      Gran Vía
    </text>
    {/* árboles */}
    {[
      [100, 200], [150, 380], [880, 340], [940, 160], [420, 570], [980, 580],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={16} fill={C.teal} stroke={C.texto} strokeWidth={3} />
    ))}
    <Pin x={250} y={300} color={C.teal} price="13,90 €" p={pop(T, tVec)} />
    <Pin x={880} y={560} color={C.teal} price="14,00 €" p={pop(T, tVec + 0.4)} />
    <Pin x={190} y={560} color={C.teal} price="14,50 €" p={pop(T, tVec + 0.8)} />
    <Pin x={720} y={300} color={C.terracota} price="13,00 €" p={pop(T, tLp)} big name="La Plazuela" />
  </svg>
);

export const Scene3Mercado: React.FC<{ from: number }> = ({ from }) => {
  const T = useT(from);
  const t0 = at(2, "¿Y el mercado?");
  const t2022 = at(2, "En 2022 vuestro");
  const tSentido = at(2, "así que bajarlo");
  const tPasa = at(2, "Pero os pasasteis");
  const t13 = at(2, "hoy cobráis");
  const tBarato = at(2, "el menú más barato");
  const tVec = at(2, "Vuestros vecinos");
  const tMedia = at(2, "y la media de Madrid");
  const tSector = at(2, "Mientras tanto");
  const tBuena = at(2, "¿La buena noticia?");
  const tCasa = at(2, "El problema es de casa");

  const chartVis = prog(T, t0 - 0.5, 0.5) * out(T, t13 - 0.5, 0.45);
  const left = pop(T, t13 - 0.2);
  const map = pop(T, t13 - 0.1);

  return (
    <AbsoluteFill>
      <Header T={T} t0={t0 - 0.5} kicker="Mercado" title="La Plazuela frente a Madrid" />
      {chartVis > 0.001 && (
        <Card x={80} y={176} w={1760} h={600} appear={chartVis}>
          <LineChart T={T} tMad={t0 + 0.1} tLp={t2022} tGap={tSentido - 0.8} tLow={tPasa} />
        </Card>
      )}
      {left > 0.001 && (
        <Card x={80} y={176} w={700} h={604} appear={left}>
          <div style={{ padding: "26px 38px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Label size={30} weight={700} color={C.teal}>
              Menú del día · hoy
            </Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <Label size={34} weight={700}>
                La Plazuela
              </Label>
              <Big size={96} color={C.terracota}>
                13,00 €
              </Big>
            </div>
            <div style={{ opacity: pop(T, tBarato), transform: `scale(${0.85 + 0.15 * pop(T, tBarato)})`, transformOrigin: "left center" }}>
              <Pill bg={C.terracota} size={30}>
                El menú más barato de la zona
              </Pill>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", opacity: prog(T, tVec, 0.5), marginTop: 6 }}>
              <Label size={30}>Vecinos de Sol</Label>
              <Big size={50}>13,90 – 14,50 €</Big>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", opacity: prog(T, tMedia, 0.5) }}>
              <Label size={30}>Media de Madrid</Label>
              <Big size={50} color={C.teal}>
                14,80 €
              </Big>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: prog(T, tSector, 0.5) }}>
              <svg width={38} height={38} viewBox="0 0 38 38">
                <path d="M19 34 L19 6 M7 18 L19 5 L31 18" fill="none" stroke={C.teal} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Label size={28}>El sector subía precios y crecía</Label>
            </div>
            <div style={{ opacity: pop(T, tBuena + 0.3), transform: `scale(${0.85 + 0.15 * pop(T, tBuena + 0.3)})`, transformOrigin: "left center" }}>
              <Pill bg={C.verde} size={28}>
                {T < tCasa + 0.6 ? "¿La buena noticia?" : "Problema de casa: se puede arreglar"}
              </Pill>
            </div>
          </div>
        </Card>
      )}
      {map > 0.001 && (
        <Card x={830} y={176} w={1010} h={604} appear={map}>
          <SolMap T={T} tLp={t13} tVec={tVec} />
        </Card>
      )}
    </AbsoluteFill>
  );
};
