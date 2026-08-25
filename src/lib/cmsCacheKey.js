// Operation name + variables are not enough: some queries historically
// interpolated arguments into the query body (e.g. page SEO). Hash a
// fingerprint of the query so those cannot share a cache slot.
//
// Use a tiny FNV-1a hash instead of node:crypto — fetchAPI is imported from
// client components, so Node builtins would break the webpack client bundle.
function fingerprint(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function cacheKeyFor(query, variables) {
  const source = String(query ?? '');
  const opMatch = source.match(/(?:query|mutation)\s+(\w+)/);
  const opName = opMatch ? opMatch[1] : 'anonymous';
  return ['cms', opName, fingerprint(source), JSON.stringify(variables || {})];
}
