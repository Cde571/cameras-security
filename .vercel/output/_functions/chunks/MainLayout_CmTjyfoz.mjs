import { e as createComponent, f as createAstro, h as addAttribute, n as renderHead, k as renderComponent, l as renderSlot, r as renderTemplate } from './astro/server_BUC8yk9S.mjs';
import 'piccolore';
/* empty css                         */
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Users, Package, FileText, Wrench, FileCheck, DollarSign, CreditCard, BarChart3, Settings, ChevronDown, ChevronRight, X, Menu, Search, Bell, LogOut } from 'lucide-react';
import { i as listUsuarios, m as getUsuarioByEmail, n as setUsuarioUltimoAcceso } from './configLocalService_C83i_HSE.mjs';

const SESSION_KEY = "coti_session_v1";
const SPLASH_FLAG_KEY$1 = "coti_show_login_splash";
function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `tok_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function mapUsuarioToUser(u) {
  return {
    id: u.id,
    name: u.nombre,
    email: u.email,
    role: u.rol
  };
}
function getSession() {
  if (typeof window === "undefined") return null;
  return safeParse(localStorage.getItem(SESSION_KEY), null);
}
function getCurrentUser() {
  return getSession()?.user ?? null;
}
function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
function listAuthUsers() {
  return listUsuarios();
}
function login(email, password) {
  if (typeof window === "undefined") throw new Error("login debe ejecutarse en el browser");
  const e = (email || "").trim().toLowerCase();
  const p = (password || "").trim();
  if (!e || !p) {
    throw new Error("Ingresa email y contraseña");
  }
  const found = getUsuarioByEmail(e);
  if (!found || found.password !== p) {
    throw new Error("Credenciales inválidas");
  }
  if (!found.activo) {
    throw new Error("Este usuario está inactivo");
  }
  const session = {
    token: uid(),
    user: mapUsuarioToUser(found),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem(SPLASH_FLAG_KEY$1, "1");
  setUsuarioUltimoAcceso(found.id, session.createdAt);
  return session;
}

function roleLabel$1(role) {
  if (role === "admin") return "Administrador";
  if (role === "tecnico") return "Técnico";
  if (role === "ventas") return "Ventas";
  return "Usuario";
}
function initialsFromName$1(name) {
  const base = (name || "Usuario").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "US";
}
function Sidebar({ currentPath: currentPathProp, user, badges }) {
  const [currentPath, setCurrentPath] = useState(currentPathProp ?? "/");
  const [openMenus, setOpenMenus] = useState([]);
  const [sessionUser, setSessionUser] = useState(() => getCurrentUser());
  useEffect(() => {
    if (!currentPathProp && typeof window !== "undefined") {
      setCurrentPath(window.location.pathname || "/");
    }
    setSessionUser(getCurrentUser());
  }, [currentPathProp]);
  const effectiveUser = useMemo(() => {
    if (sessionUser?.id) {
      return {
        name: sessionUser.name,
        email: sessionUser.email,
        initials: initialsFromName$1(sessionUser.name),
        role: roleLabel$1(sessionUser.role)
      };
    }
    return {
      name: user?.name || "Admin",
      email: user?.email || "admin@empresa.com",
      initials: user?.initials || initialsFromName$1(user?.name || "Admin"),
      role: user?.role || "Administrador"
    };
  }, [sessionUser, user]);
  const isAdmin = sessionUser?.role === "admin" || effectiveUser.role === "Administrador";
  const menuItems = useMemo(() => {
    const base = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
      {
        id: "clientes",
        label: "Clientes",
        icon: Users,
        submenu: [
          { label: "Listado de clientes", href: "/clientes" },
          { label: "Crear cliente", href: "/clientes/nuevo" },
          { label: "Importar/Exportar", href: "/clientes/exportar" }
        ]
      },
      {
        id: "productos",
        label: "Productos",
        icon: Package,
        submenu: [
          { label: "Catálogo", href: "/productos" },
          { label: "Crear producto", href: "/productos/nuevo" },
          { label: "Kits / Combos", href: "/productos/kits" },
          { label: "Importar desde Excel", href: "/productos/importar" },
          { label: "Categorías y Marcas", href: "/productos/categorias" }
        ]
      },
      {
        id: "cotizaciones",
        label: "Cotizaciones",
        icon: FileText,
        badge: badges?.cotizaciones ?? 8,
        submenu: [
          { label: "Listado", href: "/cotizaciones" },
          { label: "Nueva cotización", href: "/cotizaciones/nueva" },
          { label: "Plantillas de texto", href: "/cotizaciones/plantillas" }
        ]
      },
      {
        id: "ordenes",
        label: "Órdenes de trabajo",
        icon: Wrench,
        badge: badges?.ordenes ?? 3,
        submenu: [
          { label: "Listado", href: "/ordenes" },
          { label: "Nueva orden", href: "/ordenes/nueva" },
          { label: "Checklists", href: "/ordenes/checklists" }
        ]
      },
      {
        id: "actas",
        label: "Actas de entrega",
        icon: FileCheck,
        submenu: [
          { label: "Listado", href: "/actas" },
          { label: "Nueva acta", href: "/actas/nueva" }
        ]
      },
      {
        id: "cobros",
        label: "Cuentas de cobro",
        icon: DollarSign,
        submenu: [
          { label: "Listado", href: "/cobros" },
          { label: "Nueva cuenta", href: "/cobros/nueva" }
        ]
      },
      {
        id: "pagos",
        label: "Pagos y cartera",
        icon: CreditCard,
        submenu: [
          { label: "Resumen", href: "/pagos" },
          { label: "Registrar pago", href: "/pagos/registrar" },
          { label: "Cartera", href: "/pagos/cartera" }
        ]
      },
      {
        id: "reportes",
        label: "Reportes",
        icon: BarChart3,
        submenu: [
          { label: "Dashboard", href: "/reportes" },
          { label: "Ventas", href: "/reportes/ventas" },
          { label: "Productos", href: "/reportes/productos" },
          { label: "Clientes", href: "/reportes/clientes" },
          { label: "Márgenes", href: "/reportes/margenes" }
        ]
      }
    ];
    if (isAdmin) {
      base.push({
        id: "config",
        label: "Configuración",
        icon: Settings,
        submenu: [
          { label: "Empresa", href: "/config/empresa" },
          { label: "Numeración", href: "/config/numeracion" },
          { label: "Impuestos", href: "/config/impuestos" },
          { label: "Usuarios y roles", href: "/config/usuarios" },
          { label: "Plantillas", href: "/config/plantillas" },
          { label: "Backup", href: "/config/backup" }
        ]
      });
    }
    return base;
  }, [badges, isAdmin]);
  const isActiveHref = (href) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(href + "/");
  };
  const isSubmenuActive = (item) => item.submenu?.some((s) => isActiveHref(s.href)) ?? false;
  useEffect(() => {
    const activeParents = menuItems.filter((i) => i.submenu && i.submenu.length > 0).filter((i) => isSubmenuActive(i)).map((i) => i.id);
    if (activeParents.length) {
      setOpenMenus((prev) => Array.from(/* @__PURE__ */ new Set([...prev, ...activeParents])));
    }
  }, [currentPath, menuItems]);
  const toggleMenu = (menuId) => {
    setOpenMenus(
      (prev) => prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col bg-white", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-4 py-4", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/logo-omnivision.png",
          alt: "Logo Omnivisión",
          className: "h-full w-full object-contain scale-[1.65] drop-shadow-sm",
          loading: "eager"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[16px] font-extrabold leading-tight text-gray-900", children: "Cotizaciones" }),
        /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[11px] font-medium tracking-wide text-gray-500", children: "Sistema de gestión" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto p-4", children: /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: menuItems.map((item) => {
      const Icon = item.icon;
      const hasSubmenu = !!item.submenu?.length;
      const isOpen = openMenus.includes(item.id);
      const parentActive = item.href ? isActiveHref(item.href) : isSubmenuActive(item);
      return /* @__PURE__ */ jsxs("li", { children: [
        item.href ? /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.href,
            className: [
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
              parentActive ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-700 hover:bg-gray-50"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm", children: item.label }),
              item.badge ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white", children: item.badge }) : null
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => toggleMenu(item.id),
            className: [
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
              parentActive ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-700 hover:bg-gray-50"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "flex-1 text-left text-sm", children: item.label }),
              item.badge ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white", children: item.badge }) : null,
              hasSubmenu ? isOpen ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) : null
            ]
          }
        ),
        hasSubmenu && isOpen ? /* @__PURE__ */ jsx("ul", { className: "ml-8 mt-1 space-y-1", children: item.submenu.map((subItem) => {
          const active = isActiveHref(subItem.href);
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: subItem.href,
              className: [
                "block rounded-lg px-3 py-2 text-sm transition-all",
                active ? "bg-blue-50 font-medium text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              ].join(" "),
              children: subItem.label
            }
          ) }, subItem.href);
        }) }) : null
      ] }, item.id);
    }) }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg bg-gray-50 p-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-blue-500", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-white", children: effectiveUser.initials }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-gray-800", children: effectiveUser.role }),
        /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-gray-500", children: effectiveUser.email })
      ] })
    ] }) })
  ] });
}

function roleLabel(role) {
  if (role === "admin") return "Administrador";
  if (role === "tecnico") return "Técnico";
  if (role === "ventas") return "Ventas";
  return "Usuario";
}
function initialsFromName(name) {
  const base = (name).trim();
  const parts = base.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "US";
}
function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);
  const notifications = useMemo(() => [
    { id: 1, type: "warning", message: "Cotización COT-2024-032 vence mañana", time: "Hace 5 min" },
    { id: 2, type: "success", message: "Pago recibido de Hotel Plaza Real", time: "Hace 1 hora" },
    { id: 3, type: "info", message: "Nueva orden OT-2024-124 creada", time: "Hace 2 horas" }
  ], []);
  const userName = currentUser?.name || "Usuario";
  const userRole = roleLabel(currentUser?.role);
  const userInitials = initialsFromName(userName);
  const doLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMobileMenuOpen(!mobileMenuOpen),
          className: "rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden",
          children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-gray-600" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5 text-gray-600" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "hidden max-w-md flex-1 items-center md:flex", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar clientes, cotizaciones...",
            className: "w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowNotifications(!showNotifications),
            className: "relative rounded-lg p-2 transition-colors hover:bg-gray-100",
            children: [
              /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-gray-600" }),
              notifications.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" })
            ]
          }
        ),
        showNotifications && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: "Notificaciones" }),
            /* @__PURE__ */ jsx("span", { className: "rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600", children: notifications.length })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-y-auto", children: notifications.map((notification) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "cursor-pointer border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50",
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: [
                      "mt-2 h-2 w-2 flex-shrink-0 rounded-full",
                      notification.type === "warning" ? "bg-yellow-500" : "",
                      notification.type === "success" ? "bg-green-500" : "",
                      notification.type === "info" ? "bg-blue-500" : ""
                    ].join(" ")
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800", children: notification.message }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: notification.time })
                ] })
              ] })
            },
            notification.id
          )) }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 p-3", children: /* @__PURE__ */ jsx("button", { className: "w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700", children: "Ver todas las notificaciones" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/config",
          className: "rounded-lg p-2 transition-colors hover:bg-gray-100",
          title: "Configuración",
          children: /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5 text-gray-600" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "h-8 w-px bg-gray-200" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "hidden text-right md:block", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: userName }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: userRole })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: userInitials }) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: doLogout,
          className: "rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600",
          title: "Cerrar sesión",
          children: /* @__PURE__ */ jsx(LogOut, { className: "h-5 w-5" })
        }
      )
    ] }),
    showNotifications && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowNotifications(false) })
  ] });
}

function isPublicPath(pathname) {
  return pathname.startsWith("/auth/login") || pathname.startsWith("/api/");
}
function canAccess(pathname, role) {
  if (!role) return false;
  if (pathname.startsWith("/config")) return role === "admin";
  return true;
}
function RequireAuth() {
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const pathname = window.location.pathname || "/";
    if (isPublicPath(pathname)) {
      setChecking(false);
      return;
    }
    const current = getCurrentUser();
    if (!current?.id) {
      const next = encodeURIComponent(pathname + window.location.search);
      window.location.replace(`/auth/login?next=${next}`);
      return;
    }
    if (!canAccess(pathname, current.role)) {
      window.location.replace("/");
      return;
    }
    setChecking(false);
  }, []);
  if (!checking) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Validando acceso..." }) }) });
}

const LOGO_CANDIDATES = [
  "/logo-omnivision.png",
  "/f0fe1d83-bed3-4038-8e4d-c491e4ce43fd-removebg-preview.png",
  "/image-removebg-preview.png"
];
const SPLASH_FLAG_KEY = "coti_show_login_splash";
function AppSplash() {
  const [shouldRender, setShouldRender] = useState(false);
  const [hide, setHide] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const currentLogo = useMemo(() => {
    return LOGO_CANDIDATES[logoIndex] || LOGO_CANDIDATES[0];
  }, [logoIndex]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldShow = sessionStorage.getItem(SPLASH_FLAG_KEY) === "1";
    if (!shouldShow) return;
    sessionStorage.removeItem(SPLASH_FLAG_KEY);
    setShouldRender(true);
    const hideTimer = window.setTimeout(() => {
      setHide(true);
    }, 950);
    const removeTimer = window.setTimeout(() => {
      setShouldRender(false);
    }, 1600);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);
  if (!shouldRender) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: [
        "fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-all duration-700 ease-out",
        hide ? "pointer-events-none opacity-0" : "opacity-100"
      ].join(" "),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: [
              "flex flex-col items-center justify-center transition-all duration-700 ease-out",
              hide ? "scale-110 opacity-0" : "scale-100 opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsx("div", { className: "relative flex h-36 w-36 items-center justify-center", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: currentLogo,
                  alt: "Logo Omnivisión",
                  className: "h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)]",
                  loading: "eager",
                  onError: () => {
                    if (logoIndex < LOGO_CANDIDATES.length - 1) {
                      setLogoIndex((prev) => prev + 1);
                    }
                  }
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 text-center", children: [
                /* @__PURE__ */ jsx("h1", { className: "text-2xl font-extrabold tracking-tight text-slate-900", children: "Omnivisión" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-medium tracking-wide text-slate-500", children: "Sistema de cotizaciones" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200", children: /* @__PURE__ */ jsx("div", { className: "app-splash-bar h-full w-full rounded-full bg-blue-600" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        .app-splash-bar {
          transform-origin: left center;
          animation: splashProgress 1.2s ease-out forwards;
        }

        @keyframes splashProgress {
          from {
            transform: scaleX(0);
            opacity: 0.8;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      ` })
      ]
    }
  );
}

