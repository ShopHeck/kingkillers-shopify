
import { useEffect, useRef } from 'react';

/**
 * Adds an `is-in` class when the element scrolls into view.
 * Uses IntersectionObserver (no scroll-driven layout reads) to keep INP/CLS healthy.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}
