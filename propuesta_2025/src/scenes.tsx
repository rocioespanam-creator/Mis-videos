import React from "react";
import { AbsoluteFill } from "remotion";
import { S1, S2, S3, S4, S5, S6, S7, S8, S9 } from "./content";
import { Cloche, CutInvoice, DoorSign, PriceTag, ShadedClock, Ticket } from "./illus";
import { C, Counter, Fade, FONT, ICONS, IconCheck, M, Notice, Tag, Title, Txt, p } from "./ui";

type SP = { t: number };

/** Adorno de carta de restaurante: doble filete que se dibuja. */
const Ornament: React.FC<{ t: number; width?: number }> = ({ t, width = 1760 }) => {
  const w = width * p(t, 0.1, 0.8);
  return (
    <svg width={width} height={30} viewBox={`0 0 ${width} 30`} style={{ display: "block", marginTop: 10, flexShrink: 0 }}>
      <line x1={0} y1={11} x2={w} y2={11} stroke={C.main} strokeWidth={2} />
      <line x1={0} y1={18} x2={w} y2={18} stroke={C.main} strokeWidth={2} opacity={0.5} />
    </svg>
  );
};

/** Marco común: etiqueta de sección + filete + título, con margen de seguridad de 80 px (+8 abajo). */
const Frame: React.FC<{ t: number; tag: string; title?: { text: string; at: number }; children: React.ReactNode }> = ({ t, tag, title, children }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", left: M, top: M, right: M, bottom: M + 8, display: "flex", flexDirection: "column" }}>
      <Tag text={tag} />
      <Ornament t={t} />
      {title && (
        <Fade t={t} at={title.at} dy={16} style={{ marginTop: 6 }}>
          <Title text={title.text} />
        </Fade>
      )}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", marginTop: 24 }}>{children}</div>
    </div>
  </AbsoluteFill>
);

const Impact: React.FC<{ t: number; label: { text: string; at: number }; value: number; width?: number }> = ({ t, label, value, width = 640 }) => (
  <Fade t={t} at={label.at} dx={60} dy={0} style={{ width }}>
    <div style={{ background: C.greenSoft, borderRadius: 28, padding: "24px 34px", border: `3px solid ${C.green}` }}>
      <Txt size={36} weight={600}>
        {label.text}
      </Txt>
      <Counter t={t} at={label.at} value={value} color={C.green} size={120} style={{ marginTop: 8 }} />
    </div>
  </Fade>
);

/* ---------- 1 · Portada: la carta ---------- */
export const Scene1: React.FC<SP> = ({ t }) => {
  const full = S1.title.text;
  const n = Math.round(full.length * p(t, S1.title.at, S1.title.anim!, (x) => x));
  const open = p(t, 0, 0.9);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", left: M, top: M, right: M, bottom: M, display: "flex", flexDirection: "column" }}>
        <Tag text={S1.tag.text} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 1500,
              padding: "56px 80px",
              background: "#fff",
              border: `3px solid ${C.main}`,
              outline: `2px solid ${C.main}`,
              outlineOffset: -18,
              borderRadius: 12,
              textAlign: "center",
              transform: `perspective(1600px) rotateX(${(1 - open) * 40}deg) scale(${0.9 + 0.1 * open})`,
              opacity: open,
            }}
          >
            <Fade t={t} at={S1.brand.at} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
              <svg width={70} height={70} viewBox="0 0 70 70">
                <path d="M18 6 L18 64 M10 6 L10 24 Q10 32 18 32 Q26 32 26 24 L26 6" fill="none" stroke={C.main} strokeWidth={5} strokeLinecap="round" />
                <path d="M50 64 L50 6 Q62 14 62 34 L50 38" fill="none" stroke={C.main} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.main, letterSpacing: -1 }}>{S1.brand.text}</div>
            </Fade>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 90, color: C.text, letterSpacing: -2, marginTop: 26, lineHeight: 1.05 }}>
              {full.slice(0, n)}
              <span style={{ opacity: 0 }}>{full.slice(n)}</span>
            </div>
            <div style={{ height: 6, width: 260 * p(t, S1.title.at + 0.6, 0.6), background: C.main, borderRadius: 3, margin: "30px auto 0" }} />
            <Fade t={t} at={S1.sub.at} style={{ marginTop: 28 }}>
              <Txt size={52} weight={500}>
                {S1.sub.text}
              </Txt>
            </Fade>
          </div>
        </div>
        <Fade t={t} at={S1.foot.at} style={{ textAlign: "center" }}>
          <Txt size={40} weight={600} color={C.text2}>
            {S1.foot.text}
          </Txt>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2 · Diagnóstico: dos campanas ---------- */
