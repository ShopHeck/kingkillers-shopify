
/*
 * King Killers — minimal, dependency-free theme JS. Deferred at end of <body>.
 * Handles: AJAX add-to-cart, cart drawer + free-shipping bar, mobile nav,
 * sticky-header state, and scroll reveals. INP/CLS-conscious (delegation + rAF).
 */
(function () {
  'use strict';
  var d = document;
  var strings = window.kkStrings || {};
  var root = window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/';
  // cents. A 0 threshold is a real setting (free shipping on everything), not an
  // absent one, so don't let `||` fall back to 10000 and invent a $100 goal.
  var THRESHOLD = typeof window.kkFreeShipThreshold === 'number' && isFinite(window.kkFreeShipThreshold)
    ? window.kkFreeShipThreshold
    : 10000;

  /* ---------- Money formatting (matches Shopify default; no library) ---------- */
  function money(cents) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: window.kkCurrency || 'USD' }).format(cents / 100);
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

    var shipBlock = drawer.querySelector('.kk-drawer__ship');
    if (THRESHOLD <= 0 || window.kkCurrency !== window.kkShopCurrency) {
      // Nothing to progress towards — match the cart page, which omits the bar.
      if (shipBlock) shipBlock.hidden = true;
    } else {
      if (shipBlock) shipBlock.hidden = false;
      var pct = Math.min(100, Math.round((cart.total_price / THRESHOLD) * 100));
      var bar = drawer.querySelector('[data-ship-bar]');
      var msg = drawer.querySelector('[data-ship-msg]');
      if (bar) bar.style.width = pct + '%';
      if (msg) {
        var remaining = THRESHOLD - cart.total_price;
        msg.textContent = remaining > 0
          ? 'You\u2019re ' + money(remaining) + ' away from the free-shipping threshold. Eligibility is confirmed at checkout.'
          : 'Free-shipping threshold reached. Eligibility is confirmed at checkout.';
      }
    }

    var body = drawer.querySelector('[data-drawer-body]');
    if (body) {
      if (!cart.items.length) {
        body.innerHTML = '<p class="kk-drawer__empty">Your cart is empty.</p>';
      } else {
        body.innerHTML = cart.items.map(function (it) {
          var variantText = it.variant_title ? '<span class="kk-drawer__variant">' + esc(it.variant_title) + '</span>' : '';
          return '<div class="kk-drawer__item" data-key="' + esc(it.key) + '">' +
            (it.image ? '<img src="' + esc(it.image) + '" width="60" height="60" alt="" loading="lazy">' : '') +
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
        var recommendationKey = cart.items.map(function (item) { return item.product_id; }).sort().join(',');
        if (upsellEl.getAttribute('data-product-id') !== recommendationKey) {
          upsellEl.setAttribute('data-product-id', recommendationKey);
          fetch(root + 'recommendations/products.json?product_id=' + firstProductId + '&limit=3')
            .then(function (res) { return res.json(); })
            .then(function (data) {
              if (upsellEl.getAttribute('data-product-id') !== recommendationKey) return;
              var products = data.products || [];
              var cartProductIds = cart.items.map(function (it) { return it.product_id; });
              products = products.filter(function (p) {
                return p.available && cartProductIds.indexOf(p.id) === -1 && p.variants && p.variants.length > 0;
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
                      '<a class="kk-btn kk-btn--ghost kk-drawer__upsell-add" href="' + esc(p.url) + '">' + esc(strings.choose || 'Choose options') + '</a>' +
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
    return fetch(root + 'cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(renderCart);
  }

  /* ------------------------- AJAX add-to-cart -------------------------------- */
  d.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-quick-add], .kk-pdp__form');
    if (!form) return;
    e.preventDefault();
    if (form.dataset.pending === 'true' || !form.reportValidity()) return;
    var btn = form.querySelector('button[type="submit"]');
    if (btn && btn.disabled) return;
    var label = btn ? btn.textContent : '';
    var error = form.querySelector('[data-cart-error]');
    if (error) { error.hidden = true; error.textContent = ''; }
    form.dataset.pending = 'true';
    form.setAttribute('aria-busy', 'true');
    if (btn) { btn.disabled = true; btn.textContent = strings.adding || 'Adding…'; }
    var added = false;
    fetch(root + 'cart/add.js', {
      method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form)
    })
      .then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) throw new Error(data.description || strings.addError);
          added = true;
        });
      })
      .then(fetchCart)
      .then(function () { openDrawer(); })
      .catch(function (err) {
        // The add succeeded: do not invite a second add when the drawer refresh fails.
        if (added) { window.location.assign(root + 'cart'); return; }
        if (error) { error.textContent = err.message || strings.addError; error.hidden = false; }
      })
      .finally(function () {
        delete form.dataset.pending;
        form.removeAttribute('aria-busy');
        if (btn) { btn.disabled = false; btn.textContent = label; }
        form.dispatchEvent(new CustomEvent('kk:cart-settled'));
      });
  });

  function updateCartItem(key, qty) {
    if (updatingItems[key]) return;
    updatingItems[key] = true;
    var error = drawer && drawer.querySelector('[data-drawer-error]');
    if (error) error.hidden = true;
    if (drawer) {
      var panel = drawer.querySelector('.kk-drawer__panel');
      var item = null;
      drawer.querySelectorAll('[data-key]').forEach(function (el) { if (el.getAttribute('data-key') === key) item = el; });
      if (panel) panel.style.opacity = '0.6';
      if (item) item.querySelectorAll('button').forEach(function (btn) { btn.disabled = true; });
    }
    fetch(root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ id: key, quantity: qty })
    })
      .then(function (r) { if (!r.ok) throw new Error('update failed'); return r.json(); })
      .then(renderCart)
      .catch(function () {
        var error = drawer && drawer.querySelector('[data-drawer-error]');
        if (error) { error.hidden = false; error.textContent = strings.addError || 'Unable to update cart.'; }
      })
      .finally(function () {
        if (drawer) {
          var panel = drawer.querySelector('.kk-drawer__panel');
          if (panel) panel.style.opacity = '';
          drawer.querySelectorAll('[data-key]').forEach(function (item) {
            if (item.getAttribute('data-key') === key) item.querySelectorAll('button').forEach(function (button) { button.disabled = false; });
          });
        }
        delete updatingItems[key];
      });
  }

  /* ----------------------------- Click handlers ------------------------------ */
  d.addEventListener('click', function (e) {
    var fitLink = e.target.closest('a[href="#size-help"], a[href="#kk-size-chart"]');
    if (fitLink) { var detail = d.querySelector(fitLink.getAttribute('href')); if (detail) detail.open = true; }

    // "Notify me when back" toggle on sold-out product cards. This used to be an
    // inline <script> duplicated into every card in the grid.
    var notifyBtn = e.target.closest('[data-notify-toggle]');
    if (notifyBtn) {
      var wrap = notifyBtn.closest('[data-notify]');
      var notifyForm = wrap && wrap.querySelector('.kk-notify__form');
      if (notifyForm) {
        notifyForm.hidden = !notifyForm.hidden;
        if (!notifyForm.hidden) {
          var emailInput = notifyForm.querySelector('input[type=email]');
          if (emailInput) emailInput.focus();
        }
      }
    }

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
    var quantity = pdp.querySelector('[data-pdp-quantity-input]');
    var quantityButtons = pdp.querySelectorAll('[data-pdp-quantity-change]');
    var thumbs = pdp.querySelectorAll('.kk-pdp__thumb-btn');
    var pills = pdp.querySelectorAll('[data-pdp-pill]');
    var sizeLabel = pdp.querySelector('[data-pdp-size-label]');

    function selectedOption() {
      if (!variant) return null;
      if (variant.options) return variant.options[variant.selectedIndex];
      return variant;
    }

    function normaliseQuantity() {
      if (!quantity) return;
      var min = parseInt(quantity.getAttribute('min'), 10) || 1;
      var max = parseInt(quantity.getAttribute('max'), 10);
      var value = parseInt(quantity.value, 10);
      if (!Number.isFinite(value)) value = min;
      value = Math.max(min, value);
      if (Number.isFinite(max)) value = Math.min(max, value);
      quantity.value = value;
      quantityButtons.forEach(function (btn) {
        var change = parseInt(btn.getAttribute('data-pdp-quantity-change'), 10);
        btn.disabled = change < 0 ? value <= min : Number.isFinite(max) && value >= max;
      });
    }

    function syncVariantState() {
      if (!variant || !price) return;
      var selected = selectedOption();
      if (!selected) return;
      var priceText = selected.getAttribute('data-price') || (stickyPrice && stickyPrice.textContent) || '';
      var compareText = selected.getAttribute('data-compare') || '';
      var available = selected.getAttribute('data-available') !== 'false';
      var selectedId = selected.value || selected.getAttribute('value') || '';
      var quantityMax = parseInt(selected.getAttribute('data-quantity-max'), 10);
      var stock = pdp.querySelector('[data-pdp-stock]');
      if (stock) {
        stock.hidden = !available || !Number.isFinite(quantityMax) || quantityMax <= 0 || quantityMax > Number(stock.dataset.stockThreshold);
        stock.textContent = (strings.remaining || 'Only __count__ left in stock.').replace('__count__', quantityMax);
      }
      price.innerHTML = '<span>' + esc(priceText) + '</span>' + (compareText ? '<s>' + esc(compareText) + '</s>' : '');
      if (stickyPrice) stickyPrice.textContent = priceText;
      if (quantity) {
        if (Number.isFinite(quantityMax) && quantityMax > 0) quantity.setAttribute('max', quantityMax);
        else quantity.removeAttribute('max');
        normaliseQuantity();
      }
      [submit, stickySubmit].forEach(function (btn) {
        if (!btn) return;
        btn.disabled = !available || (submit && submit.form.dataset.pending === 'true');
        btn.textContent = available ? (strings.add || 'Add to Cart') : (strings.soldOut || 'Sold Out');
      });

      pills.forEach(function (pill) {
        var isSel = pill.getAttribute('data-variant-id') === selectedId;
        pill.classList.toggle('is-selected', isSel);
        pill.setAttribute('aria-pressed', String(isSel));
      });
      if (sizeLabel) {
        var title = '';
        pills.forEach(function (pill) {
          if (pill.getAttribute('data-variant-id') === selectedId) title = pill.getAttribute('data-title') || pill.textContent.trim();
        });
        if (!title && selected.textContent) title = selected.textContent.split('–')[0].trim();
        if (title) sizeLabel.textContent = title;
        var stickyVariant = pdp.querySelector('[data-pdp-sticky-variant]');
        if (stickyVariant) stickyVariant.textContent = title;
      }

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
        thumbs.forEach(function (b) {
          var isMatch = b.getAttribute('data-large-src') === varImg;
          b.classList.toggle('is-active', isMatch);
        });
      }
    }

    function selectVariantId(id) {
      if (!variant || !variant.options) return;
      for (var i = 0; i < variant.options.length; i++) {
        if (String(variant.options[i].value) === String(id)) {
          variant.selectedIndex = i;
          break;
        }
      }
      syncVariantState();
      var url = new URL(window.location.href);
      url.searchParams.set('variant', variant.value);
      window.history.replaceState({}, '', url);
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        if (pill.disabled) return;
        selectVariantId(pill.getAttribute('data-variant-id'));
      });
    });

    if (variant && variant.tagName === 'SELECT') {
      variant.setAttribute('tabindex', '-1');
      variant.setAttribute('aria-hidden', 'true');
      variant.addEventListener('change', function () { selectVariantId(variant.value); });
    }
    if (submit && submit.form) submit.form.addEventListener('kk:cart-settled', syncVariantState);
    if (quantity) {
      quantity.addEventListener('change', normaliseQuantity);
      quantity.addEventListener('blur', normaliseQuantity);
      if (quantity.form) quantity.form.addEventListener('submit', normaliseQuantity);
    }
    quantityButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        normaliseQuantity();
        var change = parseInt(btn.getAttribute('data-pdp-quantity-change'), 10);
        var nextValue = parseInt(quantity.value, 10) + change;
        var max = parseInt(quantity.getAttribute('max'), 10);
        quantity.value = Number.isFinite(max) ? Math.min(nextValue, max) : nextValue;
        normaliseQuantity();
        quantity.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
    if (stickySubmit) stickySubmit.addEventListener('click', function () { if (submit) submit.click(); });
    var stickyBar = pdp.querySelector('[data-pdp-sticky]');
    if (stickyBar && submit && 'IntersectionObserver' in window) {
      var purchaseObserver = new IntersectionObserver(function (entries) {
        stickyBar.hidden = entries[0].boundingClientRect.bottom > 0;
      });
      purchaseObserver.observe(submit);
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

  // Load recommendations near the viewport; a failed/empty response leaves the curated row intact.
  d.querySelectorAll('[data-recommendations-url]').forEach(function (section) {
    function loadRecommendations() {
      fetch(section.getAttribute('data-recommendations-url'))
        .then(function (response) { if (!response.ok) throw new Error('Recommendations unavailable'); return response.text(); })
        .then(function (html) {
          var parsed = new DOMParser().parseFromString(html, 'text/html');
          var grid = parsed.querySelector('.kk-best__grid');
          var current = section.querySelector('.kk-best__grid');
          if (grid && current && grid.querySelector('[data-product-id]')) current.replaceWith(grid);
        }).catch(function () {});
    }
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) { observer.disconnect(); loadRecommendations(); }
      }, { rootMargin: '200px' });
      observer.observe(section);
    } else loadRecommendations();
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
    d.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('kk-reveal'); io.observe(el);
    });
  }

  /* ------------------------------ Mega menu ---------------------------------- */
  /* CSS reveals panels on hover for pointer devices; JS drives the explicit
     (pinned) open state for touch + keyboard and keeps aria-expanded honest. */
  var megaItems = Array.prototype.slice.call(d.querySelectorAll('.kk-nav__item--has'));

  function closeMega(item) {
    if (!item) return;
    item.classList.remove('is-open');
    var t = item.querySelector('[data-mega-toggle]');
    if (t) t.setAttribute('aria-expanded', 'false');
  }
  function closeAllMega(except) {
    megaItems.forEach(function (it) { if (it !== except) closeMega(it); });
  }

  megaItems.forEach(function (item) {
    var toggle = item.querySelector('[data-mega-toggle]');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains('is-open');
      closeAllMega(item);
      item.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) closeSearch();
    });
    // Keyboard: close when focus leaves the item entirely.
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) closeMega(item);
    });
  });

  /* --------------------------- Mobile nav accordion -------------------------- */
  d.querySelectorAll('[data-msub-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('aria-controls');
      var sub = id && d.getElementById(id);
      if (!sub) return;
      var willOpen = sub.hasAttribute('hidden');
      if (willOpen) { sub.removeAttribute('hidden'); } else { sub.setAttribute('hidden', ''); }
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });

  /* ---------------------------- Predictive search ---------------------------- */
  var searchToggle = d.querySelector('[data-search-toggle]');
  var searchPanel = d.querySelector('[data-search-panel]');
  var searchInput = searchPanel && searchPanel.querySelector('[data-search-input]');
  var searchResults = searchPanel && searchPanel.querySelector('[data-search-results]');
  var searchTimer = null;
  var searchController = null;
  var lastQuery = '';

  function openSearch() {
    if (!searchPanel) return;
    closeAllMega(null);
    searchPanel.removeAttribute('hidden');
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'true');
    if (searchInput) searchInput.focus();
  }
  function closeSearch() {
    if (!searchPanel || searchPanel.hasAttribute('hidden')) return;
    searchPanel.setAttribute('hidden', '');
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function () {
      if (searchPanel.hasAttribute('hidden')) { openSearch(); } else { closeSearch(); }
    });
    searchPanel.addEventListener('click', function (e) {
      if (e.target.closest('[data-search-close]')) closeSearch();
    });
  }

  function runPredictive(q) {
    if (!searchResults) return;
    if (searchController) searchController.abort();
    searchController = ('AbortController' in window) ? new AbortController() : null;
    var url = '/search/suggest?q=' + encodeURIComponent(q) +
      '&section_id=predictive-search&resources[type]=product,collection&resources[limit]=8';
    fetch(url, searchController ? { signal: searchController.signal } : undefined)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var inner = doc.querySelector('#shopify-section-predictive-search') || doc.querySelector('.shopify-section') || doc.body;
        searchResults.innerHTML = inner ? inner.innerHTML : '';
      })
      .catch(function (err) { if (err && err.name !== 'AbortError') searchResults.innerHTML = ''; });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim();
      clearTimeout(searchTimer);
      if (q.length < 2) { searchResults.innerHTML = ''; lastQuery = ''; return; }
      if (q === lastQuery) return;
      searchTimer = setTimeout(function () { lastQuery = q; runPredictive(q); }, 220);
    });
  }

  /* ------------------------------- FAQ search ------------------------------- */
  d.querySelectorAll('[data-faq-hub]').forEach(function (hub) {
    var input = hub.querySelector('[data-faq-search]');
    var items = Array.prototype.slice.call(hub.querySelectorAll('[data-faq-item]'));
    var groups = Array.prototype.slice.call(hub.querySelectorAll('[data-faq-group]'));
    var empty = hub.querySelector('[data-faq-empty]');
    var status = hub.querySelector('[data-faq-status]');
    if (!input || !items.length) return;

    input.addEventListener('input', function () {
      var query = input.value.trim().toLocaleLowerCase();
      var visible = 0;

      items.forEach(function (item) {
        var searchable = item.textContent + ' ' + (item.getAttribute('data-faq-keywords') || '');
        var match = !query || searchable.toLocaleLowerCase().indexOf(query) !== -1;
        item.hidden = !match;
        if (match) {
          visible += 1;
          if (query.length >= 2) item.open = true;
        }
      });

      groups.forEach(function (group) {
        group.hidden = !group.querySelector('[data-faq-item]:not([hidden])');
      });

      if (empty) empty.hidden = visible !== 0;
      if (status) {
        status.textContent = query
          ? visible + (visible === 1 ? ' answer found.' : ' answers found.')
          : '';
      }
    });
  });

  /* --------- Shared close-on-outside-click / Escape for menu + search -------- */
  d.addEventListener('click', function (e) {
    if (!e.target.closest('.kk-nav__item--has')) closeAllMega(null);
    if (searchPanel && !searchPanel.hasAttribute('hidden') &&
        !e.target.closest('[data-search-panel]') && !e.target.closest('[data-search-toggle]')) {
      closeSearch();
    }
  });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (searchPanel && !searchPanel.hasAttribute('hidden')) { closeSearch(); if (searchToggle) searchToggle.focus(); }
    var openItem = d.querySelector('.kk-nav__item--has.is-open');
    if (openItem) { var t = openItem.querySelector('[data-mega-toggle]'); closeMega(openItem); if (t) t.focus(); }
  });

  /* --------------------------- Newsletter popup ------------------------------ */
  var np = d.querySelector('[data-np]');
  if (np) {
    var NP_KEY = 'kk_np_seen';
    var NP_SUBMIT = 'kk_np_submitting';
    var npOpener = null;
    var npDelay = (parseInt(np.getAttribute('data-delay'), 10) || 0) * 1000;
    var npFreq = parseInt(np.getAttribute('data-frequency'), 10) || 14;
    var npSubscribed = !!np.querySelector('[data-np-success]');

    function npStore(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
    function npSuppress(days) { npStore(NP_KEY, String(Date.now() + days * 864e5)); }
    function npSuppressed() {
      try { var v = localStorage.getItem(NP_KEY); return v && Date.now() < parseInt(v, 10); }
      catch (e) { return false; }
    }
    function npOpen() {
      npOpener = d.activeElement;
      np.removeAttribute('hidden');
      np.getBoundingClientRect(); // reflow so the transition plays
      np.classList.add('is-open');
      d.body.style.overflow = 'hidden';
      // Prefer the email field (so users can type immediately); in the success
      // state that field is gone, so fall back to the primary button.
      var focusable = np.querySelector('.kk-np__input, .kk-btn') || np.querySelector('button');
      if (focusable) focusable.focus();
    }
    function npClose() {
      if (!np.classList.contains('is-open')) return;
      np.classList.remove('is-open');
      d.body.style.overflow = '';
      npSuppress(npFreq);
      setTimeout(function () { np.setAttribute('hidden', ''); }, 280);
      if (npOpener && npOpener.focus) npOpener.focus();
    }

    np.addEventListener('click', function (e) {
      if (e.target.closest('[data-np-close]')) { e.preventDefault(); npClose(); }
    });
    d.addEventListener('keydown', function (e) {
      if (!np.classList.contains('is-open')) return;
      if (e.key === 'Escape') { npClose(); return; }
      if (e.key === 'Tab') {
        var f = np.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Flag the popup as the submit source so we can reveal success after the native reload.
    var npForm = np.querySelector('form');
    if (npForm) npForm.addEventListener('submit', function () {
      try { sessionStorage.setItem(NP_SUBMIT, '1'); } catch (e) {}
    });

    if (npSubscribed) {
      // A newsletter form on the page posted successfully this request — don't nag them again.
      npSuppress(365);
      var fromPopup = false;
      try { fromPopup = sessionStorage.getItem(NP_SUBMIT) === '1'; sessionStorage.removeItem(NP_SUBMIT); } catch (e) {}
      if (fromPopup) npOpen(); // reveal the success state / code only if THEY used the popup
    } else if (!npSuppressed()) {
      if (npDelay > 0) { setTimeout(npOpen, npDelay); } else { npOpen(); }
    }
  }
})();
