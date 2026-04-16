import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { getEmpresa, setEmpresa, type EmpresaConfig } from "../../lib/repositories/configRepo";

const initialState: EmpresaConfig = {
  nombre: "Omnivision",
  nit: "",
  email: "admin@empresa.com",
  telefono: "",
  direccion: "",
  ciudad: "",
  website: "",
  logoUrl: "",
  resolucion: "",
  prefijoCotizacion: "COT",
  prefijoOrden: "OT",
  prefijoActa: "ACT",
  prefijoCobro: "CC",
  moneda: "COP",
  timezone: "America/Bogota",
};

export default function EmpresaForm() {
  const [form, setForm] = useState<EmpresaConfig>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await getEmpresa();
        if (!cancelled) setForm(data);
      } catch (error) {
        console.error("Error cargando empresa:", error);
        if (!cancelled) setForm(initialState);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  function onChange(key: keyof EmpresaConfig, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    try {
      setSaving(true);
      const saved = await setEmpresa(form);
      setForm(saved);
      alert("Empresa guardada.");
    } catch (error) {
      console.error("Error guardando empresa:", error);
      alert(error instanceof Error ? error.message : "No fue posible guardar la empresa.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configuración de empresa</h1>
          <p className="text-sm text-gray-500">Datos base usados en documentos, prefijos y branding.</p>
        </div>

        <div className="flex gap-2">
          <a
            href="/config"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="button"
            onClick={onSave}
            disabled={loading || saving}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-white ${
              !loading && !saving ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-sm text-gray-600">
          Cargando configuración de empresa...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold text-gray-900">Datos generales</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Nombre</label>
                  <input value={form.nombre} onChange={(e) => onChange("nombre", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">NIT</label>
                  <input value={form.nit} onChange={(e) => onChange("nit", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Correo</label>
                  <input value={form.email} onChange={(e) => onChange("email", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Teléfono</label>
                  <input value={form.telefono} onChange={(e) => onChange("telefono", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Ciudad</label>
                  <input value={form.ciudad} onChange={(e) => onChange("ciudad", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Website</label>
                  <input value={form.website} onChange={(e) => onChange("website", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Dirección</label>
                  <input value={form.direccion} onChange={(e) => onChange("direccion", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Logo URL</label>
                  <input value={form.logoUrl} onChange={(e) => onChange("logoUrl", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold text-gray-900">Numeración y parámetros</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Prefijo cotización</label>
                  <input value={form.prefijoCotizacion} onChange={(e) => onChange("prefijoCotizacion", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Prefijo orden</label>
                  <input value={form.prefijoOrden} onChange={(e) => onChange("prefijoOrden", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Prefijo acta</label>
                  <input value={form.prefijoActa} onChange={(e) => onChange("prefijoActa", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Prefijo cobro</label>
                  <input value={form.prefijoCobro} onChange={(e) => onChange("prefijoCobro", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Moneda</label>
                  <input value={form.moneda} onChange={(e) => onChange("moneda", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Zona horaria</label>
                  <input value={form.timezone} onChange={(e) => onChange("timezone", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
                <div className="md:col-span-3">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Resolución / nota legal</label>
                  <textarea value={form.resolucion} onChange={(e) => onChange("resolucion", e.target.value)} className="min-h-[120px] w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Vista rápida</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p><b className="text-gray-900">Empresa:</b> {form.nombre || "—"}</p>
                <p><b className="text-gray-900">Correo:</b> {form.email || "—"}</p>
                <p><b className="text-gray-900">Ciudad:</b> {form.ciudad || "—"}</p>
                <p><b className="text-gray-900">Prefijos:</b> {form.prefijoCotizacion} / {form.prefijoOrden} / {form.prefijoActa} / {form.prefijoCobro}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Uso</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>Estos datos se usan para PDFs, encabezados, prefijos y branding general del sistema.</p>
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}