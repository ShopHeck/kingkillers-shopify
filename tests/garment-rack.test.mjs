import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { render, context, productFixture, root } from './theme-fixture.mjs';

const script = fs.readFileSync(root + '/assets/kk-rack.js', 'utf8');

// Shopify fills unset settings from schema defaults; mirror that so tests see what merchants get.
const schema = JSON.parse(fs.readFileSync(root + '/sections/kk-garment-rack.liquid', 'utf8').match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/)[1]);
export const defaults = Object.fromEntries(schema.settings.filter(x => x.id && 'default' in x).map(x => [x.id, x.default]));

function rackContext() {
  const tee = (id, title, type = 'T-Shirt') => ({ ...productFixture(), id, title, type, url: '/products/p' + id });
  const products = [tee(1, 'Remi Long Sleeve'), tee(2, 'Red Corner Beanie', 'Beanie'), tee(3, 'Crown Hoodie', 'Hoodie'), { ...tee(4, 'Gift Card', 'Gift Cards'), 'gift_card?': true }, tee(5, 'Walkout Tee')];
  products[2].metafields = { custom: { rack_image: { value: { src: 'https://kingkillers.co/cutout.png', width: 900, height: 1100, alt: '' } } } };
  const ctx = context();
  ctx.section = { id: 'rack', blocks: [], settings: { ...defaults, collection: { title: 'FW26', url: '/collections/fw26', products }, exclude_types: 'hat, beanie', hint: 'Hover the rack', purchase_mode: 'size_links', label_show_price: false, cta_label: 'Shop', marquee_text: 'A | B' } };
  return ctx;
}

async function rack() {
  const html = await render('sections/kk-garment-rack.liquid', rackContext());
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://kingkillers.co/' });
  const w = dom.window;
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.eval(script);
  return { d: w.document, w };
}

test('rack hangs apparel only, in collection order, as real product links', async () => {
  const { d } = await rack();
  const links = [...d.querySelectorAll('.kk-rack__garment')];
  assert.deepEqual(links.map(a => a.dataset.rackName), ['Remi Long Sleeve', 'Crown Hoodie', 'Walkout Tee']);
  assert.deepEqual(links.map(a => a.getAttribute('href')), ['/products/p1', '/products/p3', '/products/p5']);
  assert.equal(links[1].classList.contains('is-flat'), false, 'cut-out metafield disables multiply blend');
  assert.equal(links[0].classList.contains('is-flat'), true);
  assert.deepEqual([...d.querySelectorAll('.kk-rack__count')].map(p => p.textContent), ['01 / 03', '02 / 03', '03 / 03']);
});

test('availability links in-stock sizes and marks sold-out ones', async () => {
  const { d } = await rack();
  const slide = d.querySelector('[data-rack-slide]');
  assert.deepEqual([...slide.querySelectorAll('a.kk-rack__size')].map(a => a.textContent), ['M', 'L']);
  assert.match(slide.querySelector('.kk-rack__size.is-out').textContent, /XL.*Sold out/);
});

test('click opens focus view on the chosen garment; arrows wrap; close restores focus', async () => {
  const { d, w } = await rack();
  const dialog = d.querySelector('[data-rack-dialog]');
  const second = d.querySelectorAll('.kk-rack__garment')[1];
  second.focus();
  assert.equal(d.querySelector('[data-rack-label]').textContent, 'Crown Hoodie');
  const click = new w.MouseEvent('click', { bubbles: true, cancelable: true });
  second.dispatchEvent(click);
  assert.equal(click.defaultPrevented, true);
  assert.equal(dialog.open, true);
  const visible = () => [...d.querySelectorAll('[data-rack-slide]')].findIndex(s => !s.hidden);
  assert.equal(visible(), 1);
  d.querySelector('[data-rack-step="1"]').click();
  d.querySelector('[data-rack-step="1"]').click();
  assert.equal(visible(), 0, 'next wraps to first');
  dialog.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  assert.equal(visible(), 2, 'previous wraps to last');
  d.querySelector('[data-rack-close]').click();
  assert.equal(dialog.open, false);
  assert.equal(d.activeElement, second);
});

