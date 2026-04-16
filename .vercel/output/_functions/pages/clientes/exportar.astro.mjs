import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { e as exportClientesCSV, i as importClientesCSV } from '../../chunks/clienteLocalService_BAQfU60Z.mjs';
export { renderers } from '../../renderers.mjs';

function ClienteExport() {
  const [msg, setMsg] = useState("");
  const downloadCsv = () => {
    const csv = exportClientesCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMsg("Exportación lista: CSV descargado.");
  };
  const onImport = async (file) => {
    if (!file) return;
    setMsg("Importando...");
    try {
      const res = await importClientesCSV(file);
      setMsg(`Importación completada: creados ${res.created}, actualizados ${res.updated}.`);
    } catch (e) {
      setMsg(`Error: ${e?.message || "no se pudo importar"}`);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Importar / Exportar" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Gestiona clientes en CSV (front-first)." })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/clientes", children: "Volver" })
    ] }),
    msg ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-700", children: msg }) : null,
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Exportar clientes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Descarga un CSV con todos los clientes registrados en el navegador." }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: downloadCsv,
            className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
              "Descargar CSV"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Importar clientes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Sube un CSV con cabeceras: nombre, documento, telefono, email, direccion, ciudad, estado, notas (id opcional)." }),
        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 cursor-pointer w-fit", children: [
          /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
          "Seleccionar CSV",
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: ".csv,text/csv",
              className: "hidden",
              onChange: (e) => onImport(e.target.files?.[0])
            }
          )
        ] })
      ] })
    ] })
  ] });
}

const $$Exportar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Importar/Exportar Clientes - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ClienteExport", ClienteExport, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/clientes/ClienteExport", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/exportar.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/exportar.astro";
const $$url = "/clientes/exportar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Exportar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
