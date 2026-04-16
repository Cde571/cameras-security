import { getSqlClient } from "../../db/client";
import {
  asBoolean,
  asNullableString,
  asNumber,
  asString,
  toArray,
  toIsoDate,
} from "./http";

type SqlClient = ReturnType<typeof getSqlClient>;

function sql() {
  return getSqlClient();
}

function money(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function like(search: string) {
  return `%${search.trim()}%`;
}

function rowTextDate(value: any) {
  return value ? String(value).slice(0, 10) : "";
}

async function ensureNumeracionRow(conn: SqlClient) {
  await conn`
    INSERT INTO numeracion_config (id)
    SELECT gen_random_uuid()
    WHERE NOT EXISTS (SELECT 1 FROM numeracion_config)
  `;
}

export async function nextDocumentNumber(kind: "cotizacion" | "orden" | "acta" | "cobro") {
  const conn = sql();
  await ensureNumeracionRow(conn);
  const year = new Date().getFullYear();

  if (kind === "cotizacion") {
    const rows = await conn`
      UPDATE numeracion_config
      SET cotizacion_seq = cotizacion_seq + 1, updated_at = now()
      RETURNING cotizacion_prefix AS prefix, cotizacion_seq AS seq
    `;
    return `${rows[0].prefix}-${year}-${String(rows[0].seq).padStart(4, "0")}`;
  }

  if (kind === "orden") {
    const rows = await conn`
      UPDATE numeracion_config
      SET orden_seq = orden_seq + 1, updated_at = now()
      RETURNING orden_prefix AS prefix, orden_seq AS seq
    `;
    return `${rows[0].prefix}-${year}-${String(rows[0].seq).padStart(4, "0")}`;
  }

  if (kind === "acta") {
    const rows = await conn`
      UPDATE numeracion_config
      SET acta_seq = acta_seq + 1, updated_at = now()
      RETURNING acta_prefix AS prefix, acta_seq AS seq
    `;
    return `${rows[0].prefix}-${year}-${String(rows[0].seq).padStart(4, "0")}`;
  }

  const rows = await conn`
    UPDATE numeracion_config
    SET cobro_seq = cobro_seq + 1, updated_at = now()
    RETURNING cobro_prefix AS prefix, cobro_seq AS seq
  `;
  return `${rows[0].prefix}-${year}-${String(rows[0].seq).padStart(4, "0")}`;
}

export async function getClienteSnapshot(clienteId: string) {
  const rows = await sql()`
    SELECT
      id::text AS id,
      nombre,
      documento,
      telefono,
      email,
      direccion,
      ciudad
    FROM clientes
    WHERE id = ${clienteId}::uuid
    LIMIT 1
  `;
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Cliente no existe");
  }

  return {
    id: String(rows[0].id),
    nombre: String(rows[0].nombre ?? ""),
    documento: rows[0].documento ? String(rows[0].documento) : undefined,
    telefono: rows[0].telefono ? String(rows[0].telefono) : undefined,
    email: rows[0].email ? String(rows[0].email) : undefined,
    direccion: rows[0].direccion ? String(rows[0].direccion) : undefined,
    ciudad: rows[0].ciudad ? String(rows[0].ciudad) : undefined,
  };
}

export async function resolveCategoriaId(categoria: string | null | undefined) {
  const conn = sql();
  const clean = asString(categoria, "");
  if (!clean) return null;

  const found = await conn`
    SELECT id::text AS id
    FROM categorias_producto
    WHERE lower(nombre) = lower(${clean})
    LIMIT 1
  `;

  if (Array.isArray(found) && found.length > 0) {
    return String(found[0].id);
  }

  const created = await conn`
    INSERT INTO categorias_producto (nombre)
    VALUES (${clean})
    RETURNING id::text AS id
  `;

  return String(created[0].id);
}

function calcCotizacionTotals(items: any[]) {
  const normalized = toArray(items);
  const subtotal = normalized.reduce(
    (acc, item) => acc + (asNumber(item.qty, 0) * asNumber(item.precio, 0)),
    0
  );
  const iva = normalized.reduce((acc, item) => {
    const base = asNumber(item.qty, 0) * asNumber(item.precio, 0);
    return acc + (base * asNumber(item.ivaPct, 0)) / 100;
  }, 0);
  return { subtotal, iva, total: subtotal + iva };
}

function calcCobroTotals(servicios: any[]) {
  const normalized = toArray(servicios);
  const subtotal = normalized.reduce(
    (acc, item) => acc + (asNumber(item.cantidad, 0) * asNumber(item.unitario, 0)),
    0
  );
  const iva = normalized.reduce((acc, item) => {
    const base = asNumber(item.cantidad, 0) * asNumber(item.unitario, 0);
    return acc + (base * asNumber(item.ivaPct, 0)) / 100;
  }, 0);
  return { subtotal, iva, total: subtotal + iva };
}

function mapCliente(row: any) {
  return {
    id: String(row.id),
    nombre: String(row.nombre ?? ""),
    documento: row.documento ? String(row.documento) : undefined,
    telefono: row.telefono ? String(row.telefono) : undefined,
    email: row.email ? String(row.email) : undefined,
    direccion: row.direccion ? String(row.direccion) : undefined,
    ciudad: row.ciudad ? String(row.ciudad) : undefined,
    notas: row.notas ? String(row.notas) : undefined,
    estado: row.estado ? String(row.estado) : "activo",
    createdAt: String(row.createdAt ?? row.created_at ?? ""),
    updatedAt: String(row.updatedAt ?? row.updated_at ?? ""),
  };
}

export async function listClientesDb(search = "") {
  const conn = sql();

  if (!search.trim()) {
    const rows = await conn`
      SELECT
        id::text AS id,
        nombre,
        documento,
        telefono,
        email,
        direccion,
        ciudad,
        notas,
        estado,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM clientes
      ORDER BY updated_at DESC
    `;
    return rows.map(mapCliente);
  }

  const rows = await conn.unsafe(
    `
      SELECT
        id::text AS id,
        nombre,
        documento,
        telefono,
        email,
        direccion,
        ciudad,
        notas,
        estado,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM clientes
      WHERE
        nombre ILIKE $1 OR
        COALESCE(documento, '') ILIKE $1 OR
        COALESCE(telefono, '') ILIKE $1 OR
        COALESCE(email, '') ILIKE $1 OR
        COALESCE(direccion, '') ILIKE $1 OR
        COALESCE(ciudad, '') ILIKE $1
      ORDER BY updated_at DESC
    `,
    [like(search)]
  );

  return rows.map(mapCliente);
}

