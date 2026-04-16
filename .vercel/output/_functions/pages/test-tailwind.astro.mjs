import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DCJG7FNs.mjs';
export { renderers } from '../renderers.mjs';

const $$TestTailwind = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test Tailwind" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-10"> <div class="bg-red-500 text-white p-6 rounded-xl font-bold">
Si esto NO se ve rojo, Tailwind no está cargando.
</div> </div> ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/test-tailwind.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/test-tailwind.astro";
const $$url = "/test-tailwind";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestTailwind,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
