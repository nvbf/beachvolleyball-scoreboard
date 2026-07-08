#!/usr/bin/env node
// Signs and posts the deploy event to the k3s-deploy-webhook receiver running
// on the production host (see infra-self-hosted/scripts/k3s-deploy-webhook.py).
// Called as the CI job's own final step -- never a native Forgejo repo
// webhook -- so the image is guaranteed to already be pushed by the time the
// receiver is asked to deploy it.

import crypto from "node:crypto";

const { K3S_DEPLOY_WEBHOOK_URL, K3S_DEPLOY_WEBHOOK_SECRET, REPO, IMAGE } =
  process.env;

const payload = JSON.stringify({ repo: REPO, image: IMAGE });

const signature = crypto
  .createHmac("sha256", K3S_DEPLOY_WEBHOOK_SECRET)
  .update(payload)
  .digest("hex");

const res = await fetch(K3S_DEPLOY_WEBHOOK_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-K3s-Deploy-Signature": `sha256=${signature}`,
  },
  body: payload,
});

const body = await res.text();
console.log(`receiver responded ${res.status}: ${body}`);

if (!res.ok) {
  process.exit(1);
}
