import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { g as getReporteDashboard } from '../../chunks/reporteLocalService_DI9hL2vR.mjs';
import { V as VentasChart } from '../../chunks/VentasChart_CUHZqj7_.mjs';
export { renderers } from '../../renderers.mjs';

function ReporteVentas() {
  const d = getReporteDashboard();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Ventas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Resumen mensual (mock)." })
    ] }),
    /* @__PURE__ */ jsx(VentasChart, { data: d.ventasMensuales, title: "Ventas por mes" })
  ] });
}

const $$Ventas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Ventas - Reportes" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ReporteVentas", ReporteVentas, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/reportes/ReporteVentas", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/ventas.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/ventas.astro";
const $$url = "/reportes/ventas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Ventas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
