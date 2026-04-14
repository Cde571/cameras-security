import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_CmTjyfoz.mjs';
import { P as ProductoForm } from '../../../chunks/ProductoForm_D-ZRg1NJ.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Editar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Editar;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Editar producto ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductoForm", ProductoForm, { "client:load": true, "mode": "edit", "productoId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/productos/ProductoForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/[id]/editar.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/productos/[id]/editar.astro";
const $$url = "/productos/[id]/editar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Editar,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
