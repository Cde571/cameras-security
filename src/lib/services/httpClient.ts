export function isBrowser() {
  return typeof window !== "undefined";
}

export function isDemoMode() {
  if (!isBrowser()) return false;
  return window.localStorage.getItem("demoMode") === "true";
}

export async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("La API devolvió una respuesta no válida");
  }
}

export async function apiRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (response.status === 204) return null;

  const data = await parseJsonSafe(response);

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || `Error HTTP ${response.status}`);
  }

  return data;
}