import React, { useEffect, useState } from "react";
import { listClientes } from "../../lib/repositories/clienteRepo";

type Cliente = {
  id: string;
  nombre: string;
  documento?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
};

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
};

export default function ClienteSelector({
  value = "",
  onChange,
  label = "Cliente",
  placeholder = "Selecciona un cliente",
  disabled = false,
  className = "",
  ...rest
}: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadClientes() {
      try {
        setLoading(true);

        const data = await listClientes("");
        const arr = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.items)
            ? (data as any).items
            : [];

        if (!cancelled) {
          setClientes(arr);
        }
      } catch (error) {
        console.error("Error cargando clientes en selector:", error);
        if (!cancelled) {
          setClientes([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadClientes();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-semibold text-gray-600">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled || loading}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-400"
        {...rest}
      >
        <option value="">
          {loading ? "Cargando clientes..." : placeholder}
        </option>

        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}{c.documento ? ` - ${c.documento}` : ""}
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