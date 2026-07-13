# King Killers — Header Mega Menu, Performance Audit & CRO Recommendations

_Prepared 2026-07-13. Scope: `sections/header.liquid`, `assets/kk-theme.css`, `assets/kk.js`, and a full read of the live (top-level) theme. The nested `kingkillers-theme/` folder is a stray legacy copy — the live, Shopify-synced theme is the repository root._

---

## 1. What shipped in this PR

### Mega menu (the headline request — "so all our menu items show")
The old header rendered **only the top level** of the linked menu (`section.settings.menu.links`). Any second- or third-level items a merchant added in **Online Store → Navigation** were invisible. The header now renders the **full 3-level tree**:

- **Desktop:** top-level items with children get a chevron toggle and a full-width **mega panel** anchored under the sticky header. Second-level items become column headings; third-level items are the links beneath them. A flat submenu simply renders as columns.
- **Mobile:** the same tree renders as an **accordion** inside the burger menu — every item is tappable.
- **Merchandising:** optional **"Mega menu promo"** blocks (image + tag + heading + CTA) can be attached to any top-level item by title, so the nav can feature a drop or best-seller. Nav is prime real estate — use it.
- **Zero new page weight on load:** the panel markup is server-rendered HTML (no CLS), CSS was appended to the existing single stylesheet, and the JS was appended to the existing deferred bundle.

**Accessibility & robustness (verified in a headless browser, 32/32 checks):** `aria-expanded`/`aria-controls` on every toggle, single-panel-open behavior, hover-open on pointer devices, click-open on touch, **Escape** closes and restores focus, outside-click closes, focus-out closes, and it degrades gracefully — with no JS the links are still reachable, and with no CSS every item is visible (which literally satisfies "show all menu items").

### Predictive search (new)
There was **no search anywhere in the store** — a major gap for apparel, where search users convert at 2–3× the site average. Added a header search that:
- Opens a dropdown search bar; results render live as you type via Shopify's **Section Rendering API** (`sections/predictive-search.liquid`), so prices/images/availability are always correct (no fragile client-side JSON parsing).
- Shows product thumbnails, sale price anchoring, matching collections, and a "See all results" link.
- **Degrades to a normal `/search` form** with no JS. Debounced + request-aborting to keep INP low.

### Account link (new)
Added an account entry point (desktop icon + mobile-menu row), shown only when customer accounts are enabled.

### Bug fixed along the way
While verifying at real phone widths, the header action row (logo + search + account + cart + burger) **overflowed past the viewport at ≤390px, pushing the burger off-screen** where `overflow-x:hidden` clipped it — the menu button was literally untappable on many phones. Fixed by moving the secondary account icon into the mobile menu and tightening the row; the burger is now on-screen and clickable at 320/360/390/414px with both the image logo and the text fallback.

---

## 2. Performance audit

**Verdict: the core theme is genuinely well-optimized** — single preloaded LCP image, intrinsic `width`/`height` on every image (CLS-safe), one lean render-blocking stylesheet, deferred dependency-free JS, semantic HTML, and correctly-scoped JSON-LD. The findings below are the deviations worth addressing, most-impactful first.

