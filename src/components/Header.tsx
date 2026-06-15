
import React, { useEffect, useState } from 'react';
import './Header.css';
import { Logo } from './Logo';

const NAV = [
  { label: 'Shop', href: '#categories' },
  { label: 'Best Sellers', href: '#bestsellers' },
  { label: 'Our Story', href: '#story' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`kk-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="kk-header__inner kk-wrap">
        <a href="#main" className="kk-header__brand" aria-label="King Killers Apparel home">
          <Logo />
        </a>

        <nav className="kk-header__nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className="kk-header__link">{n.label}</a>
          ))}
        </nav>

        <div className="kk-header__actions">
          <a href="#bestsellers" className="kk-btn kk-btn--primary kk-header__cta">Shop Now</a>
          <button
            className="kk-header__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`kk-header__mobile ${open ? 'is-open' : ''}`} hidden={!open}>
        {NAV.map((n) => (
          <a key={n.label} href={n.href} className="kk-header__mlink" onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
        <a href="#bestsellers" className="kk-btn kk-btn--primary kk-btn--full" onClick={() => setOpen(false)}>
          Shop Best Sellers
        </a>
      </div>
    </header>
  );
}
