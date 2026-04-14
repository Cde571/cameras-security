import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { l as listCobros, d as deleteCobro } from '../chunks/cobroPagoLocalService_BSn6kzk1.mjs';
export { renderers } from '../renderers.mjs';

function CuentasList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(() => listCobros(q), [q, refresh]);
  useEffect(() => {
    listCobros("");
    setRefresh((n) => n + 1);
  }, []);
  const onDelete = (id) => {
    const ok = confirm("¿Eliminar cuenta de cobro?");
    if (!ok) return;
    deleteCobro(id);
    setRefresh((n) => n + 1);
  };
  const badge = (status) => {
    const map = {
      pendiente: "bg-yellow-100 text-yellow-800",
      enviado: "bg-blue-100 text-blue-800",
      pagado: "bg-green-100 text-green-800",
      vencido: "bg-red-100 text-red-800",
      anulado: "bg-gray-100 text-gray-700"
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Cuentas de cobro" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Listado y gestión de cuentas." })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: "/cobros/nueva", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Nueva cuenta"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Buscar por CC, cliente, estado...",
          className: "w-full bg-transparent outline-none text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 px-5 py-3 text-sm text-gray-700", children: [
        list.length,
        " cuenta(s)"
      ] }),
      list.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium", children: "Sin cuentas" }),
        /* @__PURE__ */ jsxs("a", { href: "/cobros/nueva", className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " Nueva cuenta"
        ] })
      ] }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Número" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Cliente" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Vence" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Total" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: list.map((c) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-gray-900", children: c.numero }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900", children: c.cliente?.nombre }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: c.cliente?.documento || "" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: c.fechaVencimiento }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badge(c.status)}`, children: c.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right font-semibold text-gray-900", children: new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(c.total || 0) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/cobros/${c.id}`, title: "Ver", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", onClick: () => onDelete(c.id), title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
          ] }) })
        ] }, c.id)) })
      ] })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Cuentas de cobro - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CuentasList", CuentasList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cobros/CuentasList", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/index.astro";
const $$url = "/cobros";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
