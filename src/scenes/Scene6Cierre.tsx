import React from "react";
import { AbsoluteFill } from "remotion";
import { Card, Label, Pill, useT } from "../components/ui";
import { C, CONTENT_H, FONT_TITLE, pop, prog } from "../theme";
import { at } from "../timing";
import { Facade, Pigeon, SolBuilding, StreetLamp, TerraceTable, Walker } from "../illustrations/madrid";

export const Scene6Cierre: React.FC<{ from: number }> = ({ from }) => {
  const T = useT(from);
  const t0 = at(5, "Cada acción");
  const tFunciona = at(5, "La Plazuela funciona");
  const tCobrar = at(5, "solo hay que cobrar");
  const tEmpezamos = at(5, "¿Empezamos");

  const zoom = 1 + 0.03 * prog(T, t0 - 0.6, 12);
  // reloj: 21:00 aprox. avanzando despacio
  const minuteDeg = (T - t0) * 6;
  const hourDeg = 270 + (T - t0) * 0.5;

  return (
    <AbsoluteFill>
      <svg width={1920} height={CONTENT_H} viewBox={`0 0 1920 ${CONTENT_H}`} style={{ position: "absolute", top: 0 }}>
        <defs>
          <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B9644E" />
            <stop offset="0.55" stopColor={C.terracotaClaro} />
            <stop offset="1" stopColor={C.mostazaClaro} />
          </linearGradient>
        </defs>
        <g transform={`translate(960 640) scale(${zoom}) translate(-960 -640)`}>
          <rect x={-20} y={-20} width={1960} height={700} fill="url(#dusk)" />
          <circle cx={700} cy={640} r={105} fill={C.mostaza} stroke={C.texto} strokeWidth={4} />
          <SolBuilding x={950} y={280} scale={0.6} minuteDeg={minuteDeg} hourDeg={hourDeg} dusk />
          <rect x={-20} y={640} width={1960} height={200} fill="#D9BE96" />
          <line x1={-20} y1={640} x2={1940} y2={640} stroke={C.texto} strokeWidth={4} />
          <Facade x={1250} y={243} scale={0.62} dusk />
          <StreetLamp x={1210} y={720} lit />
          <TerraceTable x={1380} y={760} s={0.8} colors={[C.teal, C.mostaza]} T={T} />
          <TerraceTable x={1600} y={780} s={0.8} colors={["#7A5C8E", C.terracotaClaro]} T={T} />
          <TerraceTable x={1810} y={760} s={0.8} colors={[C.terracota, C.tealClaro]} T={T} />
          <Walker x={560 + (T - t0) * 45} y={770} s={0.9} color={C.teal} phase={T * 9} />
          <Pigeon x={1100 + (T - t0) * 60} y={160} s={0.8} flap={T * 16} />
          <Pigeon x={1180 + (T - t0) * 55} y={200} s={0.6} flap={T * 16 + 1} />
        </g>
      </svg>

      <Card x={80} y={50} w={840} h={470} appear={pop(T, t0 - 0.3)} bg={C.crema}>
        <div style={{ padding: "30px 40px" }}>
          <Label size={27} weight={700} color={C.teal} style={{ whiteSpace: "nowrap" }}>
            Cada acción, con su indicador para seguir o parar a tiempo
          </Label>
          <div style={{ opacity: prog(T, tFunciona, 0.6), marginTop: 22 }}>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 72, whiteSpace: "nowrap", color: C.terracota, lineHeight: 1.05 }}>La Plazuela funciona:</div>
          </div>
          <div style={{ opacity: prog(T, tCobrar, 0.6), marginTop: 14 }}>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 48, color: C.texto, lineHeight: 1.15 }}>
              cobrar lo que vale y organizar las horas
            </div>
          </div>
          <div style={{ marginTop: 22, opacity: pop(T, tEmpezamos), transform: `scale(${0.8 + 0.2 * pop(T, tEmpezamos)})`, transformOrigin: "left center" }}>
            <Pill bg={C.mostaza} color={C.texto} size={34}>
              ¿Empezamos en enero?
            </Pill>
          </div>
        </div>
      </Card>

      <div style={{ position: "absolute", left: 80, top: 690, opacity: prog(T, tCobrar + 0.5, 0.8) }}>
        <Pill bg={C.texto} color={C.crema} size={32} style={{ padding: "14px 30px" }}>
          Rocío España · Herramientas Digitales UFV
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
