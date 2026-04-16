import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { a as listImpuestos, u as upsertImpuesto, d as deleteImpuesto } from '../../chunks/configLocalService_DaV2BKqn.mjs';
export { renderers } from '../../renderers.mjs';

function ImpuestosForm() {
  const [list, setList] = useState([]);
  const [newItem, setNewItem] = useState({ nombre: "", porcentaje: 0 });
  const refresh = () => setList(listImpuestos());
  useEffect(() => {
    refresh();
  }, []);
  const create = () => {
    if (!newItem.nombre.trim()) return alert("Nombre requerido");
    upsertImpuesto({ nombre: newItem.nombre.trim(), porcentaje: Number(newItem.porcentaje || 0), activo: true });
    setNewItem({ nombre: "", porcentaje: 0 });
    refresh();
  };
  const update = (id, patch) => {
    const cur = list.find((x) => x.id === id);
    if (!cur) return;
    upsertImpuesto({ ...cur, ...patch });
    refresh();
  };
  const remove = (id) => {
    if (!confirm("¿Eliminar impuesto?")) return;
    deleteImpuesto(id);
    refresh();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Impuestos" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "IVA, retenciones, etc." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Crear impuesto" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: newItem.nombre,
            onChange: (e) => setNewItem((p) => ({ ...p, nombre: e.target.value })),
            placeholder: "Nombre (IVA)",
            className: "rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: newItem.porcentaje,
            onChange: (e) => setNewItem((p) => ({ ...p, porcentaje: Number(e.target.value || 0) })),
            placeholder: "%",
            className: "rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        ),
        /* @__PURE__ */ jsxs("button", { onClick: create, className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " Agregar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800", children: [
        list.length,
        " impuesto(s)"
      ] }),
      /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Nombre" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "%" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Activo" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acción" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: list.map((t) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              value: t.nombre,
              onChange: (e) => update(t.id, { nombre: e.target.value }),
              className: "w-full rounded-lg border border-gray-200 px-3 py-2"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: t.porcentaje,
              onChange: (e) => update(t.id, { porcentaje: Number(e.target.value || 0) }),
              className: "w-28 rounded-lg border border-gray-200 px-3 py-2"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: t.activo,
                onChange: (e) => update(t.id, { activo: e.target.checked })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "Sí" })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxs("button", { onClick: () => remove(t.id), className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }),
            " Eliminar"
          ] }) })
        ] }, t.id)) })
      ] })
    ] })
  ] });
}

const $$Impuestos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Impuestos - Configuraci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ImpuestosForm", ImpuestosForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/config/ImpuestosForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/impuestos.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/impuestos.astro";
const $$url = "/config/impuestos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Impuestos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
