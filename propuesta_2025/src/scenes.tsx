import React from "react";
import { AbsoluteFill } from "remotion";
import { S1, S10, S11, S12, S2, S3, S4, S5, S6, S7, S8, S9 } from "./content";
import { ColumnChart, Waterfall } from "./charts";
import { C, Card, Counter, Fade, FONT, ICONS, IconArrow, IconCheck, IconWarn, M, Notice, Tag, Title, Txt, p } from "./ui";

type SP = { t: number };

/** Marco común: etiqueta de sección + título, con 80 px de margen en todos los bordes. */
const Frame: React.FC<{ t: number; tag: string; title?: { text: string; at: number }; children: React.ReactNode }> = ({ t, tag, title, children }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", left: M, top: M, right: M, bottom: M + 8, // 8 px extra: la compresión no debe llevar bordes al margen
      display: "flex", flexDirection: "column" }}>
      <Tag text={tag} />
      {title && (
        <Fade t={t} at={title.at} dy={16} style={{ marginTop: 14 }}>
          <Title text={title.text} />
        </Fade>
      )}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", marginTop: 28 }}>{children}</div>
    </div>
  </AbsoluteFill>
);

const Big: React.FC<{ label: string; children: React.ReactNode; t: number; at: number; color?: string; labelColor?: string; align?: "left" | "center"; labelH?: number }> = ({
  label,
  children,
  t,
  at,
  labelColor = C.text2,
  align = "left",
  labelH,
}) => (
  <Fade t={t} at={at} style={{ textAlign: align }}>
    <Txt size={40} weight={600} color={labelColor} style={{ minHeight: labelH, display: "flex", alignItems: "flex-end" }}>
      {label}
    </Txt>
    <div style={{ marginTop: 10, display: "flex", justifyContent: align === "center" ? "center" : "flex-start" }}>{children}</div>
  </Fade>
);

/* ---------------- ESCENA 1 · Portada ---------------- */
export const Scene1: React.FC<SP> = ({ t }) => {
  const full = S1.title.text;
  const n = Math.round(full.length * p(t, S1.title.at, S1.title.anim!, (x) => x));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", left: M, top: M, right: M, bottom: M, display: "flex", flexDirection: "column" }}>
        <Tag text={S1.tag.text} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Fade t={t} at={S1.brand.at} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <svg width={84} height={84} viewBox="0 0 84 84">
              <circle cx={42} cy={42} r={38} fill="none" stroke={C.main} strokeWidth={6} />
              <circle cx={42} cy={42} r={24} fill={C.mainSoft} stroke={C.main} strokeWidth={4} />
            </svg>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.main, letterSpacing: -1 }}>{S1.brand.text}</div>
          </Fade>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 90, color: C.text, letterSpacing: -2, marginTop: 30, lineHeight: 1.05 }}>
            {full.slice(0, n)}
            <span style={{ opacity: 0 }}>{full.slice(n)}</span>
          </div>
          <div style={{ height: 8, width: 240 * p(t, S1.title.at + 0.6, 0.6), background: C.main, borderRadius: 4, marginTop: 34 }} />
          <Fade t={t} at={S1.sub.at} style={{ marginTop: 34, maxWidth: 1500 }}>
            <Txt size={52} weight={500}>
              {S1.sub.text}
            </Txt>
          </Fade>
        </div>
        <Fade t={t} at={S1.foot.at}>
          <Txt size={40} weight={600} color={C.text2}>
            {S1.foot.text}
          </Txt>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- ESCENA 2 · Recomendación ---------------- */
