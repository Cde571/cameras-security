import { d as defineMiddleware, s as sequence } from './chunks/index_CikN2vgN.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BvGOtmFA.mjs';
import 'piccolore';
import './chunks/astro/server_BUC8yk9S.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (ctx, next) => {
  try {
    ctx.cookies.delete("session", { path: "/" });
  } catch {
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
