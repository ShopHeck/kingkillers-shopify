import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { render, context, productFixture, root } from './theme-fixture.mjs';

const script = fs.readFileSync(root + '/assets/kk-rack.js', 'utf8');

function rackContext() {
  const tee = (id, title, type = 'T-Shirt') => ({ ...productFixture(), id, title, type, url: '/products/p' + id });
  const products = [tee(1, 'Remi Long Sleeve'), tee(2, 'Red Corner Beanie', 'Beanie'), tee(3, 'Crown Hoodie', 'Hoodie'), { ...tee(4, 'Gift Card', 'Gift Cards'), 'gift_card?': true }, tee(5, 'Walkout Tee')];
  products[2].metafields = { custom: { rack_image: { value: { src: 'https://kingkillers.co/cutout.png', width: 900, height: 1100, alt: '' } } } };
  const ctx = context();
  ctx.section = { id: 'rack', blocks: [], settings: { collection: { title: 'FW26', url: '/collections/fw26', products }, products_to_show: 12, exclude_types: 'hat, beanie', scheme: 'light', show_price: true, hint: 'Hover the rack', availability_label: 'See availability', cta_label: 'Shop', marquee_text: 'A | B' } };
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
