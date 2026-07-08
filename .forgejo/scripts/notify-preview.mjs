#!/usr/bin/env node
// Signs and posts the deploy/teardown event to the preview-deploy receiver
// running in the k3s cluster (see sindre/k8s/preview-deploy). Called as the
// CI job's own final step -- never a native Forgejo repo webhook -- so the
// image is guaranteed to already be pushed by the time the receiver is
// asked to deploy it.

import crypto from "node:crypto";

const {
  PREVIEW_WEBHOOK_URL,
  PREVIEW_WEBHOOK_SECRET,
  REPO,
  ACTION,
  PR_NUMBER,
  BRANCH,
  IMAGE,
} = process.env;

const payload = JSON.stringify({
  repo: REPO,
  action: ACTION,
  pr_number: Number(PR_NUMBER),
  branch: BRANCH,
  image: IMAGE ?? "",
});

const signature = crypto
  .createHmac("sha256", PREVIEW_WEBHOOK_SECRET)
  .update(payload)
  .digest("hex");

const res = await fetch(PREVIEW_WEBHOOK_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Preview-Signature": `sha256=${signature}`,
  },
  body: payload,
});

const body = await res.text();
console.log(`receiver responded ${res.status}: ${body}`);

if (!res.ok) {
  process.exit(1);
}
