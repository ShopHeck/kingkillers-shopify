
import React from 'react';
import './BestSellers.css';
import { ProductCard, Product } from './ProductCard';
import { useReveal } from '../../hooks/useReveal';

const PRODUCTS: Product[] = [
  { name: 'Paint Splatter 2-in-1 Shorts', sub: 'Double-Layer Athletic Nylon', price: 39.99, was: 44.99, reviews: 25, badge: 'Best Seller', hue: '#e11313' },
  { name: 'Neon Hybrid Training Shorts', sub: 'Train · Lift · Swim', price: 34.99, was: 44.99, reviews: 25, badge: 'Staff Pick', hue: '#1976d2' },
  { name: 'Boxing Glove Necklace', sub: '24" Cable Chain', price: 19.99, was: 30.0, reviews: 10, badge: '-33%', hue: '#b45309' },
  { name: 'Blood Smoke Pullover Hoodie', sub: 'Premium Fleece', price: 49.99, was: 60.0, reviews: 4, badge: 'Limited', hue: '#7b1fa2' },
];

export function BestSellers() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="bestsellers" className="kk-section kk-best" aria-labelledby="best-title">
      <div className="kk-wrap">
        <header className="kk-best__head">
          <p className="kk-eyebrow">Most Wanted</p>
          <h2 className="kk-h2" id="best-title">The Lineup Athletes Reorder</h2>
          <p className="kk-lead">
            These are the pieces our community keeps coming back for. Bold prints,
            performance fabrics, and a fit that stays put through every round.
          </p>
        </header>

        <div className="kk-best__grid kk-reveal" ref={ref}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.name} product={p} priority={i === 0} />
          ))}
        </div>

        <div className="kk-best__foot">
          <a href="#categories" className="kk-btn kk-btn--ghost">View Full Catalog (250+ Designs)</a>
        </div>
      </div>
    </section>
  );
}
