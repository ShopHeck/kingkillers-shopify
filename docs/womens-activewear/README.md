# King Killers — Women's Activewear Launch System

Everything needed to launch the women's line as a **collection with a point of view**,
not a pile of SKUs. Read in order.

| # | Doc | Answers |
|---|-----|---------|
| 1 | [`01-line-plan.md`](01-line-plan.md) | What exactly are we selling? How many styles, colorways, sizes, at what price, bought how deep? |
| 2 | [`02-merchandising-architecture.md`](02-merchandising-architecture.md) | How is it organized? Tag taxonomy, collections, filters, navigation, internal linking. |
| 3 | [`03-product-page-spec.md`](03-product-page-spec.md) | PDP anatomy, copy formula, per-SKU copy, metafields, schema. |
| 4 | [`04-image-direction.md`](04-image-direction.md) | Shot list, art direction, per-SKU render prompt packs, file naming, alt text. |
| 5 | [`05-size-and-fit.md`](05-size-and-fit.md) | Size chart, fit models, the returns problem, and how we beat it. |
| 6 | [`06-launch-runbook.md`](06-launch-runbook.md) | T-minus timeline, owners, gates. What "ready" means. |

Machine-readable specs live in [`/data/womens-activewear/`](../../data/womens-activewear/)
and are designed to be pushed to Shopify Admin API in one pass.

---

## The short answer to "what else do we need?"

You asked for collections, product pages, and visuals. Those are three of thirteen things.
Here is the honest list, ranked by how badly each one kills a women's activewear launch
when it's missing.

### Tier 1 — launch fails without these

**1. A size and fit system.** This is the #1 killer. Women's activewear returns run
25–40% industry-wide, and the dominant reason is fit. Every return eats the margin of
roughly three sales. You need: real garment measurements (not "S/M/L"), fit-model stats
on every PDP, a fit note per style ("true to size — compression"), and fit feedback
captured in reviews. See [`05-size-and-fit.md`](05-size-and-fit.md).

**2. Reviews on day one.** A women's activewear PDP with zero reviews converts at a
fraction of one with 20+. You cannot fix this after launch — you have to seed it before.
Ambassador seeding (below) is how.

**3. A warm list to launch into.** Launching to nobody is the most common way a good
line dies. You need 2–3 weeks minimum of waitlist capture before the drop, then early
access to that list. A launch email to 2,000 warm subscribers beats a cold ad budget.

**4. Correct inventory depth by size.** Don't buy flat across sizes. Buy the curve
(XS 8% / S 22% / M 28% / L 22% / XL 13% / 2XL 7%). Selling out of M in week one while
XS sits is how you turn a sellout into a loss.

### Tier 2 — separates a real launch from a soft one

**5. Athlete/ambassador seeding.** Combat sports is a community sport. Ship product to
15–30 female fighters, coaches, and gym owners three weeks out. You get: launch-day UGC,
seeded reviews, real action photography you can't buy, and credibility no ad can
manufacture. This is the highest-ROI line item in the entire launch.

**6. Email/SMS flow architecture.** Welcome, waitlist→launch, early access, abandoned
cart, browse abandon, back-in-stock, post-purchase, review request. Back-in-stock alone
recovers a meaningful share of a sold-out size run.

**7. A real collection landing page.** Not the default product grid. The women's line
needs an editorial page: hero, why-this-exists, fit trust, athlete proof, then the grid.
The theme work in this branch adds it.

**8. Paid creative volume.** 8–12 creative variants at launch, minimum. One hero video
is not a campaign. Ad accounts need something to choose between.

### Tier 3 — the stuff that quietly costs you money later

**9. Navigation and IA.** "Women" as a top-level nav item, not buried under a dropdown.
Collection URLs that don't change. Internal links from existing men's PDPs.

**10. SKU and barcode discipline.** A naming scheme set before you place the buy, not
after. See the scheme in [`01-line-plan.md`](01-line-plan.md).

**11. Returns and exchange policy.** Offer *exchange-first* returns. A size exchange
keeps the revenue; a refund loses it. On a fit-risky category this is worth real money.

**12. Legal and labelling.** FTC requires fiber content, country of origin, and care
instructions on garment labels. Get this right at the factory, not at the customs desk.

**13. Measurement.** Sell-through by size and colorway, weekly. It tells you what to
rebuy and what was a mistake. Set it up before launch or you'll be guessing in week four.

---

## What is already built in Shopify

Live on **kingkillers.co** as of 2 Sep 2026. Every product is **DRAFT** — nothing is
purchasable until you flip it.

- **8 product metafield definitions** (`custom.fit_note`, `fabric`, `care`,
  `model_stats`, `size_chart_key`, `features`, `badge`, `material`), pinned in the admin.
- **8 smart collections**, published, populating themselves from the `w:` tag taxonomy.
- **4 existing draft products rewritten** — real copy, namespaced tags, SEO titles and
  meta descriptions, metafields filled.
- **4 new garments + 3 kits created** with full copy, SEO, metafields and SKUs.
- **11 products in Round One**, wired to the launch collection by tag.

Exact IDs, handles, prices and open issues are recorded in
[`/data/womens-activewear/round-one.json`](../../data/womens-activewear/round-one.json).

In this branch, on the theme side:

Shipped to the live theme in PR #13, on the `shopify-theme` branch:

- `snippets/size-chart.liquid` — body-measurement charts driven by metafield
- `sections/kk-fit-fabric.liquid` — metafield-driven fit / fabric / care block
- `assets/kk-womens.css` — styles scoped to those two components
- `templates/product.womens.json` — applied to all 12 women's products
- `sections/main-product.liquid` — one line, pointing "Size guide" at the chart

**Dropped after seeing the real theme:** a size picker, a collection hero and a
collection template. The live PDP already had size pills, a quantity selector, a
back-in-stock form and star ratings — none of which exist in `main`'s stale copy of
the theme, and all of which pushing that copy would have deleted.

---

## Known gaps — read before setting a launch date

- **Nothing is sourced for four of the eight garments.** The Contender rash guard,
  Southpaw fight short, Warcry tank and Regicide hoodie are specified and written but
  have no supplier. Filter Shopify on the tag `w:todo:sourcing`.
- **There are no product images.** No image generation ran here.
  [`04-image-direction.md`](04-image-direction.md) gives you production-ready prompt packs
  and the compositing discipline that keeps logos and graphics accurate.
- **The size chart is a standard US grade, not your garments.** Reconcile it against real
  samples before launch or it will cause the returns it exists to prevent.
- **`templateSuffix` is not applied.** Apply it only after this branch merges and the
  theme deploys — a suffix pointing at a missing template breaks the page.
- **The legacy `womens` collection is still wrong** and was deliberately left alone. It
  is a live collection with 189 products; narrowing it is your call. See
  [`02-merchandising-architecture.md`](02-merchandising-architecture.md).
