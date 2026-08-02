#!/bin/bash

# Production Deployment Script — gated PR promotion.
# Promotes staging -> main through a pull request so the required
# 'Verify promoted commit passed staging E2E' check must pass before main can
# advance (and therefore before Vercel deploys on push to main). This script no
# longer pushes main directly — branch protection is expected to reject that.
# Requires the `gh` CLI, authenticated.

set -e  # Exit on any error

echo "🚀 Starting automated production deployment process..."

# Ensure we're on staging branch and up to date
echo "📥 Syncing staging branch..."
git checkout staging
git pull origin staging

# Get the latest commit on main for comparison
git fetch origin main

# Generate commit information since last production deployment
echo "📊 Analyzing changes since last production deployment..."

# Get commits that are in staging but not in main
COMMITS=$(git log origin/main..staging --oneline --no-merges)
COMMIT_COUNT=$(git rev-list --count origin/main..staging)

if [ $COMMIT_COUNT -eq 0 ]; then
    echo "❌ No new commits to deploy. staging and main are in sync."
    exit 0
fi

# Get the date range
SINCE_DATE=$(git log origin/main -1 --format=%cd --date=short)
TODAY=$(date +%Y-%m-%d)

echo ""
echo "📋 Production Deployment Summary:"
echo "=================================="
echo "📅 Deployment Date: $(date '+%Y-%m-%d %H:%M:%S UTC')"
echo "📊 Changes: $COMMIT_COUNT commits since last production release"
echo "📆 Period: $SINCE_DATE to $TODAY"
echo ""
echo "🔄 Changes to be deployed:"
echo "$COMMITS"
echo ""

# Confirm promotion
echo "⚠️  Ready to promote staging → main?"
echo "   This opens a gated pull request (staging → main). The merge — and the"
echo "   Vercel production deploy that follows it — happen only once the required"
echo "   'Verify promoted commit passed staging E2E' check passes on the PR."
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Promotion cancelled."
    exit 0
fi

STAGING_SHA=$(git rev-parse origin/staging)

# Local pre-check: fail fast before opening a PR if staging E2E isn't green for
# the commit being promoted. Courtesy early signal only — the REAL, unbypassable
# gate is the required status check on the PR below.
echo ""
echo "🔒 Pre-checking staging E2E for $STAGING_SHA..."
if ! npx tsx scripts/verify-staging-e2e.ts --sha="$STAGING_SHA"; then
  echo ""
  echo "❌ Staging E2E is not verified green for $STAGING_SHA — not opening a promotion PR."
  echo "   Fix staging E2E (or wait for it to finish), then re-run."
  exit 1
fi
echo "✅ Staging E2E pre-check passed."

# Open (or reuse) the staging → main promotion PR.
echo ""
echo "🔀 Opening promotion PR (staging → main)..."
PR=$(gh pr list --base main --head staging --state open --json number --jq '.[0].number')
if [ -z "$PR" ]; then
  gh pr create --base main --head staging \
    --title "Promote staging → main ($TODAY)" \
    --body "$(printf 'Automated promotion of %s commit(s):\n\n%s\n' "$COMMIT_COUNT" "$COMMITS")" >/dev/null
  PR=$(gh pr list --base main --head staging --state open --json number --jq '.[0].number')
  echo "   Created PR #$PR"
else
  echo "   Reusing open PR #$PR"
fi

# Wait for the gate (and all PR checks) to conclude. Fail-closed: if a check
# fails — or there are no checks to prove the gate ran — we do NOT merge.
echo ""
echo "⏳ Waiting for the promotion gate to pass on PR #$PR..."
if ! gh pr checks "$PR" --watch --fail-fast; then
  echo ""
  echo "❌ PR #$PR checks did not pass — main NOT advanced."
  echo "   Inspect: gh pr view $PR --web"
  exit 1
fi

# Merge the gated PR (merge commit, matching the previous behaviour). Never
# delete staging.
echo ""
echo "✅ Gate green. Merging PR #$PR → main..."
gh pr merge "$PR" --merge --delete-branch=false

# Note: there is no separate 'production' branch — `main` is the production
# branch for every Vercel project, so merging the gated PR to `main` is the whole
# deploy. (The old script pushed `main:production`, but origin/production does not
# exist and nothing consumes it, so that mirror was removed.)

echo ""
echo "🎉 Promotion complete — staging → main merged through the gate."
echo ""
echo "📊 Summary:"
echo "==========="
echo "✅ $COMMIT_COUNT commit(s) promoted via gated PR #$PR"
echo "✅ Staging E2E was verified green for the promoted commit before merge"
echo ""
echo "🔎 Vercel deploys from the merge; confirm it landed:"
echo "   gh run list --branch main --limit 5"
echo ""
echo "🔗 Check deployment status:"
echo "   - Staging: [staging environment URL]"
echo "   - Production: [production environment URL]"