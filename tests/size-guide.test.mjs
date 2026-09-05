import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { render, context, root } from './theme-fixture.mjs';

const source = JSON.parse(fs.readFileSync(root + '/docs/sizing/athletic-shorts-source.json', 'utf8'));
const compact = value => value.replace(/\s/g, '');
function matchingContext() {
  const ctx = context();
  ctx.product.variants.forEach(v => { v.sku = 'SBMSHA-440508-' + v.title; });
  return ctx;
}
async function guide(ctx) {
  return new JSDOM(await render('snippets/product-fit-guide.liquid', ctx)).window.document;
}

test('both chart units preserve every supplier measurement when transposed for mobile', async () => {
  const doc = await guide(matchingContext());
  const tables = [...doc.querySelectorAll('.kk-fit-table')];
  assert.equal(tables.length, 2);
  source.tables.forEach((sourceTable, unit) => {
    const original = new JSDOM(sourceTable.html).window.document;
    const rows = [...original.querySelectorAll('tr')].map(row => [...row.children].map(cell => compact(cell.textContent)));
    const rendered = [...tables[unit].querySelectorAll('tbody tr')].map(row => [...row.children].map(cell => compact(cell.textContent)));
    const transposed = rows[0].slice(1).map((size, col) => [size, ...rows.slice(1).map(row => row[col + 1])]);
    assert.deepEqual(rendered, transposed);
    assert.equal(tables[unit].querySelectorAll('th[scope=col]').length, 5);
    assert.equal(tables[unit].querySelectorAll('th[scope=row]').length, 8);
  });
  assert.equal(doc.querySelectorAll('.kk-fit-units[open]').length, 1);
  assert.match(doc.body.textContent, /not around your body/);
  assert.match(doc.body.textContent, /up to 1 inch/);
});

test('unrelated, mixed and missing supplier SKUs cannot inherit the athletic shorts chart', async () => {
  for (const skus of [['TEST-M'], ['SBMSHAL-1-M'], ['SBMSHA-1-M', 'OTHER-L'], ['SBMSHA-1-M', ''], []]) {
    const ctx = context();
    ctx.product.variants = skus.map(sku => ({ sku }));
    assert.equal((await guide(ctx)).querySelector('.kk-fit-table'), null);
  }
});

test('an explicit merchant chart takes precedence; unrelated product image fallback remains', async () => {
  const ctx = matchingContext();
  ctx.section.settings.size_chart = { src: 'https://example.com/approved-chart.png', alt: 'Approved chart', width: 1000, height: 1000 };
  let doc = await guide(ctx);
  assert.equal(doc.querySelector('.kk-fit-table'), null);
  assert.match(doc.querySelector('img').src, /approved-chart/);
  const other = context();
  other.product.images[0].alt = 'Product size chart';
  doc = await guide(other);
  assert.ok(doc.querySelector('img'));
});
