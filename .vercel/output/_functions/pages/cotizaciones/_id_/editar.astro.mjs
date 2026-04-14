import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_CmTjyfoz.mjs';
import { V as VersionControl } from '../../../chunks/VersionControl_BXjUJjua.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Editar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Editar;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Versionar cotizaci\xF3n ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "VersionControl", VersionControl, { "client:load": true, "cotizacionId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cotizaciones/VersionControl", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/[id]/editar.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/[id]/editar.astro";
const $$url = "/cotizaciones/[id]/editar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Editar,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
