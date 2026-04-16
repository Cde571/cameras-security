export * from "../services/clienteService";

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Esta función solo se puede usar en el navegador.");
  }
}

function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.list)) return data.list;
  return [];
}

async function fetchClientes() {
  const res = await fetch("/api/clientes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  }

  return toArray(data);
}

function escapeCsv(value: any): string {
  const text = String(value ?? "");
  if (/[",\n;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  out.push(current);
  return out.map((v) => v.trim());
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = String(content || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = cols[index] ?? "";
    });

    return row;
  });
}

function mapClienteRow(row: Record<string, string>) {
  return {
    nombre: row["nombre"] || row["cliente"] || row["razon_social"] || "",
    documento: row["documento"] || row["nit"] || row["cedula"] || "",
    email: row["email"] || row["correo"] || "",
    telefono: row["telefono"] || row["celular"] || "",
    ciudad: row["ciudad"] || "",
    direccion: row["direccion"] || row["address"] || "",
  };
}

export async function exportClientesCSV(filename = "clientes.csv"): Promise<void> {
  ensureBrowser();

  const items = await fetchClientes();

  const headers = ["id", "nombre", "documento", "email", "telefono", "ciudad", "direccion"];

  const lines = [
    headers.join(","),
    ...items.map((item: any) =>
      [
        escapeCsv(item?.id),
        escapeCsv(item?.nombre),
        escapeCsv(item?.documento),
        escapeCsv(item?.email),
        escapeCsv(item?.telefono),
        escapeCsv(item?.ciudad),
        escapeCsv(item?.direccion),
      ].join(",")
    ),
  ];

  const csv = "\uFEFF" + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export async function importClientesCSV(file: File): Promise<{ created: number; errors: string[] }> {
  ensureBrowser();

  if (!file) {
    throw new Error("No se recibió archivo CSV.");
  }

  const content = await file.text();
  const rows = parseCsv(content);

  if (rows.length === 0) {
    return { created: 0, errors: ["El archivo CSV está vacío o no tiene filas válidas."] };
  }

  const errors: string[] = [];
  let created = 0;

  for (let i = 0; i < rows.length; i++) {
    const mapped = mapClienteRow(rows[i]);

    if (!mapped.nombre.trim()) {
      errors.push(`Fila ${i + 2}: falta nombre.`);
      continue;
    }

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapped),
      });

      const text = await res.text();
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        errors.push(`Fila ${i + 2}: ${data?.error || data?.message || `HTTP ${res.status}`}`);
        continue;
      }

      created++;
    } catch (error) {
      errors.push(`Fila ${i + 2}: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  return { created, errors };
}