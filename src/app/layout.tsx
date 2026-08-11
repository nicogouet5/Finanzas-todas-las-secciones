import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = { title: "Hub de Finanzas" };

const bodyFont = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body" });
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={bodyFont.variable}><a className="skip-link" href="#main">Saltar al contenido</a><SiteHeader />{children}</body></html>;
}
