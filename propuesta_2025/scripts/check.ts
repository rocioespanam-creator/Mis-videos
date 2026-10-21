// Comprobaciones automáticas antes de renderizar:
//  1. Cada número que sale en pantalla aparece en fuente/datos_prompt.txt.
//  2. Cada contador muestra exactamente la cifra de su texto.
//  3. Cada frase se ve completa al menos 1 s por cada 3 palabras.
//  4. Tras la última animación, cada escena queda quieta >= 2 s.
//  5. Aviso (no error) de frases de más de 12 palabras, que vienen literales del encargo.
import { readFileSync } from "node:fs";
import * as content from "../src/content";
import { fmt } from "../src/ui";

const { SCENES, FADE, TOTAL } = content;
const src = readFileSync("fuente/datos_prompt.txt", "utf8").replace(/−/g, "−");
const norm = (x: string) => x.replace(/[−-]\s?/g, "−").replace(/\s+/g, " ");
const srcN = norm(src);

let errors = 0;
const err = (m: string) => {
  errors++;
  console.log("✗ " + m);
};

type Any = any;
const strings: { scene: number; s: string }[] = [];
const items: { scene: number; text: string; at: number; until?: number; anim?: number }[] = [];
const walk = (o: Any, scene: number) => {
  if (typeof o === "string") strings.push({ scene, s: o });
  else if (Array.isArray(o)) o.forEach((x) => walk(x, scene));
  else if (o && typeof o === "object") {
    if (typeof o.text === "string" && typeof o.at === "number") items.push({ scene, ...o });
    Object.values(o).forEach((x) => walk(x, scene));
  }
};
SCENES.forEach((s: Any, i: number) => walk(s, i + 1));

// 1. números
const numRe = /[−+]?\s?\d[\d.,]*(?:\s?%)?/g;
let nums = 0;
for (const { scene, s } of strings) {
  for (const m of s.match(numRe) ?? []) {
    const tok = m.trim().replace(/[.,]$/, "");
    if (!/\d/.test(tok)) continue;
    nums++;
    const bare = tok.replace(/^[−+]\s?/, "");
    if (!srcN.includes(norm(tok)) && !srcN.includes(bare)) err(`Escena ${scene}: "${tok}" no está en la fuente (en: "${s}")`);
  }
}

// 2. contadores: value -> texto
const counters: [number, number, number, string][] = [];
const S: Any = content;
S.S2.kpis.forEach((k: Any) => counters.push([2, k.value, 0, k.text.replace(" €", "")]));
counters.push([4, S.S4.gap.value, 0, S.S4.gap.text.replace(" €", "")]);
S.S4.data.forEach((d: Any) => counters.push([4, d.value, d.dec, d.text]));
counters.push([5, S.S5.avg.value, 2, S.S5.avg.text.replace(" €", "")]);
counters.push([6, S.S6.impact.value, 0, S.S6.impact.text.replace(" €", "")]);
counters.push([7, S.S7.impact.value, 0, S.S7.impact.text.replace(" €", "")]);
counters.push([8, S.S8.impact.value, 0, S.S8.impact.text.replace(" €", "")]);
for (const [sc, v, d, txt] of counters) if (fmt(v, d) !== txt) err(`Escena ${sc}: el contador muestra ${fmt(v, d)} y debería mostrar ${txt}`);
// columnas/barras: value coherente con su texto
const cols: [number, number, string, number][] = [];
S.S3.sales.forEach((c: Any) => cols.push([3, c.value, c.text, 0]));
S.S3.ebitda.forEach((c: Any) => cols.push([3, c.value, c.text, 0]));
S.S4.bars.forEach((c: Any) => cols.push([4, c.value, c.text, 0]));
S.S5.bars.forEach((c: Any) => cols.push([5, c.value, c.text, 2]));
S.S7.bars.forEach((c: Any) => cols.push([7, c.value, c.text, 0]));
S.S9.groups.forEach((g: Any) => g.values.forEach((v: number, i: number) => cols.push([9, v, g.texts[i], 0])));
S.S10.scen.forEach((c: Any) => cols.push([10, c.value, c.text, 0]));
S.S10.steps.forEach((c: Any) => cols.push([10, Math.abs(c.delta), c.text, 0]));
for (const [sc, v, txt, d] of cols) if (!txt.includes(fmt(v, d))) err(`Escena ${sc}: la columna vale ${fmt(v, d)} pero su etiqueta dice "${txt}"`);
// el puente de caja cuadra
const st = S.S10.steps;
const sum = st.slice(0, 5).reduce((a: number, s: Any) => a + s.delta, 0);
if (sum !== st[5].delta) err(`Escena 10: el puente suma ${sum} y no ${st[5].delta}`);

// 3. tiempo de lectura
const words = (x: string) => x.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
for (const it of items) {
  const dur = SCENES[it.scene - 1].dur;
  const visible = (it.until ?? dur - FADE) - (it.at + (it.anim ?? 0.5));
  const need = words(it.text) / 3;
  if (visible + 1e-9 < need) err(`Escena ${it.scene}: "${it.text}" se ve ${visible.toFixed(2)} s y necesita ${need.toFixed(2)} s`);
}

// 4. contenido quieto >= 2 s al final
const lastAnim: number[] = SCENES.map((s: Any, i: number) => Math.max(...items.filter((x) => x.scene === i + 1 && x.until === undefined).map((x) => x.at + (x.anim ?? 0.5))));
const extra: Record<number, number> = {
  3: S.S3.ebitdaAt + 2 * 0.4 + 0.6 + 0.3,
  4: S.S4.gap.at + 1.3,
  5: S.S5.avg.at + 1.3,
  9: S.S9.groupsAt + 2 * 0.7 + 2 * 0.15 + 0.9 + 0.3,
  10: S.S10.stepsAt + 5 * 0.8 + 0.6 + 0.3,
};
SCENES.forEach((s: Any, i: number) => {
  const last = Math.max(lastAnim[i], extra[i + 1] ?? 0);
  const still = s.dur - FADE - last;
  if (still < 2) err(`Escena ${i + 1}: solo queda quieta ${still.toFixed(2)} s`);
});

// 5. frases largas (aviso)
const long: string[] = [];
for (const it of items)
  for (const f of it.text.split(/(?<=[.;:])\s+/)) if (words(f) > 12) long.push(`Escena ${it.scene}: (${words(f)} palabras) ${f}`);

console.log(`Números revisados: ${nums} · contadores: ${counters.length} · columnas: ${cols.length} · textos: ${items.length}`);
console.log(`Duración total: ${TOTAL} s`);
if (long.length) console.log("Frases de más de 12 palabras (literales del encargo):\n  " + long.join("\n  "));
if (TOTAL < 170 || TOTAL > 190) err(`Duración ${TOTAL} s fuera de 170–190 s`);
console.log(errors ? `\n${errors} ERRORES` : "\nTODO OK");
process.exit(errors ? 1 : 0);
