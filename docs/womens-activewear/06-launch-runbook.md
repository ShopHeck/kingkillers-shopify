# 06 — Launch Runbook

A launch date is not a plan. This is the sequence, the gates, and what "ready" means.

Timings assume a **six-week runway**. Compress if you must, but the two things that
cannot be compressed are ambassador seeding (needs three weeks to produce content) and
waitlist building (needs two weeks to produce a list worth emailing).

---

## Status right now

| Done | Not done |
|---|---|
| 8 metafield definitions created and pinned | Products are all DRAFT |
| 8 smart collections created, published, populating from tags | 4 of 8 garments have no supplier (`w:todo:sourcing`) |
| 4 existing drafts rewritten with real copy, tags, SEO, metafields | Zero product images |
| 4 new garments + 3 kits created with SKUs and full copy | `templateSuffix` not applied (waiting on theme deploy) |
| Theme: size picker, size chart, fit block, collection hero, 2 templates | `model_stats` empty on every product |
| Tag taxonomy defined and applied | Size chart not reconciled against real garments |
| | Legacy `womens` collection still pointed at `Unisex` |

---

## T-minus 6 weeks — Sourcing and truth-checking

**Gate: you cannot write a launch date until this is done.**

- [ ] Source the four unsourced garments. Filter Shopify on `w:todo:sourcing`.
- [ ] Order one sample of every style, in two sizes (an S and an XL).
- [ ] **Wear-test on the mat.** Specifically: does the rash guard ride up in a scramble?
      Are the shorts opaque in a deep squat? These are published claims.
- [ ] Take a tape to the samples and reconcile the size chart in
      `snippets/size-chart.liquid` against real garment measurements. See
      [`05-size-and-fit.md`](05-size-and-fit.md).
- [ ] Confirm every construction claim in the product copy against the supplier spec
      sheet. Where reality differs, change the copy.
- [ ] Resolve the **2XL bra gap** — source it or drop 2XL from both kits.
- [ ] Confirm your POD app can fulfil a multi-item kit SKU.
- [ ] Rename or archive the `Gold Paisley "Versace Style" Sports Bra`.

## T-minus 5 weeks — Imagery and ambassadors

- [ ] Run the render prompt packs in [`04-image-direction.md`](04-image-direction.md).
      Six shots per SKU, composite the real graphics, run the nine-point QA gate.
- [ ] Build the shot-6 fit graphics in a design tool with real model measurements.
- [ ] Fill `custom.model_stats` on every product.
- [ ] **Ship product to 15–30 female athletes** — fighters, coaches, gym owners in the
      Tampa / St. Pete scene and beyond. Ask for three things: honest fit feedback, one
      training photo, and a review at launch. This is the highest-ROI line item in the
      entire launch and it is why the timeline is six weeks and not three.
- [ ] Set up a review app with a **"How did it fit?"** question and photo reviews.

## T-minus 4 weeks — Demand capture

- [ ] Build a waitlist landing page. Email + SMS capture, one clear promise: early access
      and the limited colourway before anyone else.
- [ ] Drive to it: existing list, organic social, the ambassadors' audiences.
- [ ] Build the flows (Sequenzy is already connected to this store):
  - Welcome / waitlist confirmation
  - Waitlist → early access → public launch (3-email sequence)
  - Abandoned cart, browse abandon
  - **Back-in-stock** — matters more than usual on a line with a limited colourway
  - Post-purchase → review request at day 14
- [ ] Target: 1,500–2,000 warm subscribers before launch. A launch email to a real list
      beats a cold ad budget every time.

## T-minus 3 weeks — Storefront build

- [ ] **Merge this branch.** The live theme is GitHub-connected, so merging deploys the
      size picker, size chart, fit block, hero and templates.
- [ ] Verify the templates appear in the theme editor.
- [ ] Set `templateSuffix: "womens"` on the 11 Round One products and the 8 collections.
      *Not before the merge — a suffix pointing at a missing template breaks the page.*
