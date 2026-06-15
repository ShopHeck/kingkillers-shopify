
import React from 'react';
import './ManifestoBlock.css';
import { useReveal } from '../../hooks/useReveal';

export function ManifestoBlock() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="kk-manifesto kk-section" aria-labelledby="manifesto-title">
      <div className="kk-wrap">
        <div className="kk-manifesto__inner kk-reveal" ref={ref}>
          <p className="kk-eyebrow">The Code</p>
          <h2 id="manifesto-title" className="kk-manifesto__text">
            Real Kings <span className="kk-manifesto__hl">Kill Kings.</span> We hunt the people
            at the top — in the cage, in the gym, and in life. Every stitch is built for the
            chase.
          </h2>
        </div>
      </div>
    </section>
  );
}
