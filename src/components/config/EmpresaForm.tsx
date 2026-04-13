import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getEmpresa, setEmpresa } from "../../lib/services/configLocalService";

export default function EmpresaForm() {
  const [form, setForm] = useState(getEmpresa());

  useEffect(() => setForm(getEmpresa()), []);

  const onChange = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const onSave = () => {
    setEmpresa(form);
    alert("Empresa guardada.");
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Empresa</h1>
          <p className="text-sm text-gray-500">Datos que salen en PDFs (cotización, acta, cobro).</p>
        </div>
        <button onClick={onSave} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Save className="h-4 w-4" /> Guardar
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Nombre</label>
            <input value={form.nombre || ""} onChange={(e) => onChange("nombre", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">NIT</label>
            <input value={form.nit || ""} onChange={(e) => onChange("nit", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Teléfono</label>
              <input value={form.telefono || ""} onChange={(e) => onChange("telefono", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Email</label>
              <input value={form.email || ""} onChange={(e) => onChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Dirección</label>
            <input value={form.direccion || ""} onChange={(e) => onChange("direccion", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Ciudad</label>
              <input value={form.ciudad || ""} onChange={(e) => onChange("ciudad", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Website</label>
              <input value={form.website || ""} onChange={(e) => onChange("website", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-2">
          <h2 className="font-semibold text-gray-900">Logo (URL)</h2>
          <input value={form.logoUrl || ""} onChange={(e) => onChange("logoUrl", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="https://..."
          />
          {form.logoUrl ? (
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
              <img src={form.logoUrl} alt="Logo" className="max-h-24" />
            </div>
          ) : (
            <p className="text-xs text-gray-500">Opcional. Luego podemos permitir upload a Cloudinary.</p>
          )}
        </section>
      </div>
    </div>
  );
}
