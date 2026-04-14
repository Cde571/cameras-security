import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Pencil, History, FileText, DollarSign, Wrench } from 'lucide-react';
import { g as getCliente } from '../../chunks/clienteLocalService_BAQfU60Z.mjs';
export { renderers } from '../../renderers.mjs';

function ClienteCard({ clienteId }) {
  const [cliente, setCliente] = useState(null);
  useEffect(() => {
    setCliente(getCliente(clienteId));
  }, [clienteId]);
  if (!cliente) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cliente no encontrado." }),
      /* @__PURE__ */ jsx("a", { className: "mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/clientes", children: "Volver a clientes" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: cliente.nombre }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: cliente.documento || "—" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/clientes/${clienteId}/editar`,
            className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
            children: [
              /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
              "Editar"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/clientes/${clienteId}/historial`,
            className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsx(History, { className: "h-4 w-4" }),
              "Historial"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Información" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Teléfono" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: cliente.telefono || "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Email" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: cliente.email || "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Dirección" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: cliente.direccion || "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Ciudad" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: cliente.ciudad || "—" })
          ] })
        ] }),
        cliente.notas ? /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Notas" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap", children: cliente.notas })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Acciones" }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/cotizaciones/nueva",
            className: "flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm",
            children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-gray-700" }),
              "Nueva cotización"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/cobros/nueva",
            className: "flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm",
            children: [
              /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-gray-700" }),
              "Nueva cuenta de cobro"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/ordenes/nueva",
            className: "flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm",
            children: [
              /* @__PURE__ */ jsx(Wrench, { className: "h-4 w-4 text-gray-700" }),
              "Nueva orden de trabajo"
            ]
          }
        )
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Cliente ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ClienteCard", ClienteCard, { "client:load": true, "clienteId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/clientes/ClienteCard", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/[id].astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/[id].astro";
const $$url = "/clientes/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
