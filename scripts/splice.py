"""Monta public/narracion.mp3 a partir de la narración original y tres frases nuevas de ElevenLabs.

  A  audios/a_4150.mp3   "Unos 4.150 euros."                      -> sustituye "Unos 5.800 euros."
  B  audios/b_26300.mp3  "Con las tres, La Plazuela pasa de perder 4.800 euros a ganar unos 26.300 en 2025."
                                                                  -> sustituye la frase con 27.800
  C  audios/c_caja.mp3   "Al pagar en marzo la caja queda en unos 20.400 euros: ese día pedimos pago a plazos
                          o una línea de crédito."                -> se inserta tras "...cómo pagarla."

Los cortes caen dentro de pausas medidas en la narración original. Cada frase nueva se recorta
(silencio inicial/final) y se iguala en volumen a la original.
Uso: python3 scripts/splice.py            (con los audios reales)
     python3 scripts/splice.py --preview  (silencios de duración estimada, solo para probar la maqueta)
"""
import glob
import re
import subprocess
import sys

ORIG = glob.glob("Narraci*.mp3")[0]
OUT = "public/narracion.mp3"
CUT1, CUT2, CUT3 = 125.35, 135.02, 143.23  # dentro de pausas de la narración original
CLIPS = {"A": "audios/a_4150.mp3", "B": "audios/b_26300.mp3", "C": "audios/c_caja.mp3"}
PREVIEW_DUR = {"A": 1.7, "B": 6.1, "C": 6.4}


def mean_db(path, extra=""):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"{extra}volumedetect", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    return float(re.search(r"mean_volume: (-?[\d.]+) dB", out).group(1))


def main():
    preview = "--preview" in sys.argv
    trim = ("silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,"
            "areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,areverse")
    ref = mean_db(ORIG, f"atrim=end={CUT1},")
    inputs = ["-i", ORIG]
    chains = []
    for i, k in enumerate("ABC", start=1):
        if preview:
            inputs += ["-f", "lavfi", "-t", str(PREVIEW_DUR[k]), "-i", "anoisesrc=r=44100:a=0.05:c=pink"]
            chains.append(f"[{i}:a]aformat=sample_rates=44100:channel_layouts=mono[{k}]")
        else:
            gain = ref - mean_db(CLIPS[k], trim + ",")
            inputs += ["-i", CLIPS[k]]
            chains.append(f"[{i}:a]aformat=sample_rates=44100:channel_layouts=mono,{trim},volume={gain:.2f}dB[{k}]")

    def sil(name, d):
        chains.append(f"anullsrc=r=44100:cl=mono,atrim=end={d}[{name}]")

    chains.append(f"[0:a]aformat=sample_rates=44100:channel_layouts=mono,asplit=3[o1][o2][o3]")
    chains.append(f"[o1]atrim=end={CUT1},asetpts=N/SR/TB[p1]")
    chains.append(f"[o2]atrim={CUT2}:{CUT3},asetpts=N/SR/TB[p2]")
    chains.append(f"[o3]atrim=start={CUT3},asetpts=N/SR/TB[p3]")
    sil("s1", 0.2), sil("s2", 0.66), sil("s3", 0.2), sil("s4", 0.25), sil("s5", 0.3)
    chains.append("[p1][s1][A][s2][B][s3][p2][s4][C][s5][p3]concat=n=11:v=0:a=1[out]")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(chains),
                    "-map", "[out]", "-ac", "1", "-ar", "44100", "-b:a", "128k", OUT], check=True)
    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", OUT],
                         capture_output=True, text=True).stdout.strip()
    print(f"{OUT}: {float(dur):.2f} s {'(PREVIEW con silencios)' if preview else ''}")


if __name__ == "__main__":
    main()
