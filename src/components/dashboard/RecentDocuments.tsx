import React from "react";
import { FileText, DollarSign, Wrench, Eye } from "lucide-react";

interface Document {
  id: string | number;
  type: "cotizacion" | "cobro" | "orden";
  number: string;
  client: string;
  amount: number;
  date: string;
  status: string;
}

interface RecentDocumentsProps {
  documents: Document[];
}

const typeConfig: Record<
  Document["type"],
  { icon: any; label: string; colorKey: "blue" | "green" | "orange" }
> = {
  cotizacion: {
    icon: FileText,
    label: "Cotización",
    colorKey: "blue",
  },
  cobro: {
    icon: DollarSign,
    label: "Cuenta de Cobro",
    colorKey: "green",
  },
  orden: {
    icon: Wrench,
    label: "Orden de Trabajo",
    colorKey: "orange",
  },
};

const colorClasses: Record<
  "blue" | "green" | "orange",
  { badgeBg: string; iconText: string }
> = {
  blue: { badgeBg: "bg-blue-100", iconText: "text-blue-600" },
  green: { badgeBg: "bg-green-100", iconText: "text-green-600" },
  orange: { badgeBg: "bg-orange-100", iconText: "text-orange-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  enviada: { label: "Enviada", color: "bg-blue-100 text-blue-700" },
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  en_progreso: { label: "En progreso", color: "bg-orange-100 text-orange-700" },
  aprobada: { label: "Aprobada", color: "bg-green-100 text-green-700" },
  pagada: { label: "Pagada", color: "bg-green-100 text-green-700" },
  vencida: { label: "Vencida", color: "bg-red-100 text-red-700" },
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-700" },
  enviada_cliente: { label: "Enviada", color: "bg-blue-100 text-blue-700" },
  finalizada: { label: "Finalizada", color: "bg-green-100 text-green-700" },
  en_revision: { label: "En revisión", color: "bg-purple-100 text-purple-700" },
};

export default function RecentDocuments({ documents }: RecentDocumentsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getDocumentLink = (doc: Document) => {
    const typeMap: Record<Document["type"], string> = {
      cotizacion: "/cotizaciones",
      cobro: "/cobros",
      orden: "/ordenes",
    };
    return `${typeMap[doc.type]}/${doc.id}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Número
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {documents.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="mb-3 h-12 w-12 text-gray-300" />
                  <p className="font-medium text-gray-600">
                    No hay documentos recientes
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Cuando empieces a guardar en PostgreSQL, aparecerán aquí.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            documents.map((doc) => {
              const config = typeConfig[doc.type];
              const Icon = config.icon;
              const colors = colorClasses[config.colorKey];
              const status = statusConfig[doc.status] ?? {
                label: doc.status,
                color: "bg-gray-100 text-gray-700",
              };

              return (
                <tr key={String(doc.id)} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`${colors.badgeBg} rounded-lg p-2`}>
                        <Icon className={`h-4 w-4 ${colors.iconText}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {config.label}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {doc.number}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{doc.client}</span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(doc.amount)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(doc.date)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <a
                      href={getDocumentLink(doc)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver</span>
                    </a>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