test('modified clicks keep native link behaviour', async () => {
  const { d, w } = await rack();
  const click = new w.MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true });
  d.querySelector('.kk-rack__garment').dispatchEvent(click);
  assert.equal(click.defaultPrevented, false);
  assert.equal(d.querySelector('[data-rack-dialog]').open, false);
});

test('arrow keys from a focused slide control keep focus inside the dialog', async () => {
  const { d, w } = await rack();
  const dialog = d.querySelector('[data-rack-dialog]');
  d.querySelector('.kk-rack__garment').dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const slides = [...d.querySelectorAll('[data-rack-slide]')];
  slides[0].querySelector('.kk-rack__name a').focus();
  d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(d.activeElement, slides[1].querySelector('.kk-rack__name a'));
  d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(slides[2].hidden, false, 'second arrow press still advances');
  assert.ok(dialog.contains(d.activeElement));
});

test('availability lists every variant', async () => {
  const ctx = rackContext();
  const p = ctx.section.settings.collection.products[0];
  p.variants = Array.from({ length: 24 }, (_, i) => ({ ...p.variants[0], id: String(500 + i), title: 'V' + i, url: '/v' + i }));
  const d = new JSDOM(await render('sections/kk-garment-rack.liquid', ctx)).window.document;
  assert.equal(d.querySelector('[data-rack-slide]').querySelectorAll('.kk-rack__size').length, 24);
});

test('a rack cut-out alone is enough to hang a product without a featured image', async () => {
  const ctx = rackContext();
  const p = ctx.section.settings.collection.products[0];
  p.featured_media = null;
  p.metafields = { custom: { rack_image: { value: { preview_image: { src: 'https://kingkillers.co/remi-cutout.png', width: 1200, height: 1500 } } } } };
  const d = new JSDOM(await render('sections/kk-garment-rack.liquid', ctx)).window.document;
  const first = d.querySelector('.kk-rack__garment');
  assert.equal(first.dataset.rackName, 'Remi Long Sleeve');
  assert.equal(first.classList.contains('is-flat'), false);
  assert.match(first.querySelector('img').src, /remi-cutout\.png/);
});

test('nothing hangable renders no section on the storefront, a prompt in the editor', async () => {
  const ctx = rackContext();
  ctx.section.settings.collection.products.forEach(p => { p.featured_media = null; p.metafields = { custom: {} }; });
  let d = new JSDOM(await render('sections/kk-garment-rack.liquid', ctx)).window.document;
  assert.equal(d.querySelector('[data-kk-rack]'), null);
  ctx.request.design_mode = true;
  d = new JSDOM(await render('sections/kk-garment-rack.liquid', ctx)).window.document;
  assert.match(d.querySelector('.kk-rack__empty').textContent, /Choose a collection/);
});

async function doc(ctx) { return new JSDOM(await render('sections/kk-garment-rack.liquid', ctx)).window.document; }
const names = d => [...d.querySelectorAll('.kk-rack__garment')].map(a => a.dataset.rackName);

test('hand-picked products override the collection and keep their picked order', async () => {
  const ctx = rackContext();
  const [a, , c, , e] = ctx.section.settings.collection.products;
  ctx.section.settings.product_list = [e, a, c];
  assert.deepEqual(names(await doc(ctx)), ['Walkout Tee', 'Remi Long Sleeve', 'Crown Hoodie']);
});

