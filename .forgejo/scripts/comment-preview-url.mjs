#!/usr/bin/env node
// Posts the preview URL as a comment on the PR via Forgejo's issue-comments
// API (Forgejo/Gitea represent PRs as issues under the hood). Runs on every
// non-`closed` action (see workflow condition) rather than just
// `opened`/`reopened`, because Forgejo doesn't reliably deliver a distinct
// `opened` action when the PR's branch already had commits pushed before the
// PR was created -- it can show up as `synchronized` instead. The MARKER
// below makes re-runs a no-op: we only ever post once per PR.
//
// slugify() must match sindre/k8s/preview-deploy/receiver/manifests.py's
// slugify() exactly, or the URL posted here won't match what's deployed.

const { FORGEJO_API_TOKEN, REPO, PR_NUMBER, BRANCH } = process.env;
const MARKER = "<!-- pr-preview-url -->";

function slugify(branch) {
  let slug = branch.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  slug = slug.slice(0, 50).replace(/^-+|-+$/g, "");
  return slug || "branch";
}

const slug = slugify(BRANCH);
const url = `https://${slug}.pr.dev.sindres.no`;

const commentsUrl = `https://forgejo.sindres.no/api/v1/repos/${REPO}/issues/${PR_NUMBER}/comments`;

const existing = await fetch(commentsUrl, {
  headers: { Authorization: `token ${FORGEJO_API_TOKEN}` },
});

if (!existing.ok) {
  console.error(`Failed to list PR comments: HTTP ${existing.status}`);
  console.error(await existing.text());
  process.exit(1);
}

const alreadyCommented = (await existing.json()).some((comment) =>
  comment.body.includes(MARKER),
);

if (alreadyCommented) {
  console.log(`PR #${PR_NUMBER} already has a preview URL comment, skipping.`);
  process.exit(0);
}

const res = await fetch(commentsUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `token ${FORGEJO_API_TOKEN}`,
  },
  body: JSON.stringify({ body: `${MARKER}\nPreview: ${url}` }),
});

if (!res.ok) {
  console.error(`Failed to comment on PR: HTTP ${res.status}`);
  console.error(await res.text());
  process.exit(1);
}

console.log(`Commented preview URL on PR #${PR_NUMBER}: ${url}`);
