
* **MixERP.Api** → the real backend API (ERP logic, controllers).
* **AstraERP host** → serves the React app + proxies `/api` to MixERP.Api.
* **ClientApp** (React + Vite + Chakra) → the UI.


# 🛠 Convenience script

Use the `scripts/dev.sh`

 It launches all 3 processes, opens a browser, and cleans up when you Ctrl-C:

```bash
./scripts/dev.sh

```
---

# 🚀 Run everything manually

### Terminal 1 — Backend API (MixERP)

```bash
cd backend/MixERP.Api
ASPNETCORE_URLS=http://localhost:5050 dotnet run
```

Backend listens at **[http://localhost:5050](http://localhost:5050)** (Swagger usually at `/swagger`).

---

### Terminal 2 — AstraERP host (proxy + SPA)

From the repo root:

```bash
ASPNETCORE_URLS=http://localhost:5080 dotnet run --project AstraERP.csproj
```

Host listens at **[http://localhost:5080](http://localhost:5080)**, and proxies `/api/*` → `5050`.

---

### Terminal 3 — React client (Vite dev server)

```bash
cd AstraERP/ClientApp
npm install         # first time only
npm run dev         # starts Vite on http://localhost:5173
```

Open browser at **[http://localhost:5173](http://localhost:5173)**.
When your React app calls `/api/customers`, flow is:

```
5173 (UI) → 5080 (Host proxy) → 5050 (MixERP backend)
```


---

# 📦 Run production build

When you’re ready to ship:

1. Build the React app:

   ```bash
   cd AstraERP/ClientApp
   npm run build
   ```

   → outputs static files into `ClientApp/dist`.

2. Host serves that automatically:

   ```bash
   cd AstraERP
   dotnet publish -c Release -o out
   dotnet out/AstraERP.dll
   ```

   Then open **[http://localhost:5080](http://localhost:5080)** — React is served from `dist`, API is still proxied to `5050`.

---

✅ That’s it:

* Dev: run 3 processes (API 5050, Host 5080, Vite 5173).
* Prod: build React, publish host, run host → UI + proxy in one process.

---
