export * from "../services/cotizacionService";

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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function pickClienteId(source: any): string {
  return String(
    source?.clienteId ??
    source?.cliente_id ??
    source?.cliente?.id ??
    ""
  );
}

function pickItems(source: any): any[] {
  const raw =
    Array.isArray(source?.items) ? source.items :
    Array.isArray(source?.lineas) ? source.lineas :
    Array.isArray(source?.detalles) ? source.detalles :
    [];

  return raw.map((item: any) => {
    const cantidad = Number(item?.cantidad ?? item?.qty ?? 1);
    const valorUnitario = Number(
      item?.valorUnitario ??
      item?.valor_unitario ??
      item?.precio ??
      item?.unitPrice ??
      0
    );

    return {
      productoId: item?.productoId ?? item?.producto_id ?? item?.producto?.id ?? null,
      descripcion: String(item?.descripcion ?? item?.concepto ?? item?.nombre ?? ""),
      cantidad,
      valorUnitario,
      subtotal: Number(item?.subtotal ?? (cantidad * valorUnitario)),
    };
  });
}

function buildVersionNumber(source: any): number {
  const current = Number(source?.version ?? 1);
  return Number.isFinite(current) && current > 0 ? current + 1 : 2;
}

function buildNumero(source: any, nextVersion: number): string {
  const base = String(source?.numero ?? `COT-${Date.now()}`).trim() || `COT-${Date.now()}`;

  if (/-V\d+$/i.test(base)) {
    return base.replace(/-V\d+$/i, `-V${nextVersion}`);
  }

  return `${base}-V${nextVersion}`;
}

export async function createVersionFrom(cotizacionId: string): Promise<any> {
  const id = String(cotizacionId ?? "").trim();
  if (!id) {
    throw new Error("Falta el id de la cotización base.");
  }

  const sourceRes = await apiFetch<any>(`/api/cotizaciones/${encodeURIComponent(id)}`);
  const source = sourceRes?.item ?? sourceRes;

  if (!source) {
    throw new Error("No se encontró la cotización base.");
  }

  const nextVersion = buildVersionNumber(source);

  const payload = {
    numero: buildNumero(source, nextVersion),
    version: nextVersion,
    clienteId: pickClienteId(source),
    fecha: String(source?.fecha ?? todayIso()),
    vigenciaDias: Number(source?.vigenciaDias ?? source?.vigencia_dias ?? 30),
    asunto: String(source?.asunto ?? ""),
    status: "borrador",
    notas: String(source?.notas ?? ""),
    origenId: String(source?.id ?? id),
    items: pickItems(source),
  };

  const created = await apiFetch<any>("/api/cotizaciones", {
    method: "POST",
    json: payload,
  });

  return created?.item ?? created;
}