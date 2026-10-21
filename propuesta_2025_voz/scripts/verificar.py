"""Verificación del MP4 final (out/la_plazuela_propuesta_2025.mp4).

1. Formato con ffprobe: 1920x1080, 30 fps, H.264 yuv420p, pista AAC; vídeo y audio con la misma duración (±0,1 s).
2. La voz del MP4 es la original completa: correlación con audio/voz.mp3 -> desfase 0,5 s, sin cortes, misma duración.
3. Cambios de escena: transcribe 2,5 s de audio del MP4 a partir de cada cambio y comprueba que la voz empieza
   el tema de la escena nueva dentro de ±0,5 s.
4. Volumen: ebur128 (LUFS, pico real) y volumedetect (pico) -> sin recortes.
5. Márgenes de 80 px en el fotograma final de cada escena.
Uso: python3 scripts/verificar.py RUTA_AL_MODELO_PARAKEET
"""
import json
import re
import subprocess
import sys

import numpy as np
import sherpa_onnx
import soundfile as sf
from PIL import Image

MP4 = "out/la_plazuela_propuesta_2025.mp4"
MODEL = sys.argv[1]
T = json.load(open("escenas_tiempos.json", encoding="utf-8"))
ok = True


def check(cond, msg):
    global ok
    print(("OK   " if cond else "FALLO ") + msg)
    ok &= bool(cond)


def probe(args):
    return subprocess.run(["ffprobe", "-v", "error", *args, MP4], capture_output=True, text=True).stdout


# 1. formato
v = dict(re.findall(r"(\w+)=([^\n]*)", probe(["-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height,r_frame_rate,pix_fmt,duration", "-of", "default=nw=1"])))
a = dict(re.findall(r"(\w+)=([^\n]*)", probe(["-select_streams", "a:0", "-show_entries", "stream=codec_name,sample_rate,channels,bit_rate,duration", "-of", "default=nw=1"])))
check(v["codec_name"] == "h264" and v["pix_fmt"] == "yuv420p", f"vídeo {v['codec_name']} {v['pix_fmt']}")
check(v["width"] == "1920" and v["height"] == "1080" and v["r_frame_rate"] == "30/1", f"{v['width']}x{v['height']} a {v['r_frame_rate']} fps")
check(a["codec_name"] == "aac" and a["sample_rate"] == "48000" and a["channels"] == "2", f"audio {a['codec_name']} {a['sample_rate']} Hz {a['channels']} canales {int(a['bit_rate']) // 1000} kbps")
dv, da = float(v["duration"]), float(a["duration"])
check(abs(dv - da) <= 0.1, f"duración vídeo {dv:.3f} s · audio {da:.3f} s (diferencia {abs(dv - da):.3f} s)")
check(abs(da - T["duracion_video"]) <= 0.1, f"duración total {da:.2f} s = audio original {T['audio']['duracion']:.2f} s + 2 s")

# 2. la voz es la original, desplazada 0,5 s y entera
SR = 16000
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", MP4, "-ac", "1", "-ar", str(SR), "out/tmp/mp4_audio.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/voz.mp3", "-ac", "1", "-ar", str(SR), "out/tmp/orig.wav"], check=True)
m, _ = sf.read("out/tmp/mp4_audio.wav", dtype="float32")
o, _ = sf.read("out/tmp/orig.wav", dtype="float32")


def offset_at(t_orig, win=4.0):
    seg = o[int(t_orig * SR):int((t_orig + win) * SR)]
    lo = int((t_orig + 0.2) * SR)
    ref = m[lo:lo + len(seg) + int(0.6 * SR)]
    c = np.correlate(ref, seg, mode="valid")
    k = int(np.argmax(np.abs(c)))
    corr = np.abs(c[k]) / (np.linalg.norm(seg) * np.linalg.norm(ref[k:k + len(seg)]) + 1e-9)
    return (lo + k) / SR - t_orig, corr


for t0 in (0.0, 75.0, 147.0):
    off, corr = offset_at(t0)
    check(abs(off - 0.5) < 0.01 and corr > 0.9, f"voz original en el MP4: en {t0:5.1f} s desfase {off:.3f} s, parecido {corr:.3f}")
voz_mp4 = len(o) / SR
check(abs((len(m) / SR) - 0.5 - 1.5 - voz_mp4) < 0.1, f"duración de la voz dentro del MP4 = original ({voz_mp4:.2f} s), sin cortes")

# 3. cambios de escena: qué se oye
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{MODEL}/encoder.int8.onnx", decoder=f"{MODEL}/decoder.int8.onnx", joiner=f"{MODEL}/joiner.int8.onnx",
    tokens=f"{MODEL}/tokens.txt", model_type="nemo_transducer", num_threads=4)
print("\nCambios de escena (audio del MP4, 2,5 s desde el cambio):")
for e in T["escenas"][1:]:
    ini = e["inicio"]
    seg = m[int(ini * SR):int((ini + 2.5) * SR)]
    s = rec.create_stream()
    s.accept_waveform(SR, seg)
    rec.decode_stream(s)
    txt = s.result.text.strip()
    first = s.result.timestamps[0] if s.result.timestamps else 99
    voz_real = e["voz_empieza_audio"] + T["audio"]["voz_entra_en_video"]
    check(abs(voz_real - ini) <= 0.5 and first <= 0.6,
          f"escena {e['escena']:>2} cambia en {ini:7.2f} s · la voz empieza el tema en {voz_real:7.2f} s · se oye: «{txt}»")

# 4. volumen y recortes
err = subprocess.run(["ffmpeg", "-hide_banner", "-i", MP4, "-af", "ebur128=peak=true:framelog=quiet,volumedetect", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
I = float(re.search(r"I:\s+(-?[\d.]+) LUFS", err).group(1))
tp = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", err).group(1))
mx = float(re.search(r"max_volume: (-?[\d.]+) dB", err).group(1))
print()
check(mx < 0 and tp < 0, f"volumen integrado {I:.1f} LUFS · pico {mx:.1f} dB · pico real {tp:.1f} dBTP (sin recortes)")

# 5. márgenes en fotogramas reales del MP4
BG = (0xFB, 0xF7, 0xF1)
bad = []
for e in T["escenas"]:
    f = f"out/tmp/fin_{e['escena']:02d}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{e['fin'] - 0.4:.2f}", "-i", MP4, "-frames:v", "1", f], check=True)
    im = Image.open(f).convert("RGB")
    px = np.asarray(im).astype(int)
    diff = np.abs(px - np.array(BG)).sum(axis=2) > 24
    band = diff.copy()
    band[80:-80, 80:-80] = False
    if band.any():
        bad.append(e["escena"])
check(not bad, f"márgenes de 80 px libres en el final de las 12 escenas {'' if not bad else bad}")
print("\nTODO OK" if ok else "\nHAY FALLOS")
sys.exit(0 if ok else 1)
