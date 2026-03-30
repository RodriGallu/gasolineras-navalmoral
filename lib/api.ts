import { ApiResponse, GasStation, RawEstacion } from "@/types";

const API_URL =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

function parsePrice(raw: string | undefined | null): number | null {
  if (!raw || raw.trim() === "") return null;
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

function getGasoilPrice(raw: RawEstacion): number | null {
  // Probamos todas las variantes posibles del campo gasóleo/diésel
  const candidates = [
    raw["Precio Gasoleo A"],
    (raw as Record<string, string>)["Precio Gas\u00f3leo A"],
    raw["Precio Gasoil A"],
    (raw as Record<string, string>)["Precio Di\u00e9sel"],
    (raw as Record<string, string>)["Precio Diesel"],
  ];
  for (const c of candidates) {
    const p = parsePrice(c);
    if (p !== null) return p;
  }
  return null;
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
      gasolina98: parsePrice(raw["Precio Gasolina 98 E5"]),
      diesel: getGasoilPrice(raw),
      dieselPremium:
        parsePrice((raw as Record<string, string>)["Precio Gasoleo Premium"]) ??
        parsePrice((raw as Record<string, string>)["Precio Gas\u00f3leo Premium"]) ??
        parsePrice((raw as Record<string, string>)["Precio Gasoil Premium"]) ??
        null,
    },
  };
}

export interface FetchResult {
  stations: GasStation[];
  fecha: string;
  error: string | null;
  municipality: string;
  rawSample?: Record<string, string>;
}

export async function fetchGasStations(
  municipality: string = "NAVALMORAL DE LA MATA",
  province?: string
): Promise<FetchResult> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    const data: ApiResponse = await res.json();

    if (data.ResultadoConsulta !== "OK")
      throw new Error("La API no devolvió un resultado satisfactorio.");

    const municipioUpper = municipality.toUpperCase().trim();
    const provinciaUpper = province?.toUpperCase().trim();

    const filtered = data.ListaEESSPrecio.filter((s) => {
      const matchMunicipio = s["Municipio"].toUpperCase().trim() === municipioUpper;
      const matchProvincia = provinciaUpper
        ? s["Provincia"].toUpperCase().trim() === provinciaUpper
        : true;
      return matchMunicipio && matchProvincia;
    });

    const stations = filtered.map(processStation);

    const withGasolina = stations.filter((s) => s.prices.gasolina95 !== null);
    const withDiesel = stations.filter((s) => s.prices.diesel !== null);

    const minGasolina =
      withGasolina.length > 0
        ? Math.min(...withGasolina.map((s) => s.prices.gasolina95!))
        : null;
    const minDiesel =
      withDiesel.length > 0
        ? Math.min(...withDiesel.map((s) => s.prices.diesel!))
        : null;

    const enriched = stations.map((s) => ({
      ...s,
      isCheapestGasolina: minGasolina !== null && s.prices.gasolina95 === minGasolina,
      isCheapestDiesel: minDiesel !== null && s.prices.diesel === minDiesel,
      diffGasolina:
        minGasolina !== null && s.prices.gasolina95 !== null
          ? parseFloat((s.prices.gasolina95 - minGasolina).toFixed(3))
          : undefined,
      diffDiesel:
        minDiesel !== null && s.prices.diesel !== null
          ? parseFloat((s.prices.diesel - minDiesel).toFixed(3))
          : undefined,
    }));

    // Muestra los campos reales del primer resultado para debug
    const rawSample = filtered[0] as unknown as Record<string, string> | undefined;

    return {
      stations: enriched,
      fecha: data.Fecha,
      error: null,
      municipality,
      rawSample,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al cargar datos.";
    return { stations: [], fecha: "", error: message, municipality };
  }
}
