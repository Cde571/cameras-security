import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save, FileText } from "lucide-react";
import ClienteSelector from "./ClienteSelector";
import ProductoSelector from "./ProductoSelector";
import ItemsTable from "./ItemsTable";
import TotalesPanel from "./TotalesPanel";

import { getCliente, type Cliente } from "../../lib/services/clienteLocalService";
import {
  createCotizacion,
  getCotizacion,
  listPlantillas,
  updateCotizacion,
  type CotizacionItem,
  type CotizacionStatus,
} from "../../lib/services/cotizacionLocalService";

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

  const canSave = useMemo(() => {
    return clienteId && items.length > 0;
  }, [clienteId, items.length]);

  const onPickCliente = (c: Cliente) => {
    setClienteId(c.id);
    setClienteSnap({
      id: c.id,
      nombre: c.nombre,
      documento: c.documento,
      telefono: c.telefono,
      email: c.email,
      direccion: c.direccion,
      ciudad: c.ciudad,
    });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <ClienteSelector value={clienteId} onChange={onPickCliente} />
          <ProductoSelector onAdd={(it) => setItems((prev) => [it, ...prev])} />
          <ItemsTable items={items} onChange={setItems} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Condiciones / Plantillas</h3>

            <div className="flex flex-col md:flex-row gap-2 md:items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-600">Plantilla</label>
                <select value={tplId} onChange={(e) => setTplId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {plantillas.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={applyTemplate}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
              >
                Insertar plantilla
              </button>

              <a href="/cotizaciones/plantillas" className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                Gestionar plantillas
              </a>
            </div>

            <textarea
              value={condiciones}
              onChange={(e) => setCondiciones(e.target.value)}
              className="min-h-[180px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Condiciones, garantía, forma de pago, tiempos..."
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-900">Notas</h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Notas internas o para el cliente..."
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Datos</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Vigencia (días)</label>
              <input type="number" min={1} value={vigenciaDias} onChange={(e) => setVigenciaDias(Number(e.target.value || 15))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="borrador">Borrador</option>
                <option value="enviada">Enviada</option>
                <option value="aceptada">Aceptada</option>
                <option value="rechazada">Rechazada</option>
                <option value="vencida">Vencida</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Asunto</label>
              <input value={asunto} onChange={(e) => setAsunto(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Ej: Sistema de 8 cámaras + acceso remoto"
              />
            </div>
          </div>

          <TotalesPanel items={items} />
        </aside>
      </div>
    </form>
  );
}
