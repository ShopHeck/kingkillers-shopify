
import React from 'react';
import './Footer.css';
import { Logo } from './Logo';

const COLS = [
  { h: 'Shop', links: ['2-in-1 Shorts', 'Mesh Shorts', 'Rashguards', 'Tees & Tanks', 'Hoodies', 'Accessories'] },
  { h: 'Company', links: ['Our Story', 'Join the Team', 'Blog', 'Affiliate Program'] },
  { h: 'Support', links: ['Contact Us', 'Shipping & Delivery', 'Refunds & Returns', 'Size Chart'] },
];

export function Footer() {
  return (
    <footer className="kk-footer" aria-label="Site footer">
      <div className="kk-wrap kk-footer__top">
        <div className="kk-footer__brand">
          <Logo />
          <p className="kk-footer__tag">
            Athletic apparel inspired by combat sports. Fighter owned &amp; operated in the USA.
          </p>
          <p className="kk-footer__slogan">Real Kings Kill Kings ⚔</p>
          <div className="kk-footer__social" aria-label="Social media">
            <a href="https://www.instagram.com/kingkillersco/" aria-label="Instagram">IG</a>
            <a href="https://www.facebook.com/KingKillersCo/" aria-label="Facebook">FB</a>
            <a href="https://www.trustpilot.com/review/kingkillers.co" aria-label="Trustpilot">TP</a>
          </div>
        </div>

        {COLS.map((c) => (
          <nav className="kk-footer__col" key={c.h} aria-label={c.h}>
            <h2 className="kk-footer__h">{c.h}</h2>
            <ul>
              {c.links.map((l) => (
                <li key={l}><a href="#main">{l}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="kk-wrap kk-footer__newsletter">
        <div>
          <h2 className="kk-footer__nlh">Join the Kill List</h2>
          <p>Early drops, fighter stories &amp; subscriber-only discounts.</p>
        </div>
        <form className="kk-footer__form" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter signup">
          <label htmlFor="nl-email" className="kk-footer__sr">Email address</label>
          <input id="nl-email" type="email" placeholder="your@email.com" autoComplete="email" required />
          <button type="submit" className="kk-btn kk-btn--primary">Sign Up</button>
        </form>
      </div>

      <div className="kk-wrap kk-footer__bottom">
        <span>© {new Date().getFullYear()} King Killers Apparel · St. Petersburg, FL 33702</span>
        <span>sales@kingkillers.co · (620) 704-7510</span>
      </div>
    </footer>
  );
}
