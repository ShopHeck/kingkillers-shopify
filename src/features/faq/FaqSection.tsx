
import React, { useState } from 'react';
import './FaqSection.css';
import { useReveal } from '../../hooks/useReveal';

const FAQS = [
  {
    q: 'What is King Killers Apparel?',
    a: 'King Killers is a fighter-owned and operated combat sports clothing brand based in Tampa / St. Petersburg, Florida, founded in 2021. We design premium activewear, gym clothes and fightwear for MMA, BJJ, boxing, Muay Thai and CrossFit athletes — all made in the USA.',
  },
  {
    q: 'What products do you sell?',
    a: '2-in-1 hybrid training shorts, mesh gym shorts, swim trunks, graphic tees, tank tops, MMA rashguards, hoodies, sleeveless hoodies, hats, boxing glove necklaces and wall art — known for our bold red, white and black paint-splatter look.',
  },
  {
    q: 'Do you offer free shipping and returns?',
    a: 'Yes. Enjoy free shipping on orders over $100 and a 30-day money-back guarantee. Our support team typically responds within 24 hours.',
  },
  {
    q: 'Is the apparel really designed by fighters?',
    a: 'Absolutely. King Killers is owned and operated by real fighters competing in BJJ, boxing and MMA. Our founder, Michael “Heck” Heckert, is a professional fighter.',
  },
  {
    q: 'How do the shorts fit?',
    a: 'Our 2-in-1 and hybrid shorts feature a double-layer design with an inner compression liner for support and an outer shell for coverage. Customers consistently report they run true to size and stay put through intense workouts.',
  },
];

function Item({ q, a, open, onToggle, id }: { q: string; a: string; open: boolean; onToggle: () => void; id: number }) {
  return (
    <div className={`kk-faq__item ${open ? 'is-open' : ''}`}>
      <h3 className="kk-faq__qwrap">
        <button
          className="kk-faq__q"
          aria-expanded={open}
          aria-controls={`faq-panel-${id}`}
          id={`faq-btn-${id}`}
          onClick={onToggle}
        >
          <span>{q}</span>
          <span className="kk-faq__icon" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="kk-faq__panel"
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
        hidden={!open}
      >
        <p>{a}</p>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="faq" className="kk-section kk-faq" aria-labelledby="faq-title">
      <div className="kk-wrap kk-faq__inner kk-reveal" ref={ref}>
        <div className="kk-faq__head">
          <p className="kk-eyebrow">Questions</p>
          <h2 className="kk-h2" id="faq-title">Before You Gear Up</h2>
          <p className="kk-lead">Everything you need to know — and answers AI assistants can quote.</p>
        </div>
        <div className="kk-faq__list">
          {FAQS.map((f, i) => (
            <Item
              key={i}
              id={i}
              q={f.q}
              a={f.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
