import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { createPago, getCartera } from "../../lib/repositories/pagoRepo";

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CarteraTable() {
  const [refresh, setRefresh] = useState(0);
  const [q, setQ] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const rows = await getCartera();
        if (!cancelled) setData(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Error cargando cartera:", error);
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data;

    return data.filter((c) => {
      return (
        String(c.numero || "").toLowerCase().includes(term) ||
        String(c.cliente?.nombre || "").toLowerCase().includes(term) ||
        String(c.status || "").toLowerCase().includes(term)
      );
    });
  }, [data, q]);

  const stats = useMemo(() => {
    return {
      total: filtered.length,
      totalFacturado: filtered.reduce((acc, x) => acc + Number(x.total || 0), 0),
      totalPagado: filtered.reduce((acc, x) => acc + Number(x.pagado || 0), 0),
      saldoPendiente: filtered.reduce((acc, x) => acc + Number(x.saldo || 0), 0),
    };
  }, [filtered]);

  async function registrarAbono(c: any) {
    const valorTxt = prompt(`Registrar pago para ${c.numero}\nSaldo actual: ${money(c.saldo)}\nIngresa el valor del abono:`);
    if (!valorTxt) return;

    const valor = Number(valorTxt);
    if (!Number.isFinite(valor) || valor <= 0) {
      alert("Valor inválido.");
      return;
    }

    try {
      await createPago({
        cuentaCobroId: c.id,
        clienteId: c.clienteId,
        fecha: new Date().toISOString().slice(0, 10),
        metodo: "transferencia",
        referencia: `ABONO-${Date.now()}`,
        valor,
        notas: `Abono registrado desde cartera para ${c.numero}.`,
      });

      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error registrando pago:", error);
      alert("No fue posible registrar el pago.");
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pagos y cartera</h1>
          <p className="text-sm text-gray-500">Cartera consolidada de cuentas de cobro conectada al backend.</p>
        </div>

        <a href="/cobros" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Ver cuentas
        </a>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Documentos</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total facturado</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{money(stats.totalFacturado)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total pagado</p>
          <p className="mt-2 text-xl font-semibold text-green-600">{money(stats.totalPagado)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Saldo pendiente</p>
          <p className="mt-2 text-xl font-semibold text-red-600">{money(stats.saldoPendiente)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por número, cliente o estado..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : `${filtered.length} registro(s) de cartera`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">Cargando cartera...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No hay cartera para mostrar.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Documento</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Emisión</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-left font-semibold">Pagado</th>
                <th className="px-5 py-3 text-left font-semibold">Saldo</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">{c.numero}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{c.cliente?.nombre || "—"}</div>
                    <div className="text-xs text-gray-500">{c.cliente?.documento || ""}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{c.fechaEmision || "—"}</td>
                  <td className="px-5 py-3">{money(c.total)}</td>
                  <td className="px-5 py-3 text-green-700">{money(c.pagado)}</td>
                  <td className="px-5 py-3 text-red-700 font-medium">{money(c.saldo)}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/cobros/${c.id}`}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs hover:bg-white"
                      >
                        Ver cuenta
                      </a>
                      <button
                        onClick={() => registrarAbono(c)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700"
                      >
                        Registrar pago
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}