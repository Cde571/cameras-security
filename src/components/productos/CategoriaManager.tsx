import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addCategoria, addMarca, getProductoMeta, removeCategoria, removeMarca } from "../../lib/repositories/productoRepo";

export default function CategoriaManager() {
  const [meta, setMeta] = useState(getProductoMeta());
  const [cat, setCat] = useState("");
  const [mar, setMar] = useState("");

  const refresh = () => setMeta(getProductoMeta());

  useEffect(() => refresh(), []);

  const addCat = () => {
    addCategoria(cat);
    setCat("");
    refresh();
  };

  const addMar = () => {
    addMarca(mar);
    setMar("");
    refresh();
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Categorías y Marcas</h1>
          <p className="text-sm text-gray-500">Estructura base del catálogo.</p>
        </div>
        <a className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/productos">
          Volver
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Categorías</h2>

          <div className="flex gap-2">
            <input value={cat} onChange={(e) => setCat(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Nueva categoría"
            />
            <button onClick={addCat} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Agregar
            </button>
          </div>

          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
            {meta.categorias.map((c) => (
              <li key={c} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-800">{c}</span>
                <button
                  onClick={() => { removeCategoria(c); refresh(); }}
                  className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Marcas</h2>

          <div className="flex gap-2">
            <input value={mar} onChange={(e) => setMar(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Nueva marca"
            />
            <button onClick={addMar} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Agregar
            </button>
          </div>

          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
            {meta.marcas.map((m) => (
              <li key={m} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-800">{m}</span>
                <button
                  onClick={() => { removeMarca(m); refresh(); }}
                  className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

