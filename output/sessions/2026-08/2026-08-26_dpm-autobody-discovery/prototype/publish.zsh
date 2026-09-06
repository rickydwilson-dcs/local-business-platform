#!/bin/zsh
# Publish the CLIENT build to Vercel — the URL David is sent.
#
# Scope decision (Ricky, 2026-08-29): David gets the clean pages and nothing else.
# The annotated build carries notes naming the copy we invented, and directions
# A/B/C/D are rejected or superseded work — none of it is deployed, and the 137MB
# of AI art-direction plates they reference is never uploaded.
#
# The deployment is therefore built from a staging directory holding only the
# four client pages, flattened so the homepage is the site root. They already
# link to each other as siblings, so nothing needs rewriting.
#
#   ./prototype/publish.zsh            # run from the monorepo root
set -euo pipefail

PROTO=${0:a:h}
ROOT=$(git -C $PROTO rev-parse --show-toplevel)   # the tools resolve from here
STAGE=$PROTO/.publish
PROJECT=dpm-autobody

cd $ROOT

# 1. Assets -> R2, and rewrite src/ (not the builds — they are regenerated).
#    Scoped to the five published pages so the superseded directions' plates
#    stay local. Idempotent: already-uploaded objects are skipped, rewritten
#    refs no longer match.
#    etype-941pvo.html added 5 September — a new page needs adding here AND to
#    the cp list below, or it is silently built but never deployed: this flag
#    is what scopes the R2 upload, and step 3 is what actually ships the file.
npx tsx tools/upload-prototype-assets.ts $PROTO \
  --pages src/home.html,src/volvo-p1800.html,src/etype-941pvo.html,src/workshop.html,src/contact.html

# 2. Regenerate both builds so client/ and annotated/ carry the R2 URLs.
node $PROTO/build.mjs

# 3. Stage the client build alone, flattened to the deploy root.
rm -rf $STAGE && mkdir -p $STAGE
cp $PROTO/client/index.html        $STAGE/index.html
cp $PROTO/client/volvo-p1800.html  $STAGE/volvo-p1800.html
cp $PROTO/client/etype-941pvo.html $STAGE/etype-941pvo.html
cp $PROTO/client/workshop.html     $STAGE/workshop.html
cp $PROTO/client/contact.html      $STAGE/contact.html
cp $PROTO/assets-manifest.json     $STAGE/assets-manifest.json

# X-Robots-Tag as well as the pages' own noindex meta: the copy is unsigned-off
# and three blocks put first-person words in the mouths of real, named men.
# publish-prototype.ts spreads any existing vercel.json before pinning its own
# build keys, so this survives.
cat > $STAGE/vercel.json <<'JSON'
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
    }
  ]
}
JSON

# 4. Deploy.
npx tsx tools/publish-prototype.ts $STAGE --project $PROJECT
