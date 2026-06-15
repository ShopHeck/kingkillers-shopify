
# King Killers Theme — Architecture, CWV, SEO, GEO & CRO Reference

A condensed engineering reference for the theme in this folder. Pair it with `README.md`.

## 1. Online Store 2.0 architecture
- **JSON templates** (`templates/*.json`) contain *no HTML* — only a list of section
  instances, their order, and saved settings. Shopify maps each `"type"` to a
  `sections/<type>.liquid` file and injects the merchant's settings.
- **Sections** are reusable Liquid modules that each carry a `{% schema %}` block.
  Settings configure the whole section; **blocks** are repeatable sub-items
  (FAQ items, trust cells, proof points). Always output `{{ block.shopify_attributes }}`
  on a block's wrapper so the theme editor can select it.
- **Presets are mandatory** for a section to be addable in the editor; without a preset a
  section can only be statically included and can't be removed by the merchant.
- **Section groups** (`header-group.json`, `footer-group.json`) make the announcement bar,
  header and footer editable and reorderable. `theme.liquid` renders them with
  `{% sections 'header-group' %}`.
- **Limits:** up to 25 sections per template/group, 50 blocks per section.
- `enabled_on` / `disabled_on` in a section schema restrict where it can be placed.
- `{% schema %}` must be **strict JSON** — no comments, no Liquid, no trailing commas.

## 2. Core Web Vitals
- **LCP:** preload only the hero image (`responsive-image` with `preload: true` →
  `loading=eager`, `fetchpriority=high`, and a `Link: rel=preload` response header).
- **CLS:** `image_url` → `image_tag` emits intrinsic `width`/`height`; media boxes reserve
  space with `aspect-ratio`; the announcement bar ships in HTML, never injected late.
- **INP:** one small deferred script, delegated click handlers, native `<details>` FAQ,
  no carousels; scroll listener is rAF-throttled and passive.
- **`content_for_header`** is required (carries ~50–80KB of Shopify/app JS) — never remove
  it; instead keep our own CSS lean and defer all custom JS at the end of `<body>`.
- **Fonts:** opt-in via the Performance setting; default is a system stack; `display=swap`
  + preconnect when enabled. Heavy apps are the #1 CWV killer — prefer native sections.

## 3. SEO
- Canonical, robots, OG/Twitter via `snippets/meta-tags.liquid`.
- `Organization` + `WebSite` + `Store` JSON-LD is **site-wide** in `theme.liquid`.
- `Product` + `BreadcrumbList` live **only** on `main-product.liquid`; `FAQPage` only on
  the FAQ section — page-specific schema is never dumped site-wide (avoids Google flags).
- JSON-LD is bound to live Liquid objects so price/availability/rating stay accurate; all
  strings are escaped with the `| json` filter.
- If your base theme (e.g. Dawn) already emits product structured data, remove it first to
  avoid duplicate schema.

## 4. GEO (AI search)
- `kk-entity-answer.liquid` is a crawlable "What is King Killers?" definition (AI crawlers
  often don't run JS — keep it server-rendered).
- `kk-faq.liquid` generates the visible FAQ **and** the `FAQPage` schema from the same
  blocks, so AI engines quote text that matches the page exactly.
- NAP/brand facts are driven by `settings_schema.json` → identical in copy and schema.
- Don't block `GPTBot` / `PerplexityBot` / `ClaudeBot` / `OAI-SearchBot` in
  `robots.txt.liquid` if citation is the goal. Consider adding an `llms.txt`.

## 5. CRO
- Free-shipping announcement bar + sticky header CTA + cart count.
- Trust strip; review-bearing product cards with compare-at strikethrough + Save %.
- AJAX cart drawer with a free-shipping progress bar (threshold from theme settings).
- Honest scarcity ("Only N left", gated by real inventory + a metafield flag) — no fake
  timers. Repeated 30-day-guarantee risk reversal in hero, PDP, cart and final CTA.

## 6. Liquid quick reference
```liquid
{%- assign coll = section.settings.collection -%}
{%- if coll != blank and coll.products_count > 0 -%}
  {%- for product in coll.products limit: section.settings.products_to_show -%}
    {% render 'product-card', product: product %}
  {%- endfor -%}
{%- else -%}
  {%- comment -%} editor fallback {%- endcomment -%}
{%- endif -%}
```
- `image_url` uses singular `width:`; `image_tag` uses plural `widths:`.
- Money: `{{ product.price | money }}` for display; `price | divided_by: 100.0` for schema.
- Always `| json` user/product strings inside JSON-LD.
- Product section exposes `{ "type": "@app" }` blocks so apps inject without breaking OS 2.0.

## Pre-launch checklist
- [ ] Verify every brand fact in `config/settings_schema.json` is real (phone/ZIP/USA claim).
- [ ] Only emit `AggregateRating` if reviews are genuinely present & visible.
- [ ] `shopify theme check` passes; Rich Results Test passes for Product + FAQ.
- [ ] Lighthouse mobile 90+; confirm a single preloaded LCP image.
- [ ] Create the `best-sellers` collection referenced by the homepage.
- [ ] Add a `robots.txt.liquid` that allows AI crawlers; submit `sitemap.xml`.
