# Shopify Theme Audit: Performance, UX, and Conversion Upgrades

Audit date: 2026-06-15
Scope: `kingkillers-theme/` production Shopify Online Store 2.0 theme source, with supporting React prototype files used for the landing-page concept.

## Executive summary

The theme already has a strong foundation for conversion and Core Web Vitals: server-rendered Liquid sections, one lean theme stylesheet, deferred dependency-free JavaScript, responsive images, product schema, FAQ schema, a sticky header, AJAX cart drawer, trust messaging, and strong combat-sports brand positioning.

The highest-impact next upgrades are:

1. Make the product detail page a stronger buying experience with variant media switching, size guidance, delivery/returns modules, payment trust, sticky mobile add-to-cart, and bundled upsells.
2. Improve product discovery with collection filters/sorting, quick-view or richer cards, product badges, and merchandising controls.
3. Reduce performance risk from fonts, animations, third-party apps, and cart drawer rendering as the store scales.
4. Add richer CRO instrumentation so every layout decision can be validated with funnel data rather than preference.
5. Tighten mobile navigation, accessibility, and trust content to reduce hesitation before checkout.

## Current strengths to preserve

- **Lean loading model:** the layout ships one theme CSS file and one deferred JavaScript file, with early Shopify CDN preconnects and optional Google Fonts. This is a good baseline for LCP and INP.
- **LCP-aware imagery:** the reusable `responsive-image` snippet supports responsive `srcset`, lazy loading by default, and high-priority eager loading for the intended LCP image.
- **Conversion-focused homepage arc:** hero CTA, proof bullets, trust strip, category bento, featured products, founder story, FAQ, and final CTA create a complete persuasion sequence.
- **Native Shopify-first architecture:** product cards, PDP form, AJAX cart drawer, schema snippets, and OS 2.0 sections avoid heavy page-builder dependencies.
- **Trust and risk reversal:** free shipping, 30-day guarantee, fighter-owned positioning, reviews, scarcity, and founder story are repeated throughout the experience.

## Priority roadmap

### P0 — Highest-impact conversion and performance upgrades

| Upgrade | Why it matters | Recommended implementation | Primary files/areas |
|---|---|---|---|
| Sticky mobile add-to-cart on PDP | Mobile visitors often scroll past the primary CTA; keeping price + CTA visible reduces friction. | Add a bottom sticky buy bar below 750px that mirrors selected variant availability and opens/selects the native PDP form. Hide it when the main button is visible if possible. | `kingkillers-theme/sections/main-product.liquid`, `kingkillers-theme/assets/kk-theme.css`, `kingkillers-theme/assets/kk.js` |
| Variant-aware PDP gallery | Current thumbnails are static and do not update the main image or variant selection. Buyers need confidence in color/design selection. | Add variant media IDs to the variant selector, clickable thumbnails, and JS to swap the main image when a variant or thumbnail changes. | `main-product.liquid`, `kk.js` |
| Size guide and fit confidence | Apparel conversion depends on sizing clarity. Missing fit help increases returns and abandonment. | Add an expandable size guide block, fit notes, model stats/metafields, and a “between sizes?” recommendation area. | `main-product.liquid`, product metafields, theme settings |
| Collection filtering and sorting | Shoppers need fast narrowing by product type, size, color, price, availability, and best sellers. | Add Shopify faceted filters, sort dropdown, active filter chips, and empty-state recovery links. | `kingkillers-theme/sections/main-collection.liquid` |
| Cart drawer upsell/cross-sell | The cart drawer already owns a high-intent moment; use it to lift AOV. | Add optional recommended products, bundle prompts, free-shipping threshold upsell, and “complete the kit” products. Keep content server-rendered or minimal JS. | `layout/theme.liquid`, `kk.js`, new cart upsell snippet/section |
| App and third-party performance budget | Shopify app scripts are a common CWV regression source. | Document a strict app budget: reviews/search/email/SMS only if needed, async/defer where possible, quarterly Lighthouse + WebPageTest checks, remove unused app embeds. | `kingkillers-theme/README.md`, operations checklist |

### P1 — UX upgrades that reduce buying hesitation

| Upgrade | Why it matters | Recommended implementation | Primary files/areas |
|---|---|---|---|
| Product page trust modules | Buyers need reassurance directly next to the decision point. | Add collapsible accordions for shipping, returns, materials, care, and guarantee under the CTA. Use metafields for product-specific content. | `main-product.liquid` |
| Payment and checkout trust | Payment method visibility can reduce checkout anxiety. | Add Shop Pay/Apple Pay/PayPal icons or text, secure checkout copy, and delivery estimate near the buy button. | `main-product.liquid`, cart drawer footer |
| Product badges and merchandising rules | Badges such as “Best Seller,” “New,” “Limited Drop,” and “Made in USA” help scanability. | Standardize badge metafields/tags and expose badge priority logic on cards and PDP. | `snippets/product-card.liquid`, `main-product.liquid` |
| Search entry point | The current header focuses nav + cart; a search affordance helps returning shoppers. | Add search icon/input, predictive search if acceptable under performance budget, and popular query shortcuts. | `sections/header.liquid`, new search template/section |
| Mobile menu merchandising | A plain link list misses promotional and collection discovery opportunities. | Add featured collection/product links, campaign CTA, and trust badges inside the mobile drawer. | `sections/header.liquid`, `kk-theme.css` |
| Empty cart recovery | Empty cart should redirect intent, not dead-end. | Add best sellers, category links, and a “start with shorts/tees/rashguards” CTA. | `kk.js`, cart drawer markup/snippet |

### P2 — Performance hardening and technical cleanup

