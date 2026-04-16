import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { deleteProducto, getProductoMeta, listProductos } from "../../lib/repositories/productoRepo";

type Producto = {
  id: string;
  nombre: string;
  codigo?: string;
  sku?: string;
  categoria?: string;
  marca?: string;
  precio?: number;
  costo?: number;
  stock?: number;
  activo?: boolean;
  estado?: string;
};

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

export default function ProductosList() {
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [activo, setActivo] = useState<"all" | "active" | "inactive">("all");
  const [refresh, setRefresh] = useState(0);

  const [meta, setMeta] = useState<Meta>(emptyMeta);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);

        const [metaData, productosData] = await Promise.all([
          getProductoMeta(),
          listProductos(q, { categoria, marca, activo }),
        ]);

        if (!cancelled) {
          setMeta(metaData || emptyMeta);
          setProductos(Array.isArray(productosData) ? productosData : []);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        if (!cancelled) {
          setMeta(emptyMeta);
          setProductos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [q, categoria, marca, activo, refresh]);

  const counters = useMemo(() => {
    return {
      total: meta.total ?? productos.length,
      activos: meta.activos ?? productos.filter((p) => p.activo !== false && p.estado !== "inactivo").length,
      inactivos: meta.inactivos ?? productos.filter((p) => p.activo === false || p.estado === "inactivo").length,
    };
  }, [meta, productos]);

  const onDelete = async (id: string) => {
    const ok = confirm("¿Eliminar este producto? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await deleteProducto(id);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No fue posible eliminar el producto.");
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">Gestión de catálogo, filtros y estado de productos.</p>
        </div>

        <a
          href="/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Crear producto
        </a>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
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
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Categorías base</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{meta.categorias.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, código, SKU..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas las categorías</option>
          {meta.categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas las marcas</option>
          {meta.marcas.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={activo}
          onChange={(e) => setActivo(e.target.value as any)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : `${productos.length} producto(s)`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-700 font-medium">No hay productos para mostrar</p>
            <p className="text-sm text-gray-500 mt-1">
              La información base de filtros ya fue recuperada. Si no ves productos, entonces la tabla está vacía en la BD.
            </p>
            <a
              href="/productos/nuevo"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Crear producto
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Producto</th>
                <th className="px-5 py-3 text-left font-semibold">Categoría</th>
                <th className="px-5 py-3 text-left font-semibold">Marca</th>
                <th className="px-5 py-3 text-left font-semibold">Precio</th>
                <th className="px-5 py-3 text-left font-semibold">Stock</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productos.map((p) => {
                const isActive = p.activo !== false && p.estado !== "inactivo";
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">{p.nombre}</div>
                      <div className="text-xs text-gray-500">{p.codigo || p.sku || "—"}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{p.categoria || "—"}</td>
                    <td className="px-5 py-3 text-gray-700">{p.marca || "—"}</td>
                    <td className="px-5 py-3 text-gray-700">${Number(p.precio || 0).toLocaleString("es-CO")}</td>
                    <td className="px-5 py-3 text-gray-700">{Number(p.stock || 0)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <a
                          className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                          href={`/productos/${p.id}/editar`}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </a>
                        <button
                          type="button"
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(p.id)}
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