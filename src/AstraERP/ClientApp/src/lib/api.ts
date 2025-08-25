import axios from "axios";

const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY ?? "jwt";

// In dev: use relative '/api' so Vite proxy handles it (no CORS).
// In prod: use VITE_API_BASE or default to '/api' if not set.
const API_BASE =
  import.meta.env.DEV
    ? "/api"
    : (import.meta.env.VITE_API_BASE ?? "/api");

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// helpful logging (dev only)
if (import.meta.env.DEV) {
  api.interceptors.response.use(
    (r) => r,
    (err) => {
      console.error("API error:", {
        url: (err.config?.baseURL ?? "") + (err.config?.url ?? ""),
        status: err.response?.status,
        data: err.response?.data,
      });
      return Promise.reject(err);
    }
  );
}
