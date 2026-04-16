import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getNumeracion, setNumeracion } from "../../lib/repositories/configRepo";

export default function NumeracionForm() {
  const [form, setForm] = useState(getNumeracion());
  useEffect(() => setForm(getNumeracion()), []);

  const onChange = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const onSave = () => {
    setNumeracion(form);
    alert("Numeración guardada.");
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Numeración</h1>
          <p className="text-sm text-gray-500">Prefijos y consecutivos.</p>
        </div>
        <button onClick={onSave} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Save className="h-4 w-4" /> Guardar
        </button>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Prefijo Cotización</label>
            <input value={form.cotizacionPrefix} onChange={(e) => onChange("cotizacionPrefix", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Prefijo Cobro</label>
            <input value={form.cobroPrefix} onChange={(e) => onChange("cobroPrefix", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Prefijo Orden</label>
            <input value={form.ordenPrefix} onChange={(e) => onChange("ordenPrefix", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Prefijo Acta</label>
            <input value={form.actaPrefix} onChange={(e) => onChange("actaPrefix", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Siguiente Cotización</label>
            <input type="number" value={form.nextCotizacion} onChange={(e) => onChange("nextCotizacion", Number(e.target.value || 0))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Siguiente Cobro</label>
            <input type="number" value={form.nextCobro} onChange={(e) => onChange("nextCobro", Number(e.target.value || 0))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Siguiente Orden</label>
            <input type="number" value={form.nextOrden} onChange={(e) => onChange("nextOrden", Number(e.target.value || 0))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Siguiente Acta</label>
            <input type="number" value={form.nextActa} onChange={(e) => onChange("nextActa", Number(e.target.value || 0))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Luego conectamos estos consecutivos con cotizaciones/órdenes/actas/cobros reales (cuando pasemos del mock al backend).
        </p>
      </div>
    </div>
  );
}

