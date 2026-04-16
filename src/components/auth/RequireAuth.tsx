import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../lib/repositories/authRepo";

function isPublicPath(pathname: string) {
  return pathname.startsWith("/auth/login") || pathname.startsWith("/api/");
}

export default function RequireAuth() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const pathname = window.location.pathname || "/";

      if (isPublicPath(pathname)) {
        if (mounted) setChecking(false);
        return;
      }

      const user = await fetchCurrentUser();

      if (!user?.id) {
        const next = encodeURIComponent(pathname + window.location.search);
        window.location.replace(`/auth/login?next=${next}`);
        return;
      }

      if (mounted) setChecking(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!checking) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-gray-600">Validando acceso...</p>
      </div>
    </div>
  );
}

