"""Comprueba que en las capturas no haya nada dibujado en la franja de 80 px de cada borde."""
import glob
import sys

from PIL import Image

BG = (0xFB, 0xF7, 0xF1)
bad = 0
for f in sorted(glob.glob("out/capturas/*.png")):
    im = Image.open(f).convert("RGB")
    w, h = im.size
    px = im.load()
    hits = 0
    for y in range(h):
        for x in list(range(0, 80)) + list(range(w - 80, w)) if 80 <= y < h - 80 else range(w):
            r, g, b = px[x, y]
            if abs(r - BG[0]) + abs(g - BG[1]) + abs(b - BG[2]) > 12:
                hits += 1
    print(f"{'OK ' if hits == 0 else 'MAL'} {f} ({hits} píxeles en el margen)")
    bad += hits > 0
sys.exit(1 if bad else 0)