export const Scene2: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S2.tag.text} title={S2.title}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {[
        { d: S2.sales, color: C.main },
        { d: S2.ebitda, color: C.red },
      ].map(({ d, color }, i) => (
        <div key={i} style={{ width: 820, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Cloche t={t} at={d.label.at} width={820} contentH={210}>
            <Txt size={40} weight={700} color={C.text2}>
              {d.label.text}
            </Txt>
            <Counter t={t} at={d.label.at + 0.5} value={d.value} color={color} size={120} style={{ marginTop: 6 }} />
          </Cloche>
          <Fade t={t} at={d.from.at} style={{ marginTop: 14 }}>
            <Txt size={40} weight={600} color={C.text2}>
              {d.from.text}
            </Txt>
          </Fade>
        </div>
      ))}
    </div>
    <div style={{ marginTop: "auto", display: "flex", gap: 30, alignItems: "center" }}>
      <Fade t={t} at={S2.hl.at} dx={-60} dy={0}>
        <div style={{ background: C.mainSoft, borderRadius: 999, padding: "12px 30px", whiteSpace: "nowrap" }}>
          <Txt size={44} weight={800} color={C.main}>
            {S2.hl.text}
          </Txt>
        </div>
      </Fade>
    </div>
    <Fade t={t} at={S2.final.at} style={{ marginTop: 20 }}>
      <Txt size={48} weight={600}>
        {S2.final.text}
      </Txt>
    </Fade>
  </Frame>
);

/* ---------- 3 · Franja de tarde: reloj ---------- */
export const Scene3: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S3.tag.text} title={S3.title}>
    <div style={{ display: "flex", gap: 70, alignItems: "center", flex: 1 }}>
      <Fade t={t} at={S3.clockAt - 0.3} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ShadedClock t={t} at={S3.clockAt} size={470} />
        <Txt size={48} weight={800} color={C.red} style={{ marginTop: 6 }}>
          {S3.clockLabel.text}
        </Txt>
      </Fade>
      <div style={{ flex: 1 }}>
        <Counter t={t} at={S3.gap.at} value={S3.gap.value} color={C.red} size={150} />
        <Fade t={t} at={S3.gapNote.at} style={{ marginTop: 12 }}>
          <Txt size={36} weight={500} color={C.text2}>
            {S3.gapNote.text}
          </Txt>
        </Fade>
        <div style={{ display: "flex", gap: 20, marginTop: 26 }}>
          {S3.chips.map((c, i) => (
            <Fade key={i} t={t} at={c.at} dx={-40} dy={0}>
              <div style={{ border: `3px solid ${i ? C.text2 : C.main}`, borderRadius: 999, padding: "10px 26px", whiteSpace: "nowrap" }}>
                <Txt size={40} weight={700} color={i ? C.text : C.main}>
                  {c.text}
                </Txt>
              </div>
            </Fade>
          ))}
        </div>
        <Fade t={t} at={S3.hours.at} style={{ marginTop: 34 }}>
          <Notice kind="alerta" size={40}>
            {S3.hours.text}
          </Notice>
        </Fade>
      </div>
    </div>
  </Frame>
);

/* ---------- 4 · Recomendación: tres platos ---------- */
export const Scene4: React.FC<SP> = ({ t }) => {
  const icons = [ICONS.price, ICONS.clock, ICONS.admin];
  return (
    <Frame t={t} tag={S4.tag.text} title={S4.title}>
      <Fade t={t} at={S4.text.at}>
        <Txt size={52} weight={600} color={C.main}>
          {S4.text.text}
        </Txt>
      </Fade>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", marginBottom: 60 }}>
        {S4.dishes.map((d, i) => {
          const Icon = icons[i];
          return (
            <Cloche key={i} t={t} at={d.at} width={540} contentH={200} label={d.text}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 170, height: 170, borderRadius: 85, background: C.mainSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={96} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: -24,
                    top: -10,
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
              </div>
            </Cloche>
          );
        })}
      </div>
    </Frame>
  );
};

/* ---------- 5 · Acción 1: etiqueta de precio ---------- */
export const Scene5: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S5.tag.text} title={S5.title}>
    <div style={{ display: "flex", gap: 60, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <PriceTag t={t} at={S5.tagAt} flipAt={S5.flipAt} from={S5.from} to={S5.to} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Fade t={t} at={S5.text.at}>
          <Txt size={52} weight={600}>
            {S5.text.text}
          </Txt>
        </Fade>
        <div style={{ marginTop: 34 }}>
          <Impact t={t} label={S5.impactLabel} value={S5.impact.value} />
        </div>
        <Fade t={t} at={S5.alert.at} style={{ marginTop: "auto" }}>
          <Notice kind="alerta" size={40}>
            {S5.alert.text}
          </Notice>
        </Fade>
      </div>
    </div>
  </Frame>
);

/* ---------- 6 · Acción 2: cartel de la puerta ---------- */
export const Scene6: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S6.tag.text} title={S6.title}>
    <div style={{ display: "flex", gap: 60, flex: 1 }}>
      <div style={{ width: 600, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <DoorSign t={t} at={S6.signAt} />
        <Impact t={t} label={S6.impactLabel} value={S6.impact.value} width={600} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Fade t={t} at={S6.plan.at}>
          <Txt size={48} weight={600}>
            {S6.plan.text}
          </Txt>
        </Fade>
        <div style={{ marginTop: "auto", background: "#fff", border: `3px solid ${C.line}`, borderRadius: 24, padding: "24px 32px" }}>
          <Fade t={t} at={S6.condTitle.at}>
            <Txt size={44} weight={800} color={C.main}>
              {S6.condTitle.text}
            </Txt>
          </Fade>
          {S6.checks.map((c, i) => (
            <Fade key={i} t={t} at={c.at} dx={-40} dy={0} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16 }}>
              <IconCheck on={p(t, c.at + 0.2, 0.4)} size={52} />
              <Txt size={44} weight={600}>
                {c.text}
              </Txt>
            </Fade>
          ))}
        </div>
      </div>
    </div>
  </Frame>
);

