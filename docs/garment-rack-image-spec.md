# Garment Rack — Product Image Requirements

How to shoot, retouch and upload King Killers product images so the **KK Garment Rack** homepage section (`sections/kk-garment-rack.liquid`) looks like a real boutique rail instead of a row of product photos.

---

## TL;DR checklist

- [ ] **One cutout per top**: a front-view garment on an invisible mannequin ("ghost"), with a **transparent background**, as a **PNG at 1200 × 1500 px (4:5)**.
- [ ] **No hanger, no shadow, no background** in the file. The section draws the chrome rail, the wooden hanger and the drop shadow itself.
- [ ] **Collar and shoulders in the same place on every file** (see [the canvas template](#3-the-canvas-template)), so every garment hangs from the drawn hanger at the same height.
- [ ] Upload it to the product metafield **`custom.rack_image`**. This keeps your storefront product photos unchanged.
- [ ] **Publish the products.** All 12 FW26 products are currently **Draft with no images**, and the rack only shows active, published products.

---

## 1. Where the drop stands today

Live catalog (tag `FW26`, collection `fall-winter-2026`), checked 2026-09-30:

| Product | Type | Status / media | On the rack? |
|---|---|---|---|
| No Crown Given Heavyweight 10oz Pullover Hoodie | Hoodie | Draft, no image | ✅ Hero piece; put it early in the collection sort |
| The Contender Athletic Drop-Armhole Sleeveless Hoodie | Sleeveless Hoodie | Draft, no image | ✅ |
| Pretty Dangerous Cropped Fleece Pullover Hoodie | Cropped Hoodie | Draft, no image | ✅ Hangs shorter, which is correct |
| The Contender Heavyweight Combat Tee | T-Shirt | Draft, no image | ✅ |
| Pretty Dangerous Heavyweight Pump Cover Boxy Tee | T-Shirt | Draft, no image | ✅ |
| Stealth Camo Long-Sleeve Compression Rash Guard | Rash Guard | Draft, no image | ✅ Compression fit; see [§4](#4-shooting-guide) |
| Pretty Dangerous Longline Padded Sports Bra | Sports Bra | Draft, no image | ⚠️ Optional; small on a hanger (see §4) |
| Pretty Dangerous High-Waisted AOP Leggings | Leggings | Draft, no image | ❌ Skipped (bottom) |
| Pretty Dangerous High-Waisted Biker Shorts | Athletic Shorts | Draft, no image | ❌ Skipped (bottom) |
| No Crown Given Tapered Technical Fleece Joggers | Joggers | Draft, no image | ❌ Skipped (bottom) |
| Core Performance Slit Training Shorts | Athletic Shorts | Draft, no image | ❌ Skipped (bottom) |
| Gothic Crown Heavy Ribbed Cuffed Beanie | Knit Beanie | Draft, no image | ❌ Skipped (accessory) |

**Rack lineup: 6–7 tops.** Bottoms and accessories are left off by the section's *Skip product types containing* setting (`…legging, shorts, jogger, pant`), because trousers on a shirt hanger look wrong.

- **Until at least one top is published with an image, the section hides itself** on the live site. The theme editor shows a prompt instead.
- **Seven garments on the rail looks sparse.** The reference video used about 10. To fill it, add more tops to `fall-winter-2026` (graphic tees, crewnecks from `graphic-hoodies`), or point the section at a larger collection until the drop grows.

---

## 2. Two ways to supply images

| | **A. Rack cutout (recommended)** | **B. Featured-image fallback** |
|---|---|---|
| Source | Metafield `custom.rack_image` | The product's first image |
| Background | Transparent | Must be **pure white `#FFFFFF`** |
| Light stage | ✅ Clean cutout plus a real drop shadow | ✅ White is blended away; no shadow |
| Dark stage | ✅ | ❌ Shows white photo cards |
| Effect on product page or collection grid | None | That image also becomes your PDP/grid lead image |

**Use A.** Option B only works if every featured image is a front-view ghost-mannequin shot on pure white. Lifestyle or model shots, or off-white and grey sweeps, show up as boxes on the rail.

---

## 3. The canvas template

The section draws a hanger over the top of each image and crops everything to **4:5, anchored at the top centre**. These positions come from the section's CSS; use them as fixed guides in Photoshop, Photopea or your retoucher's template.

**Canvas: 1200 × 1500 px, transparent, sRGB.**

```
         0                 600                1200
    0 ┌──────────────────────┬──────────────────┐
      │                      ▼ neck / hook      │  ← collar top centre: x 600, y ≈ 70
  165 │        ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲          │  ← hanger bar ends: x ≈ 255 and 945, y ≈ 165
      │       │  shoulder seams sit   │          │     (shoulder seams just below this line)
      │       │  just under the bar   │          │
      │       │                       │          │
      │       │     GARMENT BODY      │          │  ← chest print centred on x = 600
      │       │                       │          │
      │       │                       │          │
 1440 │       └───────────────────────┘          │  ← longest hem (hoodie) ends by y ≈ 1440
 1500 └──────────────────────────────────────────┘
```

| Guide | Value (px on 1200 × 1500) | Why |
|---|---|---|
| Collar top centre | x 600, y 60–80 | The hanger's hook and neck point sit here |
| Shoulder seam points | x ≈ 255 and ≈ 945, y 165–190 | The wooden hanger bar ends here; the shoulders must sit *under* it, not float above or below |
| Shoulder width | ≈ 690 px (58% of width) for **every** garment | Keeps sizes consistent on the rail. A tee and a hoodie share a shoulder line and differ in length, not width. |
| Side margin | ≥ 40 px | Sleeves of wide boxy tees must not touch the edges (they would be cropped when rotated) |
| Bottom margin | ≥ 60 px | Room for the hem; keeps the hanging rhythm |
| Horizontal centre | Garment centred on x = 600 | The swing-to-front rotates around the centre line |

**Garment lengths as they should read on the rail** (at the same shoulder width):
- Cropped hoodie: hem at about y 1000.
- Boxy tees: hem at about y 1150–1250.
- Pullover hoodie and rash guard: hem at about y 1350–1440.

This variation is what makes the rail look real. Don't stretch pieces to a common length.

---

## 4. Shooting guide

**Method: ghost mannequin (invisible mannequin).**
- Shoot the front on a mannequin or hanger form, then shoot the inside back of the neck.
- Composite the two so the collar looks hollow and 3D.
- Remove the mannequin, any real hanger, clips and tags.

**Avoid flat lays.** They look lifeless and too wide when "hung".

**Setup:**
- Plain white or light-grey background. It gets removed anyway, but a clean background speeds up cutting.
- Soft, even front light with a large softbox, and no hard shadows across the chest print.
- One continuous session, with the **same lens, distance and height for every garment**, so scale matches without rescaling.
- Camera at chest height, lens roughly 70–100 mm equivalent (flat perspective, no barrel distortion), shot tethered.
- Colour: include a grey card or ColorChecker in the first frame of every setup. Obsidian Black must read as **deep black with fabric texture**, not crushed or navy. Keep Blood Red on-brand, not orange.

**Per garment:**

| Garment | Notes |
|---|---|
| **No Crown Given Hoodie** | Hood **up and shaped** behind the neck (stuff it with tissue) so it shows above the collar line. Drawstrings even and hanging straight. Pocket flat. |
| **Contender Sleeveless Hoodie** | Deep drop armholes must read clearly; shape them on the form so they don't collapse. Hood as above. |
| **Pretty Dangerous Cropped Hoodie** | Raw hem visible and straight. Drop shoulders mean the seam sits lower: align the *top of the shoulder curve* to the bar line, not the seam. |
| **Contender Tee / Pump Cover Boxy Tee** | Boxy fit: let the body hang wide and straight, with no pinching at the sides. Keep the 1.25″ collar round, not V'd by tension. |
| **Stealth Camo Rash Guard** | Compression fabric collapses without a form. Shoot it on a **slim torso form** so it has volume. The camo must stay sharp: no motion blur, no heavy noise reduction. |
| **Pretty Dangerous Sports Bra** (optional) | Use a small torso form. On the rail it will look small next to hoodies. That is realistic, but if it reads as a gap, leave it off (add `bra` to the skip list). |

**Also shoot, for the product pages:** back view, a close-up of the print or embroidery, and a detail of the fabric texture. The rack only uses the front cutout; the product page needs the rest.

---

## 5. Retouching and export

| Spec | Requirement |
|---|---|
| Format | **PNG-24 with alpha.** Shopify's CDN converts it to WebP/AVIF automatically, keeping transparency. |
| Size | **1200 × 1500 px exactly (4:5).** Minimum 960 × 1200; anything smaller looks soft in the enlarged view on retina screens. |
| Colour space | sRGB, embedded profile |
| File weight | ≤ 600 KB per PNG (use a PNG optimiser such as TinyPNG or `oxipng`) |
| Background | Fully transparent: alpha 0, with no leftover white or grey pixels |
| Edges | Clean mask with 0.5–1 px feather. **Defringe or remove the white matte**; halos show on the dark stage, especially on Obsidian Black pieces. |
| Shadow | **None.** The section adds its own drop shadow; a baked-in shadow doubles up and floats the garment. |
| Hanger or mannequin | Fully removed (the section draws the hanger) |
| Lint, creases, loose threads | Cleaned. The enlarged view shows the garment up to 420 px wide on retina. |
| Print colour | Match the physical garment; check it against the grey-card frame |
| File name | `<product-handle>-rack.png`, e.g. `no-crown-given-heavyweight-hoodie-rack.png` |

**Quick path for existing product photos:** if a product already has a clean front shot, Shopify's admin image editor (*Products → media → Edit → Remove background*) can produce a transparent version. Then place it on the 1200 × 1500 canvas to the guides in §3. Check the edges by hand, because automatic removal often clips drawstrings, collar interiors and camo edges.

---

## 6. Keep the rail consistent

The effect depends on the garments looking like one photoshoot:

1. **Same shoulder line and width** on every file (§3). This is the most important rule.
2. **Same light direction and exposure.** One garment lit warmer or darker stands out immediately.
3. **Same viewing angle.** Straight front, no three-quarter turns.
4. **Colourway order.** The rack follows the collection's sort order. Set `fall-winter-2026` to **Manual** and alternate darks with lighter or red pieces. An all-black run reads as one dark block. The drop is heavily Obsidian Black, so place the Stealth Camo and any Blood Red pieces between the blacks.
5. **One colourway per product on the rack.** The cutout shows the product's primary colour. If a product sells in several colours, choose the best-selling or most striking one.

---

## 7. Upload

**One-time setup: create the metafield definition**
1. Go to *Settings → Custom data → Products → Add definition*.
2. Name it **Rack image**, with namespace and key **`custom.rack_image`**.
3. Set the type to **File**, limited to **Images**, and save.

**Per product**
1. Open the product.
2. Scroll to *Metafields → Rack image* and upload `<handle>-rack.png`.
3. Set the product to **Active** and make sure it's published to the **Online Store** channel.
4. Also give it a normal featured image for the product page and grid. The rack does not need it, but the rest of the store does.

**Section settings** (*Online Store → Customize → Home page → KK Garment Rack*)
- **Collection:** `fall-winter-2026`
- **Stage:** Light showroom. Switch to Dark only after **every** hung product has a cutout.
- **Garments on the rack:** 12. It shows fewer if fewer qualify.

---

## 8. Final check before it goes live

Preview on a duplicate theme (or with `shopify theme dev`), then check:

- [ ] Every garment hangs **from** the drawn hanger. No garment floats under it or has its collar poking above it.
- [ ] At rest (side-on), garments look evenly spaced, with none noticeably wider or narrower.
- [ ] Hovering each one swings it front-facing with no white box, halo or grey fringe.
- [ ] The enlarged view (click) is sharp on a retina laptop and a phone.
- [ ] **Light** and **Dark** stages both look clean, if you plan to use Dark.
- [ ] On mobile, the rail scrolls sideways and a tap opens the enlarged view.
- [ ] Prices, sizes and sold-out states in *See availability* match the product page.
- [ ] No bottoms or accessories are on the rail.

---

## 9. Sourcing options

| Option | Turnaround | Notes |
|---|---|---|
| In-house (camera, mannequin, Photoshop) | 1–2 days for 7 tops | Cheapest if you have a torso form; ghost compositing takes the most time |
| Ghost-mannequin studio (send product) | 3–7 days | Most consistent result. Send them §3 and §5 as the brief. |
| Remote retoucher (you shoot, they cut) | 1–3 days | Send raw front and inner-neck shots plus this spec. Usually priced per image. |
| Print-on-demand mockups | Same day | Only for items made through a POD supplier. Use a *ghost / invisible mannequin* mockup style exported as transparent PNG, then place it on the §3 canvas. It won't match studio shots, so don't mix the two on one rail. |
