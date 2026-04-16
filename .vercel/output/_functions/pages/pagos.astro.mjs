import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DCJG7FNs.mjs';
import { C as CarteraTable } from '../chunks/CarteraTable_C16CY3sn.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Pagos y cartera" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="space-y-6"> <div> <h1 class="text-2xl font-bold text-slate-900">Pagos y cartera</h1> <p class="text-sm text-slate-600">Resumen general del módulo de pagos.</p> </div> <div class="grid gap-4 md:grid-cols-3"> <a href="/pagos/registrar" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300"> <h2 class="font-semibold text-slate-900">Registrar pago</h2> <p class="mt-1 text-sm text-slate-600">Crear un nuevo abono o pago recibido.</p> </a> <a href="/pagos/cartera" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300"> <h2 class="font-semibold text-slate-900">Ver cartera</h2> <p class="mt-1 text-sm text-slate-600">Consultar saldos pendientes y estado de cuenta.</p> </a> <a href="/reportes" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300"> <h2 class="font-semibold text-slate-900">Ir a reportes</h2> <p class="mt-1 text-sm text-slate-600">Revisar métricas comerciales y financieras.</p> </a> </div> <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"> ${renderComponent($$result2, "CarteraTable", CarteraTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/pagos/CarteraTable", "client:component-export": "default" })} </div> </section> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/pagos/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/pagos/index.astro";
const $$url = "/pagos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
