// src/components/navigation/Sidebar.tsx
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

type SidebarUser = {
  name: string;
  email: string;
  initials?: string;
  role?: string;
};

type SidebarProps = {
  /** Si lo pasas desde Astro, el active funciona desde el primer render */
  currentPath?: string;
  /** Opcional: info del usuario (footer) */
  user?: SidebarUser;
  /** Opcional: badges dinámicos */
  badges?: {
    cotizaciones?: number;
    ordenes?: number;
  };
};

export default function Sidebar({ currentPath: currentPathProp, user, badges }: SidebarProps) {
  const [currentPath, setCurrentPath] = useState(currentPathProp ?? "/");
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Si no llega desde Astro, lo tomamos del navegador
  useEffect(() => {
    if (!currentPathProp && typeof window !== "undefined") {
      setCurrentPath(window.location.pathname || "/");
    }
  }, [currentPathProp]);

  const menuItems: MenuItem[] = useMemo(
    () => [
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
          { label: "Resumen", href: "/pagos" }, // ✅ ya tienes /pagos/index.astro
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

      {
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
      },
    ],
    [badges]
  );

  const isActiveHref = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  const isSubmenuActive = (item: MenuItem) => item.submenu?.some((s) => isActiveHref(s.href)) ?? false;

  // Auto-abrir el submenú del módulo activo
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
    setOpenMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">🎥</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight">Cotizaciones</h1>
            <p className="text-xs text-gray-500">Sistema de gestión</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = !!item.submenu?.length;
            const isOpen = openMenus.includes(item.id);

            // “Activo” para padre sin href: si alguna ruta del submenu está activa
            const parentActive = item.href ? isActiveHref(item.href) : isSubmenuActive(item);

            return (
              <li key={item.id}>
                {/* Menu principal */}
                {item.href ? (
                  <a
                    href={item.href}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      parentActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-sm">{item.label}</span>
                    {item.badge ? (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.id)}
                    className={[
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      parentActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge ? (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                    {hasSubmenu ? (isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : null}
                  </button>
                )}

                {/* Submenu */}
                {hasSubmenu && isOpen ? (
                  <ul className="mt-1 ml-8 space-y-1">
                    {item.submenu!.map((subItem) => {
                      const active = isActiveHref(subItem.href);
                      return (
                        <li key={subItem.href}>
                          <a
                            href={subItem.href}
                            className={[
                              "block px-3 py-2 text-sm rounded-lg transition-all",
                              active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
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

      {/* Footer / User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{user?.initials ?? "AD"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.role ?? "Admin"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email ?? "admin@empresa.com"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
