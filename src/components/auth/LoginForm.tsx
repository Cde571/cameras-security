import React, { useEffect, useMemo, useState } from "react";
import { Lock, Mail, LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("admin@empresa.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Si ya hay cookie de sesión (httpOnly), preguntamos al server.
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" });
        if (res.ok) {
          window.location.href = "/";
          return;
        }
      } catch {
        // ignore
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const canSubmit = useMemo(() => {
    return email.trim().length >= 5 && password.trim().length >= 3 && !loading;
  }, [email, password, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? "Error al iniciar sesión");

      window.location.href = "/";
    } catch (err: any) {
      setError(err?.message ?? "Error al iniciar sesión");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistema de cotizaciones • Acceso seguro
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Email</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full outline-none text-sm"
                placeholder="admin@empresa.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Contraseña</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full outline-none text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white ${
              canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="text-xs text-gray-500 pt-2">
            Demo: <b>admin@empresa.com</b> / <b>admin123</b>
          </div>
        </form>
      </div>
    </div>
  );
}
