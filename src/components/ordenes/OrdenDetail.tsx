import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Image } from "lucide-react";
import { deleteOrden, getOrden, updateOrden, type Orden } from "../../lib/services/ordenLocalService";

export default function OrdenDetail({ ordenId }: { ordenId: string }) {
  const [o, setO] = useState<Orden | null>(null);

  useEffect(() => {
    setO(getOrden(ordenId));
  }, [ordenId]);

  const progress = useMemo(() => {
    if (!o) return 0;
    const total = o.checklist?.length || 0;
    const done = (o.checklist || []).filter(c => c.done).length;
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  }, [o]);

  const del = () => {
    if (!o) return;
    const ok = confirm("¿Eliminar esta orden?");
    if (!ok) return;
    deleteOrden(o.id);
    window.location.href = "/ordenes";
  };

  const toggleQuick = (idx: number) => {
    if (!o) return;
    const checklist = (o.checklist || []).map((c, i) => i === idx ? { ...c, done: !c.done } : c);
    const updated = updateOrden(o.id, { checklist });
    setO(updated);
  };

  if (!o) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Orden no encontrada.</p>
        <a className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/ordenes">Volver</a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{o.numero}</h1>
          <p className="text-sm text-gray-500">{o.status} • Creación {o.fechaCreacion} • Programada {o.fechaProgramada || "—"}</p>
        </div>

        <div className="flex gap-2">
          <a href="/ordenes" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </a>
          <a href={`/ordenes/${o.id}/editar`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Pencil className="h-4 w-4" /> Editar
          </a>
          <a href={`/ordenes/${o.id}/evidencias`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <Image className="h-4 w-4" /> Evidencias
          </a>
          <button onClick={del} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <Trash2 className="h-4 w-4 text-red-600" /> Eliminar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500">Cliente</p>
            <p className="font-semibold text-gray-900">{o.cliente?.nombre}</p>
            <p className="text-sm text-gray-600">{o.cliente?.documento || ""} {o.cliente?.ciudad ? `• ${o.cliente.ciudad}` : ""}</p>
          </div>

          {o.asunto ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Asunto</p>
              <p className="text-gray-800">{o.asunto}</p>
            </div>
          ) : null}

          {o.direccionServicio ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Dirección servicio</p>
              <p className="text-gray-800">{o.direccionServicio}</p>
            </div>
          ) : null}

          {o.tecnico?.nombre ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Técnico</p>
              <p className="text-gray-800">{o.tecnico.nombre}</p>
            </div>
          ) : null}

          {o.observaciones ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Observaciones</p>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{o.observaciones}</pre>
            </div>
          ) : null}
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">Checklist</h3>

          <div className="w-full rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progreso</span>
              <span className="font-semibold text-gray-900">{progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {(o.checklist || []).slice(0, 6).map((c, idx) => (
              <button key={c.id} type="button" onClick={() => toggleQuick(idx)}
                className={`w-full text-left rounded-lg border px-3 py-2 text-sm ${
                  c.done ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`${c.done ? "text-green-800 font-semibold" : "text-gray-800"}`}>{c.label}</span>
                  <span className="text-xs text-gray-500">{c.done ? "Hecho" : "Pendiente"}</span>
                </div>
              </button>
            ))}
          </div>

          <a href={`/ordenes/${o.id}/editar`} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm">
            Editar checklist completo
          </a>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">Evidencias: {o.evidencias?.length || 0}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
