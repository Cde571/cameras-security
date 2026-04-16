import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { a as listKits, c as calcKitTotal, i as deleteKit } from '../../chunks/productoLocalService_BY7j_gu7.mjs';
export { renderers } from '../../renderers.mjs';

function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function KitsList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const kits = useMemo(() => listKits(q), [q, refresh]);
  useEffect(() => {
    listKits("");
    setRefresh((n) => n + 1);
  }, []);
  const onDelete = (id) => {
    const ok = confirm("¿Eliminar este kit? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteKit(id);
    setRefresh((n) => n + 1);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Kits / Combos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Combina productos en paquetes con descuento o precio fijo." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("a", { href: "/productos", className: "rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: "Volver" }),
        /* @__PURE__ */ jsxs("a", { href: "/productos/kits/nuevo", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Crear kit"
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
          placeholder: "Buscar kit...",
          className: "w-full bg-transparent outline-none text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-5 py-3", children: /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-700", children: [
        kits.length,
        " kit(s)"
      ] }) }),
      kits.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium", children: "No hay kits" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Crea el primer kit para usarlo en cotizaciones." }),
        /* @__PURE__ */ jsxs("a", { href: "/productos/kits/nuevo", className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Crear kit"
        ] })
      ] }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Kit" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Items" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Total" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: kits.map((k) => {
          const t = calcKitTotal(k);
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: k.nombre }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: k.descripcion || "—" })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: k.items.length }),
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: money(t.total) }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                "Subtotal: ",
                money(t.subtotal)
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("button", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", onClick: () => onDelete(k.id), title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) }) }) })
          ] }, k.id);
        }) })
      ] })
    ] })
  ] });
}

const $$Kits = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Kits / Combos - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "KitsList", KitsList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/productos/KitsList", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/kits.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/kits.astro";
const $$url = "/productos/kits";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Kits,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
