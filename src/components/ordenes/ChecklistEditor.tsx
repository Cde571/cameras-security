import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ChecklistItem } from "../../lib/repositories/ordenRepo";

type Props = {
  checklist: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
};

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `chk_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export default function ChecklistEditor({ checklist, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  };

  const setLabel = (id: string, label: string) => {
    onChange(checklist.map((c) => (c.id === id ? { ...c, label } : c)));
  };

  const add = () => onChange([{ id: uid(), label: "Nuevo ítem", done: false }, ...checklist]);

  const remove = (id: string) => onChange(checklist.filter((c) => c.id !== id));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Checklist</h3>
        <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Agregar
        </button>
      </div>

      {checklist.length === 0 ? (
        <p className="text-sm text-gray-600">Sin checklist. Puedes agregar ítems o cargar una plantilla.</p>
      ) : (
        <div className="space-y-2">
          {checklist.map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2">
              <input type="checkbox" checked={c.done} onChange={() => toggle(c.id)} />
              <input
                value={c.label}
                onChange={(e) => setLabel(c.id, e.target.value)}
                className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-sm"
              />
              <button type="button" onClick={() => remove(c.id)} className="rounded-lg border border-gray-300 p-2 hover:bg-white" title="Eliminar">
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

