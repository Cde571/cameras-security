import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { KeyRound, Plus, Trash2 } from 'lucide-react';
import { i as listUsuarios, j as upsertUsuario, k as deleteUsuario } from '../../chunks/configLocalService_DaV2BKqn.mjs';
export { renderers } from '../../renderers.mjs';

function UsuariosManager() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    rol: "ventas",
    password: "",
    activo: true
  });
  const refresh = () => setList(listUsuarios());
  useEffect(() => {
    refresh();
  }, []);
  const create = () => {
    try {
      if (form.nombre.trim().length < 3) throw new Error("Nombre mínimo 3 caracteres");
      if (!form.email.trim()) throw new Error("Email requerido");
      if (form.password.trim().length < 4) throw new Error("La contraseña debe tener mínimo 4 caracteres");
      upsertUsuario({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        rol: form.rol,
        password: form.password.trim(),
        activo: form.activo
      });
      setForm({
        nombre: "",
        email: "",
        rol: "ventas",
        password: "",
        activo: true
      });
      refresh();
    } catch (err) {
      alert(err?.message ?? "No fue posible crear el usuario");
    }
  };
  const update = (id, patch) => {
    try {
      const cur = list.find((u) => u.id === id);
      if (!cur) return;
      upsertUsuario({ ...cur, ...patch });
      refresh();
    } catch (err) {
      alert(err?.message ?? "No fue posible actualizar el usuario");
    }
  };
  const remove = (id) => {
    if (!confirm("¿Eliminar usuario?")) return;
    deleteUsuario(id);
    refresh();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Usuarios y roles" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Estos usuarios ahora controlan el inicio de sesión del sistema." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-900", children: "Crear usuario" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-5", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: form.nombre,
            onChange: (e) => setForm((p) => ({ ...p, nombre: e.target.value })),
            placeholder: "Nombre",
            className: "rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: form.email,
            onChange: (e) => setForm((p) => ({ ...p, email: e.target.value })),
            placeholder: "Email",
            className: "rounded-lg border border-gray-300 px-3 py-2 text-sm"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: form.rol,
            onChange: (e) => setForm((p) => ({ ...p, rol: e.target.value })),
            className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "admin", children: "admin" }),
              /* @__PURE__ */ jsx("option", { value: "ventas", children: "ventas" }),
              /* @__PURE__ */ jsx("option", { value: "tecnico", children: "tecnico" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(KeyRound, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.password,
              onChange: (e) => setForm((p) => ({ ...p, password: e.target.value })),
              placeholder: "Contraseña",
              className: "w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: create,
            className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
              "Agregar"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-sm text-gray-600", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: form.activo,
            onChange: (e) => setForm((p) => ({ ...p, activo: e.target.checked }))
          }
        ),
        "Crear como usuario activo"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700", children: "Tip: si no quieres cambiar la contraseña de un usuario existente, deja su valor actual." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800", children: [
        list.length,
        " usuario(s)"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Nombre" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Email" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Rol" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Contraseña" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Activo" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left font-semibold", children: "Último acceso" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Acción" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: list.map((u) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              value: u.nombre,
              onChange: (e) => update(u.id, { nombre: e.target.value }),
              className: "w-full rounded-lg border border-gray-200 px-3 py-2"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              value: u.email,
              onChange: (e) => update(u.id, { email: e.target.value }),
              className: "w-full rounded-lg border border-gray-200 px-3 py-2"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs(
            "select",
            {
              value: u.rol,
              onChange: (e) => update(u.id, { rol: e.target.value }),
              className: "rounded-lg border border-gray-200 bg-white px-3 py-2",
              children: [
                /* @__PURE__ */ jsx("option", { value: "admin", children: "admin" }),
                /* @__PURE__ */ jsx("option", { value: "ventas", children: "ventas" }),
                /* @__PURE__ */ jsx("option", { value: "tecnico", children: "tecnico" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              value: u.password,
              onChange: (e) => update(u.id, { password: e.target.value }),
              className: "w-full rounded-lg border border-gray-200 px-3 py-2"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: u.activo,
              onChange: (e) => update(u.id, { activo: e.target.checked })
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-xs text-gray-500", children: u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleString("es-CO") : "Sin acceso" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => remove(u.id),
              className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" }),
                "Eliminar"
              ]
            }
          ) })
        ] }, u.id)) })
      ] }) })
    ] })
  ] });
}

const $$Usuarios = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Usuarios - Configuraci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "UsuariosManager", UsuariosManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/config/UsuariosManager", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/usuarios.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/usuarios.astro";
const $$url = "/config/usuarios";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Usuarios,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
