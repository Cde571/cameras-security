import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { g as getActa } from '../../chunks/actaLocalService_BDWGoUzL.mjs';
export { renderers } from '../../renderers.mjs';

function ActaDetail({ actaId }) {
  const [acta, setActa] = useState(null);
  useEffect(() => {
    setActa(getActa(actaId));
  }, [actaId]);
  const count = useMemo(() => acta?.activos?.reduce((a, x) => a + (x.cantidad || 0), 0) ?? 0, [acta]);
  if (!acta) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Acta no encontrada." }),
      /* @__PURE__ */ jsx("a", { className: "mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/actas", children: "Volver" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: acta.numero }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          acta.status,
          " • ",
          acta.fecha,
          " • ",
          acta.cliente?.nombre
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/actas", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Volver"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `/actas/${acta.id}/pdf`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
          " PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Cliente" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: acta.cliente?.nombre }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            acta.cliente?.documento || "",
            " ",
            acta.lugar ? `• ${acta.lugar}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Tipo" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Descripción" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Cant" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Serial" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Ubicación" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: acta.activos.map((a) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: a.tipo }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: a.descripcion }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right font-semibold", children: a.cantidad }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: a.serial || "—" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: a.ubicacion || "—" })
          ] }, a.id)) })
        ] }) }),
        acta.observaciones ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Observaciones" }),
          /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-700", children: acta.observaciones })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Resumen" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
            "Ítems entregados: ",
            /* @__PURE__ */ jsx("b", { children: count })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
            "Técnico: ",
            /* @__PURE__ */ jsx("b", { children: acta.responsables?.tecnico || "—" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
            "Recibe: ",
            /* @__PURE__ */ jsx("b", { children: acta.responsables?.clienteRecibe || "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-gray-200", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 mb-2", children: "Firma" }),
          acta.firmaClienteDataUrl ? /* @__PURE__ */ jsx("img", { src: acta.firmaClienteDataUrl, alt: "Firma", className: "w-full rounded-lg border border-gray-200 bg-white" }) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500", children: "Sin firma registrada" })
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
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Acta ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ActaDetail", ActaDetail, { "client:load": true, "actaId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/actas/ActaDetail", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/actas/[id].astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/actas/[id].astro";
const $$url = "/actas/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
