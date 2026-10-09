# Sunum export (PowerPoint + PDF fallback)

Renders `/sunum` (the twelve talk slides and the appendix) into layered PNGs and assembles
`Nirengi-sunum.pptx` (pictures at exact stage positions, Fade + rise entrances in `--d`
order, Morph between slides with Niri and the bubble named `!!niri` / `!!bubble`, the
promo video embedded on the film slide and started automatically, speaker notes from
`notes.ts`) plus a static `Nirengi-sunum.pdf` (the film slide shows its poster).
Generated files stay out of the repo.

Needs: the dev server on `127.0.0.1:4321`, Node 23.6+ (reads `notes.ts` directly),
Playwright with Chromium (repo `node_modules`, or `PLAYWRIGHT_DIR=<folder with
node_modules/playwright>`; `CHROME_PATH` for a specific browser), Python with
`python-pptx` and Pillow.

```sh
cd scripts/sunum-export
L="$TEMP/nirengi-sunum-layers"; O="$USERPROFILE/Documents/Nirengi-sunum"
MSYS_NO_PATHCONV=1 node capture.mjs --out "$L"   # 20 slides, ~1 min
python build.py "$L" "$O"                         # writes the .pptx and .pdf
python verify.py "$L" "$O"                        # checks + pixel diff + contact.png in $L
```

`verify.py` also validates every slide against `pml.xsd` when `OOXML_PML_XSD` points at it.
