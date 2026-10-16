"""Monta public/narracion.mp3: narración original + el audio nuevo del aviso de marzo (ElevenLabs).

  audios/*.mp3  "Hay que aplazar a marzo la inversión de 20.000 euros. Y como la caja quedará en unos
                 20.000 euros, hay que pedir ya pago a plazos o una línea de crédito pequeña."
                -> sustituye a "Hay que aplazar a marzo la inversión de 20.000 euros y decidir ese día cómo pagarla."

Los cortes caen dentro de las pausas medidas antes y después de esa frase en la narración original. La frase nueva se
recorta (silencio inicial/final) y se iguala en volumen a la original.
Uso: python3 scripts/splice.py            (con el audio real)
     python3 scripts/splice.py --preview  (ruido de duración estimada, solo para probar la maqueta)
"""
import glob
import re
import subprocess
import sys

ORIG = glob.glob("Narraci*.mp3")[0]
OUT = "public/narracion.mp3"
CUT_IN = 138.21  # pausa 138,08–138,35 s (antes de "Hay que aplazar")
CUT_OUT = 143.23  # pausa 142,99–143,47 s (tras "...cómo pagarla.")
PREVIEW_DUR = 9.2


def mean_db(path, extra=""):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"{extra}volumedetect", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    return float(re.search(r"mean_volume: (-?[\d.]+) dB", out).group(1))


def main():
    preview = "--preview" in sys.argv
    trim = ("silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,"
            "areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,areverse")
    inputs = ["-i", ORIG]
    chains = []
    if preview:
        inputs += ["-f", "lavfi", "-t", str(PREVIEW_DUR), "-i", "anoisesrc=r=44100:a=0.05:c=pink"]
        chains.append("[1:a]aformat=sample_rates=44100:channel_layouts=mono[C]")
    else:
        clips = sorted(glob.glob("audios/*.mp3"))
        if len(clips) != 1:
            sys.exit(f"Se esperaba exactamente un mp3 en audios/, hay {len(clips)}: {clips}")
        clip = clips[0]
        gain = mean_db(ORIG, f"atrim=end={CUT_IN},") - mean_db(clip, trim + ",")
        inputs += ["-i", clip]
        chains.append(f"[1:a]aformat=sample_rates=44100:channel_layouts=mono,{trim},volume={gain:.2f}dB[C]")
        print(f"{clip}: ganancia {gain:+.2f} dB")
    chains.append("[0:a]aformat=sample_rates=44100:channel_layouts=mono,asplit=2[o1][o2]")
    chains.append(f"[o1]atrim=end={CUT_IN},asetpts=N/SR/TB[p1]")
    chains.append(f"[o2]atrim=start={CUT_OUT},asetpts=N/SR/TB[p2]")
    chains.append("anullsrc=r=44100:cl=mono,atrim=end=0.13[s1]")
    chains.append("anullsrc=r=44100:cl=mono,atrim=end=0.24[s2]")
    chains.append("[p1][s1][C][s2][p2]concat=n=5:v=0:a=1[out]")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(chains),
                    "-map", "[out]", "-ac", "1", "-ar", "44100", "-b:a", "128k", OUT], check=True)
    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", OUT],
                         capture_output=True, text=True).stdout.strip()
    print(f"{OUT}: {float(dur):.2f} s {'(PREVIEW)' if preview else ''}")


if __name__ == "__main__":
    main()
