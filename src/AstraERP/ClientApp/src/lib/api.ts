import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// attach token from localStorage (simple dev approach)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { api };
