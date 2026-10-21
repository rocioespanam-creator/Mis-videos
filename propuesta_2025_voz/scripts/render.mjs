// node scripts/render.mjs preview  -> out/preview/la_plazuela_propuesta_2025_preview.mp4 (960x540, 10 fps)
// node scripts/render.mjs final    -> out/la_plazuela_propuesta_2025.mp4 (1920x1080, 30 fps, H.264 yuv420p, AAC 192k 48 kHz estéreo)
// Por defecto solo voz; --con-musica añade música 20 dB por debajo de la voz. Opción --reusar-imagen: no vuelve a dibujar la imagen (solo rehace el audio).
// Lee escenas_tiempos.json (vía src/timing.ts): si lo editas y vuelves a ejecutar, el vídeo se ajusta.
import path from "node:path";
import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const mode = process.argv[2] === "final" ? "final" : "preview";
const musica = process.argv.includes("--con-musica"); // por defecto, solo voz
const reusar = process.argv.includes("--reusar-imagen") && fs.existsSync(`out/tmp/imagen_${mode}.mp4`);
const T = JSON.parse(fs.readFileSync("escenas_tiempos.json", "utf8"));
const total = T.duracion_video;
const off = T.audio.voz_entra_en_video;
const durVoz = T.audio.duracion;
fs.mkdirSync("out/tmp", { recursive: true });
fs.mkdirSync("out/preview", { recursive: true });
const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });

// 1) imagen (sin audio)
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Propuesta", browserExecutable: BROWSER });
const img = path.resolve(`out/tmp/imagen_${mode}.mp4`);
let last = -1;
if (!reusar) await renderMedia({
  serveUrl, composition, codec: "h264", muted: true, crf: 16, outputLocation: img, browserExecutable: BROWSER, concurrency: 4,
  scale: mode === "final" ? 1 : 0.5,
  onProgress: ({ progress }) => { const pc = Math.floor(progress * 10); if (pc !== last) { last = pc; console.log(`imagen ${pc * 10}%`); } },
});

// 2) audio: voz entera desplazada 0,5 s, sin cortes ni reordenación; fundido de salida de 0,3 s al final de la voz
const voz = path.resolve("out/tmp/voz.wav");
ff(["-i", "audio/voz.mp3", "-af", `aresample=48000,pan=stereo|c0=c0|c1=c0,afade=t=out:st=${(durVoz - 0.3).toFixed(3)}:d=0.3,adelay=${Math.round(off * 1000)}:all=1,apad=whole_dur=${total}`,
  "-t", String(total), voz]);
const lufs = (f) => Number(/I:\s+(-?[\d.]+) LUFS/.exec(spawnSync("ffmpeg", ["-hide_banner", "-i", f, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], { encoding: "utf8" }).stderr)?.[1]);
let audio = voz;
if (musica) {
  // música sintetizada aquí (sin red), 20 LU por debajo de la voz
  const vozI = lufs(voz); // misma medida (estéreo) para voz y música
  execFileSync("python3", ["scripts/musica.py", String(total)], { stdio: "inherit" });
  const mus = path.resolve("out/tmp/musica.wav");
  const mus0 = path.resolve("out/tmp/musica48.wav");
  ff(["-i", "public/musica.wav", "-ar", "48000", "-ac", "2", "-t", String(total), mus0]);
  const gain = vozI - 20 - lufs(mus0); // música 20 dB por debajo de la voz
  ff(["-i", mus0, "-af", `volume=${gain.toFixed(2)}dB`, mus]);
  console.log(`voz ${vozI} LUFS · música ${(vozI - 20).toFixed(1)} LUFS`);
  audio = path.resolve("out/tmp/mezcla.wav");
  ff(["-i", voz, "-i", mus, "-filter_complex", "[0:a][1:a]amix=inputs=2:normalize=0:duration=first[a]", "-map", "[a]", "-ar", "48000", "-ac", "2", audio]);
}

// 3) unión final
const out = path.resolve(mode === "final" ? "out/la_plazuela_propuesta_2025.mp4" : "out/preview/la_plazuela_propuesta_2025_preview.mp4");
ff(["-i", img, "-i", audio, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", mode === "final" ? "18" : "26",
  "-pix_fmt", "yuv420p", "-color_range", "tv", ...(mode === "final" ? [] : ["-r", "10"]),
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-t", String(total), "-movflags", "+faststart", out]);
console.log(out);
