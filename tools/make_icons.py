#!/usr/bin/env python3
"""Draw the app icon (neon speedometer on violet) as PNG files. Needs Pillow."""
import math, os, sys
from PIL import Image, ImageDraw

out = sys.argv[1] if len(sys.argv) > 1 else "icons"
os.makedirs(out, exist_ok=True)
cx, cy, R, S = 54, 60, 24, 1024
k = S / 108
lime = (0xC6, 0xFF, 0x3D)

def pt(a, r):
    return (cx + r * math.cos(math.radians(a)), cy - r * math.sin(math.radians(a)))

def ring(draw, a0, a1, r, w, col):
    pts = [(cx * k + r * k * math.cos(math.radians(a0 + (a1 - a0) * i / 240)),
            cy * k - r * k * math.sin(math.radians(a0 + (a1 - a0) * i / 240))) for i in range(241)]
    draw.line(pts, fill=col, width=int(w * k), joint="curve")
    for p in (pts[0], pts[-1]):
        draw.ellipse([p[0] - w * k / 2, p[1] - w * k / 2, p[0] + w * k / 2, p[1] + w * k / 2], fill=col)

im = Image.new("RGB", (S, S))
px = im.load()
c1, c2 = (0x2A, 0x0D, 0x6B), (0x7C, 0x3A, 0xED)
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * S - 2)
        px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ring(ImageDraw.Draw(glow), 210, -30, R, 11, lime + (70,))
im = Image.alpha_composite(im.convert("RGBA"), glow)
d = ImageDraw.Draw(im)
ring(d, 210, -30, R, 5.5, lime + (255,))
for a in (180, 135, 90, 45, 0):
    p0, p1 = pt(a, 15), pt(a, 19)
    d.line([(p0[0] * k, p0[1] * k), (p1[0] * k, p1[1] * k)], fill=(0xE9, 0xFF, 0xB0, 255), width=int(2 * k))
n = pt(55, 17.5)
d.line([(cx * k, cy * k), (n[0] * k, n[1] * k)], fill=(255, 255, 255, 255), width=int(4.5 * k))
d.ellipse([n[0] * k - 2.25 * k, n[1] * k - 2.25 * k, n[0] * k + 2.25 * k, n[1] * k + 2.25 * k], fill=(255, 255, 255, 255))
d.ellipse([cx * k - 4.8 * k, cy * k - 4.8 * k, cx * k + 4.8 * k, cy * k + 4.8 * k], fill=lime + (255,))
d.line([((cx - 13) * k, (cy + 17) * k), ((cx + 13) * k, (cy + 17) * k)], fill=lime + (255,), width=int(3.2 * k))
for p in (((cx - 13) * k, (cy + 17) * k), ((cx + 13) * k, (cy + 17) * k)):
    d.ellipse([p[0] - 1.6 * k, p[1] - 1.6 * k, p[0] + 1.6 * k, p[1] + 1.6 * k], fill=lime + (255,))
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(24 * k), fill=255)
rounded = im.copy()
rounded.putalpha(mask)
for size, name in ((512, "service-negar-512.png"), (192, "service-negar-192.png"), (180, "apple-touch-icon.png")):
    rounded.resize((size, size), Image.LANCZOS).save(os.path.join(out, name))
im.convert("RGB").resize((512, 512), Image.LANCZOS).save(os.path.join(out, "service-negar-maskable-512.png"))
print("icons written to", out)
