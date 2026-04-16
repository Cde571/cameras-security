import React, { useEffect, useMemo, useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { createCliente, getCliente, updateCliente } from "../../lib/repositories/clienteRepo";

type Props = {
  mode: "create" | "edit";
  clienteId?: string;
};

export default function ClienteForm({ mode, clienteId }: Props) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    notas: "",
    estado: "activo" as "activo" | "inactivo",
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    if (!clienteId) return;

    const c = getCliente(clienteId);
    if (c) {
      setForm({
        nombre: c.nombre || "",
        documento: c.documento || "",
        telefono: c.telefono || "",
        email: c.email || "",
        direccion: c.direccion || "",
        ciudad: c.ciudad || "",
        notas: c.notas || "",
        estado: (c.estado || "activo") as any,
      });
    }
    setLoading(false);
  }, [isEdit, clienteId]);

  const canSave = useMemo(() => form.nombre.trim().length >= 3, [form.nombre]);

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) {
      alert("Nombre del cliente es obligatorio (mínimo 3 caracteres).");
      return;
    }

    if (isEdit && clienteId) {
      updateCliente(clienteId, { ...form });
      window.location.href = `/clientes/${clienteId}`;
      return;
    }

    const nuevo = createCliente({ ...form });
    window.location.href = `/clientes/${nuevo.id}`;
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando cliente...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{isEdit ? "Editar cliente" : "Crear cliente"}</h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Actualiza la información del cliente." : "Registra un cliente nuevo para cotizaciones y documentos."}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/clientes"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
              canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
            disabled={!canSave}
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Datos del cliente</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Nombre / Razón social *</label>
            <input
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: Hotel Plaza Real"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Documento (NIT/CC)</label>
            <input
              value={form.documento}
              onChange={(e) => onChange("documento", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: 900123456-7"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) => onChange("telefono", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: 3001234567"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Email</label>
              <input
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: compras@cliente.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Dirección</label>
            <input
              value={form.direccion}
              onChange={(e) => onChange("direccion", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: Cra 10 # 12-34"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Ciudad</label>
              <input
                value={form.ciudad}
                onChange={(e) => onChange("ciudad", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: Medellín"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Estado</label>
              <select
                value={form.estado}
                onChange={(e) => onChange("estado", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Notas</h2>
          <textarea
            value={form.notas}
            onChange={(e) => onChange("notas", e.target.value)}
            className="min-h-[220px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Ej: condiciones, preferencias de pago, contacto principal..."
          />

          {isEdit && clienteId ? (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold">Acciones rápidas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50" href={`/clientes/${clienteId}`}>Ver detalle</a>
                <a className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50" href={`/clientes/${clienteId}/historial`}>Ver historial</a>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </form>
  );
}

