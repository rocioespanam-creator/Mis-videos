// Comprobaciones de contenido antes de renderizar:
//  1. Cada número que sale en pantalla aparece en fuente/datos_prompt.txt (búsqueda por script, no de memoria).
//  2. Cada cifra animada (contador, columna, fila del puente) termina mostrando exactamente su texto; el puente cuadra.
//  3. Las cifras clave están completas en pantalla cuando la voz las dice.
//  4. Ningún elemento aparece después de que acabe su escena (todo entra mientras se habla del tema).
//  5. Aviso de frases de más de 12 palabras (literales del encargo).
import { readFileSync } from "node:fs";
import * as content from "../src/content";
import { cueL } from "../src/timing";
import { fmt } from "../src/ui";

type Any = any;
const { SCENES, FADE } = content as Any;
const src = readFileSync("fuente/datos_prompt.txt", "utf8");
const norm = (x: string) => x.replace(/[−-]\s?/g, "−").replace(/\s+/g, " ");
const srcN = norm(src);
let errors = 0;
const err = (m: string) => {
  errors++;
  console.log("✗ " + m);
};

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
let nums = 0;
for (const { scene, s } of strings)
  for (const m of s.match(/[−+]?\s?\d[\d.,]*(?:\s?%)?/g) ?? []) {
    const tok = m.trim().replace(/[.,]$/, "");
    if (!/\d/.test(tok)) continue;
    nums++;
    if (!srcN.includes(norm(tok)) && !srcN.includes(tok.replace(/^[−+]\s?/, ""))) err(`Escena ${scene}: "${tok}" no está en la fuente ("${s}")`);
  }

// 2. valores animados
let vals = 0;
const walkVals = (o: Any, scene: number) => {
  if (Array.isArray(o)) return o.forEach((x) => walkVals(x, scene));
  if (!o || typeof o !== "object") return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === "value" || k === "delta") && typeof v === "number" && typeof o.text === "string") {
      vals++;
      const dec = o.text.match(/,(\d+)/)?.[1].length ?? 0;
      if (!o.text.replace(/\s/g, "").includes(fmt(Math.abs(v), dec)) || (v < 0 && k === "value" && !o.text.includes("−")))
        err(`Escena ${scene}: el valor ${v} no coincide con "${o.text}"`);
    }
    if (typeof v === "object") walkVals(v, scene);
  }
  if (Array.isArray(o.values) && Array.isArray(o.texts))
    o.values.forEach((v: number, i: number) => {
      vals++;
      if (!o.texts[i].includes(fmt(v))) err(`Escena ${scene}: columna ${v} ≠ "${o.texts[i]}"`);
    });
};
SCENES.forEach((s: Any, i: number) => walkVals(s, i + 1));
const st = (content as Any).S10.steps;
const sum = st.slice(0, 5).reduce((a: number, s: Any) => a + s.delta, 0);
if (sum !== st[5].delta) err(`Escena 10: el puente suma ${sum} y no ${st[5].delta}`);

// 3. cifras clave completas cuando la voz las dice: [escena, palabra en la voz, momento en que la cifra queda completa]
const C = content as Any;
const CNT = C.CONTADOR;
const key: [number, string, number, string][] = [
  [4, "6784", C.S4.gap.at + CNT, "−6.784 €"],
  [5, "15", C.S5.avg.at + CNT, "15,13 €"],
  [5, "1450", C.S5.proposal.at + 0.5, "Propuesta 14,50 €"],
  [6, "1450", C.S6.to.at + 0.5, "14,50 €"],
  [6, "12376", C.S6.impactLabel.at + CNT, "12.376 €"],
  [7, "15891", C.S7.impactLabel.at + CNT, "15.891 €"],
  [8, "25", C.S8.text.at + 0.5, "25%"],
  [8, "15961", C.S8.impactLabel.at + CNT, "15.961 €"],
  [10, "55000", C.S10.stepsAts[0] + 0.6, "55.007 €"],
  [10, "44000", C.S10.stepsAts[2] + 0.6, "+ 44.335 €"],
  [10, "60000", C.S10.stepsAts[5] + 0.6, "= 59.354 €"],
  [10, "16500", C.S10.alert.at + 0.5, "16.544 €"],
  [2, "44000", C.S2.bottom1.at + 0.5, "+44.335 €"],
  [3, "102000", C.S3.ebitdaAts[0] + 0.6, "102.040 €"],
];
for (const [sc, w, done, label] of key) {
  const said = cueL(sc, w, 0);
  if (done > said + 0.05) err(`Escena ${sc}: ${label} queda completa en ${done.toFixed(2)} s y la voz lo dice en ${said.toFixed(2)} s`);
}

// 4. todo aparece dentro de su escena, antes del fundido de salida
for (const x of items) {
  const dur = SCENES[x.scene - 1].dur;
  if (x.at + (x.anim ?? 0.5) > dur - FADE) err(`Escena ${x.scene}: "${x.text}" termina de aparecer en ${(x.at + (x.anim ?? 0.5)).toFixed(2)} s y la escena dura ${dur.toFixed(2)} s`);
}

// 5. frases largas
const words = (x: string) => x.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
const long: string[] = [];
for (const x of items) for (const f of x.text.split(/(?<=[.;:])\s+/)) if (words(f) > 12) long.push(`Escena ${x.scene}: (${words(f)} palabras) ${f}`);

console.log(`Números revisados: ${nums} · cifras animadas: ${vals} · cifras clave sincronizadas: ${key.length} · textos: ${items.length}`);
if (long.length) console.log("Frases de más de 12 palabras (literales del encargo):\n  " + long.join("\n  "));
console.log(errors ? `\n${errors} ERRORES` : "\nTODO OK");
process.exit(errors ? 1 : 0);
