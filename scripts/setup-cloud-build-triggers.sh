#!/usr/bin/env bash
# Sets up the three Cloud Build triggers for beachvolleyball-scoreboard.
# Run once after connecting the GitHub repo to Cloud Build.
#
# Prerequisites:
#   - gcloud CLI authenticated with sufficient permissions
#   - GitHub repo connected via Cloud Build GitHub App in GCP console
#   - Firebase Hosting sites created (see "Before running" below)
#
# Before running:
#   1. Create two extra Firebase Hosting sites in the Firebase Console
#      (Hosting → Add another site) and fill in SITE_DEV and SITE_BETA below.
#      SITE_PROD defaults to the project's default hosting site.
#   2. Fill in REPO_OWNER and the backend URLs.
#   3. Update .firebaserc with the same site names.

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
PROJECT_ID="scoreboard-sandbox-fc7ac"
REPO_OWNER="YOUR_GITHUB_ORG_OR_USER"        # e.g. "oystein"
REPO_NAME="beachvolleyball-scoreboard"

SITE_DEV="YOUR_DEV_SITE_NAME"               # Firebase Hosting site for dev
SITE_BETA="YOUR_BETA_SITE_NAME"             # Firebase Hosting site for beta
SITE_PROD="$PROJECT_ID"                     # default site = project ID

BACKEND_URL_DEV="https://YOUR_DEV_BACKEND_URL"
BACKEND_URL_PROD="https://YOUR_PROD_BACKEND_URL"
# ─────────────────────────────────────────────────────────────────────────────

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "→ Granting Firebase Hosting Admin to Cloud Build service account..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/firebasehosting.admin"

echo "→ Creating dev trigger (every merge to main)..."
gcloud builds triggers create github \
  --project="$PROJECT_ID" \
  --name="deploy-dev" \
  --repo-name="$REPO_NAME" \
  --repo-owner="$REPO_OWNER" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --substitutions="_FIREBASE_DATABASE=development,_BACKEND_URL=${BACKEND_URL_DEV},_HOSTING_TARGET=dev,_FIREBASE_PROJECT=${PROJECT_ID}" \
  --description="Deploy to dev on merge to main"

echo "→ Creating beta trigger (release tag r01, r02, ...)..."
gcloud builds triggers create github \
  --project="$PROJECT_ID" \
  --name="deploy-beta" \
  --repo-name="$REPO_NAME" \
  --repo-owner="$REPO_OWNER" \
  --tag-pattern="^r[0-9]+$" \
  --build-config="cloudbuild.yaml" \
  --substitutions="_FIREBASE_DATABASE=(default),_BACKEND_URL=${BACKEND_URL_PROD},_HOSTING_TARGET=beta,_FIREBASE_PROJECT=${PROJECT_ID}" \
  --description="Deploy to beta on release tag"

echo "→ Creating prod trigger (same release tag, requires manual approval)..."
gcloud builds triggers create github \
  --project="$PROJECT_ID" \
  --name="deploy-prod" \
  --repo-name="$REPO_NAME" \
  --repo-owner="$REPO_OWNER" \
  --tag-pattern="^r[0-9]+$" \
  --build-config="cloudbuild.yaml" \
  --substitutions="_FIREBASE_DATABASE=(default),_BACKEND_URL=${BACKEND_URL_PROD},_HOSTING_TARGET=prod,_FIREBASE_PROJECT=${PROJECT_ID}" \
  --require-approval \
  --description="Deploy to prod on release tag (requires approval)"

echo ""
echo "Done! Summary:"
echo "  deploy-dev   → fires on merge to main → hosting site: ${SITE_DEV}"
echo "  deploy-beta  → fires on tag ^r[0-9]+$ → hosting site: ${SITE_BETA}"
echo "  deploy-prod  → fires on tag ^r[0-9]+$ → hosting site: ${SITE_PROD} (approval required)"
echo ""
echo "Remaining steps:"
echo "  1. Update .firebaserc with your dev and beta site names."
echo "  2. Approve prod deployments at: https://console.cloud.google.com/cloud-build/builds?project=${PROJECT_ID}"
