import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { g as getReporteDashboard } from '../../chunks/reporteLocalService_DI9hL2vR.mjs';
import { M as MargenChart } from '../../chunks/MargenChart_Ch0m1Y2n.mjs';
export { renderers } from '../../renderers.mjs';

function ReporteMargenes() {
  const d = getReporteDashboard();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Márgenes" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Márgenes por categoría (mock)." })
    ] }),
    /* @__PURE__ */ jsx(MargenChart, { data: d.margenes })
  ] });
}

const $$Margenes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "M\xE1rgenes - Reportes" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ReporteMargenes", ReporteMargenes, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/reportes/ReporteMargenes", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/margenes.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/margenes.astro";
const $$url = "/reportes/margenes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Margenes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
