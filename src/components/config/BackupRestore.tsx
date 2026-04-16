import React, { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { exportBackupJSON, restoreBackupJSON } from "../../lib/repositories/configRepo";

function downloadText(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BackupRestore() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState("");

  const exportNow = () => {
    const json = exportBackupJSON();
    downloadText(`backup_config_${new Date().toISOString().slice(0,10)}.json`, json);
  };

  const importNow = async (file: File) => {
    try {
      const text = await file.text();
      restoreBackupJSON(text);
      setMsg("✅ Backup restaurado. Recarga la página.");
    } catch (e: any) {
      setMsg("❌ Error restaurando backup: " + (e?.message || "desconocido"));
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Backup</h1>
        <p className="text-sm text-gray-500">Exportar / restaurar configuración (JSON).</p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={exportNow} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Download className="h-4 w-4" /> Exportar backup
          </button>

          <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <Upload className="h-4 w-4" /> Restaurar backup
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importNow(f);
              e.currentTarget.value = "";
            }}
          />
        </div>

        {msg ? <p className="text-sm text-gray-700">{msg}</p> : null}

        <p className="text-xs text-gray-500">
          Esto es front-first. Luego conectamos backup real (DB / archivos) si lo necesitas.
        </p>
      </div>
    </div>
  );
}

