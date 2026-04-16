import React from "react";
import ClienteHistorialReal from "./ClienteHistorialReal";

type Props = {
  clienteId: string;
};

export default function ClienteHistorial(props: Props) {
  return <ClienteHistorialReal {...props} />;
}
