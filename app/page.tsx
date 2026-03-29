import { fetchGasStations } from "@/lib/api";
import GasStationsClient from "@/components/GasStationsClient";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ISR: revalidate every 30 minutes
export const revalidate = 1800;

interface PageProps {
  searchParams: { municipio?: string; provincia?: string };
}

export default async function Home({ searchParams }: PageProps) {
  const municipio = searchParams.municipio ?? "NAVALMORAL DE LA MATA";
  const provincia = searchParams.provincia ?? "CÁCERES";

  const { stations, fecha, error, municipality } = await fetchGasStations(
    municipio,
    provincia
  );

  if (error) {
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
            Error al cargar los datos
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
          <a
            href="/"
            className="flex items-center justify-center gap-2"
            style={{
              display: "inline-flex",
              background: "var(--accent-dim)",
              border: "1px solid rgba(245,149,0,0.3)",
              color: "var(--accent)",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} />
            Reintentar
          </a>
        </div>
      </main>
    );
  }

  return (
    <GasStationsClient
      initialStations={stations}
      fecha={fecha}
      municipality={municipality}
    />
  );
}
