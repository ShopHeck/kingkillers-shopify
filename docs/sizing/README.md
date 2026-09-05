# Athletic Shorts size guide

Status: implemented on `codex/athletic-shorts-size-guide` and uploaded to unpublished Shopify theme `155205796031`. Not published to the live theme.

## Supplier verification

The merchant identified **Athletic Shorts - AOP** on September 5, 2026. Subliminator's authenticated catalog confirms product ID 62, SKU family `SBMSHA`, sizes XS–4XL, and the inch/centimeter tables preserved in `athletic-shorts-source.json`.

The source tables are transposed into size-per-row tables for mobile readability. Supplier centimeter values are retained verbatim, including their rounding. Waist and hip numbers are flat widths, not circumference or body measurements. The supplier states a manufacturing variation of up to one inch.

The same catalog entry confirms 95% recycled polyester / 5% spandex, 250 g/m² fabric, two-way stretch, side pockets, and a 3–6 business-day production estimate. Shipping is additional. This corrects the earlier audit's uncertainty about that production estimate; it does not establish a guaranteed delivery date or reconcile every store policy. No product description or policy was changed by this theme update.

## Product matching

A read-only Admin query for `sku:SBMSHA*` returned 22 products, eight variants each, with no further page. Every returned variant has the exact `SBMSHA-` prefix. The snapshot records their handles and supplier design identifiers.

The chart appears only when all product variants match that prefix. Empty, mixed, missing or longer-prefix SKUs fail closed. Products with more than 50 variants also use the existing fallback, avoiding partial Liquid-loop validation. Explicit merchant chart images retain precedence. Other styles retain their existing product-image/fallback guidance; women's charts are unaffected.

## Validation

- 17 tests pass, including all source measurement cells, unrelated/mixed SKU exclusion, explicit image precedence, and existing purchase regressions.
- Shopify Theme Check: zero errors and four pre-existing warnings.
- Shopify Liquid validator: all three changed theme files pass.
- Real unpublished Shopify preview: Size guide opens the chart, inches and centimeters are accessible through native details controls, and L remains selected. Checked at 390×844 and 1440×1000 with no horizontal document overflow.

Supplier references: [catalog entry](https://app.subliminator.com/#/editor/62?source=catalog), [public catalog specifications](https://help.subliminator.com/en/articles/8048087-understanding-our-extensive-product-catalog), [measurement guidance](https://help.subliminator.com/en/articles/7915434-understanding-the-subliminator-size-chart-ensuring-the-perfect-fit).
