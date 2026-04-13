// src/components/navigation/Header.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'Cotización COT-2024-032 vence mañana',
      time: 'Hace 5 min'
    },
    {
      id: 2,
      type: 'success',
      message: 'Pago recibido de Hotel Plaza Real',
      time: 'Hace 1 hora'
    },
    {
      id: 3,
      type: 'info',
      message: 'Nueva orden OT-2024-124 creada',
      time: 'Hace 2 horas'
    }
  ];

  return (
    <div className="h-16 px-6 flex items-center justify-between">
      {/* Left side - Mobile menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes, cotizaciones..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {notifications.length}
                  </span>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-2 h-2 rounded-full mt-2 flex-shrink-0
                        ${notification.type === 'warning' ? 'bg-yellow-500' : ''}
                        ${notification.type === 'success' ? 'bg-green-500' : ''}
                        ${notification.type === 'info' ? 'bg-blue-500' : ''}
                      `}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <a
          href="/config"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </a>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => window.location.href = '/auth/login'}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </div>
  );
}