export const Scene2: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S2.tag.text} title={S2.title}>
    <Fade t={t} at={S2.text.at}>
      <Txt size={52} weight={600} color={C.main}>
        {S2.text.text}
      </Txt>
    </Fade>
    <div style={{ position: "relative", height: 460, marginTop: 40 }}>
      {/* Fase A: tres tarjetas, de izquierda a derecha */}
      <div style={{ position: "absolute", inset: 0, display: "flex", gap: 40 }}>
        {S2.cards.map((c, i) => (
          <Fade key={i} t={t} at={c.at} until={c.until} dx={-120} dy={0} dur={0.6} style={{ flex: 1 }}>
            <Card style={{ height: 380 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: C.main,
                  color: "#fff",
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <Txt size={48} weight={600} style={{ marginTop: 22 }}>
                {c.text}
              </Txt>
            </Card>
          </Fade>
        ))}
      </div>
      {/* Fase B: tres cifras con contador */}
      <div style={{ position: "absolute", inset: 0, display: "flex", gap: 40, alignItems: "flex-start" }}>
        {S2.kpis.map((k, i) => (
          <div key={i} style={{ flex: 1 }}>
            <Big label={k.label.text} t={t} at={k.label.at} labelH={100}>
              <Counter t={t} at={k.label.at} value={k.value} />
            </Big>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290 }}>
        <Fade t={t} at={S2.bottom1.at}>
          <Txt size={48} weight={700} color={C.green}>
            {S2.bottom1.text}
          </Txt>
        </Fade>
        <Fade t={t} at={S2.bottom2.at} style={{ marginTop: 8 }}>
          <Txt size={48} weight={500}>
            {S2.bottom2.text}
          </Txt>
        </Fade>
      </div>
    </div>
    <Fade t={t} at={S2.warn.at} style={{ marginTop: "auto" }}>
      <Notice kind="aviso">{S2.warn.text}</Notice>
    </Fade>
  </Frame>
);

/* ---------------- ESCENA 3 · Diagnóstico ---------------- */
export const Scene3: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S3.tag.text} title={S3.title}>
    <div style={{ display: "flex", gap: 40 }}>
      {[
        { title: S3.salesTitle, data: S3.sales, at: S3.salesAt, hl: S3.hl1 },
        { title: S3.ebitdaTitle, data: S3.ebitda, at: S3.ebitdaAt, hl: S3.hl2 },
      ].map((g, gi) => (
        <div key={gi} style={{ flex: 1 }}>
          <Fade t={t} at={g.title.at}>
            <Txt size={40} weight={700}>
              {g.title.text}
            </Txt>
          </Fade>
          <ColumnChart
            t={t}
            at={g.at}
            width={860}
            height={gi === 0 ? 330 : 330}
            colWidth={170}
            cols={g.data.map((d) => ({
              label: d.year,
              value: d.value,
              text: d.text,
              color: d.value < 0 ? C.red : gi === 0 ? C.main : d.year === "2022" ? C.text2 : C.grey,
            }))}
          />
          <Fade t={t} at={g.hl.at} style={{ marginTop: 18 }}>
            <div style={{ background: gi === 0 ? C.mainSoft : C.redSoft, borderRadius: 16, padding: "12px 20px" }}>
              <Txt size={40} weight={700} color={gi === 0 ? C.text : C.red}>
                {g.hl.text}
              </Txt>
            </div>
          </Fade>
        </div>
      ))}
    </div>
    <Fade t={t} at={S3.final.at} style={{ marginTop: "auto" }}>
      <Txt size={48} weight={600}>
        {S3.final.text}
      </Txt>
    </Fade>
  </Frame>
);

/* ---------------- ESCENA 4 · Franja de tarde ---------------- */
export const Scene4: React.FC<SP> = ({ t }) => {
  const max = 75360;
  const barH = 210;
  return (
    <Frame t={t} tag={S4.tag.text} title={S4.title}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 300 }}>
        {S4.bars.map((b, i) => {
          const pr = p(t, S4.barsAt + i * 0.5, 0.7);
          return (
            <div key={i} style={{ width: 360, display: "flex", flexDirection: "column", alignItems: "center", order: i === 0 ? 0 : 2 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.text, opacity: p(t, S4.barsAt + i * 0.5 + 0.4, 0.3) }}>{b.text}</div>
              <div style={{ width: 200, height: (barH * b.value * pr) / max, background: i === 0 ? C.main : C.text2, borderRadius: "8px 8px 0 0", marginTop: 10 }} />
              <div style={{ height: 3, width: 300, background: C.text }} />
              <Txt size={36} weight={600} style={{ marginTop: 6 }}>
                {b.label}
              </Txt>
            </div>
          );
        })}
        <div style={{ order: 1, flex: 1, textAlign: "center", alignSelf: "center" }}>
          <Counter t={t} at={S4.gap.at} value={S4.gap.value} color={C.red} size={130} style={{ justifyContent: "center" }} />
          <Fade t={t} at={S4.gapNote.at} style={{ marginTop: 14, padding: "0 30px" }}>
            <Txt size={36} weight={500} color={C.text2}>
              {S4.gapNote.text}
            </Txt>
          </Fade>
        </div>
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 34 }}>
        {S4.data.map((d, i) => (
          <Fade key={i} t={t} at={d.sub.at} dx={-60} dy={0} style={{ flex: 1 }}>
            <Counter t={t} at={d.sub.at} value={d.value} dec={d.dec} suffix={d.unit === "%" ? "%" : ""} size={120} color={C.main} />
            {d.unit !== "%" && (
              <Txt size={40} weight={700} color={C.main} style={{ marginTop: 4 }}>
                {d.unit}
              </Txt>
            )}
            <Txt size={36} weight={500} color={C.text2} style={{ marginTop: 6 }}>
              {d.sub.text}
            </Txt>
          </Fade>
        ))}
      </div>
      <Fade t={t} at={S4.final.at} style={{ marginTop: "auto" }}>
        <Notice kind="aviso" size={40}>
          {S4.final.text}
        </Notice>
      </Fade>
    </Frame>
  );
};

