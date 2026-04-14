import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
export { renderers } from '../../renderers.mjs';

const $$Auditoria = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Auditor\xEDa" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="space-y-4"> <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"> <h1 class="text-2xl font-semibold text-gray-900">Auditoría</h1> <p class="mt-2 text-sm text-gray-600">
Módulo base de auditoría listo. Aquí podrás listar accesos, acciones relevantes,
        cambios de configuración y eventos administrativos.
</p> </div> <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
Pendiente conectar a base de datos real / API de auditoría.
</div> </section> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/auditoria.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/config/auditoria.astro";
const $$url = "/config/auditoria";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Auditoria,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
