// node scripts/render.mjs preview -> out/preview/la_plazuela_propuesta_2025_preview.mp4 (mismo vídeo a 960x540 y 10 fps)
// node scripts/render.mjs final   -> out/la_plazuela_propuesta_2025.mp4 (1920x1080, 30 fps, H.264, yuv420p)
import path from "node:path";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const mode = process.argv[2] === "final" ? "final" : "preview";
const id = "Propuesta";
const outputLocation = path.resolve(mode === "final" ? "out/la_plazuela_propuesta_2025.mp4" : "out/preview/la_plazuela_propuesta_2025_preview.mp4");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable: BROWSER });
let last = -1;
await renderMedia({
  serveUrl,
  composition,
  codec: "h264",
  pixelFormat: "yuv420p",
  crf: mode === "final" ? 18 : 28,
  audioCodec: "aac",
  outputLocation: outputLocation + ".tmp.mp4",
  browserExecutable: BROWSER,
  concurrency: 4,
  scale: mode === "final" ? 1 : 0.5, // previa: 960x540
  onProgress: ({ progress }) => {
    const pc = Math.floor(progress * 10);
    if (pc !== last) {
      last = pc;
      console.log(`${pc * 10}%`);
    }
  },
});
// Remotion entrega yuvj420p (rango completo); se pasa a H.264 yuv420p estándar para cualquier reproductor.
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", outputLocation + ".tmp.mp4", "-c:v", "libx264", "-preset", "slow", "-crf", mode === "final" ? "18" : "26",
  ...(mode === "final" ? [] : ["-r", "10"]), "-pix_fmt", "yuv420p", "-color_range", "tv", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", outputLocation]);
execFileSync("rm", [outputLocation + ".tmp.mp4"]);
console.log(outputLocation);
