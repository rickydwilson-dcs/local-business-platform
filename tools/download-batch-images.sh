#!/bin/bash
# Download images from a Gemini batch response using curl and jq
# This handles large responses that would exceed Node.js string limits

set -e

BATCH_ID="$1"
OUTPUT_DIR="/Users/ricky/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My Drive/Websites/GitHub/local-business-platform/output/generated-images"
MANIFEST="/Users/ricky/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My Drive/Websites/GitHub/local-business-platform/output/image-manifest.json"
API_KEY=$(grep GOOGLE_AI_API_KEY "/Users/ricky/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My Drive/Websites/GitHub/local-business-platform/.env.local" | cut -d= -f2)

if [ -z "$BATCH_ID" ]; then
  echo "Usage: $0 <batch_id>"
  echo "Example: $0 yxtglhmceo5lg9q04dfsgounfb2egvwdhm2z"
  exit 1
fi

echo "Downloading batch: batches/$BATCH_ID"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Create temp file for the large response
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

echo "Fetching batch results (this may take a while)..."
curl -s "https://generativelanguage.googleapis.com/v1beta/batches/$BATCH_ID?key=$API_KEY" > "$TEMP_FILE"

# Check if successful
if ! jq -e '.done' "$TEMP_FILE" > /dev/null 2>&1; then
  echo "Error: Batch not complete or invalid response"
  jq '.metadata.state // "unknown"' "$TEMP_FILE"
  exit 1
fi

echo "Batch complete! Extracting images..."

# Get the number of responses
NUM_RESPONSES=$(jq '.response.inlinedResponses.inlinedResponses | length' "$TEMP_FILE")
echo "Found $NUM_RESPONSES images to process"
echo ""

SUCCESS=0
ERRORS=0

# Process each response
for i in $(seq 0 $((NUM_RESPONSES - 1))); do
  # Get the image ID (metadata.key)
  IMAGE_ID=$(jq -r ".response.inlinedResponses.inlinedResponses[$i].metadata.key" "$TEMP_FILE")

  # Get the r2Key from manifest
  R2_KEY=$(jq -r --arg id "$IMAGE_ID" '.images[] | select(.id == $id) | .r2Key' "$MANIFEST")

  if [ -z "$R2_KEY" ] || [ "$R2_KEY" == "null" ]; then
    echo "[$((i+1))/$NUM_RESPONSES] ⚠️  No r2Key found for: $IMAGE_ID"
    ((ERRORS++))
    continue
  fi

  # Create directory if needed
  mkdir -p "$OUTPUT_DIR/$(dirname "$R2_KEY")"

  # Extract and decode base64 image data
  OUTPUT_PATH="$OUTPUT_DIR/$R2_KEY"

  # Check if already exists
  if [ -f "$OUTPUT_PATH" ]; then
    echo "[$((i+1))/$NUM_RESPONSES] ⏭️  Already exists: $R2_KEY"
    ((SUCCESS++))
    continue
  fi

  # Extract image data and save
  jq -r ".response.inlinedResponses.inlinedResponses[$i].response.candidates[0].content.parts[0].inlineData.data" "$TEMP_FILE" | base64 -d > "$OUTPUT_PATH"

  if [ -f "$OUTPUT_PATH" ] && [ -s "$OUTPUT_PATH" ]; then
    echo "[$((i+1))/$NUM_RESPONSES] ✅ $R2_KEY"
    ((SUCCESS++))
  else
    echo "[$((i+1))/$NUM_RESPONSES] ❌ Failed: $R2_KEY"
    rm -f "$OUTPUT_PATH"
    ((ERRORS++))
  fi
done

echo ""
echo "============================================================"
echo "Download Summary"
echo "  ✅ Saved: $SUCCESS"
echo "  ❌ Errors: $ERRORS"
echo "============================================================"
