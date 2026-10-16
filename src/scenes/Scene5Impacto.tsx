import React from "react";
import { AbsoluteFill } from "remotion";
import { Big, Card, Header, Label, useT } from "../components/ui";
import { C, fmtInt, lerp, pop, prog } from "../theme";
import { at, atWord } from "../timing";
import { Calendar, Warning } from "../illustrations/objects";

export const Scene5Impacto: React.FC<{ from: number }> = ({ from }) => {
  const T = useT(from);
  const t0 = at(4, "Con las tres");
  const tCount = at(4, "La Plazuela pasa de perder");
  const tGanar = atWord(4, "La Plazuela pasa de perder", "ganar");
  const tAviso = at(4, "Eso sí");
  const tAplazar = at(4, "Hay que aplazar");
  const tMarzo = atWord(4, "Hay que aplazar", "marzo");

  const v = lerp(-4822, 27800, prog(T, tGanar - 0.6, 1.8));
  const color = v < 0 ? C.rojo : C.verde;
  const big = pop(T, t0 - 0.3);
  // desplazamiento de la tarjeta grande a la izquierda cuando llega el aviso
  const mv = prog(T, tAviso - 0.2, 0.7);
  const cal = pop(T, tAviso);

  return (
    <AbsoluteFill>
      <Header T={T} t0={t0 - 0.5} kicker="Impacto" title="Resultado esperado en 2025" />
      <Card x={lerp(360, 80, mv)} y={186} w={lerp(1200, 840, mv)} h={594} appear={big}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, textAlign: "center" }}>
          <Label size={lerp(44, 36, mv)} weight={700} color={C.teal}>
            EBITDA 2025 (escenario central)
          </Label>
          <Big size={lerp(190, 130, mv)} color={color} style={{ whiteSpace: "nowrap" }}>
            {v > 0 ? "+" : ""}
            {fmtInt(v)} €
          </Big>
          <div style={{ opacity: prog(T, tCount, 0.5) }}>
            <Label size={34}>
              desde <span style={{ color: C.rojo, fontWeight: 700 }}>−4.822 €</span> en 2024
            </Label>
          </div>
        </div>
      </Card>
      {cal > 0.001 && (
        <Card x={1000} y={186} w={840} h={594} appear={cal}>
          <div style={{ padding: "26px 40px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Warning size={64} />
              <Label size={38} weight={700}>
                Aviso: la caja va justa
              </Label>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
              <Calendar mark={prog(T, tMarzo - 0.2, 0.6)} width={400} />
            </div>
            <div style={{ marginTop: "auto", opacity: prog(T, tAplazar, 0.5) }}>
              <Label size={34}>Aplazar a marzo la inversión de</Label>
              <Big size={84} color={C.texto} style={{ marginTop: 4 }}>
                20.000 €
              </Big>
            </div>
          </div>
        </Card>
      )}
    </AbsoluteFill>
  );
};
