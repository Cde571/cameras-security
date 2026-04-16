import { validateProductoDuplicado } from "../services/productoKitService";

export async function assertProductoNoDuplicado(input: {
  id?: string;
  codigo?: string;
  sku?: string;
  nombre?: string;
}) {
  const result = await validateProductoDuplicado(input);

  if (result.duplicated) {
    const names = result.matches.map((x) => x.nombre).join(", ");
    throw new Error(`Ya existe un producto similar registrado: ${names}`);
  }

  return true;
}
