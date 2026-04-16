import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Pencil, FileText, GitBranch, Trash2 } from 'lucide-react';
import { g as getCotizacion, c as calcTotales, h as deleteCotizacion } from '../../chunks/cotizacionLocalService_CikZvbuZ.mjs';
export { renderers } from '../../renderers.mjs';

function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function CotizacionDetail({ cotizacionId }) {
  const [c, setC] = useState(null);
  useEffect(() => {
    setC(getCotizacion(cotizacionId));
  }, [cotizacionId]);
  const t = useMemo(() => c ? calcTotales(c.items || []) : { subtotal: 0, iva: 0, total: 0 }, [c]);
  const del = () => {
    if (!c) return;
    const ok = confirm("¿Eliminar esta cotización?");
    if (!ok) return;
    deleteCotizacion(c.id);
    window.location.href = "/cotizaciones";
  };
  if (!c) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cotización no encontrada." }),
      /* @__PURE__ */ jsx("a", { className: "mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/cotizaciones", children: "Volver" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: c.numero }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "v",
          c.version,
          " • ",
          c.status,
          " • ",
          c.fecha,
          " • Vigencia ",
          c.vigenciaDias,
          " días"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/cotizaciones", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Volver"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `/cotizaciones/${c.id}/editar`, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
          " Editar"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `/cotizaciones/${c.id}/pdf`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
          " PDF"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `/cotizaciones/${c.id}/versionar`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(GitBranch, { className: "h-4 w-4" }),
          " Versionar"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: del, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }),
          " Eliminar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Cliente" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: c.cliente?.nombre }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            c.cliente?.documento || "",
            " ",
            c.cliente?.ciudad ? `• ${c.cliente.ciudad}` : ""
          ] })
        ] }),
        c.asunto ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Asunto" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: c.asunto })
        ] }) : null,
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-gray-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Ítem" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right font-semibold", children: "Cant" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right font-semibold", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: c.items.map((it) => {
            const base = it.precio * it.qty;
            const iva = base * (it.ivaPct / 100);
            return /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: it.nombre }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                  it.kind,
                  " • IVA ",
                  it.ivaPct,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: it.qty }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-semibold", children: money(base + iva) })
            ] }, it.id);
          }) })
        ] }) }),
        c.condiciones ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Condiciones" }),
          /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-700", children: c.condiciones })
        ] }) : null,
        c.notas ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Notas" }),
          /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-700", children: c.notas })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Totales" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money(t.subtotal) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "IVA" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money(t.iva) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-gray-200 flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: money(t.total) })
        ] })
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
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Cotizaci\xF3n ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CotizacionDetail", CotizacionDetail, { "client:load": true, "cotizacionId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cotizaciones/CotizacionDetail", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/[id].astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/[id].astro";
const $$url = "/cotizaciones/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
