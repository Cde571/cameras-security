import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { C as ClienteSelector } from '../../chunks/ClienteSelector_C9mtMHCU.mjs';
import { g as getCliente } from '../../chunks/clienteLocalService_BAQfU60Z.mjs';
import { c as createCobro } from '../../chunks/cobroPagoLocalService_BSn6kzk1.mjs';
export { renderers } from '../../renderers.mjs';

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `srv_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function ServiciosTable({ value, onChange }) {
  const add = () => onChange([{ id: uid(), descripcion: "Nuevo servicio", cantidad: 1, unitario: 0, ivaPct: 19 }, ...value]);
  const remove = (id) => onChange(value.filter((v) => v.id !== id));
  const set = (id, patch) => onChange(value.map((v) => v.id === id ? { ...v, ...patch } : v));
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: "Servicios" }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: add, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Agregar"
      ] })
    ] }),
    value.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-5 text-sm text-gray-600", children: "Agrega servicios para calcular totales." }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Descripción" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Cant" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Unitario" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "IVA %" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acción" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: value.map((s) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: s.descripcion,
            onChange: (e) => set(s.id, { descripcion: e.target.value }),
            className: "w-full rounded-lg border border-gray-200 px-3 py-2"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: s.cantidad,
            onChange: (e) => set(s.id, { cantidad: Number(e.target.value || 0) }),
            className: "w-24 rounded-lg border border-gray-200 px-3 py-2 text-right"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: s.unitario,
            onChange: (e) => set(s.id, { unitario: Number(e.target.value || 0) }),
            className: "w-32 rounded-lg border border-gray-200 px-3 py-2 text-right"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: s.ivaPct ?? 0,
            onChange: (e) => set(s.id, { ivaPct: Number(e.target.value || 0) }),
            className: "w-24 rounded-lg border border-gray-200 px-3 py-2 text-right"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => remove(s.id), className: "rounded-lg border border-gray-300 p-2 hover:bg-white", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) }) })
      ] }, s.id)) })
    ] })
  ] });
}

function CuentaCobroForm() {
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState(null);
  const hoy = useMemo(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), []);
  const [fechaEmision, setFechaEmision] = useState(hoy);
  const [fechaVencimiento, setFechaVencimiento] = useState(hoy);
  const [status, setStatus] = useState("pendiente");
  const [servicios, setServicios] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const canSave = useMemo(() => Boolean(clienteId) && servicios.length > 0, [clienteId, servicios.length]);
  useEffect(() => {
  }, []);
  const onPickCliente = (c) => {
    setClienteId(c.id);
    setClienteSnap({
      id: c.id,
      nombre: c.nombre,
      documento: c.documento,
      telefono: c.telefono,
      email: c.email,
      direccion: c.direccion,
      ciudad: c.ciudad
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (servicios.length === 0) return alert("Agrega al menos 1 servicio.");
    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }
    const cc = createCobro({
      clienteId,
      cliente: clienteSnap,
      fechaEmision,
      fechaVencimiento,
      status,
      servicios,
      observaciones
    });
    window.location.href = `/cobros/${cc.id}`;
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Nueva cuenta de cobro" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Cliente + servicios + totales." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/cobros", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Volver"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: !canSave,
            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`,
            children: [
              /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
              " Guardar"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsx(ClienteSelector, { value: clienteId, onChange: onPickCliente }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Fechas y estado" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Emisión" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: fechaEmision,
                  onChange: (e) => setFechaEmision(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Vencimiento" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: fechaVencimiento,
                  onChange: (e) => setFechaVencimiento(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Estado" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: status,
                  onChange: (e) => setStatus(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "pendiente", children: "Pendiente" }),
                    /* @__PURE__ */ jsx("option", { value: "enviado", children: "Enviado" }),
                    /* @__PURE__ */ jsx("option", { value: "pagado", children: "Pagado" }),
                    /* @__PURE__ */ jsx("option", { value: "vencido", children: "Vencido" }),
                    /* @__PURE__ */ jsx("option", { value: "anulado", children: "Anulado" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ServiciosTable, { value: servicios, onChange: setServicios }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Observaciones" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: observaciones,
              onChange: (e) => setObservaciones(e.target.value),
              className: "min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
              placeholder: "Ej: condiciones de pago, entregables, soporte..."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Ayuda" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "En este módulo calculamos totales por servicios y opcional IVA por ítem." }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Luego: PDF real, numeración configurable y firma." })
      ] })
    ] })
  ] });
}

const $$Nueva = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Nueva cuenta de cobro - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CuentaCobroForm", CuentaCobroForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cobros/CuentaCobroForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/nueva.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/nueva.astro";
const $$url = "/cobros/nueva";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nueva,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
