import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { g as getProductoMeta, r as removeCategoria, b as removeMarca, d as addCategoria, e as addMarca } from '../../chunks/productoLocalService_BY7j_gu7.mjs';
export { renderers } from '../../renderers.mjs';

function CategoriaManager() {
  const [meta, setMeta] = useState(getProductoMeta());
  const [cat, setCat] = useState("");
  const [mar, setMar] = useState("");
  const refresh = () => setMeta(getProductoMeta());
  useEffect(() => refresh(), []);
  const addCat = () => {
    addCategoria(cat);
    setCat("");
    refresh();
  };
  const addMar = () => {
    addMarca(mar);
    setMar("");
    refresh();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Categorías y Marcas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Estructura base del catálogo." })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/productos", children: "Volver" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Categorías" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: cat,
              onChange: (e) => setCat(e.target.value),
              className: "flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Nueva categoría"
            }
          ),
          /* @__PURE__ */ jsxs("button", { onClick: addCat, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            " Agregar"
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200 rounded-lg border border-gray-200", children: meta.categorias.map((c) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between px-4 py-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-800", children: c }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                removeCategoria(c);
                refresh();
              },
              className: "rounded-lg border border-gray-300 p-2 hover:bg-gray-50",
              title: "Eliminar",
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" })
            }
          )
        ] }, c)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Marcas" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: mar,
              onChange: (e) => setMar(e.target.value),
              className: "flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Nueva marca"
            }
          ),
          /* @__PURE__ */ jsxs("button", { onClick: addMar, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            " Agregar"
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200 rounded-lg border border-gray-200", children: meta.marcas.map((m) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between px-4 py-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-800", children: m }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                removeMarca(m);
                refresh();
              },
              className: "rounded-lg border border-gray-300 p-2 hover:bg-gray-50",
              title: "Eliminar",
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" })
            }
          )
        ] }, m)) })
      ] })
    ] })
  ] });
}

const $$Categorias = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Categor\xEDas y Marcas - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoriaManager", CategoriaManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/productos/CategoriaManager", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/categorias.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/categorias.astro";
const $$url = "/productos/categorias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categorias,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
