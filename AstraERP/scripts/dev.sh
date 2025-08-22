#!/usr/bin/env bash
set -euo pipefail

# --- Config (change ports here if you like) ---
API_DIR="backend/MixERP.Api"
HOST_PROJ="AstraERP.csproj"
CLIENT_DIR="AstraERP/ClientApp"

API_URL="http://localhost:5050"
HOST_URL="http://localhost:5080"
VITE_PORT="5173"

# --- Helpers ---
need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1"; exit 1; }; }
kill_bg() { jobs -p | xargs -I{} kill {} 2>/dev/null || true; }

# --- Checks ---
need dotnet
need npm

# Verify paths
[ -f "$HOST_PROJ" ] || { echo "❌ Host project not found: $HOST_PROJ"; exit 1; }
if [ ! -d "$API_DIR" ]; then
  echo "⚠️  Backend API dir not found: $API_DIR"
  echo "   - Skipping API (5050). Update API_DIR in this script when ready."
  START_API=false
else
  START_API=true
fi

# --- Trap for cleanup ---
trap 'echo; echo "🧹 Stopping dev processes..."; kill_bg; echo "Bye!";' INT TERM EXIT

echo "🔧 Ensuring client deps..."
pushd "$CLIENT_DIR" >/dev/null
[ -d node_modules ] || npm install
popd >/dev/null

echo "🌐 Starting services..."
echo "   API:   $API_URL"
echo "   HOST:  $HOST_URL"
echo "   VITE:  http://localhost:$VITE_PORT"

# --- Start API (5050) ---
if [ "$START_API" = true ]; then
  ( cd "$API_DIR" && ASPNETCORE_URLS="$API_URL" dotnet run ) & API_PID=$!
  sleep 2
else
  API_PID=""
fi

# --- Start Host (5080) ---
( ASPNETCORE_URLS="$HOST_URL" dotnet run --project "$HOST_PROJ" ) & HOST_PID=$!
sleep 2

# --- Start Vite (5173) ---
( cd "$CLIENT_DIR" && npm run dev -- --port "$VITE_PORT" --strictPort ) & VITE_PID=$!
sleep 2

# --- Open browser (macOS 'open', otherwise print URLs) ---
if command -v open >/dev/null 2>&1; then
  open "http://localhost:$VITE_PORT"
else
  echo "👉 Open your browser to: http://localhost:$VITE_PORT"
fi

echo "🚀 Dev up! Press Ctrl+C to stop."
wait
