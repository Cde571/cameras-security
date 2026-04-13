import React, { useState } from "react";
import { Upload, ArrowLeft } from "lucide-react";
import { createProducto, listProductos, updateProducto } from "../../lib/services/productoLocalService";

function num(v: any) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

type Row = Record<string, any>;

function normalizeKey(k: string) {
  return String(k || "").trim().toLowerCase();
}

function pick(row: Row, keys: string[], fallback = "") {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return fallback;
}

export default function ImportExcel() {
  const [msg, setMsg] = useState<string>("");

  const importRows = (rows: Row[]) => {
    // match por SKU si existe, si no por nombre
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

      const match =
        (sku && existing.find(p => (p.sku || "").trim().toLowerCase() === sku.toLowerCase())) ||
        existing.find(p => p.nombre.trim().toLowerCase() === nombre.toLowerCase());

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

  const onFile = async (file?: File | null) => {
    if (!file) return;
    setMsg("Procesando archivo...");

    const ext = file.name.toLowerCase().split(".").pop() || "";
    try {
      if (ext === "csv") {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) return setMsg("CSV vacío o inválido.");

        const headers = lines[0].split(",").map(h => normalizeKey(h));
        const rows: Row[] = [];

        for (let i = 1; i < lines.length; i++) {
          const raw = lines[i];
          if (!raw.trim()) continue;

          // parser simple con comillas
          const cols: string[] = [];
          let cur = "";
          let inQuotes = false;
          for (let j = 0; j < raw.length; j++) {
            const ch = raw[j];
            if (ch === '"' && raw[j + 1] === '"') { cur += '"'; j++; continue; }
            if (ch === '"') { inQuotes = !inQuotes; continue; }
            if (ch === "," && !inQuotes) { cols.push(cur); cur = ""; continue; }
            cur += ch;
          }
          cols.push(cur);

          const obj: Row = {};
          headers.forEach((h, idx) => (obj[h] = (cols[idx] ?? "").trim()));
          rows.push(obj);
        }

        importRows(rows);
        return;
      }

      // XLSX/XLS: requiere dependencia "xlsx"
      // npm i xlsx
      const xlsx = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = xlsx.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(sheet, { defval: "" }) as Row[];

      // normalizar keys a lower
      const normalized = json.map((r) => {
        const obj: Row = {};
        Object.keys(r).forEach((k) => (obj[normalizeKey(k)] = (r as any)[k]));
        return obj;
      });

      importRows(normalized);
    } catch (e: any) {
      setMsg(`Error importando: ${e?.message || "verifica el archivo o instala xlsx (npm i xlsx)"}`);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Importar desde Excel</h1>
          <p className="text-sm text-gray-500">Soporta .xlsx/.xls (requiere xlsx) y .csv.</p>
        </div>
        <a className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/productos">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </a>
      </header>

      {msg ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-700">{msg}</div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-900">Subir archivo</h2>
        <p className="text-sm text-gray-500">
          Columnas sugeridas: nombre, sku, categoria, marca, unidad, costo, precio, iva, activo.
        </p>

        <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 cursor-pointer w-fit">
          <Upload className="h-4 w-4" />
          Seleccionar Excel/CSV
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>

        <p className="text-xs text-gray-500">
          Nota: si te sale error con Excel, instala dependencia: <span className="font-semibold">npm i xlsx</span>.
        </p>
      </section>
    </div>
  );
}
