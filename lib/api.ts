import { ApiResponse, GasStation, RawEstacion } from "@/types";

const API_URL =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

function parsePrice(raw: string | undefined | null): number | null {
  if (!raw || raw.trim() === "") return null;
  // Replace comma decimal separator with dot
  const normalized = raw.replace(",", ".");
  const value = parseFloat(normalized);
  return isNaN(value) ? null : value;
}

function parseCoord(raw: string): number | null {
  if (!raw || raw.trim() === "") return null;
  const normalized = raw.replace(",", ".");
  const value = parseFloat(normalized);
  return isNaN(value) ? null : value;
}

function processStation(raw: RawEstacion): GasStation {
  return {
    id: raw["IDEESS"],
    name: raw["Rótulo"] || "Sin nombre",
    address: raw["Dirección"] || "",
    municipality: raw["Municipio"] || "",
    province: raw["Provincia"] || "",
    postalCode: raw["C.P."] || "",
    latitude: parseCoord(raw["Latitud"]),
    longitude: parseCoord(raw["Longitud (WGS84)"]),
    schedule: raw["Horario"] || "",
    prices: {
      gasolina95: parsePrice(raw["Precio Gasolina 95 E5"]),
      gasoilA: parsePrice(raw["Precio Gasoil A"]),
      gasolina98: parsePrice(raw["Precio Gasolina 98 E5"]),
      gasoilPremium: parsePrice(raw["Precio Gasoil Premium"]),
    },
  };
}

export interface FetchResult {
  stations: GasStation[];
  fecha: string;
  error: string | null;
  municipality: string;
}

export async function fetchGasStations(
  municipality: string = "NAVALMORAL DE LA MATA",
  province?: string
): Promise<FetchResult> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 1800 }, // Cache 30 minutes
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data: ApiResponse = await res.json();

    if (data.ResultadoConsulta !== "OK") {
      throw new Error("La API no devolvió un resultado satisfactorio.");
    }

    // Filter by municipality (and optionally province)
    const municipioUpper = municipality.toUpperCase().trim();
    const provinciaUpper = province?.toUpperCase().trim();

    const filtered = data.ListaEESSPrecio.filter((s) => {
      const matchMunicipio =
        s["Municipio"].toUpperCase().trim() === municipioUpper;
      const matchProvincia = provinciaUpper
        ? s["Provincia"].toUpperCase().trim() === provinciaUpper
        : true;
      return matchMunicipio && matchProvincia;
    });

    const stations = filtered.map(processStation);

    // Find cheapest
    const withGasolina = stations.filter((s) => s.prices.gasolina95 !== null);
    const withGasoil = stations.filter((s) => s.prices.gasoilA !== null);

    const minGasolina =
      withGasolina.length > 0
        ? Math.min(...withGasolina.map((s) => s.prices.gasolina95!))
        : null;
    const minGasoil =
      withGasoil.length > 0
        ? Math.min(...withGasoil.map((s) => s.prices.gasoilA!))
        : null;

    const enriched = stations.map((s) => ({
      ...s,
      isCheapestGasolina:
        minGasolina !== null && s.prices.gasolina95 === minGasolina,
      isCheapestGasoil: minGasoil !== null && s.prices.gasoilA === minGasoil,
      diffGasolina:
        minGasolina !== null && s.prices.gasolina95 !== null
          ? parseFloat((s.prices.gasolina95 - minGasolina).toFixed(3))
          : undefined,
      diffGasoil:
        minGasoil !== null && s.prices.gasoilA !== null
          ? parseFloat((s.prices.gasoilA - minGasoil).toFixed(3))
          : undefined,
    }));

    return {
      stations: enriched,
      fecha: data.Fecha,
      error: null,
      municipality,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al cargar datos.";
    return { stations: [], fecha: "", error: message, municipality };
  }
}
