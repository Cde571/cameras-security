import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DCJG7FNs.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Configuraci\xF3n - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <header> <h1 class="text-2xl font-semibold text-gray-900">Configuración</h1> <p class="text-sm text-gray-500">Empresa, numeración, impuestos, usuarios, plantillas y backup.</p> </header> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> <a class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50" href="/config/empresa"> <h3 class="font-semibold text-gray-900">Empresa</h3> <p class="text-sm text-gray-500">Datos para PDFs y contacto.</p> </a> <a class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50" href="/config/numeracion"> <h3 class="font-semibold text-gray-900">Numeración</h3> <p class="text-sm text-gray-500">Prefijos y consecutivos.</p> </a> <a class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50" href="/config/impuestos"> <h3 class="font-semibold text-gray-900">Impuestos</h3> <p class="text-sm text-gray-500">IVA, retenciones, etc.</p> </a> <a class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50" href="/config/usuarios"> <h3 class="font-semibold text-gray-900">Usuarios y roles</h3> <p class="text-sm text-gray-500">Permisos (mock).</p> </a> <a class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50" href="/config/plantillas"> <h3 class="font-semibold text-gray-900">Plantillas</h3> <p class="text-sm text-gray-500">Textos predefinidos.</p> </a> <a class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50" href="/config/backup"> <h3 class="font-semibold text-gray-900">Backup</h3> <p class="text-sm text-gray-500">Exportar / restaurar JSON.</p> </a> </div> </div> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/index.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/index.astro";
const $$url = "/config";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
