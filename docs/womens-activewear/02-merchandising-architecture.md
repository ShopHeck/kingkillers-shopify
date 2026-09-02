# 02 — Merchandising Architecture

The single biggest anti-mess lever in the whole launch. Get the taxonomy right and
collections, filters, navigation and reporting all fall out of it for free. Get it wrong
and you are hand-curating collections forever.

---

## The principle

**One canonical collection per shopper intent. Everything else is a filter.**

Do not create twenty collections. A shopper arriving at "women's activewear" has a small
number of intents: browse the line, browse a category, buy a complete kit, see the new
drop. That is four shapes, not twenty.

---

## Tag taxonomy

Every women's-line tag is namespaced with a `w:` prefix and a facet. Namespacing does
three things: smart-collection rules never collide with the existing legacy tags, the
facets map one-to-one onto Search & Discovery filters, and a human reading a product's
tag list can tell what each tag is *for*.

| Namespace | Values | Purpose |
|---|---|---|
| `w:line` | *(flag, no value)* | Membership in the women's line. The single clean anchor. |
| `w:drop:` | `round-one` | Which drop it belongs to |
| `w:cat:` | `leggings` `shorts` `compression` `sports-bra` `rashguard` `top` `outerwear` `socks` `bundle` | Category — drives category collections |
| `w:fit:` | `compression` `relaxed` `oversized` `cropped` | Filter facet |
| `w:rise:` | `high` `mid` | Filter facet, bottoms only |
| `w:impact:` | `low` `medium` `high` | Filter facet, bras only |
| `w:activity:` | `bjj` `mma` `boxing` `muay-thai` `wrestling` `lifting` `conditioning` `everyday` | Filter facet — the sport-specific wedge |
| `w:color:` | `blackout` `blood` `bone` `warpaint` `marble` `patriot` | Colourway |
| `w:feature:` | `squat-proof` `pockets` `gusset` `flatlock` `4-way-stretch` `no-ride-up` `seamless` `2-in-1` `made-in-usa` | Feature facet |
| `w:todo:` | `sourcing` | Internal. Not a customer-facing filter. |

### Rules

1. **Never rename a tag after launch.** Smart collections break silently — the collection
   does not error, it just quietly empties. If you must rename, add the new tag to every
   product first, update the rule, then remove the old tag.
2. **Case matters.** Shopify tag rules use `EQUALS`, which is case-sensitive in practice.
   All `w:` tags are lowercase, always. This is precisely the bug that left the existing
   store with `Mens`/`mens` and `Hoodies`/`hoodie`/`hoodies` splitting collections.
3. **`w:todo:` tags are internal.** Exclude them when you configure Search & Discovery
   filters, or shoppers will see "Sourcing" as a filter option.
4. Legacy tags (`Women's Clothing`, `Shorts`, `new`) stay on the products so existing
   collections keep working. The `w:` layer is additive, not a migration.

---

## Collections built

All eight are live and published to Online Store + Shop. All are **smart collections** —
they populate from tags, so adding a product to the line is one tag, not eight manual
adds.

| Collection | Handle | Rule | Count |
|---|---|---|---|
| Women's Activewear | `womens-activewear` | `w:line` | 12 |
| Round One — The First Drop | `womens-round-one` | `w:drop:round-one` | 11 |
| Women's Leggings | `womens-leggings` | `w:cat:leggings` | 1 |
| Women's Training Shorts | `womens-training-shorts` | `w:cat:shorts` OR `w:cat:compression` | 3 |
| Women's Sports Bras | `womens-sports-bras` | `w:cat:sports-bra` | 1 |
| Women's Rash Guards | `womens-rash-guards` | `w:cat:rashguard` | 1 |
| Women's Tops & Tanks | `womens-tops` | `w:cat:top` OR `w:cat:outerwear` | 3 |
| Women's Kits & Bundles | `womens-kits` | `w:cat:bundle` | 3 |

