import crypto from "node:crypto";

const COOKIE_NAME = "session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 horas

function getSecret() {
  const secret = import.meta.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta SESSION_SECRET en el .env");
  }
  return secret;
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

export type SessionUser = {
  id: string;
  nombre: string;
  email: string;
  role: string;
};

export function createSessionToken(user: SessionUser) {
  const payload = {
    ...user,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };

  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function readSessionToken(token?: string | null): SessionUser | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expected = sign(encoded);

  if (signature !== expected) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload?.exp || Date.now() > Number(payload.exp)) return null;

    return {
      id: String(payload.id ?? ""),
      nombre: String(payload.nombre ?? ""),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? "ventas"),
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(headers: Headers, user: SessionUser) {
  const token = createSessionToken(user);
  const secure = import.meta.env.NODE_ENV === "production";

  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}${secure ? "; Secure" : ""}`
  );
}

export function clearSessionCookie(headers: Headers) {
  const secure = import.meta.env.NODE_ENV === "production";

  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`
  );
}

export function getSessionFromRequest(request: Request): SessionUser | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pairs = cookieHeader.split(";").map((x) => x.trim());
  const raw = pairs.find((x) => x.startsWith(`${COOKIE_NAME}=`));
  const token = raw ? raw.substring(`${COOKIE_NAME}=`.length) : null;
  return readSessionToken(token);
}

export const sessionCookieName = COOKIE_NAME;