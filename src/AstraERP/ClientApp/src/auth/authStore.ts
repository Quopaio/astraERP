// authStore.ts
type Listener = () => void;

class AuthStore {
  private token: string | null = null;
  private exp: number | null = null; // unix seconds (optional)
  private listeners = new Set<Listener>();

  constructor() {
    // hydrate from storage on first import
    const raw = localStorage.getItem("jwt");
    if (raw) this.setToken(raw);
    window.addEventListener("storage", (e) => {
      if (e.key === "jwt") {
        this.setToken(e.newValue);
      }
    });
  }

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  private notify = () => this.listeners.forEach((l) => l());

  setToken = (jwt: string | null) => {
    this.token = jwt;
    // OPTIONAL: decode exp if your JWT has it
    try {
      this.exp = jwt ? JSON.parse(atob(jwt.split(".")[1]))?.exp ?? null : null;
    } catch {
      this.exp = null;
    }
    if (jwt) localStorage.setItem("jwt", jwt);
    else localStorage.removeItem("jwt");
    this.notify();
  };

  logout = () => this.setToken(null);

  isAuthed = () => {
    if (!this.token) return false;
    if (!this.exp) return true; // no exp claim → treat as session
    const now = Math.floor(Date.now() / 1000);
    return now < this.exp;
  };

  getToken = () => this.token;
}

export const auth = new AuthStore();
