// src/lib/api.ts
import axios, { AxiosError } from "axios";

/** where we store the jwt */
export const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY ?? "jwt";

/** base url: use relative '/api' in dev (Vite proxy), env var in prod */
const API_BASE = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE ?? "/api");

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  // withCredentials: false — not needed unless you use cookies
});

// ---- helpers (nice for tests / login flows) ----
export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

// ---- request interceptor: attach auth + default headers ----
api.interceptors.request.use((cfg) => {
  const t = getToken();
  cfg.headers = cfg.headers ?? {};
  if (!cfg.headers["Accept"]) cfg.headers["Accept"] = "application/json";
  if (!cfg.headers["Content-Type"] && cfg.method !== "get") {
    cfg.headers["Content-Type"] = "application/json";
  }
  if (t) (cfg.headers as any).Authorization = `Bearer ${t}`;

  if (import.meta.env.DEV) {
    console.debug("[API req]", {
      method: (cfg.method ?? "get").toUpperCase(),
      url: (cfg.baseURL ?? "") + (cfg.url ?? ""),
      params: cfg.params,
      hasAuth: !!t,
    });
  }
  return cfg;
});

// ---- response interceptor: log errors (dev) + basic 401 handling ----
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    if (import.meta.env.DEV) {
      console.error("API error:", {
        url: (err.config?.baseURL ?? "") + (err.config?.url ?? ""),
        status: err.response?.status,
        data: err.response?.data,
      });
    }

    // simple 401 strategy: clear token so the app can redirect to login
    if (err.response?.status === 401) {
      setToken(null);
      // optional: location.assign('/login');
    }
    return Promise.reject(err);
  }
);
