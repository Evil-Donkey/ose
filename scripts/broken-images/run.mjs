import { classifyImageResponse } from "./classify.mjs";
import { STATIC_PATHS, SLUGS_QUERY, pathsFromGraphqlData } from "./discover.mjs";
import { extractImagesFromHtml, extractInternalLinks, extractUnproxiedCmsUrls } from "./html.mjs";
import { canonicalOrigin, isImageLike, pageUrl, proxyCheckUrl } from "./urls.mjs";

export const USER_AGENT = "OSE-BrokenImageBot/1.0 (+github-action)";

async function fetchWithTimeout(fetchImpl, url, init, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`timeout after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readBodyStart(response, maxBytes = 1024) {
  if (!response.body || typeof response.body.getReader !== "function") {
    const text = await response.text();
    return text.slice(0, maxBytes);
  }

  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (size < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.byteLength;
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))
    .subarray(0, maxBytes)
    .toString("utf8");
}

async function mapPool(items, limit, fn) {
  if (!items.length) return;
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      await fn(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

function normalizePageUrl(url, originBase) {
  const parsed = new URL(url, originBase);
  const path = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
  return `${parsed.origin}${path}`;
}

async function fetchGraphql(fetchImpl, originBase, timeoutMs) {
  const response = await fetchWithTimeout(
    fetchImpl,
    `${originBase}/api/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({ query: SLUGS_QUERY }),
    },
    timeoutMs
  );

  if (!response.ok) {
    throw new Error(`GraphQL HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json?.errors?.length) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }
  return json?.data || {};
}

async function inspectImage(fetchImpl, url, timeoutMs) {
  const response = await fetchWithTimeout(
    fetchImpl,
    url,
    {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    },
    timeoutMs
  );

  return {
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    bodyStart: await readBodyStart(response),
  };
}

export async function runBrokenImageCheck({
  origin,
  fetchImpl = fetch,
  seedPaths,
  maxPages = 400,
  pageConcurrency = 4,
  imageConcurrency = 6,
  pageTimeoutMs = 20000,
  imageTimeoutMs = 15000,
} = {}) {
  const originBase = canonicalOrigin(origin);
  const pending = [];
  const queued = new Set();

  const enqueue = (urlOrPath) => {
    const absolute = String(urlOrPath).startsWith("http")
      ? urlOrPath
      : pageUrl(originBase, urlOrPath);
    const normalized = normalizePageUrl(absolute, originBase);
    if (queued.has(normalized)) return;
    queued.add(normalized);
    pending.push(normalized);
  };

  for (const path of seedPaths || STATIC_PATHS) enqueue(path);

  try {
    const data = await fetchGraphql(fetchImpl, originBase, pageTimeoutMs);
    for (const path of pathsFromGraphqlData(data)) enqueue(path);
  } catch {
    // Fall back to seeded routes plus in-page links.
  }

  const imageMap = new Map();
  const unproxiedMap = new Map();
  const visitedPages = [];
  const pageErrors = [];

  while (pending.length && visitedPages.length < maxPages) {
    const batch = [];
    while (
      batch.length < pageConcurrency &&
      pending.length &&
      visitedPages.length + batch.length < maxPages
    ) {
      batch.push(pending.shift());
    }

    await Promise.all(
      batch.map(async (page) => {
        try {
          const response = await fetchWithTimeout(
            fetchImpl,
            page,
            { headers: { "User-Agent": USER_AGENT } },
            pageTimeoutMs
          );
          const html = await response.text();
          visitedPages.push(page);

          if (!response.ok && response.status >= 400) {
            pageErrors.push({ page, reason: `HTTP ${response.status}` });
          }

          for (const image of extractImagesFromHtml(html, originBase)) {
            if (!imageMap.has(image)) imageMap.set(image, new Set());
            imageMap.get(image).add(page);
          }

          for (const image of extractUnproxiedCmsUrls(html, originBase)) {
            if (!unproxiedMap.has(image)) unproxiedMap.set(image, page);
          }

          for (const link of extractInternalLinks(html, originBase)) {
            enqueue(link);
          }
        } catch (error) {
          visitedPages.push(page);
          pageErrors.push({ page, reason: error.message || String(error) });
        }
      })
    );
  }

  const images = [...imageMap.entries()].filter(([image]) =>
    isImageLike(image, originBase)
  );
  const broken = [];

  await mapPool(images, imageConcurrency, async ([image, pages]) => {
    const page = [...pages][0];
    const checkUrl = proxyCheckUrl(originBase, image);
    try {
      const result = classifyImageResponse(
        await inspectImage(fetchImpl, checkUrl, imageTimeoutMs)
      );
      if (!result.ok) {
        broken.push({ page, image: checkUrl, reason: result.reason, pages: [...pages] });
      }
    } catch (error) {
      broken.push({
        page,
        image: checkUrl,
        reason: error.message || String(error),
        pages: [...pages],
      });
    }
  });

  return {
    origin: originBase,
    pagesChecked: visitedPages.length,
    imagesChecked: images.length,
    broken,
    unproxied: [...unproxiedMap.entries()].map(([image, page]) => ({ page, image })),
    pageErrors,
  };
}
