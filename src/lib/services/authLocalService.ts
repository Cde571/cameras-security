export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type Session = {
  token: string;
  user: User;
  createdAt: string;
};

const SESSION_KEY = "coti_session_v1";
const USERS_KEY = "coti_users_v1";

type LocalUser = User & { password: string };

function safeParse<T>(value: string | null, fallback: T): T {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `u_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

function seedUsersIfEmpty() {
  if (typeof window === "undefined") return;
  const list = safeParse<LocalUser[]>(localStorage.getItem(USERS_KEY), []);
  if (list.length > 0) return;

  const seed: LocalUser[] = [
    {
      id: uid(),
      name: "Admin",
      email: "admin@empresa.com",
      role: "admin",
      password: "admin123",
    },
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  return safeParse<Session | null>(localStorage.getItem(SESSION_KEY), null);
}

export function isAuthenticated(): boolean {
  return !!getSession();
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function login(email: string, password: string): Session {
  if (typeof window === "undefined") throw new Error("login debe ejecutarse en el browser");
  seedUsersIfEmpty();

  const e = (email || "").trim().toLowerCase();
  const p = (password || "").trim();

  const users = safeParse<LocalUser[]>(localStorage.getItem(USERS_KEY), []);
  const found = users.find(u => u.email.toLowerCase() === e);

  if (!found || found.password !== p) {
    throw new Error("Credenciales inválidas");
  }

  const session: Session = {
    token: `tok_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    user: { id: found.id, name: found.name, email: found.email, role: found.role },
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
