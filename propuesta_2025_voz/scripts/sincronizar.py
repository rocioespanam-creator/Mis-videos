"""Calcula el inicio y fin de cada escena a partir de la transcripción con marcas de tiempo por palabra.

Entrada:  datos/transcripcion.json (scripts/transcribir.py) y fuente/datos_prompt.txt (LOCUCIÓN de cada escena).
Salida:   escenas_tiempos.json  (lo lee el render; se puede editar a mano y volver a renderizar).

Reglas del encargo:
- La voz entra a los 0,5 s del vídeo (todo el audio se desplaza +0,5 s).
- Escena i: desde su inicio hasta el inicio de la escena i+1. La primera empieza en 0.
- La última termina 1,5 s después de acabar la voz. Duración del vídeo = duración del audio + 2 s.
- Cada escena arranca ADELANTO s antes de que la voz empiece su tema (el fundido de 0,5 s queda centrado en el cambio).
"""
import json
import re
import subprocess
import unicodedata

VOZ_OFFSET = 0.5
COLA = 1.5
ADELANTO = 0.25
NOMBRES = ["Portada", "La recomendación", "Diagnóstico", "La franja de tarde", "Referencia de precios", "Acción 1: precio de M01",
           "Acción 2: tardes", "Acción 3: administración", "Escenarios", "Caja", "Seguimiento", "Cierre"]
NUM = {"uno": "1", "dos": "2", "tres": "3", "cuatro": "4", "cinco": "5", "seis": "6", "siete": "7", "ocho": "8", "nueve": "9", "diez": "10"}


def norm(w):
    w = unicodedata.normalize("NFKD", w.lower())
    w = "".join(c for c in w if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]", "", w)


src = open("fuente/datos_prompt.txt", encoding="utf-8").read()
loc = [re.sub(r"^LOCUCIÓN: ", "", m) for m in re.findall(r"^LOCUCIÓN: .*$", src, flags=re.M)]
assert len(loc) == 12, len(loc)
tr = json.load(open("datos/transcripcion.json", encoding="utf-8"))
words = tr["palabras"]
W = [norm(w["w"]) for w in words]

dur_audio = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "audio/voz.mp3"],
                                 capture_output=True, text=True).stdout)
# fin real de la voz: inicio del último silencio
sil = subprocess.run(["ffmpeg", "-hide_banner", "-i", "audio/voz.mp3", "-af", "silencedetect=noise=-40dB:d=0.2", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", sil)]
fin_voz = starts[-1] if starts and starts[-1] > dur_audio - 2 else dur_audio

inicios = [0.0]
pos = 0
for i in range(1, 12):
    toks = [norm(x) for x in loc[i].split()]
    first = NUM.get(toks[0], toks[0])
    second = NUM.get(toks[1], toks[1]) if toks[0] != "accion" else NUM.get(toks[1], toks[1])
    found = None
    for j in range(pos + 1, len(W)):
        nxt = W[j + 1] if j + 1 < len(W) else ""
        # la segunda palabra confirma el punto; si es un número dicho con letras ("dos mil…") basta con la primera
        ok2 = toks[1] in ("dos", "mil") or nxt.startswith(toks[1]) or nxt.startswith(second)
        if W[j] in (toks[0], first) and ok2:
            found = j
            break
    if found is None:
        raise SystemExit(f"No encuentro el inicio de la escena {i + 1}: {' '.join(toks[:3])}")
    inicios.append(words[found]["t"])
    pos = found

dur_video = round(dur_audio + VOZ_OFFSET + COLA, 3)
escenas = []
for i in range(12):
    ini = 0.0 if i == 0 else round(inicios[i] + VOZ_OFFSET - ADELANTO, 2)
    escenas.append({"escena": i + 1, "nombre": NOMBRES[i], "voz_empieza_audio": inicios[i], "inicio": ini})
for i in range(12):
    escenas[i]["fin"] = escenas[i + 1]["inicio"] if i < 11 else dur_video
    escenas[i]["duracion"] = round(escenas[i]["fin"] - escenas[i]["inicio"], 2)

out = {
    "nota": "Tiempos en segundos del VÍDEO (la voz entra a los 0,5 s). Puedes editar 'inicio' y 'fin' y volver a renderizar.",
    "audio": {"archivo": "audio/voz.mp3", "duracion": round(dur_audio, 3), "voz_entra_en_video": VOZ_OFFSET, "fin_voz_audio": round(fin_voz, 3)},
    "duracion_video": dur_video,
    "metodo": "a) transcripción con marcas de tiempo por palabra (sherpa-onnx + NVIDIA Parakeet TDT 0.6B v3)",
    "escenas": escenas,
}
json.dump(out, open("escenas_tiempos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)

print(f"Audio: {dur_audio:.2f} s · voz hasta {fin_voz:.2f} s · vídeo: {dur_video:.2f} s\n")
print(f"{'Esc.':<5}{'Nombre':<28}{'Inicio':>8}{'Fin':>9}{'Dur.':>7}   Primeras palabras oídas en ese punto")
for i, e in enumerate(escenas):
    j = next(k for k, w in enumerate(words) if w["t"] >= e["voz_empieza_audio"])
    print(f"{e['escena']:<5}{e['nombre']:<28}{e['inicio']:>8.2f}{e['fin']:>9.2f}{e['duracion']:>7.2f}   «{' '.join(w['w'] for w in words[j:j + 6])}…»")
