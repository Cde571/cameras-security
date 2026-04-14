const KEY = "coti_reportes_v1";
function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const existing = safeParse(localStorage.getItem(KEY), null);
  if (existing) return;
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const ventasMensuales = months.map((m, i) => {
    const base = 18e6 + i * 11e5;
    const wave = Math.round(Math.sin(i / 2) * 23e5);
    const total = Math.max(35e5, base + wave);
    return {
      month: m,
      total,
      cotizaciones: 18 + i % 7,
      ordenes: 6 + i % 4,
      cobros: 8 + i % 5
    };
  });
  const topProductos = [
    { name: "Kit 4 Cámaras + NVR", total: 265e5, count: 7 },
    { name: "Cámara IP 4MP", total: 184e5, count: 22 },
    { name: "Disco 4TB", total: 102e5, count: 12 },
    { name: "Instalación + Canalización", total: 158e5, count: 9 },
    { name: "UPS 1200VA", total: 67e5, count: 6 }
  ];
  const topClientes = [
    { name: "Hotel Plaza Real", total: 189e5, count: 4 },
    { name: "Clínica San Rafael", total: 243e5, count: 3 },
    { name: "Supermercado El Ahorro", total: 159e5, count: 5 },
    { name: "Conjunto Belén Palmira", total: 121e5, count: 2 },
    { name: "Bodega La 80", total: 88e5, count: 2 }
  ];
  const margenes = [
    { category: "Equipos", revenue: 62e6, cost: 48e6, margin: 14e6, marginPct: 22.6 },
    { category: "Instalación", revenue: 31e6, cost: 165e5, margin: 145e5, marginPct: 46.8 },
    { category: "Mantenimiento", revenue: 145e5, cost: 62e5, margin: 83e5, marginPct: 57.2 },
    { category: "Accesorios", revenue: 98e5, cost: 71e5, margin: 27e5, marginPct: 27.6 }
  ];
  const totalVentas = ventasMensuales.reduce((a, x) => a + x.total, 0);
  const totalDocumentos = ventasMensuales.reduce((a, x) => a + x.cotizaciones + x.ordenes + x.cobros, 0);
  const margenPromedioPct = Math.round(margenes.reduce((a, x) => a + x.marginPct, 0) / margenes.length * 10) / 10;
  const payload = {
    ventasMensuales,
    topProductos,
    topClientes,
    margenes,
    kpis: { totalVentas, totalDocumentos, margenPromedioPct }
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
}
function getReporteDashboard() {
  if (typeof window === "undefined") {
    return {
      ventasMensuales: [],
      topProductos: [],
      topClientes: [],
      margenes: [],
      kpis: { totalVentas: 0, totalDocumentos: 0, margenPromedioPct: 0 }
    };
  }
  seedIfEmpty();
  return safeParse(localStorage.getItem(KEY), {
    ventasMensuales: [],
    topProductos: [],
    topClientes: [],
    margenes: [],
    kpis: { totalVentas: 0, totalDocumentos: 0, margenPromedioPct: 0 }
  });
}
function exportVentasCSV() {
  if (typeof window === "undefined") return "";
  const d = getReporteDashboard();
  const headers = ["month", "total", "cotizaciones", "ordenes", "cobros"];
  const rows = d.ventasMensuales.map((v) => [v.month, v.total, v.cotizaciones, v.ordenes, v.cobros].join(","));
  return [headers.join(","), ...rows].join("\n");
}

export { exportVentasCSV as e, getReporteDashboard as g };
