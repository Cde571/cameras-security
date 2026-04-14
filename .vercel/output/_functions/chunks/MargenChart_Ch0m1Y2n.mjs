import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';

function money(n) {
  try {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  } catch {
    return `$ ${Math.round(n)}`;
  }
}
function MargenChart({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Márgenes" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Por categoría (mock)." }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: data.map((m) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: m.category }),
        /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800", children: [
          m.marginPct,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Ingreso: ",
          /* @__PURE__ */ jsx("b", { className: "text-gray-900", children: money(m.revenue) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Costo: ",
          /* @__PURE__ */ jsx("b", { className: "text-gray-900", children: money(m.cost) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Margen: ",
          /* @__PURE__ */ jsx("b", { className: "text-gray-900", children: money(m.margin) })
        ] })
      ] })
    ] }, m.category)) })
  ] });
}

export { MargenChart as M };
