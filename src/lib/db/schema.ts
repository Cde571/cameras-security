import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* =========================
   Usuarios / sesión
========================= */

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  email: varchar("email", { length: 180 }).notNull(),
  passwordHash: text("password_hash"),
  role: varchar("role", { length: 40 }).notNull().default("admin"),
  activo: boolean("activo").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  emailIdx: uniqueIndex("usuarios_email_idx").on(t.email),
}));

export const sesiones = pgTable("sesiones", {
  id: uuid("id").defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  tokenIdx: uniqueIndex("sesiones_token_idx").on(t.token),
}));

/* =========================
   Configuración
========================= */

export const empresaConfig = pgTable("empresa_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  nit: varchar("nit", { length: 80 }),
  telefono: varchar("telefono", { length: 60 }),
  email: varchar("email", { length: 180 }),
  direccion: varchar("direccion", { length: 220 }),
  ciudad: varchar("ciudad", { length: 120 }),
  website: varchar("website", { length: 180 }),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const impuestosConfig = pgTable("impuestos_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  ivaDefault: integer("iva_default").notNull().default(19),
  moneda: varchar("moneda", { length: 10 }).notNull().default("COP"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const numeracionConfig = pgTable("numeracion_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  cotizacionPrefix: varchar("cotizacion_prefix", { length: 20 }).notNull().default("COT"),
  ordenPrefix: varchar("orden_prefix", { length: 20 }).notNull().default("OT"),
  actaPrefix: varchar("acta_prefix", { length: 20 }).notNull().default("ACT"),
  cobroPrefix: varchar("cobro_prefix", { length: 20 }).notNull().default("CC"),
  cotizacionSeq: integer("cotizacion_seq").notNull().default(0),
  ordenSeq: integer("orden_seq").notNull().default(0),
  actaSeq: integer("acta_seq").notNull().default(0),
  cobroSeq: integer("cobro_seq").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* =========================
   Clientes
========================= */

export const clientes = pgTable("clientes", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  documento: varchar("documento", { length: 80 }),
  telefono: varchar("telefono", { length: 60 }),
  email: varchar("email", { length: 180 }),
  direccion: varchar("direccion", { length: 220 }),
  ciudad: varchar("ciudad", { length: 120 }),
  notas: text("notas"),
  estado: varchar("estado", { length: 20 }).notNull().default("activo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* =========================
   Productos / categorías / kits
========================= */

export const categoriasProducto = pgTable("categorias_producto", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: varchar("nombre", { length: 120 }).notNull(),
  descripcion: text("descripcion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productos = pgTable("productos", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  categoriaId: uuid("categoria_id").references(() => categoriasProducto.id, { onDelete: "set null" }),
  marca: varchar("marca", { length: 120 }),
  descripcion: text("descripcion"),
  unidad: varchar("unidad", { length: 30 }).default("unidad"),
  costo: numeric("costo", { precision: 14, scale: 2 }).default("0"),
  precio: numeric("precio", { precision: 14, scale: 2 }).notNull().default("0"),
  ivaPct: integer("iva_pct").notNull().default(19),
  stock: integer("stock").notNull().default(0),
  estado: varchar("estado", { length: 20 }).notNull().default("activo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kits = pgTable("kits", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  precio: numeric("precio", { precision: 14, scale: 2 }).notNull().default("0"),
  estado: varchar("estado", { length: 20 }).notNull().default("activo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kitItems = pgTable("kit_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  kitId: uuid("kit_id").notNull().references(() => kits.id, { onDelete: "cascade" }),
  productoId: uuid("producto_id").notNull().references(() => productos.id, { onDelete: "cascade" }),
  qty: integer("qty").notNull().default(1),
});

/* =========================
   Cotizaciones
========================= */

export const cotizaciones = pgTable("cotizaciones", {
  id: uuid("id").defaultRandom().primaryKey(),
  numero: varchar("numero", { length: 40 }).notNull(),
  version: integer("version").notNull().default(1),
  parentId: uuid("parent_id"),
  fecha: date("fecha").notNull(),
  vigenciaDias: integer("vigencia_dias").notNull().default(15),
  status: varchar("status", { length: 30 }).notNull().default("borrador"),

  clienteId: uuid("cliente_id").notNull().references(() => clientes.id, { onDelete: "restrict" }),

  asunto: varchar("asunto", { length: 220 }),
  condiciones: text("condiciones"),
  notas: text("notas"),

  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull().default("0"),
  iva: numeric("iva", { precision: 14, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 14, scale: 2 }).notNull().default("0"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  numeroIdx: uniqueIndex("cotizaciones_numero_idx").on(t.numero),
}));

export const cotizacionItems = pgTable("cotizacion_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cotizacionId: uuid("cotizacion_id").notNull().references(() => cotizaciones.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 20 }).notNull(), // producto | kit | servicio
  refId: uuid("ref_id"),
  nombre: varchar("nombre", { length: 220 }).notNull(),
  unidad: varchar("unidad", { length: 30 }),
  qty: integer("qty").notNull().default(1),
  precio: numeric("precio", { precision: 14, scale: 2 }).notNull().default("0"),
  ivaPct: integer("iva_pct").notNull().default(19),
  costo: numeric("costo", { precision: 14, scale: 2 }).default("0"),
  orden: integer("orden").notNull().default(0),
});

/* =========================
   Órdenes
========================= */

export const ordenes = pgTable("ordenes", {
  id: uuid("id").defaultRandom().primaryKey(),
  numero: varchar("numero", { length: 40 }).notNull(),
  clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
  cotizacionId: uuid("cotizacion_id").references(() => cotizaciones.id, { onDelete: "set null" }),
  fecha: date("fecha"),
  estado: varchar("estado", { length: 30 }).notNull().default("pendiente"),
  tecnico: varchar("tecnico", { length: 150 }),
  checklist: jsonb("checklist"),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  numeroIdx: uniqueIndex("ordenes_numero_idx").on(t.numero),
}));

/* =========================
   Actas
========================= */

export const actas = pgTable("actas", {
  id: uuid("id").defaultRandom().primaryKey(),
  numero: varchar("numero", { length: 40 }).notNull(),
  clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
  ordenId: uuid("orden_id").references(() => ordenes.id, { onDelete: "set null" }),
  fecha: date("fecha"),
  lugar: varchar("lugar", { length: 180 }),
  estado: varchar("estado", { length: 30 }).notNull().default("borrador"),
  tecnico: varchar("tecnico", { length: 150 }),
  recibe: varchar("recibe", { length: 150 }),
  documentoRecibe: varchar("documento_recibe", { length: 80 }),
  observaciones: text("observaciones"),
  firmaTecnico: text("firma_tecnico"),
  firmaCliente: text("firma_cliente"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  numeroIdx: uniqueIndex("actas_numero_idx").on(t.numero),
}));

export const actaActivos = pgTable("acta_activos", {
  id: uuid("id").defaultRandom().primaryKey(),
  actaId: uuid("acta_id").notNull().references(() => actas.id, { onDelete: "cascade" }),
  tipo: varchar("tipo", { length: 80 }),
  descripcion: varchar("descripcion", { length: 220 }).notNull(),
  cantidad: integer("cantidad").notNull().default(1),
  serial: varchar("serial", { length: 120 }),
  ubicacion: varchar("ubicacion", { length: 180 }),
});

/* =========================
   Cuentas de cobro
========================= */

export const cuentasCobro = pgTable("cuentas_cobro", {
  id: uuid("id").defaultRandom().primaryKey(),
  numero: varchar("numero", { length: 40 }).notNull(),
  clienteId: uuid("cliente_id").notNull().references(() => clientes.id, { onDelete: "restrict" }),
  fecha: date("fecha").notNull(),
  estado: varchar("estado", { length: 30 }).notNull().default("pendiente"),
  referencia: varchar("referencia", { length: 180 }),
  notas: text("notas"),
  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull().default("0"),
  iva: numeric("iva", { precision: 14, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 14, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  numeroIdx: uniqueIndex("cuentas_cobro_numero_idx").on(t.numero),
}));

export const cuentaCobroItems = pgTable("cuenta_cobro_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cuentaCobroId: uuid("cuenta_cobro_id").notNull().references(() => cuentasCobro.id, { onDelete: "cascade" }),
  concepto: varchar("concepto", { length: 220 }).notNull(),
  qty: integer("qty").notNull().default(1),
  precio: numeric("precio", { precision: 14, scale: 2 }).notNull().default("0"),
  ivaPct: integer("iva_pct").notNull().default(19),
});

/* =========================
   Pagos
========================= */

export const pagos = pgTable("pagos", {
  id: uuid("id").defaultRandom().primaryKey(),
  cuentaCobroId: uuid("cuenta_cobro_id").references(() => cuentasCobro.id, { onDelete: "set null" }),
  clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
  fecha: date("fecha").notNull(),
  valor: numeric("valor", { precision: 14, scale: 2 }).notNull().default("0"),
  metodo: varchar("metodo", { length: 50 }),
  soporteUrl: text("soporte_url"),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   Auditoría
========================= */

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  modulo: varchar("modulo", { length: 60 }).notNull(),
  accion: varchar("accion", { length: 60 }).notNull(),
  entidadId: uuid("entidad_id"),
  detalles: jsonb("detalles"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});