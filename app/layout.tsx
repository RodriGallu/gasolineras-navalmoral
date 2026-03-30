import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// ⚠️ REEMPLAZA G-XXXXXXXXXX con tu ID real de Google Analytics
const GA_ID = "G-XXXXXXXXXX";

export const metadata: Metadata = {
  title: "Gasolineras más baratas | Navalmoral de la Mata",
  description:
    "Precios actualizados de gasolina y diésel en Navalmoral de la Mata (Cáceres). Datos en tiempo real del Ministerio de Industria de España.",
  keywords: ["gasolineras", "Navalmoral de la Mata", "gasolina", "diesel", "Cáceres", "precio carburante"],
  openGraph: {
    title: "Gasolineras más baratas en Navalmoral de la Mata",
    description: "Precios en tiempo real de gasolina y diésel",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
