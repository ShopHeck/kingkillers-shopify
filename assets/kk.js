
/*
 * King Killers — minimal, dependency-free theme JS. Deferred at end of <body>.
 * Handles: AJAX add-to-cart, cart drawer + free-shipping bar, mobile nav,
 * sticky-header state, and scroll reveals. INP/CLS-conscious (delegation + rAF).
 */
(function () {
  'use strict';
  var d = document;
  var THRESHOLD = window.kkFreeShipThreshold || 10000; // cents

  /* ---------- Money formatting (matches Shopify default; no library) ---------- */
  function money(cents) {
    return '$' + (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* ---------------------------- Cart drawer ---------------------------------- */
  var drawer = d.getElementById('CartDrawer');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    d.body.style.overflow = 'hidden';
    var panel = drawer.querySelector('.kk-drawer__panel');
    if (panel) panel.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    d.body.style.overflow = '';
  }

  function renderCart(cart) {
    if (!drawer) return;
    d.querySelectorAll('[data-cart-count]').forEach(function (n) { n.textContent = cart.item_count; });

    var pct = Math.min(100, Math.round((cart.total_price / THRESHOLD) * 100));
    var bar = drawer.querySelector('[data-ship-bar]');
    var msg = drawer.querySelector('[data-ship-msg]');
    if (bar) bar.style.width = pct + '%';
    if (msg) {
      var remaining = THRESHOLD - cart.total_price;
      msg.textContent = remaining > 0
        ? 'You\u2019re ' + money(remaining) + ' away from FREE shipping.'
        : '\uD83C\uDF89 You\u2019ve unlocked FREE shipping!';
    }

    var body = drawer.querySelector('[data-drawer-body]');
    if (body) {
      if (!cart.items.length) {
        body.innerHTML = '<p class="kk-drawer__empty">Your cart is empty.</p>';
      } else {
        body.innerHTML = cart.items.map(function (it) {
          return '<div class="kk-drawer__item">' +
            (it.image ? '<img src="' + it.image.replace(/(\.[^.]+)$/, '_120x$1') + '" width="60" height="60" alt="" loading="lazy">' : '') +
            '<div><span class="kk-drawer__name">' + it.product_title + '</span>' +
            '<span class="kk-drawer__meta">Qty ' + it.quantity + ' · ' + money(it.final_line_price) + '</span></div>' +
          '</div>';
        }).join('');
      }
    }
    var total = drawer.querySelector('[data-drawer-total]');
    if (total) total.textContent = money(cart.total_price);
  }

  function fetchCart() {
    return fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(renderCart);
  }

  /* ------------------------- AJAX add-to-cart -------------------------------- */
  d.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-quick-add], .kk-pdp__form');
    if (!form) return;
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Adding…'; }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { if (!r.ok) throw new Error('add failed'); return r.json(); })
      .then(function () { return fetchCart(); })
      .then(function () { openDrawer(); if (btn) btn.textContent = 'Added ✓'; })
      .catch(function () { if (btn) btn.textContent = 'Try Again'; })
      .finally(function () {
        setTimeout(function () { if (btn) { btn.disabled = false; btn.textContent = label; } }, 1300);
      });
  });

  /* ----------------------------- Click handlers ------------------------------ */
  d.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-toggle]')) { e.preventDefault(); openDrawer(); fetchCart(); }
    if (e.target.closest('[data-drawer-close]')) { closeDrawer(); }
    var navBtn = e.target.closest('[data-nav-toggle]');
    if (navBtn) {
      var nav = d.querySelector('[data-mobile-nav]');
      if (nav) {
        var isOpen = !nav.hasAttribute('hidden');
        if (isOpen) { nav.setAttribute('hidden', ''); } else { nav.removeAttribute('hidden'); }
        navBtn.setAttribute('aria-expanded', String(!isOpen));
      }
    }
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* --------------------------- Sticky header --------------------------------- */
  var header = d.querySelector('[data-header]');
  if (header) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          header.classList.toggle('is-scrolled', window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------------------------- Scroll reveals ------------------------------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.kk-section, .kk-pc').forEach(function (el) {
      el.classList.add('kk-reveal'); io.observe(el);
    });
  }
})();
