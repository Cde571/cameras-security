import React, { useEffect, useState } from "react";
import { getDashboardMetrics } from "../../lib/services/dashboardService";

type Props = {
  module: "cotizaciones" | "ordenes" | "cobros" | "pagos" | "clientes" | "productos";
};

export default function SidebarBadgeCount({ module }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const metrics = await getDashboardMetrics();
        if (!active) return;
        setCount(metrics.counts[module] || 0);
      } catch {
        if (!active) return;
        setCount(0);
      }
    };

    load();

    const interval = window.setInterval(load, 10000);
    const refresh = () => load();

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [module]);

  if (!count) return null;

  return (
    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
      {count}
    </span>
  );
}
