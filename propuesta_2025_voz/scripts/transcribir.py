"""Transcribe audio/voz.mp3 con marcas de tiempo por palabra (método a).

Usa sherpa-onnx con el modelo NVIDIA Parakeet TDT 0.6B v3 (multilingüe, incluye español), descargado
de las releases de GitHub de sherpa-onnx (Whisper no puede descargar sus modelos en este entorno).
El audio se trocea por pausas en fragmentos de <= 25 s y se transcribe cada uno con su desfase.
Salida: datos/transcripcion.json  -> [{"w": palabra, "t": segundo}, ...]
Uso: python3 scripts/transcribir.py RUTA_AL_MODELO
"""
import json
import re
import subprocess
import sys

import numpy as np
import sherpa_onnx
import soundfile as sf

MODEL = sys.argv[1]
SR = 16000

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/voz.mp3", "-ac", "1", "-ar", str(SR), "datos/voz16k.wav"], check=True)
audio, sr = sf.read("datos/voz16k.wav", dtype="float32")

# pausas para trocear
err = subprocess.run(["ffmpeg", "-hide_banner", "-i", "datos/voz16k.wav", "-af", "silencedetect=noise=-35dB:d=0.25", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
mids = [(s + e) / 2 for s, e in zip(starts, ends)]
dur = len(audio) / SR
cuts = [0.0]
for m in mids:
    if m - cuts[-1] > 12 and m - cuts[-1] <= 25:
        cuts.append(m)
    elif m - cuts[-1] > 25:
        prev = [x for x in mids if cuts[-1] + 3 < x < m]
        cuts.append(prev[-1] if prev else m)
cuts.append(dur)

rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{MODEL}/encoder.int8.onnx",
    decoder=f"{MODEL}/decoder.int8.onnx",
    joiner=f"{MODEL}/joiner.int8.onnx",
    tokens=f"{MODEL}/tokens.txt",
    model_type="nemo_transducer",
    num_threads=4,
)

words = []
for a, b in zip(cuts, cuts[1:]):
    seg = audio[int(a * SR):int(b * SR)]
    s = rec.create_stream()
    s.accept_waveform(SR, seg)
    rec.decode_stream(s)
    r = s.result
    # unir sub-palabras: un token que empieza por espacio (o "▁") abre palabra nueva
    cur, cur_t = "", None
    for tok, ts in zip(r.tokens, r.timestamps):
        new = tok.startswith(" ") or tok.startswith("▁")
        piece = tok.replace("▁", " ")
        if new and cur.strip():
            words.append({"w": cur.strip(), "t": round(a + cur_t, 3)})
            cur, cur_t = "", None
        if cur_t is None:
            cur_t = ts
        cur += piece
    if cur.strip():
        words.append({"w": cur.strip(), "t": round(a + cur_t, 3)})

with open("datos/transcripcion.json", "w", encoding="utf-8") as f:
    json.dump({"duracion": round(dur, 3), "palabras": words}, f, ensure_ascii=False, indent=0)
print(f"{len(words)} palabras, {len(cuts) - 1} fragmentos")
print(" ".join(f"[{w['t']:.1f}]{w['w']}" for w in words))
