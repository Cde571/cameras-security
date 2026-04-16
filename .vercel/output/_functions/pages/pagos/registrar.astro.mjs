import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { C as ClienteSelector } from '../../chunks/ClienteSelector_C9mtMHCU.mjs';
import { g as getCliente } from '../../chunks/clienteLocalService_BAQfU60Z.mjs';
import { l as listCobros, e as createPago } from '../../chunks/cobroPagoLocalService_C_z-2DSE.mjs';
export { renderers } from '../../renderers.mjs';

function PagoForm() {
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState(null);
  const hoy = useMemo(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), []);
  const [fecha, setFecha] = useState(hoy);
  const [metodo, setMetodo] = useState("transferencia");
  const [valor, setValor] = useState(0);
  const [referencia, setReferencia] = useState("");
  const [notas, setNotas] = useState("");
  const cobrosCliente = useMemo(() => clienteId ? listCobros("").filter((c) => c.clienteId === clienteId) : [], [clienteId]);
  const [cobroId, setCobroId] = useState("");
  const canSave = useMemo(() => Boolean(clienteId) && valor > 0, [clienteId, valor]);
  useEffect(() => {
    listCobros("");
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
    setCobroId("");
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (valor <= 0) return alert("Valor debe ser mayor a 0.");
    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }
    createPago({
      fecha,
      clienteId,
      cliente: clienteSnap,
      cobroId: cobroId || void 0,
      referencia: referencia.trim() || void 0,
      metodo,
      valor,
      notas: notas.trim() || void 0
    });
    window.location.href = cobroId ? `/cobros/${cobroId}` : `/pagos/cartera`;
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Registrar pago" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Asocia el pago a un cobro (opcional)." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/pagos/cartera", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
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
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Datos del pago" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Fecha" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: fecha,
                  onChange: (e) => setFecha(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Método" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: metodo,
                  onChange: (e) => setMetodo(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "transferencia", children: "Transferencia" }),
                    /* @__PURE__ */ jsx("option", { value: "efectivo", children: "Efectivo" }),
                    /* @__PURE__ */ jsx("option", { value: "tarjeta", children: "Tarjeta" }),
                    /* @__PURE__ */ jsx("option", { value: "pse", children: "PSE" }),
                    /* @__PURE__ */ jsx("option", { value: "otro", children: "Otro" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Valor (COP)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: valor,
                  onChange: (e) => setValor(Number(e.target.value || 0)),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Referencia" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: referencia,
                onChange: (e) => setReferencia(e.target.value),
                className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                placeholder: "Ej: comprobante, transferencia, # transacción..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Asociar a cuenta de cobro (opcional)" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: cobroId,
                onChange: (e) => setCobroId(e.target.value),
                className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "— Sin asociar —" }),
                  cobrosCliente.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                    c.numero,
                    " • ",
                    c.status,
                    " • ",
                    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(c.total || 0)
                  ] }, c.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Notas" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: notas,
                onChange: (e) => setNotas(e.target.value),
                className: "min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Regla (front-first)" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "Si asocias un pago a una cuenta, marcamos el cobro como ",
          /* @__PURE__ */ jsx("b", { children: "pagado" }),
          " (pago total)."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Luego: pagos parciales, abonos, saldo por cobro." })
      ] })
    ] })
  ] });
}

const $$Registrar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Registrar pago - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PagoForm", PagoForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/pagos/PagoForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/pagos/registrar.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/pagos/registrar.astro";
const $$url = "/pagos/registrar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Registrar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
