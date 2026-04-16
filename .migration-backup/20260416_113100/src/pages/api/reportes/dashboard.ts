import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";
import type { DashboardMetrics } from "../../../types/dashboard";

function toNumber(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function mapStatus(value: any): string {
  return String(value ?? "").toLowerCase();
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();

    const [
      cotizacionesCountRows,
      ordenesCountRows,
      cobrosCountRows,
      pagosCountRows,
      clientesCountRows,
      productosCountRows,
      cotPendRows,
      ordCursoRows,
      totalMesRows,
      carteraRows,
      recentCotRows,
      recentOrdenRows,
      recentCobroRows
    ] = await Promise.all([
      sql`SELECT COUNT(*)::int AS total FROM cotizaciones`,
      sql`SELECT COUNT(*)::int AS total FROM ordenes`,
      sql`SELECT COUNT(*)::int AS total FROM cobros`,
      sql`SELECT COUNT(*)::int AS total FROM pagos`,
      sql`SELECT COUNT(*)::int AS total FROM clientes`,
      sql`SELECT COUNT(*)::int AS total FROM productos`,
      sql`
        SELECT COUNT(*)::int AS total
        FROM cotizaciones
        WHERE lower(coalesce(status, 'pendiente')) IN ('borrador', 'enviada', 'pendiente')
      `,
      sql`
        SELECT COUNT(*)::int AS total
        FROM ordenes
        WHERE lower(coalesce(status, 'pendiente')) IN ('pendiente', 'en_progreso', 'en progreso', 'en_revision', 'en revisión')
      `,
      sql`
        SELECT COALESCE(SUM(total), 0)::float AS total
        FROM cotizaciones
        WHERE date_trunc('month', coalesce(fecha, current_date)::timestamp) = date_trunc('month', now())
      `,
      sql`
        SELECT COALESCE(SUM(GREATEST(c.total - COALESCE(p.pagado, 0), 0)), 0)::float AS total
        FROM cobros c
        LEFT JOIN (
          SELECT coalesce(cobro_id, cuenta_cobro_id) AS cobro_fk, COALESCE(SUM(coalesce(valor, monto, 0)), 0) AS pagado
          FROM pagos
          GROUP BY coalesce(cobro_id, cuenta_cobro_id)
        ) p ON p.cobro_fk = c.id
      `,
      sql`
        SELECT
          c.id::text AS id,
          'cotizacion'::text AS type,
          coalesce(c.numero, 'COT-' || substring(c.id::text, 1, 8)) AS number,
          coalesce(cl.nombre, 'Sin cliente') AS client,
          coalesce(c.total, 0)::float AS amount,
          coalesce(c.fecha::text, now()::date::text) AS date,
          lower(coalesce(c.status, 'pendiente')) AS status
        FROM cotizaciones c
        LEFT JOIN clientes cl ON cl.id = c.cliente_id
        ORDER BY coalesce(c.updated_at, c.created_at, now()) DESC
        LIMIT 5
      `,
      sql`
        SELECT
          o.id::text AS id,
          'orden'::text AS type,
          coalesce(o.numero, 'OT-' || substring(o.id::text, 1, 8)) AS number,
          coalesce(cl.nombre, 'Sin cliente') AS client,
          0::float AS amount,
          coalesce(o.fecha::text, now()::date::text) AS date,
          lower(coalesce(o.status, 'pendiente')) AS status
        FROM ordenes o
        LEFT JOIN clientes cl ON cl.id = o.cliente_id
        ORDER BY coalesce(o.updated_at, o.created_at, now()) DESC
        LIMIT 5
      `,
      sql`
        SELECT
          c.id::text AS id,
          'cobro'::text AS type,
          coalesce(c.numero, 'CC-' || substring(c.id::text, 1, 8)) AS number,
          coalesce(cl.nombre, 'Sin cliente') AS client,
          coalesce(c.total, 0)::float AS amount,
          coalesce(c.fecha::text, now()::date::text) AS date,
          lower(coalesce(c.status, 'pendiente')) AS status
        FROM cobros c
        LEFT JOIN clientes cl ON cl.id = c.cliente_id
        ORDER BY coalesce(c.updated_at, c.created_at, now()) DESC
        LIMIT 5
      `
    ]);

    const recentDocs = [
      ...recentCotRows,
      ...recentOrdenRows,
      ...recentCobroRows,
    ]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    const alerts = [];

    const pendingCobros = toNumber(cobrosCountRows?.[0]?.total);
    if (pendingCobros > 0) {
      alerts.push({
        id: 1,
        type: "danger",
        message: `${pendingCobros} documento(s) financieros registrados`,
        action: "/cobros",
      });
    }

    const metrics: DashboardMetrics = {
      totalCotizadoMes: toNumber(totalMesRows?.[0]?.total),
      cotizacionesPendientes: toNumber(cotPendRows?.[0]?.total),
      ordenesEnCurso: toNumber(ordCursoRows?.[0]?.total),
      carteraPendiente: toNumber(carteraRows?.[0]?.total),
      recentDocs,
      alerts,
      counts: {
        cotizaciones: toNumber(cotizacionesCountRows?.[0]?.total),
        ordenes: toNumber(ordenesCountRows?.[0]?.total),
        cobros: toNumber(cobrosCountRows?.[0]?.total),
        pagos: toNumber(pagosCountRows?.[0]?.total),
        clientes: toNumber(clientesCountRows?.[0]?.total),
        productos: toNumber(productosCountRows?.[0]?.total),
      },
    };

    return new Response(JSON.stringify({ ok: true, metrics }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, metrics: null }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
