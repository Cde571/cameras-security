import React, { useEffect, useState } from "react";
import { ArrowLeft, GitBranch } from "lucide-react";
import { createVersionFrom, getCotizacion } from "../../lib/repositories/cotizacionRepo";

export default function VersionControl({ cotizacionId }: { cotizacionId: string }) {
  const [num, setNum] = useState<string>("");

  useEffect(() => {
    const c = getCotizacion(cotizacionId);
    setNum(c?.numero || "");
  }, [cotizacionId]);

  const crear = () => {
    const ok = confirm("Esto creará una nueva versión (duplicada) en estado BORRADOR. ¿Continuar?");
    if (!ok) return;
    const v = createVersionFrom(cotizacionId);
    window.location.href = `/cotizaciones/${v.id}/editar`;
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Versionar cotización</h1>
          <p className="text-sm text-gray-500">Base: {num || cotizacionId}</p>
        </div>
        <a href={`/cotizaciones/${cotizacionId}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </a>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
        <p className="text-sm text-gray-700">
          Se copiarán: cliente, ítems, condiciones y notas. La nueva versión queda como <b>borrador</b>.
        </p>

        <button
          onClick={crear}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <GitBranch className="h-4 w-4" />
          Crear nueva versión
        </button>
      </div>
    </div>
  );
}

