function truncate(value, max) {
  const text = String(value);
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export function formatSlackPayload({
  origin,
  pagesChecked,
  imagesChecked,
  broken = [],
  unproxied = [],
}) {
  if (!broken.length && !unproxied.length) {
    return {
      text: `Broken-image check: no broken images on ${origin} (${pagesChecked} pages, ${imagesChecked} unique images).`,
    };
  }

  const lines = [
    `Broken-image check: ${broken.length} broken image(s) on ${origin}`,
    `Checked ${pagesChecked} pages, ${imagesChecked} unique images.`,
    "",
  ];

  const byPage = new Map();
  for (const item of broken) {
    const list = byPage.get(item.page) || [];
    list.push(item);
    byPage.set(item.page, list);
  }

  const maxItems = 40;
  let shown = 0;
  for (const [page, items] of byPage) {
    lines.push(`*${page}*`);
    for (const item of items) {
      if (shown >= maxItems) break;
      lines.push(`• ${truncate(item.image, 180)} — ${item.reason}`);
      shown += 1;
    }
    lines.push("");
    if (shown >= maxItems) break;
  }

  if (broken.length > shown) {
    lines.push(`…and ${broken.length - shown} more`);
  }

  if (unproxied.length) {
    lines.push(
      `${unproxied.length} CMS image(s) still unproxied in markup (visitors may hit SiteGround captcha):`
    );
    for (const item of unproxied.slice(0, 10)) {
      lines.push(`• ${item.page} → ${truncate(item.image, 180)}`);
    }
  }

  return { text: lines.join("\n").trim() };
}

export async function postSlack(webhookUrl, payload, fetchImpl = fetch) {
  const response = await fetchImpl(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Slack webhook failed: ${response.status} ${body}`.trim());
  }
}
