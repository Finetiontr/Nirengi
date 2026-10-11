# Sunum export (PowerPoint + PDF fallback) and the notes

Renders `/sunum` (all its slides, each of Niri's bubbles on them) into layered PNGs and
assembles `Nirengi-sunum.pptx`: one PowerPoint slide per bubble. As on the web, Niri is silent
and its bubbles move on by themselves: every bubble but a slide's last advances after the time
its line takes to say (`src/components/sunum/timing.ts`), and a slide's last bubble waits for
the click, like → on the web. Pictures stand at exact stage positions; on a slide's first bubble
the blocks enter with Fade + rise in `--d` order, on the next bubbles they stand and only the
bubble changes with a small pop; Morph between slides with Niri and the bubble named `!!niri` /
`!!bubble` and the blocks named `!!s<n> …` so they stay put between bubbles; the promo film
embedded on the film slide and started automatically with its music; each slide's notes hold
the key point, the bubble and what to say under it, the film slide all its timed lines, the
close the answers for likely questions. Plus a static `Nirengi-sunum.pdf` (one page per
bubble; the film slide shows its poster). Bubbles are captured through the deck's `#n.k`
address. Generated files stay out of the repo.

`notes-md.mjs` writes the same notes as Markdown: `docs/SUNUM-NOTLARI.md`, plus a copy for
each `--out` path (the printed notes beside the exported deck).

Needs: the dev server on `127.0.0.1:4321`, Node 23.6+ (reads `notes.ts` directly),
Playwright with Chromium (repo `node_modules`, or `PLAYWRIGHT_DIR=<folder with
node_modules/playwright>`; `CHROME_PATH` for a specific browser), Python with
`python-pptx` and Pillow.

```sh
cd scripts/sunum-export
L="$TEMP/nirengi-sunum-layers"; O="$USERPROFILE/Documents/Nirengi-sunum"
MSYS_NO_PATHCONV=1 node capture.mjs --out "$L"   # 21 slides, 36 bubbles, ~2 min
python build.py "$L" "$O"                         # writes the .pptx and .pdf
python verify.py "$L" "$O"                        # checks + pixel diff + contact.png in $L
node notes-md.mjs --out "$O/Konusmaci-notlari.md" # docs/SUNUM-NOTLARI.md and a copy
```

`verify.py` also validates every slide against `pml.xsd` when `OOXML_PML_XSD` points at it.
