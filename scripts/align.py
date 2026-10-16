"""Alinea el guion con narracion.mp3 sin reconocimiento de voz.

1. Detecta pausas en el audio con ffmpeg (silencedetect).
2. Divide el guion en frases por la puntuación.
3. Empareja (programación dinámica) los cortes de frase con las pausas,
   usando la longitud hablada de cada frase como estimación de duración.
4. Escribe src/data/timeline.json con los tiempos de cada frase y escena.
"""
import json
import re
import subprocess
import sys

AUDIO = "public/narracion.mp3"
OUT = "src/data/timeline.json"

SCENES = [
    "¡Hola, Elena! Soy Plazi. Estamos a dos pasos de la Puerta del Sol, en La Plazuela, donde entra más gente que nunca: en 2024 vendisteis 1,16 millones de euros, un 14% más que en 2022. Y aun así, el año cerró en pérdidas. Vengo a contarte por qué y qué podemos hacer en 2025.",
    "Lo primero: el problema no son los clientes ni la calidad, que siguen como en 2022. El problema son dos decisiones. En 2023 se bajó la carta: el menú del día pasó de 15,40 a 12,80 euros, y cada menú empezó a dejar 2,58 euros menos. Y en 2024 abristeis las tardes: venden unos 68.600 euros al año, pero el equipo nuevo cuesta 75.400, y la mitad de esas horas no tienen clientes. Resultado: el beneficio pasa de 102.000 euros a perder 4.800, y la caja se queda a la mitad.",
    "¿Y el mercado? En 2022 vuestro menú era un euro y medio más caro que la media de Madrid, así que bajarlo tenía sentido. Pero os pasasteis: hoy cobráis 13 euros, el menú más barato de la zona. Vuestros vecinos de Sol cobran entre 13,90 y 14,50, y la media de Madrid es 14,80. Mientras tanto, el sector subía precios y crecía. ¿La buena noticia? El problema es de casa, y eso se puede arreglar.",
    "Te propongo tres decisiones, y ninguna necesita inversión. Una: ordenar las tardes. No las cerramos: pagamos solo las horas con clientes y llevamos ese equipo a donde hoy pagáis horas extra. Unos 21.600 euros al año. Dos: subir el menú del día a 14 euros. Seguiríais por debajo de la media, y aunque perdierais un 12% de los menús, ganaríais lo mismo. Unos 10.600 euros. Tres: cortar lo que no aporta: un servicio de reservas que no se usa, una comisión de tarjeta más cara de lo necesario, equipos encendidos sin uso, y recordatorios para que no queden mesas vacías. Unos 5.800 euros.",
    "Con las tres, La Plazuela pasa de perder 4.800 euros a ganar unos 27.800 en 2025. Eso sí, un aviso: la caja va justa. Hay que aplazar a marzo la inversión de 20.000 euros y decidir ese día cómo pagarla.",
    "Cada acción tiene su indicador para seguir o parar a tiempo. Elena, La Plazuela funciona: solo hay que cobrar lo que vale y organizar mejor las horas. ¿Empezamos en enero?",
]

# Forma hablada de las cifras (solo para estimar cuánto se tarda en decirlas).
SPOKEN = {
    "2022": "dos mil veintidós", "2023": "dos mil veintitrés", "2024": "dos mil veinticuatro",
    "2025": "dos mil veinticinco", "1,16": "uno coma dieciséis", "14%": "catorce por ciento",
    "12%": "doce por ciento", "15,40": "quince con cuarenta", "12,80": "doce con ochenta",
    "2,58": "dos con cincuenta y ocho", "68.600": "sesenta y ocho mil seiscientos",
    "75.400": "setenta y cinco mil cuatrocientos", "102.000": "ciento dos mil",
    "4.800": "cuatro mil ochocientos", "13,90": "trece con noventa", "14,50": "catorce con cincuenta",
    "14,80": "catorce con ochenta", "21.600": "veintiún mil seiscientos",
    "10.600": "diez mil seiscientos", "5.800": "cinco mil ochocientos",
    "27.800": "veintisiete mil ochocientos", "20.000": "veinte mil", "13": "trece", "14": "catorce",
}


def spoken_weight(text: str) -> float:
    def rep(m):
        return SPOKEN.get(m.group(0), m.group(0))
    t = re.sub(r"\d[\d.,]*%?", rep, text)
    letters = len(re.sub(r"[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ]", "", t))
    return letters + 1.5  # pequeño coste fijo por frase


def split_phrases(text):
    # corta tras . , : ; ? ! pero no dentro de cifras (1,16 / 68.600)
    parts = re.split(r"(?<=[.,:;?!])(?!\d)\s+", text.strip())
    return [p for p in parts if p]


