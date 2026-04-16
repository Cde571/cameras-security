import { clienteLocalService } from "./clienteLocalService";

type HistorialCliente = {
  cliente: any | null;
  cotizaciones: any[];
  ordenes: any[];
  cobros: any[];
  pagos: any[];
  actividad: any[];
};

function isBrowser() {
  return typeof window !== "undefined";
}

function isDemoMode() {
  if (!isBrowser()) return false;
  return window.localStorage.getItem("demoMode") === "true";
}

function readLocalJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("La API devolvió una respuesta no válida");
  }
}

async function request(url: string) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseJsonSafe(response);

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || `Error HTTP ${response.status}`);
  }

  return data;
}

function fallbackHistorial(clienteId: string): HistorialCliente {
  const cliente = clienteLocalService.obtenerPorId(clienteId) ?? null;
  const cotizaciones = readLocalJson<any[]>("cotizaciones", []).filter((x) => x?.clienteId === clienteId);
  const ordenes = readLocalJson<any[]>("ordenes", []).filter((x) => x?.clienteId === clienteId);
  const cobros = readLocalJson<any[]>("cobros", []).filter((x) => x?.clienteId === clienteId);
  const pagos = readLocalJson<any[]>("pagos", []).filter((x) => x?.clienteId === clienteId);

  const actividad = [
    ...cotizaciones.map((x) => ({
      tipo: "cotizacion",
      fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
      data: x,
    })),
    ...ordenes.map((x) => ({
      tipo: "orden",
      fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
      data: x,
    })),
    ...cobros.map((x) => ({
      tipo: "cobro",
      fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
      data: x,
    })),
    ...pagos.map((x) => ({
      tipo: "pago",
      fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
      data: x,
    })),
  ].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

  return {
    cliente,
    cotizaciones,
    ordenes,
    cobros,
    pagos,
    actividad,
  };
}

export async function obtenerHistorialCliente(clienteId: string): Promise<HistorialCliente> {
  try {
    if (isDemoMode()) {
      return fallbackHistorial(clienteId);
    }

    const [clienteRes, cobrosRes, pagosRes] = await Promise.allSettled([
      request(`/api/clientes/${clienteId}`),
      request(`/api/cobros?q=${encodeURIComponent(clienteId)}`),
      request(`/api/pagos?q=${encodeURIComponent(clienteId)}`),
    ]);

    const cliente =
      clienteRes.status === "fulfilled"
        ? (clienteRes.value?.item ?? null)
        : (clienteLocalService.obtenerPorId(clienteId) ?? null);

    const cobros =
      cobrosRes.status === "fulfilled"
        ? (Array.isArray(cobrosRes.value?.items)
            ? cobrosRes.value.items.filter((x: any) => x?.clienteId === clienteId)
            : [])
        : readLocalJson<any[]>("cobros", []).filter((x) => x?.clienteId === clienteId);

    const pagos =
      pagosRes.status === "fulfilled"
        ? (Array.isArray(pagosRes.value?.items)
            ? pagosRes.value.items.filter((x: any) => x?.clienteId === clienteId)
            : [])
        : readLocalJson<any[]>("pagos", []).filter((x) => x?.clienteId === clienteId);

    const cotizaciones = readLocalJson<any[]>("cotizaciones", []).filter((x) => x?.clienteId === clienteId);
    const ordenes = readLocalJson<any[]>("ordenes", []).filter((x) => x?.clienteId === clienteId);

    const actividad = [
      ...cotizaciones.map((x) => ({
        tipo: "cotizacion",
        fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
        data: x,
      })),
      ...ordenes.map((x) => ({
        tipo: "orden",
        fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
        data: x,
      })),
      ...cobros.map((x) => ({
        tipo: "cobro",
        fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
        data: x,
      })),
      ...pagos.map((x) => ({
        tipo: "pago",
        fecha: x?.updatedAt ?? x?.createdAt ?? new Date().toISOString(),
        data: x,
      })),
    ].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

    return {
      cliente,
      cotizaciones,
      ordenes,
      cobros,
      pagos,
      actividad,
    };
  } catch (error) {
    console.warn("[clienteHistorialService] fallback local:", error);
    return fallbackHistorial(clienteId);
  }
}

export const clienteHistorialService = {
  obtenerHistorialCliente,
};