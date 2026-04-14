const KEY_ACTAS = "coti_actas_v1";
const KEY_SEQ_ACT = "coti_actas_seq_v1";
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
function nextNumeroActa() {
  if (typeof window === "undefined") return "ACT-0000-0000";
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const cur = safeParse(localStorage.getItem(KEY_SEQ_ACT), {});
  const n = (cur[String(year)] ?? 0) + 1;
  cur[String(year)] = n;
  localStorage.setItem(KEY_SEQ_ACT, JSON.stringify(cur));
  return `ACT-${year}-${String(n).padStart(4, "0")}`;
}
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const list = safeParse(localStorage.getItem(KEY_ACTAS), []);
  if (list.length > 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const hoy = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const cliente = {
    id: "seed",
    nombre: "Clínica San Rafael",
    documento: "800555222-9",
    ciudad: "Bogotá"
  };
  const acta = {
    id: uid("act"),
    numero: nextNumeroActa(),
    clienteId: cliente.id,
    cliente,
    fecha: hoy,
    lugar: "Sede principal",
    responsables: { tecnico: "Técnico 1", clienteRecibe: "Jefe de compras", documentoRecibe: "CC 123456" },
    activos: [
      { id: uid("itm"), tipo: "camara", descripcion: "Cámara IP 4MP", cantidad: 8, ubicacion: "Perímetro", notas: "OK" },
      { id: uid("itm"), tipo: "dvr_nvr", descripcion: "NVR 16ch", cantidad: 1, serial: "SN-001", ubicacion: "Rack", notas: "OK" },
      { id: uid("itm"), tipo: "disco", descripcion: "Disco duro 4TB", cantidad: 1, serial: "HDD-4TB-01", notas: "Instalado" }
    ],
    observaciones: "Se realiza entrega y pruebas básicas de visualización. Capacitación breve al usuario.",
    status: "borrador",
    createdAt: now,
    updatedAt: now
  };
  localStorage.setItem(KEY_ACTAS, JSON.stringify([acta]));
}
function listActas(search = "") {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ACTAS), []);
  const q = search.trim().toLowerCase();
  if (!q) return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return list.filter((a) => {
    const blob = [a.numero, a.cliente?.nombre, a.fecha, a.status, a.lugar].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getActa(id) {
  if (typeof window === "undefined") return null;
  seedIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ACTAS), []);
  return list.find((a) => a.id === id) ?? null;
}
function createActa(data) {
  if (typeof window === "undefined") throw new Error("createActa debe ejecutarse en el browser");
  seedIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const acta = {
    id: uid("act"),
    numero: nextNumeroActa(),
    createdAt: now,
    updatedAt: now,
    ...data
  };
  const list = safeParse(localStorage.getItem(KEY_ACTAS), []);
  list.unshift(acta);
  localStorage.setItem(KEY_ACTAS, JSON.stringify(list));
  return acta;
}
function deleteActa(id) {
  if (typeof window === "undefined") throw new Error("deleteActa debe ejecutarse en el browser");
  seedIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_ACTAS), []);
  localStorage.setItem(KEY_ACTAS, JSON.stringify(list.filter((a) => a.id !== id)));
}

export { createActa as c, deleteActa as d, getActa as g, listActas as l };
