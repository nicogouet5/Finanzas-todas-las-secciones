import Link from "next/link";
import { AsciiBackground } from "@/components/ascii-intro";
import { ContentIcon } from "@/components/content-icon";

export default function Home() {
  return <><AsciiBackground /><main id="main" className="page home"><p className="eyebrow">Universidad del Desarrollo</p><h1>Hub de Finanzas</h1><p className="lede">Materiales de estudio, visores y descargas para tus ramos.</p><section className="course-grid" aria-label="Ramos"><Link className="course-card" href="/ramos/finanzas"><span>Ramo</span><h2 className="course-card__title"><ContentIcon kind="course" />Finanzas</h2><p>Administración de caja y certámenes.</p></Link><Link className="course-card" href="/ramos/finanzas-corporativas"><span>Ramo</span><h2 className="course-card__title"><ContentIcon kind="course" />Finanzas Corporativas</h2><p>Espacio listo para próximos materiales.</p></Link></section></main></>;
}
