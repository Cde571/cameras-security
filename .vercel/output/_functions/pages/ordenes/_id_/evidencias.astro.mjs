import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Trash2, Image, Video, FileText } from 'lucide-react';
import { g as getOrden, b as updateOrden } from '../../../chunks/ordenLocalService_KxGhULNN.mjs';
export { renderers } from '../../../renderers.mjs';

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `ev_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function EvidenciasUpload({ ordenId }) {
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [evidencias, setEvidencias] = useState([]);
  const [nota, setNota] = useState("");
  useEffect(() => {
    const o = getOrden(ordenId);
    setNombre(o?.numero || "");
    setEvidencias(o?.evidencias || []);
    setLoading(false);
  }, [ordenId]);
  const save = (next) => {
    setEvidencias(next);
    updateOrden(ordenId, { evidencias: next });
  };
  const addNota = () => {
    if (!nota.trim()) return;
    const ev = {
      id: uid(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      type: "nota",
      titulo: "Nota",
      nota: nota.trim()
    };
    save([ev, ...evidencias]);
    setNota("");
  };
  const onFile = async (file) => {
    const max = 2 * 1024 * 1024;
    if (file.size > max) {
      alert("Archivo muy grande para modo local. Máximo 2MB (front-first).");
      return;
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    const type = file.type.startsWith("image/") ? "foto" : file.type.startsWith("video/") ? "video" : "archivo";
    const ev = {
      id: uid(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      type,
      titulo: file.name,
      dataUrl
    };
    save([ev, ...evidencias]);
  };
  const remove = (id) => {
    const ok = confirm("¿Eliminar evidencia?");
    if (!ok) return;
    save(evidencias.filter((e) => e.id !== id));
  };
  const iconFor = (t) => {
    if (t === "foto") return /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" });
    if (t === "video") return /* @__PURE__ */ jsx(Video, { className: "h-4 w-4" });
    if (t === "nota") return /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" });
    return /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" });
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cargando evidencias..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Evidencias" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "Orden: ",
          nombre || ordenId
        ] })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: `/ordenes/${ordenId}`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Volver"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Subir archivo (máx 2MB)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              onChange: (e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.currentTarget.value = "";
              },
              className: "block w-full text-sm"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Nota: en producción guardamos en Cloudinary/S3 y aquí solo URL." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Agregar nota" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: nota,
              onChange: (e) => setNota(e.target.value),
              className: "min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
              placeholder: "Ej: se cambió canaleta, se ajustó ángulo, etc."
            }
          ),
          /* @__PURE__ */ jsxs("button", { onClick: addNota, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
            /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
            " Guardar nota"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Listado" }),
        evidencias.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Sin evidencias." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: evidencias.map((e) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 p-3 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-800", children: [
              iconFor(e.type),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: e.titulo || e.type })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => remove(e.id), className: "rounded-lg border border-gray-300 p-2 hover:bg-white", title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: new Date(e.createdAt).toLocaleString("es-CO") }),
          e.type === "nota" && e.nota ? /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-700", children: e.nota }) : null,
          e.dataUrl && e.type === "foto" ? /* @__PURE__ */ jsx("img", { src: e.dataUrl, alt: e.titulo || "evidencia", className: "w-full rounded-lg border border-gray-200" }) : null,
          e.dataUrl && e.type === "video" ? /* @__PURE__ */ jsx("video", { src: e.dataUrl, controls: true, className: "w-full rounded-lg border border-gray-200" }) : null,
          e.dataUrl && e.type === "archivo" ? /* @__PURE__ */ jsx("a", { href: e.dataUrl, download: e.titulo || "archivo", className: "text-sm text-blue-600 hover:text-blue-700", children: "Descargar archivo" }) : null
        ] }, e.id)) })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Evidencias = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Evidencias;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Evidencias orden ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "EvidenciasUpload", EvidenciasUpload, { "client:load": true, "ordenId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/ordenes/EvidenciasUpload", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/[id]/evidencias.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/ordenes/[id]/evidencias.astro";
const $$url = "/ordenes/[id]/evidencias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Evidencias,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
