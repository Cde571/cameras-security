import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { ArrowLeft, GitBranch } from 'lucide-react';
import { g as getCotizacion, f as createVersionFrom } from './cotizacionLocalService_CikZvbuZ.mjs';

function VersionControl({ cotizacionId }) {
  const [num, setNum] = useState("");
  useEffect(() => {
    const c = getCotizacion(cotizacionId);
    setNum(c?.numero || "");
  }, [cotizacionId]);
  const crear = () => {
    const ok = confirm("Esto creará una nueva versión (duplicada) en estado BORRADOR. ¿Continuar?");
    if (!ok) return;
    const v = createVersionFrom(cotizacionId);
    window.location.href = `/cotizaciones/${v.id}/editar`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Versionar cotización" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "Base: ",
          num || cotizacionId
        ] })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: `/cotizaciones/${cotizacionId}`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Volver"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
        "Se copiarán: cliente, ítems, condiciones y notas. La nueva versión queda como ",
        /* @__PURE__ */ jsx("b", { children: "borrador" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: crear,
          className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(GitBranch, { className: "h-4 w-4" }),
            "Crear nueva versión"
          ]
        }
      )
    ] })
  ] });
}

export { VersionControl as V };
