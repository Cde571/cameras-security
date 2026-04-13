import React, { useMemo } from "react";
import type { Tecnico } from "../../lib/services/ordenLocalService";

type Props = {
  value?: Tecnico | null;
  onChange: (t: Tecnico | null) => void;
};

const tecnicosSeed: Tecnico[] = [
  { id: "tec1", nombre: "Técnico 1", telefono: "3000000000" },
  { id: "tec2", nombre: "Técnico 2", telefono: "3110000000" },
  { id: "tec3", nombre: "Técnico 3", telefono: "3220000000" },
];

export default function TecnicoAssign({ value, onChange }: Props) {
  const tecnicos = useMemo(() => tecnicosSeed, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
      <h3 className="font-semibold text-gray-900">Técnico</h3>

      <select
        value={value?.id || ""}
        onChange={(e) => {
          const id = e.target.value;
          const t = tecnicos.find(x => x.id === id) || null;
          onChange(t);
        }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Sin asignar</option>
        {tecnicos.map((t) => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      {value ? (
        <p className="text-xs text-gray-500">Tel: {value.telefono || "—"}</p>
      ) : (
        <p className="text-xs text-gray-500">Asignación rápida (seed). Luego lo conectamos a Usuarios.</p>
      )}
    </div>
  );
}
