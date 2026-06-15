
import React from 'react';
import './Logo.css';

export function Logo() {
  return (
    <span className="kk-logo">
      <span className="kk-logo__mark" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" role="presentation">
          <path d="M4 28 L4 4 L9 4 L9 14 L18 4 L25 4 L14 16 L26 28 L18 28 L9 18 L9 28 Z" fill="currentColor"/>
        </svg>
      </span>
      <span className="kk-logo__text">
        KING<span className="kk-logo__accent">KILLERS</span>
      </span>
    </span>
  );
}