const $$Astro = createAstro();
const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const {
    title,
    description = "Sistema de cotizaciones profesional"
  } = Astro2.props;
  const currentPath = Astro2.url.pathname;
  const badges = {
    cotizaciones: 8,
    ordenes: 3
  };
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-gray-50 text-gray-900 antialiased"> ${renderComponent($$result, "AppSplash", AppSplash, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/ui/AppSplash", "client:component-export": "default" })} ${renderComponent($$result, "RequireAuth", RequireAuth, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/auth/RequireAuth", "client:component-export": "default" })} <div class="flex h-screen overflow-hidden"> <aside class="w-72 flex-shrink-0 border-r border-gray-200 bg-white"> ${renderComponent($$result, "Sidebar", Sidebar, { "client:load": true, "currentPath": currentPath, "badges": badges, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/navigation/Sidebar", "client:component-export": "default" })} </aside> <div class="flex min-w-0 flex-1 flex-col"> <header class="border-b border-gray-200 bg-white"> ${renderComponent($$result, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/navigation/Header", "client:component-export": "default" })} </header> <main class="flex-1 overflow-y-auto p-6"> ${renderSlot($$result, $$slots["default"])} </main> </div> </div> </body></html>`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/layouts/MainLayout.astro", void 0);

export { $$MainLayout as $, login as a, getSession as g, listAuthUsers as l };
