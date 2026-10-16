import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes locales (copiadas de @fontsource) para no depender de internet al renderizar.
const faces: [string, string, string][] = [
  ["Fraunces", "fraunces-latin-600-normal.woff2", "600"],
  ["Fraunces", "fraunces-latin-700-normal.woff2", "700"],
  ["Fraunces", "fraunces-latin-800-normal.woff2", "800"],
  ["DM Sans", "dm-sans-latin-400-normal.woff2", "400"],
  ["DM Sans", "dm-sans-latin-500-normal.woff2", "500"],
  ["DM Sans", "dm-sans-latin-700-normal.woff2", "700"],
];

export const fontsReady = Promise.all(
  faces.map(([family, file, weight]) =>
    loadFont({ family, url: staticFile(`fonts/${file}`), weight, format: "woff2" }),
  ),
);
