
import React from 'react';
import './FounderStory.css';
import { useReveal } from '../../hooks/useReveal';

export function FounderStory() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="story" className="kk-section kk-story" aria-labelledby="story-title">
      <div className="kk-wrap kk-story__inner kk-reveal" ref={ref}>
        <div className="kk-story__media" aria-hidden="true">
          <div className="kk-story__frame">
            <span className="kk-story__initials">HECK</span>
            <span className="kk-story__role">Founder · Pro Fighter</span>
            <span className="kk-story__belt">Tampa, FL · Est. 2021</span>
          </div>
        </div>

        <div className="kk-story__copy">
          <p className="kk-eyebrow">Who Are the King Killers?</p>
          <h2 className="kk-h2" id="story-title">Built in the Cage, Not a Boardroom.</h2>
          <p className="kk-story__text">
            King Killers is a US-based small business owned and operated by real fighters
            competing in BJJ, boxing and MMA. It started with Michael “Heck” Heckert — a
            professional fighter who fell in love with combat sports at local cage fights with
            his dad.
          </p>
          <p className="kk-story__text">
            A “King Killer” hunts the people at the top — the champions, the title holders,
            the best in the room. That mindset is stitched into every piece we make: premium
            fightwear at the best possible price, tested by people who actually compete. Every
            purchase supports a fighter-owned marketplace and the camp behind it.
          </p>
          <blockquote className="kk-story__quote">
            “Our goal is to work our way through the rankings until we one day match up
            against the King.”
          </blockquote>
          <div className="kk-story__cta">
            <a href="#bestsellers" className="kk-btn kk-btn--primary">Gear Up Like a Fighter</a>
          </div>
        </div>
      </div>
    </section>
  );
}