/* ---------------- ESCENA 5 · Referencia de precios ---------------- */
export const Scene5: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S5.tag.text} title={S5.title}>
    <div style={{ display: "flex", gap: 60 }}>
      <div>
        <Fade t={t} at={S5.chartTitle.at}>
          <Txt size={40} weight={700}>
            {S5.chartTitle.text}
          </Txt>
        </Fade>
        <ColumnChart
          t={t}
          at={S5.barsAt}
          stagger={0.35}
          width={1080}
          height={380}
          colWidth={130}
          labelH={96}
          min={0}
          cols={S5.bars.map((b) => ({ label: b.label, value: b.value, text: b.text, color: b.main ? C.main : C.grey, textColor: b.main ? C.main : C.text }))}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        <Counter t={t} at={S5.avg.at} value={S5.avg.value} dec={2} size={130} />
        <Fade t={t} at={S5.avgLabel.at}>
          <Txt size={36} weight={500} color={C.text2}>
            {S5.avgLabel.text}
          </Txt>
        </Fade>
        <Fade t={t} at={S5.proposal.at} style={{ marginTop: 14 }}>
          <div style={{ background: C.mainSoft, borderRadius: 16, padding: "14px 22px" }}>
            <Txt size={48} weight={800} color={C.main}>
              {S5.proposal.text}
            </Txt>
          </div>
        </Fade>
      </div>
    </div>
    <Fade t={t} at={S5.warn.at} style={{ marginTop: 24 }}>
      <Notice kind="aviso">{S5.warn.text}</Notice>
    </Fade>
    <Fade t={t} at={S5.final.at} style={{ marginTop: "auto" }}>
      <Txt size={48} weight={600}>
        {S5.final.text}
      </Txt>
    </Fade>
  </Frame>
);

/* ---------------- ESCENA 6 · Acción 1 ---------------- */
export const Scene6: React.FC<SP> = ({ t }) => {
  const morph = p(t, S6.to.at, 0.5);
  return (
    <Frame t={t} tag={S6.tag.text} title={S6.title}>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Fade t={t} at={S6.from.at}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.text2, letterSpacing: -2, opacity: 1 - 0.45 * morph }}>{S6.from.text}</div>
            </Fade>
            <IconArrow width={130} progress={p(t, S6.from.at + 0.3, 0.5)} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.main, letterSpacing: -2, opacity: morph, transform: `scale(${0.85 + 0.15 * morph})` }}>
              {S6.to.text}
            </div>
          </div>
          <Fade t={t} at={S6.text.at} style={{ marginTop: 6 }}>
            <Txt size={48} weight={600}>
              {S6.text.text}
            </Txt>
          </Fade>
        </div>
        <Fade t={t} at={S6.impactLabel.at} style={{ width: 560 }}>
          <div style={{ background: C.greenSoft, borderRadius: 24, padding: "24px 30px" }}>
            <Txt size={36} weight={600} color={C.text}>
              {S6.impactLabel.text}
            </Txt>
            <Counter t={t} at={S6.impactLabel.at} value={S6.impact.value} color={C.green} size={120} style={{ marginTop: 10 }} />
          </div>
        </Fade>
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: "auto" }}>
        <Fade t={t} at={S6.controlTitle.at} dx={-80} dy={0} style={{ flex: 1 }}>
          <Card style={{ height: "100%", padding: "22px 30px" }}>
            <Txt size={40} weight={800} color={C.main}>
              {S6.controlTitle.text}
            </Txt>
            {S6.control.map((c, i) => (
              <Fade key={i} t={t} at={c.at} style={{ display: "flex", gap: 14, marginTop: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: C.main, marginTop: 16, flexShrink: 0 }} />
                <Txt size={36} weight={500}>
                  {c.text}
                </Txt>
              </Fade>
            ))}
          </Card>
        </Fade>
        <Fade t={t} at={S6.alert[0].at} dx={-80} dy={0} style={{ flex: 1 }}>
          <div style={{ height: "100%", boxSizing: "border-box", background: C.redSoft, border: `4px solid ${C.red}`, borderRadius: 24, padding: "22px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <IconWarn size={48} />
              <Txt size={40} weight={800} color={C.red}>
                ALERTA
              </Txt>
            </div>
            {S6.alert.map((a, i) => (
              <Txt key={i} size={36} weight={600} color={C.red} style={{ marginTop: 14 }}>
                {a.text}
              </Txt>
            ))}
          </div>
        </Fade>
      </div>
    </Frame>
  );
};

