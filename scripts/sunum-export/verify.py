"""Check the exported deck without PowerPoint.

    python verify.py <layers dir> <out dir>

Reopens the pptx, checks slide count, picture bounds, names, notes, the order of
the slide parts and that every animation target exists; then composites the
placed layers back into frames, diffs them against the web screenshots and writes
a contact sheet (contact.png) next to the deck.
"""

import json
import os
import sys
import zipfile
from pathlib import Path

from lxml import etree
from PIL import Image, ImageChops, ImageDraw
from pptx import Presentation

LAYERS, OUT = Path(sys.argv[1]), Path(sys.argv[2])
PPTX = OUT / "Nirengi-sunum.pptx"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
MC = "{http://schemas.openxmlformats.org/markup-compatibility/2006}"
EMU_PX = 12192000 / 3840
problems = []
# Optional: OOXML_PML_XSD=<path to pml.xsd> also validates every slide against the schema.
XSD = etree.XMLSchema(etree.parse(os.environ["OOXML_PML_XSD"])) if os.environ.get("OOXML_PML_XSD") else None


def check(ok, msg):
    if not ok:
        problems.append(msg)


manifest = json.loads((LAYERS / "manifest.json").read_text(encoding="utf-8"))
prs = Presentation(PPTX)
W, H = prs.slide_width, prs.slide_height
check(len(prs.slides) == len(manifest["slides"]) == 16, f"slide count {len(prs.slides)}")
for n, slide in enumerate(prs.slides, 1):
    names = [s.name for s in slide.shapes]
    check(names.count("!!niri") == 1 and names.count("!!bubble") == 1, f"{n}: niri/bubble names {names}")
    check(len(set(names)) == len(names), f"{n}: duplicate names")
    for s in slide.shapes:
        check(s.left >= 0 and s.top >= 0 and s.left + s.width <= W and s.top + s.height <= H, f"{n}: {s.name} out of bounds")
    notes = slide.notes_slide.notes_text_frame.text if slide.has_notes_slide else ""
    check(len(notes) > 80, f"{n}: notes missing")

with zipfile.ZipFile(PPTX) as z:
    check(z.testzip() is None, "zip CRC error")
    for name in z.namelist():
        if name.endswith(".xml") or name.endswith(".rels"):
            etree.fromstring(z.read(name))  # raises on malformed XML
    slides = sorted((x for x in z.namelist() if x.startswith("ppt/slides/slide") and x.endswith(".xml")), key=lambda x: int(x[16:-4]))
    for n, name in enumerate(slides, 1):
        root = etree.fromstring(z.read(name))
        order = [etree.QName(c).localname for c in root]
        want = ["cSld", "clrMapOvr", "transition" if n == 1 else "AlternateContent", "timing"]
        check(order[: len(want)] == want, f"{n}: part order {order}")
        ids = {int(e.get("id")) for e in root.iter(P + "cNvPr")}
        targets = {int(e.get("spid")) for e in root.iter(P + "spTgt")}
        check(targets and targets <= ids, f"{n}: dangling spid {targets - ids}")
        ctn = [int(e.get("id")) for e in root.iter(P + "cTn")]
        check(len(ctn) == len(set(ctn)), f"{n}: duplicate cTn ids")
        if n > 1:
            check(root.find(f"{MC}AlternateContent/{MC}Choice/{P}transition") is not None, f"{n}: no morph")
        if XSD is not None:
            # The schema predates Morph: validate with the Fade fallback in its place.
            for ac in list(root.iter(MC + "AlternateContent")):
                ac.addprevious(ac.find(MC + "Fallback")[0])
                ac.getparent().remove(ac)
            check(XSD.validate(root), f"{n}: schema {XSD.error_log.last_error}")

# Composite the placed layers and diff them against the web frames.
placed = json.loads((LAYERS / "_trim" / "placed.json").read_text(encoding="utf-8"))
thumbs, worst = [], 0.0
for rec in placed["slides"]:
    n = rec["n"]
    frame = Image.new("RGBA", (3840, 2160))
    for p in rec["pics"]:
        x, y, w, h = (round(v / EMU_PX) for v in p["box"])
        im = Image.open(p["file"]).convert("RGBA")
        check(im.size == (w, h), f"{n}: {p['name']} size {im.size} vs {(w, h)}")
        frame.alpha_composite(im, (x, y))
    web = Image.open(LAYERS / f"{n:02d}" / "full.png").convert("RGB")
    diff = ImageChops.difference(frame.convert("RGB"), web).convert("L")
    off = sum(diff.point(lambda v: 255 if v > 24 else 0).histogram()[255:]) / (3840 * 2160) * 100
    worst = max(worst, off)
    print(f"slide {n:2d}: {off:.3f}% pixels differ by >24 levels")
    check(off < 0.5, f"{n}: composite differs from web on {off:.2f}% of pixels")
    pair = Image.new("RGB", (960 * 2 + 12, 540), "white")
    pair.paste(web.resize((960, 540)), (0, 0))
    pair.paste(frame.convert("RGB").resize((960, 540)), (972, 0))
    ImageDraw.Draw(pair).text((8, 6), f"{n}  web | pptx layers", fill=(200, 0, 120))
    thumbs.append(pair)

sheet = Image.new("RGB", (thumbs[0].width * 2 + 12, (thumbs[0].height + 12) * 8), (40, 40, 40))
for k, t in enumerate(thumbs):
    sheet.paste(t, ((k % 2) * (t.width + 12), (k // 2) * (t.height + 12)))
sheet.save(LAYERS / "contact.png")
print(f"contact sheet: {LAYERS / 'contact.png'}; worst slide {worst:.3f}%")
print("OK" if not problems else "PROBLEMS:\n  " + "\n  ".join(problems))
sys.exit(1 if problems else 0)
