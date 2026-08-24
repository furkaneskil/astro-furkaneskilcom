"""Derive a transparent ink mask from the supplied blue Hermes engraving."""

from pathlib import Path

from PIL import Image, ImageChops, ImageOps


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/images/hermes.png"
OUTPUT = ROOT / "public/images/hermes-ink-mask.png"


with Image.open(SOURCE) as source:
    rgba = source.convert("RGBA")
    red, _, _, source_alpha = rgba.split()
    blue_ink = ImageOps.invert(red)
    ink_alpha = ImageChops.multiply(blue_ink, source_alpha)
    mask = Image.new("RGBA", rgba.size, (255, 255, 255, 0))
    mask.putalpha(ink_alpha)
    mask.save(OUTPUT, optimize=True)
