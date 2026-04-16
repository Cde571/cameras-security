import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { l as listProductos, u as updateProducto, f as createProducto } from '../../chunks/productoLocalService_BY7j_gu7.mjs';
export { renderers } from '../../renderers.mjs';

function num(v) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function normalizeKey(k) {
  return String(k || "").trim().toLowerCase();
}
function pick(row, keys, fallback = "") {
  for (const k of keys) {
    const v = row[k];
    if (v !== void 0 && v !== null && String(v).trim() !== "") return v;
  }
  return fallback;
}
function ImportExcel() {
  const [msg, setMsg] = useState("");
  const importRows = (rows) => {
    const existing = listProductos("");
    let created = 0;
    let updated = 0;
    for (const r of rows) {
      const nombre = String(pick(r, ["nombre", "name", "producto", "descripcion"], "")).trim();
      if (!nombre) continue;
      const sku = String(pick(r, ["sku", "codigo", "código", "referencia", "ref"], "")).trim();
      const categoria = String(pick(r, ["categoria", "categoría"], "")).trim();
      const marca = String(pick(r, ["marca", "brand"], "")).trim();
      const unidad = String(pick(r, ["unidad", "unit"], "unidad")).trim() || "unidad";
      const costo = num(pick(r, ["costo", "cost", "precio_compra", "compra"], 0));
      const precio = num(pick(r, ["precio", "venta", "precio_venta", "pvp"], 0));
      const ivaPct = num(pick(r, ["iva", "ivaPct", "impuesto"], 19));
      const activoRaw = String(pick(r, ["activo", "estado"], "1")).toLowerCase();
      const activo = !(activoRaw === "0" || activoRaw.includes("inactivo"));
      const match = sku && existing.find((p) => (p.sku || "").trim().toLowerCase() === sku.toLowerCase()) || existing.find((p) => p.nombre.trim().toLowerCase() === nombre.toLowerCase());
      if (match) {
        updateProducto(match.id, { nombre, sku, categoria, marca, unidad, costo, precio, ivaPct, activo });
        updated++;
      } else {
        createProducto({ nombre, sku, categoria, marca, unidad, costo, precio, ivaPct, activo });
        created++;
      }
    }
    setMsg(`Importación completada: creados ${created}, actualizados ${updated}.`);
  };
  const onFile = async (file) => {
    if (!file) return;
    setMsg("Procesando archivo...");
    const ext = file.name.toLowerCase().split(".").pop() || "";
    try {
      if (ext === "csv") {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) return setMsg("CSV vacío o inválido.");
        const headers = lines[0].split(",").map((h) => normalizeKey(h));
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
          const raw = lines[i];
          if (!raw.trim()) continue;
          const cols = [];
          let cur = "";
          let inQuotes = false;
          for (let j = 0; j < raw.length; j++) {
            const ch = raw[j];
            if (ch === '"' && raw[j + 1] === '"') {
              cur += '"';
              j++;
              continue;
            }
            if (ch === '"') {
              inQuotes = !inQuotes;
              continue;
            }
            if (ch === "," && !inQuotes) {
              cols.push(cur);
              cur = "";
              continue;
            }
            cur += ch;
          }
          cols.push(cur);
          const obj = {};
          headers.forEach((h, idx) => obj[h] = (cols[idx] ?? "").trim());
          rows.push(obj);
        }
        importRows(rows);
        return;
      }
      const xlsx = await import('xlsx');
      const buf = await file.arrayBuffer();
      const wb = xlsx.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      const normalized = json.map((r) => {
        const obj = {};
        Object.keys(r).forEach((k) => obj[normalizeKey(k)] = r[k]);
        return obj;
      });
      importRows(normalized);
    } catch (e) {
      setMsg(`Error importando: ${e?.message || "verifica el archivo o instala xlsx (npm i xlsx)"}`);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Importar desde Excel" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Soporta .xlsx/.xls (requiere xlsx) y .csv." })
      ] }),
      /* @__PURE__ */ jsxs("a", { className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", href: "/productos", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Volver"
      ] })
    ] }),
    msg ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-700", children: msg }) : null,
    /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Subir archivo" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Columnas sugeridas: nombre, sku, categoria, marca, unidad, costo, precio, iva, activo." }),
      /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 cursor-pointer w-fit", children: [
        /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
        "Seleccionar Excel/CSV",
        /* @__PURE__ */ jsx("input", { type: "file", accept: ".xlsx,.xls,.csv", className: "hidden", onChange: (e) => onFile(e.target.files?.[0]) })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
        "Nota: si te sale error con Excel, instala dependencia: ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "npm i xlsx" }),
        "."
      ] })
    ] })
  ] });
}

const $$Importar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Importar Productos - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ImportExcel", ImportExcel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/productos/ImportExcel", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/importar.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/importar.astro";
const $$url = "/productos/importar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Importar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
