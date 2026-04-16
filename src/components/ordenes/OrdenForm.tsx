import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { createOrden, getOrden, listCheckListTemplates, updateOrden } from "../../lib/repositories/ordenRepo";

type Props = {
  mode?: "create" | "edit";
  ordenId?: string;
};

type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

type ChecklistTemplate = {
  id: string;
  nombre: string;
  items: ChecklistItem[];
};

export default function OrdenForm({ mode = "create", ordenId }: Props) {
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [tplId, setTplId] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const [form, setForm] = useState({
    numero: "",
    cotizacionId: "",
    clienteId: "",
    fecha: new Date().toISOString().slice(0, 10),
    fechaProgramada: "",
    asunto: "",
    direccionServicio: "",
    tecnico: "",
    tecnicoId: "",
    notas: "",
    estado: "pendiente",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const tplData = await listCheckListTemplates("");
        if (!cancelled) {
          const arr = Array.isArray(tplData) ? tplData : [];
          setTemplates(arr);

          if (arr[0]) {
            setTplId(arr[0].id);
            setChecklist(Array.isArray(arr[0].items) ? arr[0].items : []);
          }
        }

        if (isEdit && ordenId) {
          const o = await getOrden(ordenId);

          if (!cancelled && o) {
            setForm({
              numero: o.numero || "",
              cotizacionId: o.cotizacionId || "",
              clienteId: o.clienteId || "",
              fecha: o.fecha || new Date().toISOString().slice(0, 10),
              fechaProgramada: o.fechaProgramada || "",
              asunto: o.asunto || "",
              direccionServicio: o.direccionServicio || "",
              tecnico: o.tecnico || "",
              tecnicoId: o.tecnicoId || "",
              notas: o.notas || "",
              estado: o.estado || o.status || "pendiente",
            });

            if (Array.isArray(o.checklist) && o.checklist.length > 0) {
              setChecklist(o.checklist);
            }
          }
        }
      } catch (error) {
        console.error("Error cargando formulario de orden:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isEdit, ordenId]);

  const canSave = useMemo(() => {
    return form.numero.trim().length > 0;
  }, [form.numero]);

  const onChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyTemplate = (id: string) => {
    setTplId(id);
    const tpl = templates.find((x) => x.id === id);
    if (!tpl) return;
    setChecklist(Array.isArray(tpl.items) ? tpl.items : []);
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSave) {
      alert("El número de orden es obligatorio.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        checklist,
        status: form.estado,
      };

      if (isEdit && ordenId) {
        await updateOrden(ordenId, payload);
        window.location.href = "/ordenes";
        return;
      }

      await createOrden(payload);
      window.location.href = "/ordenes";
    } catch (error) {
      console.error("Error guardando orden:", error);
      alert("No fue posible guardar la orden.");
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
            {isEdit ? "Editar orden" : "Nueva orden"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Actualiza la información de la orden." : "Crea una orden nueva conectada al backend."}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/ordenes"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Ej: OT-2026-0001"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => onChange("fecha", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Fecha programada</label>
              <input
                type="date"
                value={form.fechaProgramada}
                onChange={(e) => onChange("fechaProgramada", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Cliente ID</label>
            <input
              value={form.clienteId}
              onChange={(e) => onChange("clienteId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="UUID del cliente"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Cotización ID</label>
            <input
              value={form.cotizacionId}
              onChange={(e) => onChange("cotizacionId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="UUID de la cotización"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Asunto</label>
            <input
              value={form.asunto}
              onChange={(e) => onChange("asunto", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Operación</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Dirección de servicio</label>
            <input
              value={form.direccionServicio}
              onChange={(e) => onChange("direccionServicio", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Técnico</label>
              <input
                value={form.tecnico}
                onChange={(e) => onChange("tecnico", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Técnico ID</label>
              <input
                value={form.tecnicoId}
                onChange={(e) => onChange("tecnicoId", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => onChange("estado", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => onChange("notas", e.target.value)}
              className="min-h-[110px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </section>
      </div>

      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900">Checklist</h2>
            <p className="text-sm text-gray-500">Aplica una plantilla y marca los ítems correspondientes.</p>
          </div>

          <select
            value={tplId}
            onChange={(e) => applyTemplate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            <option value="">Seleccionar plantilla</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>{tpl.nombre}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {checklist.map((item) => (
            <label key={item.id} className="inline-flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <input
                type="checkbox"
                checked={!!item.checked}
                onChange={() => toggleChecklist(item.id)}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </section>
    </form>
  );
}