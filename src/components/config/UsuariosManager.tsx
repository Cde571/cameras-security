import React, { useEffect, useState } from "react";
import { Plus, Trash2, KeyRound } from "lucide-react";
import {
  deleteUsuario,
  listUsuarios,
  upsertUsuario,
  type Usuario,
} from "../../lib/services/configLocalService";

export default function UsuariosManager() {
  const [list, setList] = useState<Usuario[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    rol: "ventas" as Usuario["rol"],
    password: "",
    activo: true,
  });

  const refresh = () => setList(listUsuarios());
  useEffect(() => {
    refresh();
  }, []);

  const create = () => {
    try {
      if (form.nombre.trim().length < 3) throw new Error("Nombre mínimo 3 caracteres");
      if (!form.email.trim()) throw new Error("Email requerido");
      if (form.password.trim().length < 4) throw new Error("La contraseña debe tener mínimo 4 caracteres");

      upsertUsuario({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        rol: form.rol,
        password: form.password.trim(),
        activo: form.activo,
      });

      setForm({
        nombre: "",
        email: "",
        rol: "ventas",
        password: "",
        activo: true,
      });
      refresh();
    } catch (err: any) {
      alert(err?.message ?? "No fue posible crear el usuario");
    }
  };

  const update = (id: string, patch: Partial<Usuario>) => {
    try {
      const cur = list.find((u) => u.id === id);
      if (!cur) return;
      upsertUsuario({ ...cur, ...patch });
      refresh();
    } catch (err: any) {
      alert(err?.message ?? "No fue posible actualizar el usuario");
    }
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
        <p className="text-sm text-gray-500">
          Estos usuarios ahora controlan el inicio de sesión del sistema.
        </p>
      </header>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">Crear usuario</h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <input
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            placeholder="Nombre"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <input
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <select
            value={form.rol}
            onChange={(e) => setForm((p) => ({ ...p, rol: e.target.value as Usuario["rol"] }))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="admin">admin</option>
            <option value="ventas">ventas</option>
            <option value="tecnico">tecnico</option>
          </select>

          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Contraseña"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm"
            />
          </div>

          <button
            onClick={create}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))}
          />
          Crear como usuario activo
        </label>

        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Tip: si no quieres cambiar la contraseña de un usuario existente, deja su valor actual.
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800">
          {list.length} usuario(s)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Nombre</th>
                <th className="px-5 py-3 text-left font-semibold">Email</th>
                <th className="px-5 py-3 text-left font-semibold">Rol</th>
                <th className="px-5 py-3 text-left font-semibold">Contraseña</th>
                <th className="px-5 py-3 text-left font-semibold">Activo</th>
                <th className="px-5 py-3 text-left font-semibold">Último acceso</th>
                <th className="px-5 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <input
                      value={u.nombre}
                      onChange={(e) => update(u.id, { nombre: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <input
                      value={u.email}
                      onChange={(e) => update(u.id, { email: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <select
                      value={u.rol}
                      onChange={(e) => update(u.id, { rol: e.target.value as Usuario["rol"] })}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <option value="admin">admin</option>
                      <option value="ventas">ventas</option>
                      <option value="tecnico">tecnico</option>
                    </select>
                  </td>

                  <td className="px-5 py-3">
                    <input
                      value={u.password}
                      onChange={(e) => update(u.id, { password: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={u.activo}
                      onChange={(e) => update(u.id, { activo: e.target.checked })}
                    />
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-500">
                    {u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleString("es-CO") : "Sin acceso"}
                  </td>

                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => remove(u.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
