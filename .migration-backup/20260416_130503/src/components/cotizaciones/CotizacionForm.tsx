import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save, FileText } from "lucide-react";
import ClienteSelector from "./ClienteSelector";
import ProductoSelector from "./ProductoSelector";
import ItemsTable from "./ItemsTable";
import TotalesPanel from "./TotalesPanel";

import {
  getCliente,
  type Cliente,
  createCotizacion,
  getCotizacion,
  listPlantillas,
  updateCotizacion,
  type CotizacionItem,
  type CotizacionStatus,
} from "../../lib/flow/data";
import { getFlowContext, toClienteSnapshot } from "../../lib/flow/context";

type Props = { mode: "create" | "edit"; cotizacionId?: string };

export default function CotizacionForm({ mode, cotizacionId }: Props) {
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(isEdit);

  const [clienteId, setClienteId] = useState<string>("");
  const [clienteSnap, setClienteSnap] = useState<any>(null);

  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [vigenciaDias, setVigenciaDias] = useState<number>(15);
  const [status, setStatus] = useState<CotizacionStatus>("borrador");

  const [asunto, setAsunto] = useState<string>("");
  const [condiciones, setCondiciones] = useState<string>("");
  const [notas, setNotas] = useState<string>("");

  const [items, setItems] = useState<CotizacionItem[]>([]);

  const plantillas = useMemo(() => listPlantillas(""), []);
  const [tplId, setTplId] = useState<string>(plantillas[0]?.id ?? "");

  useEffect(() => {
    if (!isEdit || !cotizacionId) return;

    const c = getCotizacion(cotizacionId);
    if (!c) {
      setLoading(false);
      return;
    }

    setClienteId(c.clienteId);
    setClienteSnap(c.cliente);

    setFecha(c.fecha);
    setVigenciaDias(c.vigenciaDias);
    setStatus(c.status);

    setAsunto(c.asunto || "");
    setCondiciones(c.condiciones || "");
    setNotas(c.notas || "");

    setItems(c.items || []);
    setLoading(false);
  }, [isEdit, cotizacionId]);

  useEffect(() => {
    if (isEdit) return;

    const ctx = getFlowContext();
    if (!ctx.clienteId) return;

    const c = getCliente(ctx.clienteId);
    if (!c) return;

    setClienteId(c.id);
    setClienteSnap(toClienteSnapshot(c));

    if (!asunto.trim() && ctx.from === "cliente") {
      setAsunto("Cotización de suministro / servicio");
    }
  }, [isEdit]);

  const canSave = useMemo(() => {
    return Boolean(clienteId) && items.length > 0;
  }, [clienteId, items.length]);

  const onPickCliente = (c: Cliente) => {
    setClienteId(c.id);
    setClienteSnap(toClienteSnapshot(c));
  };

  const applyTemplate = () => {
    const tpl = plantillas.find((t) => t.id === tplId);
    if (!tpl) return;
    setCondiciones(tpl.cuerpo);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteId) return alert("Selecciona un cliente.");
    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }
    if (items.length === 0) return alert("Agrega al menos un ítem.");

    const payload = {
      fecha,
      vigenciaDias: Number(vigenciaDias || 15),
      status,
      clienteId,
      cliente: clienteSnap,
      asunto,
      condiciones,
      notas,
      items,
    };

    if (isEdit && cotizacionId) {
      updateCotizacion(cotizacionId, payload as any);
      window.location.href = `/cotizaciones/${cotizacionId}`;
      return;
    }

    const nuevo = createCotizacion(payload as any);
    window.location.href = `/cotizaciones/${nuevo.id}`;
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando cotización...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{isEdit ? "Editar cotización" : "Nueva cotización"}</h1>
          <p className="text-sm text-gray-500">Cliente + ítems + condiciones.</p>
        </div>

        <div className="flex gap-2">
          <a href="/cotizaciones" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="submit"
            disabled={!canSave}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
              canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>

          {isEdit && cotizacionId ? (
            <a href={`/cotizaciones/${cotizacionId}/pdf`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
              <FileText className="h-4 w-4" />
              PDF
            </a>
          ) : null}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <ClienteSelector value={clienteId} onChange={onPickCliente} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Datos generales</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Vigencia (días)</label>
                <input
                  type="number"
                  min={1}
                  value={vigenciaDias}
                  onChange={(e) => setVigenciaDias(Number(e.target.value || 15))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CotizacionStatus)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="borrador">Borrador</option>
                  <option value="enviada">Enviada</option>
                  <option value="aceptada">Aceptada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="vencida">Vencida</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Asunto</label>
              <input
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Ej: Suministro e instalación de CCTV"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Plantilla de condiciones</label>
                <select
                  value={tplId}
                  onChange={(e) => setTplId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {plantillas.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={applyTemplate}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Aplicar
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Condiciones</label>
              <textarea
                value={condiciones}
                onChange={(e) => setCondiciones(e.target.value)}
                className="min-h-[140px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Garantías, forma de pago, tiempos..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Notas</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="min-h-[110px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Notas internas o adicionales"
              />
            </div>
          </div>

          <ProductoSelector onAdd={(item) => setItems((prev) => [...prev, item as any])} />
          <ItemsTable value={items} onChange={setItems} />
        </div>

        <aside className="space-y-5">
          <TotalesPanel items={items} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-900">Contexto del flujo</h3>
            <p className="text-sm text-gray-600">
              Si entraste desde un cliente, el formulario ya queda con el cliente precargado.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
