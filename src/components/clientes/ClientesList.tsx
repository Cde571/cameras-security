import React, { useEffect, useState } from "react";
import { Plus, Search, Download, Upload, Pencil, Eye, Trash2, History } from "lucide-react";
import { deleteCliente, listClientes } from "../../lib/repositories/clienteRepo";

type Cliente = {
  id: string;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  notas?: string;
  estado?: "activo" | "inactivo";
  createdAt?: string;
  updatedAt?: string;
};

export default function ClientesList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function cargar() {
      try {
        setLoading(true);
        const data = await listClientes(q);
        if (!cancelled) {
          setClientes(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error cargando clientes:", error);
        if (!cancelled) setClientes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    cargar();

    return () => {
      cancelled = true;
    };
  }, [q, refresh]);

  const onDelete = async (id: string) => {
    const ok = confirm("¿Eliminar este cliente? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await deleteCliente(id);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      alert("No fue posible eliminar el cliente.");
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">Listado, búsqueda, creación y gestión de clientes.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/clientes/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Crear cliente
          </a>

          <a
            href="/clientes/exportar"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Importar/Exportar
          </a>
        </div>
      </header>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, NIT/CC, teléfono, email, ciudad..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : `${clientes.length} cliente(s)`}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1"><Upload className="h-3 w-3" /> CSV</span>
            <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" /> CSV</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Cargando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Sin resultados</p>
            <p className="text-sm text-gray-500 mt-1">Prueba con otra búsqueda o crea un cliente nuevo.</p>
            <a
              href="/clientes/nuevo"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Crear cliente
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Contacto</th>
                <th className="px-5 py-3 text-left font-semibold">Ciudad</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{c.nombre}</div>
                    <div className="text-xs text-gray-500">{c.documento || "—"}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-gray-800">{c.telefono || "—"}</div>
                    <div className="text-xs text-gray-500">{c.email || "—"}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{c.ciudad || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.estado === "inactivo" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                    }`}>
                      {c.estado === "inactivo" ? "Inactivo" : "Activo"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/clientes/${c.id}`} title="Ver">
                        <Eye className="h-4 w-4" />
                      </a>
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/clientes/${c.id}/editar`} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </a>
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/clientes/${c.id}/historial`} title="Historial">
                        <History className="h-4 w-4" />
                      </a>
                      <button
                        type="button"
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(c.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}