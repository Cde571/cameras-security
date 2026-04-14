/** API-first service with LocalService fallback. */
type FetchOpts = RequestInit & { json?: any };

async function apiFetch<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any),
  };

  const init: RequestInit = {
    ...opts,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  };

  const res = await fetch(url, init);
  const text = await res.text();

  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data as T;
}

const hasWindow = () => typeof window !== "undefined";

import * as Clientes from "./clienteLocalService";
import * as Productos from "./productoLocalService";
import * as Cotizaciones from "./cotizacionLocalService";
import * as Ordenes from "./ordenLocalService";
import * as Actas from "./actaLocalService";
import * as CobrosPagos from "./cobroPagoLocalService";
import * as Config from "./configLocalService";

export type BackupPayload = {
  meta: { app: string; version: string; exportedAt: string };
  data: {
    clientes: any[];
    productos: any[];
    cotizaciones: any[];
    ordenes: any[];
    actas: any[];
    cobros: any[];
    pagos: any[];
    config: any;
  };
};

const API = "/api/backup";

export async function exportBackup(): Promise<BackupPayload> {
  if (!hasWindow()) throw new Error("exportBackup solo en browser");
  try {
    return await apiFetch<BackupPayload>(API);
  } catch {
    return {
      meta: {
        app: "cotizaciones",
        version: "v1",
        exportedAt: new Date().toISOString(),
      },
      data: {
        clientes: Clientes.listClientes(""),
        productos: Productos.listProductos(""),
        cotizaciones: Cotizaciones.listCotizaciones(""),
        ordenes: Ordenes.listOrdenes(""),
        actas: Actas.listActas(""),
        cobros: CobrosPagos.listCobros(""),
        pagos: CobrosPagos.listPagos(""),
        config: {
          empresa: Config.getEmpresa(),
          impuestos: Config.listImpuestos(),
          numeracion: Config.getNumeracion(),
          usuarios: Config.listUsuarios(),
          plantillas: Config.listPlantillas(),
        },
      },
    };
  }
}

export async function importBackup(payload: BackupPayload): Promise<{ ok: true }> {
  if (!hasWindow()) throw new Error("importBackup solo en browser");
  try {
    return await apiFetch<{ ok: true }>(API, { method: "POST", json: payload });
  } catch {
    localStorage.setItem("coti_clientes_v1", JSON.stringify(payload.data.clientes ?? []));
    localStorage.setItem("coti_productos_v1", JSON.stringify(payload.data.productos ?? []));
    localStorage.setItem("coti_cotizaciones_v1", JSON.stringify(payload.data.cotizaciones ?? []));
    localStorage.setItem("coti_ordenes_v1", JSON.stringify(payload.data.ordenes ?? []));
    localStorage.setItem("coti_actas_v1", JSON.stringify(payload.data.actas ?? []));
    localStorage.setItem("coti_cobros_v1", JSON.stringify(payload.data.cobros ?? []));
    localStorage.setItem("coti_pagos_v1", JSON.stringify(payload.data.pagos ?? []));
    return { ok: true };
  }
}
