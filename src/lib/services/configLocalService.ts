export type EmpresaConfig = {
  nombre: string;
  nit?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  website?: string;
  logoUrl?: string;
};

export type Impuesto = {
  id: string;
  nombre: string;     // "IVA"
  porcentaje: number; // 19
  activo: boolean;
};

export type Numeracion = {
  cotizacionPrefix: string;
  cobroPrefix: string;
  ordenPrefix: string;
  actaPrefix: string;
  nextCotizacion: number;
  nextCobro: number;
  nextOrden: number;
  nextActa: number;
};

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "tecnico" | "ventas";
  activo: boolean;
};

export type Plantilla = {
  id: string;
  tipo: "cotizacion" | "acta" | "cobro";
  nombre: string;
  contenido: string;
};

const K_EMPRESA = "coti_cfg_empresa_v1";
const K_IMPUESTOS = "coti_cfg_impuestos_v1";
const K_NUM = "coti_cfg_numeracion_v1";
const K_USERS = "coti_cfg_usuarios_v1";
const K_TPL = "coti_cfg_plantillas_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

function uid(prefix: string) {
  return (globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

function seedIfEmpty() {
  if (typeof window === "undefined") return;

  const e = safeParse<EmpresaConfig | null>(localStorage.getItem(K_EMPRESA), null);
  if (!e) {
    localStorage.setItem(K_EMPRESA, JSON.stringify({
      nombre: "Technological Cameras",
      nit: "900.000.000-0",
      telefono: "3000000000",
      email: "admin@empresa.com",
      ciudad: "Medellín",
      direccion: "Cra 00 # 00-00",
      website: "",
      logoUrl: "",
    } satisfies EmpresaConfig));
  }

  const imp = safeParse<Impuesto[] | null>(localStorage.getItem(K_IMPUESTOS), null);
  if (!imp) {
    localStorage.setItem(K_IMPUESTOS, JSON.stringify([
      { id: uid("tax"), nombre: "IVA", porcentaje: 19, activo: true },
      { id: uid("tax"), nombre: "Retención", porcentaje: 2.5, activo: false },
    ] satisfies Impuesto[]));
  }

  const num = safeParse<Numeracion | null>(localStorage.getItem(K_NUM), null);
  if (!num) {
    localStorage.setItem(K_NUM, JSON.stringify({
      cotizacionPrefix: "COT",
      cobroPrefix: "CC",
      ordenPrefix: "OT",
      actaPrefix: "ACT",
      nextCotizacion: 1,
      nextCobro: 1,
      nextOrden: 1,
      nextActa: 1,
    } satisfies Numeracion));
  }

  const users = safeParse<Usuario[] | null>(localStorage.getItem(K_USERS), null);
  if (!users) {
    localStorage.setItem(K_USERS, JSON.stringify([
      { id: uid("usr"), nombre: "Admin", email: "admin@empresa.com", rol: "admin", activo: true },
      { id: uid("usr"), nombre: "Técnico 1", email: "tecnico@empresa.com", rol: "tecnico", activo: true },
    ] satisfies Usuario[]));
  }

  const tpl = safeParse<Plantilla[] | null>(localStorage.getItem(K_TPL), null);
  if (!tpl) {
    localStorage.setItem(K_TPL, JSON.stringify([
      { id: uid("tpl"), tipo: "cotizacion", nombre: "Cotización estándar", contenido: "Condiciones: garantía 12 meses. Tiempo de entrega: 3-5 días." },
      { id: uid("tpl"), tipo: "acta", nombre: "Acta estándar", contenido: "Se realiza entrega y pruebas básicas. Se capacita al usuario." },
      { id: uid("tpl"), tipo: "cobro", nombre: "Cuenta de cobro estándar", contenido: "Favor consignar a la cuenta X. Plazo: 5 días." },
    ] satisfies Plantilla[]));
  }
}

export function getEmpresa(): EmpresaConfig {
  if (typeof window === "undefined") return { nombre: "" };
  seedIfEmpty();
  return safeParse<EmpresaConfig>(localStorage.getItem(K_EMPRESA), { nombre: "" });
}

export function setEmpresa(patch: Partial<EmpresaConfig>) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const cur = getEmpresa();
  localStorage.setItem(K_EMPRESA, JSON.stringify({ ...cur, ...patch }));
}

export function listImpuestos(): Impuesto[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  return safeParse<Impuesto[]>(localStorage.getItem(K_IMPUESTOS), []);
}

export function upsertImpuesto(item: Partial<Impuesto> & { nombre: string; porcentaje: number }) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const list = listImpuestos();
  if (item.id) {
    const idx = list.findIndex(x => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item } as Impuesto;
    localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
    return;
  }
  list.unshift({ id: uid("tax"), activo: true, ...item } as Impuesto);
  localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
}

