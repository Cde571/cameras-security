import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import { l as listChecklistTemplates, c as createChecklistTemplate, u as updateChecklistTemplate, d as deleteChecklistTemplate } from '../../chunks/ordenLocalService_KxGhULNN.mjs';
export { renderers } from '../../renderers.mjs';

function ChecklistsManager() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(() => listChecklistTemplates(q), [q, refresh]);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    const base = listChecklistTemplates("");
    setRefresh((n) => n + 1);
    if (base[0]) setEdit(base[0]);
  }, []);
  const pick = (id) => {
    const t = list.find((x) => x.id === id) || listChecklistTemplates("").find((x) => x.id === id);
    if (!t) return;
    setEdit(t);
  };
  const create = () => {
    const tpl = createChecklistTemplate("Nuevo checklist");
    setRefresh((n) => n + 1);
    setEdit(tpl);
  };
  const save = () => {
    if (!edit) return;
    if (edit.nombre.trim().length < 3) return alert("Nombre mínimo 3 caracteres.");
    updateChecklistTemplate(edit.id, { nombre: edit.nombre, items: edit.items });
    setRefresh((n) => n + 1);
    alert("Checklist guardado.");
  };
  const del = () => {
    if (!edit) return;
    const ok = confirm("¿Eliminar este checklist?");
    if (!ok) return;
    deleteChecklistTemplate(edit.id);
    setEdit(null);
    setRefresh((n) => n + 1);
  };
  const setItem = (idx, label) => {
    if (!edit) return;
    const items = edit.items.map((it, i) => i === idx ? { ...it, label } : it);
    setEdit({ ...edit, items });
  };
  const addItem = () => {
    if (!edit) return;
    setEdit({ ...edit, items: [{ label: "Nuevo ítem" }, ...edit.items] });
  };
  const removeItem = (idx) => {
    if (!edit) return;
    setEdit({ ...edit, items: edit.items.filter((_, i) => i !== idx) });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Checklists" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Plantillas reutilizables para órdenes." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/ordenes", children: "Volver" }),
        /* @__PURE__ */ jsxs("button", { onClick: create, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " Nuevo"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: q,
              onChange: (e) => setQ(e.target.value),
              placeholder: "Buscar...",
              className: "w-full bg-transparent outline-none text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200", children: list.map((t) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => pick(t.id),
            className: `w-full px-4 py-3 text-left hover:bg-gray-50 ${edit?.id === t.id ? "bg-blue-50" : "bg-white"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 text-sm", children: t.nombre }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                t.items.length,
                " ítems"
              ] })
            ]
          },
          t.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: !edit ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Selecciona una plantilla o crea una nueva." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: edit.nombre,
              onChange: (e) => setEdit({ ...edit, nombre: e.target.value }),
              className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Ítems" }),
          /* @__PURE__ */ jsx("button", { onClick: addItem, className: "rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm", children: "+ Agregar ítem" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: edit.items.map((it, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-200 p-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: it.label,
              onChange: (e) => setItem(idx, e.target.value),
              className: "flex-1 rounded-md border border-gray-200 px-2 py-1 text-sm"
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: () => removeItem(idx), className: "rounded-lg border border-gray-300 p-2 hover:bg-white", title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
        ] }, idx)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: del, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }),
            " Eliminar"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: save, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            " Guardar"
          ] })
        ] })
      ] }) })
    ] })
  ] });
}

const $$Checklists = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Checklists - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ChecklistsManager", ChecklistsManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/ordenes/ChecklistsManager", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/checklists.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/checklists.astro";
const $$url = "/ordenes/checklists";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checklists,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
