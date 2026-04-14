import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Eye, Pencil, FileText, GitBranch, Trash2 } from 'lucide-react';
import { i as listCotizaciones, h as deleteCotizacion } from '../chunks/cotizacionLocalService_CikZvbuZ.mjs';
export { renderers } from '../renderers.mjs';

function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function calcQuickTotal(items) {
  const subtotal = items.reduce((acc, it) => acc + Number(it.precio || 0) * Number(it.qty || 0), 0);
  const iva = items.reduce((acc, it) => acc + Number(it.precio || 0) * Number(it.qty || 0) * (Number(it.ivaPct || 0) / 100), 0);
  return subtotal + iva;
}
function CotizacionesList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(() => listCotizaciones(q), [q, refresh]);
  useEffect(() => {
    listCotizaciones("");
    setRefresh((n) => n + 1);
  }, []);
  const onDelete = (id) => {
    const ok = confirm("¿Eliminar esta cotización? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteCotizacion(id);
    setRefresh((n) => n + 1);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Cotizaciones" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Listado, creación, PDF y versionado." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/cotizaciones/nueva", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nueva cotización"
        ] }),
        /* @__PURE__ */ jsx("a", { href: "/cotizaciones/plantillas", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: "Plantillas de texto" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Buscar por número, cliente, asunto, estado...",
          className: "w-full bg-transparent outline-none text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-700", children: [
          list.length,
          " cotización(es)"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Tip: PDF es vista imprimible" })
      ] }),
      list.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium", children: "No hay cotizaciones" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Crea la primera cotización." }),
        /* @__PURE__ */ jsxs("a", { href: "/cotizaciones/nueva", className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nueva cotización"
        ] })
      ] }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Número" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Cliente" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Fecha" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Total" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: list.map((c) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: c.numero }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
              "v",
              c.version,
              c.parentId ? " • versionada" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-900 font-medium", children: c.cliente?.nombre || "—" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: c.asunto || "—" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700", children: c.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: c.fecha }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-gray-900", children: money(calcQuickTotal(c.items || [])) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/cotizaciones/${c.id}`, title: "Ver", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/cotizaciones/${c.id}/editar`, title: "Editar", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/cotizaciones/${c.id}/pdf`, title: "PDF", children: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/cotizaciones/${c.id}/versionar`, title: "Versionar", children: /* @__PURE__ */ jsx(GitBranch, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", onClick: () => onDelete(c.id), title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
          ] }) })
        ] }, c.id)) })
      ] })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Cotizaciones - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CotizacionesList", CotizacionesList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cotizaciones/CotizacionesList", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/index.astro";
const $$url = "/cotizaciones";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
