type User = { id: string; username: string; roles?: string[] } | null;

export const auth = {
  get token() { return localStorage.getItem("token"); },
  set token(val: string | null) {
    if (val) localStorage.setItem("token", val);
    else localStorage.removeItem("token");
  },
  get user(): User { const v = localStorage.getItem("user"); return v ? JSON.parse(v) : null; },
  set user(val: User) { val ? localStorage.setItem("user", JSON.stringify(val)) : localStorage.removeItem("user"); },
  isAuthed() { return !!localStorage.getItem("token"); },
  logout() { this.token = null; this.user = null; }
};
