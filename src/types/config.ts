export type EmpresaConfig = {
  nombre?: string;
  nit?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
};

export type ImpuestosConfig = {
  iva?: number;
};

export type NumeracionConfig = {
  cotizacionPrefix?: string;
  cobroPrefix?: string;
  ordenPrefix?: string;
  actaPrefix?: string;
};
