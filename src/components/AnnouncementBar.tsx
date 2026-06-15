
import React from 'react';
import './AnnouncementBar.css';

const MESSAGES = [
  'FREE SHIPPING ON ORDERS $100+',
  'FIGHTER OWNED & OPERATED',
  '30-DAY MONEY-BACK GUARANTEE',
  'DESIGNED & MADE IN THE USA',
];

export function AnnouncementBar() {
  // Triple the list so the marquee loops seamlessly across a -33.333% transform.
  const track = [...MESSAGES, ...MESSAGES, ...MESSAGES];
  return (
    <div className="kk-announce" role="region" aria-label="Store announcements">
      <div className="kk-announce__track">
        {track.map((m, i) => (
          <span className="kk-announce__item" key={i} aria-hidden={i >= MESSAGES.length}>
            <span className="kk-announce__star">⚔</span>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
