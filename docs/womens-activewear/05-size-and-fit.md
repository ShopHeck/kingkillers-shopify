# 05 — Size & Fit

## Why this document exists

Women's activewear returns run **25–40% industry-wide**, and fit is the dominant reason.
At a 60% gross margin, one return roughly eats the profit of three sales. A line that
converts beautifully and gets returned at 35% loses money.

This is the highest-leverage work in the entire launch and it is almost always the part
that gets skipped, because it is unglamorous and it does not photograph.

---

## The four things that actually reduce fit returns

### 1. Body measurements, not letters

"Size S" means nothing across brands. Numbers do. `snippets/size-chart.liquid` renders
real body measurements in inches with how-to-measure instructions, keyed off the
`custom.size_chart_key` metafield.

Four charts ship: `womens-bottoms`, `womens-tops`, `womens-bra`, `womens-socks`.

| Size | Bust | Natural waist | Hip |
|---|---|---|---|
| XS | 31–32 | 24–25 | 34–35 |
| S | 33–34 | 26–27 | 36–37 |
| M | 35–36 | 28–29 | 38–39 |
| L | 37–39 | 30–32 | 40–42 |
| XL | 40–42 | 33–35 | 43–45 |
| 2XL | 43–45 | 36–38 | 46–48 |

**These are a standard US women's grade, not measured off your garments.** Before launch,
take a tape to one sample in each size from your actual supplier and reconcile. If the
supplier's M measures 30" at the waist and your chart says 28–29", the chart is now
*causing* returns rather than preventing them. This is a two-hour job that pays for
itself in the first month.

### 2. A fit note that makes the decision for her

Every product carries `custom.fit_note`, rendered next to the size-chart toggle and in
the Fit block. Not "see size chart" — an instruction:

- Compression pieces: `True to size — compression. Size down if between sizes.`
- Relaxed pieces: `Relaxed — size down for a closer crop.`

"Between sizes, size down" removes the decision. Ambiguity is what produces a hedge
purchase — or two sizes bought with one destined for return.

### 3. Fit model stats on every PDP

`custom.model_stats` — `Model is 5'7", 135 lb, wearing size S`. A shopper who is 5'6" and
140 lb can now reason about the image instead of guessing.

**This field is empty on all eleven products** because it needs a real model. It cannot
be invented — a wrong number here is worse than a blank one. Fill it during photography.

Use **at least two fit models across the line**, ideally at opposite ends of the range
(an S and an XL). One model at size S showing every product tells a 2XL customer that the
line is not for her.

### 4. Fit feedback in reviews

Configure your review app to ask one extra question: **"How did it fit?"** with three
answers — *Runs small* / *True to size* / *Runs large*. Then surface the aggregate on the
PDP: "78% say true to size."

This is the single highest-converting piece of content on a mature activewear PDP,
because it is the only fit signal that comes from people rather than from the brand. It
also tells you which SKU has a grading problem before the returns data does.

---

## Return policy: exchange-first

You offer a 30-day money-back guarantee. On a fit-risky category, make **exchange the
default path and refund the fallback**.

A size exchange keeps the revenue and keeps the customer. A refund loses both. The
difference across a launch is material, and the customer usually *prefers* the exchange —
she wanted the garment, she wanted a different size.

The PDP copy already reflects this: *"Wrong size? Email us your measurements and we will
exchange it."* Make sure the actual returns flow matches the promise.

---

## The 2XL gap

The Crown Seamless Training Bra runs **XS–XL**. Every other Round One product runs
XS–2XL.

This breaks two things:

1. A customer buying a 2XL legging cannot buy the matching bra. She notices.
2. The Training Kit and Full Arsenal both offer a 2XL variant that contains a bra which
   does not exist in 2XL.

Fix before launch. Either source the bra in 2XL, or remove the 2XL variant from both
kits. Shipping a kit that cannot be fulfilled at the top of the range is a customer
service problem disguised as a merchandising one.

---

## What to measure after launch

Weekly, from week one:

| Metric | Why | Action threshold |
|---|---|---|
| Return rate by SKU | Finds the badly graded style | Any SKU >20% above line average |
| Return **reason** by SKU | Separates fit from quality | "Too small" clustering = re-grade |
| Sell-through by size | Validates the curve | Any size <40% or >90% of curve |
| "How did it fit?" split | Leading indicator, arrives before returns | <60% "true to size" |

The fit-feedback split moves weeks before the return rate does. It is the early warning
system. Watch it first.
