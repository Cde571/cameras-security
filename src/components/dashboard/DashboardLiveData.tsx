import React, { useEffect, useMemo, useState } from "react";
import KPICard from "./KPICard";
import QuickActions from "./QuickActions";
import RecentDocuments from "./RecentDocuments";
import AlertsList from "./AlertsList";
import { readDashboardCollections } from "../../lib/repositories/dashboardRepo";

type AnyRecord = Record<string, any>;

type RecentDoc = {
  id: string;
  type: "cotizacion" | "cobro" | "orden";
  number: string;
  client: string;
  amount: number;
  date: string;
  status: string;
};

type DashboardAlert = {
  id: number;
  type: "warning" | "danger" | "info";
  message: string;
  action: string;
};

function toNumber(value: any): number {
  const n = Number(
    typeof value === "string"
      ? value.replace(/\./g, "").replace(",", ".")
      : value
  );
  return Number.isFinite(n) ? n : 0;
}

function toDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function sameMonth(value?: string) {
  const d = toDate(value);
  if (!d) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function pickFirst(...values: any[]) {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}

function clientNameOf(item: AnyRecord) {
  return pickFirst(
    item?.cliente?.nombre,
    item?.clienteNombre,
    item?.client?.nombre,
    item?.clientName,
    item?.nombreCliente,
    "Sin cliente"
  );
}

function numberOf(item: AnyRecord, prefix: string) {
  return String(
    pickFirst(item.numero, item.codigo, `${prefix}-${String(item.id || "").slice(0, 8)}`)
  );
}

function statusOf(item: AnyRecord) {
  return String(pickFirst(item.status, item.estado, "pendiente")).toLowerCase();
}

function dateOf(item: AnyRecord) {
  return String(
    pickFirst(
      item.fecha,
      item.fechaEmision,
      item.fechaProgramada,
      item.createdAt,
      item.updatedAt,
      new Date().toISOString()
    )
  );
}

function totalOf(item: AnyRecord) {
  return toNumber(
    pickFirst(
      item.total,
      item.totalGeneral,
      item.montoTotal,
      item.valorTotal,
      item.subtotalFinal
    )
  );
}

export default function DashboardLiveData() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((v) => v + 1);

    const interval = window.setInterval(refresh, 1200);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const data = useMemo(() => {
    const { cotizaciones, ordenes, cobros, pagos } = readDashboardCollections();

    const totalCotizadoMes = cotizaciones
      .filter((c) => sameMonth(dateOf(c)))
      .reduce((sum, c) => sum + totalOf(c), 0);

    const cotizacionesPendientes = cotizaciones.filter((c) =>
      ["borrador", "enviada", "pendiente"].includes(statusOf(c))
    ).length;

    const ordenesEnCurso = ordenes.filter((o) =>
      ["pendiente", "en_progreso", "en progreso", "en_revision", "en revisión"].includes(statusOf(o))
    ).length;

    const pagosPorCobro = new Map<string, number>();
    for (const pago of pagos) {
      const cobroId = String(pickFirst(pago.cuentaCobroId, pago.cobroId, pago.cuenta_cobro_id, ""));
      if (!cobroId) continue;
      pagosPorCobro.set(
        cobroId,
        (pagosPorCobro.get(cobroId) || 0) + toNumber(pickFirst(pago.valor, pago.monto, 0))
      );
    }

    const carteraPendiente = cobros.reduce((sum, cobro) => {
      const id = String(pickFirst(cobro.id, ""));
      const total = totalOf(cobro);
      const pagado = pagosPorCobro.get(id) || 0;
      return sum + Math.max(total - pagado, 0);
    }, 0);

    const recentDocs: RecentDoc[] = [
      ...cotizaciones.map((c) => ({
        id: String(pickFirst(c.id, c.numero, crypto.randomUUID?.() || Math.random())),
        type: "cotizacion" as const,
        number: numberOf(c, "COT"),
        client: clientNameOf(c),
        amount: totalOf(c),
        date: dateOf(c),
        status: statusOf(c),
      })),
      ...cobros.map((c) => ({
        id: String(pickFirst(c.id, c.numero, crypto.randomUUID?.() || Math.random())),
        type: "cobro" as const,
        number: numberOf(c, "CC"),
        client: clientNameOf(c),
        amount: totalOf(c),
        date: dateOf(c),
        status: statusOf(c),
      })),
      ...ordenes.map((o) => ({
        id: String(pickFirst(o.id, o.numero, crypto.randomUUID?.() || Math.random())),
        type: "orden" as const,
        number: numberOf(o, "OT"),
        client: clientNameOf(o),
        amount: 0,
        date: dateOf(o),
        status: statusOf(o),
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    const alerts: DashboardAlert[] = [];
    let alertId = 1;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (const c of cotizaciones) {
      const base = toDate(dateOf(c));
      if (!base) continue;

      const vigencia = toNumber(pickFirst(c.vigenciaDias, c.vigencia_dias, 30));
      const vence = new Date(base);
      vence.setDate(vence.getDate() + vigencia);

      if (
        vence.getFullYear() === tomorrow.getFullYear() &&
        vence.getMonth() === tomorrow.getMonth() &&
        vence.getDate() === tomorrow.getDate() &&
        ["borrador", "enviada", "pendiente"].includes(statusOf(c))
      ) {
        alerts.push({
          id: alertId++,
          type: "warning",
          message: `Cotización ${numberOf(c, "COT")} vence mañana`,
          action: `/cotizaciones/${String(c.id)}`,
        });
        break;
      }
    }

    const cobrosPendientes = cobros.filter((c) => {
      const id = String(pickFirst(c.id, ""));
      const total = totalOf(c);
      const pagado = pagosPorCobro.get(id) || 0;
      return total - pagado > 0;
    }).length;

    if (cobrosPendientes > 0) {
      alerts.push({
        id: alertId++,
        type: "danger",
        message: `${cobrosPendientes} cuenta(s) con saldo pendiente`,
        action: "/pagos/cartera",
      });
    }

    const ordenFinalizada = ordenes.find((o) =>
      ["finalizada", "terminada", "completada"].includes(statusOf(o))
    );

    if (ordenFinalizada) {
      alerts.push({
        id: alertId++,
        type: "info",
        message: `Orden ${numberOf(ordenFinalizada, "OT")} finalizada`,
        action: `/ordenes/${String(ordenFinalizada.id)}`,
      });
    }

    return {
      totalCotizadoMes,
      cotizacionesPendientes,
      ordenesEnCurso,
      carteraPendiente,
      recentDocs,
      alerts,
    };
  }, [tick]);

  const hasCriticalAlerts = data.alerts.some((a) => a.type === "danger");

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
          {hasCriticalAlerts ? (
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
                Datos leídos desde la capa unificada del sistema.
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
