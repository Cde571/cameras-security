export function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function fail(status: number, message: string, details?: any) {
  return json(
    {
      ok: false,
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    status
  );
}

export async function readJson(request: Request) {
  return request.json().catch(() => ({}));
}

export function asString(value: any, fallback = ""): string {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

export function asNullableString(value: any): string | null {
  const v = asString(value, "");
  return v ? v : null;
}

export function asNumber(value: any, fallback = 0): number {
  const n =
    typeof value === "string"
      ? Number(value.replace(/\./g, "").replace(",", "."))
      : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function asBoolean(value: any, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "si", "sí", "yes", "activo"].includes(normalized)) return true;
    if (["false", "0", "no", "inactive", "inactivo"].includes(normalized)) return false;
  }
  if (typeof value === "number") return value !== 0;
  return fallback;
}

export function toIsoDate(value: any, fallback?: string): string {
  if (!value) return fallback || new Date().toISOString().slice(0, 10);
  const s = String(value).slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return fallback || new Date().toISOString().slice(0, 10);
  return s;
}

export function toArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}
