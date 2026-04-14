import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { l as listPlantillas, f as upsertPlantilla, h as deletePlantilla } from '../../chunks/configLocalService_C83i_HSE.mjs';
export { renderers } from '../../renderers.mjs';

function PlantillasManager() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const refresh = () => setList(listPlantillas());
  useEffect(() => {
    refresh();
  }, []);
  const filtered = useMemo(() => filter === "all" ? list : list.filter((x) => x.tipo === filter), [list, filter]);
  const create = () => {
    setEditing({ id: "", tipo: "cotizacion", nombre: "Nueva plantilla", contenido: "" });
  };
  const save = () => {
    if (!editing) return;
    if (!editing.nombre.trim()) return alert("Nombre requerido");
    upsertPlantilla({ ...editing, nombre: editing.nombre.trim() });
    setEditing(null);
    refresh();
  };
  const remove = (id) => {
    if (!confirm("¿Eliminar plantilla?")) return;
    deletePlantilla(id);
    refresh();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Plantillas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Textos predefinidos para cotización/acta/cobro." })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: create, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Nueva"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: /* @__PURE__ */ jsxs(
      "select",
      {
        value: filter,
        onChange: (e) => setFilter(e.target.value),
        className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
        children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Todas" }),
          /* @__PURE__ */ jsx("option", { value: "cotizacion", children: "Cotización" }),
          /* @__PURE__ */ jsx("option", { value: "acta", children: "Acta" }),
          /* @__PURE__ */ jsx("option", { value: "cobro", children: "Cobro" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800", children: [
          filtered.length,
          " plantilla(s)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200", children: filtered.map((t) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setEditing(t),
            className: "w-full text-left px-5 py-3 hover:bg-gray-50",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: t.nombre }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: t.tipo })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    remove(t.id);
                  },
                  className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs hover:bg-gray-50",
                  children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3 text-red-600" }),
                    " Eliminar"
                  ]
                }
              )
            ] })
          },
          t.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: !editing ? /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Selecciona una plantilla para editar o crea una nueva." }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Tipo" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: editing.tipo,
                onChange: (e) => setEditing((p) => ({ ...p, tipo: e.target.value })),
                className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "cotizacion", children: "cotizacion" }),
                  /* @__PURE__ */ jsx("option", { value: "acta", children: "acta" }),
                  /* @__PURE__ */ jsx("option", { value: "cobro", children: "cobro" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Nombre" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: editing.nombre,
                onChange: (e) => setEditing((p) => ({ ...p, nombre: e.target.value })),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Contenido" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: editing.contenido,
              onChange: (e) => setEditing((p) => ({ ...p, contenido: e.target.value })),
              className: "min-h-[220px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: save, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            " Guardar"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setEditing(null), className: "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50", children: "Cancelar" })
        ] })
      ] }) })
    ] })
  ] });
}

const $$Plantillas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Plantillas - Configuraci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PlantillasManager", PlantillasManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/config/PlantillasManager", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/plantillas.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/plantillas.astro";
const $$url = "/config/plantillas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Plantillas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
