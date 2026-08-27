export const STATIC_PATHS = [
  "/",
  "/what",
  "/why",
  "/how",
  "/who",
  "/deep-tech",
  "/health-tech",
  "/life-sciences",
  "/sustainability",
  "/sustainability-policy",
  "/sustainability-disclosure",
  "/uncover",
  "/news",
  "/portfolio",
  "/stories",
  "/contact",
  "/privacy-policy",
  "/terms-conditions",
  "/complaints-policy",
  "/modern-slavery-statement",
  "/coinvestors-contact-form",
  "/shareholder-contact-form",
  "/shareholder-information",
  "/shareholder-information-signup",
  "/form",
  "/portfolio-news",
];

export const SLUGS_QUERY = `
  query PublicSlugs {
    posts(first: 1000) { nodes { slug } }
    allPortfolio(first: 1000) { nodes { slug } }
    stories(first: 1000) { nodes { slug } }
    allTeam(first: 1000) { nodes { slug } }
    allFounders(first: 1000) { nodes { slug } }
  }
`;

const GRAPHQL_COLLECTIONS = [
  ["posts", "/news"],
  ["allPortfolio", "/portfolio"],
  ["stories", "/stories"],
  ["allTeam", "/who"],
  ["allFounders", "/founders"],
];

export function pathsFromGraphqlData(data) {
  const paths = [];
  if (!data) return paths;

  for (const [key, prefix] of GRAPHQL_COLLECTIONS) {
    const nodes = data[key]?.nodes || [];
    for (const node of nodes) {
      const slug = typeof node?.slug === "string" ? node.slug.trim() : "";
      if (!slug) continue;
      paths.push(`${prefix}/${slug}`);
    }
  }

  return paths;
}
