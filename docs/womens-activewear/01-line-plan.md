# 01 — Line Plan

> Written against the live King Killers catalogue as of 2 Sep 2026, not against
> assumptions. Findings from that audit are in [§0](#0-what-was-actually-there).

## 0. What was actually there

Before any of this, the women's side of the store looked like this:

| Finding | Detail |
|---|---|
| The "Women's" collection was not a women's collection | 189 products, rule = `tag:Women's Clothing OR tag:Unisex`. Most of its contents are unisex men's graphic tees. |
| Real women's activewear footprint | **13 products, every one DRAFT.** Nothing live. |
| Of those 13, nine were the same garment | Nine POD high-waisted shorts at $44.99, identical block, nine different prints. |
| Zero women's rash guards | For a combat-sports brand, the hole in the middle of the line. The store's `rash-guards` collection contained one product total. |
| Fulfilment model | Print-on-demand. Inventory figures of 79,994 / 69,993 / 59,994 are supplier placeholders, not owned stock. |
| Tag hygiene | Case-inconsistent duplicates throughout — `Mens`/`mens`, `Hoodies`/`hoodie`/`hoodies`, `Tank Tops`/`tank`/`Tank`, `Snapback`/`snapback`. Smart collections use `EQUALS`, so they silently miss products. |

Two of those are the actual answer to "why does this feel messy." The Women's collection
was pointed at the wrong tag, and one garment was merchandised nine times.

**The POD finding changes the economics.** There is no opening buy, no size-curve cash
risk and no dead stock — which removes the usual biggest launch risk. It also removes
fabric control, adds ship time, and means "squat-proof" and "no ride-up" are claims you
must verify against the supplier's actual spec sheet before publishing them. Do not
publish a performance claim this document suggests until you have held the garment.

---

## 1. Strategic position

Do not launch "women's gymwear." That category is owned by Gymshark, Alphalete and
Lululemon, all of whom outspend King Killers by orders of magnitude and all of whom sell
the same aesthetic.

Launch **womenswear for women who train to fight.** BJJ, MMA, boxing, Muay Thai, plus the
strength and conditioning around it. That market is real, underserved, and it is the one
King Killers already has permission to speak to. A fighter-owned Tampa brand with a
splatter aesthetic has no credibility problem there and no chance in generic athleisure.

Practical consequences:

- **Rash guards and fight shorts sit in the hero tier**, not the afterthought tier. They
  are what no mainstream brand cuts properly for women.
- **Sizing runs to 2XL.** Most combat-sports brands stop at L for women. Extending the
  range is cheap differentiation and it is the right thing to do.
- **Copy uses the sport's vocabulary.** Gusset, flatlock, no ride-up through guard
  passes. Not "buttery soft for your hot girl walk."
- **Squat-proof and no-ride-up are the two functional claims** the line makes. Verify
  both with the supplier, then defend them.

---

## 2. Round One — the launch drop

Eleven products. Eight garments plus three kits. Tight on purpose: the failure mode you
named comes from launching twenty-five styles with no outfit logic and a grid the shopper
cannot parse. Eight garments that snap together into complete kits will outsell
twenty-five that do not.

All eleven are **DRAFT** and carry the tag `w:drop:round-one`, which is what populates
the *Round One — The First Drop* collection.

### Tier 1 — Hero (acquisition drivers)

| Product | Price | Status | Source |
|---|---|---|---|
| Contender Long-Sleeve Rash Guard | $59.99 | New — **needs sourcing** | Created in this pass |
| Bloodline High-Waisted Training Short | $44.99 | Existing draft, rewritten | Was "Red Black White Paint Splatter High Waisted Shorts" |
| Patriot High-Waisted Training Legging | $49.99 | Existing draft, rewritten | Was "Red White Blue Patriotic High Waisted Yoga Leggings" |

### Tier 2 — Core (attach rate)

| Product | Price | Status | Source |
|---|---|---|---|
| Crown Seamless Training Bra | $39.99 | Existing draft, rewritten | Was "Black & White Marble Seamless Sports Bra" |
| Southpaw 2-in-1 Fight Short | $54.99 | New — **needs sourcing** | Created in this pass |
| Warpaint High-Waisted Training Short | $44.99 | Existing draft, rewritten | Was "Neon Paint Splatter High Waisted Shorts" |
| Warcry Racerback Tank | $29.99 | New — **needs sourcing** | Created in this pass |

### Tier 3 — Depth (margin, AOV)

| Product | Price | Status | Source |
|---|---|---|---|
| Regicide Cropped Sleeveless Hoodie | $49.99 | New — **needs sourcing** | Women's cut of a proven men's silhouette |

The sleeveless hoodie is the safest new bet in the line: the store already runs five
men's *Athletic Drop Armhole Sleeveless Hoodies* at $54.99, all ACTIVE. The supplier
relationship and the silhouette are both proven. A cropped women's version is an
extension, not a gamble.

### Kits

| Kit | Contents | Price | Separately | Saves |
|---|---|---|---|---|
| The Fight Kit | Contender Rash Guard + Bloodline Short | $94.99 | $104.98 | $9.99 |
| The Training Kit | Crown Bra + Patriot Legging | $79.99 | $89.98 | $9.99 |
| The Full Arsenal | Crown Bra + Patriot Legging + Bloodline Short + Warcry Tank | $144.99 | $164.96 | $19.97 |

Kits are built as **real products with their own PDP**, not cart-level discounts. A cart
discount is invisible in collection grids, in ads and in search. A kit product is
merchandisable, rankable and adable.

**Fulfilment caveat:** Shopify Basic has no native bundle linking. Each kit is its own
product with its own inventory. On POD that is workable — each kit becomes its own
supplier order — but confirm your POD app can map a multi-item kit SKU to multiple
fulfilment line items before you set any kit to ACTIVE.

---

## 3. Products deliberately excluded from Round One

Seven existing draft shorts and one bra are staying out. This is the "not messy" decision.

| Product | Why excluded |
|---|---|
| Women's Black & Purple Swirl Shorts | Off-brand palette |
| Black & Purple Galaxy HW Shorts | Off-brand palette |
| Black & White Swirl HW Shorts | Off-brand palette |
| Pink Camo HW Shorts | Off-brand palette |
| Red & Black Swirl HW Shorts | Close, but redundant against Bloodline |
| Graffiti Art HW Shorts | Off-brand |
| Neon Jungle Print HW Shorts | Off-brand |
| Gold Paisley "Versace Style" Sports Bra | See below |

**The Versace one is not a taste call — it is legal exposure.** "Versace Style" in a
product title uses a live luxury trademark to sell a competing good. That is exactly the
fact pattern trademark counsel sends letters about, and it will also get the product
pulled from Meta and Google Shopping catalogues. Rename it or archive it. It is currently
DRAFT, so nothing is live, but do not publish it as-is.

### The nine-shorts problem, and the fix

Nine near-identical products at the same price split your reviews nine ways, split your
SEO authority nine ways, and give the shopper nine decisions instead of one.

The better structure: **one product, "High-Waisted Training Short," with a Print option**
(Bloodline / Warpaint / Graffiti / …). One PDP accumulating all the reviews, one image
set, one URL earning authority, one decision for the shopper.

Round One ships two of them as separate products because two on-brand prints read as a
choice rather than a mess. If you later want the other prints back, consolidate them as
options on those two rather than resurrecting seven PDPs.

---

## 4. Sizing

**XS through 2XL across the line.** Every Round One product is built on that run.

One exception to fix: the Crown Seamless Training Bra currently runs **XS–XL only**. That
is a gap — a customer who buys a 2XL legging and cannot buy the matching bra notices, and
it breaks the Training Kit at the top of the range. Either extend the bra with the
supplier or drop the Training Kit's 2XL variant. Do not ship the inconsistency.

Size curve, for whenever you do move to owned inventory:

| Size | Share of units |
|---|---|
| XS | 8% |
| S | 22% |
| M | 28% |
| L | 22% |
| XL | 13% |
| 2XL | 7% |

Re-cut it after four weeks of real sell-through. It is an industry starting point, not
your customer.

---

## 5. Price ladder

$29.99 → $39.99 → $44.99 → $49.99 → $54.99 → $59.99, with kits at $79.99 / $94.99 /
$144.99.

That sits inside the established King Killers $19–$69 range, so the women's line does not
read as a different brand. The Full Arsenal at $144.99 is also the only product that
clears the $100 free-shipping threshold on its own, which is deliberate.

---

## 6. SKU scheme

```
KKW-{CAT}-{STYLE}-{CW}-{SIZE}
```

- `KKW` — King Killers Women's
- `{CAT}` — `LEG` legging · `CMP` compression short · `SHT` fight short · `BRA` sports bra ·
  `RSH` rash guard · `TEE` tee · `TNK` tank · `SHD` sleeveless hoodie · `HOD` hoodie ·
  `SOK` socks · `KIT` kit
- `{STYLE}` — style name, uppercase, no spaces
- `{CW}` — `BLK` Blackout · `BLD` Blood Splatter · `BON` Bone
- `{SIZE}` — `XS` `S` `M` `L` `XL` `2XL`

Example: `KKW-RSH-CONTENDER-BLD-M`

All four newly created garments and all three kits already carry SKUs in this scheme. The
four rewritten existing drafts do **not** — their variants keep whatever the POD importer
assigned. Backfill those before launch; you will want them for reporting and for any
future marketplace or wholesale channel.

**Barcodes:** assign GTIN-13 at variant level before anything goes ACTIVE. Google
Shopping, the Meta catalogue and every marketplace want them, and retrofitting across a
whole line after launch is a bad afternoon.

---

## 7. Garment specs

These are the specs the copy, the size chart and the render prompts all draw from.
**Every one of these must be confirmed against your supplier's spec sheet before the
product goes ACTIVE.** Where the current copy claims a construction detail the supplier
does not actually provide, change the copy — not the claim's prominence.

| Product | Fabric | Key construction | Fit |
|---|---|---|---|
| Contender Rash Guard | 82% poly / 18% elastane, 220gsm, sublimated | Women's block, princess seams, raised neckline, flatlock throughout, silicone waist gripper, no thumbholes | Compression, TTS |
| Bloodline / Warpaint Short | 82% poly / 18% elastane, 4-way stretch | High rise, 7" inseam, gusset, flatlock, leg gripper | Compression, TTS |
| Patriot Legging | 82% poly / 18% elastane, 4-way stretch | High rise, no front seam, gusset, flatlock, 7/8 length | Compression, TTS |
| Crown Bra | Nylon / elastane seamless knit | Seamless body, racerback, 2" underband, scoop neck | TTS, size down for more compression |
| Southpaw 2-in-1 | 4-way stretch woven shell + nylon/elastane liner | 5" outer inseam, side split, bonded 4" liner, flat waistband + drawcord, bar-tacks | TTS, relaxed over compression |
| Warcry Tank | Lightweight breathable jersey | Drop armhole, racerback, curved hem | Relaxed, TTS |
| Regicide Sleeveless Hoodie | Midweight brushed-back fleece | Cropped body, raw-edge armhole, lined hood, kangaroo pocket | Relaxed crop, TTS |

Everything not yet sourced is tagged `w:todo:sourcing` in Shopify. Filter on that tag to
see what still needs a supplier before launch.