export async function getClienteDb(id: string) {
  const rows = await sql()`
    SELECT
      id::text AS id,
      nombre,
      documento,
      telefono,
      email,
      direccion,
      ciudad,
      notas,
      estado,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM clientes
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  return Array.isArray(rows) && rows[0] ? mapCliente(rows[0]) : null;
}

export async function createClienteDb(body: any) {
  const nombre = asString(body.nombre);
  if (!nombre) throw new Error("El nombre del cliente es obligatorio");

  const rows = await sql()`
    INSERT INTO clientes (
      nombre, documento, telefono, email, direccion, ciudad, notas, estado
    )
    VALUES (
      ${nombre},
      ${asNullableString(body.documento)},
      ${asNullableString(body.telefono)},
      ${asNullableString(body.email)},
      ${asNullableString(body.direccion)},
      ${asNullableString(body.ciudad)},
      ${asNullableString(body.notas)},
      ${asString(body.estado, "activo")}
    )
    RETURNING
      id::text AS id,
      nombre,
      documento,
      telefono,
      email,
      direccion,
      ciudad,
      notas,
      estado,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
  `;
  return mapCliente(rows[0]);
}

export async function updateClienteDb(id: string, patch: any) {
  const current = await getClienteDb(id);
  if (!current) throw new Error("Cliente no existe");

  const rows = await sql()`
    UPDATE clientes
    SET
      nombre = ${asString(patch.nombre, current.nombre)},
      documento = ${patch.documento !== undefined ? asNullableString(patch.documento) : current.documento ?? null},
      telefono = ${patch.telefono !== undefined ? asNullableString(patch.telefono) : current.telefono ?? null},
      email = ${patch.email !== undefined ? asNullableString(patch.email) : current.email ?? null},
      direccion = ${patch.direccion !== undefined ? asNullableString(patch.direccion) : current.direccion ?? null},
      ciudad = ${patch.ciudad !== undefined ? asNullableString(patch.ciudad) : current.ciudad ?? null},
      notas = ${patch.notas !== undefined ? asNullableString(patch.notas) : current.notas ?? null},
      estado = ${patch.estado !== undefined ? asString(patch.estado, "activo") : current.estado},
      updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING
      id::text AS id,
      nombre,
      documento,
      telefono,
      email,
      direccion,
      ciudad,
      notas,
      estado,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
  `;
  return mapCliente(rows[0]);
}

export async function deleteClienteDb(id: string) {
  await sql()`DELETE FROM clientes WHERE id = ${id}::uuid`;
}

function mapProducto(row: any) {
  return {
    id: String(row.id),
    nombre: String(row.nombre ?? ""),
    sku: row.sku ? String(row.sku) : undefined,
    categoria: row.categoria ? String(row.categoria) : undefined,
    marca: row.marca ? String(row.marca) : undefined,
    unidad: row.unidad ? String(row.unidad) : undefined,
    costo: money(row.costo),
    precio: money(row.precio),
    ivaPct: asNumber(row.ivaPct, 0),
    activo: row.activo === true,
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
  };
}

export async function listProductosDb(search = "") {
  const conn = sql();

  const selectSql = `
    SELECT
      p.id::text AS id,
      p.nombre,
      p.sku,
      cp.nombre AS categoria,
      p.marca,
      p.unidad,
      p.costo,
      p.precio,
      p.iva_pct AS "ivaPct",
      (p.estado = 'activo') AS activo,
      p.created_at::text AS "createdAt",
      p.updated_at::text AS "updatedAt"
    FROM productos p
    LEFT JOIN categorias_producto cp ON cp.id = p.categoria_id
  `;

  if (!search.trim()) {
    const rows = await conn.unsafe(`${selectSql} ORDER BY p.updated_at DESC`);
    return rows.map(mapProducto);
  }

  const rows = await conn.unsafe(
    `
      ${selectSql}
      WHERE
        p.nombre ILIKE $1 OR
        COALESCE(p.sku, '') ILIKE $1 OR
        COALESCE(cp.nombre, '') ILIKE $1 OR
        COALESCE(p.marca, '') ILIKE $1 OR
        COALESCE(p.unidad, '') ILIKE $1
      ORDER BY p.updated_at DESC
    `,
    [like(search)]
  );

  return rows.map(mapProducto);
}

export async function getProductoDb(id: string) {
  const rows = await sql()`
    SELECT
      p.id::text AS id,
      p.nombre,
      p.sku,
      cp.nombre AS categoria,
      p.marca,
      p.unidad,
      p.costo,
      p.precio,
      p.iva_pct AS "ivaPct",
      (p.estado = 'activo') AS activo,
      p.created_at::text AS "createdAt",
      p.updated_at::text AS "updatedAt"
    FROM productos p
    LEFT JOIN categorias_producto cp ON cp.id = p.categoria_id
    WHERE p.id = ${id}::uuid
    LIMIT 1
  `;
  return Array.isArray(rows) && rows[0] ? mapProducto(rows[0]) : null;
}

export async function createProductoDb(body: any) {
  const nombre = asString(body.nombre);
  if (!nombre) throw new Error("El nombre del producto es obligatorio");

  const categoriaId = await resolveCategoriaId(body.categoria);

  const rows = await sql()`
    INSERT INTO productos (
      nombre, sku, categoria_id, marca, unidad, costo, precio, iva_pct, estado
    )
    VALUES (
      ${nombre},
      ${asNullableString(body.sku)},
      ${categoriaId ? categoriaId : null},
      ${asNullableString(body.marca)},
      ${asNullableString(body.unidad) || "unidad"},
      ${String(asNumber(body.costo, 0))},
      ${String(asNumber(body.precio, 0))},
      ${asNumber(body.ivaPct, 19)},
      ${asBoolean(body.activo, true) ? "activo" : "inactivo"}
    )
    RETURNING id::text AS id
  `;

  return await getProductoDb(String(rows[0].id));
}

export async function updateProductoDb(id: string, patch: any) {
  const current = await getProductoDb(id);
  if (!current) throw new Error("Producto no existe");

  const categoriaId =
    patch.categoria !== undefined
      ? await resolveCategoriaId(patch.categoria)
      : await resolveCategoriaId(current.categoria);

  await sql()`
    UPDATE productos
    SET
      nombre = ${patch.nombre !== undefined ? asString(patch.nombre, current.nombre) : current.nombre},
      sku = ${patch.sku !== undefined ? asNullableString(patch.sku) : current.sku ?? null},
      categoria_id = ${categoriaId ? categoriaId : null},
      marca = ${patch.marca !== undefined ? asNullableString(patch.marca) : current.marca ?? null},
      unidad = ${patch.unidad !== undefined ? asNullableString(patch.unidad) : current.unidad ?? "unidad"},
      costo = ${String(patch.costo !== undefined ? asNumber(patch.costo, 0) : current.costo ?? 0)},
      precio = ${String(patch.precio !== undefined ? asNumber(patch.precio, 0) : current.precio ?? 0)},
      iva_pct = ${patch.ivaPct !== undefined ? asNumber(patch.ivaPct, 19) : current.ivaPct ?? 19},
      estado = ${patch.activo !== undefined ? (asBoolean(patch.activo, true) ? "activo" : "inactivo") : (current.activo ? "activo" : "inactivo")},
      updated_at = now()
    WHERE id = ${id}::uuid
  `;

  return await getProductoDb(id);
}

export async function deleteProductoDb(id: string) {
  await sql()`DELETE FROM productos WHERE id = ${id}::uuid`;
}

function mapCotizacionItem(row: any) {
  return {
    id: String(row.id),
    kind: String(row.kind ?? "servicio"),
    refId: row.refId ? String(row.refId) : undefined,
    nombre: String(row.nombre ?? ""),
    unidad: row.unidad ? String(row.unidad) : undefined,
    qty: asNumber(row.qty, 0),
    precio: money(row.precio),
    ivaPct: asNumber(row.ivaPct, 0),
    costo: row.costo !== null && row.costo !== undefined ? money(row.costo) : undefined,
  };
}

async function getCotizacionItems(cotizacionId: string) {
  const rows = await sql()`
    SELECT
      id::text AS id,
      kind,
      ref_id::text AS "refId",
      nombre,
      unidad,
      qty,
      precio,
      iva_pct AS "ivaPct",
      costo
    FROM cotizacion_items
    WHERE cotizacion_id = ${cotizacionId}::uuid
    ORDER BY orden ASC, nombre ASC
  `;
  return rows.map(mapCotizacionItem);
}

function mapCotizacionBase(row: any, items: any[]) {
  return {
    id: String(row.id),
    numero: String(row.numero ?? ""),
    version: asNumber(row.version, 1),
    parentId: row.parentId ? String(row.parentId) : undefined,
    fecha: rowTextDate(row.fecha),
    vigenciaDias: asNumber(row.vigenciaDias, 15),
    status: String(row.status ?? "borrador"),
    clienteId: String(row.clienteId),
    cliente: {
      id: String(row.clienteId),
      nombre: String(row.clienteNombre ?? ""),
      documento: row.clienteDocumento ? String(row.clienteDocumento) : undefined,
      telefono: row.clienteTelefono ? String(row.clienteTelefono) : undefined,
      email: row.clienteEmail ? String(row.clienteEmail) : undefined,
      direccion: row.clienteDireccion ? String(row.clienteDireccion) : undefined,
      ciudad: row.clienteCiudad ? String(row.clienteCiudad) : undefined,
    },
    asunto: row.asunto ? String(row.asunto) : undefined,
    condiciones: row.condiciones ? String(row.condiciones) : undefined,
    notas: row.notas ? String(row.notas) : undefined,
    items,
    subtotal: money(row.subtotal),
    iva: money(row.iva),
    total: money(row.total),
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
  };
}

export async function listCotizacionesDb(search = "") {
  const conn = sql();
  const baseSql = `
    SELECT
      c.id::text AS id,
      c.numero,
      c.version,
      c.parent_id::text AS "parentId",
      c.fecha::text AS fecha,
      c.vigencia_dias AS "vigenciaDias",
      c.status,
      c.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      c.asunto,
      c.condiciones,
      c.notas,
      c.subtotal,
      c.iva,
      c.total,
      c.created_at::text AS "createdAt",
      c.updated_at::text AS "updatedAt"
    FROM cotizaciones c
    LEFT JOIN clientes cl ON cl.id = c.cliente_id
  `;

  const rows = !search.trim()
    ? await conn.unsafe(`${baseSql} ORDER BY c.updated_at DESC`)
    : await conn.unsafe(
        `
          ${baseSql}
          WHERE
            c.numero ILIKE $1 OR
            COALESCE(cl.nombre, '') ILIKE $1 OR
            COALESCE(c.status, '') ILIKE $1 OR
            COALESCE(c.asunto, '') ILIKE $1
          ORDER BY c.updated_at DESC
        `,
        [like(search)]
      );

  const result = [];
  for (const row of rows) {
    const items = await getCotizacionItems(String(row.id));
    result.push(mapCotizacionBase(row, items));
  }
  return result;
}

export async function getCotizacionDb(id: string) {
  const rows = await sql()`
    SELECT
      c.id::text AS id,
      c.numero,
      c.version,
      c.parent_id::text AS "parentId",
      c.fecha::text AS fecha,
      c.vigencia_dias AS "vigenciaDias",
      c.status,
      c.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      c.asunto,
      c.condiciones,
      c.notas,
      c.subtotal,
      c.iva,
      c.total,
      c.created_at::text AS "createdAt",
      c.updated_at::text AS "updatedAt"
    FROM cotizaciones c
    LEFT JOIN clientes cl ON cl.id = c.cliente_id
    WHERE c.id = ${id}::uuid
    LIMIT 1
  `;

  if (!Array.isArray(rows) || rows.length === 0) return null;
  const items = await getCotizacionItems(id);
  return mapCotizacionBase(rows[0], items);
}

export async function createCotizacionDb(body: any) {
  const clienteId = asString(body.clienteId);
  if (!clienteId) throw new Error("clienteId es obligatorio");

  const cliente = await getClienteSnapshot(clienteId);
  const items = toArray(body.items);
  const totals = calcCotizacionTotals(items);
  const numero = await nextDocumentNumber("cotizacion");

  const insertedId = await sql().begin(async (tx) => {
    const head = await tx`
      INSERT INTO cotizaciones (
        numero, version, parent_id, fecha, vigencia_dias, status, cliente_id,
        asunto, condiciones, notas, subtotal, iva, total
      )
      VALUES (
        ${numero},
        ${asNumber(body.version, 1)},
        ${asNullableString(body.parentId)},
        ${toIsoDate(body.fecha)},
        ${asNumber(body.vigenciaDias, 15)},
        ${asString(body.status, "borrador")},
        ${clienteId}::uuid,
        ${asNullableString(body.asunto)},
        ${asNullableString(body.condiciones)},
        ${asNullableString(body.notas)},
        ${String(totals.subtotal)},
        ${String(totals.iva)},
        ${String(totals.total)}
      )
      RETURNING id::text AS id
    `;

    const cotizacionId = String(head[0].id);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await tx`
        INSERT INTO cotizacion_items (
          cotizacion_id, kind, ref_id, nombre, unidad, qty, precio, iva_pct, costo, orden
        )
        VALUES (
          ${cotizacionId}::uuid,
          ${asString(item.kind, "servicio")},
          ${asNullableString(item.refId)},
          ${asString(item.nombre)},
          ${asNullableString(item.unidad)},
          ${asNumber(item.qty, 1)},
          ${String(asNumber(item.precio, 0))},
          ${asNumber(item.ivaPct, 0)},
          ${item.costo !== undefined ? String(asNumber(item.costo, 0)) : null},
          ${i}
        )
      `;
    }

    return cotizacionId;
  });

  return await getCotizacionDb(insertedId);
}

export async function updateCotizacionDb(id: string, patch: any) {
  const current = await getCotizacionDb(id);
  if (!current) throw new Error("Cotización no existe");

  const clienteId = patch.clienteId !== undefined ? asString(patch.clienteId) : current.clienteId;
  const items = patch.items !== undefined ? toArray(patch.items) : current.items;
  const totals = calcCotizacionTotals(items);

  await sql().begin(async (tx) => {
    await tx`
      UPDATE cotizaciones
      SET
        fecha = ${toIsoDate(patch.fecha, current.fecha)},
        vigencia_dias = ${patch.vigenciaDias !== undefined ? asNumber(patch.vigenciaDias, 15) : current.vigenciaDias},
        status = ${patch.status !== undefined ? asString(patch.status, current.status) : current.status},
        cliente_id = ${clienteId}::uuid,
        asunto = ${patch.asunto !== undefined ? asNullableString(patch.asunto) : current.asunto ?? null},
        condiciones = ${patch.condiciones !== undefined ? asNullableString(patch.condiciones) : current.condiciones ?? null},
        notas = ${patch.notas !== undefined ? asNullableString(patch.notas) : current.notas ?? null},
        subtotal = ${String(totals.subtotal)},
        iva = ${String(totals.iva)},
        total = ${String(totals.total)},
        updated_at = now()
      WHERE id = ${id}::uuid
    `;

    if (patch.items !== undefined) {
      await tx`DELETE FROM cotizacion_items WHERE cotizacion_id = ${id}::uuid`;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await tx`
          INSERT INTO cotizacion_items (
            cotizacion_id, kind, ref_id, nombre, unidad, qty, precio, iva_pct, costo, orden
          )
          VALUES (
            ${id}::uuid,
            ${asString(item.kind, "servicio")},
            ${asNullableString(item.refId)},
            ${asString(item.nombre)},
            ${asNullableString(item.unidad)},
            ${asNumber(item.qty, 1)},
            ${String(asNumber(item.precio, 0))},
            ${asNumber(item.ivaPct, 0)},
            ${item.costo !== undefined ? String(asNumber(item.costo, 0)) : null},
            ${i}
          )
        `;
      }
    }
  });

  return await getCotizacionDb(id);
}

export async function deleteCotizacionDb(id: string) {
  await sql()`DELETE FROM cotizaciones WHERE id = ${id}::uuid`;
}

export async function versionarCotizacionDb(id: string) {
  const base = await getCotizacionDb(id);
  if (!base) throw new Error("Cotización base no encontrada");

  return await createCotizacionDb({
    ...base,
    clienteId: base.clienteId,
    version: asNumber(base.version, 1) + 1,
    parentId: base.parentId || base.id,
    status: "borrador",
    fecha: new Date().toISOString().slice(0, 10),
    items: base.items.map((item: any) => ({
      ...item,
      id: undefined,
    })),
  });
}

function mapPlantilla(row: any) {
  return {
    id: String(row.id),
    nombre: String(row.nombre ?? ""),
    cuerpo: String(row.cuerpo ?? ""),
    activo: row.activo === true,
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
  };
}

export async function listPlantillasDb(search = "") {
  const conn = sql();
  const rows = !search.trim()
    ? await conn`
        SELECT
          id::text AS id,
          nombre,
          cuerpo,
          activo,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
        FROM cotizacion_plantillas
        ORDER BY updated_at DESC
      `
    : await conn.unsafe(
        `
          SELECT
            id::text AS id,
            nombre,
            cuerpo,
            activo,
            created_at::text AS "createdAt",
            updated_at::text AS "updatedAt"
          FROM cotizacion_plantillas
          WHERE nombre ILIKE $1 OR cuerpo ILIKE $1
          ORDER BY updated_at DESC
        `,
        [like(search)]
      );
  return rows.map(mapPlantilla);
}

export async function getPlantillaDb(id: string) {
  const rows = await sql()`
    SELECT
      id::text AS id,
      nombre,
      cuerpo,
      activo,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM cotizacion_plantillas
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  return Array.isArray(rows) && rows[0] ? mapPlantilla(rows[0]) : null;
}

