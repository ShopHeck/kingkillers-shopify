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

## Working constraints (as of this branch)

- **Shopify MCP is disconnected.** The connector must be re-authorized against the
  King Killers store before any of this can be pushed live. Everything here is written
  so that push is mechanical.
- **No image generation in this environment.** [`04-image-direction.md`](04-image-direction.md)
  gives you production-ready prompt packs to run in your own image tool, plus the
  compositing discipline that keeps logos and graphics accurate.
- **Existing catalog not yet reconciled.** You indicated some women's SKUs already
  exist. Once the store is connected, run the reconciliation step in
  [`06-launch-runbook.md`](06-launch-runbook.md) before creating anything new.
