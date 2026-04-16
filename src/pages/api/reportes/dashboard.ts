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

async function safeSum(sql: any, tableName: string, columnName: string) {
  if (!(await tableExists(sql, tableName))) return 0;
  if (!(await columnExists(sql, tableName, columnName))) return 0;
  const rows = await sql.unsafe(`SELECT COALESCE(sum(${columnName}),0)::numeric AS total FROM ${tableName}`);
  return Number(rows[0]?.total || 0);
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();

    const hasClientes = await tableExists(sql, "clientes");
    const hasProductos = await tableExists(sql, "productos");
    const hasCotizaciones = await tableExists(sql, "cotizaciones");
    const hasOrdenes = await tableExists(sql, "ordenes");
    const hasActas = await tableExists(sql, "actas");
    const hasCobros = await tableExists(sql, "cuentas_cobro");
    const hasPagos = await tableExists(sql, "pagos");

    const totalVentas = hasCotizaciones ? await safeSum(sql, "cotizaciones", "total") : 0;
    const totalCobrado = hasPagos ? await safeSum(sql, "pagos", "valor") : 0;

    let carteraPendiente = 0;
    if (hasCobros) {
      if (hasPagos) {
        const rows = await sql`
          SELECT COALESCE(sum(base.saldo), 0)::numeric AS total
          FROM (
            SELECT
              cc.id,
              GREATEST(cc.total - COALESCE(sum(p.valor), 0), 0) AS saldo
            FROM cuentas_cobro cc
            LEFT JOIN pagos p ON p.cuenta_cobro_id = cc.id
            GROUP BY cc.id, cc.total
          ) base
        `;
        carteraPendiente = Number(rows[0]?.total || 0);
      } else {
        carteraPendiente = await safeSum(sql, "cuentas_cobro", "total");
      }
    }

    const clientes = hasClientes ? await safeCount(sql, "clientes") : 0;
    const productos = hasProductos ? await safeCount(sql, "productos") : 0;
    const cotizaciones = hasCotizaciones ? await safeCount(sql, "cotizaciones") : 0;

    let ordenesAbiertas = 0;
    if (hasOrdenes && (await columnExists(sql, "ordenes", "status"))) {
      const rows = await sql`
        SELECT count(*)::int AS total
        FROM ordenes
        WHERE coalesce(status, '') NOT IN ('finalizada', 'cancelada')
      `;
      ordenesAbiertas = Number(rows[0]?.total || 0);
    } else if (hasOrdenes) {
      ordenesAbiertas = await safeCount(sql, "ordenes");
    }

    let actasFirmadas = 0;
    if (hasActas && (await columnExists(sql, "actas", "estado"))) {
      const rows = await sql`
        SELECT count(*)::int AS total
        FROM actas
        WHERE lower(coalesce(estado, '')) = 'firmada'
      `;
      actasFirmadas = Number(rows[0]?.total || 0);
    } else if (hasActas) {
      actasFirmadas = await safeCount(sql, "actas");
    }

    let recientesCotizaciones: any[] = [];
    if (hasCotizaciones) {
      recientesCotizaciones = await sql`
        SELECT
          ctz.id::text AS id,
          ctz.numero,
          ctz.fecha::text AS fecha,
          ctz.total,
          ctz.status,
          coalesce(cli.nombre, '—') AS cliente
        FROM cotizaciones ctz
        LEFT JOIN clientes cli ON cli.id = ctz.cliente_id
        ORDER BY coalesce(ctz.updated_at, ctz.created_at, now()) DESC
        LIMIT 5
      `;
    }

    let recientesCobros: any[] = [];
    if (hasCobros) {
      recientesCobros = await sql`
        SELECT
          cc.id::text AS id,
          cc.numero,
          cc.fecha_emision::text AS fecha,
          cc.total,
          cc.status,
          coalesce(cli.nombre, '—') AS cliente
        FROM cuentas_cobro cc
        LEFT JOIN clientes cli ON cli.id = cc.cliente_id
        ORDER BY coalesce(cc.updated_at, cc.created_at, now()) DESC
        LIMIT 5
      `;
    }

    let recientesPagos: any[] = [];
    if (hasPagos) {
      recientesPagos = await sql`
        SELECT
          p.id::text AS id,
          p.fecha::text AS fecha,
          p.valor,
          p.metodo,
          p.referencia,
          coalesce(cli.nombre, '—') AS cliente
        FROM pagos p
        LEFT JOIN clientes cli ON cli.id = p.cliente_id
        ORDER BY coalesce(p.updated_at, p.created_at, now()) DESC
        LIMIT 5
      `;
    }

    const payload = {
      kpis: {
        totalVentas,
        totalCobrado,
        carteraPendiente,
        clientes,
        productos,
        cotizaciones,
        ordenesAbiertas,
        actasFirmadas,
      },
      recientes: {
        cotizaciones: recientesCotizaciones,
        cobros: recientesCobros,
        pagos: recientesPagos,
      },
    };

    return json(payload, 200);
  } catch (error: any) {
    console.error("[api/reportes/dashboard][GET]", error);
    return json({
      error: error?.message || "No fue posible cargar el dashboard de reportes",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};