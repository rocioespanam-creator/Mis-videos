// Capturas PNG de cada escena en su momento final (estado quieto), en out/capturas/.
// Uso: node scripts/stills.mjs            -> fin de cada escena
//      node scripts/stills.mjs 12.5 40    -> segundos concretos
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const DURS = [6, 12, 10, 8, 9, 9, 9, 12, 8];
const args = process.argv.slice(2);
let list;
if (args.length) list = args.map((s) => [`t_${s.replace(".", "_")}s`, Number(s)]);
else {
  let acc = 0;
  list = DURS.map((d, i) => {
    acc += d;
    return [`escena${String(i + 1).padStart(2, "0")}_final`, acc - 0.4];
  });
}
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Propuesta", browserExecutable: BROWSER });
for (const [name, sec] of list) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(sec * composition.fps));
  const output = path.resolve("out/capturas", `${name}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable: BROWSER, imageFormat: "png" });
  console.log(`${output}  (${sec}s)`);
}
