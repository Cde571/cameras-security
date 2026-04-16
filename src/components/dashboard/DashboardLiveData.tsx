import React, { useEffect, useMemo, useState } from "react";
import KPICard from "./KPICard";
import QuickActions from "./QuickActions";
import RecentDocuments from "./RecentDocuments";
import AlertsList from "./AlertsList";
import { getDashboardMetrics } from "../../lib/services/dashboardService";
import type { DashboardMetrics } from "../../types/dashboard";

const emptyMetrics: DashboardMetrics = {
  totalCotizadoMes: 0,
  cotizacionesPendientes: 0,
  ordenesEnCurso: 0,
  carteraPendiente: 0,
  recentDocs: [],
  alerts: [],
  counts: {
    cotizaciones: 0,
    ordenes: 0,
    cobros: 0,
    pagos: 0,
    clientes: 0,
    productos: 0,
  },
};

export default function DashboardLiveData() {
  const [data, setData] = useState<DashboardMetrics>(emptyMetrics);
  const [loading, setLoading] = useState(true);

  const hasCriticalAlerts = useMemo(
    () => data.alerts.some((a) => a.type === "danger"),
    [data.alerts]
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const metrics = await getDashboardMetrics();
        if (active) {
          setData(metrics);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    const interval = window.setInterval(load, 8000);
    const refresh = () => load();

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <>
      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Cotizado este mes"
          value={data.totalCotizadoMes}
          type="currency"
          icon="dollar-sign"
          color="blue"
          link="/cotizaciones"
        />

        <KPICard
          title="Cotizaciones pendientes"
          value={data.cotizacionesPendientes}
          type="number"
          icon="file-text"
          color="orange"
          link="/cotizaciones?status=pendiente"
        />

        <KPICard
          title="Órdenes en curso"
          value={data.ordenesEnCurso}
          type="number"
          icon="wrench"
          color="green"
          link="/ordenes?status=en_progreso"
        />

        <KPICard
          title="Cartera pendiente"
          value={data.carteraPendiente}
          type="currency"
          icon="alert-circle"
          color="red"
          link="/pagos/cartera"
        />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
              Cargando dashboard...
            </div>
          ) : hasCriticalAlerts ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Hay alertas críticas que requieren revisión inmediata.
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              No hay alertas críticas registradas en este momento.
            </div>
          )}

          <AlertsList alerts={data.alerts} />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Documentos recientes</h2>
              <p className="mt-1 text-sm text-gray-500">
                Métricas reales del sistema con fallback automático.
              </p>
            </div>

            <a
              href="/cotizaciones"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Ver todos
            </a>
          </div>
        </div>

        <RecentDocuments documents={data.recentDocs} />
      </section>
    </>
  );
}
