import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as t}from"./index.WFquGv8Z.js";const o=["/logo-omnivision.png","/f0fe1d83-bed3-4038-8e4d-c491e4ce43fd-removebg-preview.png","/image-removebg-preview.png"],a="coti_show_login_splash";function x(){const[l,i]=t.useState(!1),[n,c]=t.useState(!1),[s,d]=t.useState(0),m=t.useMemo(()=>o[s]||o[0],[s]);return t.useEffect(()=>{if(typeof window>"u"||!(sessionStorage.getItem(a)==="1"))return;sessionStorage.removeItem(a),i(!0);const u=window.setTimeout(()=>{c(!0)},950),f=window.setTimeout(()=>{i(!1)},1600);return()=>{window.clearTimeout(u),window.clearTimeout(f)}},[]),l?e.jsxs("div",{className:["fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-all duration-700 ease-out",n?"pointer-events-none opacity-0":"opacity-100"].join(" "),children:[e.jsxs("div",{className:["flex flex-col items-center justify-center transition-all duration-700 ease-out",n?"scale-110 opacity-0":"scale-100 opacity-100"].join(" "),children:[e.jsx("div",{className:"relative flex h-36 w-36 items-center justify-center",children:e.jsx("img",{src:m,alt:"Logo Omnivisión",className:"h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)]",loading:"eager",onError:()=>{s<o.length-1&&d(r=>r+1)}})}),e.jsxs("div",{className:"mt-5 text-center",children:[e.jsx("h1",{className:"text-2xl font-extrabold tracking-tight text-slate-900",children:"Omnivisión"}),e.jsx("p",{className:"mt-1 text-sm font-medium tracking-wide text-slate-500",children:"Sistema de cotizaciones"})]}),e.jsx("div",{className:"mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200",children:e.jsx("div",{className:"app-splash-bar h-full w-full rounded-full bg-blue-600"})})]}),e.jsx("style",{children:`
        .app-splash-bar {
          transform-origin: left center;
          animation: splashProgress 1.2s ease-out forwards;
        }

        @keyframes splashProgress {
          from {
            transform: scaleX(0);
            opacity: 0.8;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      `})]}):null}export{x as default};
