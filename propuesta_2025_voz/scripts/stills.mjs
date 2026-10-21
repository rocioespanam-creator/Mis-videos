// Capturas PNG del momento final de cada escena (out/capturas/). Lee escenas_tiempos.json.
// Uso: node scripts/stills.mjs   |   node scripts/stills.mjs 12.5 40   (segundos concretos)
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const T = JSON.parse(fs.readFileSync("escenas_tiempos.json", "utf8"));
const args = process.argv.slice(2);
const list = args.length
  ? args.map((s) => [`t_${s.replace(".", "_")}s`, Number(s)])
  : T.escenas.map((e) => [`escena${String(e.escena).padStart(2, "0")}_final`, e.fin - 0.4]);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Propuesta", browserExecutable: BROWSER });
for (const [name, sec] of list) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(sec * composition.fps));
  const output = path.resolve("out/capturas", `${name}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable: BROWSER, imageFormat: "png" });
  console.log(`${output}  (${sec.toFixed(2)} s)`);
}
