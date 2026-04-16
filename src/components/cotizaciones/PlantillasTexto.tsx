import React, { useEffect, useMemo, useState } from "react";
import { Save, Trash2, FileText } from "lucide-react";
import { deletePlantilla, listPlantillas, updatePlantilla } from "../../lib/repositories/cotizacionRepo";

type Plantilla = {
  id: string;
  nombre: string;
  cuerpo?: string;
  activo?: boolean;
};

export default function PlantillasTexto() {
  const [list, setList] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState<Plantilla | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPlantillas() {
      try {
        setLoading(true);
        const data = await listPlantillas("");

        if (!cancelled) {
          const arr = Array.isArray(data) ? data : [];
          setList(arr);
          if (!edit && arr[0]) {
            setEdit(arr[0]);
          }
        }
      } catch (error) {
        console.error("Error cargando plantillas:", error);
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPlantillas();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const selectedId = useMemo(() => edit?.id ?? "", [edit]);

  const pick = (id: string) => {
    const tpl = list.find((x) => x.id === id) || null;
    setEdit(tpl ? { ...tpl } : null);
  };

  const onChange = (key: string, value: any) => {
    setEdit((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const onSave = async () => {
    if (!edit?.id) return;

    try {
      setSaving(true);
      const saved = await updatePlantilla(edit.id, {
        nombre: edit.nombre,
        cuerpo: edit.cuerpo,
        activo: edit.activo ?? true,
      });

      setEdit(saved);
      setRefresh((n) => n + 1);
      alert("Plantilla guardada correctamente.");
    } catch (error) {
      console.error("Error guardando plantilla:", error);
      alert("No fue posible guardar la plantilla.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!edit?.id) return;

    const ok = confirm("¿Eliminar esta plantilla?");
    if (!ok) return;

    try {
      await deletePlantilla(edit.id);
      setEdit(null);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando plantilla:", error);
      alert("No fue posible eliminar la plantilla.");
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Plantillas de texto</h1>
        <p className="text-sm text-gray-500">Administra textos base para condiciones comerciales.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <aside className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">Plantillas activas</p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-gray-600">Cargando plantillas...</div>
          ) : list.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No hay plantillas disponibles.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {list.map((t) => (
                <button
                  key={t.id}
                  onClick={() => pick(t.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                    selectedId === t.id ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="font-semibold text-gray-900 text-sm">{t.nombre}</div>
                  <div className="text-xs text-gray-500">{t.activo ? "Activa" : "Inactiva"}</div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          {!edit ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center text-gray-500">
              <FileText className="h-10 w-10 text-gray-300" />
              <p className="mt-3">Selecciona una plantilla para editarla.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600">Nombre</label>
                <input
                  value={edit.nombre || ""}
                  onChange={(e) => onChange("nombre", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600">Contenido</label>
                <textarea
                  value={edit.cuerpo || ""}
                  onChange={(e) => onChange("cuerpo", e.target.value)}
                  className="min-h-[260px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={edit.activo !== false}
                    onChange={(e) => onChange("activo", e.target.checked)}
                  />
                  Activa
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>

                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
                      saving ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}