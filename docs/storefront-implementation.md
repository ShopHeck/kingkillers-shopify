# Storefront optimization implementation — September 5, 2026

Status: implemented in `codex/storefront-optimization`, based on `origin/shopify-theme` at `eaafd10`. This is a draft theme change, not a live release. The original checkout and its untracked artwork/scripts were preserved.

## Implemented in recommended order

1. **Purchase correctness.** Product links honor Shopify's selected variant. Prices, selection, inventory limits, stock messages, sticky controls and shareable variant URLs agree. Unavailable linked sizes remain selected and cannot be added. Duplicate pending submits are blocked; recoverable cart errors remain visible. If adding succeeds but refreshing the cart fails, the shopper goes to the cart rather than being invited to add again.
2. **Trust and support.** `/pages/contact` renders a native Shopify contact form with success/error states while retaining its public handle. It no longer inherits the generic About/wholesale layout. Theme return promises now point to the published eligibility/exclusions; inaccurate universal free-return schema and invented price expiry/shipping estimates are removed. Broad US-manufacturing claims are replaced with fighter-design positioning; product-specific origin tags remain merchant data. Unsupported store-average ratings are removed. Judge.me's supported widget code is installed with a theme toggle for stores using an app block instead.
3. **Mobile discovery and navigation.** Collections show a short introduction, category shortcuts and a two-column mobile product grid before full crawlable editorial content. Filters use Apply so several selections can be made together. Inactive filters no longer show Clear all. Cards with multiple variants lead to Choose options. The ambiguous jogger menu label is corrected. Category shortcuts include shorts, joggers, women, rash guards and all gear only when their collection exists.
4. **Product experience.** All gallery images remain reachable in a horizontal thumbnail strip. Fit help supports a product-specific chart image via the section's dynamic-source picker or an existing image explicitly labeled “size chart”/“size guide.” Existing women's chart mappings are preserved. Generic sizing assumptions are replaced with measurement-based guidance. The sticky purchase bar includes the chosen variant and only appears once the main purchase button scrolls past. Button red meets normal-text contrast; first-view content no longer waits for a scroll-reveal animation.
5. **Recommendations and editorial.** Product recommendations use Shopify's section-rendered related-products endpoint, with a crawlable curated fallback excluding the current product. Cart recommendations require choosing options. Articles avoid repeating their featured image when the same file occurs in the body, omit placeholder “Shopify API” authorship, and can display a merchant-selected product list. News and Gear hubs are linked and blog tags are navigable.
6. **SEO safeguards.** Existing canonicals and indexable pagination are preserved; facets, utility pages and truly empty collections remain/no longer become indexable as appropriate. The collection grid owns the ItemList instead of competing with a second mismatched list. Contact metadata matches its actual form. Variant Offer URLs reflect the selected product variant. No ranking or conversion uplift is claimed without production measurement.

## Validation

- `npm test`: 14 regression tests covering variant state, inventory/quantity, pending requests, 422 errors, multi-variant cards, native contact fields, collection order, reviews, article deduplication, recommendation exclusion, pagination/facet indexing and locale references.
- `node --check assets/kk.js` and `git diff --check`.
- Shopify CLI Theme Check: zero errors; four existing warnings (three optional Google Font loading warnings and one robots template warning).
- Shopify Liquid skill validator: the changed files pass except `layout/theme.liquid`, where the same three existing optional Google Font warnings are treated as failures by that validator. They are not new Liquid/schema errors and have not been suppressed.
- Local browser fixtures rendered from the changed Liquid were checked at **390 × 844** and **1440 × 1000** across product, collection, contact and article templates. The eight checks found no horizontal document overflow and one H1 per page. Browser interaction confirmed sold-out selection, variant URL updates and fit-guide scrolling. These fixtures use representative product data and emulate Shopify-only tags; they do not establish live Shopify, app, contact-delivery or checkout correctness.
- CI runs the regression suite and Theme Check for this deployment branch. No new marketing pixel or analytics integration is installed.

