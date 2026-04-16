import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { getNumeracion, setNumeracion, type NumeracionConfig } from "../../lib/repositories/numeracionRepo";

const initialState: NumeracionConfig = {
  prefijoCotizacion: "COT",
  siguienteCotizacion: 1,
  paddingCotizacion: 4,
  prefijoOrden: "OT",
  siguienteOrden: 1,
  paddingOrden: 4,
  prefijoActa: "ACT",
  siguienteActa: 1,
  paddingActa: 4,
  prefijoCobro: "CC",
  siguienteCobro: 1,
  paddingCobro: 4,
};

export default function NumeracionForm() {
  const [form, setForm] = useState<NumeracionConfig>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await getNumeracion();
        if (!cancelled) setForm(data);
      } catch (error) {
        console.error("Error cargando numeración:", error);
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

  function onChange(key: keyof NumeracionConfig, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    try {
      setSaving(true);
      const saved = await setNumeracion(form);
      setForm(saved);
      alert("Numeración guardada.");
    } catch (error) {
      console.error("Error guardando numeración:", error);
      alert(error instanceof Error ? error.message : "No fue posible guardar la numeración.");
    } finally {
      setSaving(false);
    }
  }

  function Block(
    title: string,
    prefijoKey: keyof NumeracionConfig,
    siguienteKey: keyof NumeracionConfig,
    paddingKey: keyof NumeracionConfig
  ) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-gray-900">{title}</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Prefijo</label>
            <input
              value={String(form[prefijoKey] ?? "")}
              onChange={(e) => onChange(prefijoKey, e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Siguiente consecutivo</label>
            <input
              type="number"
              min="1"
              value={Number(form[siguienteKey] ?? 1)}
              onChange={(e) => onChange(siguienteKey, Number(e.target.value || 1))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Padding</label>
            <input
              type="number"
              min="1"
              value={Number(form[paddingKey] ?? 4)}
              onChange={(e) => onChange(paddingKey, Number(e.target.value || 4))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configuración de numeración</h1>
          <p className="text-sm text-gray-500">Control de prefijos y consecutivos por módulo.</p>
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
          Cargando numeración...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {Block("Cotizaciones", "prefijoCotizacion", "siguienteCotizacion", "paddingCotizacion")}
            {Block("Órdenes", "prefijoOrden", "siguienteOrden", "paddingOrden")}
            {Block("Actas", "prefijoActa", "siguienteActa", "paddingActa")}
            {Block("Cuentas de cobro", "prefijoCobro", "siguienteCobro", "paddingCobro")}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Vista rápida</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p><b className="text-gray-900">Cotización:</b> {form.prefijoCotizacion}-{String(form.siguienteCotizacion).padStart(Number(form.paddingCotizacion), "0")}</p>
                <p><b className="text-gray-900">Orden:</b> {form.prefijoOrden}-{String(form.siguienteOrden).padStart(Number(form.paddingOrden), "0")}</p>
                <p><b className="text-gray-900">Acta:</b> {form.prefijoActa}-{String(form.siguienteActa).padStart(Number(form.paddingActa), "0")}</p>
                <p><b className="text-gray-900">Cobro:</b> {form.prefijoCobro}-{String(form.siguienteCobro).padStart(Number(form.paddingCobro), "0")}</p>
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}