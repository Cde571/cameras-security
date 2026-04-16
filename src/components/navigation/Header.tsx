import React, { useEffect, useMemo, useState } from "react";
import { Search, Bell, Settings, LogOut, Menu, X } from "lucide-react";
import { fetchCurrentUser, getCurrentUser, logout, type User } from "../../lib/repositories/authRepo";

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

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    let mounted = true;
    fetchCurrentUser().then((user) => {
      if (mounted) setCurrentUser(user);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const notifications = useMemo(() => [
    { id: 1, type: "warning", message: "Cotización próxima a vencer", time: "Hace 5 min" },
    { id: 2, type: "success", message: "Pago registrado correctamente", time: "Hace 1 hora" },
    { id: 3, type: "info", message: "Orden actualizada", time: "Hace 2 horas" },
  ], []);

  const userName = currentUser?.name || "Sesión activa";
  const userRole = roleLabel(currentUser?.role);
  const userInitials = initialsFromName(userName);

  const doLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex h-16 items-center justify-between px-6">
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>

        <div className="hidden max-w-md flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes, cotizaciones..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                    {notifications.length}
                  </span>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="cursor-pointer border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={[
                          "mt-2 h-2 w-2 flex-shrink-0 rounded-full",
                          notification.type === "warning" ? "bg-yellow-500" : "",
                          notification.type === "success" ? "bg-green-500" : "",
                          notification.type === "info" ? "bg-blue-500" : "",
                        ].join(" ")}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <a
          href="/config"
          className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          title="Configuración"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </a>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white">
            <span className="text-sm font-semibold">{userInitials}</span>
          </div>
        </div>

        <button
          onClick={doLogout}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
      )}
    </div>
  );
}

