"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div
        className="card p-10 text-center max-w-md w-full"
        style={{ borderColor: "rgba(239,68,68,0.3)" }}
      >
        <AlertTriangle
          size={44}
          className="mx-auto mb-4"
          style={{ color: "#ef4444" }}
        />
        <h2
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: "1.3rem",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          Algo salió mal
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            marginBottom: "24px",
          }}
        >
          {error.message || "Error inesperado al cargar los datos de gasolineras."}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2"
          style={{
            background: "var(--accent-dim)",
            border: "1px solid rgba(245,149,0,0.3)",
            color: "var(--accent)",
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            margin: "0 auto",
            display: "flex",
          }}
        >
          <RefreshCw size={14} />
          Reintentar
        </button>
      </div>
    </main>
  );
}
