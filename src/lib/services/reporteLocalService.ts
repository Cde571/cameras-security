export type VentaMensual = {
  month: string;
  total: number;
  cotizaciones: number;
  ordenes: number;
  cobros: number;
};

export type TopItem = {
  name: string;
  total: number;
  count: number;
};

export type MargenItem = {
  category: string;
  revenue: number;
  cost: number;
  margin: number;
  marginPct: number;
};

export type ReporteDashboard = {
  ventasMensuales: VentaMensual[];
  topProductos: TopItem[];
  topClientes: TopItem[];
  margenes: MargenItem[];
  kpis: {
    totalVentas: number;
    totalDocumentos: number;
    margenPromedioPct: number;
  };
};

const KEY = "coti_reportes_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const existing = safeParse<ReporteDashboard | null>(localStorage.getItem(KEY), null);
  if (existing) return;

  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  const ventasMensuales: VentaMensual[] = months.map((m, i) => {
    const base = 18000000 + i * 1100000;
    const wave = Math.round(Math.sin(i / 2) * 2300000);
    const total = Math.max(3500000, base + wave);
    return {
      month: m,
      total,
      cotizaciones: 18 + (i % 7),
      ordenes: 6 + (i % 4),
      cobros: 8 + (i % 5),
    };
  });

  const topProductos: TopItem[] = [
    { name: "Kit 4 Cámaras + NVR", total: 26500000, count: 7 },
    { name: "Cámara IP 4MP", total: 18400000, count: 22 },
    { name: "Disco 4TB", total: 10200000, count: 12 },
    { name: "Instalación + Canalización", total: 15800000, count: 9 },
    { name: "UPS 1200VA", total: 6700000, count: 6 },
  ];

  const topClientes: TopItem[] = [
    { name: "Hotel Plaza Real", total: 18900000, count: 4 },
    { name: "Clínica San Rafael", total: 24300000, count: 3 },
    { name: "Supermercado El Ahorro", total: 15900000, count: 5 },
    { name: "Conjunto Belén Palmira", total: 12100000, count: 2 },
    { name: "Bodega La 80", total: 8800000, count: 2 },
  ];

  const margenes: MargenItem[] = [
    { category: "Equipos", revenue: 62000000, cost: 48000000, margin: 14000000, marginPct: 22.6 },
    { category: "Instalación", revenue: 31000000, cost: 16500000, margin: 14500000, marginPct: 46.8 },
    { category: "Mantenimiento", revenue: 14500000, cost: 6200000, margin: 8300000, marginPct: 57.2 },
    { category: "Accesorios", revenue: 9800000, cost: 7100000, margin: 2700000, marginPct: 27.6 },
  ];

  const totalVentas = ventasMensuales.reduce((a, x) => a + x.total, 0);
  const totalDocumentos = ventasMensuales.reduce((a, x) => a + x.cotizaciones + x.ordenes + x.cobros, 0);
  const margenPromedioPct = Math.round((margenes.reduce((a, x) => a + x.marginPct, 0) / margenes.length) * 10) / 10;

  const payload: ReporteDashboard = {
    ventasMensuales,
    topProductos,
    topClientes,
    margenes,
    kpis: { totalVentas, totalDocumentos, margenPromedioPct },
  };

  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getReporteDashboard(): ReporteDashboard {
  if (typeof window === "undefined") {
    return {
      ventasMensuales: [],
      topProductos: [],
      topClientes: [],
      margenes: [],
      kpis: { totalVentas: 0, totalDocumentos: 0, margenPromedioPct: 0 },
    };
  }
  seedIfEmpty();
  return safeParse<ReporteDashboard>(localStorage.getItem(KEY), {
    ventasMensuales: [],
    topProductos: [],
    topClientes: [],
    margenes: [],
    kpis: { totalVentas: 0, totalDocumentos: 0, margenPromedioPct: 0 },
  });
}

export function exportVentasCSV(): string {
  if (typeof window === "undefined") return "";
  const d = getReporteDashboard();
  const headers = ["month","total","cotizaciones","ordenes","cobros"];
  const rows = d.ventasMensuales.map(v => [v.month, v.total, v.cotizaciones, v.ordenes, v.cobros].join(","));
  return [headers.join(","), ...rows].join("\n");
}
