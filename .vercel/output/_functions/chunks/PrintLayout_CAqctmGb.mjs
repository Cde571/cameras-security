import { e as createComponent, f as createAstro, n as renderHead, l as renderSlot, r as renderTemplate } from './astro/server_BUC8yk9S.mjs';
import 'piccolore';
import 'clsx';
/* empty css                       */

const $$Astro = createAstro();
const $$PrintLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PrintLayout;
  const { title = "Documento" } = Astro2.props;
  return renderTemplate`<html lang="es" data-astro-cid-6n35zacg> <head><meta charset="UTF-8"><title>${title}</title>${renderHead()}</head> <body data-astro-cid-6n35zacg> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/layouts/PrintLayout.astro", void 0);

export { $$PrintLayout as $ };
