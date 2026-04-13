export type Cliente = {
  id: string;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  notas?: string;
  estado?: "activo" | "inactivo";
  createdAt: string;
  updatedAt: string;
};

const KEY = "coti_clientes_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `cli_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);
  if (list.length > 0) return;

  const now = new Date().toISOString();
  const seed: Cliente[] = [
    {
      id: uid(),
      nombre: "Hotel Plaza Real",
      documento: "900123456-7",
      telefono: "3001234567",
      email: "administracion@hotelplaza.com",
      direccion: "Cra 10 # 12-34",
      ciudad: "Medellín",
      estado: "activo",
      notas: "Cliente corporativo. Prefiere pagos 50/50.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      nombre: "Supermercado El Ahorro",
      documento: "901987654-1",
      telefono: "3109876543",
      email: "gerencia@elahorro.com",
      direccion: "Cl 45 # 8-90",
      ciudad: "Cali",
      estado: "activo",
      notas: "Sede principal. Pide evidencia por WhatsApp.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      nombre: "Clínica San Rafael",
      documento: "800555222-9",
      telefono: "3202223344",
      email: "compras@sanrafael.com",
      direccion: "Av 80 # 20-10",
      ciudad: "Bogotá",
      estado: "activo",
      notas: "Requiere acta y orden firmada.",
      createdAt: now,
      updatedAt: now,
    },
  ];

  localStorage.setItem(KEY, JSON.stringify(seed));
}

export function listClientes(search = ""): Cliente[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();

  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);
  const q = search.trim().toLowerCase();

  if (!q) return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return list
    .filter((c) => {
      const blob = [
        c.nombre,
        c.documento,
        c.telefono,
        c.email,
        c.direccion,
        c.ciudad,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getCliente(id: string): Cliente | null {
  if (typeof window === "undefined") return null;
  seedIfEmpty();
  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);
  return list.find((c) => c.id === id) ?? null;
}

export function createCliente(data: Omit<Cliente, "id" | "createdAt" | "updatedAt">): Cliente {
  if (typeof window === "undefined") throw new Error("createCliente debe ejecutarse en el browser");
  seedIfEmpty();

  const now = new Date().toISOString();
  const nuevo: Cliente = {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    estado: "activo",
    ...data,
  };

  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY, JSON.stringify(list));
  return nuevo;
}

export function updateCliente(id: string, patch: Partial<Cliente>): Cliente {
  if (typeof window === "undefined") throw new Error("updateCliente debe ejecutarse en el browser");
  seedIfEmpty();

  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cliente no existe");

  const updated: Cliente = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(KEY, JSON.stringify(list));
  return updated;
}

export function deleteCliente(id: string) {
  if (typeof window === "undefined") throw new Error("deleteCliente debe ejecutarse en el browser");
  seedIfEmpty();

  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);
  const next = list.filter((c) => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}

function escapeCsv(value: string) {
  const v = (value ?? "").toString();
  if (v.includes('"') || v.includes(",") || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export function exportClientesCSV(): string {
  if (typeof window === "undefined") return "";
  seedIfEmpty();
  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);

  const headers = ["id","nombre","documento","telefono","email","direccion","ciudad","estado","notas","createdAt","updatedAt"];
  const rows = list.map(c => headers.map(h => escapeCsv((c as any)[h] ?? "")).join(","));
  return [headers.join(","), ...rows].join("\n");
}

export async function importClientesCSV(file: File): Promise<{ created: number; updated: number }> {
  if (typeof window === "undefined") throw new Error("importClientesCSV debe ejecutarse en el browser");
  seedIfEmpty();

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { created: 0, updated: 0 };

  const headers = lines[0].split(",").map(h => h.trim());
  const list = safeParse<Cliente[]>(localStorage.getItem(KEY), []);

  let created = 0;
  let updated = 0;

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;

    // parser simple (maneja comillas)
    const cols: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let j = 0; j < raw.length; j++) {
      const ch = raw[j];
      if (ch === '"' && raw[j + 1] === '"') { cur += '"'; j++; continue; }
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { cols.push(cur); cur = ""; continue; }
      cur += ch;
    }
    cols.push(cur);

    const obj: any = {};
    headers.forEach((h, idx) => (obj[h] = (cols[idx] ?? "").trim()));

    const nombre = obj.nombre || obj.name || "";
    if (!nombre) continue;

    const id = obj.id || "";
    const existingIdx = id ? list.findIndex(c => c.id === id) : -1;

    const now = new Date().toISOString();
    if (existingIdx >= 0) {
      list[existingIdx] = {
        ...list[existingIdx],
        ...obj,
        nombre,
        updatedAt: now,
      };
      updated++;
    } else {
      list.unshift({
        id: id || uid(),
        nombre,
        documento: obj.documento || "",
        telefono: obj.telefono || "",
        email: obj.email || "",
        direccion: obj.direccion || "",
        ciudad: obj.ciudad || "",
        estado: (obj.estado || "activo") as any,
        notas: obj.notas || "",
        createdAt: obj.createdAt || now,
        updatedAt: now,
      });
      created++;
    }
  }

  localStorage.setItem(KEY, JSON.stringify(list));
  return { created, updated };
}