| Upgrade | Why it matters | Recommended implementation | Primary files/areas |
|---|---|---|---|
| Respect reduced motion globally | Marquee, reveal, hover, and drawer animations should not affect users with motion sensitivity. | Add `@media (prefers-reduced-motion: reduce)` to disable marquee/reveal transitions and smooth scrolling. | `assets/kk-theme.css` |
| Safer cart drawer rendering | Cart item names and variant titles are inserted via `innerHTML`. Shopify data is generally trusted, but escaping is safer. | Add a small HTML escaping helper before interpolating cart JSON into drawer markup. | `assets/kk.js` |
| Drawer focus management | Dialogs should trap focus and return focus to the trigger. | Store opener element, focus first actionable control, trap tab key while open, restore focus on close. | `assets/kk.js`, `layout/theme.liquid` |
| Debounce cart quantity updates | Rapid quantity clicks can trigger overlapping `/cart/change.js` requests and stale totals. | Disable quantity buttons per line while updating or queue updates by line item key. | `assets/kk.js` |
| CSS splitting review | One stylesheet is good now, but as features grow it can become render-blocking bloat. | Keep critical shell styles in `kk-theme.css`; consider route/section-scoped CSS if the file grows materially. | `assets/kk-theme.css` |
| Font fallback tuning | Google Fonts are optional, but if enabled they can still affect LCP. | Add `font-display` fallback strategy documentation, consider locally hosted WOFF2, and verify CLS from font swap. | `layout/theme.liquid`, settings |

### P3 — Content, SEO, and AI-search improvements

| Upgrade | Why it matters | Recommended implementation | Primary files/areas |
|---|---|---|---|
| Real review content on PDP and homepage | Star ratings without review snippets are less persuasive. | Add native review blocks or a lightweight reviews app with strict script budget. Surface review excerpts near PDP CTA and below product details. | `main-product.liquid`, homepage review section/app block |
| Collection landing copy | Category pages need unique copy for SEO and decision support. | Add editable intro copy, buying guide blocks, and FAQ per collection. | `main-collection.liquid`, collection metafields |
| Product comparison/bundles | Combat-sports shoppers compare shorts, rashguards, tees, etc. | Add “Which gear is right for you?” comparison table and curated training bundles. | Product/page sections |
| Enhanced structured data validation | Product schema depends on accurate reviews/offers. | Add a pre-launch checklist to verify visible reviews, availability, price, shipping/return policy schema where appropriate. | schema snippets, README |
| Editorial content hub | Guides can attract organic traffic and answer sizing/training questions. | Add blog/article templates for sizing, fight camp gear, rashguard care, and gift guides. | new templates/sections |

## Page-by-page recommendations

### Homepage

- Keep the current persuasion arc, but test hero copy that is more product-specific above the fold: “Fight shorts, rashguards, and gym gear built for athletes who hunt the top.”
- Add a “Shop by intent” row: Train, Fight, Lift, Swim, Everyday. This may outperform category-only browsing for first-time visitors.
- Add review snippets or UGC tiles closer to the first product grid so proof appears before the first major buying decision.
- Ensure the first CTA always links to a high-converting collection, not an unconfigured or generic URL.

### Product detail page

- Add sticky mobile ATC, variant image switching, size guide, delivery estimate, payment reassurance, and return policy accordions.
- Move the strongest proof closer to the CTA: rating count, guarantee, free-shipping threshold, and “fighter owned” should be visible without scrolling.
- Add product-specific benefits in bullets above the long description; avoid making shoppers parse rich text before buying.
- Add related products or “complete the kit” below the main buy box.

### Collection pages

- Add filters, sorting, active chips, and merchandising controls.
- Use stronger collection headers with a benefit-led description and category-specific proof.
- Add quick-add safeguards for variant products; if a product has multiple variants, consider “Choose options” instead of adding the default variant blindly.

### Cart drawer

- Preserve the free-shipping progress bar; it is a strong AOV lever.
- Add product recommendations based on cart contents, especially low-cost accessories that help shoppers reach free shipping.
- Add focus trap, opener focus restore, and escaped cart item rendering.
- Add empty-cart recovery with best sellers and collection links.

### Header and navigation

- Add search and richer mobile navigation.
- Keep the header CTA, but test label specificity: “Shop Fight Gear,” “Shop Best Sellers,” or “Shop Shorts.”
- Consider showing free-shipping threshold in the announcement bar only if it remains accurate across markets.

## Measurement plan

Track these before and after each release:

- **Performance:** LCP, CLS, INP, TTFB, total JS transfer, total CSS transfer, image weight, app script count.
- **Discovery:** search usage, collection filter usage, product card click-through, quick-add usage.
- **PDP:** variant selection, size guide opens, add-to-cart rate, review interaction, sticky ATC clicks.
- **Cart:** drawer open rate, free-shipping progress completion, upsell clicks, checkout starts, cart abandonment.
- **Conversion:** mobile vs desktop conversion rate, revenue per session, AOV, returning-customer conversion, refund/return reasons.

Recommended testing sequence:

1. Ship technical safety improvements: reduced motion, cart escaping, focus management, quantity update locking.
2. Ship PDP sticky ATC + size guide as the first CRO experiment.
3. Ship collection filters/sort and measure product discovery impact.
4. Ship cart drawer upsells and measure AOV/free-shipping completion.
5. Add richer social proof and review snippets once review data is verified.

## Implementation notes

- Keep new functionality native and section/metafield-driven before adding apps.
- Avoid carousels unless there is a measured need; static grids usually perform better and cost less JavaScript.
- Make every new above-the-fold visual reserve space to prevent CLS.
- Use only one high-priority/preloaded image per template.
- Treat each new app embed as a performance regression until proven otherwise.
- Validate product schema after any review or price-display change.
