export type UserRole = "admin" | "tecnico" | "ventas";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const CACHE_KEY = "coti_auth_user_v3";

function readCache(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeCache(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    sessionStorage.removeItem(CACHE_KEY);
    return;
  }
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(user));
}

function clearLegacy() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("coti_session_v1");
  sessionStorage.removeItem("coti_show_login_splash");
}

export function getCurrentUser(): User | null {
  return readCache();
}

export async function fetchCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;

  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      writeCache(null);
      return null;
    }

    const data = await res.json();
    const user = (data?.user ?? null) as User | null;
    writeCache(user);
    return user;
  } catch {
    writeCache(null);
    return null;
  }
}

export async function login(email: string, password: string): Promise<User> {
  clearLegacy();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.user) {
    throw new Error(data?.error || "No fue posible iniciar sesión");
  }

  writeCache(data.user);
  sessionStorage.setItem("coti_show_login_splash", "1");
  return data.user as User;
}

export async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    writeCache(null);
    clearLegacy();
  }
}

export function isAuthenticated() {
  return !!getCurrentUser()?.id;
}

export function hasRole(roles: UserRole[]) {
  const current = getCurrentUser();
  if (!current) return false;
  return roles.includes(current.role);
}
