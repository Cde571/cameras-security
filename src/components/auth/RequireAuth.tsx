import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/services/authLocalService";

function isPublicPath(pathname: string) {
  return pathname.startsWith("/auth/login") || pathname.startsWith("/api/");
}

function canAccess(pathname: string, role?: string) {
  if (!role) return false;
  if (pathname.startsWith("/config")) return role === "admin";
  return true;
}

export default function RequireAuth() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const pathname = window.location.pathname || "/";
    if (isPublicPath(pathname)) {
      setChecking(false);
      return;
    }

    const current = getCurrentUser();

    if (!current?.id) {
      const next = encodeURIComponent(pathname + window.location.search);
      window.location.replace(`/auth/login?next=${next}`);
      return;
    }

    if (!canAccess(pathname, current.role)) {
      window.location.replace("/");
      return;
    }

    setChecking(false);
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
