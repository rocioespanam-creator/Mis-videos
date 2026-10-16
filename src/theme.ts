import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;
// Zona de contenido: 75 % superior. Franja inferior: Plazi + subtítulos.
export const CONTENT_H = 810;

export const C = {
  terracota: "#C8553D",
  mostaza: "#F2A541",
  teal: "#2E8B8B",
  crema: "#FFF4E0",
  texto: "#2B2A27",
  rojo: "#D64545", // solo negativo
  verde: "#3BA55C", // solo positivo
  blanco: "#FFFFFF",
  // tonos derivados de la paleta para ilustraciones
  cielo: "#D8ECE6",
  suelo: "#EBD6B3",
  cremaOscuro: "#F3E2C4",
  terracotaClaro: "#DE8A6E",
  tealClaro: "#7FC0B8",
  mostazaClaro: "#F8CF8A",
  piel: "#F2C29B",
  pelo: "#5A3825",
};

export const FONT_TITLE = "Fraunces, Georgia, serif";
export const FONT_TEXT = "'DM Sans', Arial, sans-serif";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 entre t0 y t0+dur (segundos absolutos del audio). */
export const prog = (T: number, t0: number, dur = 0.6, easing = Easing.out(Easing.cubic)) =>
  interpolate(T, [t0, t0 + dur], [0, 1], { ...clamp, easing });

/** 1→0 entre t0 y t0+dur. */
export const out = (T: number, t0: number, dur = 0.4) => 1 - prog(T, t0, dur, Easing.in(Easing.cubic));

/** Entrada con rebote suave. */
export const pop = (T: number, t0: number, damping = 13) =>
  T < t0 ? 0 : spring({ frame: (T - t0) * FPS, fps: FPS, config: { damping, stiffness: 140, mass: 0.8 } });

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Formato español con punto de miles (también para 4 cifras: 4.822). */
export const fmtInt = (n: number) => {
  const r = Math.round(Math.abs(n));
  const s = r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 && r !== 0 ? "−" : "") + s;
};

export const fmtDec = (n: number, d = 2) => {
  const s = Math.abs(n).toFixed(d).replace(".", ",");
  return (n < 0 ? "−" : "") + s;
};
