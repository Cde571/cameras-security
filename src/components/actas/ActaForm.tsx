import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { listClientes } from "../../lib/repositories/clienteRepo";
import { createActa, getActa, updateActa } from "../../lib/repositories/actaRepo";
import FirmaPad from "./FirmaPad";

type Props = {
  mode?: "create" | "edit";
  actaId?: string;
};

type Cliente = {
  id: string;
  nombre: string;
  documento?: string;
  ciudad?: string;
  email?: string;
  telefono?: string;
};

type EntregadoItem = {
  id: string;
  nombre: string;
  cantidad: number;
  serial: string;
  observacion: string;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toNumber(value: any, fallback = 1) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function buildObservaciones(
  notas: string,
  tecnico: string,
  recibe: string,
  documento: string,
  items: EntregadoItem[]
) {
  const header = notas?.trim() ? notas.trim() : "Sin observaciones adicionales.";

  const responsables = [
    `TÃ©cnico: ${tecnico || "â€”"}`,
    `Recibe: ${recibe || "â€”"}`,
    `Documento: ${documento || "â€”"}`,
  ].join("\n");

  const detalleItems = items.length
    ? items
        .map((item, index) => {
          return [
            `${index + 1}. ${item.nombre || "Ãtem sin nombre"}`,
            `   Cantidad: ${item.cantidad || 1}`,
            `   Serial: ${item.serial || "â€”"}`,
            `   ObservaciÃ³n: ${item.observacion || "â€”"}`,
          ].join("\n");
        })
        .join("\n")
    : "Sin Ã­tems.";

  return [
    header,
    "",
    "Responsables:",
    responsables,
    "",
    "Activos / elementos entregados:",
    detalleItems,
  ].join("\n");
}

function parseObservaciones(text: string) {
  const raw = String(text || "").replace(/\r\n/g, "\n");

  const result = {
    notas: "",
    tecnico: "",
    recibe: "",
    documento: "",
    items: [] as EntregadoItem[],
  };

  if (!raw.trim()) {
    return result;
  }

  const idxResponsables = raw.indexOf("Responsables:");
  const idxItems = raw.indexOf("Activos / elementos entregados:");

  if (idxResponsables >= 0) {
    result.notas = raw.slice(0, idxResponsables).trim();
  } else if (idxItems >= 0) {
    result.notas = raw.slice(0, idxItems).trim();
  } else {
    result.notas = raw.trim();
  }

  if (idxResponsables >= 0) {
    const responsablesBlock = raw.slice(
      idxResponsables,
      idxItems >= 0 ? idxItems : raw.length
    );

    const tecnicoMatch = responsablesBlock.match(/TÃ©cnico:\s*(.*)/);
    const recibeMatch = responsablesBlock.match(/Recibe:\s*(.*)/);
    const documentoMatch = responsablesBlock.match(/Documento:\s*(.*)/);

    result.tecnico = tecnicoMatch?.[1]?.trim() || "";
    result.recibe = recibeMatch?.[1]?.trim() || "";
    result.documento = documentoMatch?.[1]?.trim() || "";
  }

  if (idxItems >= 0) {
    const itemsBlock = raw.slice(idxItems).replace("Activos / elementos entregados:", "").trim();

    const regex = /(?:^|\n)(\d+)\.\s*(.+?)(?:\n\s*Cantidad:\s*(.+?))?(?:\n\s*Serial:\s*(.+?))?(?:\n\s*ObservaciÃ³n:\s*(.+?))?(?=\n\d+\.|\s*$)/gs;
    let match: RegExpExecArray | null = null;

    while ((match = regex.exec(itemsBlock)) !== null) {
      result.items.push({
        id: makeId(),
        nombre: (match[2] || "").trim(),
        cantidad: toNumber((match[3] || "").trim(), 1),
        serial: (match[4] || "").trim().replace(/^â€”$/, ""),
        observacion: (match[5] || "").trim().replace(/^â€”$/, ""),
      });
    }
  }

  return result;
}

export default function ActaForm({ mode = "create", actaId }: Props) {
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [firmaDataUrl, setFirmaDataUrl] = useState("");

  const [form, setForm] = useState({
    clienteId: "",
    numero: "",
    fecha: new Date().toISOString().slice(0, 10),
    lugar: "",
    estado: "firmada",
    tecnico: "",
    recibe: "",
    documento: "",
    notas: "",
  });

  const [items, setItems] = useState<EntregadoItem[]>([
    { id: makeId(), nombre: "", cantidad: 1, serial: "", observacion: "" },
  ]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const rawClientes = await listClientes("");
        const arr = Array.isArray(rawClientes)
          ? rawClientes
          : Array.isArray((rawClientes as any)?.items)
            ? (rawClientes as any).items
            : [];

        if (!cancelled) {
          setClientes(arr);
        }

        if (isEdit && actaId) {
          const acta = await getActa(actaId);

          if (!cancelled && acta) {
            const parsed = parseObservaciones(acta.observaciones || "");

            setForm({
              clienteId: acta.clienteId || "",
              numero: acta.numero || "",
              fecha: acta.fecha || new Date().toISOString().slice(0, 10),
              lugar: acta.lugar || "",
              estado: acta.estado || acta.status || "firmada",
              tecnico: parsed.tecnico || "",
              recibe: parsed.recibe || "",
              documento: parsed.documento || "",
              notas: parsed.notas || "",
            });

            setItems(
              parsed.items.length > 0
                ? parsed.items
                : [{ id: makeId(), nombre: "", cantidad: 1, serial: "", observacion: "" }]
            );

            setFirmaDataUrl(acta.firmaDataUrl || "");
          }
        }
      } catch (error) {
        console.error("Error cargando acta:", error);
        if (!cancelled) {
          setClientes([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isEdit, actaId]);

  const canSave = useMemo(() => {
    const hasCliente = form.clienteId.trim().length > 0;
    const validItems = items.filter((item) => item.nombre.trim().length > 0);
    const hasFirma = typeof firmaDataUrl === "string" && firmaDataUrl.startsWith("data:image/");
    return hasCliente && validItems.length > 0 && hasFirma;
  }, [form.clienteId, items, firmaDataUrl]);

  function onChange(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: makeId(), nombre: "", cantidad: 1, serial: "", observacion: "" },
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length > 0
        ? next
        : [{ id: makeId(), nombre: "", cantidad: 1, serial: "", observacion: "" }];
    });
  }

  function updateItem(id: string, key: keyof EntregadoItem, value: any) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: key === "cantidad" ? toNumber(value, 1) : value,
            }
          : item
      )
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validItems = items
      .map((item) => ({
        ...item,
        nombre: item.nombre.trim(),
        cantidad: toNumber(item.cantidad, 1),
        serial: String(item.serial || "").trim(),
        observacion: String(item.observacion || "").trim(),
      }))
      .filter((item) => item.nombre.length > 0);

    if (!form.clienteId.trim()) {
      alert("Debes seleccionar un cliente.");
      return;
    }

    if (validItems.length === 0) {
      alert("Debes agregar al menos 1 Ã­tem entregado.");
      return;
    }

    if (!firmaDataUrl || !firmaDataUrl.startsWith("data:image/")) {
      alert("Debes firmar con el dedo o con el mouse antes de guardar.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        numero: form.numero.trim() || `ACT-${Date.now()}`,
        clienteId: form.clienteId.trim(),
        fecha: form.fecha,
        lugar: form.lugar.trim(),
        estado: form.estado,
        status: form.estado,
        firmaDataUrl,
        observaciones: buildObservaciones(
          form.notas,
          form.tecnico,
          form.recibe,
          form.documento,
          validItems
        ),
      };

      if (isEdit && actaId) {
        await updateActa(actaId, payload);
        window.location.href = `/actas/${actaId}`;
        return;
      }

      const nueva = await createActa(payload);
      window.location.href = `/actas/${nueva.id}`;
    } catch (error) {
      console.error("Error guardando acta:", error);
      alert("No fue posible guardar el acta.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? "Editar acta" : "Nueva acta"}
          </h1>
          <p className="text-sm text-gray-500">
            Cliente + activos entregados + firma.
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={isEdit && actaId ? `/actas/${actaId}` : "/actas"}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="submit"
            disabled={!canSave || saving}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-white ${
              canSave && !saving ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_430px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-700">Cliente</label>
            <select
              value={form.clienteId}
              onChange={(e) => onChange("clienteId", e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              disabled={loading}
            >
              <option value="">
                {loading ? "Cargando clientes..." : "Selecciona un cliente"}
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}{c.documento ? ` - ${c.documento}` : ""}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Datos del acta</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => onChange("fecha", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Lugar</label>
                <input
                  value={form.lugar}
                  onChange={(e) => onChange("lugar", e.target.value)}
                  placeholder="Ej: Sede principal / Torre B / Bodega..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
              <select
                value={form.estado}
                onChange={(e) => onChange("estado", e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
              >
                <option value="borrador">Borrador</option>
                <option value="firmada">Firmada</option>
                <option value="cerrada">Cerrada</option>
              </select>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Responsables</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">TÃ©cnico</label>
                <input
                  value={form.tecnico}
                  onChange={(e) => onChange("tecnico", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Recibe</label>
                <input
                  value={form.recibe}
                  onChange={(e) => onChange("recibe", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Documento</label>
                <input
                  value={form.documento}
                  onChange={(e) => onChange("documento", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900">Activos / elementos entregados</h2>

              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>

            <div className="space-y-4 p-6">
              {items.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-medium text-gray-800">Ãtem #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        value={item.nombre}
                        onChange={(e) => updateItem(item.id, "nombre", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                        placeholder="Ej: CÃ¡mara IP 4MP"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItem(item.id, "cantidad", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Serial</label>
                      <input
                        value={item.serial}
                        onChange={(e) => updateItem(item.id, "serial", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">ObservaciÃ³n</label>
                    <input
                      value={item.observacion}
                      onChange={(e) => updateItem(item.id, "observacion", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                      placeholder="Estado, detalle, ubicaciÃ³n, etc."
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <FirmaPad value={firmaDataUrl} onChange={setFirmaDataUrl} />
          </section>
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Reglas</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>Para guardar: cliente + mÃ­nimo 1 Ã­tem entregado + firma.</p>
            <p>Firma con el dedo en celular o tableta, o con el mouse en computador.</p>
            <p>La firma queda guardada y se muestra en el detalle y en el PDF.</p>
          </div>
        </aside>
      </div>
    </form>
  );
}