Run `npm ci --ignore-scripts`, `npm test`, then `npm run preview:fixtures` for a local preview at `http://127.0.0.1:8769/product`. Test fixtures cannot place orders or send contact messages.

## Remaining work requiring Shopify access or product data

The read-only Shopify theme-list command was denied access to `best-fight-apparel.myshopify.com`. No Admin data, published theme, customer events, policies, discounts or apps were changed.

| Order | Work to finish | Concrete next action |
|---|---|---|
| 1 | Shopify preview verification | Restore store access using the local authenticated Shopify/Infisical setup; do not share credentials in chat. Confirm the active theme and GitHub connection, upload an unpublished preview, then test variants, quantities, contact errors, cart drawer/page and native checkout transitions. |
| 2 | Product-specific sizing | Match the actual Subliminator catalog product/SKU to each store product, obtain its approved chart, and connect the chart image in the product section. Subliminator describes garment measurements laid flat and a possible one-inch manufacturing variance. Do not apply a single chart to all shorts/rash guards. |
| 3 | Product content and delivery | Apply the reviewable American Flag Athletic Shorts description proposal in `merchant-content-proposal.json` only after rechecking its source hash. Its stored description still says “true to size” and “3–6 business days”; theme edits cannot change that Admin content. Reconcile production estimates with the published policy. The audited short-sleeve rash guard lists **85% polyester / 15% spandex and same-day Tampa shipping**; this does not identify a Subliminator catalog match. |
| 4 | Collection membership and taxonomy | Review `/collections/womens` membership/order against the newer women's assortment. Move genuinely relevant apparel before hats/accessories, preserve legitimate unisex products, normalize product type and color values, and configure Search & Discovery filters. Do not silently hide products in Liquid or split pagination. |
| 5 | Navigation | Update the actual Shopify navigation menu so desktop customers can directly discover shorts, joggers, women and rash guards. The theme corrects the inaccurate jogger label and adds collection/mobile shortcuts, but has not rewritten the Admin menu. |
| 6 | Reviews and recommendations | Confirm the Judge.me app embed and real review bodies load in the unpublished theme. If using a Review Widget app block, turn off the built-in widget setting. Configure Search & Discovery complementary/related recommendations using the actual assortment. |
| 7 | Blogs | Correct stored author fields, verify time-sensitive BKFC claims against official sources, and remove redundant body heroes where appropriate. Connect the new article product-list setting to relevant products per article. The theme does not invent citations, authors, event dates or reviews. |
| 8 | Offers and notifications | Verify “Stack & Save,” shipping eligibility and the restock backend in Admin. Existing customer email/tag capture alone does not prove automatic restock notifications. |
| 9 | Measurement and rollout | Validate exactly one view_item/add_to_cart/begin_checkout/purchase event per action, consent behavior, currencies and values. Check Search Console/Merchant Center and real mobile Web Vitals. Baseline product-view→add-to-cart, checkout completion and size-related returns before judging uplift. |

Saved/recently viewed items, a gear finder, automatic delivery estimates, loyalty and order tracking remain later backlog items. They need reliable inventory, product attributes, shipping data or account integrations first. No app purchases or unverified shipping promises are bundled into this change.

## Release procedure

Review the draft PR against `shopify-theme`; do not merge directly to the stale nested `main/kingkillers-theme`. After Shopify access and unpublished-preview checks pass, confirm the intended release, merge, verify GitHub sync/active theme, and recheck the public URLs. A successful merge alone is not proof the live storefront changed.

## Primary references

- [Shopify variant handling](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants)
- [Shopify related products](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations/related-products)
- [Judge.me widget installation code](https://judge.me/help/en/articles/12058208-liquid-code-for-judge-me-widgets)
- [Subliminator measurement guidance](https://help.subliminator.com/en/articles/7915434-understanding-the-subliminator-size-chart-ensuring-the-perfect-fit)
- [Published return policy](https://kingkillers.co/policies/refund-policy) and [shipping policy](https://kingkillers.co/policies/shipping-policy)
