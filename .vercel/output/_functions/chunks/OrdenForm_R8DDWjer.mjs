import { jsxs, jsx } from 'react/jsx-runtime';
import { useMemo, useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Save, Image, ClipboardList } from 'lucide-react';
import { C as ClienteSelector } from './ClienteSelector_C9mtMHCU.mjs';
import { g as getCliente } from './clienteLocalService_BAQfU60Z.mjs';
import { l as listChecklistTemplates, g as getOrden, a as getChecklistTemplate, b as updateOrden, e as createOrden } from './ordenLocalService_KxGhULNN.mjs';

const tecnicosSeed = [
  { id: "tec1", nombre: "Técnico 1", telefono: "3000000000" },
  { id: "tec2", nombre: "Técnico 2", telefono: "3110000000" },
  { id: "tec3", nombre: "Técnico 3", telefono: "3220000000" }
];
function TecnicoAssign({ value, onChange }) {
  const tecnicos = useMemo(() => tecnicosSeed, []);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Técnico" }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: value?.id || "",
        onChange: (e) => {
          const id = e.target.value;
          const t = tecnicos.find((x) => x.id === id) || null;
          onChange(t);
        },
        className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Sin asignar" }),
          tecnicos.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.nombre }, t.id))
        ]
      }
    ),
    value ? /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
      "Tel: ",
      value.telefono || "—"
    ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Asignación rápida (seed). Luego lo conectamos a Usuarios." })
  ] });
}

