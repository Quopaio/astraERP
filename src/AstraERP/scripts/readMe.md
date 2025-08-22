** 'Scripts/dev.sh' **

Drop it in & run

# save the script above as scripts/dev.sh
chmod +x scripts/dev.sh
./scripts/dev.sh


Notes

Make sure your AstraERP host has appsettings.json with:

{ "BackendApiBase": "http://localhost:5050" }


Your Vite config should proxy /api → http://localhost:5080:

// AstraERP/ClientApp/vite.config.ts
server: {
  port: 5173,
  strictPort: true,
  proxy: { "/api": { target: "http://localhost:5080", changeOrigin: true } }
}


If you don’t have the backend yet, the script will skip the API step—React can still render while you hook up the real MixERP.Api later. Update API_DIR when it’s in place.


**`Scripts/generate-openapi.sh`** that pulls your backend’s Swagger and generates TypeScript types (and optionally an API client) for the React app.

Below are two good variants. Pick one:

---

## Option A — Types only (lightweight, great with Axios)

**Tools:** `openapi-typescript`
**Generates:** `packages/core/api-types.ts` (types for request/response payloads)

1. Install the dev tool (run in `AstraERP/ClientApp` or repo root):

```bash
npm i -D openapi-typescript
```

2. Create the script at `scripts/generate-openapi.sh`:

```bash
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
```

3. Make it executable:

```bash
chmod +x scripts/generate-openapi.sh
```

4. Run it (from repo root):

```bash
SWAGGER_URL=http://localhost:5050/swagger/v1/swagger.json ./scripts/generate-openapi.sh
```

5. Use it in React:

```ts
// ClientApp/src/lib/api-types.ts (optional re-export) or import directly from packages/core
import type { components, paths } from "../../../packages/core/api-types";

type Customer = components["schemas"]["Customer"];
type CustomersListResponse = paths["/customers"]["get"]["responses"]["200"]["content"]["application/json"];
```

---

## Option B — Types + API client (NSwag, generates a typed fetch/axios client)

**Tools:** `nswag` CLI
**Generates:** `packages/core/api-client.ts` (fully-typed client classes)

1. Install NSwag (dotnet tool):

```bash
dotnet tool install --global NJsonSchema.CodeGeneration.CSharp --version 11.0.0
dotnet tool install --global NSwag.ConsoleCore --version 13.20.0
```

2. Create `scripts/generate-openapi.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

SWAGGER_URL="${SWAGGER_URL:-http://localhost:5050/swagger/v1/swagger.json}"
OUT_FILE="${OUT_FILE:-packages/core/api-client.ts}"

mkdir -p "$(dirname "$OUT_FILE")"

echo "Generating TS client from: $SWAGGER_URL"
# Generates a fetch-based client by default; add --template Axios if you prefer
nswag openapi2tsclient /input:"$SWAGGER_URL" /output:"$OUT_FILE" /UseGetBaseUrlFromDocument=false /GenerateClientInterfaces=true

echo "✅ Client generated -> $OUT_FILE"
```

3. Make it executable:

```bash
chmod +x scripts/generate-openapi.sh
```

4. Use in React:

```ts
// Example (if NSwag generated a default client)
import { Client } from "../../../packages/core/api-client";

const api = new Client({ baseUrl: "/api" }); // our host proxies /api to the backend
const customers = await api.customersAll(/*...params if any*/);
```

---

## Optional: npm scripts for convenience

Add to **repo root** (or `ClientApp`) `package.json`:

```json
{
  "scripts": {
    "gen:openapi": "SWAGGER_URL=http://localhost:5050/swagger/v1/swagger.json ./scripts/generate-openapi.sh"
  }
}
```

Now you can run:

```bash
npm run gen:openapi
```

---

## Tips & gotchas

* **Backend must be running** on the URL you pass (e.g., `http://localhost:5050/swagger/v1/swagger.json`).
* If your backend is **HTTPS with a self-signed cert**, either:

  * Use `http://` in dev, or
  * Export `NODE_TLS_REJECT_UNAUTHORIZED=0` when calling tools that fetch HTTPS (only for dev).
* If your Swagger is **protected**, temporarily allow anonymous in dev or use a local saved JSON file:

  ```bash
  # save once
  curl -o /tmp/swagger.json http://localhost:5050/swagger/v1/swagger.json
  # generate from file
  SWAGGER_URL=/tmp/swagger.json ./scripts/generate-openapi.sh
  ```
* Regenerate whenever your backend contracts change.

---