export async function createPlantillaDb(body: any) {
  const nombre = asString(body.nombre);
  const cuerpo = asString(body.cuerpo);
  if (!nombre || !cuerpo) throw new Error("nombre y cuerpo son obligatorios");

  const rows = await sql()`
    INSERT INTO cotizacion_plantillas (nombre, cuerpo, activo)
    VALUES (${nombre}, ${cuerpo}, ${asBoolean(body.activo, true)})
    RETURNING id::text AS id
  `;
  return await getPlantillaDb(String(rows[0].id));
}

export async function updatePlantillaDb(id: string, patch: any) {
  const current = await getPlantillaDb(id);
  if (!current) throw new Error("Plantilla no existe");

  await sql()`
    UPDATE cotizacion_plantillas
    SET
      nombre = ${patch.nombre !== undefined ? asString(patch.nombre, current.nombre) : current.nombre},
      cuerpo = ${patch.cuerpo !== undefined ? asString(patch.cuerpo, current.cuerpo) : current.cuerpo},
      activo = ${patch.activo !== undefined ? asBoolean(patch.activo, true) : current.activo},
      updated_at = now()
    WHERE id = ${id}::uuid
  `;

  return await getPlantillaDb(id);
}

export async function deletePlantillaDb(id: string) {
  await sql()`DELETE FROM cotizacion_plantillas WHERE id = ${id}::uuid`;
}

