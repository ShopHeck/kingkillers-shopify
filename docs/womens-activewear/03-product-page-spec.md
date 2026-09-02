# 03 — Product Page Spec

## Anatomy, in conversion order

The `product.womens` template renders in this order. The order is the argument: what is
it → can I trust it → will it fit me → what else goes with it → what am I still worried
about.

| # | Element | Section / snippet | Why here |
|---|---|---|---|
| 1 | Gallery, 6 shots | `main-product` | First image is preloaded as LCP |
| 2 | Badge, rating, title, price | `main-product` | Identity and price before the ask |
| 3 | **Size picker** | `size-picker.liquid` | Tappable pills, not a `<select>` |
| 4 | Add to cart | `main-product` | |
| 5 | Reassurance strip | `main-product` | Free ship / guarantee / fighter-owned |
| 6 | Trust accordions | `main-product` | Size help, shipping, checkout |
| 7 | Description | `main-product` | |
| 8 | **Fit & fabric + size chart** | `kk-fit-fabric` | The returns-prevention block |
| 9 | Complete the kit | `kk-featured-products` | AOV |
| 10 | FAQ (+ FAQPage schema) | `kk-faq` | Objection handling, and quotable by AI search |

---

## What changed on the PDP

### The variant `<select>` is gone

The old PDP put every variant in one dropdown: `Small – $44.99`, `Medium – $44.99`, and
so on. On a six-size garment that is bad; on a Size × Colour garment with eighteen
variants it is a conversion hole. Shoppers cannot scan a dropdown, cannot see at a glance
which sizes exist, and on mobile it opens a native picker that hides the product image.

`snippets/size-picker.liquid` replaces it with tappable pills:

- **Sold-out sizes stay visible**, disabled, with a diagonal strike. A shopper needs to
  see that her size existed and sold out — silently removing it reads as "this brand does
  not make my size," which is the opposite of the message.
- A count line underneath ("2 sizes sold out") makes the state explicit.
- Arrow keys move between sizes; the row is a proper `radiogroup`.
- A "Size chart" button opens and scrolls to the chart in the Fit & Fabric section.

It writes the chosen variant's `data-*` attributes onto the existing `[data-pdp-variant]`
hidden input, so the price / availability / image-swap logic already in `kk.js` works
unchanged. Minimal blast radius.

### Fit & fabric is metafield-driven

`sections/kk-fit-fabric.liquid` renders three columns — Built with / Fit / Fabric + Care
— entirely from product metafields. Nothing is pasted into a description, so the block is
identical across the line and a merchant fills it in once per product in the admin.

It renders **nothing at all** when the metafields are empty, so it is safe to leave in a
template used by other product types.

---

## Metafield reference

All eight created under the `custom` namespace, pinned in the admin product editor.

| Key | Type | Used by | Example |
|---|---|---|---|
| `fit_note` | single line | Fit block, size chart header | `True to size — compression fit` |
| `fabric` | multi line | Fit block | `82% polyester / 18% elastane, 220gsm four-way stretch…` |
| `care` | multi line | Fit block | `Machine wash cold, inside out…` |
| `model_stats` | single line | Size chart | `Model is 5'7", 135 lb, wearing size S` |
| `size_chart_key` | single line | Size chart snippet | `womens-bottoms` \| `womens-tops` \| `womens-bra` \| `womens-socks` |
| `features` | list, single line | Fit block bullets | `["Squat-proof four-way stretch", …]` |
| `badge` | single line | Product card + PDP badge | `Round One` \| `Best Value` |
| `material` | single line | Product JSON-LD `material` | `82% polyester, 18% elastane` |

`model_stats` is currently **empty on every product** — it needs the real fit model's
height, weight and worn size once photography exists. It is one of the highest-value
fields on the page and it cannot be invented.

---

## Copy formula

Every PDP description follows the same shape.

```
1. Hook          — one or two lines. What it is, who it is for, why it is different.
2. "Built for"   — the sports and sessions. This is the wedge; use the vocabulary.
3. "Details"     — 5–7 construction bullets. Nouns, not adjectives.
4. Fit line      — bold, explicit, tells them which way to go between sizes.
```

The Contender rash guard opens with *"Cut on a women's block. Not a men's small with a
different print."* That is the whole positioning in eleven words, and it is a claim a
competitor cannot copy without changing their pattern.

### Rules

- **Nouns beat adjectives.** "Gusseted crotch, flatlock seams, silicone waist gripper"
  outsells "premium, comfortable, high-performance." Adjectives are what every brand
  says; construction is what only you can say.
- **Never make a claim you cannot demonstrate.** "Squat-proof" needs an opacity test.
  "No ride-up" needs mat testing. On POD you are relying on a supplier's spec sheet —
  confirm before publishing.
- **Name the trade-off.** "No thumbholes — they snag in grappling" turns an absence into
  expertise.
- **The fit line is not optional.** Every product ends with an explicit fit instruction.

---

## SEO patterns

**Product title (H1):** `{Style Name} {Construction} {Category} — Women's`
e.g. `Contender Long-Sleeve Rash Guard — Women's`

**SEO title (≤60 chars):** `Women's {Category} — {Differentiator} | King Killers`
e.g. `Women's BJJ Rash Guard — Long Sleeve, No Ride-Up | King Killers`

**Meta description (≤155 chars):** what it is, the one construction detail that matters,
the size range, one trust signal.
e.g. `Women's-cut long-sleeve rash guard for BJJ and MMA. Princess seams, silicone waist gripper, no ride-up. XS-2XL. Fighter-owned.`

Note the pattern: the search term (`women's BJJ rash guard`) leads, the differentiator
follows, brand last. Not `King Killers Presents Our Amazing New Rashguard`.

**Handles** are set explicitly (`womens-contender-rash-guard`) rather than derived from
the title, so a title edit never changes a URL. The four rewritten drafts kept their
original handles on purpose — changing a handle creates a redirect for no benefit.

---

## Structured data

`snippets/structured-data-product.liquid` already emits Product JSON-LD bound to live
variant data, with `aggregateRating` only when review metafields genuinely exist. It
picks up `custom.material`, which is why that metafield is populated.

**Gaps worth closing before launch:**

- No `size`, `color` or `audience`/`suggestedGender` properties. Google's apparel rich
  results use all three, and for a women's line `suggestedGender: female` is exactly the
  disambiguation you want given the store is 290 products of men's wear.
- No `hasMerchantReturnPolicy`. You offer a 30-day money-back guarantee; saying so in
  schema is eligible for a returns annotation in Shopping results.
- No `shippingDetails`. Free shipping over $100 is likewise annotatable.

None are blocking. All three are worth an hour before the line goes ACTIVE.

---

## Applying the template

The `product.womens` and `collection.womens` templates live in this branch. Shopify
serves them via `templateSuffix`, which is **not yet set on any product or collection** —
deliberately, because a `templateSuffix` pointing at a template the live theme does not
have yet breaks the page.

Order of operations:

1. Merge this branch. The live theme (`kingkillers-shopify/shopify-theme`) is
   GitHub-connected, so merging deploys the templates.
2. Confirm the templates appear in the theme editor.
3. Set `templateSuffix: "womens"` on the eleven Round One products and the eight women's
   collections.
4. Then, and only then, flip products to ACTIVE.

Doing 3 before 1 takes the pages down.