/* ---------------- ESCENA 7 · Acción 2 ---------------- */
export const Scene7: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S7.tag.text} title={S7.title}>
    <div style={{ display: "flex", gap: 40, flex: 1 }}>
      <div style={{ flex: 1, position: "relative" }}>
        {/* Fase A: plan, comparativa y supuesto */}
        <div style={{ position: "absolute", inset: 0 }}>
          <Fade t={t} at={S7.plan.at} until={S7.plan.until}>
            <Txt size={48} weight={600}>
              {S7.plan.text}
            </Txt>
          </Fade>
          <div style={{ marginTop: 26 }}>
            {S7.bars.map((b, i) => {
              const pr = p(t, b.label.at, 0.8);
              return (
                <Fade key={i} t={t} at={b.label.at} until={b.label.until} style={{ marginTop: i ? 16 : 0 }}>
                  <Txt size={36} weight={600} color={C.text2}>
                    {b.label.text}
                  </Txt>
                  <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6 }}>
                    <div style={{ width: (720 * b.value * pr) / 6280, height: 50, background: b.green ? C.green : C.text2, borderRadius: 8 }} />
                    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: b.green ? C.green : C.text, whiteSpace: "nowrap", opacity: pr }}>{b.text}</div>
                  </div>
                </Fade>
              );
            })}
          </div>
          <Fade t={t} at={S7.assumption.at} until={S7.assumption.until} style={{ marginTop: 22 }}>
            <Txt size={36} weight={500} color={C.text2}>
              {S7.assumption.text}
            </Txt>
          </Fade>
        </div>
        {/* Fase B: condición para activar */}
        <div style={{ position: "absolute", inset: 0 }}>
          <Fade t={t} at={S7.condTitle.at}>
            <Txt size={48} weight={800} color={C.main}>
              {S7.condTitle.text}
            </Txt>
          </Fade>
          {S7.checks.map((c, i) => (
            <Fade key={i} t={t} at={c.at} dx={-60} dy={0} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
              <IconCheck on={p(t, c.at + 0.2, 0.4)} />
              <Txt size={48} weight={600}>
                {c.text}
              </Txt>
            </Fade>
          ))}
          <Fade t={t} at={S7.reassigned.at} style={{ marginTop: 24 }}>
            <Txt size={40} weight={700} color={C.red} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <IconWarn size={44} /> {S7.reassigned.text}
            </Txt>
          </Fade>
        </div>
      </div>
      <div style={{ width: 560, display: "flex", flexDirection: "column" }}>
        <Fade t={t} at={S7.impactLabel.at}>
          <div style={{ background: C.greenSoft, borderRadius: 24, padding: "24px 30px" }}>
            <Txt size={36} weight={600}>
              {S7.impactLabel.text}
            </Txt>
            <Counter t={t} at={S7.impactLabel.at} value={S7.impact.value} color={C.green} size={120} style={{ marginTop: 10 }} />
          </div>
        </Fade>
      </div>
    </div>
    <Fade t={t} at={S7.note.at} style={{ marginTop: 20 }}>
      <Notice kind="nota">{S7.note.text}</Notice>
    </Fade>
  </Frame>
);

