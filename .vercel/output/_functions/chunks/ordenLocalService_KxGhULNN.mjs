const KEY_ORD = "coti_ordenes_v1";
const KEY_TPL = "coti_checklists_tpl_v1";
const KEY_SEQ = "coti_ordenes_seq_v1";
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
  if (typeof window === "undefined") return "OT-0000-0000";
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const cur = safeParse(localStorage.getItem(KEY_SEQ), {});
  const n = (cur[String(year)] ?? 0) + 1;
  cur[String(year)] = n;
  localStorage.setItem(KEY_SEQ, JSON.stringify(cur));
  const padded = String(n).padStart(4, "0");
  return `OT-${year}-${padded}`;
}
function seedChecklistsIfEmpty() {
  if (typeof window === "undefined") return;
  const tpls = safeParse(localStorage.getItem(KEY_TPL), []);
  if (tpls.length > 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const seed = [
    {
      id: uid("tpl"),
      nombre: "Instalación estándar CCTV",
      items: [
        { label: "Verificar puntos de instalación" },
        { label: "Tendido de cableado / canaleta" },
        { label: "Montaje de cámaras" },
        { label: "Conexión a NVR/DVR" },
        { label: "Configuración de red / acceso remoto" },
        { label: "Pruebas de grabación" },
        { label: "Capacitación básica al cliente" },
        { label: "Entrega de credenciales" }
      ],
      createdAt: now,
      updatedAt: now
    },
    {
      id: uid("tpl"),
      nombre: "Mantenimiento preventivo",
      items: [
        { label: "Limpieza de lentes/carcasa" },
        { label: "Revisión de conectores" },
        { label: "Prueba de grabación y playback" },
        { label: "Revisión de almacenamiento" },
        { label: "Verificar UPS/energía" },
        { label: "Reporte final al cliente" }
      ],
      createdAt: now,
      updatedAt: now
    }
  ];
  localStorage.setItem(KEY_TPL, JSON.stringify(seed));
}
function seedOrdenesIfEmpty() {
  if (typeof window === "undefined") return;
  seedChecklistsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ORD), []);
  if (list.length > 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const fecha = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const seed = [
    {
      id: uid("ord"),
      numero: nextNumero(),
      fechaCreacion: fecha,
      fechaProgramada: fecha,
      status: "en_progreso",
      clienteId: "seed",
      cliente: { id: "seed", nombre: "Clínica San Rafael", documento: "800555222-9", ciudad: "Bogotá" },
      asunto: "Instalación cámaras + acceso remoto",
      direccionServicio: "Av 80 # 20-10",
      observaciones: "Se requiere coordinación con seguridad.",
      tecnicoId: "tec1",
      tecnico: { id: "tec1", nombre: "Técnico 1", telefono: "3000000000" },
      checklistTemplateId: "",
      checklist: [
        { id: uid("chk"), label: "Verificar puntos de instalación", done: true },
        { id: uid("chk"), label: "Montaje de cámaras", done: false },
        { id: uid("chk"), label: "Configuración acceso remoto", done: false }
      ],
      evidencias: [],
      createdAt: now,
      updatedAt: now
    }
  ];
  localStorage.setItem(KEY_ORD, JSON.stringify(seed));
}
function listOrdenes(search = "") {
  if (typeof window === "undefined") return [];
  seedOrdenesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ORD), []);
  const q = search.trim().toLowerCase();
  return list.filter((o) => {
    if (!q) return true;
    const blob = [
      o.numero,
      o.cliente?.nombre,
      o.asunto,
      o.status,
      o.fechaCreacion,
      o.fechaProgramada,
      o.tecnico?.nombre
    ].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getOrden(id) {
  if (typeof window === "undefined") return null;
  seedOrdenesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ORD), []);
  return list.find((o) => o.id === id) ?? null;
}
function createOrden(data) {
  if (typeof window === "undefined") throw new Error("createOrden debe ejecutarse en el browser");
  seedOrdenesIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nuevo = {
    id: uid("ord"),
    numero: nextNumero(),
    createdAt: now,
    updatedAt: now,
    ...data
  };
  const list = safeParse(localStorage.getItem(KEY_ORD), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_ORD, JSON.stringify(list));
  return nuevo;
}
function updateOrden(id, patch) {
  if (typeof window === "undefined") throw new Error("updateOrden debe ejecutarse en el browser");
  seedOrdenesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ORD), []);
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Orden no existe");
  const updated = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  list[idx] = updated;
  localStorage.setItem(KEY_ORD, JSON.stringify(list));
  return updated;
}
function deleteOrden(id) {
  if (typeof window === "undefined") throw new Error("deleteOrden debe ejecutarse en el browser");
  seedOrdenesIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ORD), []);
  localStorage.setItem(KEY_ORD, JSON.stringify(list.filter((o) => o.id !== id)));
}
function listChecklistTemplates(search = "") {
  if (typeof window === "undefined") return [];
  seedChecklistsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  const q = search.trim().toLowerCase();
  return list.filter((t) => {
    if (!q) return true;
    return [t.nombre, ...t.items.map((i) => i.label)].join(" ").toLowerCase().includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getChecklistTemplate(id) {
  if (typeof window === "undefined") return null;
  seedChecklistsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  return list.find((t) => t.id === id) ?? null;
}
function createChecklistTemplate(nombre) {
  if (typeof window === "undefined") throw new Error("createChecklistTemplate debe ejecutarse en el browser");
  seedChecklistsIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const tpl = {
    id: uid("tpl"),
    nombre: nombre.trim() || "Nuevo checklist",
    items: [{ label: "Nuevo ítem" }],
    createdAt: now,
    updatedAt: now
  };
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  list.unshift(tpl);
  localStorage.setItem(KEY_TPL, JSON.stringify(list));
  return tpl;
}
function updateChecklistTemplate(id, patch) {
  if (typeof window === "undefined") throw new Error("updateChecklistTemplate debe ejecutarse en el browser");
  seedChecklistsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Checklist template no existe");
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
function deleteChecklistTemplate(id) {
  if (typeof window === "undefined") throw new Error("deleteChecklistTemplate debe ejecutarse en el browser");
  seedChecklistsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_TPL), []);
  localStorage.setItem(KEY_TPL, JSON.stringify(list.filter((t) => t.id !== id)));
}

export { getChecklistTemplate as a, updateOrden as b, createChecklistTemplate as c, deleteChecklistTemplate as d, createOrden as e, deleteOrden as f, getOrden as g, listOrdenes as h, listChecklistTemplates as l, updateChecklistTemplate as u };
