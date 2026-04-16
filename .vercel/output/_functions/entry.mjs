import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C4jILRWj.mjs';
import { manifest } from './manifest_Cf7fOjTG.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/actas/nueva.astro.mjs');
const _page3 = () => import('./pages/actas/_id_/pdf.astro.mjs');
const _page4 = () => import('./pages/actas/_id_.astro.mjs');
const _page5 = () => import('./pages/actas.astro.mjs');
const _page6 = () => import('./pages/api/auth/login.astro.mjs');
const _page7 = () => import('./pages/api/auth/logout.astro.mjs');
const _page8 = () => import('./pages/api/auth/me.astro.mjs');
const _page9 = () => import('./pages/api/pdf/cotizacion.astro.mjs');
const _page10 = () => import('./pages/auth/login.astro.mjs');
const _page11 = () => import('./pages/clientes/exportar.astro.mjs');
const _page12 = () => import('./pages/clientes/nuevo.astro.mjs');
const _page13 = () => import('./pages/clientes/_id_/editar.astro.mjs');
const _page14 = () => import('./pages/clientes/_id_/historial.astro.mjs');
const _page15 = () => import('./pages/clientes/_id_.astro.mjs');
const _page16 = () => import('./pages/clientes.astro.mjs');
const _page17 = () => import('./pages/cobros/nueva.astro.mjs');
const _page18 = () => import('./pages/cobros/_id_/pdf.astro.mjs');
const _page19 = () => import('./pages/cobros/_id_.astro.mjs');
const _page20 = () => import('./pages/cobros.astro.mjs');
const _page21 = () => import('./pages/config/auditoria.astro.mjs');
const _page22 = () => import('./pages/config/backup.astro.mjs');
const _page23 = () => import('./pages/config/empresa.astro.mjs');
const _page24 = () => import('./pages/config/impuestos.astro.mjs');
const _page25 = () => import('./pages/config/numeracion.astro.mjs');
const _page26 = () => import('./pages/config/plantillas.astro.mjs');
const _page27 = () => import('./pages/config/usuarios.astro.mjs');
const _page28 = () => import('./pages/config.astro.mjs');
const _page29 = () => import('./pages/cotizaciones/nueva.astro.mjs');
const _page30 = () => import('./pages/cotizaciones/plantillas.astro.mjs');
const _page31 = () => import('./pages/cotizaciones/_id_/editar.astro.mjs');
const _page32 = () => import('./pages/cotizaciones/_id_/pdf.astro.mjs');
const _page33 = () => import('./pages/cotizaciones/_id_/versionar.astro.mjs');
const _page34 = () => import('./pages/cotizaciones/_id_.astro.mjs');
const _page35 = () => import('./pages/cotizaciones.astro.mjs');
const _page36 = () => import('./pages/dashboard.astro.mjs');
const _page37 = () => import('./pages/ordenes/checklists.astro.mjs');
const _page38 = () => import('./pages/ordenes/nueva.astro.mjs');
const _page39 = () => import('./pages/ordenes/_id_/editar.astro.mjs');
const _page40 = () => import('./pages/ordenes/_id_/evidencias.astro.mjs');
const _page41 = () => import('./pages/ordenes/_id_.astro.mjs');
const _page42 = () => import('./pages/ordenes.astro.mjs');
const _page43 = () => import('./pages/pagos/cartera.astro.mjs');
const _page44 = () => import('./pages/pagos/estado-cuenta/_clienteid_.astro.mjs');
const _page45 = () => import('./pages/pagos/registrar.astro.mjs');
const _page46 = () => import('./pages/pagos.astro.mjs');
const _page47 = () => import('./pages/productos/categorias.astro.mjs');
const _page48 = () => import('./pages/productos/importar.astro.mjs');
const _page49 = () => import('./pages/productos/kits/nuevo.astro.mjs');
const _page50 = () => import('./pages/productos/kits.astro.mjs');
const _page51 = () => import('./pages/productos/nuevo.astro.mjs');
const _page52 = () => import('./pages/productos/_id_/editar.astro.mjs');
const _page53 = () => import('./pages/productos.astro.mjs');
const _page54 = () => import('./pages/reportes/clientes.astro.mjs');
const _page55 = () => import('./pages/reportes/margenes.astro.mjs');
const _page56 = () => import('./pages/reportes/productos.astro.mjs');
const _page57 = () => import('./pages/reportes/ventas.astro.mjs');
const _page58 = () => import('./pages/reportes.astro.mjs');
const _page59 = () => import('./pages/test-tailwind.astro.mjs');
const _page60 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/actas/nueva.astro", _page2],
    ["src/pages/actas/[id]/pdf.astro", _page3],
    ["src/pages/actas/[id].astro", _page4],
    ["src/pages/actas/index.astro", _page5],
    ["src/pages/api/auth/login.ts", _page6],
    ["src/pages/api/auth/logout.ts", _page7],
    ["src/pages/api/auth/me.ts", _page8],
    ["src/pages/api/pdf/cotizacion.ts", _page9],
    ["src/pages/auth/login.astro", _page10],
    ["src/pages/clientes/exportar.astro", _page11],
    ["src/pages/clientes/nuevo.astro", _page12],
    ["src/pages/clientes/[id]/editar.astro", _page13],
    ["src/pages/clientes/[id]/historial.astro", _page14],
    ["src/pages/clientes/[id].astro", _page15],
    ["src/pages/clientes/index.astro", _page16],
    ["src/pages/cobros/nueva.astro", _page17],
    ["src/pages/cobros/[id]/pdf.astro", _page18],
    ["src/pages/cobros/[id].astro", _page19],
    ["src/pages/cobros/index.astro", _page20],
    ["src/pages/config/auditoria.astro", _page21],
    ["src/pages/config/backup.astro", _page22],
    ["src/pages/config/empresa.astro", _page23],
    ["src/pages/config/impuestos.astro", _page24],
    ["src/pages/config/numeracion.astro", _page25],
    ["src/pages/config/plantillas.astro", _page26],
    ["src/pages/config/usuarios.astro", _page27],
    ["src/pages/config/index.astro", _page28],
    ["src/pages/cotizaciones/nueva.astro", _page29],
    ["src/pages/cotizaciones/plantillas.astro", _page30],
    ["src/pages/cotizaciones/[id]/editar.astro", _page31],
    ["src/pages/cotizaciones/[id]/pdf.astro", _page32],
    ["src/pages/cotizaciones/[id]/versionar.astro", _page33],
    ["src/pages/cotizaciones/[id].astro", _page34],
    ["src/pages/cotizaciones/index.astro", _page35],
    ["src/pages/dashboard.astro", _page36],
    ["src/pages/ordenes/checklists.astro", _page37],
    ["src/pages/ordenes/nueva.astro", _page38],
    ["src/pages/ordenes/[id]/editar.astro", _page39],
    ["src/pages/ordenes/[id]/evidencias.astro", _page40],
    ["src/pages/ordenes/[id].astro", _page41],
    ["src/pages/ordenes/index.astro", _page42],
    ["src/pages/pagos/cartera.astro", _page43],
    ["src/pages/pagos/estado-cuenta/[clienteId].astro", _page44],
    ["src/pages/pagos/registrar.astro", _page45],
    ["src/pages/pagos/index.astro", _page46],
    ["src/pages/productos/categorias.astro", _page47],
    ["src/pages/productos/importar.astro", _page48],
    ["src/pages/productos/kits/nuevo.astro", _page49],
    ["src/pages/productos/kits.astro", _page50],
    ["src/pages/productos/nuevo.astro", _page51],
    ["src/pages/productos/[id]/editar.astro", _page52],
    ["src/pages/productos/index.astro", _page53],
    ["src/pages/reportes/clientes.astro", _page54],
    ["src/pages/reportes/margenes.astro", _page55],
    ["src/pages/reportes/productos.astro", _page56],
    ["src/pages/reportes/ventas.astro", _page57],
    ["src/pages/reportes/index.astro", _page58],
    ["src/pages/test-tailwind.astro", _page59],
    ["src/pages/index.astro", _page60]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "0725d060-fd1e-4470-9d06-cf239946a765",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
