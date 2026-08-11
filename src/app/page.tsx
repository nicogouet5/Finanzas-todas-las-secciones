import Link from "next/link";

export default function Home() {
  return <main id="main" className="page home"><p className="eyebrow">Universidad del Desarrollo</p><h1>Hub de Finanzas</h1><p className="lede">Materiales de estudio, visores y descargas para tus ramos.</p><section className="course-grid" aria-label="Ramos"><Link className="course-card" href="/ramos/finanzas"><span>Ramo</span><h2>Finanzas</h2><p>Administración de caja y certámenes.</p></Link><Link className="course-card" href="/ramos/finanzas-corporativas"><span>Ramo</span><h2>Finanzas Corporativas</h2><p>Espacio listo para próximos materiales.</p></Link></section></main>;
}
