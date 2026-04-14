import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, FileText, DollarSign } from 'lucide-react';
import { g as getCobro } from '../../chunks/cobroPagoLocalService_BSn6kzk1.mjs';
export { renderers } from '../../renderers.mjs';

function CobroDetail({ cobroId }) {
  const [cc, setCc] = useState(null);
  useEffect(() => {
    setCc(getCobro(cobroId));
  }, [cobroId]);
  const money = useMemo(() => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }), []);
  if (!cc) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cuenta no encontrada." }),
      /* @__PURE__ */ jsx("a", { className: "mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/cobros", children: "Volver" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: cc.numero }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          cc.status,
          " • Emisión ",
          cc.fechaEmision,
          " • Vence ",
          cc.fechaVencimiento
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/cobros", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Volver"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `/cobros/${cc.id}/pdf`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
          " PDF"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "/pagos/registrar", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" }),
          " Registrar pago"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Cliente" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: cc.cliente?.nombre }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            cc.cliente?.documento || "",
            " ",
            cc.cliente?.ciudad ? `• ${cc.cliente.ciudad}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Servicio" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Cant" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Unit" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "IVA%" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: cc.servicios.map((s) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: s.descripcion }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: s.cantidad }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: money.format(s.unitario) }),
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-3 text-right", children: [
              s.ivaPct ?? 0,
              "%"
            ] })
          ] }, s.id)) })
        ] }) }),
        cc.observaciones ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Observaciones" }),
          /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-700", children: cc.observaciones })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Totales" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money.format(cc.subtotal) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "IVA" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money.format(cc.iva) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-gray-200 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-semibold", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-black", children: money.format(cc.total) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-3 border-t border-gray-200 space-y-2", children: /* @__PURE__ */ jsx("a", { className: "block rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm", href: `/pagos/estado-cuenta/${cc.clienteId}`, children: "Ver estado de cuenta del cliente" }) })
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
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Cobro ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CobroDetail", CobroDetail, { "client:load": true, "cobroId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cobros/CobroDetail", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/[id].astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/[id].astro";
const $$url = "/cobros/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
