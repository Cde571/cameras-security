import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function tableExists(sql: any, tableName: string) {
  const rows = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
    ) AS ok
  `;
  return Boolean(rows[0]?.ok);
}

async function columnExists(sql: any, tableName: string, columnName: string) {
  const rows = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
        AND column_name = ${columnName}
    ) AS ok
  `;
  return Boolean(rows[0]?.ok);
}

async function safeCount(sql: any, tableName: string) {
  if (!(await tableExists(sql, tableName))) return 0;
  const rows = await sql.unsafe(`SELECT count(*)::int AS total FROM ${tableName}`);
  return Number(rows[0]?.total || 0);
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();

    const hasCotizaciones = await tableExists(sql, "cotizaciones");
    const hasOrdenes = await tableExists(sql, "ordenes");
    const hasCobros = await tableExists(sql, "cuentas_cobro");
    const hasPagos = await tableExists(sql, "pagos");
    const hasClientes = await tableExists(sql, "clientes");

    let cotizadoMes = 0;
    if (hasCotizaciones) {
      const hasFecha = await columnExists(sql, "cotizaciones", "fecha");
      const hasTotal = await columnExists(sql, "cotizaciones", "total");

      if (hasFecha && hasTotal) {
        const rows = await sql`
          SELECT COALESCE(sum(total), 0)::numeric AS total
          FROM cotizaciones
          WHERE date_trunc('month', fecha::date) = date_trunc('month', current_date)
        `;
        cotizadoMes = Number(rows[0]?.total || 0);
      }
    }

    let cotizacionesPendientes = 0;
    if (hasCotizaciones) {
      const hasStatus = await columnExists(sql, "cotizaciones", "status");
      if (hasStatus) {
        const rows = await sql`
          SELECT count(*)::int AS total
          FROM cotizaciones
          WHERE lower(coalesce(status, '')) IN ('pendiente', 'borrador', 'enviada', 'por_aprobar')
        `;
        cotizacionesPendientes = Number(rows[0]?.total || 0);
      } else {
        cotizacionesPendientes = await safeCount(sql, "cotizaciones");
      }
    }

    let ordenesCurso = 0;
    if (hasOrdenes) {
      const hasStatus = await columnExists(sql, "ordenes", "status");
      if (hasStatus) {
        const rows = await sql`
          SELECT count(*)::int AS total
          FROM ordenes
          WHERE lower(coalesce(status, '')) NOT IN ('completada', 'completado', 'finalizada', 'cerrada', 'cancelada')
        `;
        ordenesCurso = Number(rows[0]?.total || 0);
      } else {
        ordenesCurso = await safeCount(sql, "ordenes");
      }
    }

    let carteraPendiente = 0;
    if (hasCobros) {
      const hasTotal = await columnExists(sql, "cuentas_cobro", "total");
      if (hasTotal) {
        if (hasPagos && (await columnExists(sql, "pagos", "cuenta_cobro_id")) && (await columnExists(sql, "pagos", "valor"))) {
          const rows = await sql`
            SELECT COALESCE(sum(base.saldo), 0)::numeric AS total
            FROM (
              SELECT
                cc.id,
                GREATEST(COALESCE(cc.total, 0) - COALESCE(sum(p.valor), 0), 0) AS saldo
              FROM cuentas_cobro cc
              LEFT JOIN pagos p ON p.cuenta_cobro_id = cc.id
              GROUP BY cc.id, cc.total
            ) base
          `;
          carteraPendiente = Number(rows[0]?.total || 0);
        } else {
          const rows = await sql`
            SELECT COALESCE(sum(total), 0)::numeric AS total
            FROM cuentas_cobro
          `;
          carteraPendiente = Number(rows[0]?.total || 0);
        }
      }
    }

    let recientes: any[] = [];

    if (hasCotizaciones) {
      const rows = await sql`
        SELECT
          id::text AS id,
          'cotizacion' AS tipo,
          coalesce(numero, 'Sin número') AS numero,
          coalesce(status, '—') AS estado,
          COALESCE(total, 0)::numeric AS total,
          coalesce(fecha::text, created_at::text, now()::text) AS fecha
        FROM cotizaciones
        ORDER BY coalesce(updated_at, created_at, now()) DESC
        LIMIT 4
      `;
      recientes = recientes.concat(rows);
    }

    if (hasOrdenes) {
      const rows = await sql`
        SELECT
          id::text AS id,
          'orden' AS tipo,
          coalesce(numero, 'Sin número') AS numero,
          coalesce(status, '—') AS estado,
          0::numeric AS total,
          coalesce(fecha::text, created_at::text, now()::text) AS fecha
        FROM ordenes
        ORDER BY coalesce(updated_at, created_at, now()) DESC
        LIMIT 4
      `;
      recientes = recientes.concat(rows);
    }

    if (hasCobros) {
      const hasFechaEmision = await columnExists(sql, "cuentas_cobro", "fecha_emision");
      const rows = hasFechaEmision
        ? await sql`
            SELECT
              id::text AS id,
              'cobro' AS tipo,
              coalesce(numero, 'Sin número') AS numero,
              coalesce(status, '—') AS estado,
              COALESCE(total, 0)::numeric AS total,
              coalesce(fecha_emision::text, created_at::text, now()::text) AS fecha
            FROM cuentas_cobro
            ORDER BY coalesce(updated_at, created_at, now()) DESC
            LIMIT 4
          `
        : await sql`
            SELECT
              id::text AS id,
              'cobro' AS tipo,
              coalesce(numero, 'Sin número') AS numero,
              coalesce(status, '—') AS estado,
              COALESCE(total, 0)::numeric AS total,
              coalesce(created_at::text, now()::text) AS fecha
            FROM cuentas_cobro
            ORDER BY coalesce(updated_at, created_at, now()) DESC
            LIMIT 4
          `;
      recientes = recientes.concat(rows);
    }

    recientes = recientes
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 6);

    let alertas: any[] = [];

    if (hasCobros && (await columnExists(sql, "cuentas_cobro", "fecha_vencimiento")) && (await columnExists(sql, "cuentas_cobro", "total"))) {
      if (hasPagos && (await columnExists(sql, "pagos", "cuenta_cobro_id")) && (await columnExists(sql, "pagos", "valor"))) {
        const rows = await sql`
          SELECT
            cc.id::text AS id,
            cc.numero,
            cc.fecha_vencimiento::text AS fecha,
            GREATEST(COALESCE(cc.total, 0) - COALESCE(sum(p.valor), 0), 0)::numeric AS saldo
          FROM cuentas_cobro cc
          LEFT JOIN pagos p ON p.cuenta_cobro_id = cc.id
          WHERE cc.fecha_vencimiento IS NOT NULL
            AND cc.fecha_vencimiento < current_date
          GROUP BY cc.id, cc.numero, cc.fecha_vencimiento, cc.total
          HAVING GREATEST(COALESCE(cc.total, 0) - COALESCE(sum(p.valor), 0), 0) > 0
          ORDER BY cc.fecha_vencimiento ASC
          LIMIT 5
        `;

        alertas = rows.map((r: any) => ({
          tipo: "cobro_vencido",
          titulo: `Cuenta vencida ${r.numero}`,
          descripcion: `Saldo pendiente: ${Number(r.saldo || 0)}`,
          fecha: r.fecha,
        }));
      }
    }

    const totalClientes = hasClientes ? await safeCount(sql, "clientes") : 0;

    return json({
      kpis: {
        cotizadoMes,
        cotizacionesPendientes,
        ordenesCurso,
        carteraPendiente,
        totalClientes,
      },
      recientes,
      alertas,
    }, 200);
  } catch (error: any) {
    console.error("[api/dashboard/summary][GET]", error);
    return json({
      error: error?.message || "No fue posible cargar el dashboard",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};