import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { g as getCliente } from '../../../chunks/clienteLocalService_BAQfU60Z.mjs';
import { b as getEstadoCuenta } from '../../../chunks/cobroPagoLocalService_C_z-2DSE.mjs';
export { renderers } from '../../../renderers.mjs';

function EstadoCuenta({ clienteId }) {
  const [refresh, setRefresh] = useState(0);
  const data = useMemo(() => getEstadoCuenta(clienteId), [clienteId, refresh]);
  const cliente = useMemo(() => getCliente(clienteId), [clienteId, refresh]);
  useEffect(() => {
    setRefresh((n) => n + 1);
  }, []);
  const money = useMemo(() => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }), []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Estado de cuenta" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: cliente?.nombre || clienteId })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: "/pagos/cartera", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Volver"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Total cobros" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-900", children: money.format(data.totalCobros) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Total pagos" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-900", children: money.format(data.totalPagos) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Saldo" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-900", children: money.format(data.saldo) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-5 py-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: "Cuentas de cobro" }) }),
      data.cobros.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-5 text-sm text-gray-600", children: "Sin cuentas." }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Cuenta" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Vence" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Total" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: data.cobros.map((c) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-gray-900", children: /* @__PURE__ */ jsx("a", { className: "text-blue-600 hover:text-blue-700", href: `/cobros/${c.id}`, children: c.numero }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: c.status }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: c.fechaVencimiento }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right font-semibold", children: money.format(c.total || 0) })
        ] }, c.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-5 py-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: "Pagos" }) }),
      data.pagos.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-5 text-sm text-gray-600", children: "Sin pagos registrados." }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Fecha" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Método" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Referencia" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Valor" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: data.pagos.map((p) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: p.fecha }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: p.metodo }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: p.referencia || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right font-semibold", children: money.format(p.valor || 0) })
        ] }, p.id)) })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$clienteId = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$clienteId;
  const { clienteId } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Estado de cuenta ${clienteId}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "EstadoCuenta", EstadoCuenta, { "client:load": true, "clienteId": clienteId, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/pagos/EstadoCuenta", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/pagos/estado-cuenta/[clienteId].astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/pagos/estado-cuenta/[clienteId].astro";
const $$url = "/pagos/estado-cuenta/[clienteId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$clienteId,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
