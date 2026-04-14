import type { APIRoute } from "astro";
import { sqlClient } from "../../../lib/db/client";

function arr<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

function str(value: any, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

function num(value: any, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function safeDate(value: any) {
  const raw = str(value);
  if (!raw) return new Date().toISOString().slice(0, 10);
  return raw.slice(0, 10);
}

function computeCotizacionTotals(items: any[]) {
  let subtotal = 0;
  let iva = 0;

  for (const item of items) {
    const qty = num(item?.qty ?? item?.cantidad ?? 0);
    const precio = num(item?.precio ?? item?.unitario ?? 0);
    const ivaPct = num(item?.ivaPct ?? item?.iva_pct ?? 0);
    const lineSubtotal = qty * precio;
    const lineIva = lineSubtotal * (ivaPct / 100);

    subtotal += lineSubtotal;
    iva += lineIva;
  }

  return {
    subtotal,
    iva,
    total: subtotal + iva,
  };
}

function computeCobroTotals(servicios: any[], current?: any) {
  let subtotal = 0;
  let iva = 0;

  for (const item of servicios) {
    const qty = num(item?.cantidad ?? item?.qty ?? 0);
    const unitario = num(item?.unitario ?? item?.precio ?? 0);
    const ivaPct = num(item?.ivaPct ?? item?.iva_pct ?? 0);
    const lineSubtotal = qty * unitario;
    const lineIva = lineSubtotal * (ivaPct / 100);

    subtotal += lineSubtotal;
    iva += lineIva;
  }

  const totalCalculado = subtotal + iva;

  return {
    subtotal: subtotal || num(current?.subtotal ?? 0),
    iva: iva || num(current?.iva ?? 0),
    total: totalCalculado || num(current?.total ?? 0),
  };
}

async function upsertCliente(tx: typeof sqlClient, raw: any) {
  const id = str(raw?.id);
  if (!id) return null;

  await tx`
    INSERT INTO clientes (
      id, nombre, documento, email, telefono, ciudad, created_at, updated_at
    ) VALUES (
      ${id},
      ${str(raw?.nombre, "Sin nombre")},
      ${str(raw?.documento ?? raw?.nit)},
      ${str(raw?.email)},
      ${str(raw?.telefono)},
      ${str(raw?.ciudad)},
      ${str(raw?.createdAt, new Date().toISOString())},
      ${str(raw?.updatedAt, new Date().toISOString())}
    )
    ON CONFLICT (id) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      documento = EXCLUDED.documento,
      email = EXCLUDED.email,
      telefono = EXCLUDED.telefono,
      ciudad = EXCLUDED.ciudad,
      updated_at = EXCLUDED.updated_at
  `;
  return id;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));

    const clientes = arr(body?.clientes);
    const cotizaciones = arr(body?.cotizaciones);
    const ordenes = arr(body?.ordenes);
    const cobros = arr(body?.cobros);
    const pagos = arr(body?.pagos);

    await sqlClient.begin(async (tx) => {
      for (const cliente of clientes) {
        await upsertCliente(tx, cliente);
      }

      for (const cot of cotizaciones) {
        const cliente = cot?.cliente || {};
        let clienteId = str(cot?.clienteId ?? cot?.cliente_id ?? cliente?.id);

        if (!clienteId && str(cliente?.nombre)) {
          clienteId = str(cliente?.id || crypto.randomUUID());
          await upsertCliente(tx, { ...cliente, id: clienteId });
        } else if (clienteId) {
          await upsertCliente(tx, { ...cliente, id: clienteId });
        }

        const id = str(cot?.id);
        if (!id) continue;

        const items = arr(cot?.items);
        const totals = computeCotizacionTotals(items);

        await tx`
          INSERT INTO cotizaciones (
            id, numero, version, fecha, vigencia_dias, cliente_id,
            asunto, subtotal, iva, total, status, notas, created_at, updated_at
          ) VALUES (
            ${id},
            ${str(cot?.numero, `COT-${Date.now()}`)},
            ${num(cot?.version, 1)},
            ${safeDate(cot?.fecha ?? cot?.createdAt)},
            ${num(cot?.vigenciaDias ?? cot?.vigencia_dias, 30)},
            ${clienteId || null},
            ${str(cot?.asunto, "Cotización")},
            ${num(cot?.subtotal, totals.subtotal)},
            ${num(cot?.iva, totals.iva)},
            ${num(cot?.total, totals.total)},
            ${str(cot?.status, "borrador")},
            ${str(cot?.notas ?? cot?.observaciones)},
            ${str(cot?.createdAt, new Date().toISOString())},
            ${str(cot?.updatedAt, new Date().toISOString())}
          )
          ON CONFLICT (id) DO UPDATE SET
            numero = EXCLUDED.numero,
            version = EXCLUDED.version,
            fecha = EXCLUDED.fecha,
            vigencia_dias = EXCLUDED.vigencia_dias,
            cliente_id = EXCLUDED.cliente_id,
            asunto = EXCLUDED.asunto,
            subtotal = EXCLUDED.subtotal,
            iva = EXCLUDED.iva,
            total = EXCLUDED.total,
            status = EXCLUDED.status,
            notas = EXCLUDED.notas,
            updated_at = EXCLUDED.updated_at
        `;

        await tx`DELETE FROM cotizacion_items WHERE cotizacion_id = ${id}`;

        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          const itemId = str(item?.id || crypto.randomUUID());
          const qty = num(item?.qty ?? item?.cantidad, 0);
          const precio = num(item?.precio ?? item?.unitario, 0);
          const ivaPct = num(item?.ivaPct ?? item?.iva_pct, 0);
          const lineSubtotal = qty * precio;
          const lineTotal = lineSubtotal + lineSubtotal * (ivaPct / 100);

          await tx`
            INSERT INTO cotizacion_items (
              id, cotizacion_id, producto_id, nombre, kind,
              qty, precio, iva_pct, subtotal, total, order_index
            ) VALUES (
              ${itemId},
              ${id},
              ${str(item?.productoId ?? item?.producto_id) || null},
              ${str(item?.nombre ?? item?.descripcion, "Ítem")},
              ${str(item?.kind, "producto")},
              ${qty},
              ${precio},
              ${ivaPct},
              ${lineSubtotal},
              ${lineTotal},
              ${index}
            )
          `;
        }
      }

      for (const orden of ordenes) {
        const cliente = orden?.cliente || {};
        let clienteId = str(orden?.clienteId ?? orden?.cliente_id ?? cliente?.id);

        if (!clienteId && str(cliente?.nombre)) {
          clienteId = str(cliente?.id || crypto.randomUUID());
          await upsertCliente(tx, { ...cliente, id: clienteId });
        } else if (clienteId) {
          await upsertCliente(tx, { ...cliente, id: clienteId });
        }

        const id = str(orden?.id);
        if (!id) continue;

        await tx`
          INSERT INTO ordenes (
            id, numero, cliente_id, cotizacion_id, fecha,
            estado, tecnico, checklist, notas, created_at, updated_at
          ) VALUES (
            ${id},
            ${str(orden?.numero, `OT-${Date.now()}`)},
            ${clienteId || null},
            ${str(orden?.cotizacionId ?? orden?.cotizacion_id) || null},
            ${safeDate(orden?.fecha ?? orden?.fechaProgramada ?? orden?.createdAt)},
            ${str(orden?.estado ?? orden?.status, "pendiente")},
            ${str(orden?.tecnico ?? orden?.tecnicoNombre)},
            ${JSON.stringify(orden?.checklist ?? [])},
            ${str(orden?.notas ?? orden?.observaciones)},
            ${str(orden?.createdAt, new Date().toISOString())},
            ${str(orden?.updatedAt, new Date().toISOString())}
          )
          ON CONFLICT (id) DO UPDATE SET
            numero = EXCLUDED.numero,
            cliente_id = EXCLUDED.cliente_id,
            cotizacion_id = EXCLUDED.cotizacion_id,
            fecha = EXCLUDED.fecha,
            estado = EXCLUDED.estado,
            tecnico = EXCLUDED.tecnico,
            checklist = EXCLUDED.checklist,
            notas = EXCLUDED.notas,
            updated_at = EXCLUDED.updated_at
        `;
      }

      for (const cobro of cobros) {
        const cliente = cobro?.cliente || {};
        let clienteId = str(cobro?.clienteId ?? cobro?.cliente_id ?? cliente?.id);

        if (!clienteId && str(cliente?.nombre)) {
          clienteId = str(cliente?.id || crypto.randomUUID());
          await upsertCliente(tx, { ...cliente, id: clienteId });
        } else if (clienteId) {
          await upsertCliente(tx, { ...cliente, id: clienteId });
        }

        const id = str(cobro?.id);
        if (!id) continue;

        const servicios = arr(cobro?.servicios ?? cobro?.items);
        const totals = computeCobroTotals(servicios, cobro);

        await tx`
          INSERT INTO cuentas_cobro (
            id, numero, cliente_id, fecha, referencia,
            subtotal, iva, total, estado, created_at, updated_at
          ) VALUES (
            ${id},
            ${str(cobro?.numero, `CC-${Date.now()}`)},
            ${clienteId || null},
            ${safeDate(cobro?.fechaEmision ?? cobro?.fecha ?? cobro?.createdAt)},
            ${str(cobro?.referencia)},
            ${totals.subtotal},
            ${totals.iva},
            ${totals.total},
            ${str(cobro?.estado ?? cobro?.status, "pendiente")},
            ${str(cobro?.createdAt, new Date().toISOString())},
            ${str(cobro?.updatedAt, new Date().toISOString())}
          )
          ON CONFLICT (id) DO UPDATE SET
            numero = EXCLUDED.numero,
            cliente_id = EXCLUDED.cliente_id,
            fecha = EXCLUDED.fecha,
            referencia = EXCLUDED.referencia,
            subtotal = EXCLUDED.subtotal,
            iva = EXCLUDED.iva,
            total = EXCLUDED.total,
            estado = EXCLUDED.estado,
            updated_at = EXCLUDED.updated_at
        `;
      }

      for (const pago of pagos) {
        const id = str(pago?.id);
        if (!id) continue;

        await tx`
          INSERT INTO pagos (
            id, cuenta_cobro_id, fecha, valor, metodo,
            referencia, notas, created_at
          ) VALUES (
            ${id},
            ${str(pago?.cuentaCobroId ?? pago?.cobroId ?? pago?.cuenta_cobro_id) || null},
            ${safeDate(pago?.fecha ?? pago?.createdAt)},
            ${num(pago?.valor ?? pago?.monto, 0)},
            ${str(pago?.metodo, "transferencia")},
            ${str(pago?.referencia)},
            ${str(pago?.notas ?? pago?.observaciones)},
            ${str(pago?.createdAt, new Date().toISOString())}
          )
          ON CONFLICT (id) DO UPDATE SET
            cuenta_cobro_id = EXCLUDED.cuenta_cobro_id,
            fecha = EXCLUDED.fecha,
            valor = EXCLUDED.valor,
            metodo = EXCLUDED.metodo,
            referencia = EXCLUDED.referencia,
            notas = EXCLUDED.notas
        `;
      }
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[legacy-sync] error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error?.message || "No fue posible sincronizar",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