def silences():
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", AUDIO, "-af", "silencedetect=noise=-35dB:d=0.18", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).groups()[2]) + \
        60 * float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).groups()[1])
    return list(zip(starts, ends)), dur


def main():
    phrases = []
    for si, sc in enumerate(SCENES):
        for p in split_phrases(sc):
            phrases.append({"scene": si, "text": p, "w": spoken_weight(p)})
    sil, dur = silences()
    # habla empieza tras el primer silencio inicial y acaba en el último
    speech_start = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    speech_end = sil[-1][0] if sil and sil[-1][1] > dur - 0.05 else dur
    inner = [s for s in sil if s[0] > speech_start + 0.05 and s[1] < speech_end - 0.05]

    n = len(phrases)
    # nodos: boundary 0 = inicio, boundary n = final; silencios internos m
    # puntos de tiempo: pausa k -> (start, end)
    W = [0.0]
    for p in phrases:
        W.append(W[-1] + p["w"])
    total_pause = sum(e - s for s, e in inner)
    rate = (speech_end - speech_start - 0.6 * total_pause) / W[-1]

    def strength(j):  # importancia de la puntuación al final de la frase j-1
        t = phrases[j - 1]["text"]
        if j < n and phrases[j]["scene"] != phrases[j - 1]["scene"]:
            return 3.0
        return {".": 2.0, "?": 2.0, "!": 2.0, ":": 1.2, ";": 1.2, ",": 0.6}.get(t[-1], 0.0)

    m = len(inner)
    INF = float("inf")
    # estado: (j boundary, k silencio) ; k = -1 inicio, k = m final
    pts = [(speech_start, speech_start)] + inner + [(speech_end, speech_end)]
    # índices de pts: 0 inicio, 1..m silencios, m+1 final
    best = {(0, 0): (0.0, None)}
    MAXJ, MAXK = 8, 6
    for k in range(1, m + 2):
        for j in range(1, n + 1):
            if (k == m + 1) != (j == n):
                continue
            cand = (INF, None)
            for kk in range(max(0, k - MAXK), k):
                for jj in range(max(0, j - MAXJ), j):
                    if (kk, jj) not in best:
                        continue
                    t0 = pts[kk][1]
                    t1 = pts[k][0]
                    exp = (W[j] - W[jj]) * rate
                    # pausas internas ignoradas en el tramo
                    skipped = pts[kk + 1:k]
                    skipped_len = sum(e - s for s, e in skipped)
                    act = t1 - t0 - 0.6 * skipped_len
                    c = (act - exp) ** 2 / max(exp, 0.5)
                    c += sum(2.0 * (e - s) for s, e in skipped)  # ignorar pausa larga cuesta
                    # cortes de puntuación fuerte sin pausa cuestan
                    c += sum(0.8 * strength(b) for b in range(jj + 1, j))
                    c -= 0.5 * strength(j) if j < n else 0
                    tot = best[(kk, jj)][0] + c
                    if tot < cand[0]:
                        cand = (tot, (kk, jj))
            if cand[1] is not None:
                best[(k, j)] = cand
    # reconstruir
    key = (m + 1, n)
    anchors = []
    while key is not None:
        anchors.append(key)
        key = best[key][1]
    anchors.reverse()
    times = [None] * (n + 1)
    for (k0, j0), (k1, j1) in zip(anchors, anchors[1:]):
        t0, t1 = pts[k0][1], pts[k1][0]
        span = W[j1] - W[j0]
        for j in range(j0, j1):
            a = t0 + (t1 - t0) * (W[j] - W[j0]) / span
            b = t0 + (t1 - t0) * (W[j + 1] - W[j0]) / span
            phrases[j]["start"] = round(a, 3)
            phrases[j]["end"] = round(b, 3)
            phrases[j]["anchoredEnd"] = j + 1 == j1

    scenes = []
    for si in range(len(SCENES)):
        ps = [p for p in phrases if p["scene"] == si]
        scenes.append({"index": si, "speechStart": ps[0]["start"], "speechEnd": ps[-1]["end"]})
    out = {"duration": round(dur, 3), "phrases": [
        {k: p[k] for k in ("scene", "text", "start", "end")} for p in phrases], "scenes": scenes}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    for p in phrases:
        print(f'{p["start"]:7.2f}-{p["end"]:7.2f} {"|" if p["anchoredEnd"] else " "} S{p["scene"]+1} {p["text"]}')
    print("pausas internas:", m, " frases:", n, file=sys.stderr)


if __name__ == "__main__":
    main()
