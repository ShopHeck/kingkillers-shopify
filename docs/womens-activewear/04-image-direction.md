# 04 — Image Direction & Render Prompt Packs

No image generation runs in this repo or in the session that produced it. What follows
is the production system: the shot grid, the prompt formula, per-SKU garment blocks, and
the QA gate. Run the prompts in whatever tool you use (Midjourney, Flux, Nano Banana,
Seedream, Firefly) and composite the graphics in afterwards.

---

## The two rules that decide whether this looks real or looks generated

**Rule 1 — Describe construction, not vibes.** "Cute women's gym shorts, athletic, high
quality" produces a plastic mannequin wearing a garment that does not exist. "High-rise
compression short, 7-inch inseam, flatlock seams visible at the side panel, gusseted
crotch, matte four-way-stretch knit with a slight sheen at the highlight" produces a
garment a manufacturer could cut. The model renders what you name. Name the seams.

**Rule 2 — Never let the model render your logo or your graphic.** Generative models
cannot reproduce a specific wordmark or a specific splatter pattern. They produce a
smeared approximation, and on a $59 rash guard that reads as counterfeit. So:

1. Render the garment in **flat, unprinted colour** (solid black, solid bone).
2. Composite the real splatter artwork and the real King Killers wordmark on top, using
   a displacement map generated from the render so the print follows the fabric folds.
3. Multiply or overlay the print layer at 90–95% so fabric texture reads through it.

This is the whole difference between a launch that looks like a brand and one that looks
like a dropshipper. It costs about ten minutes per image.

**Corollary worth money:** if you always render the garment flat and composite the print,
you can reuse **one render per silhouette per colourway** across every print variant.
Nine high-waisted shorts in nine prints need one render, not nine shoots.

---

## The 6-shot grid

Every SKU gets the same six shots in the same order. Consistency across a PDP gallery is
most of what makes a collection look considered rather than assembled.

| # | Shot | Ratio | Purpose |
|---|---|---|---|
| 1 | On-model, 3/4 front, studio | 4:5 | Hero. The ad, the collection tile, the Meta catalogue image. |
| 2 | On-model, back | 4:5 | Answers the coverage question. Non-negotiable on bottoms. |
| 3 | Action / environment | 4:5 | Proof it works. Mat, cage, heavy bag, rack. |
| 4 | Detail macro | 1:1 | Waistband, gusset, flatlock seam, gripper. The trust shot. |
| 5 | Flat lay on concrete | 1:1 | True silhouette with no body distortion. |
| 6 | Fit graphic | 4:5 | Model height/weight/size + key measurements. **Build in a design tool, not AI.** |

Shot 4 is the one most brands skip and the one that sells a $59 rash guard. A macro of a
flatlock seam and a silicone gripper is a claim you can see.

---

## Prompt formula

Compose every prompt from these blocks, in this order. Swap only the garment block.

```
[SUBJECT] + [GARMENT CONSTRUCTION] + [FABRIC] + [STYLING] +
[ENVIRONMENT] + [CAMERA] + [LIGHT] + [OUTPUT]
```

### Reusable blocks

**SUBJECT (studio)**
> An athletic woman in her late twenties, visible muscle definition through the
> shoulders and quads, natural skin texture with pores and minor imperfections, hair
> pulled back tight in a braid, no visible jewellery, neutral confident expression,
> looking just off camera

**SUBJECT (action)**
> An athletic woman in her late twenties mid-movement, hair pulled back tight, focused
> expression, wrists taped, bare feet on the mat

**ENVIRONMENT (studio)**
> Seamless charcoal-grey studio backdrop, subtle floor gradient, nothing else in frame

**ENVIRONMENT (gym)**
> A working combat sports gym — worn black tatami mats, a chain-link cage panel and a
> heavy bag soft in the background, chalk dust in the air, practical overhead lighting

**CAMERA**
> Shot on a full-frame camera with an 85mm f/1.8 lens at f/2.8, subject sharp and
> background falling off softly, shot from chest height, eye-level perspective

**CAMERA (macro, shot 4)**
> Shot with a 100mm macro lens at f/5.6, extreme close detail on the seam and waistband,
> fabric weave and stitch thread clearly resolved

