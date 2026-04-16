import React, { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, Search } from "lucide-react";
import { createChecklistTemplate, deleteChecklistTemplate, listChecklistTemplates, updateChecklistTemplate, type ChecklistTemplate } from "../../lib/repositories/ordenRepo";

export default function ChecklistsManager() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(() => listChecklistTemplates(q), [q, refresh]);

  const [edit, setEdit] = useState<ChecklistTemplate | null>(null);

  useEffect(() => {
    const base = listChecklistTemplates("");
    setRefresh(n => n + 1);
    if (base[0]) setEdit(base[0]);
  }, []);

  const pick = (id: string) => {
    const t = list.find(x => x.id === id) || listChecklistTemplates("").find(x => x.id === id);
    if (!t) return;
    setEdit(t);
  };

  const create = () => {
    const tpl = createChecklistTemplate("Nuevo checklist");
    setRefresh(n => n + 1);
    setEdit(tpl);
  };

  const save = () => {
    if (!edit) return;
    if (edit.nombre.trim().length < 3) return alert("Nombre mínimo 3 caracteres.");
    updateChecklistTemplate(edit.id, { nombre: edit.nombre, items: edit.items });
    setRefresh(n => n + 1);
    alert("Checklist guardado.");
  };

  const del = () => {
    if (!edit) return;
    const ok = confirm("¿Eliminar este checklist?");
    if (!ok) return;
    deleteChecklistTemplate(edit.id);
    setEdit(null);
    setRefresh(n => n + 1);
  };

  const setItem = (idx: number, label: string) => {
    if (!edit) return;
    const items = edit.items.map((it, i) => i === idx ? ({ ...it, label }) : it);
    setEdit({ ...edit, items });
  };

  const addItem = () => {
    if (!edit) return;
    setEdit({ ...edit, items: [{ label: "Nuevo ítem" }, ...edit.items] });
  };

  const removeItem = (idx: number) => {
    if (!edit) return;
    setEdit({ ...edit, items: edit.items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Checklists</h1>
          <p className="text-sm text-gray-500">Plantillas reutilizables para órdenes.</p>
        </div>
        <div className="flex gap-2">
          <a className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/ordenes">
            Volver
          </a>
          <button onClick={create} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Nuevo
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
                <div className="text-xs text-gray-500">{t.items.length} ítems</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          {!edit ? (
            <p className="text-sm text-gray-600">Selecciona una plantilla o crea una nueva.</p>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Nombre</label>
                <input
                  value={edit.nombre}
                  onChange={(e) => setEdit({ ...edit, nombre: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Ítems</h3>
                <button onClick={addItem} className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm">
                  + Agregar ítem
                </button>
              </div>

              <div className="space-y-2">
                {edit.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2">
                    <input
                      value={it.label}
                      onChange={(e) => setItem(idx, e.target.value)}
                      className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                    <button onClick={() => removeItem(idx)} className="rounded-lg border border-gray-300 p-2 hover:bg-white" title="Eliminar">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
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

