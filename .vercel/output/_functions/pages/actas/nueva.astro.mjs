import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { C as ClienteSelector } from '../../chunks/ClienteSelector_C9mtMHCU.mjs';
import { c as createActa } from '../../chunks/actaLocalService_BDWGoUzL.mjs';
export { renderers } from '../../renderers.mjs';

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `itm_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function ActivosTable({ value, onChange }) {
  const add = () => onChange([{ id: uid(), tipo: "camara", descripcion: "Nuevo ítem", cantidad: 1 }, ...value]);
  const remove = (id) => onChange(value.filter((v) => v.id !== id));
  const set = (id, patch) => onChange(value.map((v) => v.id === id ? { ...v, ...patch } : v));
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: "Activos / elementos entregados" }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: add, className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Agregar"
      ] })
    ] }),
    value.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-5 text-sm text-gray-600", children: "Agrega los elementos entregados." }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Tipo" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Descripción" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Cant" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Serial" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Ubicación" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acción" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: value.map((a) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: a.tipo,
            onChange: (e) => set(a.id, { tipo: e.target.value }),
            className: "rounded-lg border border-gray-200 bg-white px-2 py-2",
            children: [
              /* @__PURE__ */ jsx("option", { value: "camara", children: "Cámara" }),
              /* @__PURE__ */ jsx("option", { value: "dvr_nvr", children: "DVR / NVR" }),
              /* @__PURE__ */ jsx("option", { value: "disco", children: "Disco" }),
              /* @__PURE__ */ jsx("option", { value: "accesorio", children: "Accesorio" }),
              /* @__PURE__ */ jsx("option", { value: "cableado", children: "Cableado" }),
              /* @__PURE__ */ jsx("option", { value: "otro", children: "Otro" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: a.descripcion,
            onChange: (e) => set(a.id, { descripcion: e.target.value }),
            className: "w-full rounded-lg border border-gray-200 px-3 py-2"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: a.cantidad,
            onChange: (e) => set(a.id, { cantidad: Number(e.target.value || 0) }),
            className: "w-24 rounded-lg border border-gray-200 px-3 py-2 text-right"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: a.serial || "",
            onChange: (e) => set(a.id, { serial: e.target.value }),
            className: "w-full rounded-lg border border-gray-200 px-3 py-2"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: a.ubicacion || "",
            onChange: (e) => set(a.id, { ubicacion: e.target.value }),
            className: "w-full rounded-lg border border-gray-200 px-3 py-2"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => remove(a.id), className: "rounded-lg border border-gray-300 p-2 hover:bg-white", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) }) })
      ] }, a.id)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 py-3 text-xs text-gray-500 border-t border-gray-200", children: "Tip: si quieres, luego agregamos “notas por ítem” en un modal." })
  ] });
}

function FirmaCanvas({ value, onChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 720;
    canvas.height = 220;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
  }, []);
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
  };
  const start = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const move = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };
  const end = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange(canvas.toDataURL("image/png"));
  };
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange(canvas.toDataURL("image/png"));
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: "Firma del cliente" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: clear, className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50", children: "Limpiar" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          className: "w-full rounded-lg border border-gray-200 bg-white touch-none",
          onMouseDown: start,
          onMouseMove: move,
          onMouseUp: end,
          onMouseLeave: end,
          onTouchStart: start,
          onTouchMove: move,
          onTouchEnd: end
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Firma con mouse o con el dedo en móvil." })
    ] })
  ] });
}

function ActaForm() {
  const hoy = useMemo(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), []);
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState(null);
  const [fecha, setFecha] = useState(hoy);
  const [lugar, setLugar] = useState("");
  const [status, setStatus] = useState("borrador");
  const [tecnico, setTecnico] = useState("");
  const [clienteRecibe, setClienteRecibe] = useState("");
  const [docRecibe, setDocRecibe] = useState("");
  const [activos, setActivos] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [firma, setFirma] = useState("");
  const canSave = useMemo(() => Boolean(clienteId) && activos.length > 0, [clienteId, activos.length]);
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
  const onSubmit = (e) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (activos.length === 0) return alert("Agrega al menos 1 activo/ítem entregado.");
    const acta = createActa({
      clienteId,
      cliente: clienteSnap,
      fecha,
      lugar: lugar.trim() || void 0,
      responsables: {
        tecnico: tecnico.trim() || void 0,
        clienteRecibe: clienteRecibe.trim() || void 0,
        documentoRecibe: docRecibe.trim() || void 0
      },
      activos,
      observaciones: observaciones.trim() || void 0,
      firmaClienteDataUrl: firma || void 0,
      status
    });
    window.location.href = `/actas/${acta.id}`;
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Nueva acta" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Cliente + activos entregados + firma." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/actas", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
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
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsx(ClienteSelector, { value: clienteId, onChange: onPickCliente }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Datos del acta" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Fecha" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: fecha,
                  onChange: (e) => setFecha(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Lugar" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: lugar,
                  onChange: (e) => setLugar(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  placeholder: "Ej: Sede principal / Torre B / Bodega..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-3", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Estado" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: status,
                  onChange: (e) => setStatus(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "borrador", children: "Borrador" }),
                    /* @__PURE__ */ jsx("option", { value: "firmada", children: "Firmada" }),
                    /* @__PURE__ */ jsx("option", { value: "enviada", children: "Enviada" }),
                    /* @__PURE__ */ jsx("option", { value: "anulada", children: "Anulada" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Responsables" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Técnico" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: tecnico,
                  onChange: (e) => setTecnico(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  placeholder: "Nombre del técnico"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Recibe" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: clienteRecibe,
                  onChange: (e) => setClienteRecibe(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  placeholder: "Nombre quien recibe"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Documento" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: docRecibe,
                  onChange: (e) => setDocRecibe(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  placeholder: "CC / NIT"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ActivosTable, { value: activos, onChange: setActivos }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Observaciones" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: observaciones,
              onChange: (e) => setObservaciones(e.target.value),
              className: "min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
              placeholder: "Condiciones, capacitación, pruebas, garantías..."
            }
          )
        ] }),
        /* @__PURE__ */ jsx(FirmaCanvas, { value: firma, onChange: setFirma })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Reglas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Para guardar: cliente + mínimo 1 ítem entregado." }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Luego conectamos PDF real con tu `lib/pdf/actaPDF.ts`." })
      ] })
    ] })
  ] });
}

const $$Nueva = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Nueva acta - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ActaForm", ActaForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/actas/ActaForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/actas/nueva.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/actas/nueva.astro";
const $$url = "/actas/nueva";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nueva,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
