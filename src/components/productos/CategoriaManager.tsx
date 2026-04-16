import React, { useEffect, useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { getProductoMeta } from "../../lib/repositories/productoRepo";

type Meta = {
  categorias: string[];
  marcas: string[];
  total: number;
  activos: number;
  inactivos: number;
};

const emptyMeta: Meta = {
  categorias: [],
  marcas: [],
  total: 0,
  activos: 0,
  inactivos: 0,
};

export default function CategoriaManager() {
  const [meta, setMeta] = useState<Meta>(emptyMeta);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  async function refreshMeta() {
    try {
      setLoading(true);
      const data = await getProductoMeta();

      setMeta({
        categorias: Array.isArray(data?.categorias) ? data.categorias : [],
        marcas: Array.isArray(data?.marcas) ? data.marcas : [],
        total: Number(data?.total || 0),
        activos: Number(data?.activos || 0),
        inactivos: Number(data?.inactivos || 0),
      });
    } catch (error) {
      console.error("Error cargando categorías:", error);
      setMeta(emptyMeta);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshMeta();
  }, [refresh]);

  const addCategoria = () => {
    const nombre = nuevaCategoria.trim();
    if (!nombre) return;

    alert("La inserción manual de categorías quedará conectada al backend en el siguiente paso. Por ahora ya quedaron sembradas las categorías base.");
    setNuevaCategoria("");
    setRefresh((n) => n + 1);
  };

  const removeCategoria = (nombre: string) => {
    alert(`La eliminación directa de la categoría "${nombre}" quedará conectada al backend en el siguiente paso.`);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Categorías</h1>
        <p className="text-sm text-gray-500">Administra las categorías base del catálogo.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Categorías</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{meta.categorias.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Marcas</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{meta.marcas.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Productos</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{meta.total}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex gap-2">
          <input
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nueva categoría"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addCategoria}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <p className="text-sm font-semibold text-gray-800">Listado de categorías</p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-600">Cargando categorías...</div>
        ) : meta.categorias.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No hay categorías disponibles.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {meta.categorias.map((c) => (
              <li key={c} className="flex items-center justify-between px-4 py-3">
                <span className="inline-flex items-center gap-2 text-sm text-gray-800">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {c}
                </span>

                <button
                  type="button"
                  onClick={() => removeCategoria(c)}
                  className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}