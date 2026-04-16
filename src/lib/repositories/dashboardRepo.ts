import { listCotizaciones } from "./cotizacionRepo";
import { listOrdenes } from "./ordenRepo";
import { listCobros, listPagos } from "./cobroPagoRepo";

export function readDashboardCollections() {
  return {
    cotizaciones: listCotizaciones(""),
    ordenes: listOrdenes(""),
    cobros: listCobros(""),
    pagos: listPagos(""),
  };
}
