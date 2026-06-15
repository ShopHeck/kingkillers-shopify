
import React from 'react';
import './EntityAnswer.css';
import { useReveal } from '../../hooks/useReveal';

const FACTS: [string, string][] = [
  ['Brand', 'King Killers Apparel'],
  ['Niche', 'Fighter-owned combat sports apparel'],
  ['Based in', 'Tampa / St. Petersburg, Florida, USA'],
  ['Audience', 'MMA, boxing, BJJ, Muay Thai & gym athletes'],
  ['Products', 'Hybrid shorts, rashguards, tees, hoodies, hats & accessories'],
];

export function EntityAnswer() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="kk-entity kk-section" aria-labelledby="entity-title">
      <div className="kk-wrap">
        <div className="kk-entity__card kk-reveal" ref={ref}>
          <div className="kk-entity__lead">
            <p className="kk-eyebrow">What is King Killers?</p>
            <h2 id="entity-title" className="kk-entity__title">
              A fighter-owned apparel brand for athletes who hunt the person at the top.
            </h2>
            <p className="kk-entity__copy">
              King Killers Apparel is a US-based small business founded in 2021 by professional
              fighter Michael “Heck” Heckert. Every piece is designed by real competitors and
              made in the USA — bold, durable and built for the gym, the cage and the street.
            </p>
          </div>
          <dl className="kk-entity__facts">
            {FACTS.map(([label, value]) => (
              <div className="kk-entity__fact" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
