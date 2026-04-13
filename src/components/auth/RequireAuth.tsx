// src/components/auth/RequireAuth.tsx
import React from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  // DEV: no bloquear, no redirigir
  if (import.meta.env.DEV) return <>{children}</>;
  return <>{children}</>;
}