/* ---------------- ESCENA 8 · Acción 3 ---------------- */
const MiniCalendar: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const months = ["ENE", "FEB", "MAR"];
  const pr = p(t, at + 0.5, 0.8);
  return (
    <div style={{ position: "relative", display: "flex", gap: 14, marginTop: 18 }}>
      {months.map((m, i) => (
        <div
          key={m}
          style={{
            width: 120,
            height: 70,
            borderRadius: 12,
            border: `3px solid ${C.text}`,
            background: i === 2 && pr > 0.95 ? C.mainSoft : i === 0 && pr < 0.05 ? C.mainSoft : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 36,
            color: C.text,
          }}
        >
          {m}
        </div>
      ))}
      <svg width={400} height={60} viewBox="0 0 400 60" style={{ position: "absolute", left: 0, top: 70 }}>
        <path d={`M60 8 Q200 ${60} ${60 + 268 * pr} 8`} fill="none" stroke={C.main} strokeWidth={6} strokeLinecap="round" />
        {pr > 0.95 && <path d="M316 2 L334 14 L314 22 Z" fill={C.main} />}
      </svg>
    </div>
  );
};

export const Scene8: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S8.tag.text} title={S8.title}>
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      <Fade t={t} at={S8.text.at} style={{ flex: 1 }}>
        <Txt size={48} weight={600}>
          {S8.text.text}
        </Txt>
      </Fade>
      <Fade t={t} at={S8.impactLabel.at} style={{ width: 560 }}>
        <div style={{ background: C.greenSoft, borderRadius: 24, padding: "20px 30px" }}>
          <Txt size={36} weight={600}>
            {S8.impactLabel.text}
          </Txt>
          <Counter t={t} at={S8.impactLabel.at} value={S8.impact.value} color={C.green} size={120} style={{ marginTop: 8 }} />
        </div>
      </Fade>
    </div>
    <div style={{ display: "flex", gap: 40, marginTop: 30 }}>
      {S8.cards.map((c, i) => (
        <Fade key={i} t={t} at={c.at} dx={-100} dy={0} dur={0.6} style={{ flex: 1 }}>
          <Card style={{ height: 320 }}>
            <Txt size={40} weight={600}>
              {c.text}
            </Txt>
            {i === 2 && <MiniCalendar t={t} at={c.at} />}
          </Card>
        </Fade>
      ))}
    </div>
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <Fade t={t} at={S8.warn.at}>
        <Notice kind="aviso">{S8.warn.text}</Notice>
      </Fade>
      <Fade t={t} at={S8.foot.at}>
        <Txt size={36} weight={600} color={C.text2}>
          {S8.foot.text}
        </Txt>
      </Fade>
    </div>
  </Frame>
);

