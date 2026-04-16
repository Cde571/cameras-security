import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { Download } from 'lucide-react';
import { e as exportVentasCSV, g as getReporteDashboard } from '../chunks/reporteLocalService_DI9hL2vR.mjs';
import { V as VentasChart } from '../chunks/VentasChart_CUHZqj7_.mjs';
import { T as TopProductos } from '../chunks/TopProductos_D-ZOGXo7.mjs';
import { T as TopClientes } from '../chunks/TopClientes_BCeijIbb.mjs';
import { M as MargenChart } from '../chunks/MargenChart_Ch0m1Y2n.mjs';
export { renderers } from '../renderers.mjs';

function downloadText(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function ExportButtons() {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => downloadText("reporte_ventas.csv", exportVentasCSV(), "text/csv"),
      className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50",
      children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        "Exportar Ventas (CSV)"
      ]
    }
  );
}

function money(n) {
  try {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  } catch {
    return `$ ${Math.round(n)}`;
  }
}
function ReportesDashboard() {
  const d = getReporteDashboard();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Resumen" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Total ventas" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-gray-900", children: money(d.kpis.totalVentas) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Total documentos" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-gray-900", children: d.kpis.totalDocumentos })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Margen promedio" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-gray-900", children: [
            d.kpis.margenPromedioPct,
            "%"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(VentasChart, { data: d.ventasMensuales, title: "Ventas (últimos 12 meses)" }) }),
      /* @__PURE__ */ jsx(MargenChart, { data: d.margenes })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(TopProductos, { data: d.topProductos }),
      /* @__PURE__ */ jsx(TopClientes, { data: d.topClientes })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Reportes - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"> <div> <h1 class="text-2xl font-semibold text-gray-900">Reportes</h1> <p class="text-sm text-gray-500">Dashboard general.</p> </div> ${renderComponent($$result2, "ExportButtons", ExportButtons, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/reportes/ExportButtons", "client:component-export": "default" })} </header> ${renderComponent($$result2, "ReportesDashboard", ReportesDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/reportes/ReportesDashboard", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/reportes/index.astro";
const $$url = "/reportes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
