import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderSlot } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout, f as fetchCurrentUser, l as login } from '../../chunks/MainLayout_DCJG7FNs.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';
export { renderers } from '../../renderers.mjs';

const $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Acceso | Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-slate-100"> ${renderSlot($$result2, $$slots["default"])} </div> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/layouts/AuthLayout.astro", void 0);

function getNextUrl() {
  if (typeof window === "undefined") return "/";
  const next = new URLSearchParams(window.location.search).get("next");
  return next || "/";
}
function LoginForm() {
  const [email, setEmail] = useState("admin@empresa.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const current = await fetchCurrentUser();
      if (!mounted) return;
      if (current?.id) {
        window.location.href = getNextUrl();
        return;
      }
      setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const canSubmit = useMemo(() => {
    return email.trim().length >= 5 && password.trim().length >= 3 && !loading;
  }, [email, password, loading]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = getNextUrl();
    } catch (err) {
      setError(err?.message || "No fue posible iniciar sesión");
      setLoading(false);
    }
  };
  if (checking) {
    return /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Verificando sesión..." }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Iniciar sesión" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Acceso con cookie de sesión segura y middleware." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4 p-6", children: [
      error ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700", children: error }) : null,
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Email" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2", children: [
          /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: email,
              onChange: (e) => setEmail(e.target.value),
              type: "email",
              className: "w-full text-sm outline-none",
              placeholder: "admin@empresa.com",
              autoComplete: "email"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-600", children: "Contraseña" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2", children: [
          /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: password,
              onChange: (e) => setPassword(e.target.value),
              type: "password",
              className: "w-full text-sm outline-none",
              placeholder: "••••••••",
              autoComplete: "current-password"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: !canSubmit,
          className: `inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-white ${canSubmit ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-blue-300"}`,
          children: [
            /* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4" }),
            loading ? "Ingresando..." : "Ingresar"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600", children: [
        "Usuario inicial:",
        /* @__PURE__ */ jsxs("div", { className: "mt-2 rounded-lg bg-white px-3 py-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Email:" }),
            " admin@empresa.com"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Password:" }),
            " admin123"
          ] })
        ] })
      ] })
    ] })
  ] }) });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Login - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/auth/LoginForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/auth/login.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/auth/login.astro";
const $$url = "/auth/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
