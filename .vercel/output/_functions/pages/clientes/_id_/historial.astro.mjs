import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { g as getCliente } from '../../../chunks/clienteLocalService_BAQfU60Z.mjs';
export { renderers } from '../../../renderers.mjs';

function ClienteHistorial({ clienteId }) {
  const [nombre, setNombre] = useState("");
  useEffect(() => {
    const c = getCliente(clienteId);
    setNombre(c?.nombre ?? "");
  }, [clienteId]);
  const historial = [
    { id: "h1", tipo: "Cotización", ref: "COT-2026-045", fecha: "2026-01-18", href: "/cotizaciones" },
    { id: "h2", tipo: "Cuenta de cobro", ref: "CC-2026-089", fecha: "2026-01-17", href: "/cobros" },
    { id: "h3", tipo: "Orden", ref: "OT-2026-123", fecha: "2026-01-16", href: "/ordenes" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Historial" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: nombre ? `Cliente: ${nombre}` : `ID: ${clienteId}` })
      ] }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `/clientes/${clienteId}`,
          className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Volver"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-5 py-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-700", children: "Movimientos recientes" }) }),
      /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Tipo" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Referencia" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Fecha" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acción" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: historial.map((h) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: h.tipo }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-gray-900", children: h.ref }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: h.fecha }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50", href: h.href, children: "Ver" }) })
        ] }, h.id)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-xs text-gray-500", children: "Nota: este historial es temporal (front-first). Luego lo conectamos a cotizaciones/cobros/órdenes reales del cliente." })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Historial = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Historial;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Historial cliente ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ClienteHistorial", ClienteHistorial, { "client:load": true, "clienteId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/clientes/ClienteHistorial", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/[id]/historial.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/[id]/historial.astro";
const $$url = "/clientes/[id]/historial";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Historial,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
