import crypto from 'node:crypto';

const SECRET = process.env.SESSION_SECRET || "dev_secret_change_me";
function b64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromB64url(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  return Buffer.from(base64, "base64");
}
function sign(data) {
  return b64url(crypto.createHmac("sha256", SECRET).update(data).digest());
}
function createSessionCookie(payload) {
  const body = { ...payload, iat: Date.now() };
  const raw = JSON.stringify(body);
  const token = `${b64url(raw)}.${sign(raw)}`;
  return token;
}
function verifySessionCookie(token) {
  if (!token) return null;
  const [p1, p2] = token.split(".");
  if (!p1 || !p2) return null;
  const raw = fromB64url(p1).toString("utf8");
  const expected = sign(raw);
  if (expected !== p2) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export { createSessionCookie as c, verifySessionCookie as v };
