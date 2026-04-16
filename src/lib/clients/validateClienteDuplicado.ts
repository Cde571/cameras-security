import { validateClienteDuplicado } from "../services/clienteHistorialService";

export async function assertClienteNoDuplicado(input: {
  id?: string;
  documento?: string;
  email?: string;
  telefono?: string;
}) {
  const result = await validateClienteDuplicado(input);

  if (result.duplicated) {
    const names = result.matches.map((x) => x.nombre).join(", ");
    throw new Error(`Ya existe un cliente similar registrado: ${names}`);
  }

  return true;
}
