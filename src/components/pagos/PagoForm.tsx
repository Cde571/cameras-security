import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import ClienteSelector from "../cotizaciones/ClienteSelector";
import {
  createPago,
  getCliente,
  getCobro,
  listCobros,
  type Cliente,
  type PagoMetodo,
} from "../../lib/flow/data";
import { getFlowContext, toClienteSnapshot } from "../../lib/flow/context";

export default function PagoForm() {
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState<any>(null);

  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [fecha, setFecha] = useState(hoy);
  const [metodo, setMetodo] = useState<PagoMetodo>("transferencia");
  const [valor, setValor] = useState<number>(0);
  const [referencia, setReferencia] = useState("");
  const [notas, setNotas] = useState("");

  const cobrosCliente = useMemo(() => (clienteId ? listCobros("").filter((c) => c.clienteId === clienteId) : []), [clienteId]);
  const [cobroId, setCobroId] = useState<string>("");

  const canSave = useMemo(() => Boolean(clienteId) && valor > 0, [clienteId, valor]);

  useEffect(() => {
    const ctx = getFlowContext();

    if (ctx.cobroId) {
      const cobro = getCobro(ctx.cobroId);
      if (cobro) {
        setClienteId(cobro.clienteId);
        setClienteSnap(cobro.cliente);
        setCobroId(cobro.id);
        setValor(Number(cobro.total || 0));
        setReferencia((prev) => prev || cobro.numero);
        setNotas((prev) => prev || `Pago asociado al cobro ${cobro.numero}.`);
        return;
      }
    }

    if (ctx.clienteId) {
      const c = getCliente(ctx.clienteId);
      if (c) {
        setClienteId(c.id);
        setClienteSnap(toClienteSnapshot(c));
      }
    }
  }, []);

  const onPickCliente = (c: Cliente) => {
    setClienteId(c.id);
    setClienteSnap(toClienteSnapshot(c));
    setCobroId("");
  };

  useEffect(() => {
    if (!cobroId) return;
    const selected = cobrosCliente.find((c) => c.id === cobroId);
    if (!selected) return;
    if (valor <= 0) setValor(Number(selected.total || 0));
    if (!referencia.trim()) setReferencia(selected.numero);
  }, [cobroId, cobrosCliente]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (valor <= 0) return alert("Valor debe ser mayor a 0.");

    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }

    createPago({
      fecha,
      clienteId,
      cliente: clienteSnap,
      cobroId: cobroId || undefined,
      referencia: referencia.trim() || undefined,
      metodo,
      valor,
      notas: notas.trim() || undefined,
    } as any);

    window.location.href = cobroId ? `/cobros/${cobroId}` : `/pagos/cartera`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Registrar pago</h1>
          <p className="text-sm text-gray-500">Asocia el pago a un cobro (opcional).</p>
        </div>

        <div className="flex gap-2">
          <a href="/pagos/cartera" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
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
            <h3 className="font-semibold text-gray-900">Datos del pago</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Fecha</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Método</label>
                <select value={metodo} onChange={(e) => setMetodo(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="pse">PSE</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Valor (COP)</label>
                <input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value || 0))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Referencia</label>
              <input value={referencia} onChange={(e) => setReferencia(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Ej: comprobante, transferencia, # transacción..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Asociar a cuenta de cobro (opcional)</label>
              <select value={cobroId} onChange={(e) => setCobroId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">— Sin asociar —</option>
                {cobrosCliente.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.numero} • {c.status} • {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(c.total || 0)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Notas</label>
              <textarea value={notas} onChange={(e) => setNotas(e.target.value)}
                className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
          <h3 className="font-semibold text-gray-900">Regla actual</h3>
          <p className="text-sm text-gray-600">
            Si asocias un pago a una cuenta, el flujo queda amarrado desde el cobro y regresa al detalle al guardar.
          </p>
          <p className="text-xs text-gray-500">
            Más adelante podrás manejar abonos parciales y saldo pendiente por cobro.
          </p>
        </aside>
      </div>
    </form>
  );
}
