import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { DollarSign, Eye } from 'lucide-react';
import { a as getCartera } from './cobroPagoLocalService_BSn6kzk1.mjs';

function CarteraTable() {
  const [refresh, setRefresh] = useState(0);
  const data = useMemo(() => getCartera(), [refresh]);
  useEffect(() => {
    setRefresh((n) => n + 1);
  }, []);
  const money = useMemo(() => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }), []);
  const Row = ({ c, tone }) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-gray-900", children: c.numero }),
    /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900", children: c.cliente?.nombre }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: c.cliente?.ciudad || "" })
    ] }),
    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: c.fechaVencimiento }),
    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right font-semibold", children: money.format(c.total || 0) }),
    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 p-2 hover:bg-white", href: `/cobros/${c.id}`, title: "Ver", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxs("a", { className: `rounded-lg px-3 py-2 text-white inline-flex items-center gap-2 ${tone}`, href: "/pagos/registrar", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" }),
        " Registrar pago"
      ] })
    ] }) })
  ] });
  const Table = ({ title, rows, tone }) => /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: money.format(rows.reduce((a, x) => a + (x.total || 0), 0)) })
    ] }),
    rows.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-5 text-sm text-gray-600", children: "Sin registros." }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Cuenta" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Cliente" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Vence" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Total" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acción" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: rows.map((c) => /* @__PURE__ */ jsx(Row, { c, tone }, c.id)) })
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Cartera" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Pendientes, vencidos y pagados (front-first)." })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: "/pagos/registrar", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" }),
        " Registrar pago"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Total pendiente" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-900", children: money.format(data.totalPendiente) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Total vencido" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-900", children: money.format(data.totalVencido) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Total pagado" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-900", children: money.format(data.totalPagado) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Table, { title: "Pendientes", rows: data.pendientes, tone: "bg-blue-600 hover:bg-blue-700" }),
    /* @__PURE__ */ jsx(Table, { title: "Vencidos", rows: data.vencidos, tone: "bg-red-600 hover:bg-red-700" }),
    /* @__PURE__ */ jsx(Table, { title: "Pagados", rows: data.pagados, tone: "bg-gray-800 hover:bg-gray-900" })
  ] });
}

export { CarteraTable as C };
