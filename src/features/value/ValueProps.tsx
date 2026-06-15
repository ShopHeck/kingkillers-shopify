
import React from 'react';
import './ValueProps.css';
import { useReveal } from '../../hooks/useReveal';

const PROPS = [
  {
    icon: 'M12 2 3 6v6c0 5 3.8 8.6 9 10 5.2-1.4 9-5 9-10V6z',
    title: 'Engineered to Endure',
    body: 'Performance fabrics and reinforced stitching built to survive the hardest training rounds — not fall apart after a wash.',
  },
  {
    icon: 'M13 2 3 14h7l-1 8 10-12h-7z',
    title: 'Move Without Limits',
    body: 'Hybrid shorts and compression fits that stay put during sprawls, lifts and sprints. Versatile enough to train, fight and swim.',
  },
  {
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9z',
    title: 'Designs You Actually Own',
    body: 'Bold paint-splatter prints designed and sold exclusively at King Killers. You will not see them in every gym.',
  },
  {
    icon: 'M3 6h18v12H3zM3 10h18M7 14h4',
    title: 'Risk-Free to Try',
    body: 'Free shipping over $100, fast and reliable support, and a 30-day money-back guarantee on every order.',
  },
];

export function ValueProps() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="kk-section kk-vp" aria-labelledby="vp-title">
      <div className="kk-wrap">
        <header className="kk-vp__head">
          <p className="kk-eyebrow">Why King Killers</p>
          <h2 className="kk-h2" id="vp-title">Gear That Earns Its Place</h2>
        </header>
        <div className="kk-vp__grid kk-reveal" ref={ref}>
          {PROPS.map((p) => (
            <div className="kk-vp__card" key={p.title}>
              <span className="kk-vp__icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d={p.icon} /></svg>
              </span>
              <h3 className="kk-vp__title">{p.title}</h3>
              <p className="kk-vp__body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