function mapOrden(row: any) {
  return {
    id: String(row.id),
    numero: String(row.numero ?? ""),
    fechaCreacion: rowTextDate(row.createdAt || row.created_at),
    fechaProgramada: row.fechaProgramada ? rowTextDate(row.fechaProgramada) : undefined,
    status: String(row.status ?? "pendiente"),
    clienteId: String(row.clienteId ?? ""),
    cliente: {
      id: String(row.clienteId ?? ""),
      nombre: String(row.clienteNombre ?? ""),
      documento: row.clienteDocumento ? String(row.clienteDocumento) : undefined,
      telefono: row.clienteTelefono ? String(row.clienteTelefono) : undefined,
      email: row.clienteEmail ? String(row.clienteEmail) : undefined,
      direccion: row.clienteDireccion ? String(row.clienteDireccion) : undefined,
      ciudad: row.clienteCiudad ? String(row.clienteCiudad) : undefined,
    },
    cotizacionId: row.cotizacionId ? String(row.cotizacionId) : undefined,
    asunto: row.asunto ? String(row.asunto) : undefined,
    direccionServicio: row.direccionServicio ? String(row.direccionServicio) : undefined,
    observaciones: row.observaciones ? String(row.observaciones) : undefined,
    tecnicoId: row.tecnicoId ? String(row.tecnicoId) : undefined,
    tecnico: row.tecnicoNombre ? { id: String(row.tecnicoId ?? ""), nombre: String(row.tecnicoNombre) } : undefined,
    checklistTemplateId: undefined,
    checklist: Array.isArray(row.checklist) ? row.checklist : [],
    evidencias: Array.isArray(row.evidencias) ? row.evidencias : [],
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
  };
}

