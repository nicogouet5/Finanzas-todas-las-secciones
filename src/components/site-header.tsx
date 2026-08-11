import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Hub de Finanzas, inicio"><Image className="brand-logo" src="/udd-logo-white.png" width={3018} height={1061} priority alt="Universidad del Desarrollo" /></Link>
      <nav aria-label="Principal"><Link href="/">Materiales</Link><Link href="/admin">Administración</Link></nav>
    </header>
  );
}
