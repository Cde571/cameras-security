CREATE TABLE "acta_activos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"acta_id" uuid NOT NULL,
	"tipo" varchar(80),
	"descripcion" varchar(220) NOT NULL,
	"cantidad" integer DEFAULT 1 NOT NULL,
	"serial" varchar(120),
	"ubicacion" varchar(180)
);
--> statement-breakpoint
CREATE TABLE "actas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" varchar(40) NOT NULL,
	"cliente_id" uuid,
	"orden_id" uuid,
	"fecha" date,
	"lugar" varchar(180),
	"estado" varchar(30) DEFAULT 'borrador' NOT NULL,
	"tecnico" varchar(150),
	"recibe" varchar(150),
	"documento_recibe" varchar(80),
	"observaciones" text,
	"firma_tecnico" text,
	"firma_cliente" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid,
	"modulo" varchar(60) NOT NULL,
	"accion" varchar(60) NOT NULL,
	"entidad_id" uuid,
	"detalles" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categorias_producto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(120) NOT NULL,
	"descripcion" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"documento" varchar(80),
	"telefono" varchar(60),
	"email" varchar(180),
	"direccion" varchar(220),
	"ciudad" varchar(120),
	"notas" text,
	"estado" varchar(20) DEFAULT 'activo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cotizacion_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cotizacion_id" uuid NOT NULL,
	"kind" varchar(20) NOT NULL,
	"ref_id" uuid,
	"nombre" varchar(220) NOT NULL,
	"unidad" varchar(30),
	"qty" integer DEFAULT 1 NOT NULL,
	"precio" numeric(14, 2) DEFAULT '0' NOT NULL,
	"iva_pct" integer DEFAULT 19 NOT NULL,
	"costo" numeric(14, 2) DEFAULT '0',
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cotizaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" varchar(40) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"parent_id" uuid,
	"fecha" date NOT NULL,
	"vigencia_dias" integer DEFAULT 15 NOT NULL,
	"status" varchar(30) DEFAULT 'borrador' NOT NULL,
	"cliente_id" uuid NOT NULL,
	"asunto" varchar(220),
	"condiciones" text,
	"notas" text,
	"subtotal" numeric(14, 2) DEFAULT '0' NOT NULL,
	"iva" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cuenta_cobro_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cuenta_cobro_id" uuid NOT NULL,
	"concepto" varchar(220) NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL,
	"precio" numeric(14, 2) DEFAULT '0' NOT NULL,
	"iva_pct" integer DEFAULT 19 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cuentas_cobro" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" varchar(40) NOT NULL,
	"cliente_id" uuid NOT NULL,
	"fecha" date NOT NULL,
	"estado" varchar(30) DEFAULT 'pendiente' NOT NULL,
	"referencia" varchar(180),
	"notas" text,
	"subtotal" numeric(14, 2) DEFAULT '0' NOT NULL,
	"iva" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empresa_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"nit" varchar(80),
	"telefono" varchar(60),
	"email" varchar(180),
	"direccion" varchar(220),
	"ciudad" varchar(120),
	"website" varchar(180),
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impuestos_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"iva_default" integer DEFAULT 19 NOT NULL,
	"moneda" varchar(10) DEFAULT 'COP' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kit_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kit_id" uuid NOT NULL,
	"producto_id" uuid NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"descripcion" text,
	"precio" numeric(14, 2) DEFAULT '0' NOT NULL,
	"estado" varchar(20) DEFAULT 'activo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "numeracion_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cotizacion_prefix" varchar(20) DEFAULT 'COT' NOT NULL,
	"orden_prefix" varchar(20) DEFAULT 'OT' NOT NULL,
	"acta_prefix" varchar(20) DEFAULT 'ACT' NOT NULL,
	"cobro_prefix" varchar(20) DEFAULT 'CC' NOT NULL,
	"cotizacion_seq" integer DEFAULT 0 NOT NULL,
	"orden_seq" integer DEFAULT 0 NOT NULL,
	"acta_seq" integer DEFAULT 0 NOT NULL,
	"cobro_seq" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ordenes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" varchar(40) NOT NULL,
	"cliente_id" uuid,
	"cotizacion_id" uuid,
	"fecha" date,
	"estado" varchar(30) DEFAULT 'pendiente' NOT NULL,
	"tecnico" varchar(150),
	"checklist" jsonb,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cuenta_cobro_id" uuid,
	"cliente_id" uuid,
	"fecha" date NOT NULL,
	"valor" numeric(14, 2) DEFAULT '0' NOT NULL,
	"metodo" varchar(50),
	"soporte_url" text,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"categoria_id" uuid,
	"marca" varchar(120),
	"descripcion" text,
	"unidad" varchar(30) DEFAULT 'unidad',
	"costo" numeric(14, 2) DEFAULT '0',
	"precio" numeric(14, 2) DEFAULT '0' NOT NULL,
	"iva_pct" integer DEFAULT 19 NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"estado" varchar(20) DEFAULT 'activo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sesiones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"email" varchar(180) NOT NULL,
	"password_hash" text,
	"role" varchar(40) DEFAULT 'admin' NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "acta_activos" ADD CONSTRAINT "acta_activos_acta_id_actas_id_fk" FOREIGN KEY ("acta_id") REFERENCES "public"."actas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actas" ADD CONSTRAINT "actas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actas" ADD CONSTRAINT "actas_orden_id_ordenes_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cotizacion_items" ADD CONSTRAINT "cotizacion_items_cotizacion_id_cotizaciones_id_fk" FOREIGN KEY ("cotizacion_id") REFERENCES "public"."cotizaciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuenta_cobro_items" ADD CONSTRAINT "cuenta_cobro_items_cuenta_cobro_id_cuentas_cobro_id_fk" FOREIGN KEY ("cuenta_cobro_id") REFERENCES "public"."cuentas_cobro"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_cobro" ADD CONSTRAINT "cuentas_cobro_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kit_items" ADD CONSTRAINT "kit_items_kit_id_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kit_items" ADD CONSTRAINT "kit_items_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_cotizacion_id_cotizaciones_id_fk" FOREIGN KEY ("cotizacion_id") REFERENCES "public"."cotizaciones"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cuenta_cobro_id_cuentas_cobro_id_fk" FOREIGN KEY ("cuenta_cobro_id") REFERENCES "public"."cuentas_cobro"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_categorias_producto_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias_producto"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "actas_numero_idx" ON "actas" USING btree ("numero");--> statement-breakpoint
CREATE UNIQUE INDEX "cotizaciones_numero_idx" ON "cotizaciones" USING btree ("numero");--> statement-breakpoint
CREATE UNIQUE INDEX "cuentas_cobro_numero_idx" ON "cuentas_cobro" USING btree ("numero");--> statement-breakpoint
CREATE UNIQUE INDEX "ordenes_numero_idx" ON "ordenes" USING btree ("numero");--> statement-breakpoint
CREATE UNIQUE INDEX "sesiones_token_idx" ON "sesiones" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");