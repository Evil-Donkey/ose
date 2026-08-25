import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { cacheKeyFor } from './cmsCacheKey.js';

test('same operation with different interpolated query bodies get different keys', () => {
  const home = 'query getContactPage { page(id: "9") { seo { title } } }';
  const portfolio = 'query getContactPage { page(id: "250") { seo { title } } }';
  assert.notDeepEqual(
    cacheKeyFor(home, {}),
    cacheKeyFor(portfolio, {}),
    'interpolating a page id into the query must not share a cache slot'
  );
});

test('same operation with different variables get different keys', () => {
  const query = 'query getPageSeo($id: ID!) { page(id: $id) { seo { title } } }';
  assert.notDeepEqual(
    cacheKeyFor(query, { id: '9' }),
    cacheKeyFor(query, { id: '250' })
  );
});

test('identical query and variables get the same key', () => {
  const query = 'query getPageSeo($id: ID!) { page(id: $id) { seo { title } } }';
  assert.deepEqual(
    cacheKeyFor(query, { id: '250' }),
    cacheKeyFor(query, { id: '250' })
  );
});

test('generateMetadata passes the page id as a GraphQL variable', () => {
  const src = readFileSync(new URL('./generateMetadata.js', import.meta.url), 'utf8');
  assert.match(src, /query getPageSeo\(\$id: ID!\)/);
  assert.match(src, /variables:\s*\{\s*id:\s*String\(id\)/);
  assert.doesNotMatch(src, /page\(id: "\$\{id\}"/);
});
