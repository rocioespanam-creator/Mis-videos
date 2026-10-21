# La Plazuela · Propuesta de decisión 2025 (vídeo con voz en off)

Vídeo final: **`out/la_plazuela_propuesta_2025.mp4`**: 153,64 s (2:33,6), 1920x1080, 30 fps, H.264 yuv420p,
AAC 192 kbps estéreo 48 kHz. Voz original completa desde el segundo 0,5; música sintetizada 20 dB por debajo de la voz.

## Tiempos de escena
`escenas_tiempos.json` guarda el inicio y fin de cada escena (segundos del vídeo). El render lo lee:
si cambias `inicio`/`fin` y vuelves a renderizar, el vídeo se ajusta. Las animaciones dentro de cada escena
se anclan a las palabras de la voz (`datos/transcripcion.json`), así que siguen sincronizadas.

## Pasos
1. `npm install` (una vez).
2. Modelo de voz a texto (solo para transcribir/verificar, ~490 MB):
   `curl -L -o parakeet.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2 && tar xjf parakeet.tar.bz2`
   y `pip install sherpa-onnx soundfile numpy pillow`.
3. `python3 scripts/transcribir.py RUTA_MODELO` → `datos/transcripcion.json` (palabras con su segundo).
4. `python3 scripts/sincronizar.py` → `escenas_tiempos.json` y tabla de tiempos (edítalo a mano si quieres).
5. `npm run check` → cifras contra `fuente/datos_prompt.txt`, cifras clave completas cuando la voz las dice, etc.
6. `npm run stills` → capturas del final de cada escena (`out/capturas/`); `python3 scripts/margins.py` revisa los 80 px.
7. `node scripts/render.mjs preview` (960x540, 10 fps) y `node scripts/render.mjs final`.
   Opciones: `--sin-musica`, `--reusar-imagen` (solo rehace el audio).
8. `python3 scripts/verificar.py RUTA_MODELO` → formato, duración, voz intacta (desfase 0,5 s), qué se oye en cada cambio de escena, volumen y márgenes.

## Estructura
- `audio/voz.mp3` copia del audio de ElevenLabs (sin tocar).
- `src/content.ts` textos y momentos (anclados a palabras) · `src/scenes.tsx` 12 escenas · `src/charts.tsx` gráficos · `src/timing.ts` lectura de tiempos.
- Hecho con Remotion (React) + Chromium preinstalado + ffmpeg. Tipografía Inter local. Sin librerías que necesiten red.