/* ---------- 7 · Acción 3: tijeras ---------- */
export const Scene7: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S7.tag.text} title={S7.title}>
    <div style={{ display: "flex", gap: 60, flex: 1, alignItems: "center" }}>
      <CutInvoice t={t} at={S7.cutAt} />
      <div style={{ flex: 1 }}>
        <Fade t={t} at={S7.text.at}>
          <Txt size={52} weight={600}>
            {S7.text.text}
          </Txt>
        </Fade>
        <div style={{ marginTop: 34 }}>
          <Impact t={t} label={S7.impactLabel} value={S7.impact.value} />
        </div>
        <Fade t={t} at={S7.equip.at} style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 20 }}>
          <svg width={70} height={70} viewBox="0 0 70 70" style={{ flexShrink: 0 }}>
            <rect x={5} y={12} width={60} height={52} rx={8} fill="#fff" stroke={C.text} strokeWidth={5} />
            <rect x={5} y={12} width={60} height={16} rx={6} fill={C.main} />
            <rect x={17} y={4} width={6} height={16} rx={3} fill={C.text} />
            <rect x={47} y={4} width={6} height={16} rx={3} fill={C.text} />
            <path d="M18 46 L48 46 M40 38 L48 46 L40 54" stroke={C.main} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Txt size={44} weight={600}>
            {S7.equip.text}
          </Txt>
        </Fade>
      </div>
    </div>
  </Frame>
);

/* ---------- 8 · Caja: ticket impreso ---------- */
export const Scene8: React.FC<SP> = ({ t }) => (
  <Frame t={t} tag={S8.tag.text} title={S8.title}>
    <div style={{ display: "flex", gap: 60, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Fade t={t} at={S8.ebitdaLabel.at}>
          <Txt size={40} weight={600} color={C.text2}>
            {S8.ebitdaLabel.text}
          </Txt>
          <Counter t={t} at={S8.ebitdaLabel.at} value={S8.ebitda.value} color={C.green} size={130} style={{ marginTop: 6 }} />
        </Fade>
        <Fade t={t} at={S8.mejora.at} style={{ marginTop: 18 }}>
          <Txt size={48} weight={700} color={C.green}>
            {S8.mejora.text}
          </Txt>
        </Fade>
        <Fade t={t} at={S8.alert.at} style={{ marginTop: "auto" }}>
          <Notice kind="alerta">{S8.alert.text}</Notice>
        </Fade>
      </div>
      <div style={{ width: 860, display: "flex", flexDirection: "column" }}>
        <Ticket t={t} at={S8.ticketAt} step={S8.ticketStep} rows={S8.rows} width={860} />
        <Fade t={t} at={S8.warn.at} style={{ marginTop: "auto", alignSelf: "center" }}>
          <Notice kind="aviso">{S8.warn.text}</Notice>
        </Fade>
      </div>
    </div>
  </Frame>
);

/* ---------- 9 · Cierre ---------- */
export const Scene9: React.FC<SP> = ({ t }) => {
  const icons = [ICONS.price, ICONS.clock, ICONS.admin];
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", left: M, top: M, right: M, bottom: M, display: "flex", flexDirection: "column" }}>
        <Tag text={S9.tag.text} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <Fade t={t} at={S9.text.at} style={{ maxWidth: 1500 }}>
            <Txt size={56} weight={700}>
              {S9.text.text}
            </Txt>
          </Fade>
          <div style={{ display: "flex", gap: 90, marginTop: 70 }}>
            {S9.icons.map((ic, i) => {
              const Icon = icons[i];
              return (
                <Fade key={i} t={t} at={ic.at} dx={-60} dy={0} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 140, height: 140, borderRadius: 70, background: C.mainSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={76} />
                  </div>
                  <Txt size={44} weight={700}>
                    {ic.text}
                  </Txt>
                </Fade>
              );
            })}
          </div>
        </div>
        <Fade t={t} at={S9.foot.at} style={{ textAlign: "center" }}>
          <Txt size={36} weight={600} color={C.text2}>
            {S9.foot.text}
          </Txt>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

export const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9];
