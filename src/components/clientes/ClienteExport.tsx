import React, { useState } from "react";
import { Download, Upload } from "lucide-react";
import { exportClientesCSV, importClientesCSV } from "../../lib/repositories/clienteRepo";

export default function ClienteExport() {
  const [msg, setMsg] = useState<string>("");

  const downloadCsv = () => {
    const csv = exportClientesCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
    setMsg("Exportación lista: CSV descargado.");
  };

  const onImport = async (file?: File | null) => {
    if (!file) return;
    setMsg("Importando...");
    try {
      const res = await importClientesCSV(file);
      setMsg(`Importación completada: creados ${res.created}, actualizados ${res.updated}.`);
    } catch (e: any) {
      setMsg(`Error: ${e?.message || "no se pudo importar"}`);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Importar / Exportar</h1>
          <p className="text-sm text-gray-500">Gestiona clientes en CSV (front-first).</p>
        </div>
        <a className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/clientes">
          Volver
        </a>
      </header>

      {msg ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-700">
          {msg}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900">Exportar clientes</h2>
          <p className="text-sm text-gray-500">
            Descarga un CSV con todos los clientes registrados en el navegador.
          </p>
          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Descargar CSV
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900">Importar clientes</h2>
          <p className="text-sm text-gray-500">
            Sube un CSV con cabeceras: nombre, documento, telefono, email, direccion, ciudad, estado, notas (id opcional).
          </p>

          <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 cursor-pointer w-fit">
            <Upload className="h-4 w-4" />
            Seleccionar CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => onImport(e.target.files?.[0])}
            />
          </label>
        </section>
      </div>
    </div>
  );
}

