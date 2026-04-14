import React, { useEffect, useRef } from "react";

const KEYS = [
  "coti_clientes_v1",
  "coti_cotizaciones_v1",
  "coti_ordenes_v1",
  "coti_cobros_v1",
  "coti_pagos_v1",
];

function readJson(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function buildPayload() {
  return {
    clientes: readJson("coti_clientes_v1"),
    cotizaciones: readJson("coti_cotizaciones_v1"),
    ordenes: readJson("coti_ordenes_v1"),
    cobros: readJson("coti_cobros_v1"),
    pagos: readJson("coti_pagos_v1"),
  };
}

function buildSignature() {
  return KEYS.map((key) => localStorage.getItem(key) || "").join("||");
}

export default function LegacyDbSync() {
  const lastSignatureRef = useRef("");
  const inFlightRef = useRef(false);

  useEffect(() => {
    const sync = async () => {
      const signature = buildSignature();
      if (!signature) return;
      if (signature === lastSignatureRef.current) return;
      if (inFlightRef.current) return;

      inFlightRef.current = true;

      try {
        const payload = buildPayload();

        const res = await fetch("/api/sync/legacy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          lastSignatureRef.current = signature;
        }
      } catch (error) {
        console.error("[LegacyDbSync] sync error:", error);
      } finally {
        inFlightRef.current = false;
      }
    };

    sync();

    const interval = window.setInterval(sync, 2500);

    const onFocus = () => sync();
    const onVisibility = () => {
      if (document.visibilityState === "visible") sync();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
