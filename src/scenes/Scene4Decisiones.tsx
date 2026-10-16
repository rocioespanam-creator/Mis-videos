import React from "react";
import { AbsoluteFill } from "remotion";
import { Big, Card, Header, Label, useT } from "../components/ui";
import { C, FONT_TEXT, fmtInt, pop, prog } from "../theme";
import { at } from "../timing";
import { MenuBoard, OrderedClock, ScissorsPhone } from "../illustrations/objects";

const Stamp: React.FC<{ p: number }> = ({ p }) => (
  <div
    style={{
      position: "absolute",
      right: 90,
      top: 52,
      opacity: Math.min(1, p * 1.5),
      transform: `rotate(-7deg) scale(${2.2 - 1.2 * p})`,
      border: `6px solid ${C.verde}`,
      borderRadius: 18,
      padding: "10px 30px",
      fontFamily: FONT_TEXT,
      fontWeight: 700,
      fontSize: 44,
      letterSpacing: 4,
      color: C.verde,
      background: C.blanco,
    }}
  >
    SIN INVERSIÓN
  </div>
);

const Decision: React.FC<{
  n: number;
  x: number;
  appear: number;
  active: boolean;
  title: string;
  note: string;
  amount: number;
  pAmount: number;
  children: React.ReactNode;
}> = ({ n, x, appear, active, title, note, amount, pAmount, children }) => (
  <Card x={x} y={186} w={540} h={594} appear={appear} border={active ? C.mostaza : C.texto} style={{ borderWidth: active ? 6 : 4 }}>
    <div style={{ padding: "22px 30px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          background: C.terracota,
          color: C.blanco,
          border: `3px solid ${C.texto}`,
          fontFamily: FONT_TEXT,
          fontWeight: 700,
          fontSize: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -20 }}>{children}</div>
      <Label size={36} weight={700} style={{ marginTop: 8 }}>
        {title}
      </Label>
      <Label size={25} style={{ marginTop: 8, opacity: 0.8 }}>
        {note}
      </Label>
      <div style={{ marginTop: "auto", opacity: pAmount > 0 ? 1 : 0 }}>
        <Big size={70} color={C.verde} style={{ whiteSpace: "nowrap" }}>
          +{fmtInt(amount * pAmount)} €
          <span style={{ fontSize: 36, fontFamily: FONT_TEXT, fontWeight: 700 }}> /año</span>
        </Big>
      </div>
    </div>
  </Card>
);

export const Scene4Decisiones: React.FC<{ from: number }> = ({ from }) => {
  const T = useT(from);
  const t0 = at(3, "Te propongo");
  const tSin = at(3, "y ninguna necesita");
  const t1 = at(3, "Una:");
  const a1 = at(3, "Unos 21.600");
  const t2 = at(3, "Dos:");
  const tSubir = at(3, "subir el menú");
  const a2 = at(3, "Unos 10.600");
  const t3 = at(3, "Tres:");
  const a3 = at(3, "Unos 4.150");

  const active = T < t2 - 0.3 ? 1 : T < t3 - 0.3 ? 2 : 3;

  return (
    <AbsoluteFill>
      <Header T={T} t0={t0 - 0.4} kicker="Plan 2025" title="Tres decisiones" />
      <Stamp p={pop(T, tSin + 0.4, 11)} />
      <Decision
        n={1}
        x={80}
        appear={pop(T, t1)}
        active={active === 1}
        title="Ordenar las tardes"
        note="Pagar solo las horas con clientes"
        amount={21600}
        pAmount={prog(T, a1 - 0.2, 0.7)}
      >
        <OrderedClock p={prog(T, t1 + 0.6, 2.4)} size={220} />
      </Decision>
      <Decision
        n={2}
        x={690}
        appear={pop(T, t2)}
        active={active === 2}
        title="Menú del día a 14 €"
        note="Aún por debajo de la media de Madrid"
        amount={10600}
        pAmount={prog(T, a2 - 0.2, 0.7)}
      >
        <div style={{ width: 250, height: 222 }}>
          <MenuBoard oldPrice="13,00 €" newPrice="14,00 €" strike={prog(T, tSubir + 0.5, 0.6)} showNew={prog(T, tSubir + 1.1, 0.5)} />
        </div>
      </Decision>
      <Decision
        n={3}
        x={1300}
        appear={pop(T, t3)}
        active={active === 3}
        title="Cortar gastos y no-shows"
        note="Reservas, tarjeta, equipos y recordatorios"
        amount={4150}
        pAmount={prog(T, a3 - 0.2, 0.7)}
      >
        <ScissorsPhone T={T} p={prog(T, t3 + 0.6, 3)} height={210} />
      </Decision>
    </AbsoluteFill>
  );
};
