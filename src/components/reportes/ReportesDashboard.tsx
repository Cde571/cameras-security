import React, { useEffect, useMemo, useState } from "react";
import { getReporteDashboard, type ReporteDashboard } from "../../lib/repositories/reporteRepo";

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-500">{title}</p>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function TableBlock({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 text-left font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{rows}</tbody>
      </table>
    </section>
  );
}

export default function ReportesDashboard() {
  const [data, setData] = useState<ReporteDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const d = await getReporteDashboard();
        if (!cancelled) setData(d);
      } catch (error) {
        console.error("Error cargando dashboard de reportes:", error);
        if (!cancelled) {
          setData({
            kpis: {
              totalVentas: 0,
              totalCobrado: 0,
              carteraPendiente: 0,
              clientes: 0,
              productos: 0,
              cotizaciones: 0,
              ordenesAbiertas: 0,
              actasFirmadas: 0,
            },
            recientes: {
              cotizaciones: [],
              cobros: [],
              pagos: [],
            },
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const d = useMemo(() => {
    return data ?? {
      kpis: {
        totalVentas: 0,
        totalCobrado: 0,
        carteraPendiente: 0,
        clientes: 0,
        productos: 0,
        cotizaciones: 0,
        ordenesAbiertas: 0,
        actasFirmadas: 0,
      },
      recientes: {
        cotizaciones: [],
        cobros: [],
        pagos: [],
      },
    };
  }, [data]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
        <p className="text-sm text-gray-500">Resumen comercial y operativo conectado al backend.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total ventas" value={money(d.kpis.totalVentas)} />
        <KpiCard title="Total cobrado" value={money(d.kpis.totalCobrado)} />
        <KpiCard title="Cartera pendiente" value={money(d.kpis.carteraPendiente)} />
        <KpiCard title="Clientes" value={String(d.kpis.clientes)} />
        <KpiCard title="Productos" value={String(d.kpis.productos)} />
        <KpiCard title="Cotizaciones" value={String(d.kpis.cotizaciones)} />
        <KpiCard title="Órdenes abiertas" value={String(d.kpis.ordenesAbiertas)} />
        <KpiCard title="Actas firmadas" value={String(d.kpis.actasFirmadas)} />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <TableBlock
          title="Cotizaciones recientes"
          columns={["Número", "Cliente", "Fecha", "Total", "Estado"]}
          rows={
            d.recientes.cotizaciones.length > 0 ? (
              d.recientes.cotizaciones.map((row: any) => (
                <tr key={row.id}>
                  <td className="px-5 py-3 font-medium text-gray-900">{row.numero}</td>
                  <td className="px-5 py-3">{row.cliente}</td>
                  <td className="px-5 py-3">{row.fecha || "—"}</td>
                  <td className="px-5 py-3">{money(row.total || 0)}</td>
                  <td className="px-5 py-3">{row.status || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-500">Sin registros.</td>
              </tr>
            )
          }
        />

        <TableBlock
          title="Cuentas de cobro recientes"
          columns={["Número", "Cliente", "Fecha", "Total", "Estado"]}
          rows={
            d.recientes.cobros.length > 0 ? (
              d.recientes.cobros.map((row: any) => (
                <tr key={row.id}>
                  <td className="px-5 py-3 font-medium text-gray-900">{row.numero}</td>
                  <td className="px-5 py-3">{row.cliente}</td>
                  <td className="px-5 py-3">{row.fecha || "—"}</td>
                  <td className="px-5 py-3">{money(row.total || 0)}</td>
                  <td className="px-5 py-3">{row.status || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-500">Sin registros.</td>
              </tr>
            )
          }
        />

        <TableBlock
          title="Pagos recientes"
          columns={["Cliente", "Fecha", "Valor", "Método", "Referencia"]}
          rows={
            d.recientes.pagos.length > 0 ? (
              d.recientes.pagos.map((row: any) => (
                <tr key={row.id}>
                  <td className="px-5 py-3 font-medium text-gray-900">{row.cliente}</td>
                  <td className="px-5 py-3">{row.fecha || "—"}</td>
                  <td className="px-5 py-3">{money(row.valor || 0)}</td>
                  <td className="px-5 py-3">{row.metodo || "—"}</td>
                  <td className="px-5 py-3">{row.referencia || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-500">Sin registros.</td>
              </tr>
            )
          }
        />
      </div>
    </div>
  );
}