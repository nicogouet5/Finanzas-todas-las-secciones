import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="page"><h1>Material no encontrado</h1><p>La ruta no existe o ya no está disponible.</p><Link className="button" href="/">Volver al inicio</Link></main>;
}