export async function listOrdenesDb(search = "") {
  const conn = sql();
  const baseSql = `
    SELECT
      o.id::text AS id,
      o.numero,
      o.cotizacion_id::text AS "cotizacionId",
      o.fecha_programada::text AS "fechaProgramada",
      o.estado AS status,
      o.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      o.asunto,
      o.direccion_servicio AS "direccionServicio",
      o.notas AS observaciones,
      o.tecnico_id AS "tecnicoId",
      o.tecnico AS "tecnicoNombre",
      o.checklist,
      o.evidencias,
      o.created_at::text AS "createdAt",
      o.updated_at::text AS "updatedAt"
    FROM ordenes o
    LEFT JOIN clientes cl ON cl.id = o.cliente_id
  `;

  const rows = !search.trim()
    ? await conn.unsafe(`${baseSql} ORDER BY o.updated_at DESC`)
    : await conn.unsafe(
        `
          ${baseSql}
          WHERE
            o.numero ILIKE $1 OR
            COALESCE(cl.nombre, '') ILIKE $1 OR
            COALESCE(o.estado, '') ILIKE $1 OR
            COALESCE(o.asunto, '') ILIKE $1 OR
            COALESCE(o.tecnico, '') ILIKE $1
          ORDER BY o.updated_at DESC
        `,
        [like(search)]
      );

  return rows.map(mapOrden);
}

export async function getOrdenDb(id: string) {
  const rows = await sql()`
    SELECT
      o.id::text AS id,
      o.numero,
      o.cotizacion_id::text AS "cotizacionId",
      o.fecha_programada::text AS "fechaProgramada",
      o.estado AS status,
      o.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      o.asunto,
      o.direccion_servicio AS "direccionServicio",
      o.notas AS observaciones,
      o.tecnico_id AS "tecnicoId",
      o.tecnico AS "tecnicoNombre",
      o.checklist,
      o.evidencias,
      o.created_at::text AS "createdAt",
      o.updated_at::text AS "updatedAt"
    FROM ordenes o
    LEFT JOIN clientes cl ON cl.id = o.cliente_id
    WHERE o.id = ${id}::uuid
    LIMIT 1
  `;
  return Array.isArray(rows) && rows[0] ? mapOrden(rows[0]) : null;
}

export async function createOrdenDb(body: any) {
  const clienteId = asString(body.clienteId);
  if (!clienteId) throw new Error("clienteId es obligatorio");

  const numero = await nextDocumentNumber("orden");

  const rows = await sql()`
    INSERT INTO ordenes (
      numero, cliente_id, cotizacion_id, fecha, fecha_programada, estado,
      tecnico, tecnico_id, checklist, evidencias, notas, asunto, direccion_servicio
    )
    VALUES (
      ${numero},
      ${clienteId}::uuid,
      ${asNullableString(body.cotizacionId)},
      ${toIsoDate(body.fechaProgramada || body.fechaCreacion)},
      ${toIsoDate(body.fechaProgramada || body.fechaCreacion)},
      ${asString(body.status, "pendiente")},
      ${asNullableString(body?.tecnico?.nombre ?? body.tecnicoNombre)},
      ${asNullableString(body.tecnicoId ?? body?.tecnico?.id)},
      ${JSON.stringify(toArray(body.checklist))}::jsonb,
      ${JSON.stringify(toArray(body.evidencias))}::jsonb,
      ${asNullableString(body.observaciones)},
      ${asNullableString(body.asunto)},
      ${asNullableString(body.direccionServicio)}
    )
    RETURNING id::text AS id
  `;

  return await getOrdenDb(String(rows[0].id));
}

export async function updateOrdenDb(id: string, patch: any) {
  const current = await getOrdenDb(id);
  if (!current) throw new Error("Orden no existe");

  await sql()`
    UPDATE ordenes
    SET
      cliente_id = ${patch.clienteId !== undefined ? asString(patch.clienteId) : current.clienteId}::uuid,
      cotizacion_id = ${patch.cotizacionId !== undefined ? asNullableString(patch.cotizacionId) : current.cotizacionId ?? null},
      fecha = ${toIsoDate(patch.fechaProgramada || current.fechaProgramada || current.fechaCreacion)},
      fecha_programada = ${toIsoDate(patch.fechaProgramada || current.fechaProgramada || current.fechaCreacion)},
      estado = ${patch.status !== undefined ? asString(patch.status, current.status) : current.status},
      tecnico = ${patch.tecnico !== undefined ? asNullableString(patch?.tecnico?.nombre ?? patch.tecnico) : (current.tecnico?.nombre ?? null)},
      tecnico_id = ${patch.tecnicoId !== undefined ? asNullableString(patch.tecnicoId) : (current.tecnicoId ?? null)},
      checklist = ${JSON.stringify(patch.checklist !== undefined ? toArray(patch.checklist) : current.checklist)}::jsonb,
      evidencias = ${JSON.stringify(patch.evidencias !== undefined ? toArray(patch.evidencias) : current.evidencias)}::jsonb,
      notas = ${patch.observaciones !== undefined ? asNullableString(patch.observaciones) : current.observaciones ?? null},
      asunto = ${patch.asunto !== undefined ? asNullableString(patch.asunto) : current.asunto ?? null},
      direccion_servicio = ${patch.direccionServicio !== undefined ? asNullableString(patch.direccionServicio) : current.direccionServicio ?? null},
      updated_at = now()
    WHERE id = ${id}::uuid
  `;

  return await getOrdenDb(id);
}

export async function deleteOrdenDb(id: string) {
  await sql()`DELETE FROM ordenes WHERE id = ${id}::uuid`;
}

function mapActaActivo(row: any) {
  return {
    id: String(row.id),
    tipo: row.tipo ? String(row.tipo) : "otro",
    descripcion: String(row.descripcion ?? ""),
    cantidad: asNumber(row.cantidad, 1),
    serial: row.serial ? String(row.serial) : undefined,
    ubicacion: row.ubicacion ? String(row.ubicacion) : undefined,
    notas: row.notas ? String(row.notas) : undefined,
  };
}

