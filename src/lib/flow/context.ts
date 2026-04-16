export type FlowContext = {
  from: string;
  clienteId: string;
  cotizacionId: string;
  ordenId: string;
  cobroId: string;
};

function clean(value: string | null) {
  return (value || "").trim();
}

export function getFlowContext(): FlowContext {
  if (typeof window === "undefined") {
    return { from: "", clienteId: "", cotizacionId: "", ordenId: "", cobroId: "" };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    from: clean(params.get("from")),
    clienteId: clean(params.get("clienteId")),
    cotizacionId: clean(params.get("cotizacionId")),
    ordenId: clean(params.get("ordenId")),
    cobroId: clean(params.get("cobroId")),
  };
}

export function buildFlowUrl(path: string, params: Record<string, string | number | boolean | null | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (!text) continue;
    query.set(key, text);
  }

  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}

export function toClienteSnapshot(c: any) {
  if (!c) return null;
  return {
    id: c.id,
    nombre: c.nombre,
    documento: c.documento,
    telefono: c.telefono,
    email: c.email,
    direccion: c.direccion,
    ciudad: c.ciudad,
  };
}

export function addDays(dateIso: string, days: number) {
  const base = dateIso ? new Date(dateIso) : new Date();
  if (Number.isNaN(base.getTime())) return new Date().toISOString().slice(0, 10);
  base.setDate(base.getDate() + days);
  return base.toISOString().slice(0, 10);
}

export function serviciosFromCotizacionItems(items: any[] = []) {
  return items.map((it, idx) => ({
    id: it?.id || `srv_${idx + 1}`,
    descripcion: it?.nombre || "Servicio / ítem",
    cantidad: Number(it?.qty || 1),
    unitario: Number(it?.precio || 0),
    ivaPct: Number(it?.ivaPct || 0),
  }));
}

export function activosFromCotizacionItems(items: any[] = []) {
  return items.map((it, idx) => {
    const rawKind = String(it?.kind || "otro");
    const tipo =
      rawKind === "producto" ? "camara" :
      rawKind === "kit" ? "accesorio" :
      rawKind === "servicio" ? "otro" :
      "otro";

    return {
      id: it?.id || `act_${idx + 1}`,
      tipo,
      descripcion: it?.nombre || "Ítem entregado",
      cantidad: Number(it?.qty || 1),
      serial: "",
      ubicacion: "",
      notas: rawKind === "servicio" ? "Derivado de cotización" : "",
    };
  });
}
