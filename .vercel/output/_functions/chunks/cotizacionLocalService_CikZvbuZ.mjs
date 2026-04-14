const KEY_COT = "coti_cotizaciones_v1";
const KEY_TPL = "coti_cotizaciones_plantillas_v1";
const KEY_SEQ = "coti_cotizaciones_seq_v1";
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
function nextNumero() {
  if (typeof window === "undefined") return "COT-0000-0000";
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const cur = safeParse(localStorage.getItem(KEY_SEQ), {});
  const n = (cur[String(year)] ?? 0) + 1;
  cur[String(year)] = n;
  localStorage.setItem(KEY_SEQ, JSON.stringify(cur));
  const padded = String(n).padStart(4, "0");
  return `COT-${year}-${padded}`;
}
function seedTemplatesIfEmpty() {
  if (typeof window === "undefined") return;
  const tpls = safeParse(localStorage.getItem(KEY_TPL), []);
  if (tpls.length > 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const seed = [
    {
      id: uid("tpl"),
      nombre: "Plantilla estándar",
      cuerpo: `• Garantía: 12 meses por defectos de fabricación.
• Instalación: incluye canaleta básica, configuración y pruebas.
• Forma de pago: 50% anticipo, 50% contra entrega.
• Vigencia: 15 días.
• Tiempos: 2 a 5 días hábiles según agenda.`,
      activo: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: uid("tpl"),
      nombre: "Residencial (rápida)",
      cuerpo: `• Instalación residencial.
• Se entrega usuario/contraseña y acceso remoto configurado.
• Soporte: 7 días posteriores a la instalación.
• Vigencia: 7 días.`,
      activo: true,
      createdAt: now,
      updatedAt: now
    }
  ];
  localStorage.setItem(KEY_TPL, JSON.stringify(seed));
}
function seedCotizacionesIfEmpty() {
  if (typeof window === "undefined") return;
  seedTemplatesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COT), []);
  if (list.length > 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const fecha = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const seed = [
    {
      id: uid("cot"),
      numero: nextNumero(),
      version: 1,
      fecha,
      vigenciaDias: 15,
      status: "enviada",
      clienteId: "seed",
      cliente: { id: "seed", nombre: "Hotel Plaza Real", documento: "900123456-7", ciudad: "Medellín" },
      asunto: "Sistema de seguridad - 8 cámaras",
      condiciones: "",
      notas: "Incluye configuración de acceso remoto.",
      items: [
        { id: uid("it"), kind: "producto", nombre: "Cámara IP 4MP", unidad: "unidad", qty: 8, precio: 26e4, ivaPct: 19 },
        { id: uid("it"), kind: "servicio", nombre: "Instalación y configuración", unidad: "servicio", qty: 1, precio: 45e4, ivaPct: 19 }
      ],
      createdAt: now,
      updatedAt: now
    }
  ];
  localStorage.setItem(KEY_COT, JSON.stringify(seed));
}
function calcTotales(items) {
  const subtotal = items.reduce((acc, it) => acc + Number(it.precio || 0) * Number(it.qty || 0), 0);
  const iva = items.reduce((acc, it) => {
    const base = Number(it.precio || 0) * Number(it.qty || 0);
    return acc + base * (Number(it.ivaPct || 0) / 100);
  }, 0);
  const total = subtotal + iva;
  return { subtotal, iva, total };
}
function listCotizaciones(search = "") {
  if (typeof window === "undefined") return [];
  seedCotizacionesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COT), []);
  const q = search.trim().toLowerCase();
  return list.filter((c) => {
    if (!q) return true;
    const blob = [
      c.numero,
      c.cliente?.nombre,
      c.asunto,
      c.status,
      c.fecha
    ].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getCotizacion(id) {
  if (typeof window === "undefined") return null;
  seedCotizacionesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COT), []);
  return list.find((c) => c.id === id) ?? null;
}
function createCotizacion(data) {
  if (typeof window === "undefined") throw new Error("createCotizacion debe ejecutarse en el browser");
  seedCotizacionesIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nuevo = {
    id: uid("cot"),
    numero: nextNumero(),
    version: 1,
    createdAt: now,
    updatedAt: now,
    ...data
  };
  const list = safeParse(localStorage.getItem(KEY_COT), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_COT, JSON.stringify(list));
  return nuevo;
}
function updateCotizacion(id, patch) {
  if (typeof window === "undefined") throw new Error("updateCotizacion debe ejecutarse en el browser");
  seedCotizacionesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COT), []);
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cotización no existe");
  const updated = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  list[idx] = updated;
  localStorage.setItem(KEY_COT, JSON.stringify(list));
  return updated;
}
function deleteCotizacion(id) {
  if (typeof window === "undefined") throw new Error("deleteCotizacion debe ejecutarse en el browser");
  seedCotizacionesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COT), []);
  localStorage.setItem(KEY_COT, JSON.stringify(list.filter((c) => c.id !== id)));
}
function createVersionFrom(id) {
  if (typeof window === "undefined") throw new Error("createVersionFrom debe ejecutarse en el browser");
  const base = getCotizacion(id);
  if (!base) throw new Error("Cotización base no encontrada");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nuevo = {
    ...base,
    id: uid("cot"),
    numero: nextNumero(),
    version: (base.version || 1) + 1,
    parentId: base.parentId || base.id,
    status: "borrador",
    createdAt: now,
    updatedAt: now,
    items: base.items.map((it) => ({ ...it, id: uid("it") }))
  };
  const list = safeParse(localStorage.getItem(KEY_COT), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_COT, JSON.stringify(list));
  return nuevo;
}
function listPlantillas(search = "") {
  if (typeof window === "undefined") return [];
  seedTemplatesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  const q = search.trim().toLowerCase();
  return list.filter((t) => {
    if (!q) return true;
    return [t.nombre, t.cuerpo].join(" ").toLowerCase().includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function createPlantilla(data) {
  if (typeof window === "undefined") throw new Error("createPlantilla debe ejecutarse en el browser");
  seedTemplatesIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nuevo = {
    id: uid("tpl"),
    nombre: data.nombre,
    cuerpo: data.cuerpo,
    activo: data.activo ?? true,
    createdAt: now,
    updatedAt: now
  };
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_TPL, JSON.stringify(list));
  return nuevo;
}
function updatePlantilla(id, patch) {
  if (typeof window === "undefined") throw new Error("updatePlantilla debe ejecutarse en el browser");
  seedTemplatesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Plantilla no existe");
  const updated = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  list[idx] = updated;
  localStorage.setItem(KEY_TPL, JSON.stringify(list));
  return updated;
}
function deletePlantilla(id) {
  if (typeof window === "undefined") throw new Error("deletePlantilla debe ejecutarse en el browser");
  seedTemplatesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  localStorage.setItem(KEY_TPL, JSON.stringify(list.filter((t) => t.id !== id)));
}

export { createCotizacion as a, createPlantilla as b, calcTotales as c, updatePlantilla as d, deletePlantilla as e, createVersionFrom as f, getCotizacion as g, deleteCotizacion as h, listCotizaciones as i, listPlantillas as l, updateCotizacion as u };
