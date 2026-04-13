import React, { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, Search } from "lucide-react";
import { createPlantilla, deletePlantilla, listPlantillas, updatePlantilla } from "../../lib/services/cotizacionLocalService";

type Edit = { id: string; nombre: string; cuerpo: string; activo: boolean };

export default function PlantillasTexto() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);

  const list = useMemo(() => listPlantillas(q), [q, refresh]);

  const [edit, setEdit] = useState<Edit | null>(null);

  useEffect(() => {
    const base = listPlantillas("");
    setRefresh(n => n + 1);
    if (base[0]) setEdit({ id: base[0].id, nombre: base[0].nombre, cuerpo: base[0].cuerpo, activo: base[0].activo });
  }, []);

  const pick = (id: string) => {
    const t = list.find(x => x.id === id) || listPlantillas("").find(x => x.id === id);
    if (!t) return;
    setEdit({ id: t.id, nombre: t.nombre, cuerpo: t.cuerpo, activo: t.activo });
  };

  const newTpl = () => {
    const t = createPlantilla({ nombre: "Nueva plantilla", cuerpo: "", activo: true });
    setRefresh(n => n + 1);
    setEdit({ id: t.id, nombre: t.nombre, cuerpo: t.cuerpo, activo: t.activo });
  };

  const save = () => {
    if (!edit) return;
    if (edit.nombre.trim().length < 3) return alert("Nombre mínimo 3 caracteres.");
    updatePlantilla(edit.id, { nombre: edit.nombre, cuerpo: edit.cuerpo, activo: edit.activo });
    setRefresh(n => n + 1);
    alert("Plantilla guardada.");
  };

  const del = () => {
    if (!edit) return;
    const ok = confirm("¿Eliminar esta plantilla?");
    if (!ok) return;
    deletePlantilla(edit.id);
    setEdit(null);
    setRefresh(n => n + 1);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Plantillas de texto</h1>
          <p className="text-sm text-gray-500">Condiciones predefinidas para cotizaciones.</p>
        </div>
        <div className="flex gap-2">
          <a className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/cotizaciones">
            Volver
          </a>
          <button onClick={newTpl} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Nueva
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200">
            {list.map((t) => (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${edit?.id === t.id ? "bg-blue-50" : "bg-white"}`}
              >
                <div className="font-semibold text-gray-900 text-sm">{t.nombre}</div>
                <div className="text-xs text-gray-500">{t.activo ? "Activa" : "Inactiva"}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          {!edit ? (
            <p className="text-sm text-gray-600">Selecciona una plantilla o crea una nueva.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Nombre</label>
                  <input
                    value={edit.nombre}
                    onChange={(e) => setEdit({ ...edit, nombre: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Estado</label>
                  <select
                    value={edit.activo ? "1" : "0"}
                    onChange={(e) => setEdit({ ...edit, activo: e.target.value === "1" })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="1">Activa</option>
                    <option value="0">Inactiva</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Cuerpo</label>
                <textarea
                  value={edit.cuerpo}
                  onChange={(e) => setEdit({ ...edit, cuerpo: e.target.value })}
                  className="min-h-[320px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={del} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                  <Trash2 className="h-4 w-4 text-red-600" /> Eliminar
                </button>
                <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <Save className="h-4 w-4" /> Guardar
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