export function deleteImpuesto(id: string) {
  if (typeof window === "undefined") return;
  const list = listImpuestos().filter(x => x.id !== id);
  localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
}

export function getNumeracion(): Numeracion {
  if (typeof window === "undefined") {
    return {
      cotizacionPrefix: "COT", cobroPrefix: "CC", ordenPrefix: "OT", actaPrefix: "ACT",
      nextCotizacion: 1, nextCobro: 1, nextOrden: 1, nextActa: 1,
    };
  }
  seedIfEmpty();
  return safeParse<Numeracion>(localStorage.getItem(K_NUM), {
    cotizacionPrefix: "COT", cobroPrefix: "CC", ordenPrefix: "OT", actaPrefix: "ACT",
    nextCotizacion: 1, nextCobro: 1, nextOrden: 1, nextActa: 1,
  });
}

export function setNumeracion(patch: Partial<Numeracion>) {
  if (typeof window === "undefined") return;
  const cur = getNumeracion();
  localStorage.setItem(K_NUM, JSON.stringify({ ...cur, ...patch }));
}

export function listUsuarios(): Usuario[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  return safeParse<Usuario[]>(localStorage.getItem(K_USERS), []);
}

export function upsertUsuario(item: Partial<Usuario> & { nombre: string; email: string; rol: Usuario["rol"] }) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const list = listUsuarios();
  if (item.id) {
    const idx = list.findIndex(x => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item } as Usuario;
    localStorage.setItem(K_USERS, JSON.stringify(list));
    return;
  }
  list.unshift({ id: uid("usr"), activo: true, ...item } as Usuario);
  localStorage.setItem(K_USERS, JSON.stringify(list));
}

export function deleteUsuario(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_USERS, JSON.stringify(listUsuarios().filter(u => u.id !== id)));
}

export function listPlantillas(): Plantilla[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  return safeParse<Plantilla[]>(localStorage.getItem(K_TPL), []);
}

export function upsertPlantilla(item: Partial<Plantilla> & { tipo: Plantilla["tipo"]; nombre: string; contenido: string }) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const list = listPlantillas();
  if (item.id) {
    const idx = list.findIndex(x => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item } as Plantilla;
    localStorage.setItem(K_TPL, JSON.stringify(list));
    return;
  }
  list.unshift({ id: uid("tpl"), ...item } as Plantilla);
  localStorage.setItem(K_TPL, JSON.stringify(list));
}

export function deletePlantilla(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_TPL, JSON.stringify(listPlantillas().filter(t => t.id !== id)));
}

export function exportBackupJSON(): string {
  if (typeof window === "undefined") return "{}";
  seedIfEmpty();
  const payload = {
    version: 1,
    empresa: getEmpresa(),
    impuestos: listImpuestos(),
    numeracion: getNumeracion(),
    usuarios: listUsuarios(),
    plantillas: listPlantillas(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(payload, null, 2);
}

export function restoreBackupJSON(text: string) {
  if (typeof window === "undefined") return;
  const data = JSON.parse(text);
  if (!data || typeof data !== "object") throw new Error("Backup inválido");

  if (data.empresa) localStorage.setItem(K_EMPRESA, JSON.stringify(data.empresa));
  if (data.impuestos) localStorage.setItem(K_IMPUESTOS, JSON.stringify(data.impuestos));
  if (data.numeracion) localStorage.setItem(K_NUM, JSON.stringify(data.numeracion));
  if (data.usuarios) localStorage.setItem(K_USERS, JSON.stringify(data.usuarios));
  if (data.plantillas) localStorage.setItem(K_TPL, JSON.stringify(data.plantillas));
}
