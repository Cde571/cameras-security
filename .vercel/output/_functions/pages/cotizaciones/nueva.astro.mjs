import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useMemo, useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Save, FileText } from 'lucide-react';
import { C as ClienteSelector } from '../../chunks/ClienteSelector_C9mtMHCU.mjs';
import { l as listProductos, a as listKits, c as calcKitTotal } from '../../chunks/productoLocalService_BY7j_gu7.mjs';
import { c as calcTotales, l as listPlantillas, g as getCotizacion, u as updateCotizacion, a as createCotizacion } from '../../chunks/cotizacionLocalService_CikZvbuZ.mjs';
import { g as getCliente } from '../../chunks/clienteLocalService_BAQfU60Z.mjs';
export { renderers } from '../../renderers.mjs';

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `it_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function ProductoSelector({ onAdd }) {
  const productos = useMemo(() => listProductos("", { activo: "active" }), []);
  const kits = useMemo(() => listKits(""), []);
  const [tab, setTab] = useState("producto");
  const [productId, setProductId] = useState(productos[0]?.id ?? "");
  const [kitId, setKitId] = useState(kits[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [srvNombre, setSrvNombre] = useState("Instalación y configuración");
  const [srvPrecio, setSrvPrecio] = useState(0);
  const [srvIva, setSrvIva] = useState(19);
  const addProducto = () => {
    const p = productos.find((x) => x.id === productId);
    if (!p) return;
    onAdd({
      id: uid(),
      kind: "producto",
      refId: p.id,
      nombre: p.nombre,
      unidad: p.unidad || "unidad",
      qty: Number(qty || 1),
      precio: Number(p.precio || 0),
      ivaPct: Number(p.ivaPct ?? 19),
      costo: Number(p.costo || 0)
    });
  };
  const addKit = () => {
    const k = kits.find((x) => x.id === kitId);
    if (!k) return;
    const tot = calcKitTotal(k);
    onAdd({
      id: uid(),
      kind: "kit",
      refId: k.id,
      nombre: k.nombre,
      unidad: "kit",
      qty: Number(qty || 1),
      precio: Number(tot.total || 0),
      ivaPct: 19
    });
  };
  const addServicio = () => {
    if (!srvNombre.trim()) return;
    onAdd({
      id: uid(),
      kind: "servicio",
      nombre: srvNombre.trim(),
      unidad: "servicio",
      qty: 1,
      precio: Number(srvPrecio || 0),
      ivaPct: Number(srvIva || 0)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Agregar ítems" }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["producto", "kit", "servicio"].map((t) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setTab(t),
        className: `rounded-lg px-3 py-2 text-sm border ${tab === t ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`,
        children: t === "producto" ? "Producto" : t === "kit" ? "Kit" : "Servicio"
      },
      t
    )) }),
    tab === "producto" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Producto" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: productId,
            onChange: (e) => setProductId(e.target.value),
            className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
            children: productos.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.nombre }, p.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Cantidad" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: 1,
            value: qty,
            onChange: (e) => setQty(Number(e.target.value || 1)),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: addProducto, className: "md:col-span-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Agregar producto"
      ] })
    ] }),
    tab === "kit" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Kit" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: kitId,
            onChange: (e) => setKitId(e.target.value),
            className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
            children: kits.map((k) => /* @__PURE__ */ jsx("option", { value: k.id, children: k.nombre }, k.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Cantidad" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: 1,
            value: qty,
            onChange: (e) => setQty(Number(e.target.value || 1)),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: addKit, className: "md:col-span-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Agregar kit"
      ] }),
      kits.length === 0 ? /* @__PURE__ */ jsx("p", { className: "md:col-span-3 text-xs text-gray-500", children: "No hay kits. Crea en /productos/kits." }) : null
    ] }),
    tab === "servicio" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Nombre del servicio" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: srvNombre,
            onChange: (e) => setSrvNombre(e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
            placeholder: "Ej: Instalación y configuración"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Precio" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: srvPrecio,
            onChange: (e) => setSrvPrecio(Number(e.target.value || 0)),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "IVA %" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: srvIva,
            onChange: (e) => setSrvIva(Number(e.target.value || 0)),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: addServicio, className: "md:col-span-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Agregar servicio"
      ] })
    ] })
  ] });
}

function money$1(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function ItemsTable({ items, onChange }) {
  const setItem = (id, patch) => {
    onChange(items.map((it) => it.id === id ? { ...it, ...patch } : it));
  };
  const remove = (id) => onChange(items.filter((it) => it.id !== id));
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-5 py-3", children: /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-gray-800", children: [
      "Ítems (",
      items.length,
      ")"
    ] }) }),
    items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 text-sm text-gray-600", children: "Agrega productos/kits/servicios para continuar." }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Ítem" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Tipo" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Cant." }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Precio" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "IVA%" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Total" }),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acción" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: items.map((it) => {
        const base = Number(it.precio || 0) * Number(it.qty || 0);
        const iva = base * (Number(it.ivaPct || 0) / 100);
        const total = base + iva;
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: it.nombre,
                onChange: (e) => setItem(it.id, { nombre: e.target.value }),
                className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: it.unidad || "unidad" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700", children: it.kind }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: 1,
              value: it.qty,
              onChange: (e) => setItem(it.id, { qty: Number(e.target.value || 1) }),
              className: "w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: it.precio,
              onChange: (e) => setItem(it.id, { precio: Number(e.target.value || 0) }),
              className: "w-36 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: it.ivaPct,
              onChange: (e) => setItem(it.id, { ivaPct: Number(e.target.value || 0) }),
              className: "w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-gray-900", children: money$1(total) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => remove(it.id),
              className: "rounded-lg border border-gray-300 p-2 hover:bg-white",
              title: "Eliminar",
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" })
            }
          ) }) })
        ] }, it.id);
      }) })
    ] })
  ] });
}

function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function TotalesPanel({ items }) {
  const t = useMemo(() => calcTotales(items), [items]);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Totales" }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Subtotal" }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: money(t.subtotal) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "IVA" }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: money(t.iva) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 pt-2 flex justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-800 font-semibold", children: "Total" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-bold", children: money(t.total) })
    ] })
  ] });
}

function CotizacionForm({ mode, cotizacionId }) {
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(isEdit);
  const [clienteId, setClienteId] = useState("");
  const [clienteSnap, setClienteSnap] = useState(null);
  const [fecha, setFecha] = useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [vigenciaDias, setVigenciaDias] = useState(15);
  const [status, setStatus] = useState("borrador");
  const [asunto, setAsunto] = useState("");
  const [condiciones, setCondiciones] = useState("");
  const [notas, setNotas] = useState("");
  const [items, setItems] = useState([]);
  const plantillas = useMemo(() => listPlantillas(""), []);
  const [tplId, setTplId] = useState(plantillas[0]?.id ?? "");
  useEffect(() => {
    if (!isEdit || !cotizacionId) return;
    const c = getCotizacion(cotizacionId);
    if (!c) {
      setLoading(false);
      return;
    }
    setClienteId(c.clienteId);
    setClienteSnap(c.cliente);
    setFecha(c.fecha);
    setVigenciaDias(c.vigenciaDias);
    setStatus(c.status);
    setAsunto(c.asunto || "");
    setCondiciones(c.condiciones || "");
    setNotas(c.notas || "");
    setItems(c.items || []);
    setLoading(false);
  }, [isEdit, cotizacionId]);
  const canSave = useMemo(() => {
    return clienteId && items.length > 0;
  }, [clienteId, items.length]);
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
    const tpl = plantillas.find((t) => t.id === tplId);
    if (!tpl) return;
    setCondiciones(tpl.cuerpo);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecciona un cliente.");
    if (!clienteSnap) {
      const c = getCliente(clienteId);
      if (!c) return alert("Cliente no encontrado.");
      onPickCliente(c);
    }
    if (items.length === 0) return alert("Agrega al menos un ítem.");
    const payload = {
      fecha,
      vigenciaDias: Number(vigenciaDias || 15),
      status,
      clienteId,
      cliente: clienteSnap,
      asunto,
      condiciones,
      notas,
      items
    };
    if (isEdit && cotizacionId) {
      updateCotizacion(cotizacionId, payload);
      window.location.href = `/cotizaciones/${cotizacionId}`;
      return;
    }
    const nuevo = createCotizacion(payload);
    window.location.href = `/cotizaciones/${nuevo.id}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cargando cotización..." }) });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: isEdit ? "Editar cotización" : "Nueva cotización" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Cliente + ítems + condiciones." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/cotizaciones", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Volver"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: !canSave,
            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`,
            children: [
              /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
              "Guardar"
            ]
          }
        ),
        isEdit && cotizacionId ? /* @__PURE__ */ jsxs("a", { href: `/cotizaciones/${cotizacionId}/pdf`, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
          "PDF"
        ] }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsx(ClienteSelector, { value: clienteId, onChange: onPickCliente }),
        /* @__PURE__ */ jsx(ProductoSelector, { onAdd: (it) => setItems((prev) => [it, ...prev]) }),
        /* @__PURE__ */ jsx(ItemsTable, { items, onChange: setItems }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Condiciones / Plantillas" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-2 md:items-end", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Plantilla" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: tplId,
                  onChange: (e) => setTplId(e.target.value),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                  children: plantillas.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.nombre }, t.id))
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: applyTemplate,
                className: "rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50",
                children: "Insertar plantilla"
              }
            ),
            /* @__PURE__ */ jsx("a", { href: "/cotizaciones/plantillas", className: "rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: "Gestionar plantillas" })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: condiciones,
              onChange: (e) => setCondiciones(e.target.value),
              className: "min-h-[180px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Condiciones, garantía, forma de pago, tiempos..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Notas" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: notas,
              onChange: (e) => setNotas(e.target.value),
              className: "min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Notas internas o para el cliente..."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Datos" }),
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
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Vigencia (días)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 1,
                value: vigenciaDias,
                onChange: (e) => setVigenciaDias(Number(e.target.value || 15)),
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
                  /* @__PURE__ */ jsx("option", { value: "borrador", children: "Borrador" }),
                  /* @__PURE__ */ jsx("option", { value: "enviada", children: "Enviada" }),
                  /* @__PURE__ */ jsx("option", { value: "aceptada", children: "Aceptada" }),
                  /* @__PURE__ */ jsx("option", { value: "rechazada", children: "Rechazada" }),
                  /* @__PURE__ */ jsx("option", { value: "vencida", children: "Vencida" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Asunto" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: asunto,
                onChange: (e) => setAsunto(e.target.value),
                className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                placeholder: "Ej: Sistema de 8 cámaras + acceso remoto"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(TotalesPanel, { items })
      ] })
    ] })
  ] });
}

const $$Nueva = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Nueva cotizaci\xF3n - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CotizacionForm", CotizacionForm, { "client:load": true, "mode": "create", "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cotizaciones/CotizacionForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/nueva.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/nueva.astro";
const $$url = "/cotizaciones/nueva";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nueva,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
