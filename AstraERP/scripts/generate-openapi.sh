#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
SWAGGER_URL="${SWAGGER_URL:-http://localhost:5050/swagger/v1/swagger.json}"
OUT_FILE="${OUT_FILE:-packages/core/api-types.ts}"

# Make sure output dir exists
mkdir -p "$(dirname "$OUT_FILE")"

echo "Generating TypeScript types from: $SWAGGER_URL"
npx openapi-typescript "$SWAGGER_URL" -o "$OUT_FILE"

echo "✅ Types generated -> $OUT_FILE"
