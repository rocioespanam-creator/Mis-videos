"""Genera public/musica.wav: fondo instrumental suave, sin derechos (sintetizado aquí, sin red).

Versión 2: registro medio-agudo para que se oiga también en altavoces de móvil y portátil.
- Piano eléctrico suave (acordes Do maj9 - La m7 - Fa maj7 - Sol sus) a 96 pulsaciones por minuto.
- Arpegio tipo marimba, bajo con armónicos y un "shaker" muy discreto.
- Fundido de entrada y salida. Después se normaliza con ffmpeg a -16 LUFS (volumen de escucha normal).
Uso: python3 scripts/musica.py [duración_en_segundos]
"""
import subprocess
import sys
import wave

import numpy as np

SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 153.64
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


CHORDS = [
    [60, 64, 67, 71, 74],  # Do maj9
    [57, 60, 64, 67, 72],  # La m7
    [53, 57, 60, 64, 69],  # Fa maj7
    [55, 60, 62, 67, 71],  # Sol sus
]
BASS = [36, 33, 29, 31]

n = int(SR * DUR)
t = np.arange(n) / SR
out = np.zeros(n)


def add(start, length, wave_fn, gain):
    i0 = int(start * SR)
    i1 = min(n, i0 + int(length * SR))
    if i0 >= n:
        return
    tt = np.arange(i1 - i0) / SR
    out[i0:i1] += gain * wave_fn(tt)


def epiano(f):
    def w(tt):
        env = np.exp(-tt * 1.1) * np.minimum(1, tt / 0.01)
        return env * (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 2) + 0.12 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 3))
    return w


def marimba(f):
    def w(tt):
        env = np.exp(-tt * 6) * np.minimum(1, tt / 0.004)
        return env * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 20))
    return w


def bass(f):
    def w(tt):
        env = np.exp(-tt * 1.5) * np.minimum(1, tt / 0.01)
        return env * (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * 2 * f * tt) + 0.25 * np.sin(2 * np.pi * 3 * f * tt))
    return w


def shaker(tt):
    return rng.standard_normal(len(tt)) * np.exp(-tt * 60)


bars = int(np.ceil(DUR / BAR))
for b in range(bars):
    s = b * BAR
    ch = CHORDS[b % 4]
    # acorde: en los tiempos 1 y 3 (+ un pequeño desfase entre notas)
    for beat in (0, 2):
        for k, m in enumerate(ch):
            add(s + beat * BEAT + k * 0.012, 2.4, epiano(hz(m)), 0.07)
    # bajo
    add(s, BAR, bass(hz(BASS[b % 4])), 0.11)
    add(s + 2.5 * BEAT, 1.5 * BEAT, bass(hz(BASS[b % 4] + 7)), 0.07)
    # arpegio en corcheas (empieza en el compás 2)
    if b >= 1:
        pat = [0, 2, 4, 2, 3, 1, 4, 2]
        for e in range(8):
            add(s + e * BEAT / 2, 0.6, marimba(hz(ch[pat[e]] + 12)), 0.05)
    # shaker suave en contratiempos (a partir del compás 3)
    if b >= 2:
        for e in range(8):
            add(s + e * BEAT / 2, 0.08, shaker, 0.012 if e % 2 else 0.006)

# filtro suave de agudos (media móvil corta) para quitar aspereza
k = 3
out = np.convolve(out, np.ones(k) / k, mode="same")
# fundidos: entrada 1,5 s, salida 3 s
out *= np.minimum(1, t / 1.5) * np.minimum(1, (DUR - t) / 3.0)
out = out / np.max(np.abs(out)) * 0.5
with wave.open("public/musica_raw.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())

# normalizar a -16 LUFS integrados, pico real <= -1,5 dBTP
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", "public/musica_raw.wav", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "2", "public/musica.wav"],
    check=True,
)
subprocess.run(["rm", "public/musica_raw.wav"], check=True)
print(f"public/musica.wav: {DUR:.1f} s, normalizada a -16 LUFS")
