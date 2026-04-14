import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { g as getCliente, u as updateCliente, c as createCliente } from './clienteLocalService_BAQfU60Z.mjs';

function ClienteForm({ mode, clienteId }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    notas: "",
    estado: "activo"
  });
  const [loading, setLoading] = useState(isEdit);
  useEffect(() => {
    if (!isEdit) return;
    if (!clienteId) return;
    const c = getCliente(clienteId);
    if (c) {
      setForm({
        nombre: c.nombre || "",
        documento: c.documento || "",
        telefono: c.telefono || "",
        email: c.email || "",
        direccion: c.direccion || "",
        ciudad: c.ciudad || "",
        notas: c.notas || "",
        estado: c.estado || "activo"
      });
    }
    setLoading(false);
  }, [isEdit, clienteId]);
  const canSave = useMemo(() => form.nombre.trim().length >= 3, [form.nombre]);
  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave) {
      alert("Nombre del cliente es obligatorio (mínimo 3 caracteres).");
      return;
    }
    if (isEdit && clienteId) {
      updateCliente(clienteId, { ...form });
      window.location.href = `/clientes/${clienteId}`;
      return;
    }
    const nuevo = createCliente({ ...form });
    window.location.href = `/clientes/${nuevo.id}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cargando cliente..." }) });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: isEdit ? "Editar cliente" : "Crear cliente" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: isEdit ? "Actualiza la información del cliente." : "Registra un cliente nuevo para cotizaciones y documentos." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/clientes",
            className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
              "Volver"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`,
            disabled: !canSave,
            children: [
              /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
              "Guardar"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Datos del cliente" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Nombre / Razón social *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.nombre,
              onChange: (e) => onChange("nombre", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Ej: Hotel Plaza Real"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Documento (NIT/CC)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.documento,
              onChange: (e) => onChange("documento", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Ej: 900123456-7"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Teléfono" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.telefono,
                onChange: (e) => onChange("telefono", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
                placeholder: "Ej: 3001234567"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Email" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.email,
                onChange: (e) => onChange("email", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
                placeholder: "Ej: compras@cliente.com"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Dirección" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.direccion,
              onChange: (e) => onChange("direccion", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Ej: Cra 10 # 12-34"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Ciudad" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.ciudad,
                onChange: (e) => onChange("ciudad", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
                placeholder: "Ej: Medellín"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Estado" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: form.estado,
                onChange: (e) => onChange("estado", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "activo", children: "Activo" }),
                  /* @__PURE__ */ jsx("option", { value: "inactivo", children: "Inactivo" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Notas" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: form.notas,
            onChange: (e) => onChange("notas", e.target.value),
            className: "min-h-[220px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
            placeholder: "Ej: condiciones, preferencias de pago, contacto principal..."
          }
        ),
        isEdit && clienteId ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-gray-50 p-4 text-sm text-gray-700", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Acciones rápidas" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50", href: `/clientes/${clienteId}`, children: "Ver detalle" }),
            /* @__PURE__ */ jsx("a", { className: "rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50", href: `/clientes/${clienteId}/historial`, children: "Ver historial" })
          ] })
        ] }) : null
      ] })
    ] })
  ] });
}

export { ClienteForm as C };
