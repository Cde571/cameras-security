const K_EMPRESA = "coti_cfg_empresa_v1";
const K_IMPUESTOS = "coti_cfg_impuestos_v1";
const K_NUM = "coti_cfg_numeracion_v1";
const K_USERS = "coti_cfg_usuarios_v1";
const K_TPL = "coti_cfg_plantillas_v1";
function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function uid(prefix) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function defaultPasswordForRole(rol) {
  if (rol === "admin") return "admin123";
  if (rol === "tecnico") return "tecnico123";
  return "ventas123";
}
function migrateUsuarios(list) {
  return (Array.isArray(list) ? list : []).map((u, idx) => {
    const rol = ["admin", "tecnico", "ventas"].includes(u?.rol) ? u.rol : "ventas";
    return {
      id: u?.id || uid(`usr_${idx}`),
      nombre: u?.nombre || "Usuario",
      email: (u?.email || "").toString().trim().toLowerCase(),
      rol,
      activo: typeof u?.activo === "boolean" ? u.activo : true,
      password: (u?.password || "").toString().trim() || defaultPasswordForRole(rol),
      ultimoAcceso: u?.ultimoAcceso
    };
  });
}
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const empresa = safeParse(localStorage.getItem(K_EMPRESA), null);
  if (!empresa) {
    localStorage.setItem(K_EMPRESA, JSON.stringify({
      nombre: "Technological Cameras",
      nit: "900.000.000-0",
      telefono: "3000000000",
      email: "admin@empresa.com",
      ciudad: "Medellín",
      direccion: "Cra 00 # 00-00",
      website: "",
      logoUrl: ""
    }));
  }
  const impuestos = safeParse(localStorage.getItem(K_IMPUESTOS), null);
  if (!impuestos) {
    localStorage.setItem(K_IMPUESTOS, JSON.stringify([
      { id: uid("tax"), nombre: "IVA", porcentaje: 19, activo: true },
      { id: uid("tax"), nombre: "Retención", porcentaje: 2.5, activo: false }
    ]));
  }
  const numeracion = safeParse(localStorage.getItem(K_NUM), null);
  if (!numeracion) {
    localStorage.setItem(K_NUM, JSON.stringify({
      cotizacionPrefix: "COT",
      cobroPrefix: "CC",
      ordenPrefix: "OT",
      actaPrefix: "ACT",
      nextCotizacion: 1,
      nextCobro: 1,
      nextOrden: 1,
      nextActa: 1
    }));
  }
  const usersRaw = safeParse(localStorage.getItem(K_USERS), null);
  if (!usersRaw || usersRaw.length === 0) {
    const seed = [
      { id: uid("usr"), nombre: "Admin", email: "admin@empresa.com", rol: "admin", activo: true, password: "admin123" },
      { id: uid("usr"), nombre: "Técnico 1", email: "tecnico@empresa.com", rol: "tecnico", activo: true, password: "tecnico123" },
      { id: uid("usr"), nombre: "Ventas 1", email: "ventas@empresa.com", rol: "ventas", activo: true, password: "ventas123" }
    ];
    localStorage.setItem(K_USERS, JSON.stringify(seed));
  } else {
    localStorage.setItem(K_USERS, JSON.stringify(migrateUsuarios(usersRaw)));
  }
  const plantillas = safeParse(localStorage.getItem(K_TPL), null);
  if (!plantillas) {
    localStorage.setItem(K_TPL, JSON.stringify([
      { id: uid("tpl"), tipo: "cotizacion", nombre: "Cotización estándar", contenido: "Condiciones: garantía 12 meses. Tiempo de entrega: 3-5 días." },
      { id: uid("tpl"), tipo: "acta", nombre: "Acta estándar", contenido: "Se realiza entrega y pruebas básicas. Se capacita al usuario." },
      { id: uid("tpl"), tipo: "cobro", nombre: "Cuenta de cobro estándar", contenido: "Favor consignar a la cuenta X. Plazo: 5 días." }
    ]));
  }
}
function getEmpresa() {
  if (typeof window === "undefined") return { nombre: "" };
  seedIfEmpty();
  return safeParse(localStorage.getItem(K_EMPRESA), { nombre: "" });
}
function setEmpresa(patch) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const cur = getEmpresa();
  localStorage.setItem(K_EMPRESA, JSON.stringify({ ...cur, ...patch }));
}
function listImpuestos() {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  return safeParse(localStorage.getItem(K_IMPUESTOS), []);
}
function upsertImpuesto(item) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const list = listImpuestos();
  if (item.id) {
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item };
    localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
    return;
  }
  list.unshift({ id: uid("tax"), activo: true, ...item });
  localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
}
function deleteImpuesto(id) {
  if (typeof window === "undefined") return;
  const list = listImpuestos().filter((x) => x.id !== id);
  localStorage.setItem(K_IMPUESTOS, JSON.stringify(list));
}
function getNumeracion() {
  if (typeof window === "undefined") {
    return {
      cotizacionPrefix: "COT",
      cobroPrefix: "CC",
      ordenPrefix: "OT",
      actaPrefix: "ACT",
      nextCotizacion: 1,
      nextCobro: 1,
      nextOrden: 1,
      nextActa: 1
    };
  }
  seedIfEmpty();
  return safeParse(localStorage.getItem(K_NUM), {
    cotizacionPrefix: "COT",
    cobroPrefix: "CC",
    ordenPrefix: "OT",
    actaPrefix: "ACT",
    nextCotizacion: 1,
    nextCobro: 1,
    nextOrden: 1,
    nextActa: 1
  });
}
function setNumeracion(patch) {
  if (typeof window === "undefined") return;
  const cur = getNumeracion();
  localStorage.setItem(K_NUM, JSON.stringify({ ...cur, ...patch }));
}
function listUsuarios() {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  return migrateUsuarios(safeParse(localStorage.getItem(K_USERS), []));
}
function getUsuarioByEmail(email) {
  const e = (email || "").trim().toLowerCase();
  return listUsuarios().find((u) => u.email.toLowerCase() === e) ?? null;
}
function upsertUsuario(item) {
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
        password: (item.password || current.password || defaultPasswordForRole(item.rol)).trim()
      };
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
    ultimoAcceso: item.ultimoAcceso
  });
  localStorage.setItem(K_USERS, JSON.stringify(list));
}
function setUsuarioUltimoAcceso(id, isoDate = (/* @__PURE__ */ new Date()).toISOString()) {
  if (typeof window === "undefined") return;
  const list = listUsuarios();
  const idx = list.findIndex((u) => u.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], ultimoAcceso: isoDate };
  localStorage.setItem(K_USERS, JSON.stringify(list));
}
function deleteUsuario(id) {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_USERS, JSON.stringify(listUsuarios().filter((u) => u.id !== id)));
}
function listPlantillas() {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  return safeParse(localStorage.getItem(K_TPL), []);
}
function upsertPlantilla(item) {
  if (typeof window === "undefined") return;
  seedIfEmpty();
  const list = listPlantillas();
  if (item.id) {
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item };
    localStorage.setItem(K_TPL, JSON.stringify(list));
    return;
  }
  list.unshift({ id: uid("tpl"), ...item });
  localStorage.setItem(K_TPL, JSON.stringify(list));
}
function deletePlantilla(id) {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_TPL, JSON.stringify(listPlantillas().filter((t) => t.id !== id)));
}
function exportBackupJSON() {
  if (typeof window === "undefined") return "{}";
  seedIfEmpty();
  const payload = {
    version: 2,
    empresa: getEmpresa(),
    impuestos: listImpuestos(),
    numeracion: getNumeracion(),
    usuarios: listUsuarios(),
    plantillas: listPlantillas(),
    exportedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return JSON.stringify(payload, null, 2);
}
function restoreBackupJSON(text) {
  if (typeof window === "undefined") return;
  const data = JSON.parse(text);
  if (!data || typeof data !== "object") throw new Error("Backup inválido");
  if (data.empresa) localStorage.setItem(K_EMPRESA, JSON.stringify(data.empresa));
  if (data.impuestos) localStorage.setItem(K_IMPUESTOS, JSON.stringify(data.impuestos));
  if (data.numeracion) localStorage.setItem(K_NUM, JSON.stringify(data.numeracion));
  if (data.usuarios) localStorage.setItem(K_USERS, JSON.stringify(migrateUsuarios(data.usuarios)));
  if (data.plantillas) localStorage.setItem(K_TPL, JSON.stringify(data.plantillas));
}

export { listImpuestos as a, getNumeracion as b, setNumeracion as c, deleteImpuesto as d, exportBackupJSON as e, upsertPlantilla as f, getEmpresa as g, deletePlantilla as h, listUsuarios as i, upsertUsuario as j, deleteUsuario as k, listPlantillas as l, getUsuarioByEmail as m, setUsuarioUltimoAcceso as n, restoreBackupJSON as r, setEmpresa as s, upsertImpuesto as u };
