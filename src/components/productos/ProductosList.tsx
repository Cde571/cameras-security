import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package, Filter } from "lucide-react";
import { deleteProducto, getProductoMeta, listProductos } from "../../lib/services/productoLocalService";

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

export default function ProductosList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);

  const meta = useMemo(() => getProductoMeta(), [refresh]);
  const [categoria, setCategoria] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [activo, setActivo] = useState<"all" | "active" | "inactive">("all");

  const productos = useMemo(
    () => listProductos(q, { categoria, marca, activo }),
    [q, categoria, marca, activo, refresh]
  );

  useEffect(() => {
    listProductos("");
    setRefresh(n => n + 1);
  }, []);

  const onDelete = (id: string) => {
    const ok = confirm("¿Eliminar este producto? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteProducto(id);
    setRefresh(n => n + 1);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">Catálogo de productos, precios y estado.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href="/productos/nuevo" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Crear producto
          </a>
          <a href="/productos/kits" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <Package className="h-4 w-4" />
            Kits / Combos
          </a>
          <a href="/productos/importar" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            Importar desde Excel
          </a>
          <a href="/productos/categorias" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            Categorías y Marcas
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, SKU, categoría, marca..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={activo} onChange={(e) => setActivo(e.target.value as any)} className="w-full bg-transparent outline-none text-sm">
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <label className="text-xs font-semibold text-gray-600">Categoría</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
            <option value="">Todas</option>
            {meta.categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <label className="text-xs font-semibold text-gray-600">Marca</label>
          <select value={marca} onChange={(e) => setMarca(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
            <option value="">Todas</option>
            {meta.marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">{productos.length} producto(s)</p>
          <p className="text-xs text-gray-500">COP • IVA configurable</p>
        </div>

        {productos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Sin resultados</p>
            <p className="text-sm text-gray-500 mt-1">Crea un producto o ajusta filtros/búsqueda.</p>
            <a href="/productos/nuevo" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Crear producto
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Producto</th>
                <th className="px-5 py-3 text-left font-semibold">Categoría / Marca</th>
                <th className="px-5 py-3 text-left font-semibold">Precio</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{p.nombre}</div>
                    <div className="text-xs text-gray-500">{p.sku || "—"} • {p.unidad || "unidad"}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-gray-800">{p.categoria || "—"}</div>
                    <div className="text-xs text-gray-500">{p.marca || "—"}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{money(Number(p.precio || 0))}</div>
                    <div className="text-xs text-gray-500">IVA {Number(p.ivaPct || 0)}%</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.activo === false ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                    }`}>
                      {p.activo === false ? "Inactivo" : "Activo"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/productos/${p.id}/editar`} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </a>
                      <button className="rounded-lg border border-gray-300 p-2 hover:bg-white" onClick={() => onDelete(p.id)} title="Eliminar">
                        <Trash2 className="h-4 w-4 text-red-600" />
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
