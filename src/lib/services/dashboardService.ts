import type { DashboardMetrics } from "../../types/dashboard";
import { readDashboardCollections } from "../repositories/dashboardRepo";
import {
  listClientes,
} from "../repositories/clienteRepo";
import {
  listProductos,
} from "../repositories/productoRepo";

type AnyRecord = Record<string, any>;

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

export function buildDashboardMetricsFromLocal(): DashboardMetrics {
  const { cotizaciones, ordenes, cobros, pagos } = readDashboardCollections();
  const clientes = listClientes("");
  const productos = listProductos("");

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

  const recentDocs = [
    ...cotizaciones.map((c) => ({
      id: String(pickFirst(c.id, c.numero, Math.random())),
      type: "cotizacion" as const,
      number: numberOf(c, "COT"),
      client: clientNameOf(c),
      amount: totalOf(c),
      date: dateOf(c),
      status: statusOf(c),
    })),
    ...cobros.map((c) => ({
      id: String(pickFirst(c.id, c.numero, Math.random())),
      type: "cobro" as const,
      number: numberOf(c, "CC"),
      client: clientNameOf(c),
      amount: totalOf(c),
      date: dateOf(c),
      status: statusOf(c),
    })),
    ...ordenes.map((o) => ({
      id: String(pickFirst(o.id, o.numero, Math.random())),
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

  const alerts = [];
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
    counts: {
      cotizaciones: cotizaciones.length,
      ordenes: ordenes.length,
      cobros: cobros.length,
      pagos: pagos.length,
      clientes: clientes.length,
      productos: productos.length,
    },
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await fetch("/api/reportes/dashboard", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Dashboard API ${response.status}`);
    }

    const data = await response.json();
    if (!data?.ok || !data?.metrics) {
      throw new Error("Respuesta inválida del dashboard");
    }

    return data.metrics as DashboardMetrics;
  } catch {
    return buildDashboardMetricsFromLocal();
  }
}
