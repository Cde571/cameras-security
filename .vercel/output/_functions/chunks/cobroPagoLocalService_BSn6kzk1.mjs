const KEY_COBROS = "coti_cobros_v1";
const KEY_PAGOS = "coti_pagos_v1";
const KEY_SEQ_CC = "coti_cobros_seq_v1";
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
function nextNumeroCC() {
  if (typeof window === "undefined") return "CC-0000-0000";
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const cur = safeParse(localStorage.getItem(KEY_SEQ_CC), {});
  const n = (cur[String(year)] ?? 0) + 1;
  cur[String(year)] = n;
  localStorage.setItem(KEY_SEQ_CC, JSON.stringify(cur));
  return `CC-${year}-${String(n).padStart(4, "0")}`;
}
function calcTotales(servicios) {
  const subtotal = servicios.reduce((acc, s) => acc + Number(s.cantidad || 0) * Number(s.unitario || 0), 0);
  const iva = servicios.reduce((acc, s) => {
    const pct = Number(s.ivaPct || 0);
    return acc + Number(s.cantidad || 0) * Number(s.unitario || 0) * (pct / 100);
  }, 0);
  const total = subtotal + iva;
  return { subtotal, iva, total };
}
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const cobros = safeParse(localStorage.getItem(KEY_COBROS), []);
  const pagos = safeParse(localStorage.getItem(KEY_PAGOS), []);
  if (cobros.length > 0 || pagos.length > 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const hoy = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const venc = new Date(Date.now() + 7 * 24 * 3600 * 1e3).toISOString().slice(0, 10);
  const cliente = { id: "seed", nombre: "Supermercado El Ahorro", documento: "901987654-1", ciudad: "Cali" };
  const servicios = [
    { id: uid("srv"), descripcion: "Mantenimiento preventivo CCTV", cantidad: 1, unitario: 85e4, ivaPct: 19 },
    { id: uid("srv"), descripcion: "Cambio de conector / ajuste canaleta", cantidad: 2, unitario: 65e3, ivaPct: 19 }
  ];
  const t = calcTotales(servicios);
  const cc = {
    id: uid("cc"),
    numero: nextNumeroCC(),
    clienteId: cliente.id,
    cliente,
    fechaEmision: hoy,
    fechaVencimiento: venc,
    status: "pendiente",
    servicios,
    observaciones: "Pago contra entrega. Enviar soporte al WhatsApp.",
    ...t,
    createdAt: now,
    updatedAt: now
  };
  localStorage.setItem(KEY_COBROS, JSON.stringify([cc]));
  localStorage.setItem(KEY_PAGOS, JSON.stringify([]));
}
function listCobros(search = "") {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COBROS), []);
  const q = search.trim().toLowerCase();
  const normalized = list.map((c) => {
    if ((c.status === "pendiente" || c.status === "enviado") && c.fechaVencimiento) {
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      if (c.fechaVencimiento < today) return { ...c, status: "vencido" };
    }
    return c;
  });
  if (!q) return normalized.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return normalized.filter((c) => {
    const blob = [c.numero, c.cliente?.nombre, c.status, c.fechaEmision, c.fechaVencimiento].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getCobro(id) {
  if (typeof window === "undefined") return null;
  seedIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COBROS), []);
  return list.find((c) => c.id === id) ?? null;
}
function createCobro(data) {
  if (typeof window === "undefined") throw new Error("createCobro debe ejecutarse en el browser");
  seedIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const totals = calcTotales(data.servicios || []);
  const cc = {
    id: uid("cc"),
    numero: nextNumeroCC(),
    createdAt: now,
    updatedAt: now,
    ...data,
    ...totals
  };
  const list = safeParse(localStorage.getItem(KEY_COBROS), []);
  list.unshift(cc);
  localStorage.setItem(KEY_COBROS, JSON.stringify(list));
  return cc;
}
function deleteCobro(id) {
  if (typeof window === "undefined") throw new Error("deleteCobro debe ejecutarse en el browser");
  seedIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_COBROS), []);
  localStorage.setItem(KEY_COBROS, JSON.stringify(list.filter((c) => c.id !== id)));
}
function listPagos(search = "") {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_PAGOS), []);
  const q = search.trim().toLowerCase();
  if (!q) return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return list.filter((p) => {
    const blob = [p.cliente?.nombre, p.metodo, p.referencia, p.fecha, p.valor].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function createPago(data) {
  if (typeof window === "undefined") throw new Error("createPago debe ejecutarse en el browser");
  seedIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const pago = {
    id: uid("pay"),
    createdAt: now,
    updatedAt: now,
    ...data
  };
  const pagos = safeParse(localStorage.getItem(KEY_PAGOS), []);
  pagos.unshift(pago);
  localStorage.setItem(KEY_PAGOS, JSON.stringify(pagos));
  if (pago.cobroId) {
    const cobros = safeParse(localStorage.getItem(KEY_COBROS), []);
    const idx = cobros.findIndex((c) => c.id === pago.cobroId);
    if (idx >= 0) {
      cobros[idx] = { ...cobros[idx], status: "pagado", updatedAt: now };
      localStorage.setItem(KEY_COBROS, JSON.stringify(cobros));
    }
  }
  return pago;
}
function getCartera() {
  const cobros = listCobros("");
  const pendientes = cobros.filter((c) => c.status === "pendiente" || c.status === "enviado");
  const vencidos = cobros.filter((c) => c.status === "vencido");
  const pagados = cobros.filter((c) => c.status === "pagado");
  const totalPendiente = pendientes.reduce((a, c) => a + (c.total || 0), 0);
  const totalVencido = vencidos.reduce((a, c) => a + (c.total || 0), 0);
  const totalPagado = pagados.reduce((a, c) => a + (c.total || 0), 0);
  return { pendientes, vencidos, pagados, totalPendiente, totalVencido, totalPagado };
}
function getEstadoCuenta(clienteId) {
  const cobros = listCobros("").filter((c) => c.clienteId === clienteId);
  const pagos = listPagos("").filter((p) => p.clienteId === clienteId);
  const totalCobros = cobros.reduce((a, c) => a + (c.total || 0), 0);
  const totalPagos = pagos.reduce((a, p) => a + (p.valor || 0), 0);
  const saldo = totalCobros - totalPagos;
  return { cobros, pagos, saldo, totalCobros, totalPagos };
}

export { getCartera as a, getEstadoCuenta as b, createCobro as c, deleteCobro as d, createPago as e, getCobro as g, listCobros as l };
