import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save, ClipboardList, Image } from "lucide-react";
import ClienteSelector from "../cotizaciones/ClienteSelector";
import TecnicoAssign from "./TecnicoAssign";
import ChecklistEditor from "./ChecklistEditor";
import {
  getCliente,
  getChecklistTemplate,
  getCotizacion,
  getOrden,
  listChecklistTemplates,
  updateOrden,
  createOrden,
  type ChecklistItem,
  type Cliente,
  type OrdenStatus,
  type Tecnico,
} from "../../lib/flow/data";
import { getFlowContext, toClienteSnapshot } from "../../lib/flow/context";

type Props = { mode: "create" | "edit"; ordenId?: string };

function uid(prefix: string) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function OrdenForm({ mode, ordenId }: Props) {
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(isEdit);

  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState<any>(null);
  const [cotizacionId, setCotizacionId] = useState("");

  const [fechaCreacion, setFechaCreacion] = useState(() => new Date().toISOString().slice(0, 10));
  const [fechaProgramada, setFechaProgramada] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<OrdenStatus>("pendiente");

  const [asunto, setAsunto] = useState("");
  const [direccionServicio, setDireccionServicio] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [tecnico, setTecnico] = useState<Tecnico | null>(null);

  const templates = useMemo(() => listChecklistTemplates(""), []);
  const [tplId, setTplId] = useState<string>(templates[0]?.id ?? "");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (!isEdit || !ordenId) return;

    const o = getOrden(ordenId);
    if (!o) {
      setLoading(false);
      return;
    }

    setClienteId(o.clienteId);
    setClienteSnap(o.cliente);
    setCotizacionId(o.cotizacionId || "");

    setFechaCreacion(o.fechaCreacion);
    setFechaProgramada(o.fechaProgramada || "");
    setStatus(o.status);

    setAsunto(o.asunto || "");
    setDireccionServicio(o.direccionServicio || "");
    setObservaciones(o.observaciones || "");

    setTecnico(o.tecnico || null);
    setTplId(o.checklistTemplateId || (templates[0]?.id ?? ""));
    setChecklist(o.checklist || []);

    setLoading(false);
  }, [isEdit, ordenId, templates]);

  useEffect(() => {
    if (isEdit) return;

    const ctx = getFlowContext();

    if (ctx.cotizacionId) {
      const cot = getCotizacion(ctx.cotizacionId);
      if (cot) {
        setCotizacionId(cot.id);
        setClienteId(cot.clienteId);
        setClienteSnap(cot.cliente);
        setAsunto((prev) => prev || cot.asunto || `Orden derivada de ${cot.numero}`);
        setDireccionServicio((prev) => prev || cot.cliente?.direccion || "");
        setObservaciones((prev) => prev || `Generada desde la cotización ${cot.numero}.`);
      }
    }

    if (ctx.clienteId && !clienteId) {
      const c = getCliente(ctx.clienteId);
      if (c) {
        setClienteId(c.id);
        setClienteSnap(toClienteSnapshot(c));
        setDireccionServicio((prev) => prev || c.direccion || "");
      }
    }

    if ((checklist || []).length === 0) {
      const tpl = getChecklistTemplate(tplId);
      if (tpl) {
        setChecklist(tpl.items.map((i) => ({ id: uid("chk"), label: i.label, done: false })));
      }
    }
  }, [isEdit, tplId]);

  const canSave = useMemo(() => Boolean(clienteId), [clienteId]);

  const onPickCliente = (c: Cliente) => {
    setClienteId(c.id);
    setClienteSnap(toClienteSnapshot(c));
    setDireccionServicio((prev) => prev || c.direccion || "");
  };

  const applyTemplate = () => {
    const tpl = getChecklistTemplate(tplId);
    if (!tpl) return;
    setChecklist(tpl.items.map((i) => ({ id: uid("chk"), label: i.label, done: false })));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");

    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }

    const payload = {
      fechaCreacion,
      fechaProgramada: fechaProgramada || "",
      status,
      clienteId,
      cliente: clienteSnap,
      cotizacionId: cotizacionId || undefined,
      asunto,
      direccionServicio,
      observaciones,
      tecnicoId: tecnico?.id || "",
      tecnico: tecnico || undefined,
      checklistTemplateId: tplId || "",
      checklist,
      evidencias: isEdit && ordenId ? getOrden(ordenId)?.evidencias || [] : [],
    };

    if (isEdit && ordenId) {
      updateOrden(ordenId, payload as any);
      window.location.href = `/ordenes/${ordenId}`;
      return;
    }

    const nuevo = createOrden(payload as any);
    window.location.href = `/ordenes/${nuevo.id}`;
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando orden...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{isEdit ? "Editar orden" : "Nueva orden"}</h1>
          <p className="text-sm text-gray-500">Cliente + programación + checklist + evidencias.</p>
        </div>

        <div className="flex gap-2">
          <a href="/ordenes" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </a>

          <button type="submit" disabled={!canSave}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
          >
            <Save className="h-4 w-4" /> Guardar
          </button>

          {isEdit && ordenId ? (
            <a href={`/ordenes/${ordenId}/evidencias`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
              <Image className="h-4 w-4" /> Evidencias
            </a>
          ) : null}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <ClienteSelector value={clienteId} onChange={onPickCliente} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Programación</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Fecha creación</label>
                <input type="date" value={fechaCreacion} onChange={(e) => setFechaCreacion(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Fecha programada</label>
                <input type="date" value={fechaProgramada} onChange={(e) => setFechaProgramada(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Estado</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En progreso</option>
                  <option value="en_revision">En revisión</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Asunto</label>
              <input value={asunto} onChange={(e) => setAsunto(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Ej: Instalación 8 cámaras + NVR"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Dirección del servicio</label>
              <input value={direccionServicio} onChange={(e) => setDireccionServicio(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Ej: Cra 10 # 12-34"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Observaciones</label>
              <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
                className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Observaciones internas, accesos, contacto, horario..."
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900"><ClipboardList className="h-4 w-4" /> Checklist</h3>

              <div className="flex gap-2">
                <select value={tplId} onChange={(e) => setTplId(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
                <button type="button" onClick={applyTemplate}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Cargar plantilla
                </button>
                <a href="/ordenes/checklists" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                  Gestionar
                </a>
              </div>
            </div>

            <ChecklistEditor checklist={checklist} onChange={setChecklist} />
          </div>
        </div>

        <aside className="space-y-5">
          <TecnicoAssign value={tecnico} onChange={setTecnico} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-900">Contexto del flujo</h3>
            {cotizacionId ? (
              <a href={`/cotizaciones/${cotizacionId}`} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                Ver cotización origen
              </a>
            ) : (
              <p className="text-sm text-gray-600">También puedes entrar desde una cotización y queda enlazada automáticamente.</p>
            )}
          </div>

          {isEdit && ordenId ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
              <h3 className="font-semibold text-gray-900">Acciones</h3>
              <a href={`/ordenes/${ordenId}`} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                Ver detalle
              </a>
              <a href={`/ordenes/${ordenId}/evidencias`} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                Evidencias
              </a>
            </div>
          ) : null}
        </aside>
      </div>
    </form>
  );
}
