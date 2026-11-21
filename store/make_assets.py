# TektikUYAP logo ve mağaza görsellerini üretir: python3 store/make_assets.py
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = '/System/Library/Fonts/Supplemental/'
RED1, RED2 = (165, 32, 52), (110, 16, 32)

def grad(w, h, c1, c2):
    g = Image.new('RGB', (w, h))
    px = g.load()
    for y in range(h):
        for x in range(w):
            t = (x / w * .4 + y / h * .6)
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
    return g

def logo(S=1024):
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * .22), fill=255)
    im.paste(grad(S, S, RED1, RED2), (0, 0), mask)
    d = ImageDraw.Draw(im)
    u = S / 100
    # arka belge
    d.rounded_rectangle([30*u, 18*u, 72*u, 66*u], radius=4*u, fill=(255, 255, 255, 110))
    # ön belge
    d.rounded_rectangle([24*u, 24*u, 66*u, 74*u], radius=4*u, fill=(255, 255, 255, 255))
    for i, y in enumerate([33, 40, 47]):
        d.rounded_rectangle([31*u, y*u, (59 if i < 2 else 50)*u, (y+3)*u], radius=1.5*u, fill=(*RED1, 255))
    # indirme rozeti
    cx, cy, r = 68*u, 70*u, 19*u
    d.ellipse([cx-r-2*u, cy-r-2*u, cx+r+2*u, cy+r+2*u], fill=(*RED2, 255))
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(255, 255, 255, 255))
    d.rounded_rectangle([cx-3*u, cy-11*u, cx+3*u, cy+3*u], radius=1.5*u, fill=(*RED1, 255))
    d.polygon([(cx-10*u, cy+0*u), (cx+10*u, cy+0*u), (cx, cy+11*u)], fill=(*RED1, 255))
    return im

L = logo()
for n in (16, 32, 48, 128):
    L.resize((n, n), Image.LANCZOS).save(f'{ROOT}/icons/icon{n}.png')
L.resize((512, 512), Image.LANCZOS).save(f'{ROOT}/store/assets/logo-512.png')

def promo(w, h, path, big):
    bg = grad(w, h, RED1, RED2).convert('RGBA')
    d = ImageDraw.Draw(bg)
    ls = int(h * (.52 if big else .36))
    m = int(h*(.18 if big else .08))
    bg.alpha_composite(L.resize((ls, ls), Image.LANCZOS), (m, (h - ls)//2))
    x = m + ls + int(h*(.12 if big else .07))
    t1 = ImageFont.truetype(F + 'Arial Bold.ttf', int(h * (.15 if big else .115)))
    t2 = ImageFont.truetype(F + 'Arial.ttf', int(h * (.065 if big else .054)))
    d.text((x, h*.27), 'TektikUYAP', font=t1, fill='white')
    lines = ['UYAP dosyasındaki tüm evrakları', 'tek tıkla ZIP olarak indirin'] if not big else \
            ['Avukat · Bilirkişi · Vatandaş UYAP', 'Dosyanın tüm evrakları tek tıkla, tek ZIP']
    for i, s in enumerate(lines):
        d.text((x, h*(.5 + i*.1)), s, font=t2, fill=(255, 225, 230))
    t3 = ImageFont.truetype(F + 'Arial Bold.ttf', int(h * (.05 if big else .043)))
    d.text((x, h*.76), 'Açık kaynak · Ücretsiz · Veri toplamaz', font=t3, fill=(255, 200, 210))
    bg.convert('RGB').save(path)

promo(440, 280, f'{ROOT}/store/assets/promo-440x280.png', False)
promo(1400, 560, f'{ROOT}/store/assets/marquee-1400x560.png', True)
print('ok')
