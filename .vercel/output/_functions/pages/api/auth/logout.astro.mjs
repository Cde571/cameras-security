export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ cookies, redirect }) => {
  cookies.delete("session", { path: "/" });
  return redirect("/auth/login", 302);
};
const GET = async ({ cookies, redirect }) => {
  cookies.delete("session", { path: "/" });
  return redirect("/auth/login", 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
