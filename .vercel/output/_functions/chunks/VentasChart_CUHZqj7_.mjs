import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';

function money(n) {
  try {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  } catch {
    return `$ ${Math.round(n)}`;
  }
}
function VentasChart({ data, title }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Vista rápida (mock front-first)." }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: data.map((d) => {
      const w = Math.round(d.total / max * 100);
      return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-1 text-xs text-gray-600", children: d.month }),
        /* @__PURE__ */ jsx("div", { className: "col-span-8", children: /* @__PURE__ */ jsx("div", { className: "h-3 rounded-full bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-3 rounded-full bg-blue-600", style: { width: `${w}%` } }) }) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-3 text-right text-xs font-semibold text-gray-800", children: money(d.total) })
      ] }, d.month);
    }) })
  ] });
}

export { VentasChart as V };
