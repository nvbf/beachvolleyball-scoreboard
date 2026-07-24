#!/usr/bin/env node
// Posts the preview URL as a comment on the PR via Forgejo's issue-comments
// API (Forgejo/Gitea represent PRs as issues under the hood). Only run on
// `opened`/`reopened` (see workflow condition) -- the URL doesn't change
// across `synchronize` pushes to the same PR, so there's no need to repost.
//
// slugify() must match sindre/k8s/preview-deploy/receiver/manifests.py's
// slugify() exactly, or the URL posted here won't match what's deployed.

const { FORGEJO_API_TOKEN, REPO, PR_NUMBER, BRANCH } = process.env;

function slugify(branch) {
  let slug = branch.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  slug = slug.slice(0, 50).replace(/^-+|-+$/g, "");
  return slug || "branch";
}

const slug = slugify(BRANCH);
const url = `https://${slug}.pr.dev.sindres.no`;

const res = await fetch(
  `https://forgejo.sindres.no/api/v1/repos/${REPO}/issues/${PR_NUMBER}/comments`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${FORGEJO_API_TOKEN}`,
    },
    body: JSON.stringify({ body: `Preview: ${url}` }),
  },
);

if (!res.ok) {
  console.error(`Failed to comment on PR: HTTP ${res.status}`);
  console.error(await res.text());
  process.exit(1);
}

console.log(`Commented preview URL on PR #${PR_NUMBER}: ${url}`);
