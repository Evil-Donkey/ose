#!/usr/bin/env node

import { formatSlackPayload, postSlack } from "./broken-images/slack.mjs";
import { runBrokenImageCheck } from "./broken-images/run.mjs";

const origin = process.env.SITE_ORIGIN || "https://www.oxfordscienceenterprises.com";
const webhookUrl = process.env.SLACK_WEBHOOK_URL || "";
const notifyOnSuccess = process.env.SLACK_NOTIFY_ON_SUCCESS === "1";
const allowMissingSlack = process.env.ALLOW_MISSING_SLACK === "1";
const maxPages = Number.parseInt(process.env.MAX_PAGES || "400", 10);

const result = await runBrokenImageCheck({
  origin,
  maxPages: Number.isFinite(maxPages) ? maxPages : 400,
});

const payload = formatSlackPayload(result);
console.log(payload.text);

const hasFindings = result.broken.length > 0 || result.unproxied.length > 0;

if (webhookUrl) {
  if (hasFindings || notifyOnSuccess) {
    await postSlack(webhookUrl, payload);
    console.log("Slack notification sent.");
  }
} else if (!allowMissingSlack) {
  console.error(
    "SLACK_WEBHOOK_URL is not set. Add it as a GitHub Actions secret, or set ALLOW_MISSING_SLACK=1 for a local dry run."
  );
  process.exit(1);
}

if (result.broken.length > 0) {
  process.exit(1);
}
