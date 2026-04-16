import React, { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Wrench,
  FileCheck,
  DollarSign,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { fetchCurrentUser, getCurrentUser, type User } from "../../lib/repositories/authRepo";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  submenu?: {
    label: string;
    href: string;
  }[];
}

type SidebarProps = {
  currentPath?: string;
  badges?: {
    cotizaciones?: number;
    ordenes?: number;
  };
};

function roleLabel(role?: string) {
  if (role === "admin") return "Administrador";
  if (role === "tecnico") return "Técnico";
  if (role === "ventas") return "Ventas";
  return "Usuario";
}

function initialsFromName(name?: string) {
  const base = (name || "Usuario").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "US";
}

export default function Sidebar({ currentPath: currentPathProp, badges }: SidebarProps) {
  const [currentPath, setCurrentPath] = useState(currentPathProp ?? "/");
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [sessionUser, setSessionUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    if (!currentPathProp && typeof window !== "undefined") {
      setCurrentPath(window.location.pathname || "/");
    }

    let mounted = true;
    fetchCurrentUser().then((user) => {
      if (mounted) setSessionUser(user);
    });

    return () => {
      mounted = false;
    };
  }, [currentPathProp]);

  const effectiveUser = useMemo(() => {
    if (sessionUser?.id) {
      return {
        name: sessionUser.name,
        email: sessionUser.email,
        initials: initialsFromName(sessionUser.name),
        role: roleLabel(sessionUser.role),
      };
    }

    return {
      name: "Usuario",
      email: "",
      initials: "US",
      role: "Usuario",
    };
  }, [sessionUser]);

  const isAdmin = sessionUser?.role === "admin";

  const menuItems: MenuItem[] = useMemo(() => {
    const base: MenuItem[] = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
      {
        id: "clientes",
        label: "Clientes",
        icon: Users,
        submenu: [
          { label: "Listado de clientes", href: "/clientes" },
          { label: "Crear cliente", href: "/clientes/nuevo" },
          { label: "Importar/Exportar", href: "/clientes/exportar" },
        ],
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
          { label: "Categorías y Marcas", href: "/productos/categorias" },
        ],
      },
      {
        id: "cotizaciones",
        label: "Cotizaciones",
        icon: FileText,
        badge: badges?.cotizaciones ?? 8,
        submenu: [
          { label: "Listado", href: "/cotizaciones" },
          { label: "Nueva cotización", href: "/cotizaciones/nueva" },
          { label: "Plantillas de texto", href: "/cotizaciones/plantillas" },
        ],
      },
      {
        id: "ordenes",
        label: "Órdenes de trabajo",
        icon: Wrench,
        badge: badges?.ordenes ?? 3,
        submenu: [
          { label: "Listado", href: "/ordenes" },
          { label: "Nueva orden", href: "/ordenes/nueva" },
          { label: "Checklists", href: "/ordenes/checklists" },
        ],
      },
      {
        id: "actas",
        label: "Actas de entrega",
        icon: FileCheck,
        submenu: [
          { label: "Listado", href: "/actas" },
          { label: "Nueva acta", href: "/actas/nueva" },
        ],
      },
      {
        id: "cobros",
        label: "Cuentas de cobro",
        icon: DollarSign,
        submenu: [
          { label: "Listado", href: "/cobros" },
          { label: "Nueva cuenta", href: "/cobros/nueva" },
        ],
      },
      {
        id: "pagos",
        label: "Pagos y cartera",
        icon: CreditCard,
        submenu: [
          { label: "Resumen", href: "/pagos" },
          { label: "Registrar pago", href: "/pagos/registrar" },
          { label: "Cartera", href: "/pagos/cartera" },
        ],
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
          { label: "Márgenes", href: "/reportes/margenes" },
        ],
      },
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
          { label: "Backup", href: "/config/backup" },
        ],
      });
    }

    return base;
  }, [badges, isAdmin]);

  const isActiveHref = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  const isSubmenuActive = (item: MenuItem) =>
    item.submenu?.some((s) => isActiveHref(s.href)) ?? false;

  useEffect(() => {
    const activeParents = menuItems
      .filter((i) => i.submenu && i.submenu.length > 0)
      .filter((i) => isSubmenuActive(i))
      .map((i) => i.id);

    if (activeParents.length) {
      setOpenMenus((prev) => Array.from(new Set([...prev, ...activeParents])));
    }
  }, [currentPath, menuItems]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 px-4 py-4">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl">
            <img
              src="/logo-omnivision.png"
              alt="Logo Omnivisión"
              className="h-full w-full object-contain scale-[1.65] drop-shadow-sm"
              loading="eager"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-[16px] font-extrabold leading-tight text-gray-900">
              Cotizaciones
            </h1>
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-gray-500">
              Sistema de gestión
            </p>
          </div>
        </a>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = !!item.submenu?.length;
            const isOpen = openMenus.includes(item.id);
            const parentActive = item.href ? isActiveHref(item.href) : isSubmenuActive(item);

            return (
              <li key={item.id}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                      parentActive
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-sm">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.id)}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                      parentActive
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                    {hasSubmenu ? (
                      isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    ) : null}
                  </button>
                )}

                {hasSubmenu && isOpen ? (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.submenu!.map((subItem) => {
                      const active = isActiveHref(subItem.href);
                      return (
                        <li key={subItem.href}>
                          <a
                            href={subItem.href}
                            className={[
                              "block rounded-lg px-3 py-2 text-sm transition-all",
                              active
                                ? "bg-blue-50 font-medium text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            ].join(" ")}
                          >
                            {subItem.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <span className="text-sm font-semibold text-white">{effectiveUser.initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">{effectiveUser.role}</p>
            <p className="truncate text-xs text-gray-500">{effectiveUser.email || "Sesión activa"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

