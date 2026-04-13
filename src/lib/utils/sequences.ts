function hasWindow() {
  return typeof window !== "undefined";
}

export function nextSequence(key: string, prefix: string) {
  if (!hasWindow()) return `${prefix}-0001`;

  const raw = localStorage.getItem(key);
  const current = Number(raw || 0) + 1;
  localStorage.setItem(key, String(current));
  return `${prefix}-${String(current).padStart(4, "0")}`;
}
