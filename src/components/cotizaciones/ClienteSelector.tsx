import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { listClientes, type Cliente } from "../../lib/services/clienteLocalService";

type Props = {
  value?: string;
  onChange: (cliente: Cliente) => void;
};

export default function ClienteSelector({ value, onChange }: Props) {
  const [q, setQ] = useState("");

  const clientes = useMemo(() => listClientes(q), [q]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900">Cliente</h3>
        <a href="/clientes/nuevo" className="text-sm text-blue-600 hover:text-blue-700">+ Crear cliente</a>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar cliente..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <select
        value={value || ""}
        onChange={(e) => {
          const c = clientes.find((x) => x.id === e.target.value);
          if (c) onChange(c);
        }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
      >
        <option value="" disabled>Selecciona un cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre} {c.documento ? `- ${c.documento}` : ""}
          </option>
        ))}
      </select>

      {value ? (
        <p className="text-xs text-gray-500">
          Tip: luego conectamos esto con historial de documentos del cliente.
        </p>
      ) : null}
    </div>
  );
}
