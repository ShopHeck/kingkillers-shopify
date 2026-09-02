
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
  var drawerOpener = null;
  var updatingItems = {};

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function openDrawer() {
    if (!drawer) return;
    drawerOpener = d.activeElement;
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
    if (drawerOpener && drawerOpener.focus) drawerOpener.focus();
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
          var variantText = it.variant_title ? '<span class="kk-drawer__variant">' + esc(it.variant_title) + '</span>' : '';
          return '<div class="kk-drawer__item" data-key="' + esc(it.key) + '">' +
            (it.image ? '<img src="' + esc(it.image.replace(/(\.[^.]+)$/, '_120x$1')) + '" width="60" height="60" alt="" loading="lazy">' : '') +
            '<div class="kk-drawer__item-info">' +
              '<span class="kk-drawer__name">' + esc(it.product_title) + '</span>' +
              variantText +
              '<span class="kk-drawer__price">' + money(it.final_line_price) + '</span>' +
              '<div class="kk-drawer__qtyrow">' +
                '<div class="kk-drawer__qtybox">' +
                  '<button class="kk-drawer__qtybtn" data-qty-change="-1" aria-label="Decrease quantity">&minus;</button>' +
                  '<span class="kk-drawer__qtyval">' + it.quantity + '</span>' +
                  '<button class="kk-drawer__qtybtn" data-qty-change="1" aria-label="Increase quantity">&plus;</button>' +
                '</div>' +
                '<button class="kk-drawer__remove" data-remove-item aria-label="Remove item">Remove</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }
    var total = drawer.querySelector('[data-drawer-total]');
    if (total) total.textContent = money(cart.total_price);

    var upsellEl = drawer.querySelector('[data-drawer-upsell]');
    if (upsellEl) {
      if (!cart.items.length) {
        upsellEl.innerHTML = '';
        upsellEl.removeAttribute('data-product-id');
      } else {
        var firstProductId = cart.items[0].product_id;
        if (upsellEl.getAttribute('data-product-id') !== String(firstProductId)) {
          upsellEl.setAttribute('data-product-id', firstProductId);
          fetch('/recommendations/products.json?product_id=' + firstProductId + '&limit=3')
            .then(function (res) { return res.json(); })
            .then(function (data) {
              var products = data.products || [];
              var cartProductIds = cart.items.map(function (it) { return it.product_id; });
              products = products.filter(function (p) {
                return cartProductIds.indexOf(p.id) === -1 && p.variants && p.variants.length > 0;
              }).slice(0, 2);

              if (!products.length) {
                upsellEl.innerHTML = '';
                return;
              }

              upsellEl.innerHTML = '<div class="kk-drawer__upsell-title">Complete the Kit</div>' +
                '<div class="kk-drawer__upsell-items">' +
                  products.map(function (p) {
                    var variant = p.variants[0];
                    var img = p.featured_image || '';
                    return '<div class="kk-drawer__upsell-item">' +
                      (img ? '<img src="' + esc(img) + '" width="40" height="40" alt="" loading="lazy">' : '') +
                      '<div class="kk-drawer__upsell-info">' +
                        '<span class="kk-drawer__upsell-name">' + esc(p.title) + '</span>' +
                        '<span class="kk-drawer__upsell-price">' + money(variant.price) + '</span>' +
                      '</div>' +
                      '<button class="kk-btn kk-btn--ghost kk-drawer__upsell-add" data-upsell-variant="' + variant.id + '" aria-label="Add ' + esc(p.title) + ' to cart">Add</button>' +
                    '</div>';
                  }).join('') +
                '</div>';
            })
            .catch(function (err) {
              console.error(err);
              upsellEl.innerHTML = '';
            });
        }
      }
    }
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

  function updateCartItem(key, qty) {
    if (updatingItems[key]) return;
    updatingItems[key] = true;
    if (drawer) {
      var panel = drawer.querySelector('.kk-drawer__panel');
      var item = null;
      drawer.querySelectorAll('[data-key]').forEach(function (el) { if (el.getAttribute('data-key') === key) item = el; });
      if (panel) panel.style.opacity = '0.6';
      if (item) item.querySelectorAll('button').forEach(function (btn) { btn.disabled = true; });
    }
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ id: key, quantity: qty })
    })
      .then(function (r) { if (!r.ok) throw new Error('update failed'); return r.json(); })
      .then(renderCart)
      .catch(function (err) { console.error(err); })
      .finally(function () {
        if (drawer) {
          var panel = drawer.querySelector('.kk-drawer__panel');
          if (panel) panel.style.opacity = '';
        }
        delete updatingItems[key];
      });
  }

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

    var qtyBtn = e.target.closest('[data-qty-change]');
    if (qtyBtn) {
      e.preventDefault();
      var itemEl = qtyBtn.closest('[data-key]');
      if (!itemEl) return;
      var key = itemEl.getAttribute('data-key');
      var change = parseInt(qtyBtn.getAttribute('data-qty-change'), 10);
      var qtyValEl = itemEl.querySelector('.kk-drawer__qtyval');
      if (!qtyValEl) return;
      var currentQty = parseInt(qtyValEl.textContent, 10);
      var newQty = currentQty + change;
      updateCartItem(key, newQty);
    }

    var removeBtn = e.target.closest('[data-remove-item]');
    if (removeBtn) {
      e.preventDefault();
      var itemEl = removeBtn.closest('[data-key]');
      if (!itemEl) return;
      var key = itemEl.getAttribute('data-key');
      updateCartItem(key, 0);
    }

    var upsellAdd = e.target.closest('[data-upsell-variant]');
    if (upsellAdd) {
      e.preventDefault();
      var variantId = upsellAdd.getAttribute('data-upsell-variant');
      upsellAdd.disabled = true;
      upsellAdd.textContent = '…';

      var formData = new FormData();
      formData.append('id', variantId);
      formData.append('quantity', 1);

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
        .then(function (r) { if (!r.ok) throw new Error('add failed'); return r.json(); })
        .then(function () { return fetchCart(); })
        .then(function () { openDrawer(); })
        .catch(function (err) { console.error(err); })
        .finally(function () {
          upsellAdd.disabled = false;
          upsellAdd.textContent = 'Add';
        });
    }
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab' && drawer && drawer.classList.contains('is-open')) {
      var focusables = drawer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });


  /* ------------------------------ PDP CRO ------------------------------------ */
  d.querySelectorAll('[data-pdp]').forEach(function (pdp) {
    var variant = pdp.querySelector('[data-pdp-variant]');
    var price = pdp.querySelector('[data-pdp-price]');
    var stickyPrice = pdp.querySelector('[data-pdp-sticky-price]');
    var submit = pdp.querySelector('[data-pdp-submit]');
    var stickySubmit = pdp.querySelector('[data-pdp-sticky-submit]');
    var thumbs = pdp.querySelectorAll('.kk-pdp__thumb-btn');

    function syncVariantState() {
      if (!variant || !price) return;
      var selected = variant.options ? variant.options[variant.selectedIndex] : variant;
      var priceText = selected.getAttribute('data-price') || stickyPrice && stickyPrice.textContent || '';
      var compareText = selected.getAttribute('data-compare') || '';
      var available = selected.getAttribute('data-available') !== 'false';
      price.innerHTML = '<span>' + esc(priceText) + '</span>' + (compareText ? '<s>' + esc(compareText) + '</s>' : '');
      if (stickyPrice) stickyPrice.textContent = priceText;
      [submit, stickySubmit].forEach(function (btn) {
        if (!btn) return;
        btn.disabled = !available;
        btn.textContent = available ? 'Add to Cart' : 'Sold Out';
      });

      // Switch image if variant has data-image
      var varImg = selected.getAttribute('data-image');
      var varSrcset = selected.getAttribute('data-srcset');
      if (varImg) {
        var mainImg = pdp.querySelector('.kk-pdp__gallery img.kk-pdp__img');
        if (mainImg) {
          mainImg.setAttribute('src', varImg);
          if (varSrcset) mainImg.setAttribute('srcset', varSrcset);
          else mainImg.removeAttribute('srcset');
        }
        // Highlight matching thumbnail
        thumbs.forEach(function (b) {
          var isMatch = b.getAttribute('data-large-src') === varImg;
          b.classList.toggle('is-active', isMatch);
        });
      }
    }

    if (variant) variant.addEventListener('change', syncVariantState);

    /* The sticky bar's CTA is a type="button" outside the product form, so it has to
       forward its click into the real submit. */
    if (stickySubmit) stickySubmit.addEventListener('click', function () { if (submit) submit.click(); });

    /* ---- Option-based variant picker -------------------------------------
       One pill row per product option. Resolves the selected combination to a
       variant, then copies that variant's data-* attributes onto
       [data-pdp-variant] so syncVariantState reads them exactly as it read a
       <select>'s selected <option>. */
    var picker = pdp.querySelector('[data-size-picker]');
    if (picker && variant) {
      var dataEl = picker.querySelector('[data-variant-data]');
      var variants = [];
      try { variants = JSON.parse(dataEl.textContent); } catch (err) { variants = []; }
      var groups = Array.prototype.slice.call(picker.querySelectorAll('[data-option-group]'));
      var oosNote = picker.querySelector('[data-oos-note]');

      if (variants.length && groups.length) {
        var selected = groups.map(function (g) {
          var active = g.querySelector('.kk-sizes__pill.is-active');
          return active ? active.getAttribute('data-option-value') : null;
        });

        function exactMatch(sel) {
          for (var i = 0; i < variants.length; i++) {
            var ok = true;
            for (var j = 0; j < sel.length; j++) {
              if (variants[i].options[j] !== sel[j]) { ok = false; break; }
            }
            if (ok) return variants[i];
          }
          return null;
        }

        /* Is there an available variant with `val` at position gi, consistent with
           the selections in every OTHER group? */
        function comboAvailable(gi, val) {
          return variants.some(function (vr) {
            if (!vr.available || vr.options[gi] !== val) return false;
            for (var j = 0; j < selected.length; j++) {
              if (j !== gi && selected[j] != null && vr.options[j] !== selected[j]) return false;
            }
            return true;
          });
        }

        function paint() {
          var unavailable = 0;
          groups.forEach(function (g, gi) {
            var current = g.querySelector('[data-option-current]');
            if (current) current.textContent = selected[gi] || '';
            g.querySelectorAll('[data-option-value]').forEach(function (pill) {
              var val = pill.getAttribute('data-option-value');
              var isSel = val === selected[gi];
              pill.classList.toggle('is-active', isSel);
              pill.setAttribute('aria-checked', isSel ? 'true' : 'false');

              var ok = comboAvailable(gi, val);
              if (!ok) unavailable++;
              pill.classList.toggle('is-out', !ok);
              /* aria-disabled, not disabled: on a multi-option product a shopper
                 must still be able to click through to another colour. */
              if (ok) pill.removeAttribute('aria-disabled');
              else pill.setAttribute('aria-disabled', 'true');

              var strike = pill.querySelector('.kk-sizes__oos');
              if (!ok && !strike) {
                strike = d.createElement('span');
                strike.className = 'kk-sizes__oos';
                strike.setAttribute('aria-hidden', 'true');
                pill.appendChild(strike);
              } else if (ok && strike) {
                strike.remove();
              }
            });
          });

          if (oosNote) {
            if (unavailable > 0) {
              oosNote.textContent = unavailable + ' option' + (unavailable > 1 ? 's are' : ' is') +
                ' sold out in this combination — crossed through above.';
              oosNote.hidden = false;
            } else {
              oosNote.hidden = true;
            }
          }
        }

        function apply() {
          var match = exactMatch(selected);
          if (match) {
            variant.value = match.id;
            variant.setAttribute('data-price', match.price);
            variant.setAttribute('data-compare', match.compare || '');
            variant.setAttribute('data-available', match.available ? 'true' : 'false');
            variant.setAttribute('data-image', match.image || '');
            variant.setAttribute('data-srcset', match.srcset || '');
            variant.dispatchEvent(new Event('change', { bubbles: true }));
          }
          paint();
        }

        picker.addEventListener('click', function (e) {
          var pill = e.target.closest('[data-option-value]');
          if (!pill || !picker.contains(pill)) return;
          var group = pill.closest('[data-option-group]');
          var gi = groups.indexOf(group);
          if (gi === -1) return;

          var val = pill.getAttribute('data-option-value');
          var next = selected.slice();
          next[gi] = val;

          /* If that exact combination does not exist, snap to a real variant that
             has the clicked value — preferring an available one — rather than
             leaving the picker pointing at nothing. */
          if (!exactMatch(next)) {
            var fallback = variants.filter(function (vr) { return vr.options[gi] === val; });
            var pick = fallback.filter(function (vr) { return vr.available; })[0] || fallback[0];
            if (pick) next = pick.options.slice(0, groups.length);
          }

          selected = next;
          apply();
        });

        /* Left/right arrows move within an option row, matching radiogroup expectations. */
        picker.addEventListener('keydown', function (e) {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          var group = d.activeElement && d.activeElement.closest('[data-option-group]');
          if (!group || !picker.contains(group)) return;
          var pills = Array.prototype.slice.call(group.querySelectorAll('[data-option-value]'));
          var idx = pills.indexOf(d.activeElement);
          if (idx === -1) return;
          e.preventDefault();
          var n = e.key === 'ArrowRight' ? (idx + 1) % pills.length : (idx - 1 + pills.length) % pills.length;
          pills[n].focus();
          pills[n].click();
        });

        paint();
      }
    }

    /* "Size chart" trigger. Hidden in Liquid and revealed only when a chart is
       actually on the page — products still on the default product template have no
       kk-fit-fabric section, and a visible button that does nothing is worse than
       no button. */
    var chartEl = d.querySelector('[data-size-chart]');
    var chartBtn = pdp.querySelector('[data-open-size-chart]');
    if (chartBtn && chartEl) {
      chartBtn.hidden = false;
      chartBtn.addEventListener('click', function () {
        chartEl.open = true;
        chartEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var summary = chartEl.querySelector('summary');
        if (summary) summary.focus();
      });
    }

    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        thumbs.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var mainImg = pdp.querySelector('.kk-pdp__gallery img.kk-pdp__img');
        var largeSrc = btn.getAttribute('data-large-src');
        var largeSrcset = btn.getAttribute('data-large-srcset');
        if (mainImg && largeSrc) {
          mainImg.setAttribute('src', largeSrc);
          if (largeSrcset) mainImg.setAttribute('srcset', largeSrcset);
          else mainImg.removeAttribute('srcset');
        }
      });
    });

    syncVariantState();
  });

  /* -------------------------- Collection Filters ----------------------------- */
  d.querySelectorAll('.kk-plp__tools').forEach(function (form) {
    form.querySelectorAll('input[type="checkbox"], input[type="number"], select').forEach(function (el) {
      el.addEventListener('change', function () {
        form.submit();
      });
    });
  });

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
