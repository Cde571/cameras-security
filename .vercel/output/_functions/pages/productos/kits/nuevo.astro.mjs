import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { l as listProductos, h as createKit } from '../../../chunks/productoLocalService_BY7j_gu7.mjs';
export { renderers } from '../../../renderers.mjs';

function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function KitForm() {
  const productos = useMemo(() => listProductos("", { activo: "active" }), []);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [descuentoPct, setDescuentoPct] = useState(0);
  const [precioFijo, setPrecioFijo] = useState("");
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (productos.length && items.length === 0) {
      setItems([{ productId: productos[0].id, qty: 1 }]);
    }
  }, [productos]);
  const subtotal = useMemo(() => {
    let s = 0;
    for (const it of items) {
      const p = productos.find((pp) => pp.id === it.productId);
      if (!p) continue;
      s += Number(p.precio || 0) * Number(it.qty || 0);
    }
    return s;
  }, [items, productos]);
  const total = useMemo(() => {
    if (precioFijo !== "") return Number(precioFijo || 0);
    const d = Number(descuentoPct || 0);
    return subtotal * (1 - d / 100);
  }, [subtotal, descuentoPct, precioFijo]);
  const canSave = nombre.trim().length >= 3 && items.length > 0;
  const setItem = (idx, patch) => {
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };
  const addItem = () => {
    if (!productos.length) return;
    setItems((prev) => [...prev, { productId: productos[0].id, qty: 1 }]);
  };
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return alert("Nombre (mín 3) e items requeridos.");
    createKit({
      nombre,
      descripcion,
      items: items.map((it) => ({ productId: it.productId, qty: Number(it.qty || 1) })),
      descuentoPct: precioFijo === "" ? Number(descuentoPct || 0) : void 0,
      precioFijo: precioFijo === "" ? void 0 : Number(precioFijo || 0),
      activo: true
    });
    window.location.href = "/productos/kits";
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Crear kit" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Paquete de productos con descuento o precio fijo." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/productos/kits", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Volver"
        ] }),
        /* @__PURE__ */ jsxs("button", { disabled: !canSave, className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`, children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          "Guardar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Datos del kit" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Nombre *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: nombre,
              onChange: (e) => setNombre(e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Ej: Kit 4 cámaras + instalación"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Descripción" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: descripcion,
              onChange: (e) => setDescripcion(e.target.value),
              className: "min-h-[110px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Condiciones, alcance, etc."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Descuento %" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: descuentoPct,
                onChange: (e) => setDescuentoPct(Number(e.target.value || 0)),
                disabled: precioFijo !== "",
                className: `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 ${precioFijo !== "" ? "bg-gray-100 border-gray-200" : "border-gray-300"}`
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500", children: "Se desactiva si usas precio fijo." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Precio fijo (opcional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: precioFijo,
                onChange: (e) => setPrecioFijo(e.target.value === "" ? "" : Number(e.target.value)),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-gray-50 p-4 text-sm text-gray-700 space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money(subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money(total) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Items" }),
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: addItem, className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            " Agregar item"
          ] })
        ] }),
        items.map((it, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 p-3 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-gray-800", children: [
              "Item ",
              idx + 1
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeItem(idx), className: "rounded-lg border border-gray-300 p-2 hover:bg-gray-50", title: "Eliminar", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 items-end", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Producto" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: it.productId,
                  onChange: (e) => setItem(idx, { productId: e.target.value }),
                  className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
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
                  value: it.qty,
                  onChange: (e) => setItem(idx, { qty: Number(e.target.value || 1) }),
                  className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                }
              )
            ] })
          ] })
        ] }, idx)),
        !productos.length ? /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800", children: "No hay productos activos para armar kits. Crea productos primero en /productos/nuevo." }) : null
      ] })
    ] })
  ] });
}

const $$Nuevo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Crear Kit - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "KitForm", KitForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/productos/KitForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/kits/nuevo.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/kits/nuevo.astro";
const $$url = "/productos/kits/nuevo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nuevo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
