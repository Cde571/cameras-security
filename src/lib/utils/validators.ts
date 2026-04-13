export function isRequired(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function isPositiveNumber(value: unknown) {
  return Number(value) > 0;
}

export function minLength(value: string, len: number) {
  return String(value || "").trim().length >= len;
}
