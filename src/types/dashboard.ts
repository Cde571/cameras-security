export type DashboardRecentDocument = {
  id: string;
  type: "cotizacion" | "orden" | "cobro";
  number: string;
  client: string;
  amount: number;
  date: string;
  status: string;
};

export type DashboardAlert = {
  id: number;
  type: "warning" | "danger" | "info";
  message: string;
  action: string;
};

export type DashboardMetrics = {
  totalCotizadoMes: number;
  cotizacionesPendientes: number;
  ordenesEnCurso: number;
  carteraPendiente: number;
  recentDocs: DashboardRecentDocument[];
  alerts: DashboardAlert[];
  counts: {
    cotizaciones: number;
    ordenes: number;
    cobros: number;
    pagos: number;
    clientes: number;
    productos: number;
  };
};
