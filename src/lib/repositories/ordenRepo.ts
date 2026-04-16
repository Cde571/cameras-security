export * from "../services/ordenService";

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
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  }

  return data as T;
}

function normalizeTemplates(raw: any): any[] {
  const items =
    Array.isArray(raw) ? raw :
    Array.isArray(raw?.items) ? raw.items :
    Array.isArray(raw?.templates) ? raw.templates :
    [];

  return items.map((tpl: any, index: number) => ({
    id: String(tpl?.id ?? `tpl-${index + 1}`),
    nombre: String(tpl?.nombre ?? tpl?.name ?? "Checklist"),
    descripcion: String(tpl?.descripcion ?? tpl?.description ?? ""),
    items: Array.isArray(tpl?.items) ? tpl.items : [],
    activo: Boolean(tpl?.activo ?? tpl?.active ?? true),
    ...tpl,
  }));
}

function fallbackTemplates(): any[] {
  return [
    {
      id: "checklist-general",
      nombre: "Checklist general",
      descripcion: "Plantilla base para órdenes de trabajo.",
      activo: true,
      items: [
        { id: "item-1", label: "Verificación de equipos", checked: false },
        { id: "item-2", label: "Instalación física", checked: false },
        { id: "item-3", label: "Pruebas funcionales", checked: false },
        { id: "item-4", label: "Entrega al cliente", checked: false }
      ]
    }
  ];
}

export async function listCheckListTemplates(): Promise<any[]> {
  if (typeof window === "undefined") return fallbackTemplates();

  const endpoints = [
    "/api/ordenes/checklists",
    "/api/ordenes/checklist-templates",
    "/api/checklists",
  ];

  for (const endpoint of endpoints) {
    try {
      const data = await apiFetch<any>(endpoint);
      const normalized = normalizeTemplates(data);
      if (normalized.length > 0) return normalized;
    } catch {
      // seguimos al siguiente endpoint
    }
  }

  return fallbackTemplates();
}

export async function listChecklistTemplates(): Promise<any[]> {
  return await listCheckListTemplates();
}