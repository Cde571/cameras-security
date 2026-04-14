import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Package, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { g as getProductoMeta, l as listProductos, k as deleteProducto } from '../chunks/productoLocalService_BY7j_gu7.mjs';
export { renderers } from '../renderers.mjs';

function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function ProductosList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const meta = useMemo(() => getProductoMeta(), [refresh]);
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [activo, setActivo] = useState("all");
  const productos = useMemo(
    () => listProductos(q, { categoria, marca, activo }),
    [q, categoria, marca, activo, refresh]
  );
  useEffect(() => {
    listProductos("");
    setRefresh((n) => n + 1);
  }, []);
  const onDelete = (id) => {
    const ok = confirm("¿Eliminar este producto? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteProducto(id);
    setRefresh((n) => n + 1);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Productos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Catálogo de productos, precios y estado." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/productos/nuevo", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Crear producto"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "/productos/kits", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
          "Kits / Combos"
        ] }),
        /* @__PURE__ */ jsx("a", { href: "/productos/importar", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: "Importar desde Excel" }),
        /* @__PURE__ */ jsx("a", { href: "/productos/categorias", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: "Categorías y Marcas" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-gray-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Buscar por nombre, SKU, categoría, marca...",
            className: "w-full bg-transparent outline-none text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4 text-gray-400" }),
        /* @__PURE__ */ jsxs("select", { value: activo, onChange: (e) => setActivo(e.target.value), className: "w-full bg-transparent outline-none text-sm", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
          /* @__PURE__ */ jsx("option", { value: "active", children: "Activos" }),
          /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactivos" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-3 shadow-sm", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Categoría" }),
        /* @__PURE__ */ jsxs("select", { value: categoria, onChange: (e) => setCategoria(e.target.value), className: "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Todas" }),
          meta.categorias.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-3 shadow-sm", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Marca" }),
        /* @__PURE__ */ jsxs("select", { value: marca, onChange: (e) => setMarca(e.target.value), className: "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Todas" }),
          meta.marcas.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-700", children: [
          productos.length,
          " producto(s)"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "COP • IVA configurable" })
      ] }),
      productos.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium", children: "Sin resultados" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Crea un producto o ajusta filtros/búsqueda." }),
        /* @__PURE__ */ jsxs("a", { href: "/productos/nuevo", className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Crear producto"
        ] })
      ] }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Producto" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Categoría / Marca" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Precio" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: productos.map((p) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: p.nombre }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
              p.sku || "—",
              " • ",
              p.unidad || "unidad"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-800", children: p.categoria || "—" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: p.marca || "—" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: money(Number(p.precio || 0)) }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
              "IVA ",
              Number(p.ivaPct || 0),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${p.activo === false ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}`, children: p.activo === false ? "Inactivo" : "Activo" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/productos/${p.id}/editar`, title: "Editar", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", onClick: () => onDelete(p.id), title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
          ] }) })
        ] }, p.id)) })
      ] })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Productos - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductosList", ProductosList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/productos/ProductosList", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/index.astro";
const $$url = "/productos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
