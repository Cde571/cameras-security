import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_CmTjyfoz.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "404 - No encontrado" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mx-auto max-w-3xl px-4 py-10"> <h1 class="text-3xl font-bold">404</h1> <p class="mt-2 text-slate-300">No encontramos la página que estás buscando.</p> <div class="mt-6 flex gap-3"> <a class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700" href="/dashboard">Ir al dashboard</a> <a class="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700" href="/">Inicio</a> </div> </section> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/404.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
