import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// `metadataBase` es necesario para que la opengraph-image se resuelva como URL
// absoluta; sin ella Next usa http://localhost:3000 y el preview no carga al
// compartir el link. VERCEL_PROJECT_PRODUCTION_URL lo inyecta Vercel en build.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Hub de Finanzas",
  description: "Materiales de estudio, visores y descargas para tus ramos de Finanzas.",
  openGraph: {
    title: "Hub de Finanzas",
    description: "Materiales de estudio, visores y descargas para tus ramos de Finanzas.",
    locale: "es_CL",
    type: "website",
  },
};

const bodyFont = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body" });
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={bodyFont.variable}><a className="skip-link" href="#main">Saltar al contenido</a><SiteHeader />{children}</body></html>;
}
