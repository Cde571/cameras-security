type ClienteLike = Record<string, any>;

function esc(v: unknown) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportClientsCSV(rows: ClienteLike[]) {
  const headers = ["id", "nombre", "documento", "telefono", "email", "direccion", "ciudad", "estado"];
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "clientes.csv";
  a.click();
  URL.revokeObjectURL(url);
}
