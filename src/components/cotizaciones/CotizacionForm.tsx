import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { createCotizacion, getCotizacion, listPlantillas, updateCotizacion } from "../../lib/repositories/cotizacionRepo";

type Props = {
  mode?: "create" | "edit";
  cotizacionId?: string;
};

type Plantilla = {
  id: string;
  nombre: string;
  cuerpo?: string;
};

export default function CotizacionForm({ mode = "create", cotizacionId }: Props) {
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [tplId, setTplId] = useState("");

  const [form, setForm] = useState({
    numero: "",
    clienteId: "",
    fecha: new Date().toISOString().slice(0, 10),
    vigenciaDias: 30,
    asunto: "",
    condiciones: "",
    notas: "",
    subtotal: 0,
    iva: 0,
    total: 0,
    status: "borrador",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const tplData = await listPlantillas("");
        if (!cancelled) {
          const arr = Array.isArray(tplData) ? tplData : [];
          setPlantillas(arr);
          if (arr[0]?.id) {
            setTplId(arr[0].id);
          }
        }

        if (isEdit && cotizacionId) {
          const c = await getCotizacion(cotizacionId);

          if (!cancelled && c) {
            setForm({
              numero: c.numero || "",
              clienteId: c.clienteId || "",
              fecha: c.fecha || new Date().toISOString().slice(0, 10),
              vigenciaDias: Number(c.vigenciaDias || 30),
              asunto: c.asunto || "",
              condiciones: c.condiciones || "",
              notas: c.notas || "",
              subtotal: Number(c.subtotal || 0),
              iva: Number(c.iva || 0),
              total: Number(c.total || 0),
              status: c.status || "borrador",
            });
          }
        }
      } catch (error) {
        console.error("Error cargando formulario de cotización:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isEdit, cotizacionId]);

  const canSave = useMemo(() => {
    return form.numero.trim().length > 0;
  }, [form.numero]);

  const onChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyTemplate = () => {
    const tpl = plantillas.find((x) => x.id === tplId);
    if (!tpl) return;

    setForm((prev) => ({
      ...prev,
      condiciones: tpl.cuerpo || prev.condiciones,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSave) {
      alert("El número de cotización es obligatorio.");
      return;
    }

    try {
      setSaving(true);

      if (isEdit && cotizacionId) {
        await updateCotizacion(cotizacionId, { ...form });
        window.location.href = `/cotizaciones/${cotizacionId}`;
        return;
      }

      const nueva = await createCotizacion({ ...form });
      window.location.href = `/cotizaciones/${nueva.id}`;
    } catch (error) {
      console.error("Error guardando cotización:", error);
      alert("No fue posible guardar la cotización.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            {isEdit ? "Editar cotización" : "Nueva cotización"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Actualiza la información del documento." : "Crea una cotización nueva conectada al backend."}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/cotizaciones"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
              canSave && !saving ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
            disabled={!canSave || saving}
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Datos principales</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Número *</label>
            <input
              value={form.numero}
              onChange={(e) => onChange("numero", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: COT-2026-0001"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => onChange("fecha", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Vigencia (días)</label>
              <input
                type="number"
                value={form.vigenciaDias}
                onChange={(e) => onChange("vigenciaDias", Number(e.target.value || 0))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Cliente ID</label>
            <input
              value={form.clienteId}
              onChange={(e) => onChange("clienteId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="UUID del cliente"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Asunto</label>
            <input
              value={form.asunto}
              onChange={(e) => onChange("asunto", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: Suministro e instalación de cámaras"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Plantillas y condiciones</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Plantilla</label>
            <div className="flex gap-2">
              <select
                value={tplId}
                onChange={(e) => setTplId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Sin plantilla</option>
                {plantillas.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>{tpl.nombre}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={applyTemplate}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                Aplicar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Condiciones</label>
            <textarea
              value={form.condiciones}
              onChange={(e) => onChange("condiciones", e.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Condiciones comerciales de la cotización"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => onChange("notas", e.target.value)}
              className="min-h-[100px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Observaciones internas o para el cliente"
            />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-600">Subtotal</label>
          <input
            type="number"
            value={form.subtotal}
            onChange={(e) => onChange("subtotal", Number(e.target.value || 0))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-600">IVA</label>
          <input
            type="number"
            value={form.iva}
            onChange={(e) => onChange("iva", Number(e.target.value || 0))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-600">Total</label>
          <input
            type="number"
            value={form.total}
            onChange={(e) => onChange("total", Number(e.target.value || 0))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-600">Estado</label>
          <select
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            <option value="borrador">Borrador</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>
      </div>
    </form>
  );
}