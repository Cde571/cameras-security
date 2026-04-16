import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Pencil, Image, Trash2 } from 'lucide-react';
import { g as getOrden, f as deleteOrden, b as updateOrden } from '../../chunks/ordenLocalService_KxGhULNN.mjs';
export { renderers } from '../../renderers.mjs';

function OrdenDetail({ ordenId }) {
  const [o, setO] = useState(null);
  useEffect(() => {
    setO(getOrden(ordenId));
  }, [ordenId]);
  const progress = useMemo(() => {
    if (!o) return 0;
    const total = o.checklist?.length || 0;
    const done = (o.checklist || []).filter((c) => c.done).length;
    if (total === 0) return 0;
    return Math.round(done / total * 100);
  }, [o]);
  const del = () => {
    if (!o) return;
    const ok = confirm("¿Eliminar esta orden?");
    if (!ok) return;
    deleteOrden(o.id);
    window.location.href = "/ordenes";
  };
  const toggleQuick = (idx) => {
    if (!o) return;
    const checklist = (o.checklist || []).map((c, i) => i === idx ? { ...c, done: !c.done } : c);
    const updated = updateOrden(o.id, { checklist });
    setO(updated);
  };
  if (!o) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Orden no encontrada." }),
      /* @__PURE__ */ jsx("a", { className: "mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/ordenes", children: "Volver" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: o.numero }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          o.status,
          " • Creación ",
          o.fechaCreacion,
          " • Programada ",
          o.fechaProgramada || "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/ordenes", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Volver"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `/ordenes/${o.id}/editar`, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
          " Editar"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `/ordenes/${o.id}/evidencias`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" }),
          " Evidencias"
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
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: o.cliente?.nombre }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            o.cliente?.documento || "",
            " ",
            o.cliente?.ciudad ? `• ${o.cliente.ciudad}` : ""
          ] })
        ] }),
        o.asunto ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Asunto" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: o.asunto })
        ] }) : null,
        o.direccionServicio ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Dirección servicio" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: o.direccionServicio })
        ] }) : null,
        o.tecnico?.nombre ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Técnico" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: o.tecnico.nombre })
        ] }) : null,
        o.observaciones ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Observaciones" }),
          /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-700", children: o.observaciones })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Checklist" }),
        /* @__PURE__ */ jsxs("div", { className: "w-full rounded-lg bg-gray-50 p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Progreso" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-gray-900", children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-blue-600", style: { width: `${progress}%` } }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: (o.checklist || []).slice(0, 6).map((c, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => toggleQuick(idx),
            className: `w-full text-left rounded-lg border px-3 py-2 text-sm ${c.done ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:bg-gray-50"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: `${c.done ? "text-green-800 font-semibold" : "text-gray-800"}`, children: c.label }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: c.done ? "Hecho" : "Pendiente" })
            ] })
          },
          c.id
        )) }),
        /* @__PURE__ */ jsx("a", { href: `/ordenes/${o.id}/editar`, className: "block rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm", children: "Editar checklist completo" }),
        /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-gray-200", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
          "Evidencias: ",
          o.evidencias?.length || 0
        ] }) })
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
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Orden ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "OrdenDetail", OrdenDetail, { "client:load": true, "ordenId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/ordenes/OrdenDetail", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/[id].astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/[id].astro";
const $$url = "/ordenes/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
