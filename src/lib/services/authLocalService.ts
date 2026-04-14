import {
  getUsuarioByEmail,
  listUsuarios,
  setUsuarioUltimoAcceso,
  type Usuario,
  type UsuarioRol,
} from "./configLocalService";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UsuarioRol;
};

export type Session = {
  token: string;
  user: User;
  createdAt: string;
};

const SESSION_KEY = "coti_session_v1";
const SPLASH_FLAG_KEY = "coti_show_login_splash";

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `tok_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function mapUsuarioToUser(u: Usuario): User {
  return {
    id: u.id,
    name: u.nombre,
    email: u.email,
    role: u.rol,
  };
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  return safeParse<Session | null>(localStorage.getItem(SESSION_KEY), null);
}

export function getCurrentUser(): User | null {
  return getSession()?.user ?? null;
}

export function isAuthenticated(): boolean {
  return !!getSession()?.user?.id;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function listAuthUsers() {
  return listUsuarios();
}

export function login(email: string, password: string): Session {
  if (typeof window === "undefined") throw new Error("login debe ejecutarse en el browser");

  const e = (email || "").trim().toLowerCase();
  const p = (password || "").trim();

  if (!e || !p) {
    throw new Error("Ingresa email y contraseña");
  }

  const found = getUsuarioByEmail(e);
  if (!found || found.password !== p) {
    throw new Error("Credenciales inválidas");
  }

  if (!found.activo) {
    throw new Error("Este usuario está inactivo");
  }

  const session: Session = {
    token: uid(),
    user: mapUsuarioToUser(found),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem(SPLASH_FLAG_KEY, "1");
  setUsuarioUltimoAcceso(found.id, session.createdAt);

  return session;
}

export function hasRole(roles: UsuarioRol[]) {
  const current = getCurrentUser();
  if (!current) return false;
  return roles.includes(current.role);
}
