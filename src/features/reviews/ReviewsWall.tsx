
import React from 'react';
import './ReviewsWall.css';
import { useReveal } from '../../hooks/useReveal';

type Review = { quote: string; name: string; tag: string };

const REVIEWS: Review[] = [
  { quote: 'Replacing all my old shorts with King Killers. They stay up better during intense workouts and the style is bold.', name: 'Verified Buyer', tag: 'Hybrid Shorts' },
  { quote: 'This gear keeps up with my performance AND I still get to look good during it. Best of both worlds — a must have for the gym.', name: 'Verified Buyer', tag: 'Activewear' },
  { quote: 'Arguably the best shorts and rashguard I ever wore. Quality is top notch and the fit is perfect. Worth every penny.', name: 'Verified Buyer', tag: 'Rashguard' },
  { quote: 'Good quality, unique design, shipped quickly. The bold colors and high-quality material made you my new favorite brand.', name: 'Verified Buyer', tag: 'Graphic Tee' },
  { quote: 'Super comfy! The hybrid shorts move with you. Love the paint splatter — glad I gave them a try.', name: 'Verified Buyer', tag: 'Hybrid Shorts' },
  { quote: 'Came lightning quick with a great personal message. Great working with a brand that actually cares.', name: 'Verified Buyer', tag: 'Rashguard' },
];

function Card({ r }: { r: Review }) {
  return (
    <figure className="kk-rev__card">
      <div className="kk-rev__stars" aria-label="5 out of 5 stars">★★★★★</div>
      <blockquote className="kk-rev__quote">{r.quote}</blockquote>
      <figcaption className="kk-rev__meta">
        <span className="kk-rev__avatar" aria-hidden="true">{r.name.charAt(0)}</span>
        <span>
          <span className="kk-rev__name">{r.name}</span>
          <span className="kk-rev__tag">{r.tag}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function ReviewsWall() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="reviews" className="kk-section kk-rev" aria-labelledby="rev-title">
      <div className="kk-wrap">
        <header className="kk-rev__head">
          <p className="kk-eyebrow">From the Community</p>
          <h2 className="kk-h2" id="rev-title">200+ Athletes Can't Be Wrong</h2>
          <div className="kk-rev__score">
            <span className="kk-rev__big">4.8</span>
            <span className="kk-rev__bigstars">★★★★★</span>
            <span className="kk-rev__count">Verified reviews across Trustpilot &amp; site</span>
          </div>
        </header>

        <div className="kk-rev__grid kk-reveal" ref={ref}>
          {REVIEWS.map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
    </section>
  );
}