async function getActaActivos(actaId: string) {
  const rows = await sql()`
    SELECT
      id::text AS id,
      tipo,
      descripcion,
      cantidad,
      serial,
      ubicacion,
      notas
    FROM acta_activos
    WHERE acta_id = ${actaId}::uuid
    ORDER BY descripcion ASC
  `;
  return rows.map(mapActaActivo);
}

function mapActaBase(row: any, activos: any[]) {
  return {
    id: String(row.id),
    numero: String(row.numero ?? ""),
    clienteId: String(row.clienteId ?? ""),
    cliente: {
      id: String(row.clienteId ?? ""),
      nombre: String(row.clienteNombre ?? ""),
      documento: row.clienteDocumento ? String(row.clienteDocumento) : undefined,
      telefono: row.clienteTelefono ? String(row.clienteTelefono) : undefined,
      email: row.clienteEmail ? String(row.clienteEmail) : undefined,
      direccion: row.clienteDireccion ? String(row.clienteDireccion) : undefined,
      ciudad: row.clienteCiudad ? String(row.clienteCiudad) : undefined,
    },
    fecha: rowTextDate(row.fecha),
    lugar: row.lugar ? String(row.lugar) : undefined,
    ordenId: row.ordenId ? String(row.ordenId) : undefined,
    responsables: {
      tecnico: row.tecnico ? String(row.tecnico) : undefined,
      clienteRecibe: row.recibe ? String(row.recibe) : undefined,
      documentoRecibe: row.documentoRecibe ? String(row.documentoRecibe) : undefined,
    },
    activos,
    observaciones: row.observaciones ? String(row.observaciones) : undefined,
    firmaClienteDataUrl: row.firmaCliente ? String(row.firmaCliente) : undefined,
    status: String(row.status ?? "borrador"),
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
  };
}

export async function listActasDb(search = "") {
  const conn = sql();
  const baseSql = `
    SELECT
      a.id::text AS id,
      a.numero,
      a.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      a.fecha::text AS fecha,
      a.lugar,
      a.orden_id::text AS "ordenId",
      a.tecnico,
      a.recibe,
      a.documento_recibe AS "documentoRecibe",
      a.observaciones,
      a.firma_cliente AS "firmaCliente",
      a.estado AS status,
      a.created_at::text AS "createdAt",
      a.updated_at::text AS "updatedAt"
    FROM actas a
    LEFT JOIN clientes cl ON cl.id = a.cliente_id
  `;

  const rows = !search.trim()
    ? await conn.unsafe(`${baseSql} ORDER BY a.updated_at DESC`)
    : await conn.unsafe(
        `
          ${baseSql}
          WHERE
            a.numero ILIKE $1 OR
            COALESCE(cl.nombre, '') ILIKE $1 OR
            COALESCE(a.estado, '') ILIKE $1 OR
            COALESCE(a.lugar, '') ILIKE $1
          ORDER BY a.updated_at DESC
        `,
        [like(search)]
      );

  const result = [];
  for (const row of rows) {
    const activos = await getActaActivos(String(row.id));
    result.push(mapActaBase(row, activos));
  }
  return result;
}

export async function getActaDb(id: string) {
  const rows = await sql()`
    SELECT
      a.id::text AS id,
      a.numero,
      a.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      a.fecha::text AS fecha,
      a.lugar,
      a.orden_id::text AS "ordenId",
      a.tecnico,
      a.recibe,
      a.documento_recibe AS "documentoRecibe",
      a.observaciones,
      a.firma_cliente AS "firmaCliente",
      a.estado AS status,
      a.created_at::text AS "createdAt",
      a.updated_at::text AS "updatedAt"
    FROM actas a
    LEFT JOIN clientes cl ON cl.id = a.cliente_id
    WHERE a.id = ${id}::uuid
    LIMIT 1
  `;

  if (!Array.isArray(rows) || rows.length === 0) return null;
  const activos = await getActaActivos(id);
  return mapActaBase(rows[0], activos);
}

export async function createActaDb(body: any) {
  const clienteId = asString(body.clienteId);
  if (!clienteId) throw new Error("clienteId es obligatorio");

  const numero = await nextDocumentNumber("acta");
  const activos = toArray(body.activos);

  const insertedId = await sql().begin(async (tx) => {
    const rows = await tx`
      INSERT INTO actas (
        numero, cliente_id, orden_id, fecha, lugar, estado,
        tecnico, recibe, documento_recibe, observaciones, firma_cliente
      )
      VALUES (
        ${numero},
        ${clienteId}::uuid,
        ${asNullableString(body.ordenId)},
        ${toIsoDate(body.fecha)},
        ${asNullableString(body.lugar)},
        ${asString(body.status, "borrador")},
        ${asNullableString(body?.responsables?.tecnico)},
        ${asNullableString(body?.responsables?.clienteRecibe)},
        ${asNullableString(body?.responsables?.documentoRecibe)},
        ${asNullableString(body.observaciones)},
        ${asNullableString(body.firmaClienteDataUrl)}
      )
      RETURNING id::text AS id
    `;

    const actaId = String(rows[0].id);

    for (const item of activos) {
      await tx`
        INSERT INTO acta_activos (
          acta_id, tipo, descripcion, cantidad, serial, ubicacion, notas
        )
        VALUES (
          ${actaId}::uuid,
          ${asNullableString(item.tipo)},
          ${asString(item.descripcion)},
          ${asNumber(item.cantidad, 1)},
          ${asNullableString(item.serial)},
          ${asNullableString(item.ubicacion)},
          ${asNullableString(item.notas)}
        )
      `;
    }

    return actaId;
  });

  return await getActaDb(insertedId);
}

