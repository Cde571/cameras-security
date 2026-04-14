import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { b as getNumeracion, c as setNumeracion } from '../../chunks/configLocalService_C83i_HSE.mjs';
export { renderers } from '../../renderers.mjs';

function NumeracionForm() {
  const [form, setForm] = useState(getNumeracion());
  useEffect(() => setForm(getNumeracion()), []);
  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const onSave = () => {
    setNumeracion(form);
    alert("Numeración guardada.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Numeración" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Prefijos y consecutivos." })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onSave, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        " Guardar"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Prefijo Cotización" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.cotizacionPrefix,
              onChange: (e) => onChange("cotizacionPrefix", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Prefijo Cobro" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.cobroPrefix,
              onChange: (e) => onChange("cobroPrefix", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Prefijo Orden" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.ordenPrefix,
              onChange: (e) => onChange("ordenPrefix", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Prefijo Acta" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.actaPrefix,
              onChange: (e) => onChange("actaPrefix", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Siguiente Cotización" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: form.nextCotizacion,
              onChange: (e) => onChange("nextCotizacion", Number(e.target.value || 0)),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Siguiente Cobro" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: form.nextCobro,
              onChange: (e) => onChange("nextCobro", Number(e.target.value || 0)),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Siguiente Orden" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: form.nextOrden,
              onChange: (e) => onChange("nextOrden", Number(e.target.value || 0)),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Siguiente Acta" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: form.nextActa,
              onChange: (e) => onChange("nextActa", Number(e.target.value || 0)),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Luego conectamos estos consecutivos con cotizaciones/órdenes/actas/cobros reales (cuando pasemos del mock al backend)." })
    ] })
  ] });
}

const $$Numeracion = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Numeraci\xF3n - Configuraci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "NumeracionForm", NumeracionForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/config/NumeracionForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/numeracion.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/numeracion.astro";
const $$url = "/config/numeracion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Numeracion,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
