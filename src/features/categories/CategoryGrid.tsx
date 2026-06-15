
import React from 'react';
import './CategoryGrid.css';
import { useReveal } from '../../hooks/useReveal';

type Cat = {
  title: string;
  tag: string;
  count: string;
  span: 'lg' | 'sm';
  hue: string;
};

const CATS: Cat[] = [
  { title: '2-in-1 Hybrid Shorts', tag: 'Best Seller', count: 'From $34.99', span: 'lg', hue: '#e11313' },
  { title: 'MMA Rashguards', tag: 'Fightwear', count: 'Compression fit', span: 'sm', hue: '#7b1fa2' },
  { title: 'Graphic Tees & Tanks', tag: 'Everyday', count: '100% pre-shrunk', span: 'sm', hue: '#1976d2' },
  { title: 'Hoodies & Sleeveless', tag: 'Training', count: 'From $49.99', span: 'sm', hue: '#c2410c' },
  { title: 'Mesh Gym Shorts', tag: 'Performance', count: 'From $34.99', span: 'sm', hue: '#0f766e' },
  { title: 'Necklaces & Hats', tag: 'Accessories', count: 'From $19.99', span: 'lg', hue: '#b45309' },
];

export function CategoryGrid() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="categories" className="kk-section kk-cats" aria-labelledby="cats-title">
      <div className="kk-wrap">
        <header className="kk-cats__head">
          <div>
            <p className="kk-eyebrow">Shop by Arsenal</p>
            <h2 className="kk-h2" id="cats-title">Find Your Weapon</h2>
          </div>
          <p className="kk-lead kk-cats__lead">
            From hybrid training shorts to fight-ready rashguards — every piece is
            designed to move, breathe and survive the hardest rounds.
          </p>
        </header>

        <div className="kk-cats__grid kk-reveal" ref={ref}>
          {CATS.map((c) => (
            <a
              key={c.title}
              href="#bestsellers"
              className={`kk-cat kk-cat--${c.span}`}
              style={{ ['--hue' as any]: c.hue }}
            >
              <span className="kk-cat__art" aria-hidden="true" />
              <span className="kk-cat__tag">{c.tag}</span>
              <span className="kk-cat__body">
                <span className="kk-cat__title">{c.title}</span>
                <span className="kk-cat__count">{c.count}</span>
              </span>
              <span className="kk-cat__arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
