## Schema
Get data schema from quopashop.com for ecommerce features


## Debug



## LAUNCH SCRIPTS

./dev_up.sh
tmux attach -t mixerp-dev

# CLIENT PANE

cd src/AstraERP/ClientApp


npm run dev -- --host 127.0.0.1 --port 5173


./dev_down.sh

# Test Get Token

  curl -i -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'



## Notes
Got it ✅ — let’s outline your **development environment** so you have a clear picture.

---

# 🌐 Development Environment Summary (No CORS)

### 1. **Frontend**

* **Framework:** React + React Router 6 + Chakra UI.
* **Entry:** `main.tsx` → wraps `<AppRouter />` inside `<Providers>`.
* **Layout:** `AppShell` (Topbar + Sidebar + Content via Chakra Grid).
* **Routing:**

  * `/login` (public).
  * Protected routes (`/`, `/dashboard`, `/customers`, `/test`) gated by `ProtectedRoute` (`authStore` + `useSyncExternalStore`).
* **UI Libraries:** Chakra UI, React Icons.
* **State/Data:** React Query (`@tanstack/react-query`).
* **Auth:** JWT stored in `localStorage` via `authStore`.

---

### 2. **Backend (API)**

* Runs locally (likely at `http://localhost:5080/api` or similar from your earlier MixERP setup).
* **CORS disabled in dev** (frontend & backend run on same origin or proxied).

  * No preflight issues when frontend calls `/api/customers`, `/api/auth/login`, etc.
* **Auth:** Bearer JWT header required for protected endpoints.

---

### 3. **Networking**

* **Proxy/Dev server handles paths** so frontend can call `/api/...` directly:

  * Vite or CRA proxy rule ensures `http://localhost:5173/api/*` → `http://localhost:5080/api/*`.
  * This way, **no CORS** headaches in development (browser sees same-origin).

---

### 4. **Auth Flow**

* On login:

  * User credentials sent to `/api/auth/login`.
  * Backend returns JWT → stored in `localStorage`.
  * `authStore.setToken(jwt)` notifies subscribers.
  * Router redirects to `/` (Dashboard).
* On logout:

  * `auth.logout()` clears token + notifies.
  * Redirects to `/login`.

---

### 5. **Dashboard**

* **Data source:** `/api/customers` (JWT required).
* **React Query** fetch → normalized in `useCustomers`.
* **Widgets:** KPI cards (total customers, distinct cities, with codes) + Top Customers.
* **States:** skeletons (loading), alert (error), empty-state card.

---

### 6. **Local Dev Defaults**

* **Frontend:** `http://localhost:5173` (Vite dev server).
* **Backend API:** `http://localhost:5080/api`.
* **Proxy setup:** avoids `Access-Control-Allow-Origin` issues.
* **JWT:** stored in browser storage, no refresh token for now.
* **No HTTPS requirement** in dev.

---

👉 This is a **development environment**: no CORS, JWT in localStorage, proxy handled by Vite.
👉 For **production** you’d enable CORS (or serve frontend + backend under one domain) and secure JWT (e.g., via HttpOnly cookies).

---
]