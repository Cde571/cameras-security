import { jsx, jsxs } from 'react/jsx-runtime';
import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { g as getProductoMeta, j as getProducto, u as updateProducto, f as createProducto } from './productoLocalService_BY7j_gu7.mjs';

function num(v) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}
function ProductoForm({ mode, productoId }) {
  const isEdit = mode === "edit";
  const meta = useMemo(() => getProductoMeta(), []);
  const [loading, setLoading] = useState(isEdit);
  const [form, setForm] = useState({
    nombre: "",
    sku: "",
    categoria: meta.categorias[0] || "",
    marca: meta.marcas[0] || "",
    unidad: "unidad",
    costo: 0,
    precio: 0,
    ivaPct: 19,
    activo: true
  });
  useEffect(() => {
    if (!isEdit || !productoId) return;
    const p = getProducto(productoId);
    if (p) {
      setForm({
        nombre: p.nombre || "",
        sku: p.sku || "",
        categoria: p.categoria || meta.categorias[0] || "",
        marca: p.marca || meta.marcas[0] || "",
        unidad: p.unidad || "unidad",
        costo: Number(p.costo || 0),
        precio: Number(p.precio || 0),
        ivaPct: Number(p.ivaPct ?? 19),
        activo: p.activo !== false
      });
    }
    setLoading(false);
  }, [isEdit, productoId]);
  const canSave = useMemo(() => form.nombre.trim().length >= 3, [form.nombre]);
  const utilidad = useMemo(() => Number(form.precio) - Number(form.costo), [form.precio, form.costo]);
  const margenPct = useMemo(() => form.precio > 0 ? utilidad / form.precio * 100 : 0, [utilidad, form.precio]);
  const precioConIva = useMemo(() => form.precio * (1 + (form.ivaPct || 0) / 100), [form.precio, form.ivaPct]);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return alert("El nombre del producto es obligatorio (mínimo 3 caracteres).");
    if (isEdit && productoId) {
      updateProducto(productoId, {
        ...form,
        costo: num(form.costo),
        precio: num(form.precio),
        ivaPct: num(form.ivaPct)
      });
      window.location.href = "/productos";
      return;
    }
    createProducto({
      ...form,
      costo: num(form.costo),
      precio: num(form.precio),
      ivaPct: num(form.ivaPct)
    });
    window.location.href = "/productos";
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cargando producto..." }) });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: isEdit ? "Editar producto" : "Crear producto" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: isEdit ? "Actualiza el catálogo." : "Agrega un producto para cotizaciones y kits." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/productos", className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50", children: [
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
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Datos" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Nombre *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.nombre,
              onChange: (e) => set("nombre", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Ej: Cámara IP 4MP"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "SKU" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.sku,
              onChange: (e) => set("sku", e.target.value),
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
              placeholder: "Ej: CAM-IP-4MP-01"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Categoría" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: form.categoria,
                onChange: (e) => set("categoria", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200",
                children: meta.categorias.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Marca" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: form.marca,
                onChange: (e) => set("marca", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200",
                children: meta.marcas.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Unidad" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: form.unidad,
                onChange: (e) => set("unidad", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200",
                placeholder: "unidad / metro / paquete"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Estado" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: form.activo ? "1" : "0",
                onChange: (e) => set("activo", e.target.value === "1"),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "1", children: "Activo" }),
                  /* @__PURE__ */ jsx("option", { value: "0", children: "Inactivo" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Precios" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Costo" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: form.costo,
                onChange: (e) => set("costo", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Precio venta" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: form.precio,
                onChange: (e) => set("precio", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "IVA %" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: form.ivaPct,
                onChange: (e) => set("ivaPct", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-gray-50 p-4 text-sm text-gray-700 space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Utilidad" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money(utilidad) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Margen" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
              margenPct.toFixed(1),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Precio con IVA" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: money(precioConIva) })
          ] })
        ] })
      ] })
    ] })
  ] });
}

export { ProductoForm as P };
