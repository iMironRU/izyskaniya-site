"""Склеивает части шрифтов @fontsource (латиница + кириллица) в цельные TTF для PDF.

react-pdf не умеет woff2 и разбивку по unicode-range, поэтому нужен один файл на начертание.
Результат коммитится в assets/pdf-fonts/ (шрифты под OFL — распространять можно, лицензия рядом).
Запуск нужен, только если сменились шрифты: python3 -m pip install fonttools && python3 scripts/build-pdf-fonts.py
"""
from pathlib import Path

from fontTools.merge import Merger
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'pdf-fonts'
SUBSETS = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext']
FONTS = {
    'Lora-Regular': ('lora', '400-normal'),
    'Lora-Italic': ('lora', '400-italic'),
    'Lora-SemiBold': ('lora', '600-normal'),
    'CormorantGaramond-Regular': ('cormorant-garamond', '400-normal'),
    'CormorantGaramond-SemiBold': ('cormorant-garamond', '600-normal'),
}

OUT.mkdir(parents=True, exist_ok=True)
tmp = OUT / '.tmp'
tmp.mkdir(exist_ok=True)
for name, (pkg, style) in FONTS.items():
    parts = []
    for sub in SUBSETS:
        src = ROOT / 'node_modules' / '@fontsource' / pkg / 'files' / f'{pkg}-{sub}-{style}.woff'
        font = TTFont(src)
        font.flavor = None
        dst = tmp / f'{name}-{sub}.ttf'
        font.save(dst)
        parts.append(str(dst))
    merged = Merger().merge(parts)
    merged.save(OUT / f'{name}.ttf')
    print(name, (OUT / f'{name}.ttf').stat().st_size // 1024, 'КБ')
for f in tmp.iterdir():
    f.unlink()
tmp.rmdir()
