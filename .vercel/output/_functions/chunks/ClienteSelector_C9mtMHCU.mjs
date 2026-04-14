import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { l as listClientes } from './clienteLocalService_BAQfU60Z.mjs';

function ClienteSelector({ value, onChange }) {
  const [q, setQ] = useState("");
  const clientes = useMemo(() => listClientes(q), [q]);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Cliente" }),
      /* @__PURE__ */ jsx("a", { href: "/clientes/nuevo", className: "text-sm text-blue-600 hover:text-blue-700", children: "+ Crear cliente" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Buscar cliente...",
          className: "w-full bg-transparent outline-none text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: value || "",
        onChange: (e) => {
          const c = clientes.find((x) => x.id === e.target.value);
          if (c) onChange(c);
        },
        className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona un cliente" }),
          clientes.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
            c.nombre,
            " ",
            c.documento ? `- ${c.documento}` : ""
          ] }, c.id))
        ]
      }
    ),
    value ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Tip: luego conectamos esto con historial de documentos del cliente." }) : null
  ] });
}

export { ClienteSelector as C };
