import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_CmTjyfoz.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import 'react';
import { TrendingUp, TrendingDown, AlertCircle, Wrench, FileText, DollarSign, ArrowRight, Plus, UserPlus, Package, Eye, Info, AlertTriangle, ChevronRight } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const iconMap = {
  "dollar-sign": DollarSign,
  "file-text": FileText,
  "wrench": Wrench,
  "alert-circle": AlertCircle
};
const colorMap$1 = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-200"
  },
  orange: {
    bg: "bg-orange-50",
    icon: "bg-orange-500",
    text: "text-orange-600",
    border: "border-orange-200"
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-500",
    text: "text-green-600",
    border: "border-green-200"
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-500",
    text: "text-red-600",
    border: "border-red-200"
  }
};
function KPICard({
  title,
  value,
  type,
  icon,
  color,
  trend,
  link
}) {
  const Icon = iconMap[icon];
  const colors = colorMap$1[color];
  const formatValue = () => {
    if (type === "currency") {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toLocaleString("es-CO");
  };
  const CardContent = () => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-2", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-gray-800 mb-2", children: formatValue() }),
        trend && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          trend.direction === "up" ? /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-green-500" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "w-4 h-4 text-red-500" }),
          /* @__PURE__ */ jsxs("span", { className: `text-sm font-semibold ${trend.direction === "up" ? "text-green-600" : "text-red-600"}`, children: [
            Math.abs(trend.value),
            "%"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "vs mes anterior" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `${colors.icon} p-3 rounded-lg`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-white" }) })
    ] }),
    link && /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`, children: [
      /* @__PURE__ */ jsx("span", { children: "Ver detalles" }),
      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
    ] }) })
  ] });
  if (link) {
    return /* @__PURE__ */ jsx(
      "a",
      {
        href: link,
        className: `block bg-white rounded-xl shadow-md border ${colors.border} p-6 hover:shadow-lg transition-all group`,
        children: /* @__PURE__ */ jsx(CardContent, {})
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: `bg-white rounded-xl shadow-md border ${colors.border} p-6`, children: /* @__PURE__ */ jsx(CardContent, {}) });
}

const actions = [
  {
    id: "nueva-cotizacion",
    title: "Nueva Cotización",
    description: "Crear cotización para cliente",
    icon: FileText,
    href: "/cotizaciones/nueva",
    color: "blue"
  },
  {
    id: "nuevo-cliente",
    title: "Nuevo Cliente",
    description: "Agregar cliente al sistema",
    icon: UserPlus,
    href: "/clientes/nuevo",
    color: "green"
  },
  {
    id: "nuevo-producto",
    title: "Nuevo Producto",
    description: "Agregar producto al catálogo",
    icon: Package,
    href: "/productos/nuevo",
    color: "purple"
  },
  {
    id: "registrar-pago",
    title: "Registrar Pago",
    description: "Registrar pago recibido",
    icon: DollarSign,
    href: "/pagos/registrar",
    color: "orange"
  }
];
const colorMap = {
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  purple: "bg-purple-500 hover:bg-purple-600",
  orange: "bg-orange-500 hover:bg-orange-600"
};
function QuickActions() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-md border border-gray-200", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-6 py-4", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-800 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
      "Acciones Rápidas"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: actions.map((action) => {
      const Icon = action.icon;
      const colorClass = colorMap[action.color] ?? colorMap.blue;
      return /* @__PURE__ */ jsxs(
        "a",
        {
          href: action.href,
          className: "group flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `${colorClass} p-3 rounded-lg transition-colors flex-shrink-0`,
                children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-white" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800 group-hover:text-blue-600 transition-colors", children: action.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: action.description })
            ] })
          ]
        },
        action.id
      );
    }) }) })
  ] });
}

const typeConfig = {
  cotizacion: {
    icon: FileText,
    label: "Cotización",
    colorKey: "blue"
  },
  cobro: {
    icon: DollarSign,
    label: "Cuenta de Cobro",
    colorKey: "green"
  },
  orden: {
    icon: Wrench,
    label: "Orden de Trabajo",
    colorKey: "orange"
  }
};
const colorClasses = {
  blue: { badgeBg: "bg-blue-100", iconText: "text-blue-600" },
  green: { badgeBg: "bg-green-100", iconText: "text-green-600" },
  orange: { badgeBg: "bg-orange-100", iconText: "text-orange-600" }
};
const statusConfig = {
  enviada: { label: "Enviada", color: "bg-blue-100 text-blue-700" },
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  en_progreso: { label: "En progreso", color: "bg-orange-100 text-orange-700" },
  aprobada: { label: "Aprobada", color: "bg-green-100 text-green-700" },
  pagada: { label: "Pagada", color: "bg-green-100 text-green-700" },
  vencida: { label: "Vencida", color: "bg-red-100 text-red-700" },
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-700" },
  enviada_cliente: { label: "Enviada", color: "bg-blue-100 text-blue-700" },
  finalizada: { label: "Finalizada", color: "bg-green-100 text-green-700" },
  en_revision: { label: "En revisión", color: "bg-purple-100 text-purple-700" }
};
function RecentDocuments({ documents }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };
  const getDocumentLink = (doc) => {
    const typeMap = {
      cotizacion: "/cotizaciones",
      cobro: "/cobros",
      orden: "/ordenes"
    };
    return `${typeMap[doc.type]}/${doc.id}`;
  };
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [
      /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600", children: "Tipo" }),
      /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600", children: "Número" }),
      /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600", children: "Cliente" }),
      /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600", children: "Valor" }),
      /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600", children: "Fecha" }),
      /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600", children: "Estado" }),
      /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600", children: "Acciones" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: documents.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-6 py-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx(FileText, { className: "mb-3 h-12 w-12 text-gray-300" }),
      /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-600", children: "No hay documentos recientes" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Cuando empieces a guardar en PostgreSQL, aparecerán aquí." })
    ] }) }) }) : documents.map((doc) => {
      const config = typeConfig[doc.type];
      const Icon = config.icon;
      const colors = colorClasses[config.colorKey];
      const status = statusConfig[doc.status] ?? {
        label: doc.status,
        color: "bg-gray-100 text-gray-700"
      };
      return /* @__PURE__ */ jsxs("tr", { className: "transition-colors hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: `${colors.badgeBg} rounded-lg p-2`, children: /* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${colors.iconText}` }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: config.label })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800", children: doc.number }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: doc.client }) }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800", children: formatCurrency(doc.amount) }) }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: formatDate(doc.date) }) }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`,
            children: status.label
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: getDocumentLink(doc),
            className: "inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700",
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Ver" })
            ]
          }
        ) })
      ] }, String(doc.id));
    }) })
  ] }) });
}

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    iconColor: "text-yellow-500"
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    iconColor: "text-red-500"
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    iconColor: "text-blue-500"
  }
};
function AlertsList({ alerts }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-md border border-gray-200 h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-6 py-4", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-800 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }),
      "Alertas"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100", children: alerts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(Info, { className: "w-8 h-8 text-gray-400" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "No hay alertas pendientes" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs mt-1", children: "Todo está al día" })
    ] }) : alerts.map((alert) => {
      const config = alertConfig[alert.type];
      const Icon = config.icon;
      return /* @__PURE__ */ jsx(
        "a",
        {
          href: alert.action,
          className: "block p-4 hover:bg-gray-50 transition-colors group",
          "data-alert-type": alert.type,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `${config.bg} ${config.border} border p-2 rounded-lg flex-shrink-0`,
                children: /* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${config.iconColor}` })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx(
              "p",
              {
                className: `text-sm ${config.text} font-medium leading-relaxed`,
                children: alert.message
              }
            ) }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" })
          ] })
        },
        alert.id
      );
    }) }),
    alerts.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 p-3", children: /* @__PURE__ */ jsx(
      "a",
      {
        href: "/dashboard",
        className: "block text-center text-sm text-blue-600 hover:text-blue-700 font-medium",
        children: "Ver todas las alertas"
      }
    ) })
  ] });
}

