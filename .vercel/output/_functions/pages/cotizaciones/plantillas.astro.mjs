import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import { l as listPlantillas, b as createPlantilla, d as updatePlantilla, e as deletePlantilla } from '../../chunks/cotizacionLocalService_CikZvbuZ.mjs';
export { renderers } from '../../renderers.mjs';

function PlantillasTexto() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(() => listPlantillas(q), [q, refresh]);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    const base = listPlantillas("");
    setRefresh((n) => n + 1);
    if (base[0]) setEdit({ id: base[0].id, nombre: base[0].nombre, cuerpo: base[0].cuerpo, activo: base[0].activo });
  }, []);
  const pick = (id) => {
    const t = list.find((x) => x.id === id) || listPlantillas("").find((x) => x.id === id);
    if (!t) return;
    setEdit({ id: t.id, nombre: t.nombre, cuerpo: t.cuerpo, activo: t.activo });
  };
  const newTpl = () => {
    const t = createPlantilla({ nombre: "Nueva plantilla", cuerpo: "", activo: true });
    setRefresh((n) => n + 1);
    setEdit({ id: t.id, nombre: t.nombre, cuerpo: t.cuerpo, activo: t.activo });
  };
  const save = () => {
    if (!edit) return;
    if (edit.nombre.trim().length < 3) return alert("Nombre mínimo 3 caracteres.");
    updatePlantilla(edit.id, { nombre: edit.nombre, cuerpo: edit.cuerpo, activo: edit.activo });
    setRefresh((n) => n + 1);
    alert("Plantilla guardada.");
  };
  const del = () => {
    if (!edit) return;
    const ok = confirm("¿Eliminar esta plantilla?");
    if (!ok) return;
    deletePlantilla(edit.id);
    setEdit(null);
    setRefresh((n) => n + 1);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Plantillas de texto" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Condiciones predefinidas para cotizaciones." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/cotizaciones", children: "Volver" }),
        /* @__PURE__ */ jsxs("button", { onClick: newTpl, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " Nueva"
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
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t.activo ? "Activa" : "Inactiva" })
            ]
          },
          t.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: !edit ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Selecciona una plantilla o crea una nueva." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
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
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Estado" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: edit.activo ? "1" : "0",
                onChange: (e) => setEdit({ ...edit, activo: e.target.value === "1" }),
                className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "1", children: "Activa" }),
                  /* @__PURE__ */ jsx("option", { value: "0", children: "Inactiva" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Cuerpo" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: edit.cuerpo,
              onChange: (e) => setEdit({ ...edit, cuerpo: e.target.value }),
              className: "min-h-[320px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            }
          )
        ] }),
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

const $$Plantillas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Plantillas de texto - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PlantillasTexto", PlantillasTexto, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cotizaciones/PlantillasTexto", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/plantillas.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/plantillas.astro";
const $$url = "/cotizaciones/plantillas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Plantillas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
