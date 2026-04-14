import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';

function money(n) {
  try {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  } catch {
    return `$ ${Math.round(n)}`;
  }
}
function TopClientes({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Top Clientes" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Por total (mock)." }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: data.map((c, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-gray-900 truncate", children: [
          idx + 1,
          ". ",
          c.name
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
          c.count,
          " documentos"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: money(c.total) })
    ] }, c.name)) })
  ] });
}

export { TopClientes as T };
