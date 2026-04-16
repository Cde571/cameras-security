import crypto from "node:crypto";

export type UserRole = "admin" | "tecnico" | "ventas";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type SessionPayload = SessionUser & {
  exp: number;
};

export const SESSION_COOKIE_NAME = "session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim() || "";
  if (!secret) {
    throw new Error("SESSION_SECRET no está configurada.");
  }
  return secret;
}

function toBase64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signRaw(raw: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(raw).digest("base64url");
}

export function signSessionCookie(user: SessionUser, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const raw = toBase64Url(JSON.stringify(payload));
  const signature = signRaw(raw);

  return `${raw}.${signature}`;
}

export function verifySessionCookie(token?: string | null): SessionUser | null {
  try {
    if (!token) return null;

    const [raw, signature] = token.split(".");
    if (!raw || !signature) return null;

    const expected = signRaw(raw);
    if (signature.length !== expected.length) return null;

    const a = Buffer.from(signature);
    const b = Buffer.from(expected);

    if (!crypto.timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(fromBase64Url(raw)) as SessionPayload;
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const iterations = 100000;
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  if (!stored) return false;

  if (!stored.startsWith("pbkdf2$")) {
    return stored === password;
  }

  const [scheme, iterationsRaw, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterationsRaw || !salt || !hash) return false;

  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations)) return false;

  const candidate = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  const a = Buffer.from(candidate);
  const b = Buffer.from(hash);

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}