/* ---------------- ESCENA 9 · Escenarios ---------------- */
export const Scene9: React.FC<SP> = ({ t }) => {
  const colors = [C.prudente, C.central, C.optimista];
  const max = 26596;
  const plotH = 300;
  return (
    <Frame t={t} tag={S9.tag.text} title={S9.title}>
      <Fade t={t} at={0.6} style={{ display: "flex", gap: 40 }}>
        {S9.legend.map((l, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: colors[i] }} />
            <Txt size={36} weight={600}>
              {l}
            </Txt>
          </div>
        ))}
      </Fade>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, borderBottom: `3px solid ${C.text}`, height: plotH + 56 }}>
        {S9.groups.map((g, gi) => (
          <div key={gi} style={{ width: 560, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10 }}>
            {g.values.map((v, i) => {
              const pr = p(t, S9.groupsAt + gi * 0.7 + i * 0.15, 0.9);
              return (
                <div key={i} style={{ width: 176, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap", opacity: p(t, S9.groupsAt + gi * 0.7 + i * 0.15 + 0.6, 0.3) }}>
                    {g.texts[i]}
                  </div>
                  <div style={{ width: 120, height: (plotH * v * pr) / max, background: colors[i], borderRadius: "8px 8px 0 0", marginTop: 8 }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {S9.groups.map((g, gi) => (
          <Fade key={gi} t={t} at={S9.groupsAt + gi * 0.7} style={{ width: 560, textAlign: "center", marginTop: 10 }}>
            <Txt size={40} weight={700}>
              {g.label}
            </Txt>
          </Fade>
        ))}
      </div>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <Fade t={t} at={S9.note.at}>
          <Notice kind="nota">{S9.note.text}</Notice>
        </Fade>
        <Fade t={t} at={S9.warn.at}>
          <Notice kind="aviso">{S9.warn.text}</Notice>
        </Fade>
      </div>
    </Frame>
  );
};

/* ---------------- ESCENA 10 · Caja ---------------- */
export const Scene10: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S10.tag.text} title={S10.title}>
    <div style={{ display: "flex", gap: 60 }}>
      <div style={{ width: 600 }}>
        <Fade t={t} at={S10.leftTitle.at}>
          <Txt size={40} weight={700}>
            {S10.leftTitle.text}
          </Txt>
        </Fade>
        <ColumnChart
          t={t}
          at={S10.scenAt}
          stagger={0.4}
          width={600}
          height={300}
          colWidth={130}
          cols={S10.scen.map((s, i) => ({ label: s.label, value: s.value, text: s.text, color: [C.prudente, C.central, C.optimista][i] }))}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Fade t={t} at={S10.rightTitle.at}>
          <Txt size={40} weight={700}>
            {S10.rightTitle.text}
          </Txt>
        </Fade>
        <div style={{ marginTop: 14 }}>
          <Waterfall t={t} at={S10.stepsAt} stagger={0.8} dur={0.6} width={1100} steps={S10.steps} rowH={54} />
        </div>
      </div>
    </div>
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <Fade t={t} at={S10.alert.at}>
        <Notice kind="alerta">{S10.alert.text}</Notice>
      </Fade>
      <Fade t={t} at={S10.final.at}>
        <Txt size={48} weight={600}>
          {S10.final.text}
        </Txt>
      </Fade>
    </div>
  </Frame>
);

/* ---------------- ESCENA 11 · Seguimiento ---------------- */
export const Scene11: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S11.tag.text} title={S11.title}>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {S11.rows.map((r, i) => {
        const Icon = ICONS[r.icon];
        const body = r.body.text.slice(r.head.length + 1).trim();
        return (
          <Fade key={i} t={t} at={r.body.at} dx={-100} dy={0} dur={0.6} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Icon size={60} />
            <Txt size={40} weight={500} style={{ flex: 1 }}>
              <b style={{ color: C.main }}>{r.head}:</b> {body}
            </Txt>
          </Fade>
        );
      })}
    </div>
    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 16 }}>
      {S11.timeline.map((s, i) => (
        <React.Fragment key={i}>
          <Fade t={t} at={s.at} dx={-60} dy={0} style={{ flex: i === 2 ? 1.5 : 1 }}>
            <div style={{ background: C.mainSoft, borderRadius: 16, padding: "14px 20px", borderLeft: `8px solid ${C.main}` }}>
              <Txt size={36} weight={600}>
                {s.text}
              </Txt>
            </div>
          </Fade>
          {i < 2 && (
            <div style={{ opacity: p(t, S11.timeline[i + 1].at, 0.3) }}>
              <IconArrow width={70} progress={p(t, S11.timeline[i + 1].at, 0.4)} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </Frame>
);

/* ---------------- ESCENA 12 · Cierre ---------------- */
export const Scene12: React.FC<SP> = ({ t }) => {
  const icons = [ICONS.price, ICONS.clock, ICONS.admin];
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", left: M, top: M, right: M, bottom: M, display: "flex", flexDirection: "column" }}>
        <Tag text={S12.tag.text} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <Fade t={t} at={S12.text.at} style={{ maxWidth: 1500 }}>
            <Txt size={56} weight={700}>
              {S12.text.text}
            </Txt>
          </Fade>
          <div style={{ display: "flex", gap: 90, marginTop: 70 }}>
            {S12.icons.map((ic, i) => {
              const Icon = icons[i];
              return (
                <Fade key={i} t={t} at={ic.at} dx={-60} dy={0} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 130, height: 130, borderRadius: 65, background: C.mainSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={72} />
                  </div>
                  <Txt size={44} weight={700}>
                    {ic.text}
                  </Txt>
                </Fade>
              );
            })}
          </div>
        </div>
        <Fade t={t} at={S12.foot.at} style={{ textAlign: "center" }}>
          <Txt size={36} weight={600} color={C.text2}>
            {S12.foot.text}
          </Txt>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

export const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene10, Scene11, Scene12];
