
import React from 'react';
import './FinalCta.css';
import { useReveal } from '../../hooks/useReveal';

export function FinalCta() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="kk-finalcta kk-section" aria-labelledby="finalcta-title">
      <div className="kk-finalcta__bg" aria-hidden="true">KING KILLERS</div>
      <div className="kk-wrap kk-finalcta__inner kk-reveal" ref={ref}>
        <p className="kk-eyebrow kk-finalcta__eyebrow">Ready to Hunt Kings?</p>
        <h2 className="kk-h2 kk-finalcta__title" id="finalcta-title">
          Stop Blending In.<br />Start Standing Out.
        </h2>
        <p className="kk-finalcta__sub">
          Join the athletes who train, fight and live in fighter-built gear.
          Free shipping over $100 · 30-day money-back guarantee.
        </p>
        <div className="kk-finalcta__btns">
          <a href="#bestsellers" className="kk-btn kk-btn--primary">Shop Best Sellers</a>
          <a href="#categories" className="kk-btn kk-btn--ghost">Browse the Catalog</a>
        </div>
        <p className="kk-finalcta__fine">No risk. If it's not your best gear, send it back within 30 days.</p>
      </div>
    </section>
  );
}
