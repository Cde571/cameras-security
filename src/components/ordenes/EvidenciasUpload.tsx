import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload, Trash2, FileText, Image as ImgIcon, Video } from "lucide-react";
import { getOrden, updateOrden, type Evidencia } from "../../lib/services/ordenLocalService";

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `ev_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export default function EvidenciasUpload({ ordenId }: { ordenId: string }) {
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [nota, setNota] = useState("");

  useEffect(() => {
    const o = getOrden(ordenId);
    setNombre(o?.numero || "");
    setEvidencias(o?.evidencias || []);
    setLoading(false);
  }, [ordenId]);

  const save = (next: Evidencia[]) => {
    setEvidencias(next);
    updateOrden(ordenId, { evidencias: next });
  };

  const addNota = () => {
    if (!nota.trim()) return;
    const ev: Evidencia = {
      id: uid(),
      createdAt: new Date().toISOString(),
      type: "nota",
      titulo: "Nota",
      nota: nota.trim(),
    };
    save([ev, ...evidencias]);
    setNota("");
  };

  const onFile = async (file: File) => {
    const max = 2 * 1024 * 1024; // 2MB para no explotar localStorage
    if (file.size > max) {
      alert("Archivo muy grande para modo local. Máximo 2MB (front-first).");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

    const type = file.type.startsWith("image/")
      ? "foto"
      : file.type.startsWith("video/")
      ? "video"
      : "archivo";

    const ev: Evidencia = {
      id: uid(),
      createdAt: new Date().toISOString(),
      type,
      titulo: file.name,
      dataUrl,
    };

    save([ev, ...evidencias]);
  };

  const remove = (id: string) => {
    const ok = confirm("¿Eliminar evidencia?");
    if (!ok) return;
    save(evidencias.filter(e => e.id !== id));
  };

  const iconFor = (t: Evidencia["type"]) => {
    if (t === "foto") return <ImgIcon className="h-4 w-4" />;
    if (t === "video") return <Video className="h-4 w-4" />;
    if (t === "nota") return <FileText className="h-4 w-4" />;
    return <Upload className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando evidencias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Evidencias</h1>
          <p className="text-sm text-gray-500">Orden: {nombre || ordenId}</p>
        </div>
        <a href={`/ordenes/${ordenId}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> Volver
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Subir archivo (máx 2MB)</h3>

            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.currentTarget.value = "";
              }}
              className="block w-full text-sm"
            />

            <p className="text-xs text-gray-500">
              Nota: en producción guardamos en Cloudinary/S3 y aquí solo URL.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-900">Agregar nota</h3>
            <textarea value={nota} onChange={(e) => setNota(e.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              placeholder="Ej: se cambió canaleta, se ajustó ángulo, etc."
            />
            <button onClick={addNota} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Upload className="h-4 w-4" /> Guardar nota
            </button>
          </div>
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">Listado</h3>

          {evidencias.length === 0 ? (
            <p className="text-sm text-gray-600">Sin evidencias.</p>
          ) : (
            <div className="space-y-2">
              {evidencias.map((e) => (
                <div key={e.id} className="rounded-lg border border-gray-200 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      {iconFor(e.type)}
                      <span className="truncate">{e.titulo || e.type}</span>
                    </div>
                    <button onClick={() => remove(e.id)} className="rounded-lg border border-gray-300 p-2 hover:bg-white" title="Eliminar">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString("es-CO")}</p>

                  {e.type === "nota" && e.nota ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{e.nota}</pre>
                  ) : null}

                  {e.dataUrl && e.type === "foto" ? (
                    <img src={e.dataUrl} alt={e.titulo || "evidencia"} className="w-full rounded-lg border border-gray-200" />
                  ) : null}

                  {e.dataUrl && e.type === "video" ? (
                    <video src={e.dataUrl} controls className="w-full rounded-lg border border-gray-200" />
                  ) : null}

                  {e.dataUrl && e.type === "archivo" ? (
                    <a href={e.dataUrl} download={e.titulo || "archivo"} className="text-sm text-blue-600 hover:text-blue-700">
                      Descargar archivo
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
