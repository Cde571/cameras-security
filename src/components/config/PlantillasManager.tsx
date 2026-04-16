import React, { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { deletePlantilla, listPlantillas, upsertPlantilla, type Plantilla } from "../../lib/repositories/configRepo";

export default function PlantillasManager() {
  const [list, setList] = useState<Plantilla[]>([]);
  const [filter, setFilter] = useState<Plantilla["tipo"] | "all">("all");
  const [editing, setEditing] = useState<Plantilla | null>(null);

  const refresh = () => setList(listPlantillas());
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => filter === "all" ? list : list.filter(x => x.tipo === filter), [list, filter]);

  const create = () => {
    setEditing({ id: "", tipo: "cotizacion", nombre: "Nueva plantilla", contenido: "" } as any);
  };

  const save = () => {
    if (!editing) return;
    if (!editing.nombre.trim()) return alert("Nombre requerido");
    upsertPlantilla({ ...editing, nombre: editing.nombre.trim() } as any);
    setEditing(null);
    refresh();
  };

  const remove = (id: string) => {
    if (!confirm("¿Eliminar plantilla?")) return;
    deletePlantilla(id);
    refresh();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Plantillas</h1>
          <p className="text-sm text-gray-500">Textos predefinidos para cotización/acta/cobro.</p>
        </div>
        <button onClick={create} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Nueva
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">Todas</option>
          <option value="cotizacion">Cotización</option>
          <option value="acta">Acta</option>
          <option value="cobro">Cobro</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800">{filtered.length} plantilla(s)</div>
          <div className="divide-y divide-gray-200">
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => setEditing(t)}
                className="w-full text-left px-5 py-3 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.nombre}</p>
                    <p className="text-xs text-gray-500">{t.tipo}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(t.id); }}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs hover:bg-gray-50"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" /> Eliminar
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {!editing ? (
            <div className="text-sm text-gray-600">
              Selecciona una plantilla para editar o crea una nueva.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Tipo</label>
                  <select value={editing.tipo} onChange={(e) => setEditing(p => ({ ...(p as any), tipo: e.target.value as any }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="cotizacion">cotizacion</option>
                    <option value="acta">acta</option>
                    <option value="cobro">cobro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Nombre</label>
                  <input value={editing.nombre} onChange={(e) => setEditing(p => ({ ...(p as any), nombre: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Contenido</label>
                <textarea value={editing.contenido} onChange={(e) => setEditing(p => ({ ...(p as any), contenido: e.target.value }))}
                  className="min-h-[220px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <Save className="h-4 w-4" /> Guardar
                </button>
                <button onClick={() => setEditing(null)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

