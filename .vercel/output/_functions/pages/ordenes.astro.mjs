import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, ClipboardList, Search, Eye, Pencil, Image, Trash2 } from 'lucide-react';
import { h as listOrdenes, f as deleteOrden } from '../chunks/ordenLocalService_KxGhULNN.mjs';
export { renderers } from '../renderers.mjs';

function OrdenesList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(() => listOrdenes(q), [q, refresh]);
  useEffect(() => {
    listOrdenes("");
    setRefresh((n) => n + 1);
  }, []);
  const onDelete = (id) => {
    const ok = confirm("¿Eliminar esta orden? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteOrden(id);
    setRefresh((n) => n + 1);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Órdenes de trabajo" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Listado, creación, checklist y evidencias." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/ordenes/nueva", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nueva orden"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "/ordenes/checklists", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4" }),
          "Checklists"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Buscar por OT, cliente, técnico, estado...",
          className: "w-full bg-transparent outline-none text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-700", children: [
          list.length,
          " orden(es)"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Tip: evidencias son locales (front-first)" })
      ] }),
      list.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium", children: "No hay órdenes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Crea la primera orden." }),
        /* @__PURE__ */ jsxs("a", { href: "/ordenes/nueva", className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nueva orden"
        ] })
      ] }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Número" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Cliente" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Programada" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Técnico" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: list.map((o) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: o.numero }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: o.asunto || "—" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-900 font-medium", children: o.cliente?.nombre || "—" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: o.cliente?.ciudad || "" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700", children: o.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: o.fechaProgramada || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: o.tecnico?.nombre || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/ordenes/${o.id}`, title: "Ver", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/ordenes/${o.id}/editar`, title: "Editar", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/ordenes/${o.id}/evidencias`, title: "Evidencias", children: /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", onClick: () => onDelete(o.id), title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
          ] }) })
        ] }, o.id)) })
      ] })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "\xD3rdenes - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "OrdenesList", OrdenesList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/ordenes/OrdenesList", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/index.astro";
const $$url = "/ordenes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