test('in-stock first moves sold-out garments to the end; hide sold out drops them', async () => {
  const ctx = rackContext();
  ctx.section.settings.collection.products[0].available = false;
  ctx.section.settings.sort_order = 'available_first';
  let d = await doc(ctx);
  assert.deepEqual(names(d), ['Crown Hoodie', 'Walkout Tee', 'Remi Long Sleeve · Sold out']);
  assert.deepEqual([...d.querySelectorAll('.kk-rack__count')].map(p => p.textContent), ['01 / 03', '02 / 03', '03 / 03']);
  assert.equal(d.querySelectorAll('.kk-rack__slide')[2].querySelector('.kk-rack__name').textContent, 'Remi Long Sleeve', 'slides follow rack order');
  ctx.section.settings.hide_sold_out = true;
  d = await doc(ctx);
  assert.deepEqual(names(d), ['Crown Hoodie', 'Walkout Tee']);
});

test('quick add posts the chosen size through the theme cart form; sold-out sizes are disabled', async () => {
  const ctx = rackContext();
  ctx.section.settings.purchase_mode = 'quick_add';
  const form = (await doc(ctx)).querySelector('[data-rack-slide] form[data-quick-add]');
  assert.equal(form.getAttribute('action'), '/cart/add');
  const radios = [...form.querySelectorAll('input[name=id]')];
  assert.deepEqual(radios.map(r => r.value), ['101', '102', '103']);
  assert.deepEqual(radios.map(r => r.disabled), [false, false, true]);
  assert.ok(radios[0].required);
  assert.ok(form.querySelector('[data-cart-error]'));
});

test('successful quick add closes the try-on view without stealing focus from the cart', async () => {
  const ctx = rackContext();
  ctx.section.settings.purchase_mode = 'quick_add';
  const dom = new JSDOM(await render('sections/kk-garment-rack.liquid', ctx), { runScripts: 'outside-only', url: 'https://kingkillers.co/' });
  const w = dom.window, d = w.document;
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.eval(script);
  await new Promise(r => setTimeout(r)); // let DOMContentLoaded boot the rack
  const g = d.querySelector('.kk-rack__garment'); g.focus();
  g.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const form = d.querySelector('[data-rack-slide]:not([hidden]) form');
  const err = form.querySelector('[data-cart-error]');
  err.hidden = false; form.dispatchEvent(new w.CustomEvent('kk:cart-settled'));
  assert.equal(d.querySelector('dialog').open, true, 'errors keep the view open');
  let refocused = false; g.focus = () => { refocused = true; };
  err.hidden = true; form.dispatchEvent(new w.CustomEvent('kk:cart-settled'));
  assert.equal(d.querySelector('dialog').open, false);
  assert.equal(refocused, false, 'focus is left to the cart drawer');
});

test('facing-front on load, price label, product-page mode and colour overrides', async () => {
  const ctx = rackContext();
  Object.assign(ctx.section.settings, { initial_front: 'middle', label_show_price: true, click_action: 'product', color_bg: '#101010', color_accent: '#ff0000', rail_style: 'brass', hanger_style: 'black' });
  const d = await doc(ctx);
  const rack = d.querySelector('[data-kk-rack]');
  assert.equal(rack.dataset.rackInitial, '1');
  assert.ok(d.querySelectorAll('.kk-rack__item')[1].classList.contains('is-active'));
  assert.equal(names(d)[0], 'Remi Long Sleeve — $39.99');
  assert.equal(d.querySelector('[data-rack-dialog]'), null, 'product-page mode renders no try-on view');
  assert.equal(d.querySelector('[data-rack-open]'), null);
  assert.match(rack.getAttribute('style'), /--rack-bg:#101010;--rack-accent:#ff0000/);
  assert.ok(rack.classList.contains('kk-rack--rail-brass') && rack.classList.contains('kk-rack--hanger-black'));
});

test('blend is automatic on the light preset only and can be forced', async () => {
  const ctx = rackContext();
  assert.ok((await doc(ctx)).querySelector('.kk-rack--blend'));
  ctx.section.settings.scheme = 'dark';
  assert.equal((await doc(ctx)).querySelector('.kk-rack--blend'), null);
  ctx.section.settings.photo_blend = 'on';
  assert.ok((await doc(ctx)).querySelector('.kk-rack--blend'));
});
