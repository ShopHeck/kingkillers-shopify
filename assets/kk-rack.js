/*
 * KK Garment Rack — progressive enhancement for sections/kk-garment-rack.liquid.
 * Without JS every garment is a plain product link; this adds the swing-to-front
 * hover state, the name label and the <dialog> focus view (arrows, keys, swipe).
 * Quick-add forms in the focus view are submitted by kk.js ([data-quick-add]);
 * on success we close the dialog so the cart drawer is visible.
 */
(function () {
  'use strict';

  function init(rack) {
    if (rack.dataset.rackReady) return;
    rack.dataset.rackReady = '1';

    var items = [].slice.call(rack.querySelectorAll('.kk-rack__item'));
    var label = rack.querySelector('[data-rack-label]');
    var hint = label ? label.textContent : '';
    var dialog = rack.querySelector('[data-rack-dialog]');
    var slides = dialog ? [].slice.call(dialog.querySelectorAll('[data-rack-slide]')) : [];
    var live = dialog && dialog.querySelector('[data-rack-live]');
    var current = -1;
    var opener = null;
    var initialItem = items[parseInt(rack.getAttribute('data-rack-initial'), 10)] || null;

    function activate(item) {
      items.forEach(function (el) { el.classList.toggle('is-active', el === item); });
      if (!label) return;
      var g = item && item.querySelector('[data-rack-name]');
      label.textContent = g ? g.getAttribute('data-rack-name') : hint;
      label.classList.toggle('is-idle', !g);
    }

    items.forEach(function (item) {
      item.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') activate(item); });
      item.addEventListener('focusin', function () { activate(item); });
    });
    var list = rack.querySelector('.kk-rack__list');
    if (list) {
      // Leaving the rail returns to the merchant's "facing front on load" garment, if any.
      list.addEventListener('pointerleave', function () { activate(initialItem); });
      list.addEventListener('focusout', function (e) { if (!list.contains(e.relatedTarget)) activate(initialItem); });
    }
    if (initialItem) activate(initialItem);

    // Older browsers without <dialog>: leave the product links alone.
    if (!dialog || typeof dialog.showModal !== 'function' || !slides.length) return;

    function warm(i) {
      var s = slides[(i + slides.length) % slides.length];
      var img = s && s.querySelector('img[loading="lazy"]');
      if (img) img.loading = 'eager';
    }

    function show(i, dir) {
      i = (i + slides.length) % slides.length;
      // Hiding a slide that holds focus would drop focus out of the dialog and
      // strand arrow-key navigation; hand it to the incoming slide instead.
      var active = document.activeElement;
      var refocus = active && active.closest && active.closest('[data-rack-slide]');
      slides.forEach(function (s, n) {
        s.hidden = n !== i;
        if (n === i) s.setAttribute('data-dir', dir || 1);
        var d = s.querySelector('details');
        if (d && n !== i) d.open = false;
      });
      current = i;
      if (refocus && refocus !== slides[i]) {
        var target = slides[i].querySelector('.kk-rack__name a');
        if (target) target.focus({ preventScroll: true });
      }
      warm(i + 1); warm(i - 1);
      if (live) live.textContent = slides[i].getAttribute('aria-label') + ' — ' + (slides[i].querySelector('.kk-rack__name') || {}).textContent;
    }

    function open(i) {
      opener = document.activeElement;
      show(i, 1);
      document.documentElement.classList.add('kk-rack-locked');
      dialog.showModal();
    }

    function close() { if (dialog.open) dialog.close(); }

    dialog.addEventListener('close', function () {
      document.documentElement.classList.remove('kk-rack-locked');
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    });

    rack.addEventListener('click', function (e) {
      var g = e.target.closest('[data-rack-open]');
      if (!g || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
      e.preventDefault();
      open(parseInt(g.getAttribute('data-rack-open'), 10) || 0);
    });

    dialog.addEventListener('click', function (e) {
      var step = e.target.closest('[data-rack-step]');
      if (step) { var s = parseInt(step.getAttribute('data-rack-step'), 10); show(current + s, s); return; }
      if (e.target.closest('[data-rack-close]')) { close(); return; }
      // Clicking empty space around the garment dismisses, like the backdrop.
      if (e.target === dialog || e.target.classList.contains('kk-rack__stage') || e.target.classList.contains('kk-rack__slides')) close();
    });

    dialog.addEventListener('keydown', function (e) {
      // Arrow keys move between sizes inside a radio group; leave them alone there.
      if (e.target.type === 'radio') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1, 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1, -1); }
    });

    [].forEach.call(dialog.querySelectorAll('[data-rack-buy]'), function (form) {
      form.addEventListener('kk:cart-settled', function () {
        var error = form.querySelector('[data-cart-error]');
        if (error && !error.hidden) return;
        // Added: hand focus to the cart drawer kk.js just opened, not back to the rack.
        opener = null;
        close();
      });
    });

    var startX = null, startY = 0;
    dialog.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { startX = e.clientX; startY = e.clientY; } });
    dialog.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { var s = dx < 0 ? 1 : -1; show(current + s, s); }
    });
    dialog.addEventListener('pointercancel', function () { startX = null; });
  }

  function boot(scope) { [].forEach.call((scope || document).querySelectorAll('[data-kk-rack]'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); });
  else boot();
  // Theme editor: re-init when the merchant adds or edits the section.
  document.addEventListener('shopify:section:load', function (e) { boot(e.target); });
})();
