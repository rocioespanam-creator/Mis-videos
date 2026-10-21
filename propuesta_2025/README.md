# La Plazuela · Propuesta de decisión 2025 (vídeo sin voz)

Vídeo MP4 sin voz, generado con código: **`out/la_plazuela_propuesta_2025.mp4`**
(174 s, 1920x1080, 16:9, 30 fps, H.264 yuv420p, música instrumental suave sintetizada).

## Cómo cambiar textos y volver a renderizar
1. `npm install` (una vez).
2. Edita los textos y tiempos en **`src/content.ts`** (todo lo que sale en pantalla está ahí).
3. `npm run check` → comprueba cifras contra `fuente/datos_prompt.txt`, tiempo de lectura (1 s cada 3 palabras),
   2 s quietos al final de cada escena y duración 170–190 s.
4. `npm run stills` → capturas del final de cada escena en `out/capturas/`; `python3 scripts/margins.py` comprueba los márgenes de 80 px.
5. `npm run preview` → versión previa 960x540 a 10 fps en `out/preview/`.
6. `npm run render` → versión final en `out/la_plazuela_propuesta_2025.mp4`.

`python3 scripts/musica.py 174` regenera la música de fondo (`public/musica.wav`).

## Estructura
- `src/content.ts` textos, cifras y momentos de aparición · `src/scenes.tsx` las 12 escenas · `src/charts.tsx` gráficos · `src/ui.tsx` paleta, tipografía, iconos.
- `fuente/datos_prompt.txt` única fuente de datos (copia literal del encargo).
- Hecho con Remotion (React) + Chromium preinstalado + ffmpeg. Tipografía Inter (local, sin red).
  `scripts/*.mjs` apuntan al Chromium del entorno en la nube; en otro ordenador, quita `browserExecutable`.
