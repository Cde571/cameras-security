import React, { useEffect, useMemo, useState } from "react";
import { Lock, Mail, LogIn, ShieldCheck } from "lucide-react";
import { getSession, login, listAuthUsers } from "../../lib/services/authLocalService";

export default function LoginForm() {
  const [email, setEmail] = useState("admin@empresa.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const demoUsers = useMemo(() => {
    if (typeof window === "undefined") return [];
    return listAuthUsers().slice(0, 3);
  }, []);

  useEffect(() => {
    const session = getSession();
    if (session?.user?.id) {
      window.location.href = "/";
      return;
    }
    setChecking(false);
  }, []);

  const canSubmit = useMemo(() => {
    return email.trim().length >= 5 && password.trim().length >= 3 && !loading;
  }, [email, password, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      login(email, password);
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
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-gray-500">
            Acceso según usuarios y roles configurados en el sistema.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
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
                className="w-full text-sm outline-none"
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
                className="w-full text-sm outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-white ${
              canSubmit ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-blue-300"
            }`}
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
            <p className="mb-2 font-semibold text-gray-700">Usuarios demo actuales</p>
            <div className="space-y-1">
              {demoUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setEmail(u.email);
                    setPassword(u.password);
                  }}
                  className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left hover:border-blue-200 hover:bg-blue-50"
                >
                  <span>
                    <span className="font-medium text-gray-800">{u.email}</span>
                    <span className="ml-2 uppercase text-[10px] text-gray-500">{u.rol}</span>
                  </span>
                  <span className="text-gray-500">{u.password}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
