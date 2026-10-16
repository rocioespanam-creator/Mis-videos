// Renderiza fotogramas fijos (PNG) en stills/ sin abrir Remotion Studio.
// Uso: node scripts/stills.mjs                -> stills representativos de cada escena
//      node scripts/stills.mjs 12.5 40 88.2   -> stills en esos segundos
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const DEFAULT = [
  ["escena1_puerta_del_sol", 2.6],
  ["escena1_la_plazuela", 15.9],
  ["escena2_ebitda", 27.5],
  ["escena2_tarjetas", 50.6],
  ["escena2_caja", 58.0],
  ["escena3_lineas", 66.5],
  ["escena3_mapa", 85.5],
  ["escena4_decisiones", 126.6],
  ["escena5_ebitda_2025", 134.5],
  ["escena5_aviso_caja", 142.5],
  ["escena6_cierre", 153.0],
];

const args = process.argv.slice(2);
const list = args.length ? args.map((s) => [`t_${s.replace(".", "_")}s`, Number(s)]) : DEFAULT;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "LaPlazuela", browserExecutable: BROWSER });
for (const [name, sec] of list) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(sec * composition.fps));
  const output = path.resolve("stills", `${name}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable: BROWSER, imageFormat: "png" });
  console.log(`${output}  (${sec}s, frame ${frame})`);
}
