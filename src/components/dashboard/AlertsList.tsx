// src/components/dashboard/AlertsList.tsx
import React from "react";
import { AlertCircle, AlertTriangle, Info, ChevronRight } from "lucide-react";

interface AlertItem {
  id: number;
  type: "warning" | "danger" | "info";
  message: string;
  action: string; // ruta a donde navega
}

interface AlertsListProps {
  alerts: AlertItem[];
}

const alertConfig: Record<
  AlertItem["type"],
  {
    icon: any;
    bg: string;
    border: string;
    text: string;
    iconColor: string;
  }
> = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    iconColor: "text-yellow-500",
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    iconColor: "text-red-500",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    iconColor: "text-blue-500",
  },
};

export default function AlertsList({ alerts }: AlertsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 h-full">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Alertas
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {alerts.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Info className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm">No hay alertas pendientes</p>
            <p className="text-gray-500 text-xs mt-1">Todo está al día</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;

            return (
              <a
                key={alert.id}
                href={alert.action}
                className="block p-4 hover:bg-gray-50 transition-colors group"
                data-alert-type={alert.type}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`${config.bg} ${config.border} border p-2 rounded-lg flex-shrink-0`}
                  >
                    <Icon className={`w-4 h-4 ${config.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${config.text} font-medium leading-relaxed`}
                    >
                      {alert.message}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                </div>
              </a>
            );
          })
        )}
      </div>

      {alerts.length > 0 && (
        <div className="border-t border-gray-200 p-3">
          <a
            href="/dashboard"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas las alertas
          </a>
        </div>
      )}
    </div>
  );
}