**LIGHT**
> Single large softbox at 45 degrees camera-left with a silver reflector camera-right, a
> hard rim light behind the subject separating her from the background, deep but open
> shadows, editorial contrast

**OUTPUT**
> Photorealistic commercial apparel photography, colour-accurate, ungraded neutral white
> balance, 4:5 aspect ratio, high resolution

### Global negative prompt

Paste this on every render.

```
text, letters, logo, wordmark, brand name, printed graphic, watermark, signature,
extra fingers, malformed hands, six fingers, warped limbs, distorted anatomy,
plastic skin, airbrushed skin, waxy skin, doll-like face, oversmoothed,
melted seams, seams that do not continue, asymmetric waistband, floating fabric,
impossible drape, camel toe, sexualised framing, low-cut posing,
oversaturated, HDR, heavy vignette, lens flare, motion blur, jpeg artifacts,
mannequin, storefront mannequin, floating garment, ghost mannequin
```

Two notes. `text, letters, logo, wordmark, printed graphic` are deliberate — you want the
garment blank so you can composite the real artwork. `camel toe, sexualised framing,
low-cut posing` are there because activewear prompts drift that way by default, and this
is a brand for women who train, sold largely to women. The framing has to earn their
trust, not their discomfort.

---

## Per-SKU garment blocks

Drop one of these into the `[GARMENT CONSTRUCTION] + [FABRIC]` slot.

### Contender Long-Sleeve Rash Guard
> wearing a fitted long-sleeve compression rash guard in solid matte black, women's
> athletic cut with princess seams running vertically through the torso, high raised crew
> neckline, raglan sleeve construction, flatlock seams clearly visible along the sleeve
> and side panel, sleeves ending clean at the wrist with no thumbholes, a narrow silicone
> gripper band at the hem, garment sitting tight to the body with no excess fabric, in a
> 220gsm four-way-stretch performance knit with a low matte sheen

### Bloodline / Warpaint High-Waisted Training Short
> wearing high-waisted compression training shorts in solid matte black, wide high-rise
> waistband sitting at the natural waist, 7-inch inseam, gusseted crotch panel visible as
> a diamond seam, flatlock stitching along the side seam and waistband join, a narrow
> silicone gripper at the leg opening, in a squat-proof four-way-stretch performance knit
> with a soft matte finish

### Patriot High-Waisted Training Legging
> wearing high-rise 7/8-length training leggings in solid matte black, wide 11-inch
> waistband with no front seam through the centre, gusseted crotch panel, deep set-in
> side pockets visible along the thigh, flatlock seams throughout, hem ending just above
> the ankle bone, in a 280gsm squat-proof four-way-stretch knit with a buttery matte
> surface

### Crown Seamless Training Bra
> wearing a medium-impact seamless sports bra in solid matte black, racerback
> construction, wide two-inch elasticated underband, scoop neckline, completely seamless
> knit body with no bonded panels or visible stitching, smooth compressive fit, in a
> nylon-elastane seamless performance knit

### Southpaw 2-in-1 Fight Short
> wearing women's 2-in-1 fight shorts in solid matte black, a woven outer short with a
> 5-inch inseam and a side split running up the outer thigh, a visible bonded compression
> liner ending 4 inches down the leg underneath, flat waistband with a flat internal
> drawcord, bar-tack reinforcement stitching at the top of the side split, in a
> lightweight four-way-stretch woven shell

### Warcry Racerback Tank
> wearing a relaxed racerback training tank in solid matte black, deep drop armhole
> exposing the shoulder and upper ribcage, racerback cut narrow between the shoulder
> blades, curved hem dropping longer at the back, fabric hanging loose away from the
> body, in a lightweight breathable jersey knit

### Regicide Cropped Sleeveless Hoodie
> wearing a cropped sleeveless hoodie in solid matte black, body ending at the natural
> waist, raw unfinished cut edges at the armholes, lined hood with a flat drawcord,
> kangaroo pocket across the front, in a midweight brushed-back fleece with a soft napped
> surface

---

## Worked example — Contender rash guard, hero shot