export async function updateActaDb(id: string, patch: any) {
  const current = await getActaDb(id);
  if (!current) throw new Error("Acta no existe");

  const activos = patch.activos !== undefined ? toArray(patch.activos) : current.activos;

  await sql().begin(async (tx) => {
    await tx`
      UPDATE actas
      SET
        cliente_id = ${patch.clienteId !== undefined ? asString(patch.clienteId) : current.clienteId}::uuid,
        orden_id = ${patch.ordenId !== undefined ? asNullableString(patch.ordenId) : current.ordenId ?? null},
        fecha = ${toIsoDate(patch.fecha || current.fecha)},
        lugar = ${patch.lugar !== undefined ? asNullableString(patch.lugar) : current.lugar ?? null},
        estado = ${patch.status !== undefined ? asString(patch.status, current.status) : current.status},
        tecnico = ${patch.responsables !== undefined ? asNullableString(patch?.responsables?.tecnico) : (current?.responsables?.tecnico ?? null)},
        recibe = ${patch.responsables !== undefined ? asNullableString(patch?.responsables?.clienteRecibe) : (current?.responsables?.clienteRecibe ?? null)},
        documento_recibe = ${patch.responsables !== undefined ? asNullableString(patch?.responsables?.documentoRecibe) : (current?.responsables?.documentoRecibe ?? null)},
        observaciones = ${patch.observaciones !== undefined ? asNullableString(patch.observaciones) : current.observaciones ?? null},
        firma_cliente = ${patch.firmaClienteDataUrl !== undefined ? asNullableString(patch.firmaClienteDataUrl) : current.firmaClienteDataUrl ?? null},
        updated_at = now()
      WHERE id = ${id}::uuid
    `;

    if (patch.activos !== undefined) {
      await tx`DELETE FROM acta_activos WHERE acta_id = ${id}::uuid`;
      for (const item of activos) {
        await tx`
          INSERT INTO acta_activos (
            acta_id, tipo, descripcion, cantidad, serial, ubicacion, notas
          )
          VALUES (
            ${id}::uuid,
            ${asNullableString(item.tipo)},
            ${asString(item.descripcion)},
            ${asNumber(item.cantidad, 1)},
            ${asNullableString(item.serial)},
            ${asNullableString(item.ubicacion)},
            ${asNullableString(item.notas)}
          )
        `;
      }
    }
  });

  return await getActaDb(id);
}

export async function deleteActaDb(id: string) {
  await sql()`DELETE FROM actas WHERE id = ${id}::uuid`;
}

function mapServicioCobro(row: any) {
  return {
    id: String(row.id),
    descripcion: String(row.concepto ?? ""),
    cantidad: asNumber(row.qty, 1),
    unitario: money(row.precio),
    ivaPct: asNumber(row.ivaPct, 0),
  };
}

async function getCobroItems(cobroId: string) {
  const rows = await sql()`
    SELECT
      id::text AS id,
      concepto,
      qty,
      precio,
      iva_pct AS "ivaPct"
    FROM cuenta_cobro_items
    WHERE cuenta_cobro_id = ${cobroId}::uuid
    ORDER BY concepto ASC
  `;
  return rows.map(mapServicioCobro);
}

function mapCobroBase(row: any, servicios: any[]) {
  return {
    id: String(row.id),
    numero: String(row.numero ?? ""),
    clienteId: String(row.clienteId),
    cliente: {
      id: String(row.clienteId),
      nombre: String(row.clienteNombre ?? ""),
      documento: row.clienteDocumento ? String(row.clienteDocumento) : undefined,
      telefono: row.clienteTelefono ? String(row.clienteTelefono) : undefined,
      email: row.clienteEmail ? String(row.clienteEmail) : undefined,
      direccion: row.clienteDireccion ? String(row.clienteDireccion) : undefined,
      ciudad: row.clienteCiudad ? String(row.clienteCiudad) : undefined,
    },
    fechaEmision: rowTextDate(row.fechaEmision),
    fechaVencimiento: row.fechaVencimiento ? rowTextDate(row.fechaVencimiento) : rowTextDate(row.fechaEmision),
    status: String(row.status ?? "pendiente"),
    servicios,
    observaciones: row.observaciones ? String(row.observaciones) : undefined,
    subtotal: money(row.subtotal),
    iva: money(row.iva),
    total: money(row.total),
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
  };
}

export async function listCobrosDb(search = "") {
  const conn = sql();
  const baseSql = `
    SELECT
      c.id::text AS id,
      c.numero,
      c.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      c.fecha::text AS "fechaEmision",
      c.fecha_vencimiento::text AS "fechaVencimiento",
      c.estado AS status,
      c.notas AS observaciones,
      c.subtotal,
      c.iva,
      c.total,
      c.created_at::text AS "createdAt",
      c.updated_at::text AS "updatedAt"
    FROM cuentas_cobro c
    LEFT JOIN clientes cl ON cl.id = c.cliente_id
  `;

  const rows = !search.trim()
    ? await conn.unsafe(`${baseSql} ORDER BY c.updated_at DESC`)
    : await conn.unsafe(
        `
          ${baseSql}
          WHERE
            c.numero ILIKE $1 OR
            COALESCE(cl.nombre, '') ILIKE $1 OR
            COALESCE(c.estado, '') ILIKE $1 OR
            COALESCE(c.notas, '') ILIKE $1
          ORDER BY c.updated_at DESC
        `,
        [like(search)]
      );

  const result = [];
  for (const row of rows) {
    const servicios = await getCobroItems(String(row.id));
    result.push(mapCobroBase(row, servicios));
  }
  return result;
}

export async function getCobroDb(id: string) {
  const rows = await sql()`
    SELECT
      c.id::text AS id,
      c.numero,
      c.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      c.fecha::text AS "fechaEmision",
      c.fecha_vencimiento::text AS "fechaVencimiento",
      c.estado AS status,
      c.notas AS observaciones,
      c.subtotal,
      c.iva,
      c.total,
      c.created_at::text AS "createdAt",
      c.updated_at::text AS "updatedAt"
    FROM cuentas_cobro c
    LEFT JOIN clientes cl ON cl.id = c.cliente_id
    WHERE c.id = ${id}::uuid
    LIMIT 1
  `;

  if (!Array.isArray(rows) || rows.length === 0) return null;
  const servicios = await getCobroItems(id);
  return mapCobroBase(rows[0], servicios);
}

export async function createCobroDb(body: any) {
  const clienteId = asString(body.clienteId);
  if (!clienteId) throw new Error("clienteId es obligatorio");

  const servicios = toArray(body.servicios);
  const totals = calcCobroTotals(servicios);
  const numero = await nextDocumentNumber("cobro");

  const insertedId = await sql().begin(async (tx) => {
    const head = await tx`
      INSERT INTO cuentas_cobro (
        numero, cliente_id, fecha, fecha_vencimiento, estado, referencia, notas,
        subtotal, iva, total
      )
      VALUES (
        ${numero},
        ${clienteId}::uuid,
        ${toIsoDate(body.fechaEmision)},
        ${toIsoDate(body.fechaVencimiento, toIsoDate(body.fechaEmision))},
        ${asString(body.status, "pendiente")},
        ${null},
        ${asNullableString(body.observaciones)},
        ${String(totals.subtotal)},
        ${String(totals.iva)},
        ${String(totals.total)}
      )
      RETURNING id::text AS id
    `;

    const cobroId = String(head[0].id);

    for (const item of servicios) {
      await tx`
        INSERT INTO cuenta_cobro_items (
          cuenta_cobro_id, concepto, qty, precio, iva_pct
        )
        VALUES (
          ${cobroId}::uuid,
          ${asString(item.descripcion)},
          ${asNumber(item.cantidad, 1)},
          ${String(asNumber(item.unitario, 0))},
          ${asNumber(item.ivaPct, 0)}
        )
      `;
    }

    return cobroId;
  });

  return await getCobroDb(insertedId);
}

