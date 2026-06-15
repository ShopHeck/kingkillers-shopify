
import React from 'react';
import './ProductCard.css';

export type Product = {
  name: string;
  sub: string;
  price: number;
  was: number;
  reviews: number;
  badge: string;
  hue: string;
};

function Stars({ n }: { n: number }) {
  return (
    <span className="kk-pc__stars" aria-label={`Rated 5 out of 5 from ${n} reviews`}>
      <span aria-hidden="true">★★★★★</span>
      <span className="kk-pc__rev">({n})</span>
    </span>
  );
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { name, sub, price, was, reviews, badge, hue } = product;
  const save = Math.round(((was - price) / was) * 100);
  return (
    <article className="kk-pc" style={{ ['--hue' as any]: hue }}>
      <div className="kk-pc__media" aria-hidden="true">
        <span className="kk-pc__splatter" />
        <span className="kk-pc__badge">{badge}</span>
        {save > 0 && <span className="kk-pc__save">Save {save}%</span>}
      </div>
      <div className="kk-pc__info">
        <Stars n={reviews} />
        <h3 className="kk-pc__name">{name}</h3>
        <p className="kk-pc__sub">{sub}</p>
        <div className="kk-pc__pricerow">
          <span className="kk-pc__price">${price.toFixed(2)}</span>
          <span className="kk-pc__was">${was.toFixed(2)}</span>
        </div>
        <a href="#bestsellers" className="kk-btn kk-btn--primary kk-btn--full kk-pc__cta">
          Add to Cart
        </a>
      </div>
    </article>
  );
}