```
An athletic woman in her late twenties, visible muscle definition through the shoulders,
natural skin texture with pores and minor imperfections, hair pulled back tight in a
braid, no visible jewellery, neutral confident expression, looking just off camera,
wearing a fitted long-sleeve compression rash guard in solid matte black, women's
athletic cut with princess seams running vertically through the torso, high raised crew
neckline, raglan sleeve construction, flatlock seams clearly visible along the sleeve and
side panel, sleeves ending clean at the wrist with no thumbholes, a narrow silicone
gripper band at the hem, garment sitting tight to the body with no excess fabric, in a
220gsm four-way-stretch performance knit with a low matte sheen, paired with plain black
compression shorts, standing three-quarter to camera with weight on the back foot,
seamless charcoal-grey studio backdrop, subtle floor gradient, nothing else in frame,
shot on a full-frame camera with an 85mm f/1.8 lens at f/2.8, from chest height, single
large softbox at 45 degrees camera-left with a silver reflector camera-right and a hard
rim light behind the subject, deep but open shadows, editorial contrast, photorealistic
commercial apparel photography, colour-accurate, neutral white balance, 4:5, high
resolution
```

Then composite: splatter artwork over the torso and left sleeve using a displacement map
from the render, chest wordmark at roughly 3.5 inches wide, both at 92% opacity in
Multiply.

---

## Consistency across a SKU's six shots

Six shots of six different women is the fastest way to look like a dropshipper.

- Generate the model once, then **reuse the same seed** and the same subject block for
  every shot in that SKU. Where the tool supports character reference (`--cref`,
  reference image, style reference), use it.
- Keep hair, skin tone, build and styling identical across all six.
- Keep the studio block byte-identical across shots 1, 2 and 4 so backgrounds match.
- Vary the model **between** SKUs, not within one. Three or four athletes across the ten
  styles reads as a real cast. One model across all ten reads as a catalogue. Ten
  different models reads as stock.

---

## File naming and alt text

**Filename:** `kk-w-{style}-{colorway}-{shot}.jpg`
Example: `kk-w-contender-rashguard-blackout-01-hero.jpg`

Shot codes: `01-hero` · `02-back` · `03-action` · `04-detail` · `05-flat` · `06-fit`

**Alt text formula:** `{who} + {garment} + {distinguishing construction detail}`

- Good: `Woman wearing the King Killers Contender long-sleeve rash guard in black, showing the flatlock shoulder seams`
- Good: `Close detail of the silicone waist gripper on the Contender women's rash guard`
- Bad: `rashguard.jpg`
- Bad: `King Killers rash guard buy now best women's rashguard cheap`

Alt text is read by screen readers and by Google Images. Keyword-stuffed alt text serves
neither.

---

## Sizing and compression before upload

- Hero and gallery: **2000px on the long edge**, JPEG quality 82, sRGB. Shopify serves
  responsive derivatives from this; uploading a 6000px original only slows the CDN origin
  fetch without improving what anyone sees.
- Keep every image in a collection grid to the **same aspect ratio** (4:5). Mixed ratios
  are the most common reason a PLP looks unfinished.
- Strip EXIF before upload.

---

## QA gate — nothing reaches a PDP until it passes all nine

1. **Hands:** five fingers, correct joints, no fusion.
2. **Seams:** every seam starts and ends somewhere and continues around the body.
3. **Waistband:** symmetrical, consistent width left to right.
4. **Logo and print:** composited from real artwork, not rendered. Nothing smeared.
5. **Skin:** has visible texture. If it looks airbrushed, it reads as fake.
6. **Drape:** fabric responds to gravity and to the body underneath it.
7. **Colour:** the black in shot 1 matches the black in shots 2–5.
8. **Model:** the same person across all six shots of this SKU.
9. **Framing:** would you show this to a woman at your gym without wincing?

Failures on 1–4 are unusable. Failures on 5–8 are fixable in post. A failure on 9 is a
brand problem, not a production problem.

---

## What renders cannot do for you

Be honest about the ceiling. Rendered imagery is good enough for top-of-funnel ads,
collection tiles and secondary gallery slots. It is not good enough for:

- **Proving fit on real bodies.** Shot 6 needs real measurements, and your
  best-converting images will eventually be real athletes in real gyms.
- **UGC and reviews.** No render substitutes for a customer photo.
- **The size-and-fit trust problem**, which is what actually drives women's activewear
  returns. See [`05-size-and-fit.md`](05-size-and-fit.md).

Plan to replace shots 1–3 with real photography of ambassador athletes within 60 days of
launch. Use renders to reach launch, not to stay there.
