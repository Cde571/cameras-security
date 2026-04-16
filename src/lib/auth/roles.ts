import type { UserRole } from "./session";

export const ROUTE_ROLE_RULES: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/config", roles: ["admin"] },
  { prefix: "/reportes", roles: ["admin", "ventas"] },
  { prefix: "/cobros", roles: ["admin", "ventas"] },
  { prefix: "/pagos", roles: ["admin", "ventas"] },
];

const PUBLIC_PREFIXES = [
  "/auth/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/_astro/",
  "/favicon",
  "/assets/",
  "/images/",
  "/public/",
];

const PUBLIC_EXACT = new Set<string>(["/robots.txt", "/manifest.webmanifest"]);

export function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function getAllowedRolesForPath(pathname: string): UserRole[] | null {
  const match = ROUTE_ROLE_RULES.find((rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`));
  return match?.roles ?? null;
}

export function hasAnyRole(currentRole: UserRole, allowedRoles: UserRole[] | null) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(currentRole);
}