function toNumber(value) {
  if (value === null || value === void 0) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
function toTrend(current, previous) {
  if (!previous || previous <= 0) return void 0;
  const diff = (current - previous) / previous * 100;
  return {
    value: Math.round(Math.abs(diff)),
    direction: diff >= 0 ? "up" : "down"
  };
}
function normalizeRows(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.rows)) return result.rows;
  return [];
}
async function safeQuery(fn, fallback, label) {
  try {
    return await fn();
  } catch (error) {
    console.error(`[dashboard] fallo en ${label}:`, error);
    return fallback;
  }
}
async function getDashboardData() {
  try {
    const [{ sqlClient, testDbConnection }] = await Promise.all([
      import('../chunks/client_g3SUwVKV.mjs')
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
    const recentDocs = normalizeRows(docsRows).map((row) => ({
      id: String(row.id),
      type: row.type,
      number: row.number,
      client: row.client,
      amount: toNumber(row.amount),
      date: row.date,
      status: row.status
    }));
    const alerts = [];
    const quoteRow = normalizeRows(quoteAlertRows)[0];
    const overdueRow = normalizeRows(overdueAlertRows)[0];
    const orderRow = normalizeRows(orderAlertRows)[0];
    if (quoteRow?.id) {
      alerts.push({
        id: 1,
        type: "warning",
        message: `Cotización ${quoteRow.numero} requiere seguimiento`,
        action: `/cotizaciones/${quoteRow.id}`
      });
    }
    if (toNumber(overdueRow?.total) > 0) {
      alerts.push({
        id: 2,
        type: "danger",
        message: `${toNumber(overdueRow.total)} cuenta(s) de cobro con saldo pendiente`,
        action: "/pagos/cartera"
      });
    }
    if (orderRow?.id) {
      alerts.push({
        id: 3,
        type: "info",
        message: `Orden ${orderRow.numero} finalizada`,
        action: `/ordenes/${orderRow.id}`
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
        trendTotalCotizadoMes: toTrend(totalCotizadoMes, totalCotizadoMesAnterior)
      },
      recentDocs,
      alerts
    };
  } catch (error) {
    console.error("[dashboard] conexión principal falló:", error);
    return {
      dbConnected: false,
      error: error?.message || "No fue posible conectar con PostgreSQL",
      kpis: {
        totalCotizadoMes: 0,
        cotizacionesPendientes: 0,
        ordenesEnCurso: 0,
        carteraVencida: 0
      },
      recentDocs: [],
      alerts: []
    };
  }
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "Dashboard - Sistema de Cotizaciones";
  const pageDescription = "Panel principal del sistema de gesti\xF3n de cotizaciones y ventas";
  const dashboardData = await getDashboardData();
  const now = /* @__PURE__ */ new Date();
  const todayLong = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(now);
  const currentMonth = new Intl.DateTimeFormat("es-CO", {
    month: "long"
  }).format(now);
  const hasCriticalAlerts = dashboardData.alerts.some((a) => a.type === "danger");
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 shadow-lg"> <div class="flex items-center justify-between gap-6"> <div class="text-white"> <h1 class="mb-2 text-3xl font-bold">Bienvenido de nuevo</h1> <p class="text-lg text-blue-100">Hoy es ${todayLong}</p> </div> <div class="hidden md:block"> <div class="rounded-lg bg-white/20 p-4 text-center text-white backdrop-blur-sm"> <p class="mb-1 text-sm text-blue-100">Mes actual</p> <p class="text-3xl font-bold">${currentMonth}</p> </div> </div> </div> </section> ${!dashboardData.dbConnected && renderTemplate`<section class="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
No se pudo conectar el dashboard a PostgreSQL: ${dashboardData.error} </section>`}<section class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"> ${renderComponent($$result2, "KPICard", KPICard, { "title": "Cotizado este mes", "value": dashboardData.kpis.totalCotizadoMes, "type": "currency", "icon": "dollar-sign", "trend": dashboardData.kpis.trendTotalCotizadoMes, "color": "blue", "link": "/cotizaciones" })} ${renderComponent($$result2, "KPICard", KPICard, { "title": "Cotizaciones pendientes", "value": dashboardData.kpis.cotizacionesPendientes, "type": "number", "icon": "file-text", "color": "orange", "link": "/cotizaciones?status=pendiente" })} ${renderComponent($$result2, "KPICard", KPICard, { "title": "\xD3rdenes en curso", "value": dashboardData.kpis.ordenesEnCurso, "type": "number", "icon": "wrench", "color": "green", "link": "/ordenes?status=en_progreso" })} ${renderComponent($$result2, "KPICard", KPICard, { "title": "Cartera pendiente", "value": dashboardData.kpis.carteraVencida, "type": "currency", "icon": "alert-circle", "color": "red", "link": "/pagos/cartera" })} </section> <section class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3"> <div class="lg:col-span-2"> ${renderComponent($$result2, "QuickActions", QuickActions, {})} </div> <div class="space-y-4"> ${hasCriticalAlerts ? renderTemplate`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
Hay alertas críticas que requieren revisión inmediata.
</div>` : renderTemplate`<div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
No hay alertas críticas registradas en este momento.
</div>`} ${renderComponent($$result2, "AlertsList", AlertsList, { "alerts": dashboardData.alerts })} </div> </section> <section class="rounded-xl border border-gray-200 bg-white shadow-md"> <div class="border-b border-gray-200 px-6 py-4"> <div class="flex items-center justify-between gap-4"> <div> <h2 class="text-xl font-bold text-gray-800">Documentos recientes</h2> <p class="mt-1 text-sm text-gray-500">
Últimos movimientos leídos desde PostgreSQL.
</p> </div> <a href="/cotizaciones" class="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
Ver todos
<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div> ${renderComponent($$result2, "RecentDocuments", RecentDocuments, { "documents": dashboardData.recentDocs })} </section> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