- [ ] Upload imagery with the naming convention and alt-text formula.
- [ ] Configure Search & Discovery filters. Size first. Rename the facet labels.
- [ ] Fix the legacy `womens` collection rule (see
      [`02-merchandising-architecture.md`](02-merchandising-architecture.md#the-decision-i-did-not-make-for-you)).
- [ ] Add the women's entries to `llms.txt` — it currently describes a men's-only brand.
- [ ] Close the schema gaps: `size`, `color`, `suggestedGender`,
      `hasMerchantReturnPolicy`, `shippingDetails`.

## T-minus 2 weeks — Creative and paid

- [ ] Produce **8–12 ad creative variants**. One hero video is not a campaign; ad
      accounts need something to choose between. Motion Creative Analytics is connected
      to this workspace if you want to benchmark against competitor creative.
- [ ] Angles worth testing, roughly in order of expected performance:
  1. *"Cut on a women's block, not a men's small"* — the rash guard differentiator
  2. Founder / fighter-owned credibility
  3. Squat-proof demonstration (this films well)
  4. Ambassador UGC
  5. Kit value
  6. XS–2XL size range
- [ ] Sync the Meta and Google catalogues. Confirm the women's products are approved —
      apparel gets rejected for missing GTINs and for missing gender attributes.
- [ ] Set up UTMs and a collection-level analytics view.

## T-minus 1 week — Rehearsal

- [ ] Flip the line to ACTIVE on a password-protected preview and place a **real test
      order** through checkout to fulfilment for one garment and one kit.
- [ ] Test the size picker on a real phone. Sold-out state, arrow keys, size-chart button.
- [ ] Run Lighthouse on a women's PDP and on the collection page.
- [ ] Confirm every flow fires: cart abandon, back-in-stock, post-purchase.
- [ ] Confirm returns/exchange copy matches the actual returns process.
- [ ] Seed the ambassadors' reviews so no PDP launches at zero reviews.

## Launch week

| Day | Action |
|---|---|
| **−2** | Waitlist teaser. No link. Build tension. |
| **−1** | "Tomorrow, 10am ET." Full lookbook, no purchase link. |
| **0, 10am** | **Early access to the waitlist only.** 24 hours. |
| **+1, 10am** | Public launch. Email everyone, all channels, paid live. |
| **+3** | Ambassador content wave — their posts, your reposts. |
| **+7** | First restock/sell-through read. Back-in-stock flows on anything gone. |

Early access is not a gimmick. It converts the waitlist at a far higher rate than a
public launch, it creates genuine scarcity on the limited colourway, and it means launch
day opens with revenue and reviews already on the board rather than a cold storefront.

---

## Post-launch, first 30 days

- **Week 1:** sell-through by size and colourway. Any size below 40% of curve is a
  demand signal, not an accident.
- **Week 2:** first fit-feedback data. Watch the "How did it fit?" split before the
  return rate — it moves weeks earlier.
- **Week 3:** kill or double down on creative. Restock decisions on the hero SKUs.
- **Week 4:** returns data is real now. Re-grade anything with a fit-driven return rate
  20%+ above line average.
- **Day 60:** replace the rendered hero images with real ambassador photography. Consider
  the 301 from `/collections/womens` to `/collections/womens-activewear`.

---

## The three things most likely to sink this

1. **Launching before the fit system is real.** The size chart is currently a standard
   grade, not your garments. Ship it unreconciled and you will fund a 35% return rate.
2. **Launching to nobody.** Products go ACTIVE, nobody is told, sales are flat, and the
   line gets read as a failed idea when it was a failed launch. The waitlist is not
   optional.
3. **Launching with zero reviews.** A women's activewear PDP at zero reviews converts at
   a fraction of one at twenty. You cannot fix this after launch — only before, through
   ambassador seeding.

Each of those is preventable and each is boring. That is why they get skipped.
