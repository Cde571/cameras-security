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
  nombre: string;
  porcentaje: number;
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

export type UsuarioRol = "admin" | "tecnico" | "ventas";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  activo: boolean;
  password: string;
  ultimoAcceso?: string;
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
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function uid(prefix: string) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function defaultPasswordForRole(rol: UsuarioRol) {
  if (rol === "admin") return "admin123";
  if (rol === "tecnico") return "tecnico123";
  return "ventas123";
}

function migrateUsuarios(list: any[]): Usuario[] {
  return (Array.isArray(list) ? list : []).map((u, idx) => {
    const rol = (["admin", "tecnico", "ventas"].includes(u?.rol) ? u.rol : "ventas") as UsuarioRol;
    return {
      id: u?.id || uid(`usr_${idx}`),
      nombre: u?.nombre || "Usuario",
      email: (u?.email || "").toString().trim().toLowerCase(),
      rol,
      activo: typeof u?.activo === "boolean" ? u.activo : true,
      password: (u?.password || "").toString().trim() || defaultPasswordForRole(rol),
      ultimoAcceso: u?.ultimoAcceso,
    };
  });
}

function seedIfEmpty() {
  if (typeof window === "undefined") return;

  const empresa = safeParse<EmpresaConfig | null>(localStorage.getItem(K_EMPRESA), null);
  if (!empresa) {
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

  const impuestos = safeParse<Impuesto[] | null>(localStorage.getItem(K_IMPUESTOS), null);
  if (!impuestos) {
    localStorage.setItem(K_IMPUESTOS, JSON.stringify([
      { id: uid("tax"), nombre: "IVA", porcentaje: 19, activo: true },
      { id: uid("tax"), nombre: "Retención", porcentaje: 2.5, activo: false },
    ] satisfies Impuesto[]));
  }

  const numeracion = safeParse<Numeracion | null>(localStorage.getItem(K_NUM), null);
  if (!numeracion) {
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

  const usersRaw = safeParse<any[] | null>(localStorage.getItem(K_USERS), null);
  if (!usersRaw || usersRaw.length === 0) {
    const seed: Usuario[] = [
      { id: uid("usr"), nombre: "Admin", email: "admin@empresa.com", rol: "admin", activo: true, password: "admin123" },
      { id: uid("usr"), nombre: "Técnico 1", email: "tecnico@empresa.com", rol: "tecnico", activo: true, password: "tecnico123" },
      { id: uid("usr"), nombre: "Ventas 1", email: "ventas@empresa.com", rol: "ventas", activo: true, password: "ventas123" },
    ];
    localStorage.setItem(K_USERS, JSON.stringify(seed));
  } else {
    localStorage.setItem(K_USERS, JSON.stringify(migrateUsuarios(usersRaw)));
  }

  const plantillas = safeParse<Plantilla[] | null>(localStorage.getItem(K_TPL), null);
  if (!plantillas) {
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
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item } as Impuesto;
    localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
    return;
  }
  list.unshift({ id: uid("tax"), activo: true, ...item } as Impuesto);
  localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
}

export function deleteImpuesto(id: string) {
  if (typeof window === "undefined") return;
  const list = listImpuestos().filter((x) => x.id !== id);
  localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
}

export function getNumeracion(): Numeracion {
  if (typeof window === "undefined") {
    return {
      cotizacionPrefix: "COT",
      cobroPrefix: "CC",
      ordenPrefix: "OT",
      actaPrefix: "ACT",
      nextCotizacion: 1,
      nextCobro: 1,
      nextOrden: 1,
      nextActa: 1,
    };
  }
  seedIfEmpty();
  return safeParse<Numeracion>(localStorage.getItem(K_NUM), {
    cotizacionPrefix: "COT",
    cobroPrefix: "CC",
    ordenPrefix: "OT",
    actaPrefix: "ACT",
    nextCotizacion: 1,
    nextCobro: 1,
    nextOrden: 1,
    nextActa: 1,
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
  return migrateUsuarios(safeParse<any[]>(localStorage.getItem(K_USERS), []));
}

export function getUsuario(id: string): Usuario | null {
  return listUsuarios().find((u) => u.id === id) ?? null;
}

export function getUsuarioByEmail(email: string): Usuario | null {
  const e = (email || "").trim().toLowerCase();
  return listUsuarios().find((u) => u.email.toLowerCase() === e) ?? null;
}

export function upsertUsuario(
  item: Partial<Usuario> & { nombre: string; email: string; rol: Usuario["rol"] }
) {
  if (typeof window === "undefined") return;
  seedIfEmpty();

  const list = listUsuarios();
  const normalizedEmail = item.email.trim().toLowerCase();

  const duplicated = list.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.id !== item.id
  );
  if (duplicated) {
    throw new Error("Ya existe un usuario con ese email");
  }

  if (item.id) {
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      const current = list[idx];
      list[idx] = {
        ...current,
        ...item,
        email: normalizedEmail,
        password: (item.password || current.password || defaultPasswordForRole(item.rol)).trim(),
      } as Usuario;
      localStorage.setItem(K_USERS, JSON.stringify(list));
      return;
    }
  }

  list.unshift({
    id: uid("usr"),
    activo: typeof item.activo === "boolean" ? item.activo : true,
    nombre: item.nombre.trim(),
    email: normalizedEmail,
    rol: item.rol,
    password: (item.password || defaultPasswordForRole(item.rol)).trim(),
    ultimoAcceso: item.ultimoAcceso,
  });
  localStorage.setItem(K_USERS, JSON.stringify(list));
}

export function setUsuarioUltimoAcceso(id: string, isoDate = new Date().toISOString()) {
  if (typeof window === "undefined") return;
  const list = listUsuarios();
  const idx = list.findIndex((u) => u.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], ultimoAcceso: isoDate };
  localStorage.setItem(K_USERS, JSON.stringify(list));
}

export function deleteUsuario(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_USERS, JSON.stringify(listUsuarios().filter((u) => u.id !== id)));
}

export function listPlantillas(): Plantilla[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  return safeParse<Plantilla[]>(localStorage.getItem(K_TPL), []);
}

export function upsertPlantilla(
  item: Partial<Plantilla> & { tipo: Plantilla["tipo"]; nombre: string; contenido: string }
) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const list = listPlantillas();
  if (item.id) {
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item } as Plantilla;
    localStorage.setItem(K_TPL, JSON.stringify(list));
    return;
  }
  list.unshift({ id: uid("tpl"), ...item } as Plantilla);
  localStorage.setItem(K_TPL, JSON.stringify(list));
}

export function deletePlantilla(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_TPL, JSON.stringify(listPlantillas().filter((t) => t.id !== id)));
}

export function exportBackupJSON(): string {
  if (typeof window === "undefined") return "{}";
  seedIfEmpty();
  const payload = {
    version: 2,
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
  if (data.usuarios) localStorage.setItem(K_USERS, JSON.stringify(migrateUsuarios(data.usuarios)));
  if (data.plantillas) localStorage.setItem(K_TPL, JSON.stringify(data.plantillas));
}
