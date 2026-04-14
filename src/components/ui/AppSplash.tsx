import React, { useEffect, useMemo, useState } from "react";

const LOGO_CANDIDATES = [
  "/logo-omnivision.png",
  "/f0fe1d83-bed3-4038-8e4d-c491e4ce43fd-removebg-preview.png",
  "/image-removebg-preview.png",
];

const SPLASH_FLAG_KEY = "coti_show_login_splash";

export default function AppSplash() {
  const [shouldRender, setShouldRender] = useState(false);
  const [hide, setHide] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);

  const currentLogo = useMemo(() => {
    return LOGO_CANDIDATES[logoIndex] || LOGO_CANDIDATES[0];
  }, [logoIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldShow = sessionStorage.getItem(SPLASH_FLAG_KEY) === "1";
    if (!shouldShow) return;

    sessionStorage.removeItem(SPLASH_FLAG_KEY);
    setShouldRender(true);

    const hideTimer = window.setTimeout(() => {
      setHide(true);
    }, 950);

    const removeTimer = window.setTimeout(() => {
      setShouldRender(false);
    }, 1600);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-all duration-700 ease-out",
        hide ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div
        className={[
          "flex flex-col items-center justify-center transition-all duration-700 ease-out",
          hide ? "scale-110 opacity-0" : "scale-100 opacity-100",
        ].join(" ")}
      >
        <div className="relative flex h-36 w-36 items-center justify-center">
          <img
            src={currentLogo}
            alt="Logo Omnivisión"
            className="h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
            loading="eager"
            onError={() => {
              if (logoIndex < LOGO_CANDIDATES.length - 1) {
                setLogoIndex((prev) => prev + 1);
              }
            }}
          />
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Omnivisión
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Sistema de cotizaciones
          </p>
        </div>

        <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
          <div className="app-splash-bar h-full w-full rounded-full bg-blue-600"></div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}
