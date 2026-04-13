// src/components/dashboard/QuickActions.tsx
import React from "react";
import { FileText, UserPlus, Package, DollarSign, Plus } from "lucide-react";

const actions = [
  {
    id: "nueva-cotizacion",
    title: "Nueva Cotización",
    description: "Crear cotización para cliente",
    icon: FileText,
    href: "/cotizaciones/nueva",
    color: "blue",
  },
  {
    id: "nuevo-cliente",
    title: "Nuevo Cliente",
    description: "Agregar cliente al sistema",
    icon: UserPlus,
    href: "/clientes/nuevo",
    color: "green",
  },
  {
    id: "nuevo-producto",
    title: "Nuevo Producto",
    description: "Agregar producto al catálogo",
    icon: Package,
    href: "/productos/nuevo",
    color: "purple",
  },
  {
    id: "registrar-pago",
    title: "Registrar Pago",
    description: "Registrar pago recibido",
    icon: DollarSign,
    href: "/pagos/registrar",
    color: "orange",
  },
] as const;

const colorMap: Record<string, string> = {
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  purple: "bg-purple-500 hover:bg-purple-600",
  orange: "bg-orange-500 hover:bg-orange-600",
};

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Acciones Rápidas
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const colorClass = colorMap[action.color] ?? colorMap.blue;

            return (
              <a
                key={action.id}
                href={action.href}
                className="group flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div
                  className={`${colorClass} p-3 rounded-lg transition-colors flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
