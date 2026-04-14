import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../chunks/MainLayout_CmTjyfoz.mjs';
import { C as ClienteForm } from '../../chunks/ClienteForm_B6iRvpKQ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Nuevo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Crear Cliente - Sistema de Cotizaciones" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ClienteForm", ClienteForm, { "client:load": true, "mode": "create", "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/clientes/ClienteForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/nuevo.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/clientes/nuevo.astro";
const $$url = "/clientes/nuevo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nuevo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
