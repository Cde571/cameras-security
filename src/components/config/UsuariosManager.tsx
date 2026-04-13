import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { deleteUsuario, listUsuarios, upsertUsuario, type Usuario } from "../../lib/services/configLocalService";

export default function UsuariosManager() {
  const [list, setList] = useState<Usuario[]>([]);
  const [form, setForm] = useState({ nombre: "", email: "", rol: "ventas" as Usuario["rol"] });

  const refresh = () => setList(listUsuarios());
  useEffect(() => { refresh(); }, []);

  const create = () => {
    if (form.nombre.trim().length < 3) return alert("Nombre mínimo 3");
    if (!form.email.trim()) return alert("Email requerido");
    upsertUsuario({ nombre: form.nombre.trim(), email: form.email.trim(), rol: form.rol } as any);
    setForm({ nombre: "", email: "", rol: "ventas" });
    refresh();
  };

  const update = (id: string, patch: Partial<Usuario>) => {
    const cur = list.find(u => u.id === id);
    if (!cur) return;
    upsertUsuario({ ...cur, ...patch } as any);
    refresh();
  };

  const remove = (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    deleteUsuario(id);
    refresh();
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Usuarios y roles</h1>
        <p className="text-sm text-gray-500">Administración básica (mock).</p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-900">Crear usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={form.nombre} onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))}
            placeholder="Nombre"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="Email"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <select value={form.rol} onChange={(e) => setForm(p => ({ ...p, rol: e.target.value as any }))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="admin">admin</option>
            <option value="ventas">ventas</option>
            <option value="tecnico">tecnico</option>
          </select>
          <button onClick={create} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800">{list.length} usuario(s)</div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Nombre</th>
              <th className="px-5 py-3 text-left font-semibold">Email</th>
              <th className="px-5 py-3 text-left font-semibold">Rol</th>
              <th className="px-5 py-3 text-left font-semibold">Activo</th>
              <th className="px-5 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <input value={u.nombre} onChange={(e) => update(u.id, { nombre: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>
                <td className="px-5 py-3">
                  <input value={u.email} onChange={(e) => update(u.id, { email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>
                <td className="px-5 py-3">
                  <select value={u.rol} onChange={(e) => update(u.id, { rol: e.target.value as any })}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2"
                  >
                    <option value="admin">admin</option>
                    <option value="ventas">ventas</option>
                    <option value="tecnico">tecnico</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <input type="checkbox" checked={u.activo} onChange={(e) => update(u.id, { activo: e.target.checked })} />
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(u.id)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50">
                    <Trash2 className="h-4 w-4 text-red-600" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
