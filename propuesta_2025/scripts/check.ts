// Comprobaciones automáticas antes de renderizar:
//  1. Cada número que sale en pantalla aparece en fuente/datos_prompt.txt.
//  2. Cada contador muestra exactamente la cifra de su texto.
//  3. Cada frase se ve completa al menos 1 s por cada 3 palabras.
//  4. Tras la última animación, cada escena queda quieta >= 2 s. Duración total <= 90 s.
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

// 2. cifras animadas: cada objeto con `value` numérico debe mostrar exactamente su `text`
let counters = 0;
const walkVals = (o: Any, scene: number) => {
  if (Array.isArray(o)) return o.forEach((x) => walkVals(x, scene));
  if (!o || typeof o !== "object") return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === "value" || k === "delta") && typeof v === "number" && typeof o.text === "string") {
      counters++;
      const dec = (o.text.match(/,(\d+)/)?.[1].length) ?? 0;
      if (!o.text.replace(/\s/g, "").includes(fmt(Math.abs(v), dec)) || (v < 0 && k === "value" && !o.text.includes("−")))
        err(`Escena ${scene}: el valor ${v} no coincide con el texto "${o.text}"`);
    }
    if (typeof v === "object") walkVals(v, scene);
  }
};
SCENES.forEach((s: Any, i: number) => walkVals(s, i + 1));
// el puente de caja cuadra
const rows = (content as Any).S8.rows;
const sum = rows.slice(0, 5).reduce((a: number, r: Any) => a + r.delta, 0);
if (sum !== rows[5].delta) err(`Escena 8: el puente suma ${sum} y no ${rows[5].delta}`);

// 3. tiempo de lectura
const words = (x: string) => x.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
for (const it of items) {
  const dur = SCENES[it.scene - 1].dur;
  const visible = (it.until ?? dur - FADE) - (it.at + (it.anim ?? 0.5));
  const need = words(it.text) / 3;
  if (visible + 1e-9 < need) err(`Escena ${it.scene}: "${it.text}" se ve ${visible.toFixed(2)} s y necesita ${need.toFixed(2)} s`);
}

// 4. contenido quieto >= 2 s al final
SCENES.forEach((s: Any, i: number) => {
  const fromItems = Math.max(...items.filter((x) => x.scene === i + 1 && x.until === undefined).map((x) => x.at + (x.anim ?? 0.5)));
  const last = Math.max(fromItems, s.lastAnim ?? 0);
  const still = s.dur - FADE - last;
  if (still < 2) err(`Escena ${i + 1}: solo queda quieta ${still.toFixed(2)} s`);
});

// 5. frases largas (aviso)
const long: string[] = [];
for (const it of items)
  for (const f of it.text.split(/(?<=[.;:])\s+/)) if (words(f) > 12) long.push(`Escena ${it.scene}: (${words(f)} palabras) ${f}`);

console.log(`Números revisados: ${nums} · cifras animadas/filas: ${counters} · textos: ${items.length}`);
console.log(`Duración total: ${TOTAL} s`);
if (long.length) console.log("Frases de más de 12 palabras (literales del encargo):\n  " + long.join("\n  "));
if (TOTAL > 90) err(`Duración ${TOTAL} s: supera 1:30`);
console.log(errors ? `\n${errors} ERRORES` : "\nTODO OK");
process.exit(errors ? 1 : 0);
