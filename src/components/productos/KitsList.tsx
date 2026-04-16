import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { deleteKit, listKits } from "../../lib/repositories/productoRepo";

type Kit = {
  id: string;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  precio?: number;
  precioTotal?: number;
  costoTotal?: number;
  activo?: boolean;
  estado?: string;
};

export default function KitsList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadKits() {
      try {
        setLoading(true);
        const data = await listKits(q);

        if (!cancelled) {
          setKits(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error cargando kits:", error);
        if (!cancelled) setKits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadKits();

    return () => {
      cancelled = true;
    };
  }, [q, refresh]);

  const counters = useMemo(() => {
    const activos = kits.filter((x) => x.activo !== false && x.estado !== "inactivo").length;
    const inactivos = kits.length - activos;

    return {
      total: kits.length,
      activos,
      inactivos,
    };
  }, [kits]);

  const onDelete = async (id: string) => {
    const ok = confirm("¿Eliminar este kit? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await deleteKit(id);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando kit:", error);
      alert("No fue posible eliminar el kit.");
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Kits</h1>
          <p className="text-sm text-gray-500">Gestión de kits conectados al backend.</p>
        </div>

        <a
          href="/productos/kits/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo kit
        </a>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{counters.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Activos</p>
          <p className="mt-2 text-2xl font-semibold text-green-700">{counters.activos}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Inactivos</p>
          <p className="mt-2 text-2xl font-semibold text-gray-700">{counters.inactivos}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, código o descripción..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : `${kits.length} kit(s)`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Cargando kits...</p>
          </div>
        ) : kits.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-700 font-medium">No hay kits para mostrar</p>
            <p className="text-sm text-gray-500 mt-1">
              Si esperabas registros, revisa si la tabla está vacía o si faltan datos sembrados.
            </p>
            <a
              href="/productos/kits/nuevo"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Crear kit
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Kit</th>
                <th className="px-5 py-3 text-left font-semibold">Descripción</th>
                <th className="px-5 py-3 text-left font-semibold">Precio</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kits.map((k) => {
                const activo = k.activo !== false && k.estado !== "inactivo";
                return (
                  <tr key={k.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">{k.nombre}</div>
                      <div className="text-xs text-gray-500">{k.codigo || "—"}</div>
                    </td>

                    <td className="px-5 py-3 text-gray-700">{k.descripcion || "—"}</td>

                    <td className="px-5 py-3 text-gray-700">
                      ${Number(k.precio || k.precioTotal || 0).toLocaleString("es-CO")}
                    </td>

                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <a
                          className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                          href={`/productos/kits/${k.id}/editar`}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </a>

                        <button
                          type="button"
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(k.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}