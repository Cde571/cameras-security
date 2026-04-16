import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DCJG7FNs.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Wrench, FileText, DollarSign, ArrowRight, Plus, UserPlus, Package, Eye, Info, AlertTriangle, ChevronRight } from 'lucide-react';
import { i as listCotizaciones } from '../chunks/cotizacionLocalService_CikZvbuZ.mjs';
import { h as listOrdenes } from '../chunks/ordenLocalService_KxGhULNN.mjs';
import { f as listPagos, l as listCobros } from '../chunks/cobroPagoLocalService_C_z-2DSE.mjs';
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

function readDashboardCollections() {
  return {
    cotizaciones: listCotizaciones(""),
    ordenes: listOrdenes(""),
    cobros: listCobros(""),
    pagos: listPagos("")
  };
}

function toNumber(value) {
  const n = Number(
    typeof value === "string" ? value.replace(/\./g, "").replace(",", ".") : value
  );
  return Number.isFinite(n) ? n : 0;
}
function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
function sameMonth(value) {
  const d = toDate(value);
  if (!d) return false;
  const now = /* @__PURE__ */ new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}
function pickFirst(...values) {
  for (const v of values) {
    if (v !== void 0 && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}
function clientNameOf(item) {
  return pickFirst(
    item?.cliente?.nombre,
    item?.clienteNombre,
    item?.client?.nombre,
    item?.clientName,
    item?.nombreCliente,
    "Sin cliente"
  );
}
function numberOf(item, prefix) {
  return String(
    pickFirst(item.numero, item.codigo, `${prefix}-${String(item.id || "").slice(0, 8)}`)
  );
}
function statusOf(item) {
  return String(pickFirst(item.status, item.estado, "pendiente")).toLowerCase();
}
function dateOf(item) {
  return String(
    pickFirst(
      item.fecha,
      item.fechaEmision,
      item.fechaProgramada,
      item.createdAt,
      item.updatedAt,
      (/* @__PURE__ */ new Date()).toISOString()
    )
  );
}
function totalOf(item) {
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
function DashboardLiveData() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const refresh = () => setTick((v) => v + 1);
    const interval = window.setInterval(refresh, 1200);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  const data = useMemo(() => {
    const { cotizaciones, ordenes, cobros, pagos } = readDashboardCollections();
    const totalCotizadoMes = cotizaciones.filter((c) => sameMonth(dateOf(c))).reduce((sum, c) => sum + totalOf(c), 0);
    const cotizacionesPendientes = cotizaciones.filter(
      (c) => ["borrador", "enviada", "pendiente"].includes(statusOf(c))
    ).length;
    const ordenesEnCurso = ordenes.filter(
      (o) => ["pendiente", "en_progreso", "en progreso", "en_revision", "en revisión"].includes(statusOf(o))
    ).length;
    const pagosPorCobro = /* @__PURE__ */ new Map();
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
        id: String(pickFirst(c.id, c.numero, crypto.randomUUID?.() || Math.random())),
        type: "cotizacion",
        number: numberOf(c, "COT"),
        client: clientNameOf(c),
        amount: totalOf(c),
        date: dateOf(c),
        status: statusOf(c)
      })),
      ...cobros.map((c) => ({
        id: String(pickFirst(c.id, c.numero, crypto.randomUUID?.() || Math.random())),
        type: "cobro",
        number: numberOf(c, "CC"),
        client: clientNameOf(c),
        amount: totalOf(c),
        date: dateOf(c),
        status: statusOf(c)
      })),
      ...ordenes.map((o) => ({
        id: String(pickFirst(o.id, o.numero, crypto.randomUUID?.() || Math.random())),
        type: "orden",
        number: numberOf(o, "OT"),
        client: clientNameOf(o),
        amount: 0,
        date: dateOf(o),
        status: statusOf(o)
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
    const alerts = [];
    let alertId = 1;
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    for (const c of cotizaciones) {
      const base = toDate(dateOf(c));
      if (!base) continue;
      const vigencia = toNumber(pickFirst(c.vigenciaDias, c.vigencia_dias, 30));
      const vence = new Date(base);
      vence.setDate(vence.getDate() + vigencia);
      if (vence.getFullYear() === tomorrow.getFullYear() && vence.getMonth() === tomorrow.getMonth() && vence.getDate() === tomorrow.getDate() && ["borrador", "enviada", "pendiente"].includes(statusOf(c))) {
        alerts.push({
          id: alertId++,
          type: "warning",
          message: `Cotización ${numberOf(c, "COT")} vence mañana`,
          action: `/cotizaciones/${String(c.id)}`
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
        action: "/pagos/cartera"
      });
    }
    const ordenFinalizada = ordenes.find(
      (o) => ["finalizada", "terminada", "completada"].includes(statusOf(o))
    );
    if (ordenFinalizada) {
      alerts.push({
        id: alertId++,
        type: "info",
        message: `Orden ${numberOf(ordenFinalizada, "OT")} finalizada`,
        action: `/ordenes/${String(ordenFinalizada.id)}`
      });
    }
    return {
      totalCotizadoMes,
      cotizacionesPendientes,
      ordenesEnCurso,
      carteraPendiente,
      recentDocs,
      alerts
    };
  }, [tick]);
  const hasCriticalAlerts = data.alerts.some((a) => a.type === "danger");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(
        KPICard,
        {
          title: "Cotizado este mes",
          value: data.totalCotizadoMes,
          type: "currency",
          icon: "dollar-sign",
          color: "blue",
          link: "/cotizaciones"
        }
      ),
      /* @__PURE__ */ jsx(
        KPICard,
        {
          title: "Cotizaciones pendientes",
          value: data.cotizacionesPendientes,
          type: "number",
          icon: "file-text",
          color: "orange",
          link: "/cotizaciones?status=pendiente"
        }
      ),
      /* @__PURE__ */ jsx(
        KPICard,
        {
          title: "Órdenes en curso",
          value: data.ordenesEnCurso,
          type: "number",
          icon: "wrench",
          color: "green",
          link: "/ordenes?status=en_progreso"
        }
      ),
      /* @__PURE__ */ jsx(
        KPICard,
        {
          title: "Cartera pendiente",
          value: data.carteraPendiente,
          type: "currency",
          icon: "alert-circle",
          color: "red",
          link: "/pagos/cartera"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(QuickActions, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        hasCriticalAlerts ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: "Hay alertas críticas que requieren revisión inmediata." }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700", children: "No hay alertas críticas registradas en este momento." }),
        /* @__PURE__ */ jsx(AlertsList, { alerts: data.alerts })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white shadow-md", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Documentos recientes" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Datos leídos desde la capa unificada del sistema." })
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/cotizaciones",
            className: "flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700",
            children: "Ver todos"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(RecentDocuments, { documents: data.recentDocs })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Dashboard - Sistema de Cotizaciones";
  const pageDescription = "Panel principal del sistema de gesti\xF3n de cotizaciones y ventas";
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
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 shadow-lg"> <div class="flex items-center justify-between gap-6"> <div class="text-white"> <h1 class="mb-2 text-3xl font-bold">Bienvenido de nuevo</h1> <p class="text-lg text-blue-100">Hoy es ${todayLong}</p> </div> <div class="hidden md:block"> <div class="rounded-lg bg-white/20 p-4 text-center text-white backdrop-blur-sm"> <p class="mb-1 text-sm text-blue-100">Mes actual</p> <p class="text-3xl font-bold">${currentMonth}</p> </div> </div> </div> </section> ${renderComponent($$result2, "DashboardLiveData", DashboardLiveData, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/dashboard/DashboardLiveData", "client:component-export": "default" })} ` })}`;
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
