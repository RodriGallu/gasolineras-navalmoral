"use client";

import { useState, useMemo } from "react";
import { GasStation, SortBy } from "@/types";
import {
  Search, Fuel, MapPin, ArrowUpDown, Clock,
  TrendingDown, Droplets, Zap, ChevronUp,
} from "lucide-react";

interface Props {
  initialStations: GasStation[];
  fecha: string;
  municipality: string;
}

function formatPrice(price: number | null): string {
  if (price === null) return "N/D";
  return price.toFixed(3).replace(".", ",") + " €";
}

function PriceDiff({ diff }: { diff: number | undefined }) {
  if (diff === undefined || diff === null) return null;
  if (diff === 0) return <span className="diff-neutral">⭐ Más barato</span>;
  return <span className="diff-up">+{diff.toFixed(3).replace(".", ",")} €</span>;
}

function StationCard({ station, rank, sortBy }: { station: GasStation; rank: number; sortBy: SortBy }) {
  const isBest = sortBy === "gasolina95" ? station.isCheapestGasolina : station.isCheapestDiesel;

  return (
    <div className={`card p-5 ${isBest ? "card-best" : ""}`}>
      <div className="rank-number absolute bottom-4 right-5 select-none pointer-events-none"
        style={{ fontSize: "3.5rem", opacity: 0.05, fontFamily: "var(--font-syne)", fontWeight: 800 }}>
        #{rank}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1.3 }}>
            {station.name}
          </h2>
          {isBest && (
            <span className="badge-best flex items-center gap-1">
              <TrendingDown size={9} /> Más barato
            </span>
          )}
        </div>
        <span className="text-xs shrink-0" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
          #{rank}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
        <MapPin size={13} className="mt-0.5 shrink-0" />
        <span className="leading-tight">{station.address}</span>
      </div>

      {/* Prices */}
      <div className="flex gap-5 flex-wrap">
        {/* Gasolina 95 */}
        <div>
          <div className="flex items-center gap-1 mb-1"
            style={{ color: "var(--text-secondary)", fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            <Zap size={11} className="icon-gasolina" /> Gasolina 95
          </div>
          <span className="price-tag" style={{ fontSize: "1.35rem", color: station.isCheapestGasolina ? "var(--green)" : "var(--text-primary)" }}>
            {formatPrice(station.prices.gasolina95)}
          </span>
          <div className="mt-0.5"><PriceDiff diff={station.diffGasolina} /></div>
        </div>

        <div style={{ width: "1px", background: "var(--border)", alignSelf: "stretch" }} />

        {/* Diésel */}
        <div>
          <div className="flex items-center gap-1 mb-1"
            style={{ color: "var(--text-secondary)", fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            <Droplets size={11} className="icon-gasoil" /> Diésel
          </div>
          <span className="price-tag" style={{ fontSize: "1.35rem", color: station.isCheapestDiesel ? "var(--green)" : "var(--text-primary)" }}>
            {formatPrice(station.prices.diesel)}
          </span>
          <div className="mt-0.5"><PriceDiff diff={station.diffDiesel} /></div>
        </div>

        {/* Gasolina 98 si disponible */}
        {station.prices.gasolina98 !== null && (
          <>
            <div style={{ width: "1px", background: "var(--border)", alignSelf: "stretch" }} />
            <div>
              <div className="flex items-center gap-1 mb-1"
                style={{ color: "var(--text-secondary)", fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                <Zap size={11} style={{ color: "#fbbf24" }} /> Gasolina 98
              </div>
              <span className="price-tag" style={{ fontSize: "1.35rem", color: "var(--text-primary)" }}>
                {formatPrice(station.prices.gasolina98)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Schedule */}
      {station.schedule && (
        <div className="flex items-center gap-1.5 mt-4 pt-4"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
          <Clock size={11} />
          <span>{station.schedule}</span>
        </div>
      )}
    </div>
  );
}

export default function GasStationsClient({ initialStations, fecha, municipality }: Props) {
  const [sortBy, setSortBy] = useState<SortBy>("gasolina95");
  const [search, setSearch] = useState("");

  const filteredAndSorted = useMemo(() => {
    let result = initialStations.filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
    });
    return [...result].sort((a, b) => {
      const priceA = sortBy === "gasolina95" ? a.prices.gasolina95 : a.prices.diesel;
      const priceB = sortBy === "gasolina95" ? b.prices.gasolina95 : b.prices.diesel;
      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return priceA - priceB;
    });
  }, [initialStations, sortBy, search]);

  const gasolinaPrecios = filteredAndSorted.map((s) => s.prices.gasolina95).filter((p): p is number => p !== null);
  const dieselPrecios = filteredAndSorted.map((s) => s.prices.diesel).filter((p): p is number => p !== null);

  const minGasolina = gasolinaPrecios.length > 0 ? Math.min(...gasolinaPrecios) : null;
  const minDiesel = dieselPrecios.length > 0 ? Math.min(...dieselPrecios) : null;
  const avgGasolina = gasolinaPrecios.length > 0 ? gasolinaPrecios.reduce((a, b) => a + b, 0) / gasolinaPrecios.length : null;
  const avgDiesel = dieselPrecios.length > 0 ? dieselPrecios.reduce((a, b) => a + b, 0) / dieselPrecios.length : null;

  return (
    <>
      <header className="pt-12 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="live-dot" />
            <span className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              Datos en tiempo real
            </span>
          </div>
          <h1 className="mb-3" style={{
            fontFamily: "var(--font-syne)", fontWeight: 800,
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)", lineHeight: 1.1,
            letterSpacing: "-0.02em", color: "var(--text-primary)",
          }}>
            Gasolineras más baratas en{" "}
            <span style={{ color: "var(--accent)" }}>
              {municipality.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")}
            </span>
          </h1>
          <p className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Clock size={14} /> Actualizado: {fecha}
            <span className="opacity-40">·</span>
            <Fuel size={14} /> {filteredAndSorted.length} gasolinera{filteredAndSorted.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      {/* Stats bar */}
      <div className="px-4 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="card p-4 flex flex-wrap gap-6" style={{ borderRadius: "14px" }}>
            {[
              { label: "Mínimo Gasolina 95", icon: <Zap size={10} className="icon-gasolina" />, value: minGasolina, color: "var(--green)" },
              { label: "Mínimo Diésel", icon: <Droplets size={10} className="icon-gasoil" />, value: minDiesel, color: "var(--green)" },
              { label: "Media Gasolina 95", icon: null, value: avgGasolina, color: "var(--text-primary)" },
              { label: "Media Diésel", icon: null, value: avgDiesel, color: "var(--text-primary)" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-6">
                <div>
                  <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    {stat.icon}{stat.label}
                  </div>
                  <span className="price-tag" style={{ fontSize: "1.1rem", color: stat.color }}>
                    {stat.value !== null ? formatPrice(stat.value) : "N/D"}
                  </span>
                </div>
                {i < arr.length - 1 && <div style={{ width: "1px", background: "var(--border)", height: "40px" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 mb-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
            <input type="text" placeholder="Buscar gasolinera..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="search-input" />
          </div>
          <div className="flex items-center gap-1"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "4px" }}>
            <button onClick={() => setSortBy("gasolina95")}
              className={`sort-btn flex items-center gap-1.5 ${sortBy === "gasolina95" ? "active" : ""}`}
              style={{ borderRadius: "8px", border: "none", padding: "6px 14px" }}>
              <Zap size={13} /> Gasolina
            </button>
            <button onClick={() => setSortBy("diesel")}
              className={`sort-btn flex items-center gap-1.5 ${sortBy === "diesel" ? "active" : ""}`}
              style={{ borderRadius: "8px", border: "none", padding: "6px 14px" }}>
              <Droplets size={13} /> Diésel
            </button>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
            <ArrowUpDown size={12} /><span>Ordenado por precio</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <main className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {filteredAndSorted.length === 0 ? (
            <div className="card p-12 text-center" style={{ color: "var(--text-secondary)" }}>
              <Fuel size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-1" style={{ fontFamily: "var(--font-syne)", fontWeight: 600 }}>No se encontraron gasolineras</p>
              <p className="text-sm">Prueba con otra búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-in">
              {filteredAndSorted.map((station, i) => (
                <StationCard key={station.id} station={station} rank={i + 1} sortBy={sortBy} />
              ))}
            </div>
          )}
        </div>
      </main>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ position: "fixed", bottom: "24px", right: "24px", width: "44px", height: "44px", borderRadius: "12px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease", zIndex: 50 }}
        title="Volver arriba">
        <ChevronUp size={18} />
      </button>

      <footer className="text-center py-6 px-4"
        style={{ borderTop: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
        <p>Datos del <a href="https://geoportalgasolineras.es" target="_blank" rel="noopener noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none" }}>Ministerio de Industria de España</a>. Actualización cada 30 min.</p>
      </footer>
    </>
  );
}
