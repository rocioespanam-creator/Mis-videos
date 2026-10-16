import timeline from "./data/timeline.json";
import { FPS } from "./theme";

export type Phrase = { scene: number; text: string; start: number; end: number };

export const PHRASES: Phrase[] = timeline.phrases;
export const AUDIO_DURATION = timeline.duration;

// Final: el audio termina y dejamos 2,5 s para el plano de cierre.
export const TOTAL_SECONDS = AUDIO_DURATION + 2.5;
export const TOTAL_FRAMES = Math.ceil(TOTAL_SECONDS * FPS);

// Cortes de escena: en mitad de la pausa entre la última frase de una escena
// y la primera de la siguiente.
const sc = timeline.scenes;
export const SCENE_BOUNDS: { start: number; end: number }[] = sc.map((s, i) => ({
  start: i === 0 ? 0 : (sc[i - 1].speechEnd + s.speechStart) / 2,
  end: i === sc.length - 1 ? TOTAL_SECONDS : (s.speechEnd + sc[i + 1].speechStart) / 2,
}));

/** Momento (s) en que empieza a decirse la frase que contiene `snippet` dentro de la escena. */
export const at = (scene: number, snippet: string, offset = 0) => {
  const p = PHRASES.find((ph) => ph.scene === scene && ph.text.includes(snippet));
  if (!p) throw new Error(`Frase no encontrada: ${snippet}`);
  return p.start + offset;
};

/** Momento aproximado (s) en que se pronuncia `word` dentro de su frase (interpolado por caracteres). */
export const atWord = (scene: number, snippet: string, word: string) => {
  const p = PHRASES.find((ph) => ph.scene === scene && ph.text.includes(snippet));
  if (!p) throw new Error(`Frase no encontrada: ${snippet}`);
  const idx = p.text.indexOf(word);
  return p.start + ((p.end - p.start) * Math.max(0, idx)) / p.text.length;
};

export type Cue = { text: string; start: number; end: number };

// Subtítulos: se agrupan frases consecutivas de la misma escena hasta ~80 caracteres (2 líneas).
export const CUES: Cue[] = (() => {
  const cues: Cue[] = [];
  let cur: Cue & { scene: number } = { text: "", start: 0, end: 0, scene: -1 };
  for (const p of PHRASES) {
    const joined = cur.text ? `${cur.text} ${p.text}` : p.text;
    const endsSentence = /[.?!]$/.test(cur.text);
    if (cur.text && (p.scene !== cur.scene || joined.length > 80 || (endsSentence && joined.length > 48))) {
      cues.push({ text: cur.text, start: cur.start, end: cur.end });
      cur = { text: p.text, start: p.start, end: p.end, scene: p.scene };
    } else {
      cur = { text: joined, start: cur.text ? cur.start : p.start, end: p.end, scene: p.scene };
    }
  }
  if (cur.text) cues.push({ text: cur.text, start: cur.start, end: cur.end });
  // mantener el subtítulo visible durante las pausas cortas
  return cues.map((c, i) => {
    const next = cues[i + 1];
    const end = next && next.start - c.end < 1.2 ? next.start - 0.05 : c.end + 0.4;
    return { ...c, start: Math.max(0, c.start - 0.08), end };
  });
})();
