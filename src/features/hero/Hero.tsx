
import React from 'react';
import './Hero.css';

export function Hero() {
  return (
    <section className="kk-hero" aria-labelledby="hero-title">
      <div className="kk-hero__bg" aria-hidden="true">
        <span className="kk-hero__glow kk-hero__glow--a" />
        <span className="kk-hero__glow kk-hero__glow--b" />
        <span className="kk-hero__grid" />
      </div>

      {/* Oversized kinetic backdrop word — purely decorative */}
      <div className="kk-hero__ghostword" aria-hidden="true">KILL&nbsp;KINGS</div>

      <div className="kk-wrap kk-hero__inner">
        <p className="kk-eyebrow kk-hero__eyebrow">Fighter Owned · Made in the USA</p>

        <h1 id="hero-title" className="kk-hero__title">
          Gear Built to
          <span className="kk-hero__title-accent"> Outlast </span>
          the Fight.
        </h1>

        <p className="kk-hero__sub">
          Combat-sports apparel engineered for athletes who hunt the people at the top.
          Train, fight and live in gear forged by real fighters — not a faceless factory.
        </p>

        <div className="kk-hero__cta">
          <a href="#bestsellers" className="kk-btn kk-btn--primary">Shop Best Sellers</a>
          <a href="#story" className="kk-btn kk-btn--ghost">Who Are the King Killers?</a>
        </div>

        <ul className="kk-hero__bullets" aria-label="Why shop King Killers">
          <li><span className="kk-hero__check">✓</span> 4.8★ from 200+ verified athletes</li>
          <li><span className="kk-hero__check">✓</span> Free shipping over $100</li>
          <li><span className="kk-hero__check">✓</span> 30-day money-back guarantee</li>
        </ul>
      </div>

      <div className="kk-hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="kk-hero__scrollline" />
      </div>
    </section>
  );
}
