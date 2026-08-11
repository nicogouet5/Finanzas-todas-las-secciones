import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Hub de Finanzas, inicio">UDD</Link>
      <nav aria-label="Principal"><Link href="/">Materiales</Link><Link href="/admin">Administración</Link></nav>
    </header>
  );
}
