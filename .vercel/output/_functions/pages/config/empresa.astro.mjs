import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { g as getEmpresa, s as setEmpresa } from '../../chunks/configLocalService_C83i_HSE.mjs';
export { renderers } from '../../renderers.mjs';

function EmpresaForm() {
  const [form, setForm] = useState(getEmpresa());
  useEffect(() => setForm(getEmpresa()), []);
  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const onSave = () => {
    setEmpresa(form);
    alert("Empresa guardada.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Empresa" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Datos que salen en PDFs (cotización, acta, cobro)." })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onSave, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        " Guardar"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.nombre || "",
              onChange: (e) => onChange("nombre", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "NIT" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.nit || "",
              onChange: (e) => onChange("nit", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Teléfono" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.telefono || "",
                onChange: (e) => onChange("telefono", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Email" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.email || "",
                onChange: (e) => onChange("email", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Dirección" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.direccion || "",
              onChange: (e) => onChange("direccion", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Ciudad" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.ciudad || "",
                onChange: (e) => onChange("ciudad", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Website" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.website || "",
                onChange: (e) => onChange("website", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Logo (URL)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: form.logoUrl || "",
            onChange: (e) => onChange("logoUrl", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
            placeholder: "https://..."
          }
        ),
        form.logoUrl ? /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-lg border border-gray-200 bg-white p-3", children: /* @__PURE__ */ jsx("img", { src: form.logoUrl, alt: "Logo", className: "max-h-24" }) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Opcional. Luego podemos permitir upload a Cloudinary." })
      ] })
    ] })
  ] });
}

const $$Empresa = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Empresa - Configuraci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "EmpresaForm", EmpresaForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/config/EmpresaForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/empresa.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/empresa.astro";
const $$url = "/config/empresa";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Empresa,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
