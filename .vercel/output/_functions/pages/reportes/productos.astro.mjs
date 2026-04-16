import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { g as getReporteDashboard } from '../../chunks/reporteLocalService_DI9hL2vR.mjs';
import { T as TopProductos } from '../../chunks/TopProductos_D-ZOGXo7.mjs';
export { renderers } from '../../renderers.mjs';

function ReporteProductos() {
  const d = getReporteDashboard();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Productos" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Top productos (mock)." })
    ] }),
    /* @__PURE__ */ jsx(TopProductos, { data: d.topProductos })
  ] });
}

const $$Productos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Productos - Reportes" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ReporteProductos", ReporteProductos, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/reportes/ReporteProductos", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/productos.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/productos.astro";
const $$url = "/reportes/productos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Productos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
