
# King Killers — Custom Shopify Online Store 2.0 Theme

> **Important: how to use this folder.** The live preview in this builder runs a
> React/Vite sandbox — it has **no Liquid engine, no `{{ content_for_header }}`, no
> `collections` object, and no theme editor**, so a Shopify theme cannot *render* here.
> Everything inside `kingkillers-theme/` is **production-accurate, deploy-ready Shopify
> theme source**. Push it to a real store with the Shopify CLI:
>
> ```bash
> npm i -g @shopify/cli @shopify/theme
> cd kingkillers-theme
> shopify theme dev      # live local preview against your store
> shopify theme push     # publish / upload
> shopify theme check    # lint the theme (catches schema/Liquid errors)
> ```
>
> (Your previous React landing page is untouched at the project root — this folder is the
> separate, real Shopify deliverable.)

---

## What this is

A bespoke, **non-template** Online Store 2.0 theme for kingkillers.co — a fighter-owned
combat-sports apparel brand. It is engineered to:

- **Pass Core Web Vitals** — single LCP image preloaded, every image emits intrinsic
  `width`/`height` (CLS = 0), one lean render-blocking CSS file, all JS deferred and
  dependency-free, fonts opt-in with `display: swap`, zero heavy apps.
- **Win SEO** — semantic HTML, canonical, OG/Twitter, and Liquid-bound JSON-LD
  (`Organization`, `WebSite`, `Store`, `Product`, `BreadcrumbList`, `FAQPage`) scoped to
  the correct page types (page-specific schema is **never** dumped site-wide).
- **Win GEO (AI search)** — a crawlable "What is King Killers?" entity-answer block plus
  FAQ copy that is generated from the *same* blocks as the `FAQPage` schema, so AI engines
  quote text that exactly matches the page. NAP/brand facts are driven by theme settings so
  they stay identical everywhere.
- **Win CRO** — free-shipping announcement bar, sticky header, trust strip, review-bearing
  product cards with price anchoring, AJAX cart drawer with a free-shipping progress bar,
  honest scarcity, and repeated 30-day-guarantee risk reversal.
- **Look incredible** — dark "blood & bone" palette, CSS paint-splatter texture (no image
  files), oversized kinetic outline display type, bento category grid, masonry reviews.
  Fully merchant-editable via the theme editor.

## File map

```
kingkillers-theme/
├── layout/theme.liquid                 # master shell; site-wide Org/WebSite/Store JSON-LD
├── templates/
│   ├── index.json   product.json   collection.json   page.json   404.json
├── sections/
│   ├── header-group.json   footer-group.json          # editable, reorderable groups
│   ├── announcement-bar.liquid   header.liquid   footer.liquid
│   ├── kk-hero.liquid          # LCP-preloaded hero
│   ├── kk-trust.liquid
│   ├── kk-entity-answer.liquid # GEO entity block
│   ├── kk-category-bento.liquid
│   ├── kk-featured-products.liquid     # complete {% schema %} reference
│   ├── kk-founder-story.liquid
│   ├── kk-faq.liquid           # FAQ + FAQPage schema from one source
│   ├── kk-final-cta.liquid
│   ├── main-product.liquid     # Product + Breadcrumb JSON-LD, @app blocks
│   └── main-collection.liquid
├── snippets/
│   ├── meta-tags.liquid   responsive-image.liquid   product-card.liquid
│   ├── structured-data-org.liquid   structured-data-product.liquid   structured-data-breadcrumb.liquid
├── config/settings_schema.json   settings_data.json
├── locales/en.default.json   en.default.schema.json
└── assets/kk-theme.css   kk.js
```

## Key engineering decisions (and why)

| Concern | Decision |
|---|---|
| **LCP** | Hero image is the only resource with `preload: true` + `fetchpriority: high` + `loading: eager`. Below-fold images lazy-load. Preloading only one resource keeps the hint effective. |
| **CLS** | All images use `image_url` → `image_tag`, which emits intrinsic dimensions. Hero/media boxes reserve space with `aspect-ratio`. Announcement bar ships in HTML, never injected late. |
| **INP** | No carousels/sliders. One small deferred script with delegated click handlers and an `IntersectionObserver`; scroll handler is rAF-throttled and passive. |
| **`content_for_header`** | Never removed (checkout, analytics, app blocks depend on it). It carries ~50–80KB of unavoidable JS, so we budget around it: our own CSS is tiny and JS is deferred at end of `<body>`. |
| **Fonts** | Google Fonts are a **merchant checkbox** (`enable_google_font`) so speed vs. branding is a controllable tradeoff. Default stack falls back to system fonts. `display=swap` always. |
| **Schema placement** | `Organization`/`WebSite`/`Store` are site-wide (in `theme.liquid`). `Product`/`BreadcrumbList` live only on `main-product.liquid`; `FAQPage` only on the FAQ section — this avoids Google flagging mismatched/duplicate markup. |
| **Apps** | The theme ships native sections + metafields so the merchant can avoid the bloated review/upsell/page-builder apps that are the #1 Shopify CWV killer. The product section still exposes `{"type":"@app"}` blocks so legitimate apps can inject cleanly. |
| **GEO** | Entity answer + FAQ text are crawlable, server-rendered HTML (AI crawlers often don't run JS) and identical to the JSON-LD. Don't block `GPTBot`/`PerplexityBot`/`ClaudeBot`/`OAI-SearchBot` in `robots.txt.liquid`. |

## ⚠️ Verify before you ship (factual accuracy = GEO accuracy)
All brand facts are placeholders in **theme settings** (`config/settings_schema.json`) so
you edit them once and they propagate to visible copy *and* schema. **Confirm these are
real before launch** — fabricated NAP data undermines the exact GEO consistency we want:
phone number/area code, ZIP, "Made in USA" claim, founder name, founding year, slogan,
and the 4.8★/200+ aggregate rating (only emit `AggregateRating` if those reviews are
genuinely present and visible on the page, or Google may issue a manual action).