Each carries a hand-written description and SEO title/meta. The descriptions are not
filler — they are the only crawlable text on a collection page, and they are what an AI
assistant quotes when asked "where do I buy women's BJJ rash guards."

**Note on thin collections.** Leggings, bras and rash guards each hold one product. That
is correct for Round One and it is not a problem *provided* the collection page does not
look broken. No custom collection template was shipped — the live theme already has
`kk-collection-copy`, which renders editorial copy from
`collection.metafields.custom.seo_copy` above the JSON-LD it emits. Populate that
metafield on the thin collections rather than adding theme code. Revisit once the line
has depth: a category collection with one product and no framing is worse than no
collection at all.

---

## The decision I did not make for you

**The existing `womens` collection is still wrong, and I left it alone.**

It holds 189 products on the rule `tag:Women's Clothing OR tag:Unisex`. Because of the
`Unisex` clause it is mostly unisex men's graphic tees. A woman landing on
`/collections/womens` from search or from your nav does not find a women's line — she
finds the men's catalogue with a different label. This is the single largest cause of the
"messy" feeling you described.

I did not change it because it is a **live collection with 189 products**, and narrowing
its rule removes ~176 products from a page that is currently indexed and linked. That is
your call, not mine. Three options:

| Option | Effect | Recommendation |
|---|---|---|
| **A. Drop the `Unisex` clause** | Rule becomes `tag:Women's Clothing` only. Collection drops to roughly 40 genuinely women's-tagged products. | **Recommended.** Honest, immediate, reversible in one edit. |
| **B. Redirect to `womens-activewear`** | 301 `/collections/womens` → `/collections/womens-activewear`. Consolidates authority onto the new hub. | Do this *after* the line is ACTIVE and has depth. Doing it now points traffic at 12 draft products. |
| **C. Leave it, retag properly** | Audit all 189 and tag the genuinely unisex-and-actually-worn-by-women items. | Most correct, most work. A good background task, not a launch blocker. |

Do A now, plan B for 60 days post-launch, treat C as ongoing hygiene.

---

## Navigation

"Women" needs to be a **top-level nav item**, not a dropdown entry under Shop. Suggested
structure once the line is ACTIVE:

```
WOMEN
├── Shop All Women's        → /collections/womens-activewear
├── Round One (New Drop)    → /collections/womens-round-one
├── Rash Guards             → /collections/womens-rash-guards
├── Leggings                → /collections/womens-leggings
├── Training Shorts         → /collections/womens-training-shorts
├── Sports Bras             → /collections/womens-sports-bras
├── Tops & Tanks            → /collections/womens-tops
└── Kits & Bundles          → /collections/womens-kits
```

Nav is edited in Shopify admin (Online Store → Navigation), not in this repo. Do not add
these links until the products are ACTIVE — a nav item leading to an empty collection is
worse than no nav item.

---

## Storefront filters

Configure in the Search & Discovery app once the line is ACTIVE. Recommended facets, in
this order:

1. **Size** (from the variant option) — first, because it is the highest-intent filter in
   apparel. A shopper who filters to 2XL and sees results is a shopper who trusts you.
2. **Category** — `w:cat:`
3. **Activity** — `w:activity:` — this is the differentiating facet. No mainstream
   activewear brand lets you filter by "BJJ."
4. **Fit** — `w:fit:`
5. **Feature** — `w:feature:`
6. **Price**

Rename each facet's display label in Search & Discovery so shoppers see "Category," not
"w:cat." Exclude `w:line`, `w:drop:` and `w:todo:` from the filter set entirely.

---

## Internal linking

Cheap, and skipped by almost everyone.

- Link from the men's rash guard PDPs to `/collections/womens-rash-guards`. Partners and
  training partners buy for each other.
- Link the Fight Camp Kit and Summer Walkout Kit collections to `womens-kits`.
- Add a women's row to the homepage category bento (the theme already has
  `kk-category-bento`).
- Once the line is live, add the women's hub to `llms.txt` so AI assistants have the
  entity to cite. The file currently describes King Killers as though the catalogue is
  men's only.
