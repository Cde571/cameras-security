import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { listCheckListTemplates } from "../../lib/repositories/ordenRepo";

type CheckItem = {
  id: string;
  label: string;
  checked: boolean;
};

type ChecklistTemplate = {
  id: string;
  nombre: string;
  activo?: boolean;
  items: CheckItem[];
};

export default function ChecklistsManager() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [list, setList] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<ChecklistTemplate | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTemplates() {
      try {
        setLoading(true);
        const data = await listCheckListTemplates(q);
        const arr = Array.isArray(data) ? data : [];

        if (!cancelled) {
          setList(arr);
          if (!edit && arr[0]) {
            setEdit(arr[0]);
          }
        }
      } catch (error) {
        console.error("Error cargando checklists:", error);
        if (!cancelled) {
          setList([]);
          setEdit(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTemplates();

    return () => {
      cancelled = true;
    };
  }, [q, refresh]);

  const pick = (id: string) => {
    const found = list.find((x) => x.id === id) || null;
    setEdit(found ? { ...found } : null);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Plantillas de checklist</h1>
        <p className="text-sm text-gray-500">Consulta las plantillas base para órdenes de trabajo.</p>
      </header>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar plantilla..."
          className="w-full bg-transparent text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setRefresh((n) => n + 1)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Recargar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <aside className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">Plantillas</p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-gray-600">Cargando plantillas...</div>
          ) : list.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No hay plantillas disponibles.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {list.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => pick(tpl.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                    edit?.id === tpl.id ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="font-semibold text-gray-900 text-sm">{tpl.nombre}</div>
                  <div className="text-xs text-gray-500">
                    {tpl.activo === false ? "Inactiva" : "Activa"} · {Array.isArray(tpl.items) ? tpl.items.length : 0} ítems
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          {!edit ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center text-gray-500">
              <ClipboardList className="h-10 w-10 text-gray-300" />
              <p className="mt-3">Selecciona una plantilla para verla.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{edit.nombre}</h2>
                <p className="text-sm text-gray-500">
                  Estado: {edit.activo === false ? "Inactiva" : "Activa"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(Array.isArray(edit.items) ? edit.items : []).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}