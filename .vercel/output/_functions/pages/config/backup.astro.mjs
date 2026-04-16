import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { e as exportBackupJSON, r as restoreBackupJSON } from '../../chunks/configLocalService_DaV2BKqn.mjs';
export { renderers } from '../../renderers.mjs';

function downloadText(filename, content, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function BackupRestore() {
  const inputRef = useRef(null);
  const [msg, setMsg] = useState("");
  const exportNow = () => {
    const json = exportBackupJSON();
    downloadText(`backup_config_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, json);
  };
  const importNow = async (file) => {
    try {
      const text = await file.text();
      restoreBackupJSON(text);
      setMsg("✅ Backup restaurado. Recarga la página.");
    } catch (e) {
      setMsg("❌ Error restaurando backup: " + (e?.message || "desconocido"));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Backup" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Exportar / restaurar configuración (JSON)." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("button", { onClick: exportNow, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
          " Exportar backup"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => inputRef.current?.click(), className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
          " Restaurar backup"
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept: "application/json",
            hidden: true,
            onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) importNow(f);
              e.currentTarget.value = "";
            }
          }
        )
      ] }),
      msg ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: msg }) : null,
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Esto es front-first. Luego conectamos backup real (DB / archivos) si lo necesitas." })
    ] })
  ] });
}

const $$Backup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Backup - Configuraci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "BackupRestore", BackupRestore, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/config/BackupRestore", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/backup.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/backup.astro";
const $$url = "/config/backup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Backup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
