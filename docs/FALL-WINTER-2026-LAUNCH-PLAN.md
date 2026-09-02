# King Killers Fall / Winter 2026 launch plan

## Outcome

Launch Fall / Winter 2026 as a focused seasonal collection, not as another broad catalog filter. The theme now includes:

- `collection.fall-winter-2026` for a campaign-led collection page with three capsule stories and the standard Shopify product grid.
- `KK Seasonal promo`, preconfigured and disabled on the homepage until the collection and campaign media are ready.
- Merchant-editable campaign, capsule, palette, CTA, collection, and image settings.

No products, collections, menus, inventory, pricing, theme assignments, or live storefront content were changed by this implementation.

## Merchandising architecture

Use the final production palette consistently: Black `#000000`, Charcoal `#262626`, Competition Red `#C81010`, Bone `#EDE8DC`, White `#FFFFFF`, and Antique Gold `#D4AF37`. Brighter UI red may be retained where text contrast requires it; print specifications should use the production values.

Use one parent collection and three tightly curated capsule collections:

| Collection | Role | Initial product direction |
| --- | --- | --- |
| Fall / Winter 2026 | Campaign landing and complete seasonal assortment | Every approved FW26 item only |
| Core Performance | Cross-gender training system | Technical joggers, training shorts, sports bra, leggings, cropped half-zip |
| Pretty Dangerous | Women's focused story | Sports bra, leggings, training shorts, cropped top, cropped hoodie or crew |
| No Crown Given | Men's and unisex story | Heavyweight hoodie, sleeveless hoodie, training shorts, joggers, tee, beanie |

Do not reuse the broad `womens` or `mens` collections as capsule destinations. They currently include unrelated product types and will weaken the drop story.

## Release sequence

### Gate 1: samples

Order and approve the smallest coherent looks before publishing:

- Pretty Dangerous sports bra and leggings in the same size.
- Core training shorts or joggers with the intended vertical graphic.
- No Crown Given heavyweight or sleeveless hoodie with the intended front and back decoration.
- One accessory sample if the beanie or socks are included in launch creative.

Check print scale, seam placement, opacity under stretch, color match between paired pieces, wash behavior, decoration hand-feel, and the real garment silhouette against the concept boards.

### Gate 2: product system

Create products with consistent data:

- Title pattern: `[Capsule] [Product Name]` only when the capsule name helps the shopper.
- Product type: use a controlled value such as `Sports Bra`, `Leggings`, `Training Shorts`, `Joggers`, `Hoodie`, `T-Shirt`, or `Beanie`.
- Tags: `FW26`, one capsule tag, one gender or unisex tag, and honest merchandising tags such as `Limited Drop` only when true.
- Badge metafield: use `custom.badge` for the visible card badge instead of adding promotional language to titles.
- SEO description: lead with garment type, use case, material or construction, fit, and care. Keep slogans secondary.
- Media order: front, back, side/detail, styled look, fit reference, size guide. Do not use print masters as product media.
- Variants: keep color names to Obsidian, Graphite, Oxblood, Bone, and Antique Gold only when those variants physically exist.

### Gate 3: campaign media

Use the supplied boards and AI mockups as art direction. Replace them with approved sample photography for the public hero and product gallery. Recommended capture list:

1. One 3:2 or 16:9 landscape hero with negative space for left-aligned copy.
2. One 4:5 Pretty Dangerous image.
3. One 4:5 No Crown Given image.
4. One 4:5 Core Performance group or detail image.
5. Front, back, side, close-up, and movement frames for every launch product.

Upload the campaign images through the theme editor. Production PNGs, SVGs, seamless tiles, print fills, and manufacturer files stay in the production package and off the storefront.

### Gate 4: Shopify assembly

1. Create the parent and capsule collections.
2. Add only sample-approved products.
3. Assign the `fall-winter-2026` theme template to the parent collection.
4. In the seasonal section, select the hero and capsule images and bind each capsule block to its collection.
5. Add the parent collection to the primary navigation under a clear label such as `Fall / Winter 2026` or `New Drop`.
6. Enable the prebuilt homepage `KK Seasonal promo` and select the parent collection and campaign image.
7. Verify filters expose only useful values for the assortment: size, availability, product type, and color.

### Gate 5: public verification

Verify desktop and mobile before launch:

- Hero copy and CTA remain visible at 390 px width.
- No horizontal overflow.
- Every capsule card resolves to the intended collection.
- Product count matches the approved launch list.
- Variant selection, quantity, add-to-cart, cart drawer, and checkout handoff work.
- Product media do not imply details that the manufactured sample lacks.
- Structured data contains real price, availability, and product information.
- No unpublished, archived, or out-of-season item appears in the parent collection.

## Commercial recommendation

Launch with a small number of complete looks, then expand from measured demand. A five-to-eight product first drop is easier to photograph, sample, explain, bundle, and restock than publishing every available graphic at once. The capsule structure can hold later Q4 additions without changing the page architecture.
