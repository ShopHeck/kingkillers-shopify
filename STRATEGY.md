
# King Killers — Landing Page Strategy & Build Notes

This explains the brand research and the SEO / GEO / CRO / Core Web Vitals decisions
baked into the React build.

## 0. What is kingkillers.co?
- **Brand:** King Killers Apparel — a fighter-owned & operated combat-sports clothing brand
  based in Tampa / St. Petersburg, Florida, USA. Founded 2021.
- **Founder:** Michael "Heck" Heckert, a professional fighter.
- **Ethos:** "Real Kings Kill Kings" — a King Killer hunts the people at the top.
- **Products:** 2-in-1 / hybrid shorts, mesh gym shorts, swim trunks, graphic tees, tanks,
  MMA rashguards, hoodies & sleeveless hoodies, hats, boxing-glove necklaces, wall art.
  Signature look = red/white/black paint splatter. Price range ~$19–$69.
- **Audience:** MMA / BJJ / boxing / Muay Thai fighters + CrossFit & general gym crowd.
- **Tone:** aggressive, gritty, confident, community-driven, patriotic (Made in USA).
- **Proof:** 4.8★ / 200+ reviews, free shipping $100+, 30-day money-back guarantee.

## 1. Page structure (persuasion arc)
Announcement bar → sticky header → hero → trust strip → entity answer → manifesto →
category bento → best sellers → founder story → value props → reviews wall → FAQ →
final CTA → footer. Order: Hook → Trust → Define → Identity → Browse → Proof → Story →
Benefits → Social proof → Objection handling → Close.

## 2. SEO
- Keyword-rich title + meta description with offer/guarantee, canonical, robots
  (`max-image-preview:large`), theme-color, Open Graph + Twitter cards.
- Semantic HTML: single `<h1>`, sectioned `<h2>`/`<h3>`, `<main>/<nav>/<header>/<footer>`,
  `<article>`, `<figure>/<figcaption>`, `<blockquote>`, `<dl>`, aria-labelledby on sections.
- JSON-LD `@graph`: Organization (founder, NAP, sameAs), WebSite (+SearchAction),
  Store (AggregateRating), FAQPage — eligible for rich results.
- Skip-link, real crawlable text (no text-in-images), internal anchor linking.
- Production to-do: sitemap.xml, robots.txt, per-PDP Product schema w/ real Offer + alt text.

## 3. GEO (AI search citation)
- A dedicated **"What is King Killers?" entity-answer block** + fact list gives LLMs a
  clean, extractable definition.
- FAQ answers mirror the FAQPage JSON-LD verbatim — the chunk format AI engines cite.
- Concrete, attributable facts (Tampa/St. Pete FL, founded 2021, founder Michael Heckert,
  USA-made, $19–$69, 200+ reviews, 30-day guarantee) repeated consistently in HTML + schema.
- Production to-do: keep facts consistent across site/Trustpilot/socials, don't block
  GPTBot/PerplexityBot/ClaudeBot in robots.txt if citation is the goal.

## 4. CRO
- Above-the-fold dual CTA + inline trust bullets; sticky header CTA.
- Risk reversal repeated (hero, trust strip, value props, final CTA).
- Price anchoring (strikethrough + Save %), honest scarcity badges, dense social proof.
- Friction reduction: single-purpose buttons, anchor nav, large tap targets, minimal form.

## 5. Core Web Vitals
- **LCP:** hero is pure HTML/CSS (no image download); fonts `display=swap` + preconnect.
- **CLS:** fixed `aspect-ratio` media, reserved hero space, no late-injected banners.
- **INP:** scroll handler rAF-throttled + passive; reveal via IntersectionObserver;
  simple state toggles; `will-change` only on transform-animated elements.
- **Weight:** zero image files, zero extra JS libs — React + ReactDOM via importmap;
  all visuals are CSS gradients/SVG.
- A11y: landmarks, `:focus-visible`, `aria-expanded`, full `prefers-reduced-motion` support.

## 6. Unique design
Dark "blood & bone" palette, brand-authentic CSS paint-splatter, oversized kinetic outline
display type, bento category grid w/ hover parallax, pausable marquee, scroll-reveal
choreography, masonry review wall, sticky editorial FAQ. All motion degrades gracefully.
