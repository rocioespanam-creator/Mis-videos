// Tiempos: escenas (escenas_tiempos.json, editable a mano) y palabras de la voz (datos/transcripcion.json).
import tiempos from "../escenas_tiempos.json";
import transcripcion from "../datos/transcripcion.json";

export const TIEMPOS = tiempos;
export const VOZ_OFFSET = tiempos.audio.voz_entra_en_video;
export const DURACION_VIDEO = tiempos.duracion_video;
export const ESCENAS = tiempos.escenas;

const norm = (w: string) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

const WORDS = transcripcion.palabras.map((p) => ({ w: norm(p.w), t: p.t }));

/** Inicio de la escena n (1..12) en segundos del vídeo. */
export const startOf = (n: number) => ESCENAS[n - 1].inicio;

/**
 * Momento (segundos del vídeo) en que la voz dice `palabra` dentro de la escena n, menos `antes` segundos.
 * Busca la n-ésima palabra que empieza por `palabra` (sin tildes ni signos) en el tramo de voz de esa escena.
 */
export const cue = (n: number, palabra: string, antes = 0.3, nth = 1) => {
  const a = ESCENAS[n - 1].voz_empieza_audio - 0.05;
  const b = n < 12 ? ESCENAS[n].voz_empieza_audio : 1e9;
  const target = norm(palabra);
  const hits = WORDS.filter((x) => x.t >= a && x.t < b && x.w.startsWith(target));
  if (hits.length < nth) throw new Error(`No encuentro «${palabra}» (${nth}ª) en la voz de la escena ${n}`);
  return hits[nth - 1].t + VOZ_OFFSET - antes;
};

/** Igual que cue, pero en segundos relativos al inicio de la escena (lo que usan las animaciones). */
export const cueL = (n: number, palabra: string, antes = 0.3, nth = 1) => cue(n, palabra, antes, nth) - startOf(n);

/** Duración de la escena n. */
export const durOf = (n: number) => ESCENAS[n - 1].fin - ESCENAS[n - 1].inicio;
