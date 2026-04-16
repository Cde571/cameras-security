import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { listClientes } from "../../lib/repositories/clienteRepo";
import {
  createCuentaCobro,
  getCuentaCobro,
  updateCuentaCobro
} from "../../lib/repositories/cobroRepo";

type Props = {
  mode?: "create" | "edit";
  cobroId?: string;
};

type Cliente = {
  id: string;
  nombre: string;
  documento?: string;
};

type Item = {
  id: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addDays(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CuentaForm({ mode = "create", cobroId }: Props) {
  const isEdit = mode === "edit";
  const today = new Date().toISOString().slice(0, 10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({
    clienteId: "",
    fechaEmision: today,
    fechaVencimiento: addDays(today, 15),
    status: "pendiente",
    observaciones: "",
  });
  const [items, setItems] = useState<Item[]>([]);

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

        if (!isEdit) {
          const params = new URLSearchParams(window.location.search);
          const clienteId = params.get("clienteId") || "";
          const ordenId = params.get("ordenId") || "";
          const from = params.get("from") || "";

          if (!cancelled) {
            setForm((prev) => ({
              ...prev,
              clienteId: clienteId || prev.clienteId,
              observaciones:
                ordenId && from === "orden"
                  ? `Generada desde orden ${ordenId}.`
                  : prev.observaciones,
            }));
          }
        }

        if (isEdit && cobroId) {
          const cuenta = await getCuentaCobro(cobroId);

          if (!cancelled && cuenta) {
            setForm({
              clienteId: cuenta.clienteId || "",
              fechaEmision: cuenta.fechaEmision || today,
              fechaVencimiento: cuenta.fechaVencimiento || addDays(today, 15),
              status: cuenta.status || "pendiente",
              observaciones: cuenta.observaciones || "",
            });

            setItems(
              Array.isArray(cuenta.items) && cuenta.items.length > 0
                ? cuenta.items.map((item: any) => ({
                    id: item.id || makeId(),
                    descripcion: item.descripcion || "",
                    cantidad: Number(item.cantidad || 1),
                    valorUnitario: Number(item.valorUnitario || 0),
                  }))
                : []
            );
          }
        }
      } catch (error) {
        console.error("Error cargando cuenta de cobro:", error);
        if (!cancelled) setClientes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isEdit, cobroId]);

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: makeId(),
        descripcion: "",
        cantidad: 1,
        valorUnitario: 0,
      },
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateItem(id: string, key: keyof Item, value: any) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]:
                key === "cantidad" || key === "valorUnitario"
                  ? Number(value || 0)
                  : value,
            }
          : item
      )
    );
  }

  const validItems = useMemo(() => {
    return items.filter((item) => String(item.descripcion || "").trim().length > 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return validItems.reduce(
      (acc, item) =>
        acc + Number(item.cantidad || 0) * Number(item.valorUnitario || 0),
      0
    );
  }, [validItems]);

  const total = subtotal;

  const canSave = form.clienteId.trim().length > 0 && validItems.length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.clienteId.trim()) {
      alert("Debes seleccionar un cliente.");
      return;
    }

    if (validItems.length === 0) {
      alert("Debes agregar al menos un servicio.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        clienteId: form.clienteId.trim(),
        fechaEmision: form.fechaEmision,
        fechaVencimiento: form.fechaVencimiento,
        status: form.status,
        observaciones: form.observaciones,
        items: validItems.map((item) => ({
          descripcion: item.descripcion.trim(),
          cantidad: Number(item.cantidad || 0),
          valorUnitario: Number(item.valorUnitario || 0),
        })),
      };

      if (isEdit && cobroId) {
        const updated = await updateCuentaCobro(cobroId, payload);
        window.location.href = `/cobros/${updated.id}`;
        return;
      }

      const created = await createCuentaCobro(payload);
      window.location.href = `/cobros/${created.id}`;
    } catch (error) {
      console.error("Error guardando cuenta de cobro:", error);
      alert(error instanceof Error ? error.message : "No fue posible guardar la cuenta de cobro.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? "Editar cuenta de cobro" : "Nueva cuenta de cobro"}
          </h1>
          <p className="text-sm text-gray-500">Cliente + servicios + totales.</p>
        </div>

        <div className="flex gap-2">
          <a
            href={isEdit && cobroId ? `/cobros/${cobroId}` : "/cobros"}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="submit"
            disabled={!canSave || saving}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-white ${
              canSave && !saving
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-blue-300"
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
              onChange={(e) => updateField("clienteId", e.target.value)}
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
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Fechas y estado</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">EmisiÃ³n</label>
                <input
                  type="date"
                  value={form.fechaEmision}
                  onChange={(e) => updateField("fechaEmision", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Vencimiento</label>
                <input
                  type="date"
                  value={form.fechaVencimiento}
                  onChange={(e) => updateField("fechaVencimiento", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagada">Pagada</option>
                  <option value="vencida">Vencida</option>
                  <option value="anulada">Anulada</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900">Servicios</h2>
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
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">Agrega servicios para calcular totales.</p>
              ) : null}

              {items.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-medium text-gray-800">Servicio #{index + 1}</p>
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
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        DescripciÃ³n
                      </label>
                      <input
                        value={item.descripcion}
                        onChange={(e) => updateItem(item.id, "descripcion", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                        placeholder="Ej: Soporte tÃ©cnico / instalaciÃ³n / mantenimiento"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItem(item.id, "cantidad", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Valor unitario
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.valorUnitario}
                        onChange={(e) => updateItem(item.id, "valorUnitario", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    Subtotal del servicio:{" "}
                    <span className="font-semibold text-gray-900">
                      {money(Number(item.cantidad || 0) * Number(item.valorUnitario || 0))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Observaciones</h2>
            <textarea
              value={form.observaciones}
              onChange={(e) => updateField("observaciones", e.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              placeholder="Ej: condiciones de pago, entregables, soporte..."
            />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Totales</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{money(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">IVA</span>
                <span className="font-medium text-gray-900">{money(0)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-lg font-semibold text-gray-900">{money(total)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Ayuda</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>TambiÃ©n puedes entrar desde un cliente, una cotizaciÃ³n o una orden.</p>
              <p>La cuenta se guarda con sus servicios e importes en PostgreSQL.</p>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}