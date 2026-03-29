// Raw API response types from Ministerio de Industria
export interface RawEstacion {
  "C.P.": string;
  Dirección: string;
  Horario: string;
  Latitud: string;
  "Localidad": string;
  "Longitud (WGS84)": string;
  Margen: string;
  Municipio: string;
  "PrecioProducto": string;
  Provincia: string;
  Remisión: string;
  Rótulo: string;
  "Tipo Venta": string;
  "% BioEtanol": string;
  "% Éster metílico": string;
  "IDEESS": string;
  "IDMunicipio": string;
  "IDProvincia": string;
  "IDCCAA": string;
  "Precio Gasolina 95 E10"?: string;
  "Precio Gasolina 95 E5"?: string;
  "Precio Gasolina 95 E5 Premium"?: string;
  "Precio Gasolina 98 E10"?: string;
  "Precio Gasolina 98 E5"?: string;
  "Precio Gasoil A"?: string;
  "Precio Gasoil B"?: string;
  "Precio Gasoil Premium"?: string;
  "Precio Hidrogeno"?: string;
  "Precio Bioetanol"?: string;
  "Precio Biodiésel"?: string;
  "Precio Gas Natural Comprimido"?: string;
  "Precio Gas Natural Licuado"?: string;
  "Precio Gases licuados del petróleo"?: string;
}

export interface ApiResponse {
  Fecha: string;
  ListaEESSPrecio: RawEstacion[];
  ResultadoConsulta: string;
}

// Processed station type for the UI
export interface GasStation {
  id: string;
  name: string;
  address: string;
  municipality: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  prices: {
    gasolina95: number | null;
    gasoilA: number | null;
    gasolina98: number | null;
    gasoilPremium: number | null;
  };
  schedule: string;
  isCheapestGasolina?: boolean;
  isCheapestGasoil?: boolean;
  diffGasolina?: number;
  diffGasoil?: number;
}

export type SortBy = "gasolina95" | "gasoilA";