export async function updateCobroDb(id: string, patch: any) {
  const current = await getCobroDb(id);
  if (!current) throw new Error("Cuenta de cobro no existe");

  const servicios = patch.servicios !== undefined ? toArray(patch.servicios) : current.servicios;
  const totals = calcCobroTotals(servicios);

  await sql().begin(async (tx) => {
    await tx`
      UPDATE cuentas_cobro
      SET
        cliente_id = ${patch.clienteId !== undefined ? asString(patch.clienteId) : current.clienteId}::uuid,
        fecha = ${toIsoDate(patch.fechaEmision || current.fechaEmision)},
        fecha_vencimiento = ${toIsoDate(patch.fechaVencimiento || current.fechaVencimiento)},
        estado = ${patch.status !== undefined ? asString(patch.status, current.status) : current.status},
        notas = ${patch.observaciones !== undefined ? asNullableString(patch.observaciones) : current.observaciones ?? null},
        subtotal = ${String(totals.subtotal)},
        iva = ${String(totals.iva)},
        total = ${String(totals.total)},
        updated_at = now()
      WHERE id = ${id}::uuid
    `;

    if (patch.servicios !== undefined) {
      await tx`DELETE FROM cuenta_cobro_items WHERE cuenta_cobro_id = ${id}::uuid`;
      for (const item of servicios) {
        await tx`
          INSERT INTO cuenta_cobro_items (
            cuenta_cobro_id, concepto, qty, precio, iva_pct
          )
          VALUES (
            ${id}::uuid,
            ${asString(item.descripcion)},
            ${asNumber(item.cantidad, 1)},
            ${String(asNumber(item.unitario, 0))},
            ${asNumber(item.ivaPct, 0)}
          )
        `;
      }
    }
  });

  return await getCobroDb(id);
}

export async function deleteCobroDb(id: string) {
  await sql()`DELETE FROM cuentas_cobro WHERE id = ${id}::uuid`;
}

function mapPago(row: any) {
  return {
    id: String(row.id),
    fecha: rowTextDate(row.fecha),
    clienteId: row.clienteId ? String(row.clienteId) : "",
    cliente: {
      id: row.clienteId ? String(row.clienteId) : "",
      nombre: row.clienteNombre ? String(row.clienteNombre) : "",
      documento: row.clienteDocumento ? String(row.clienteDocumento) : undefined,
      telefono: row.clienteTelefono ? String(row.clienteTelefono) : undefined,
      email: row.clienteEmail ? String(row.clienteEmail) : undefined,
      direccion: row.clienteDireccion ? String(row.clienteDireccion) : undefined,
      ciudad: row.clienteCiudad ? String(row.clienteCiudad) : undefined,
    },
    cobroId: row.cobroId ? String(row.cobroId) : undefined,
    referencia: row.referencia ? String(row.referencia) : undefined,
    metodo: row.metodo ? String(row.metodo) : "otro",
    valor: money(row.valor),
    notas: row.notas ? String(row.notas) : undefined,
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? row.createdAt ?? ""),
  };
}

export async function listPagosDb(search = "") {
  const conn = sql();
  const baseSql = `
    SELECT
      p.id::text AS id,
      p.fecha::text AS fecha,
      p.cliente_id::text AS "clienteId",
      cl.nombre AS "clienteNombre",
      cl.documento AS "clienteDocumento",
      cl.telefono AS "clienteTelefono",
      cl.email AS "clienteEmail",
      cl.direccion AS "clienteDireccion",
      cl.ciudad AS "clienteCiudad",
      p.cuenta_cobro_id::text AS "cobroId",
      p.referencia,
      p.metodo,
      p.valor,
      p.notas,
      p.created_at::text AS "createdAt",
      COALESCE(p.updated_at, p.created_at)::text AS "updatedAt"
    FROM pagos p
    LEFT JOIN clientes cl ON cl.id = p.cliente_id
  `;

  const rows = !search.trim()
    ? await conn.unsafe(`${baseSql} ORDER BY p.created_at DESC`)
    : await conn.unsafe(
        `
          ${baseSql}
          WHERE
            COALESCE(cl.nombre, '') ILIKE $1 OR
            COALESCE(p.metodo, '') ILIKE $1 OR
            COALESCE(p.referencia, '') ILIKE $1 OR
            CAST(p.valor AS text) ILIKE $1
          ORDER BY p.created_at DESC
        `,
        [like(search)]
      );

  return rows.map(mapPago);
}

export async function createPagoDb(body: any) {
  const clienteId = asString(body.clienteId);
  if (!clienteId) throw new Error("clienteId es obligatorio");

  const rows = await sql()`
    INSERT INTO pagos (
      cuenta_cobro_id, cliente_id, fecha, valor, metodo, referencia, notas, updated_at
    )
    VALUES (
      ${asNullableString(body.cobroId)},
      ${clienteId}::uuid,
      ${toIsoDate(body.fecha)},
      ${String(asNumber(body.valor, 0))},
      ${asString(body.metodo, "otro")},
      ${asNullableString(body.referencia)},
      ${asNullableString(body.notas)},
      now()
    )
    RETURNING id::text AS id
  `;

  const pagoId = String(rows[0].id);

  if (body.cobroId) {
    const sums = await sql()`
      SELECT
        COALESCE(cc.total, 0) AS total,
        COALESCE(SUM(p.valor), 0) AS pagado
      FROM cuentas_cobro cc
      LEFT JOIN pagos p ON p.cuenta_cobro_id = cc.id
      WHERE cc.id = ${asString(body.cobroId)}::uuid
      GROUP BY cc.total
    `;
    if (Array.isArray(sums) && sums[0]) {
      const total = money(sums[0].total);
      const pagado = money(sums[0].pagado);

      await sql()`
        UPDATE cuentas_cobro
        SET
          estado = ${
            pagado >= total && total > 0
              ? "pagado"
              : "pendiente"
          },
          updated_at = now()
        WHERE id = ${asString(body.cobroId)}::uuid
      `;
    }
  }

  const all = await listPagosDb("");
  return all.find((p: any) => p.id === pagoId) ?? null;
}

export async function deletePagoDb(id: string) {
  await sql()`DELETE FROM pagos WHERE id = ${id}::uuid`;
}

export async function buildBackupPayload() {
  return {
    meta: {
      app: "cotizaciones",
      version: "v2-api",
      exportedAt: new Date().toISOString(),
    },
    data: {
      clientes: await listClientesDb(""),
      productos: await listProductosDb(""),
      cotizaciones: await listCotizacionesDb(""),
      ordenes: await listOrdenesDb(""),
      actas: await listActasDb(""),
      cobros: await listCobrosDb(""),
      pagos: await listPagosDb(""),
    },
  };
}
