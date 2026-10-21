"""Genera public/musica.wav: fondo instrumental suave, sin derechos (sintetizado aquí, sin red).

Acordes lentos (Do maj7 - La m7 - Fa maj7 - Sol 6) con tonos sinusoidales suaves, ataque lento,
un arpegio muy discreto y volumen bajo (pico ≈ -18 dBFS), con fundido de entrada y salida.
Uso: python3 scripts/musica.py [duración_en_segundos]
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 174.0
CHORD_LEN = 6.0

# frecuencias (Hz)
def n(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)

CHORDS = [
    [48, 55, 59, 64],  # Do maj7
    [45, 52, 55, 60],  # La m7
    [41, 48, 52, 57],  # Fa maj7
    [43, 50, 52, 59],  # Sol 6
]

t = np.arange(int(SR * DUR)) / SR
out = np.zeros_like(t)

for k in range(int(np.ceil(DUR / CHORD_LEN))):
    start = k * CHORD_LEN
    chord = CHORDS[k % len(CHORDS)]
    seg = (t >= start) & (t < start + CHORD_LEN + 2.0)  # solapa 2 s con el siguiente acorde
    tt = t[seg] - start
    env = np.minimum(1, tt / 1.8) * np.exp(-np.maximum(0, tt - CHORD_LEN + 0.5) / 0.9)
    pad = np.zeros_like(tt)
    for m in chord:
        f = n(m)
        pad += np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt + 0.3) + 0.4 * np.sin(2 * np.pi * f * 1.003 * tt)
    out[seg] += 0.06 * env * pad
    # arpegio muy discreto: una nota cada 0,75 s
    for j in range(8):
        on = start + j * 0.75
        m = chord[(j % 3) + 1] + 12
        sel = (t >= on) & (t < on + 1.6)
        ta = t[sel] - on
        out[sel] += 0.035 * np.sin(2 * np.pi * n(m) * ta) * np.exp(-ta * 2.2) * np.minimum(1, ta / 0.02)

# fundidos de entrada (2 s) y salida (3 s)
out *= np.minimum(1, t / 2.0) * np.minimum(1, (DUR - t) / 3.0)
out = out / np.max(np.abs(out)) * (10 ** (-18 / 20))
pcm = (out * 32767).astype(np.int16)
with wave.open("public/musica.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"public/musica.wav: {DUR:.1f} s")
