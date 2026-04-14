export type DashboardKpis = {
  totalCotizadoMes: number;
  cotizacionesPendientes: number;
  ordenesEnCurso: number;
  carteraVencida: number;
  trendTotalCotizadoMes?: {
    value: number;
    direction: "up" | "down";
  };
};

export type DashboardRecentDoc = {
  id: string;
  type: "cotizacion" | "cobro" | "orden";
  number: string;
  client: string;
  amount: number;
  date: string;
  status: string;
};

export type DashboardAlert = {
  id: number;
  type: "warning" | "danger" | "info";
  message: string;
  action: string;
};

export type DashboardData = {
  dbConnected: boolean;
  error?: string | null;
  kpis: DashboardKpis;
  recentDocs: DashboardRecentDoc[];
  alerts: DashboardAlert[];
};

function toNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toTrend(current: number, previous: number) {
  if (!previous || previous <= 0) return undefined;
  const diff = ((current - previous) / previous) * 100;
  return {
    value: Math.round(Math.abs(diff)),
    direction: diff >= 0 ? "up" as const : "down" as const,
  };
}

function normalizeRows(result: any): any[] {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.rows)) return result.rows;
  return [];
}

async function safeQuery<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[dashboard] fallo en ${label}:`, error);
    return fallback;
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [{ sqlClient, testDbConnection }] = await Promise.all([
      import("../db/client"),
    ]);

    await testDbConnection();

    const totalMesRows = await safeQuery(
      () => sqlClient`
        SELECT COALESCE(SUM(total), 0) AS total
        FROM cotizaciones
        WHERE date_trunc('month', fecha::timestamp) = date_trunc('month', current_date::timestamp)
      `,
      [],
      "totalCotizadoMes"
    );

    const totalMesAnteriorRows = await safeQuery(
      () => sqlClient`
        SELECT COALESCE(SUM(total), 0) AS total
        FROM cotizaciones
        WHERE date_trunc('month', fecha::timestamp) = date_trunc('month', (current_date - interval '1 month')::timestamp)
      `,
      [],
      "totalCotizadoMesAnterior"
    );

    const pendientesRows = await safeQuery(
      () => sqlClient`
        SELECT COUNT(*) AS total
        FROM cotizaciones
        WHERE status IN ('borrador', 'enviada', 'pendiente')
      `,
      [],
      "cotizacionesPendientes"
    );

    const ordenesRows = await safeQuery(
      () => sqlClient`
        SELECT COUNT(*) AS total
        FROM ordenes
        WHERE estado IN ('pendiente', 'en_progreso', 'en_revision')
      `,
      [],
      "ordenesEnCurso"
    );

    const carteraRows = await safeQuery(
      () => sqlClient`
        WITH pagos_por_cobro AS (
          SELECT
            cuenta_cobro_id,
            COALESCE(SUM(valor), 0) AS pagado
          FROM pagos
          GROUP BY cuenta_cobro_id
        )
        SELECT COALESCE(SUM(GREATEST(c.total - COALESCE(pp.pagado, 0), 0)), 0) AS total
        FROM cuentas_cobro c
        LEFT JOIN pagos_por_cobro pp ON pp.cuenta_cobro_id = c.id
        WHERE c.estado IN ('pendiente', 'vencido', 'enviado')
      `,
      [],
      "carteraVencida"
    );

    const docsRows = await safeQuery(
      () => sqlClient`
        SELECT *
        FROM (
          SELECT
            c.id::text AS id,
            'cotizacion'::text AS type,
            c.numero AS number,
            COALESCE(cl.nombre, 'Sin cliente') AS client,
            COALESCE(c.total, 0) AS amount,
            c.fecha::text AS date,
            c.status AS status,
            c.created_at AS sort_at
          FROM cotizaciones c
          LEFT JOIN clientes cl ON cl.id = c.cliente_id

          UNION ALL

          SELECT
            cc.id::text AS id,
            'cobro'::text AS type,
            cc.numero AS number,
            COALESCE(cl.nombre, 'Sin cliente') AS client,
            COALESCE(cc.total, 0) AS amount,
            cc.fecha::text AS date,
            cc.estado AS status,
            cc.created_at AS sort_at
          FROM cuentas_cobro cc
          LEFT JOIN clientes cl ON cl.id = cc.cliente_id

          UNION ALL

          SELECT
            o.id::text AS id,
            'orden'::text AS type,
            o.numero AS number,
            COALESCE(cl.nombre, 'Sin cliente') AS client,
            0::numeric AS amount,
            COALESCE(o.fecha::text, o.created_at::date::text) AS date,
            o.estado AS status,
            o.created_at AS sort_at
          FROM ordenes o
          LEFT JOIN clientes cl ON cl.id = o.cliente_id
        ) docs
        ORDER BY sort_at DESC
        LIMIT 8
      `,
      [],
      "recentDocs"
    );

    const quoteAlertRows = await safeQuery(
      () => sqlClient`
        SELECT id::text AS id, numero
        FROM cotizaciones
        WHERE status IN ('borrador', 'enviada', 'pendiente')
        ORDER BY fecha ASC
        LIMIT 1
      `,
      [],
      "quoteAlert"
    );

    const overdueAlertRows = await safeQuery(
      () => sqlClient`
        WITH pagos_por_cobro AS (
          SELECT
            cuenta_cobro_id,
            COALESCE(SUM(valor), 0) AS pagado
          FROM pagos
          GROUP BY cuenta_cobro_id
        )
        SELECT COUNT(*) AS total
        FROM cuentas_cobro c
        LEFT JOIN pagos_por_cobro pp ON pp.cuenta_cobro_id = c.id
        WHERE GREATEST(c.total - COALESCE(pp.pagado, 0), 0) > 0
      `,
      [],
      "overdueAlert"
    );

    const orderAlertRows = await safeQuery(
      () => sqlClient`
        SELECT id::text AS id, numero
        FROM ordenes
        WHERE estado = 'finalizada'
        ORDER BY updated_at DESC
        LIMIT 1
      `,
      [],
      "orderAlert"
    );

    const totalCotizadoMes = toNumber(normalizeRows(totalMesRows)[0]?.total);
    const totalCotizadoMesAnterior = toNumber(normalizeRows(totalMesAnteriorRows)[0]?.total);

    const recentDocs: DashboardRecentDoc[] = normalizeRows(docsRows).map((row) => ({
      id: String(row.id),
      type: row.type,
      number: row.number,
      client: row.client,
      amount: toNumber(row.amount),
      date: row.date,
      status: row.status,
    }));

    const alerts: DashboardAlert[] = [];
    const quoteRow = normalizeRows(quoteAlertRows)[0];
    const overdueRow = normalizeRows(overdueAlertRows)[0];
    const orderRow = normalizeRows(orderAlertRows)[0];

    if (quoteRow?.id) {
      alerts.push({
        id: 1,
        type: "warning",
        message: `Cotización ${quoteRow.numero} requiere seguimiento`,
        action: `/cotizaciones/${quoteRow.id}`,
      });
    }

    if (toNumber(overdueRow?.total) > 0) {
      alerts.push({
        id: 2,
        type: "danger",
        message: `${toNumber(overdueRow.total)} cuenta(s) de cobro con saldo pendiente`,
        action: "/pagos/cartera",
      });
    }

    if (orderRow?.id) {
      alerts.push({
        id: 3,
        type: "info",
        message: `Orden ${orderRow.numero} finalizada`,
        action: `/ordenes/${orderRow.id}`,
      });
    }

    return {
      dbConnected: true,
      error: null,
      kpis: {
        totalCotizadoMes,
        cotizacionesPendientes: toNumber(normalizeRows(pendientesRows)[0]?.total),
        ordenesEnCurso: toNumber(normalizeRows(ordenesRows)[0]?.total),
        carteraVencida: toNumber(normalizeRows(carteraRows)[0]?.total),
        trendTotalCotizadoMes: toTrend(totalCotizadoMes, totalCotizadoMesAnterior),
      },
      recentDocs,
      alerts,
    };
  } catch (error: any) {
    console.error("[dashboard] conexión principal falló:", error);

    return {
      dbConnected: false,
      error: error?.message || "No fue posible conectar con PostgreSQL",
      kpis: {
        totalCotizadoMes: 0,
        cotizacionesPendientes: 0,
        ordenesEnCurso: 0,
        carteraVencida: 0,
      },
      recentDocs: [],
      alerts: [],
    };
  }
}