function uid$1() {
  return globalThis.crypto?.randomUUID?.() ?? `chk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function ChecklistEditor({ checklist, onChange }) {
  const toggle = (id) => {
    onChange(checklist.map((c) => c.id === id ? { ...c, done: !c.done } : c));
  };
  const setLabel = (id, label) => {
    onChange(checklist.map((c) => c.id === id ? { ...c, label } : c));
  };
  const add = () => onChange([{ id: uid$1(), label: "Nuevo ítem", done: false }, ...checklist]);
  const remove = (id) => onChange(checklist.filter((c) => c.id !== id));
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Checklist" }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: add, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Agregar"
      ] })
    ] }),
    checklist.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Sin checklist. Puedes agregar ítems o cargar una plantilla." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: checklist.map((c) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-200 p-2", children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", checked: c.done, onChange: () => toggle(c.id) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: c.label,
          onChange: (e) => setLabel(c.id, e.target.value),
          className: "flex-1 rounded-md border border-gray-200 px-2 py-1 text-sm"
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => remove(c.id), className: "rounded-lg border border-gray-300 p-2 hover:bg-white", title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
    ] }, c.id)) })
  ] });
}

function uid(prefix) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function OrdenForm({ mode, ordenId }) {
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(isEdit);
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState(null);
  const [fechaCreacion, setFechaCreacion] = useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [fechaProgramada, setFechaProgramada] = useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [status, setStatus] = useState("pendiente");
  const [asunto, setAsunto] = useState("");
  const [direccionServicio, setDireccionServicio] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [tecnico, setTecnico] = useState(null);
  const templates = useMemo(() => listChecklistTemplates(""), []);
  const [tplId, setTplId] = useState(templates[0]?.id ?? "");
  const [checklist, setChecklist] = useState([]);
  useEffect(() => {
    if (!isEdit || !ordenId) return;
    const o = getOrden(ordenId);
    if (!o) {
      setLoading(false);
      return;
    }
    setClienteId(o.clienteId);
    setClienteSnap(o.cliente);
    setFechaCreacion(o.fechaCreacion);
    setFechaProgramada(o.fechaProgramada || "");
    setStatus(o.status);
    setAsunto(o.asunto || "");
    setDireccionServicio(o.direccionServicio || "");
    setObservaciones(o.observaciones || "");
    setTecnico(o.tecnico || null);
    setTplId(o.checklistTemplateId || (templates[0]?.id ?? ""));
    setChecklist(o.checklist || []);
    setLoading(false);
  }, [isEdit, ordenId]);
  const canSave = useMemo(() => Boolean(clienteId), [clienteId]);
  const onPickCliente = (c) => {
    setClienteId(c.id);
    setClienteSnap({
      id: c.id,
      nombre: c.nombre,
      documento: c.documento,
      telefono: c.telefono,
      email: c.email,
      direccion: c.direccion,
      ciudad: c.ciudad
    });
  };
  const applyTemplate = () => {
    const tpl = getChecklistTemplate(tplId);
    if (!tpl) return;
    setChecklist(tpl.items.map((i) => ({ id: uid("chk"), label: i.label, done: false })));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }
    const payload = {
      fechaCreacion,
      fechaProgramada: fechaProgramada || "",
      status,
      clienteId,
      cliente: clienteSnap,
      asunto,
      direccionServicio,
      observaciones,
      tecnicoId: tecnico?.id || "",
      tecnico: tecnico || void 0,
      checklistTemplateId: tplId || "",
      checklist,
      evidencias: isEdit && ordenId ? getOrden(ordenId)?.evidencias || [] : []
    };
    if (isEdit && ordenId) {
      updateOrden(ordenId, payload);
      window.location.href = `/ordenes/${ordenId}`;
      return;
    }
    const nuevo = createOrden(payload);
    window.location.href = `/ordenes/${nuevo.id}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cargando orden..." }) });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: isEdit ? "Editar orden" : "Nueva orden" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Cliente + programación + checklist + evidencias." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/ordenes", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Volver"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: !canSave,
            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`,
            children: [
              /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
              " Guardar"
            ]
          }
        ),
        isEdit && ordenId ? /* @__PURE__ */ jsxs("a", { href: `/ordenes/${ordenId}/evidencias`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" }),
          " Evidencias"
        ] }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsx(ClienteSelector, { value: clienteId, onChange: onPickCliente }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Programación" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Fecha creación" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: fechaCreacion,
                  onChange: (e) => setFechaCreacion(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Fecha programada" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: fechaProgramada,
                  onChange: (e) => setFechaProgramada(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Estado" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: status,
                  onChange: (e) => setStatus(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "pendiente", children: "Pendiente" }),
                    /* @__PURE__ */ jsx("option", { value: "en_progreso", children: "En progreso" }),
                    /* @__PURE__ */ jsx("option", { value: "en_revision", children: "En revisión" }),
                    /* @__PURE__ */ jsx("option", { value: "finalizada", children: "Finalizada" }),
                    /* @__PURE__ */ jsx("option", { value: "cancelada", children: "Cancelada" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Asunto" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: asunto,
                onChange: (e) => setAsunto(e.target.value),
                className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                placeholder: "Ej: Instalación 8 cámaras + NVR"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Dirección del servicio" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: direccionServicio,
                onChange: (e) => setDireccionServicio(e.target.value),
                className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                placeholder: "Ej: Cra 10 # 12-34"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Observaciones" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: observaciones,
                onChange: (e) => setObservaciones(e.target.value),
                className: "min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                placeholder: "Observaciones internas, accesos, contacto, horario..."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4" }),
              " Checklist"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: tplId,
                  onChange: (e) => setTplId(e.target.value),
                  className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  children: templates.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.nombre }, t.id))
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: applyTemplate,
                  className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50",
                  children: "Cargar plantilla"
                }
              ),
              /* @__PURE__ */ jsx("a", { href: "/ordenes/checklists", className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50", children: "Gestionar" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(ChecklistEditor, { checklist, onChange: setChecklist })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-5", children: [
        /* @__PURE__ */ jsx(TecnicoAssign, { value: tecnico, onChange: setTecnico }),
        isEdit && ordenId ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Acciones" }),
          /* @__PURE__ */ jsx("a", { href: `/ordenes/${ordenId}`, className: "block rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm", children: "Ver detalle" }),
          /* @__PURE__ */ jsx("a", { href: `/ordenes/${ordenId}/evidencias`, className: "block rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm", children: "Evidencias" })
        ] }) : null
      ] })
    ] })
  ] });
}

export { OrdenForm as O };
