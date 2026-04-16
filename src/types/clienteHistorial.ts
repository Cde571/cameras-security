export type ClienteDocumentoRelacionado = {
  id: string;
  tipo: "cotizacion" | "orden" | "cobro" | "pago";
  numero: string;
  fecha: string;
  estado: string;
  total: number;
  href: string;
};

export type ClienteHistorialData = {
  cliente: {
    id: string;
    nombre: string;
    documento?: string;
    email?: string;
    telefono?: string;
    ciudad?: string;
  } | null;
  resumen: {
    cotizaciones: number;
    ordenes: number;
    cobros: number;
    pagos: number;
    totalCotizado: number;
    totalCobrado: number;
    totalPagado: number;
    saldoPendiente: number;
  };
  documentos: ClienteDocumentoRelacionado[];
};

export type ClienteDuplicadoResult = {
  ok: boolean;
  duplicated: boolean;
  matches: Array<{
    id: string;
    nombre: string;
    documento?: string;
    email?: string;
    telefono?: string;
  }>;
};
