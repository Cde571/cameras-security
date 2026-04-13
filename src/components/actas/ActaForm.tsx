import React, { useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import ClienteSelector from "../cotizaciones/ClienteSelector";
import type { Cliente } from "../../lib/services/clienteLocalService";
import { createActa, type ActaStatus, type ActivoEntregado } from "../../lib/services/actaLocalService";
import ActivosTable from "./ActivosTable";
import FirmaCanvas from "./FirmaCanvas";

export default function ActaForm() {
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState<any>(null);

  const [fecha, setFecha] = useState(hoy);
  const [lugar, setLugar] = useState("");
  const [status, setStatus] = useState<ActaStatus>("borrador");

  const [tecnico, setTecnico] = useState("");
  const [clienteRecibe, setClienteRecibe] = useState("");
  const [docRecibe, setDocRecibe] = useState("");

  const [activos, setActivos] = useState<ActivoEntregado[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [firma, setFirma] = useState<string>("");

  const canSave = useMemo(() => Boolean(clienteId) && activos.length > 0, [clienteId, activos.length]);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (activos.length === 0) return alert("Agrega al menos 1 activo/ítem entregado.");

    const acta = createActa({
      clienteId,
      cliente: clienteSnap,
      fecha,
      lugar: lugar.trim() || undefined,
      responsables: {
        tecnico: tecnico.trim() || undefined,
        clienteRecibe: clienteRecibe.trim() || undefined,
        documentoRecibe: docRecibe.trim() || undefined,
      },
      activos,
      observaciones: observaciones.trim() || undefined,
      firmaClienteDataUrl: firma || undefined,
      status,
    } as any);

    window.location.href = `/actas/${acta.id}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Nueva acta</h1>
          <p className="text-sm text-gray-500">Cliente + activos entregados + firma.</p>
        </div>

        <div className="flex gap-2">
          <a href="/actas" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </a>
          <button type="submit" disabled={!canSave}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
          >
            <Save className="h-4 w-4" /> Guardar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <ClienteSelector value={clienteId} onChange={onPickCliente} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Datos del acta</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Fecha</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-gray-600">Lugar</label>
                <input value={lugar} onChange={(e) => setLugar(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  placeholder="Ej: Sede principal / Torre B / Bodega..."
                />
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-xs font-semibold text-gray-600">Estado</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="borrador">Borrador</option>
                  <option value="firmada">Firmada</option>
                  <option value="enviada">Enviada</option>
                  <option value="anulada">Anulada</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Responsables</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Técnico</label>
                <input value={tecnico} onChange={(e) => setTecnico(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  placeholder="Nombre del técnico"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Recibe</label>
                <input value={clienteRecibe} onChange={(e) => setClienteRecibe(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  placeholder="Nombre quien recibe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Documento</label>
                <input value={docRecibe} onChange={(e) => setDocRecibe(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  placeholder="CC / NIT"
                />
              </div>
            </div>
          </div>

          <ActivosTable value={activos} onChange={setActivos} />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-900">Observaciones</h3>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              placeholder="Condiciones, capacitación, pruebas, garantías..."
            />
          </div>

          <FirmaCanvas value={firma} onChange={setFirma} />
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
          <h3 className="font-semibold text-gray-900">Reglas</h3>
          <p className="text-sm text-gray-600">Para guardar: cliente + mínimo 1 ítem entregado.</p>
          <p className="text-xs text-gray-500">Luego conectamos PDF real con tu `lib/pdf/actaPDF.ts`.</p>
        </aside>
      </div>
    </form>
  );
}
