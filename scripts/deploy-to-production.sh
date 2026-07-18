#!/bin/bash

# Simplified Production Deployment Script
# Direct push from staging to main. NOTE: this script runs NO quality checks
# itself — it only merges and pushes. The quality gates run asynchronously in
# GitHub Actions after the push, and can go red *after* this script exits.

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

# Confirm deployment
echo "⚠️  Ready to deploy to production?"
echo "   This will push staging → main → production"
echo ""
read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 0
fi

echo ""
echo "🚀 Deploying to production..."

# Promotion gate: verify the staging commit we're about to promote actually
# passed its E2E run on staging. Fail-closed — if it can't be proven green, we
# do NOT advance main. This is the real block; the terminal "success" messages
# below only print if we got past here.
STAGING_SHA=$(git rev-parse staging)
echo ""
echo "🔒 Verifying staging E2E passed for the commit being promoted ($STAGING_SHA)..."
if ! npx tsx scripts/verify-staging-e2e.ts --sha="$STAGING_SHA"; then
  echo ""
  echo "❌ Aborting deployment: staging E2E is not verified green for $STAGING_SHA."
  echo "   main was NOT advanced. Fix staging E2E (or wait for it to finish), then re-run."
  exit 1
fi
echo "✅ Staging E2E verified — proceeding with promotion."

# Switch to main and merge staging. Quality gates do NOT run here — they run in
# CI after the push below, so a green terminal does not mean a green deploy.
echo "📤 Switching to main branch and merging staging..."
git checkout main
git pull origin main
git merge staging --no-edit
git push origin main

echo ""
echo "✅ Successfully deployed to main branch!"
echo "📤 Now deploying to production branch..."

# Push to production (already on main branch)
git push origin main:production

echo ""
echo "🎉 Production deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "====================="
echo "✅ $COMMIT_COUNT commits pushed to production (main)"
echo "⏳ Quality gates were NOT run by this script — they are running now in CI."
echo "   Deployment is NOT verified until those gates are green."
echo "✅ Staging → Main → Production push complete"
echo ""
echo "🔎 You MUST confirm the CI gates before treating this as deployed:"
echo "   gh run watch                      # watch the gates for this push"
echo "   gh run list --branch main --limit 5"
echo ""
echo "🔗 Check deployment status:"
echo "   - Staging: [staging environment URL]"
echo "   - Production: [production environment URL]"