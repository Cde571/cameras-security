export function round2(n: number) {
  return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
}

export function calcSubtotal(items: Array<{ qty?: number; precio?: number }>) {
  return round2(items.reduce((acc, it) => acc + Number(it.qty || 0) * Number(it.precio || 0), 0));
}

export function calcIva(items: Array<{ qty?: number; precio?: number; ivaPct?: number }>) {
  return round2(
    items.reduce((acc, it) => {
      const base = Number(it.qty || 0) * Number(it.precio || 0);
      return acc + base * (Number(it.ivaPct || 0) / 100);
    }, 0)
  );
}

export function calcTotal(items: Array<{ qty?: number; precio?: number; ivaPct?: number }>) {
  return round2(calcSubtotal(items) + calcIva(items));
}
