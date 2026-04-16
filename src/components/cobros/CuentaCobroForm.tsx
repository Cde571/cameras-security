import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import ClienteSelector from "../cotizaciones/ClienteSelector";
import ServiciosTable from "./ServiciosTable";
import {
  createCobro,
  getCliente,
  getCotizacion,
  getOrden,
  type Cliente,
  type CobroStatus,
  type ServicioCobro,
} from "../../lib/flow/data";
import { addDays, getFlowContext, serviciosFromCotizacionItems, toClienteSnapshot } from "../../lib/flow/context";

export default function CuentaCobroForm() {
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState<any>(null);

  const [fechaEmision, setFechaEmision] = useState(hoy);
  const [fechaVencimiento, setFechaVencimiento] = useState(addDays(hoy, 15));
  const [status, setStatus] = useState<CobroStatus>("pendiente");

  const [servicios, setServicios] = useState<ServicioCobro[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [sourceCotizacionId, setSourceCotizacionId] = useState("");
  const [sourceOrdenId, setSourceOrdenId] = useState("");

  const canSave = useMemo(() => Boolean(clienteId) && servicios.length > 0, [clienteId, servicios.length]);

  const onPickCliente = (c: Cliente) => {
    setClienteId(c.id);
    setClienteSnap(toClienteSnapshot(c));
  };

  useEffect(() => {
    const ctx = getFlowContext();

    if (ctx.ordenId) {
      const orden = getOrden(ctx.ordenId);
      if (orden) {
        setSourceOrdenId(orden.id);
        setClienteId(orden.clienteId);
        setClienteSnap(orden.cliente);
        setObservaciones((prev) => prev || `Cuenta generada desde la orden ${orden.numero}.`);

        if ((servicios || []).length === 0) {
          if (orden.cotizacionId) {
            const cot = getCotizacion(orden.cotizacionId);
            if (cot) {
              setSourceCotizacionId(cot.id);
              setServicios(serviciosFromCotizacionItems(cot.items || []) as any);
            }
          } else {
            setServicios([
              {
                id: globalThis.crypto?.randomUUID?.() ?? `srv_${Date.now()}`,
                descripcion: orden.asunto?.trim() || `Servicio según orden ${orden.numero}`,
                cantidad: 1,
                unitario: 0,
                ivaPct: 0,
              } as any,
            ]);
          }
        }
      }
    } else if (ctx.cotizacionId) {
      const cot = getCotizacion(ctx.cotizacionId);
      if (cot) {
        setSourceCotizacionId(cot.id);
        setClienteId(cot.clienteId);
        setClienteSnap(cot.cliente);
        setServicios((prev) => prev.length > 0 ? prev : (serviciosFromCotizacionItems(cot.items || []) as any));
        setObservaciones((prev) => prev || `Cuenta generada desde la cotización ${cot.numero}.`);
      }
    } else if (ctx.clienteId) {
      const c = getCliente(ctx.clienteId);
      if (c) onPickCliente(c);
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (servicios.length === 0) return alert("Agrega al menos 1 servicio.");

    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }

    const noteParts = [observaciones?.trim()];
    if (sourceCotizacionId) noteParts.push(`Origen cotización: ${sourceCotizacionId}`);
    if (sourceOrdenId) noteParts.push(`Origen orden: ${sourceOrdenId}`);

    const cc = createCobro({
      clienteId,
      cliente: clienteSnap,
      fechaEmision,
      fechaVencimiento,
      status,
      servicios,
      observaciones: noteParts.filter(Boolean).join("\n"),
    } as any);

    window.location.href = `/cobros/${cc.id}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Nueva cuenta de cobro</h1>
          <p className="text-sm text-gray-500">Cliente + servicios + totales.</p>
        </div>

        <div className="flex gap-2">
          <a href="/cobros" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </a>

          <button type="submit" disabled={!canSave}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
          >
            <Save className="h-4 w-4" /> Guardar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <ClienteSelector value={clienteId} onChange={onPickCliente} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Fechas y estado</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Emisión</label>
                <input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Vencimiento</label>
                <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Estado</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="enviado">Enviado</option>
                  <option value="pagado">Pagado</option>
                  <option value="vencido">Vencido</option>
                  <option value="anulado">Anulado</option>
                </select>
              </div>
            </div>
          </div>

          <ServiciosTable value={servicios} onChange={setServicios} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-900">Observaciones</h3>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              placeholder="Ej: condiciones de pago, entregables, soporte..."
            />
          </div>
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
          <h3 className="font-semibold text-gray-900">Ayuda</h3>
          {sourceCotizacionId ? (
            <a href={`/cotizaciones/${sourceCotizacionId}`} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              Ver cotización origen
            </a>
          ) : null}
          {sourceOrdenId ? (
            <a href={`/ordenes/${sourceOrdenId}`} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              Ver orden origen
            </a>
          ) : null}
          {!sourceCotizacionId && !sourceOrdenId ? (
            <p className="text-xs text-gray-500">También puedes entrar desde un cliente, una cotización o una orden.</p>
          ) : null}
        </aside>
      </div>
    </form>
  );
}
