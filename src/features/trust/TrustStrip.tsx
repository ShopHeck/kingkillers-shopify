
import React from 'react';
import './TrustStrip.css';

const ITEMS = [
  { k: 'Fighter Owned', v: 'Run by real BJJ, boxing & MMA competitors' },
  { k: 'Made in the USA', v: 'Designed & sold exclusively by King Killers' },
  { k: '4.8★ Rated', v: '200+ reviews across Trustpilot & site' },
  { k: 'Guaranteed', v: '30-day money-back, no questions asked' },
];

export function TrustStrip() {
  return (
    <section className="kk-trust" aria-label="Why athletes trust King Killers">
      <div className="kk-wrap kk-trust__grid">
        {ITEMS.map((it) => (
          <div className="kk-trust__cell" key={it.k}>
            <span className="kk-trust__k">{it.k}</span>
            <span className="kk-trust__v">{it.v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
