import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_CmTjyfoz.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Pdf = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pdf;
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/cotizaciones");
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "PDF Cotizaci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PDFPreview", null, { "client:only": "react", "cotizacionId": id, "client:component-hydration": "only", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cotizaciones/PDFPreview", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/[id]/pdf.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cotizaciones/[id]/pdf.astro";
const $$url = "/cotizaciones/[id]/pdf";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pdf,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