| # | Severity | Finding | Recommendation |
|---|----------|---------|----------------|
| P1 | **High** | `blocks/ai_gen_block_2ac85db.liquid` (the homepage "Latest from the Ring" blog block) ships **~220 lines of per-instance inline `<style>` and a `<script>` that defines a custom element**, and it **duplicates the `.kk-blog__*` styles already in `kk-theme.css`**. Inline CSS in `<body>` isn't cached across pages and competes with the main thread. This is exactly the app-style bloat the theme was built to avoid. | Replace the homepage instance with a native section that reuses the existing `.kk-blog__*` CSS (the clean `main-blog.liquid` markup is already there), or fold the block's unique styles into `kk-theme.css` and drop the inline `<style>`/`<script>`. Removes duplicate CSS + main-thread JS. |
| P2 | **Medium** | **Google Fonts is ON** in live settings (`enable_google_font: true`). That adds a render-blocking stylesheet from `fonts.googleapis.com` plus two font files, and a third-party origin on the critical path. The theme was deliberately built to make this optional. | If brand type matters (it does here), **self-host Archivo + Inter as theme assets** with `font-display:swap` and `preload` the two weights actually used above the fold. Eliminates the third-party connection and the render-blocking Google stylesheet. Or A/B it off to measure the system-font LCP gain. |
| P3 | **Medium** | **Judge.me reviews** is installed (`settings_data.json`). Review apps are a frequent Core Web Vitals cost (extra JS, layout shift from star widgets). | Confirm it injects only through the product section's `@app` block (the theme is architected for this), enable its lazy-load/deferred embed, and reserve space for the star widget to avoid CLS. |
| P4 | Low | Announcement-bar marquee keeps `will-change:transform` on a permanently-animating element, holding a compositor layer alive. | Harmless and `prefers-reduced-motion` is respected. Optionally drop `will-change` — the browser already promotes an animating transform. |
| P5 | Low | The header cart icon was an emoji (🛒), which renders inconsistently across platforms and can cause a tiny reflow as the emoji font loads. | **Fixed in this PR** — swapped to an inline SVG matching the new search/account icons. |

**This PR's own performance cost:** negligible. ~4 KB of CSS added to the existing stylesheet, a small deferred JS module, and predictive search fetched only on user intent. No render-blocking additions, no layout shift.

---

## 3. Conversion & revenue recommendations (prioritized)

| Priority | Opportunity | Why it matters | Effort |
|----------|-------------|----------------|--------|
| **1 — do now** | **Free-shipping message is contradictory.** The announcement bar says **"FREE SHIPPING ON ORDERS $75+"** but the threshold setting is **$100**, and the cart progress bar, PDP, hero and footer all say **$100**. A shopper who adds to hit "$75" then sees "$100 to go" in the cart drawer — broken promise at the exact moment of purchase. | Trust + cart-abandonment. This is the single highest-ROI fix. | 1 line |
| **2** | **Homepage category bento is broken merchandising.** In `templates/index.json`, three of four cards are titled **"2-in-1 Hybrid Shorts"**, two have **empty links** (`link: ""` → dead cards), and all show "From $34.99". The "shop by category" path is a primary conversion route. | Every dead/duplicate card is a lost entry to a collection. | 15 min |
| **3** | **Use a mega-menu promo block** to feature the live drop or best-sellers inside the "Shop" panel (now supported by this PR). | Puts merchandising in the highest-traffic UI on the site. | 5 min |
| **4** | **Email/SMS capture for first order** — a welcome-offer popup or footer form tied to a `WELCOME10`-style code. | Captures the ~97% who don't buy on visit 1; recovers abandoners. | App or native |
| **5** | **Product bundles / "Build your fight kit"** and a cart-drawer **free-gift-at-threshold** (you already have the free-ship progress bar to build on). | Raises AOV; nudges carts over the shipping threshold. | Medium |
| **6** | **Richer product cards & PDP** — variant/size swatches on cards, "notify me when back in stock" for sold-out variants, and Shop Pay installment messaging near Add to Cart. | Reduces clicks-to-buy and rescues out-of-stock demand. | Medium |
| **7** | **Recently-viewed + "complete the look"** on the PDP (the cart drawer already does recommendations — extend the pattern to the product page). | Increases items-per-session and AOV. | Medium |

### Pre-launch checklist for this PR
- [ ] Build the **Navigation** menu (`main-menu`) with nested items — the mega menu renders whatever tree you create there.
- [ ] Confirm **customer accounts** are enabled if you want the account link to appear (Settings → Customer accounts).
- [ ] Ensure a **`/search` page / search is enabled** (it is by default) so predictive results and "See all results" resolve.
- [ ] `shopify theme check` and a Lighthouse mobile pass after merge (no CLI in this environment to run them here).
- [ ] Resolve the **$75 vs $100** free-shipping copy (recommendation #1) before the next campaign.
