import React, { useEffect, useMemo, useState } from "react";
import { FileText, Wrench, AlertCircle, Plus, UserPlus, PackagePlus, BadgeDollarSign } from "lucide-react";
import { getDashboardSummary, type DashboardSummary } from "../../lib/repositories/dashboardRepo";

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-CO");
}

function KpiCard({
  title,
  value,
  href,
  icon,
  color,
}: {
  title: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-4 text-white ${color}`}>{icon}</div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <a href={href} className="text-sm font-medium text-blue-600 hover:underline">
          Ver detalles →
        </a>
      </div>
    </div>
  );
}

export default function ConnectedDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await getDashboardSummary();
        if (!cancelled) setData(res);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        if (!cancelled) {
          setData({
            kpis: {
              cotizadoMes: 0,
              cotizacionesPendientes: 0,
              ordenesCurso: 0,
              carteraPendiente: 0,
              totalClientes: 0,
            },
            recientes: [],
            alertas: [],
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

  const summary = useMemo(() => {
    return data ?? {
      kpis: {
        cotizadoMes: 0,
        cotizacionesPendientes: 0,
        ordenesCurso: 0,
        carteraPendiente: 0,
        totalClientes: 0,
      },
      recientes: [],
      alertas: [],
    };
  }, [data]);

  const hoy = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const mes = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("es-CO", { month: "long" });
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Bienvenido de nuevo</h1>
            <p className="mt-3 text-2xl/relaxed text-blue-50">Hoy es {hoy}</p>
          </div>

          <div className="rounded-2xl bg-white/15 px-6 py-5 text-right">
            <div className="text-lg text-blue-100">Mes actual</div>
            <div className="text-5xl font-bold capitalize">{mes}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <KpiCard
          title="Cotizado este mes"
          value={money(summary.kpis.cotizadoMes)}
          href="/cotizaciones"
          icon={<BadgeDollarSign className="h-8 w-8" />}
          color="bg-blue-500"
        />
        <KpiCard
          title="Cotizaciones pendientes"
          value={String(summary.kpis.cotizacionesPendientes)}
          href="/cotizaciones"
          icon={<FileText className="h-8 w-8" />}
          color="bg-orange-500"
        />
        <KpiCard
          title="Órdenes en curso"
          value={String(summary.kpis.ordenesCurso)}
          href="/ordenes"
          icon={<Wrench className="h-8 w-8" />}
          color="bg-green-500"
        />
        <KpiCard
          title="Cartera pendiente"
          value={money(summary.kpis.carteraPendiente)}
          href="/pagos"
          icon={<AlertCircle className="h-8 w-8" />}
          color="bg-red-500"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.9fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-2xl font-bold text-gray-900">Acciones Rápidas</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <a href="/cotizaciones/nueva" className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
              <div className="rounded-xl bg-blue-500 p-4 text-white"><Plus className="h-6 w-6" /></div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">Nueva Cotización</p>
                <p className="text-gray-500">Crear cotización para cliente</p>
              </div>
            </a>

            <a href="/clientes/nuevo" className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
              <div className="rounded-xl bg-green-500 p-4 text-white"><UserPlus className="h-6 w-6" /></div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">Nuevo Cliente</p>
                <p className="text-gray-500">Agregar cliente al sistema</p>
              </div>
            </a>

            <a href="/productos/nuevo" className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
              <div className="rounded-xl bg-purple-500 p-4 text-white"><PackagePlus className="h-6 w-6" /></div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">Nuevo Producto</p>
                <p className="text-gray-500">Agregar producto al catálogo</p>
              </div>
            </a>

            <a href="/pagos" className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
              <div className="rounded-xl bg-orange-500 p-4 text-white"><BadgeDollarSign className="h-6 w-6" /></div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">Registrar Pago</p>
                <p className="text-gray-500">Registrar pago recibido</p>
              </div>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm text-gray-500">
            {loading ? "Cargando dashboard..." : `${summary.recientes.length} documento(s) reciente(s)`}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-2xl font-bold text-gray-900">Alertas</h2>
            </div>

            <div className="p-6">
              {summary.alertas.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <AlertCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-lg">No hay alertas pendientes</p>
                  <p className="mt-1 text-sm">Todo está al día</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {summary.alertas.map((a, idx) => (
                    <div key={idx} className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="font-semibold text-red-800">{a.titulo}</p>
                      <p className="text-sm text-red-700">{a.descripcion}</p>
                      <p className="mt-1 text-xs text-red-600">{formatDate(a.fecha)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-gray-900">Documentos recientes</h2>
        </div>

        <div className="p-6">
          {summary.recientes.length === 0 ? (
            <p className="text-gray-500">Aún no hay documentos recientes para mostrar.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="pb-3 pr-4">Tipo</th>
                    <th className="pb-3 pr-4">Número</th>
                    <th className="pb-3 pr-4">Estado</th>
                    <th className="pb-3 pr-4">Fecha</th>
                    <th className="pb-3 pr-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recientes.map((r) => (
                    <tr key={`${r.tipo}-${r.id}`} className="border-t border-gray-100">
                      <td className="py-3 pr-4 capitalize">{r.tipo}</td>
                      <td className="py-3 pr-4 font-medium text-gray-900">{r.numero}</td>
                      <td className="py-3 pr-4">{r.estado}</td>
                      <td className="py-3 pr-4">{formatDate(r.fecha)}</td>
                      <td className="py-3 pr-4">{money(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}