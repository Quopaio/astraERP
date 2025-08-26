
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


## 🚀 Start Project (Development)

### Terminal 1 — Backend API (MixERP)

```bash
cd backend/MixERP.Api
ASPNETCORE_URLS=http://localhost:5050 dotnet run
```

* Backend listens at **[http://localhost:5050](http://localhost:5050)**
* Swagger UI available at **[/swagger](http://localhost:5050/swagger)**

---

### Terminal 2 — AstraERP Host (Proxy + SPA shell)

From the repo root:

```bash


ASPNETCORE_URLS=http://localhost:5080 dotnet run --project src/AstraERP/AstraERP.csproj

```

* Host listens at **[http://localhost:5080](http://localhost:5080)**
* Proxies all `/api/*` requests → **[http://localhost:5050](http://localhost:5050)**

---

### Terminal 3 — React Client (Vite dev server)

```bash
cd src/AstraERP/ClientApp
npm install   # first time only
npm run dev   # starts Vite
```

* React dev server runs at **[http://localhost:5173](http://localhost:5173)**
* Example API flow when calling `/api/customers`:

```
5173 (React UI) → 5080 (AstraERP host proxy) → 5050 (MixERP backend API)
```

---

👉 This is a **development environment**: no CORS, JWT in localStorage, proxy handled by Vite.
👉 For **production** you’d enable CORS (or serve frontend + backend under one domain) and secure JWT (e.g., via HttpOnly cookies).


### ✅ Quick Check

1. Login via API:

   ```bash
  curl -i -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
   ```

   Returns a JWT token.

2. Open React UI at **[http://localhost:5173](http://localhost:5173)** and test fetching customers.

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
